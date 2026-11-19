import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const endpoint = "**/api/enquiry/";

async function fillEnquiry(page: Page) {
  await page.goto("/");
  await page.locator(".mx-nav-cta").click();
  await page.getByLabel("Your name").fill("Alex Example");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("Company", { exact: true }).fill("Example Studio");
  await page.getByRole("combobox", { name: "Package", exact: true }).selectOption("Full AI Integration");
  await page.getByRole("checkbox", { name: "Website build", exact: true }).check();
  await page.getByRole("checkbox", { name: "Website lead tracking", exact: true }).check();
  await page.getByRole("combobox", { name: "Project budget", exact: true }).selectOption("R30,000–R60,000");
  await page.getByLabel("A little about your project").fill("We need a new website and a connected enquiry process.");
}

test("enquiry sends every field once, then thanks the visitor without navigating", async ({ page }) => {
  let submissions = 0;
  let payload: Record<string, unknown> | undefined;
  let accept!: () => void;
  const accepted = new Promise<void>(resolve => { accept = resolve; });
  await page.route(endpoint, async route => {
    submissions++;
    payload = route.request().postDataJSON();
    await accepted;
    await route.fulfill({ json: { success: true } });
  });
  await fillEnquiry(page);
  const originalUrl = page.url();
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect.poll(() => submissions).toBe(1);
  await expect(page.getByRole("button", { name: "Sending message" })).toBeDisabled();
  await expect(page.getByLabel("Your name")).toBeDisabled();
  await expect(page.getByRole("heading", { name: /Message sent/ })).toHaveCount(0);
  await page.locator(".enquiry-form").evaluate(form => (form as HTMLFormElement).requestSubmit());
  expect(submissions).toBe(1);
  expect(payload).toMatchObject({
    name: "Alex Example", email: "alex@example.com", company: "Example Studio",
    package: "Full AI Integration", services: "Website build, Website lead tracking", budget: "R30,000–R60,000",
    message: "We need a new website and a connected enquiry process.", botcheck: "",
  });
  expect(payload).not.toHaveProperty("access_key");
  expect(payload).not.toHaveProperty("redirect");
  accept();
  await expect(page.getByRole("heading", { name: /Thank you.*Message sent/ })).toBeVisible();
  await expect(page.locator(".enquiry-confirmation")).toBeFocused();
  await expect(page.locator(".enquiry-success-email")).toHaveText("alex@example.com");
  expect(page.url()).toBe(originalUrl);
  expect(page.context().pages()).toHaveLength(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/enquiry-success-mobile.png" });
  const accessibility = await new AxeBuilder({ page }).include("dialog[open]").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.getByRole("button", { name: "Back to the website" }).click();
  await expect(page.locator(".mx-nav-cta")).toBeFocused();
  await page.locator(".mx-nav-cta").click();
  await expect(page.getByLabel("Your name")).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: "Website build", exact: true })).not.toBeChecked();
});

for (const failure of ["server", "configuration", "rate-limit", "network", "invalid-response", "false-success"] as const) {
  test(`enquiry preserves inputs and supports retry after ${failure} failure`, async ({ page }) => {
    let attempts = 0;
    await page.route(endpoint, async route => {
      attempts++;
      if (attempts > 1) return route.fulfill({ json: { success: true } });
      if (failure === "network") return route.abort("failed");
      if (failure === "invalid-response") return route.fulfill({ status: 200, contentType: "text/html", body: "Service unavailable" });
      if (failure === "configuration") return route.fulfill({ status: 503, json: { success: false } });
      if (failure === "rate-limit") return route.fulfill({ status: 429, json: { success: false } });
      if (failure === "false-success") return route.fulfill({ status: 200, json: { success: "false" } });
      return route.fulfill({ status: 502, json: { success: false } });
    });
    await fillEnquiry(page);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.getByRole("dialog").getByRole("alert")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Message sent/ })).toHaveCount(0);
    await expect(page.getByLabel("Your name")).toHaveValue("Alex Example");
    await expect(page.getByLabel("A little about your project")).toHaveValue("We need a new website and a connected enquiry process.");
    await expect(page.getByRole("checkbox", { name: "Website lead tracking", exact: true })).toBeChecked();
    await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeEnabled();
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.getByRole("heading", { name: /Thank you.*Message sent/ })).toBeVisible();
    expect(attempts).toBe(2);
  });
}
