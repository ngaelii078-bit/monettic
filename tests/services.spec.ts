import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("services and package enquiries remain usable on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#services");
  await expect(page.getByRole("heading", { name: "What we do.", exact: true })).toBeVisible();
  await expect(page.locator("#services .service-item")).toHaveCount(10);
  const outreach = page.locator("#service-trigger-2");
  await outreach.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#service-panel-2")).toBeVisible();
  await expect(page.locator("#service-panel-0")).not.toBeVisible();
  await expect(page.locator("#service-panel-2")).toContainText("a no or no response ends outreach");
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".service-system").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/services-system-mobile.png" });
  const outreachButton = page.locator("#service-panel-2").getByRole("button", { name: /Let’s talk email outreach setup/ });
  await outreachButton.click();
  const dialog = page.getByRole("dialog", { name: /build something great/ });
  await expect(dialog.getByLabel("Email outreach setup", { exact: true }).first()).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(outreachButton).toBeFocused();
  await expect(page.getByRole("heading", { name: /Three ways to/ })).toHaveCount(0);
  const accessibility = await new AxeBuilder({ page }).include("#services").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("partner logos link to each client's live website", async ({ page, context }) => {
  const { projects } = await import("../src/lib/content");
  await context.route(/^https:\/\/(www\.)?(dg-property|micrologistics|newlifeunited|thunderbrothers|datawarehouse\.ctcpm|lensphotostudio|dcbspares|fedpump|ngenzeni)\./, route => route.fulfill({ status: 200, contentType: "text/html", body: "<title>Client site</title>" }));
  await page.goto("/#partners");
  const partners = page.locator("#partners");
  await expect(partners.getByRole("heading", { name: "Businesses we’ve built for.", exact: true })).toBeVisible();
  const links = partners.locator(".partner-tile");
  await expect(links).toHaveCount(projects.length);
  for (const [index, project] of projects.entries()) {
    const link = links.nth(index);
    await expect(link).toHaveAttribute("href", project.url);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).toHaveAccessibleName(new RegExp(`^${project.name}`));
    await expect(link.locator("img")).toHaveAttribute("src", project.logo.src);
    expect(await link.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBeTruthy();
  }
  const [popup] = await Promise.all([page.waitForEvent("popup"), links.first().click()]);
  await expect(popup).toHaveURL(projects[0].url);
  await popup.close();
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  const accessibility = await new AxeBuilder({ page }).include("#partners").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});
