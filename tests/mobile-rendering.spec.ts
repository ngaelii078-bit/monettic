import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "no-preference" });

test("touch scrolling uses lightweight mockups without filtered or moving card layers", async ({ page }) => {
  const requestedImages: string[] = [];
  const failures: string[] = [];
  page.on("request", request => {
    if (request.resourceType() === "image") requestedImages.push(new URL(request.url()).pathname);
  });
  page.on("pageerror", error => failures.push(error.message));
  await page.goto("/");
  await expect(page.locator(".site-header")).toHaveCSS("backdrop-filter", "none");
  await expect(page.locator(".horizon-lightfield")).toHaveCSS("animation-name", "none");
  await page.getByRole("link", { name: /See the full portfolio/ }).click();
  await expect(page).toHaveURL(/\/work\/$/);

  for (const stage of await page.locator(".work-grid .device-stage").all()) {
    await stage.scrollIntoViewIfNeeded();
    const preview = stage.locator(".device-flat");
    await expect(preview).toBeVisible();
    await expect.poll(() => preview.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(800);
    await expect(stage.locator("img:visible")).toHaveCount(1);
    await expect(stage.locator(".device-live")).toBeHidden();
    await expect(stage).toHaveCSS("perspective", "none");
  }
  await expect(page.locator(".project-reveal").first()).toHaveCSS("transform", "none");
  expect(new Set(requestedImages.filter(path => path.endsWith("-devices.webp"))).size).toBe(9);
  expect(requestedImages.filter(path => /-(mobile|tablet)\.webp$/.test(path))).toEqual([]);

  await page.getByRole("button", { name: "View DG Property project" }).scrollIntoViewIfNeeded();
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  for (const yDistance of [-400, -400, 400, 400]) {
    await session.send("Input.synthesizeScrollGesture", { x: 180, y: 600, yDistance, speed: 800, gestureSourceType: "touch" });
  }
  await session.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await session.detach();
  await page.locator(".work-toolbar").evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 90));
  await page.screenshot({ path: "test-results/mobile-work-scroll.png" });

  await page.getByRole("button", { name: "View DG Property project" }).tap();
  await expect(page.getByRole("dialog").locator(".device-flat")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("link", { name: /Visit website/ })).toHaveAttribute("href", "https://dg-property.co.za/");
  await page.getByRole("button", { name: "Close project details" }).tap();

  // Landscape tablets still use the lightweight rendering on a coarse pointer.
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator(".work-grid .device-flat").first()).toBeVisible();
  await expect(page.locator(".work-grid .device-live").first()).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  expect(failures).toEqual([]);
});
