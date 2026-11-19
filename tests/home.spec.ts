import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects, services } from "../src/lib/content";
import { featuredWorkIds } from "../src/lib/home-content";

const dialogName = /build something great/i;
const noOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

test("homepage follows the reference structure in order", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/we find your next clients\.\s*then help you close them\./);
  const order = await page.locator("main > section").evaluateAll(sections => sections.map(section => section.id || section.className.split(" ")[0]));
  expect(order).toEqual(["mx-hero", "partners", "outreach", "work", "dashboard", "how-we-work", "services", "contact"]);
  const stats = page.locator(".mx-stats strong");
  await expect(stats).toHaveText([String(projects.length), String(services.length), "6", "100%"]);
  await expect(page.locator("main")).not.toContainText(/\$|£|meetings booked|emails sent for clients|closed revenue/i);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await noOverflow(page)).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test("hero and navigation open the enquiry and return focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const glow = page.locator(".mx-hero .mx-glow");
  await expect(glow).toHaveAttribute("data-active", "true");
  const hero = page.locator(".mx-hero");
  const book = hero.getByRole("button", { name: "book a call" });
  await book.click();
  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(book).toBeFocused();
  await page.locator(".mx-nav-cta").click();
  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mx-nav-cta")).toBeFocused();
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await hero.getByRole("link", { name: "see our clients" }).click();
  await expect.poll(() => new URL(page.url()).hash).toBe("#partners");
  await page.locator("#services").scrollIntoViewIfNeeded();
  await expect(glow).toHaveAttribute("data-active", "false");
  await expect.poll(() => glow.locator("i").first().evaluate(element => getComputedStyle(element).animationPlayState)).toBe("paused");
});

test("client logos link to live sites and both strips can pause", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#partners");
  const proof = page.locator("#partners");
  const clients = proof.getByRole("list", { name: "Clients" });
  await expect(clients.getByRole("link")).toHaveCount(projects.length);
  for (const project of projects) {
    const link = clients.getByRole("link", { name: new RegExp(`^${project.name}, visit website`) });
    await expect(link).toHaveAttribute("href", project.url);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  for (const name of ["Routed", "Rage Festival", "10-Four", "NutriFlow"]) await expect(clients.getByText(name, { exact: true })).toBeVisible();
  const clones = proof.locator('.mx-logos [aria-hidden="true"] a');
  await expect(clones).toHaveCount(projects.length);
  for (const clone of await clones.all()) await expect(clone).toHaveAttribute("tabindex", "-1");
  const platforms = proof.getByRole("list", { name: "Platforms we use" });
  for (const name of ["Monettic Personal Board", "Anthropic", "OpenAI", "Vercel", "Firecrawl", "Notion", "Higgsfield"]) await expect(platforms.getByText(name, { exact: true })).toBeVisible();
  for (const name of ["GoHighLevel", "Apollo", "Instantly"]) await expect(platforms.getByText(name, { exact: true }).locator("..")).toContainText("soon");

  const tracks = proof.locator(".mx-marquee-track");
  await page.mouse.move(0, 0);
  await expect.poll(() => tracks.first().evaluate(element => getComputedStyle(element).animationPlayState)).toBe("running");
  await proof.getByRole("button", { name: "Pause scrolling" }).click();
  await page.mouse.move(0, 0);
  for (const track of await tracks.all()) await expect.poll(() => track.evaluate(element => getComputedStyle(element).animationPlayState)).toBe("paused");
  await proof.getByRole("button", { name: "Resume scrolling" }).click();
  await page.mouse.move(0, 0);
  await expect.poll(() => tracks.first().evaluate(element => getComputedStyle(element).animationPlayState)).toBe("running");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(tracks.first()).toHaveCSS("animation-name", "none");
  await expect(proof.locator('.mx-marquee-group[aria-hidden="true"]').first()).toBeHidden();
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await noOverflow(page)).toBeTruthy();
  }
  const accessibility = await new AxeBuilder({ page }).include("#partners").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("pipeline steps follow the scroll and hand over at calls booked", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#outreach");
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  const pipeline = page.locator("#outreach");
  await expect(pipeline.getByRole("heading", { name: /one campaign, lead to client\.\s*your team takes the call\./ })).toBeVisible();
  const steps = pipeline.getByRole("list", { name: "Outreach process" }).getByRole("listitem");
  const stages = ["Leads found", "Contacts sourced", "Emails sent", "Replies", "Calls booked", "Clients closed"];
  await expect(steps).toHaveCount(stages.length);
  for (const [index, stage] of stages.entries()) await expect(steps.nth(index)).toContainText(stage);
  await expect(pipeline.locator(".mx-funnel")).toHaveCSS("position", "sticky");
  await expect(pipeline.locator(".mx-funnel")).toContainText("Illustrative shape");
  const scrollToStep = (index: number) => steps.nth(index).evaluate(element => window.scrollTo(0, element.getBoundingClientRect().top + scrollY - innerHeight * 0.42));
  await scrollToStep(2);
  await expect(steps.nth(2)).toHaveAttribute("data-active", "true");
  await expect(pipeline.locator(".mx-handover")).toHaveAttribute("data-on", "false");
  await scrollToStep(4);
  await expect(steps.nth(4)).toHaveAttribute("data-active", "true");
  await expect(pipeline.locator(".mx-handover")).toHaveAttribute("data-on", "true");
  const button = pipeline.getByRole("button", { name: "talk about outreach" });
  await button.click();
  await expect(page.getByRole("dialog", { name: dialogName }).getByLabel("Lead generation", { exact: true })).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(pipeline.locator(".mx-funnel")).toHaveCSS("position", "static");
  expect(await noOverflow(page)).toBeTruthy();
});

test("work, dashboard and comparison present real clients and honest previews", async ({ page }) => {
  await page.goto("/#work");
  const work = page.locator("#work");
  const cards = work.locator(".mx-work-card");
  await expect(cards).toHaveCount(featuredWorkIds.length);
  for (const [index, id] of featuredWorkIds.entries()) {
    const project = projects.find(p => p.id === id)!;
    await expect(cards.nth(index)).toHaveAttribute("href", project.url);
    await expect(cards.nth(index)).toContainText(project.name);
    const image = cards.nth(index).locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBeTruthy();
  }
  await expect(work.getByRole("link", { name: `All ${projects.length} client sites` })).toHaveAttribute("href", "/work/");

  const dashboard = page.locator("#dashboard");
  await expect(dashboard.getByRole("heading", { name: /one dashboard, every lead\./ })).toBeVisible();
  await expect(dashboard).toContainText("Illustrative preview with sample data");
  await expect(dashboard.locator(".mx-feature")).toHaveCount(5);
  await dashboard.getByRole("button", { name: "talk about your sales system" }).click();
  await expect(page.getByRole("dialog", { name: dialogName }).getByLabel("Sales dashboard", { exact: true })).toBeChecked();
  await page.keyboard.press("Escape");

  const compare = page.locator("#how-we-work");
  const table = compare.getByRole("table", { name: /How monettic compares/ });
  await expect(table.getByRole("columnheader")).toHaveText(["hiring in house", "separate freelancers", "monettic"]);
  await expect(table.getByRole("rowheader")).toHaveCount(4);
  await expect(compare.locator(".mx-standards li")).toHaveCount(5);
});

test("service cards link to service pages or preselect the enquiry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#services");
  const record = page.locator("#services");
  const list = record.getByRole("list", { name: "Services" });
  await expect(list.getByRole("listitem")).toHaveCount(services.length);
  await expect(list.getByRole("link", { name: "Websites, ecommerce & web apps: read more" })).toHaveAttribute("href", "/services/website-design/");
  await expect(list.getByRole("link", { name: "Advanced SEO + AEO: read more" })).toHaveAttribute("href", "/services/seo-aeo/");
  const ask = list.getByRole("button", { name: "Ask about Email outreach" });
  await ask.click();
  const dialog = page.getByRole("dialog", { name: dialogName });
  await expect(dialog.getByLabel("Email outreach setup", { exact: true })).toBeChecked();
  await dialog.getByLabel("Your name").fill("Sam Client");
  await page.keyboard.press("Escape");
  await expect(ask).toBeFocused();
  await list.getByRole("button", { name: "Ask about Graphic design" }).click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("Sam Client");
  for (const label of ["Email outreach setup", "Graphic design"]) await expect(dialog.getByLabel(label, { exact: true })).toBeChecked();
  await page.keyboard.press("Escape");
  for (const clone of await record.locator('.mx-marquee-group[aria-hidden="true"] a').all()) await expect(clone).toHaveAttribute("tabindex", "-1");
  await expect(record.locator('.mx-marquee-group[aria-hidden="true"] button')).toHaveCount(0);
  await expect(record.getByRole("link", { name: "see all services" })).toHaveAttribute("href", "/services/");
  await record.getByRole("button", { name: "Pause service scrolling" }).click();
  await page.mouse.move(0, 0);
  await expect.poll(() => record.locator(".mx-marquee-track").evaluate(element => getComputedStyle(element).animationPlayState)).toBe("paused");
});

test("pipeline route draws with scroll, lights stations and plugs into the final call to action", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  const base = page.locator(".mx-route-base");
  await expect(base).toHaveAttribute("d", /^M[\d.]+ [\d.]+ L.* A/);
  const drawn = () => base.evaluate(element => {
    const style = getComputedStyle(element);
    return parseFloat(style.strokeDasharray) - parseFloat(style.strokeDashoffset);
  });
  const stations = page.locator(".mx-route-station:not(.mx-route-socket)");
  await expect(stations).toHaveCount(8);
  await expect(page.locator(".mx-route-label")).toHaveText(["01 · signal", "02 · find", "03 · reach", "04 · build", "05 · track", "06 · connect", "07 · grow", "08 · close"]);
  await expect.poll(drawn).toBeLessThan(2500);
  await expect(stations.nth(3)).toHaveAttribute("data-on", "false");
  const early = await drawn();
  await page.locator("#work").evaluate(element => window.scrollTo(0, element.getBoundingClientRect().top + scrollY));
  await expect.poll(drawn).toBeGreaterThan(early + 1500);
  await expect(stations.nth(3)).toHaveAttribute("data-on", "true");
  await expect(page.locator(".mx-route-tip")).toHaveCSS("opacity", "1");
  await expect.poll(() => page.locator(".mx-route-lead:not([style*='display: none'])").count()).toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator(".mx-route-socket")).toHaveAttribute("data-on", "true");
  const socket = await page.locator(".mx-route-socket").boundingBox();
  const button = await page.locator("#contact .mx-actions .mx-btn").first().boundingBox();
  expect(socket && button && Math.abs(socket.y + socket.height / 2 - (button.y + button.height / 2)) < 3 && button.x - (socket.x + socket.width) < 20).toBeTruthy();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => base.evaluate(element => parseFloat(getComputedStyle(element).strokeDashoffset))).toBe(0);
  await expect(page.locator(".mx-route-lead").first()).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".mx-route-label").first()).toBeHidden();
  expect(await noOverflow(page)).toBeTruthy();
});
