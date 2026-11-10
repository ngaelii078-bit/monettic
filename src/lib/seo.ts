import type { Metadata } from "next";
import { agency } from "./content";

export const siteUrl = "https://monettic.com";
export const absoluteUrl = (path = "/") => new URL(path, siteUrl).href;
export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;
export const homePageTitle = "Web Design & AI Automation South Africa";
export const homeTitle = `${agency.name} | ${homePageTitle}`;
export const shareImage = { url: "/social-card.png", width: 1200, height: 630, alt: "monettic — websites, SEO, AI automation and lead generation" };

export function pageMetadata(title: string, description: string, path: string, type: "website" | "article" = "website"): Metadata {
  const fullTitle = path === "/" ? `${agency.name} | ${title}` : `${title} | ${agency.name}`;
  return {
    title: { absolute: fullTitle }, description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, siteName: agency.name, type, locale: "en_ZA", images: [shareImage] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [shareImage] },
  };
}

export const organizationSchema = {
  "@type": "Organization", "@id": organizationId, name: agency.name,
  url: absoluteUrl(), description: agency.description, email: agency.email,
  logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png"), width: 512, height: 512 },
  areaServed: { "@type": "Country", name: "South Africa" },
  contactPoint: { "@type": "ContactPoint", email: agency.email, contactType: "project enquiries", availableLanguage: "English" },
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return { "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })) };
}
