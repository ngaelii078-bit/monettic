import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("growth offerings feed the enquiry form and retain visitor input", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore our business growth services" }).click();
  await expect(page.locator(".growth-item")).toHaveCount(8);
  await page.getByRole("button", { name: "Discuss Email outreach + lead scraper", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: /Make it/ });
  await expect(dialog.getByLabel("Outreach & scraping", { exact: true })).toBeChecked();
  await dialog.getByLabel("Your name").fill("Sam Client");
  await dialog.getByLabel("Website lead tracking", { exact: true }).check();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Discuss CRM included", exact: true }).click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("Sam Client");
  for (const label of ["Outreach & scraping", "Website lead tracking", "Lead dashboard / CRM"]) {
    await expect(dialog.getByLabel(label, { exact: true })).toBeChecked();
  }
  const values = await dialog.locator("form").evaluate(form => new FormData(form as HTMLFormElement).getAll("services"));
  expect(values).toEqual(expect.arrayContaining(["Outreach & scraping", "Website lead tracking", "Lead dashboard / CRM"]));
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Discuss CRM included", exact: true })).toBeFocused();
});

test("studio text still advances and reverses with scroll position", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  const paragraph = page.locator("#about .scroll-text-wrap");
  const coordinates = await paragraph.evaluate(element => ({ top: element.getBoundingClientRect().top + scrollY, height: element.getBoundingClientRect().height }));
  await page.evaluate(top => window.scrollTo(0, top - innerHeight * 0.9), coordinates.top);
  const lastWord = paragraph.locator(".scroll-word").last();
  await expect.poll(() => lastWord.evaluate(element => Number(getComputedStyle(element).opacity))).toBeLessThan(0.7);
  await page.evaluate(({ top, height }) => window.scrollTo(0, top + height - innerHeight * 0.4), coordinates);
  await expect.poll(() => lastWord.evaluate(element => Number(getComputedStyle(element).opacity))).toBeGreaterThan(0.99);
  await expect(lastWord).toHaveCSS("color", "rgb(141, 234, 250)");
  await page.evaluate(top => window.scrollTo(0, top - innerHeight * 0.9), coordinates.top);
  await expect.poll(() => lastWord.evaluate(element => Number(getComputedStyle(element).opacity))).toBeLessThan(0.7);
  await page.locator("#growth-services").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/growth-desktop.png" });
  expect(errors).toEqual([]);
});

test("growth section is readable on mobile and honours reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#growth-services");
  const words = page.locator("#growth-services .heading-word");
  await expect(words.last()).toHaveCSS("opacity", "1");
  await expect(words.last()).toHaveCSS("transform", "none");
  await expect(page.locator(".growth-type-track")).toHaveCSS("transform", "none");
  await page.screenshot({ path: "test-results/growth-mobile.png" });
  await page.getByRole("button", { name: "Discuss AI integration", exact: true }).click();
  await expect(page.getByRole("dialog").getByLabel("Connected AI workflows", { exact: true })).toBeChecked();
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 320, height: 700 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  const accessibility = await new AxeBuilder({ page }).include("#growth-services").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});
