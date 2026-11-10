import { agency } from "./content";

export type Enquiry = {
  name: string;
  email: string;
  company: string;
  package: string;
  services: string;
  budget: string;
  message: string;
};

type Delivery = (enquiry: Enquiry, password: string) => Promise<void>;
const unavailable = "Message delivery is temporarily unavailable. Please try again shortly. Your details are still here.";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const maxBodyBytes = 16384;

class SubmissionError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function readPayload(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new SubmissionError(415, "Please submit your message using the website form.");
  }
  if (Number(request.headers.get("content-length")) > maxBodyBytes) throw new SubmissionError(413, "Your message is too long.");
  const reader = request.body?.getReader();
  if (!reader) throw new SubmissionError(400, "Please enter your enquiry details.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) {
        await reader.cancel();
        throw new SubmissionError(413, "Your message is too long.");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
  const parsed: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new SubmissionError(400, "Please check your enquiry details.");
  return parsed as Record<string, unknown>;
}

function validate(payload: Record<string, unknown>): Enquiry {
  if (payload.botcheck) throw new SubmissionError(400, "We couldn’t send this enquiry. Please try again.");
  function field(key: string, max: number, required = false, multiline = false) {
    const value = payload[key] ?? "";
    if (typeof value !== "string" || value.length > max || (!multiline && /[\r\n\x00-\x1f\x7f]/.test(value))) {
      throw new SubmissionError(400, "Please check your enquiry details and try again.");
    }
    const text = value.trim();
    if (required && !text) throw new SubmissionError(400, "Please enter your name, email address, and project details.");
    return text;
  }
  const email = field("email", 254, true);
  if (!/^[^\s<>(),;:@]+@[^\s<>(),;:@]+\.[^\s<>(),;:@]+$/.test(email)) {
    throw new SubmissionError(400, "Please enter a valid email address.");
  }
  return {
    name: field("name", 100, true), email, company: field("company", 150) || "Not provided",
    package: field("package", 100) || "Help me choose", services: field("services", 2000) || "I’d like your guidance",
    budget: field("budget", 100) || "Let’s discuss", message: field("message", 3000, true, true),
  };
}

function allowedOrigin(request: Request) {
  const origins = new Set(["https://monettic.com", "https://www.monettic.com", "https://concretetagency.com", "https://www.concretetagency.com"]);
  // Preview deployment addresses are supplied by Vercel, never by form input.
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (host) origins.add(`https://${host}`);
  }
  const requestUrl = new URL(request.url);
  if (!process.env.VERCEL && ["localhost", "127.0.0.1", "[::1]"].includes(requestUrl.hostname)) origins.add(requestUrl.origin);
  return origins.has(request.headers.get("origin") || "");
}

// Best-effort per-instance protection; Vercel Firewall can add a shared limit.
function createLimiter() {
  const attempts = new Map<string, { count: number; expires: number }>();
  return (request: Request) => {
    const now = Date.now();
    for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim().slice(0,64) || "local";
    let entry = attempts.get(ip);
    if (!entry) {
      if (attempts.size >= 1000) return false;
      entry = { count: 0, expires: now + 10 * 60 * 1000 };
      attempts.set(ip, entry);
    }
    return ++entry.count <= 5;
  };
}

export function createEnquiryHandler(deliver: Delivery, password = () => process.env.GMAIL_APP_PASSWORD) {
  const allowAttempt = createLimiter();
  return async (request: Request) => {
    if (!allowedOrigin(request)) return Response.json({ success: false, message: "Please send your message from the monettic website." }, { status: 403, headers });
    let enquiry: Enquiry;
    try { enquiry = validate(await readPayload(request)); }
    catch (error) {
      return Response.json({ success: false, message: error instanceof SubmissionError ? error.message : "Please check your enquiry details and try again." }, { status: error instanceof SubmissionError ? error.status : 400, headers });
    }
    const appPassword = password()?.replace(/\s/g, "");
    if (!appPassword) {
      console.error("[enquiry] GMAIL_APP_PASSWORD is not configured.");
      return Response.json({ success: false, message: unavailable }, { status: 503, headers });
    }
    if (!allowAttempt(request)) return Response.json({ success: false, message: "Please wait a few minutes before trying again. Your details are still here." }, { status: 429, headers: { ...headers, "Retry-After": "600" } });
    try {
      await deliver(enquiry, appPassword);
      return Response.json({ success: true }, { headers });
    } catch (error) {
      // Only record a bounded error code. Never log passwords, messages or addresses.
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "DELIVERY_FAILED";
      console.error(`[enquiry] ${/^[A-Z_]{1,30}$/.test(code) ? code : "DELIVERY_FAILED"}`);
      return Response.json({ success: false, message: unavailable }, { status: 502, headers });
    }
  };
}

export function enquiryMail(enquiry: Enquiry) {
  const rows = [["Name", enquiry.name], ["Email", enquiry.email], ["Company", enquiry.company], ["Package", enquiry.package], ["Services", enquiry.services], ["Budget", enquiry.budget], ["Project details", enquiry.message]];
  const escape = (text: string) => text.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
  return {
    from: { name: "monettic website", address: agency.email },
    to: agency.email,
    replyTo: { name: enquiry.name, address: enquiry.email },
    subject: "New project enquiry | monettic",
    text: `NEW PROJECT ENQUIRY\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n\n")}\n\nReply to this email to contact the visitor.`,
    html: `<div style="font-family:Arial,sans-serif;color:#12374a;max-width:640px;margin:auto"><h1 style="background:#08485f;color:white;padding:28px;font-size:26px">A new monettic enquiry</h1><table style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:14px;border-bottom:1px solid #dceaf0">${label}</th><td style="padding:14px;border-bottom:1px solid #dceaf0">${escape(value).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table><p style="font-size:13px;padding:14px">Reply to this email to contact the visitor.</p></div>`,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}
