import { test, expect } from "@playwright/test";
import { createEnquiryHandler, enquiryMail, type Enquiry } from "../src/lib/enquiry-server";

const enquiry: Enquiry = {
  name: "Alex Example", email: "alex@example.com", company: "Example Studio",
  package: "Website Build", services: "Website build, Website lead tracking",
  budget: "R30,000–R60,000", message: "A new website for our business.\nPlease get in touch.",
};
const origin = "https://monettic.com";
const requestFor = (body: unknown = enquiry, extra: Record<string, string> = {}) => new Request(`${origin}/api/enquiry/`, {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...extra }, body: JSON.stringify(body),
});

test("server waits for email acceptance and keeps the credential out of its response", async () => {
  const deliveries: Enquiry[] = [];
  let resolve!: () => void;
  const accepted = new Promise<void>(done => { resolve = done; });
  const handler = createEnquiryHandler(async (data, password) => {
    expect(password).toBe("onlyatestcredential");
    deliveries.push(data);
    await accepted;
  }, () => "only a test credential");
  let finished = false;
  const pending = handler(requestFor()).then(response => { finished = true; return response; });
  await expect.poll(() => deliveries.length).toBe(1);
  expect(finished).toBe(false);
  expect(deliveries[0]).toEqual(enquiry);
  resolve();
  const response = await pending;
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(await response.json()).toEqual({ success: true });
});

test("mail destination is fixed and HTML is escaped while reply-to uses the visitor", () => {
  const mail = enquiryMail({ ...enquiry, name: 'Alex <img src=x onerror="alert(1)">', message: "<script>alert(1)</script>\n& details" });
  expect(mail.to).toBe("eliseeweb@gmail.com");
  expect(mail.from.address).toBe("eliseeweb@gmail.com");
  expect(mail.replyTo.address).toBe("alex@example.com");
  expect(mail.html).not.toContain("<img");
  expect(mail.html).not.toContain("<script>");
  expect(mail.html).toContain("&lt;script&gt;");
  expect(mail.html).toContain("<br>&amp; details");
  expect(mail.disableFileAccess).toBe(true);
  expect(mail.disableUrlAccess).toBe(true);
  for (const value of Object.values(enquiry).slice(1, -1)) expect(mail.text).toContain(value);
});

test("unconfigured email and SMTP rejection never return success or expose secrets", async () => {
  let sent = 0;
  const missing = createEnquiryHandler(async () => { sent++; }, () => undefined);
  const missingResponse = await missing(requestFor());
  expect(missingResponse.status).toBe(503);
  expect((await missingResponse.json()).success).toBe(false);
  expect(sent).toBe(0);
  const rejected = createEnquiryHandler(async () => {
    throw Object.assign(new Error("private SMTP details"), { code: "EAUTH" });
  }, () => "test-credential");
  const rejectedResponse = await rejected(requestFor());
  expect(rejectedResponse.status).toBe(502);
  const body = await rejectedResponse.text();
  expect(body).not.toContain("private SMTP details");
  expect(body).not.toContain("test-credential");
  expect(JSON.parse(body).success).toBe(false);
});

test("both monettic domain variants can send enquiries", async () => {
  let sent = 0;
  const handler = createEnquiryHandler(async () => { sent++; }, () => "test-credential");
  for (const Origin of ["https://monettic.com", "https://www.monettic.com"]) {
    expect((await handler(requestFor(enquiry, { Origin }))).status).toBe(200);
  }
  expect(sent).toBe(2);
});

test("foreign or missing origins cannot send mail", async () => {
  let sent = 0;
  const handler = createEnquiryHandler(async () => { sent++; }, () => "test-credential");
  for (const Origin of ["https://another-site.example", "null", ""]) {
    expect((await handler(requestFor(enquiry, { Origin }))).status).toBe(403);
  }
  expect(sent).toBe(0);
});

test("invalid fields, address injection, honeypot and oversized bodies are rejected before delivery", async () => {
  let sent = 0;
  const handler = createEnquiryHandler(async () => { sent++; }, () => "test-credential");
  for (const body of [
    { ...enquiry, name: " " }, { ...enquiry, email: "not-an-email" },
    { ...enquiry, email: "one@example.com,two@example.com" },
    { ...enquiry, name: "Someone\r\nBcc: person@example.com" },
    { ...enquiry, email: ["one@example.com"] }, { ...enquiry, botcheck: "yes" },
    { ...enquiry, message: "x".repeat(3001) }, null,
  ]) expect((await handler(requestFor(body))).status).toBe(400);
  expect((await handler(requestFor({ ...enquiry, ignored: "x".repeat(17000) }))).status).toBe(413);
  expect((await handler(requestFor(enquiry, { "Content-Type": "text/plain" }))).status).toBe(415);
  const malformed = new Request(`${origin}/api/enquiry/`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "{broken" });
  expect((await handler(malformed)).status).toBe(400);
  expect(sent).toBe(0);
});

test("repeated submissions are throttled before an additional email is sent", async () => {
  let sent = 0;
  const handler = createEnquiryHandler(async () => { sent++; }, () => "test-credential");
  for (let i = 0; i < 5; i++) expect((await handler(requestFor())).status).toBe(200);
  const limited = await handler(requestFor());
  expect(limited.status).toBe(429);
  expect(limited.headers.get("retry-after")).toBe("600");
  expect(sent).toBe(5);
});

test("deployed Next endpoint rejects foreign origins without sending email", async ({ request }) => {
  const response = await request.post("/api/enquiry/", { headers: { Origin: "https://another-site.example" }, data: enquiry });
  expect(response.status()).toBe(403);
  expect((await response.json()).success).toBe(false);
});
