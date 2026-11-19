import { test, expect } from "@playwright/test";

test("headings reveal from masks with staggered words, then remain readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await expect(page.getByRole("heading", { name: /we find your next clients\.\s*then help you close them\./ })).toBeVisible();
  const heading = page.locator("#work-heading");
  const first = heading.locator(".heading-word").first();
  const last = heading.locator(".heading-word").last();
  await expect(heading).toHaveAttribute("data-reveal-state", "waiting");
  await expect(first).toHaveCSS("opacity", "0");
  const box = await heading.evaluate(element => ({ top: element.getBoundingClientRect().top + scrollY }));
  await page.evaluate(({ top }) => window.scrollTo(0, top - innerHeight * .65), box);
  await expect(heading).toHaveAttribute("data-reveal-state", "visible");
  await expect.poll(() => heading.evaluate(element => {
    const words = [...element.querySelectorAll(".heading-word")];
    return Number(getComputedStyle(words[0]).opacity) > Number(getComputedStyle(words[words.length - 1]).opacity) + .02;
  }), { intervals: [16, 25, 50] }).toBeTruthy();
  const delays = await heading.locator(".heading-word").evaluateAll(words => words.map(word => parseFloat(getComputedStyle(word).transitionDelay)));
  expect(delays.at(-1)).toBeGreaterThan(delays[0]);
  await expect(last).toHaveCSS("opacity", "1");
  await expect.poll(() => last.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m42)).toBeCloseTo(0, 1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(heading).toHaveAttribute("data-reveal-state", "visible");
  await page.evaluate(({ top }) => window.scrollTo(0, top - innerHeight * .4), box);
  await expect(last).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/masked-headings-desktop.png" });
  expect(errors).toEqual([]);
});

test("mobile headings keep their accents and respect live reduced-motion changes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("#services-heading")).toHaveAttribute("data-reveal-state", "waiting");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const word = page.locator("#services-heading .heading-word").last();
  await expect(word).toHaveCSS("opacity", "1");
  await expect(word).toHaveCSS("transform", "none");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("#contact-heading .mx-serif .heading-word").first()).toHaveCSS("font-style", "italic");
  await expect(page.locator("#contact-heading .mx-serif .heading-word").first()).toHaveCSS("color", "rgb(79, 210, 242)");
  await page.screenshot({ path: "test-results/masked-headings-mobile.png" });
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});

test("headings remain present without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:3001");
  await expect(page.getByRole("heading", { name: /we find your next clients\.\s*then help you close them\./ })).toBeVisible();
  await expect(page.locator("#work-heading .heading-word").first()).toHaveCSS("opacity", "1");
  await context.close();
});
