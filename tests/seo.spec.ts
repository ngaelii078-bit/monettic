import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { servicePages } from "../src/lib/service-pages";

const siteUrl = "https://monettic.com";

test("every sitemap page has server-rendered, unique metadata and the production canonical", async ({ request, page }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  const urls = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  expect(urls).toHaveLength(11);
  expect(urls).toContain(`${siteUrl}/work/`);
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const url of urls) {
    expect(url.startsWith(`${siteUrl}/`)).toBeTruthy();
    const htmlResponse = await request.get(new URL(url).pathname);
    expect(htmlResponse.status(), url).toBe(200);
    const html = await htmlResponse.text();
    expect(html).not.toContain("concrete-agency.eliseengandu814.chatgpt.site");
    const meta = await page.evaluate(markup => {
      const doc = new DOMParser().parseFromString(markup, "text/html");
      const content = (selector: string) => doc.querySelector(selector)?.getAttribute("content");
      return {
        title: doc.title, description: content('meta[name="description"]'),
        canonicals: [...doc.querySelectorAll('link[rel="canonical"]')].map(link => link.getAttribute("href")),
        ogUrl: content('meta[property="og:url"]'), ogTitle: content('meta[property="og:title"]'),
        ogDescription: content('meta[property="og:description"]'), ogImage: content('meta[property="og:image"]'),
        card: content('meta[name="twitter:card"]'), robots: content('meta[name="robots"]'),
        h1s: doc.querySelectorAll('main h1').length,
        schemas: [...doc.querySelectorAll('script[type="application/ld+json"]')].map(script => JSON.parse(script.textContent || "{}")),
      };
    }, html);
    expect(meta.canonicals).toEqual([url]);
    expect(meta.ogUrl).toBe(url);
    expect(meta.ogTitle).toBe(meta.title);
    expect(meta.ogDescription).toBe(meta.description);
    expect(meta.ogImage).toBe(`${siteUrl}/social-card.png`);
    expect(meta.card).toBe("summary_large_image");
    expect(meta.robots).not.toContain("noindex");
    expect(meta.h1s).toBe(1);
    expect(meta.description).toBeTruthy();
    expect(meta.schemas.some(schema => schema["@type"] === "Organization")).toBeTruthy();
    expect(titles.has(meta.title), `Duplicate title on ${url}`).toBe(false);
    expect(descriptions.has(meta.description!), `Duplicate description on ${url}`).toBe(false);
    titles.add(meta.title); descriptions.add(meta.description!);
  }
});

test("robots advertises the sitemap and sharing images are valid PNGs", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text).toContain("Allow: /");
  expect(text).toContain("Disallow: /api/");
  expect(text).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  for (const [path, width, height] of [["/social-card.png", 1200, 630], ["/logo.png", 512, 512], ["/apple-touch-icon.png", 180, 180]] as const) {
    const image = await request.get(path);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    const bytes = await image.body();
    expect(bytes.readUInt32BE(16)).toBe(width);
    expect(bytes.readUInt32BE(20)).toBe(height);
  }
});

test("unknown service and journal URLs return a real non-indexable 404", async ({ request }) => {
  for (const path of ["/services/not-a-service/", "/journal/not-an-article/"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(await response.text()).toMatch(/name="robots" content="noindex"/);
  }
});

test("service pages remain readable on mobile and open the relevant enquiry selection", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const service of servicePages) {
    await page.goto(`/services/${service.slug}/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(service.headline);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.getByRole("button", { name: `Discuss ${service.name.toLowerCase()}`, exact: true }).click();
    await expect(page.getByRole("dialog").getByRole("checkbox", { name: service.service, exact: true })).toBeChecked();
    await page.getByRole("button", { name: "Close project form" }).click();
    await expect(page.getByRole("navigation", { name: "Related services" }).getByRole("link")).toHaveCount(3);
  }
  await page.goto("/services/ai-automation/");
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(axe.violations).toEqual([]);
  await page.screenshot({ path: "test-results/service-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "test-results/service-desktop.png", fullPage: true });
});

test("homepage and services directory provide crawlable links to every service", async ({ page }) => {
  await page.goto("/");
  const links = page.getByRole("navigation", { name: "Explore our services" }).getByRole("link");
  await expect(links).toHaveCount(4);
  for (const service of servicePages) await expect(links.filter({ hasText: service.name })).toHaveAttribute("href", `/services/${service.slug}/`);
  await page.getByRole("contentinfo").getByRole("link", { name: "Services", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/$/);
  await expect(page.locator(".service-directory article")).toHaveCount(4);
});
