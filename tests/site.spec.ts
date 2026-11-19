import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("portfolio filtering and keyboard-accessible project details", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /See the portfolio/ }).click();
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Our work.Out in the world.");
  await expect(page.locator(".project-card")).toHaveCount(9);
  await page.getByRole("button", { name: "Business", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(7);
  await page.getByRole("button", { name: "View DG Property project" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "DG Property", exact: true })).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("link", { name: /Visit website/ })).toHaveAttribute("href", "https://dg-property.co.za/");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "View DG Property project" })).toBeFocused();
  await page.getByRole("button", { name: "Community & creative", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "View Lens Photo Studio project" })).toBeVisible();
  await page.getByRole("button", { name: /All work/ }).click();
  await expect(page.locator(".work-count")).toHaveText("09 PROJECTS");
  const destinations = await page.locator(".project-site-link").evaluateAll(links => links.map(link => ({ href: link.getAttribute("href"), target: link.getAttribute("target"), rel: link.getAttribute("rel") })));
  expect(destinations.map(link => link.href)).toEqual([
    "https://dg-property.co.za/", "https://micrologistics.co.za/", "https://newlifeunited.co.za/", "https://thunderbrothers.co.za/",
    "https://www.datawarehouse.ctcpm.cd/", "https://lensphotostudio.co.za/", "https://www.dcbspares.co.za/", "https://www.fedpump.com/", "https://www.ngenzeni.co.za/",
  ]);
  expect(destinations.every(link => link.target === "_blank" && link.rel?.includes("noopener"))).toBeTruthy();
  await expect(page.locator("#work")).not.toContainText(/Routed|Rage Festival|10-Four|NutriFlow/);
  await page.getByRole("button", { name: "View Ngenzeni Enterprise project" }).click();
  await expect(page.getByRole("dialog").getByRole("link", { name: /Visit website/ })).toHaveAttribute("href", "https://www.ngenzeni.co.za/");
  for (const preview of await page.getByRole("dialog").locator(".device-live img").all()) {
    await expect.poll(() => preview.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await page.getByRole("button", { name: "Close project details" }).click();
  await expect(page.getByRole("button", { name: "View Ngenzeni Enterprise project" })).toBeFocused();
});

test("services expose their content and form validates required fields", async ({ page }) => {
  await page.goto("/");
  const services = page.locator("#services");
  await expect(services.getByRole("heading", { name: /services, one system./ })).toBeVisible();
  await page.locator(".mx-nav-cta").click();
  await expect(page.getByRole("dialog", { name: /build something great/ })).toBeVisible();
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Alex Example");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("A little about your project").fill("A new brand website for our studio.");
  await page.getByLabel("Website build", { exact: true }).check();
  await expect(page.getByLabel("Website build", { exact: true })).toBeChecked();
  const accessibility = await new AxeBuilder({ page }).include("dialog[open]").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.locator(".mx-nav-cta")).toBeFocused();
});

test("journal and privacy routes work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: /good websites start with better questions/i }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Good websites start with better questions.");
  await expect(page).toHaveTitle(/Good websites.*monettic/);
  await page.getByRole("contentinfo").getByRole("link", { name: "privacy policy", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy policy.");
  await expect(page.locator(".article-body").getByRole("link", { name: "eliseeweb@gmail.com" })).toHaveAttribute("href", "mailto:eliseeweb@gmail.com");
});

test("work and privacy pages are accessible on mobile and linked from the menu and form", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(navigation.getByRole("link")).toHaveText(["01home", "02clients", "03services", "04work"]);
  await navigation.getByRole("link", { name: /clients/ }).click();
  await expect(page).toHaveURL(/#partners/);
  await page.getByRole("link", { name: /See the portfolio/ }).click();
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".project-card")).toHaveCount(9);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: "test-results/work-mobile.png" });
  await page.locator(".mx-nav-cta").click();
  await page.getByRole("dialog").getByRole("link", { name: "Privacy policy", exact: true }).click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  const contents = page.getByRole("navigation", { name: "Privacy policy contents" });
  await expect(contents.getByRole("link")).toHaveCount(9);
  await contents.getByRole("link", { name: "Your choices & rights", exact: true }).click();
  await expect(page.locator("#your-rights")).toBeInViewport();
  await expect(page.locator("main")).not.toContainText("59 Van Buuren");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  for (const width of [390, 320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  await page.goto("/privacy/");
  await page.screenshot({ path: "test-results/privacy-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/privacy-mobile.png" });
});

test("mobile navigation, small-screen layout, and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const menuButton = page.getByRole("button", { name: "Open menu" });
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menuButton).toBeFocused();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  const clientsLink = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: /clients/ });
  await clientsLink.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#partners/);
  expect(await page.locator(".mx-marquee-track").first().evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  await expect(page.locator(".mx-hero .mx-glow i").first()).toHaveCSS("animation-name", "none");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "test-results/mobile-hero.png" });
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.setViewportSize({ width: 320, height: 700 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test("home meets automated WCAG AA checks", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});
