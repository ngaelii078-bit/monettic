import type { Metadata } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import "@/components/growth-services.css";
import "@/components/word-reveal.css";
import "./editorial-theme.css";
import "@/components/hero.css";
import "@/components/hero-showcase.css";
import "@/components/services-overview.css";
import "@/components/partners.css";
import "@/components/work.css";
import "./mobile-performance.css";
import "@/components/project-dialog.css";
import "./services/services.css";
import { SiteShell } from "@/components/site-shell";
import { agency } from "@/lib/content";
import { JsonLd } from "@/components/json-ld";
import { homeTitle, organizationSchema, shareImage, siteUrl } from "@/lib/seo";

const editorial = localFont({
  src: [
    { path: "../../public/fonts/cormorant-garamond-latin.woff2", weight: "400 500", style: "normal" },
    { path: "../../public/fonts/cormorant-garamond-latin-italic.woff2", weight: "400 500", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: homeTitle, template: "%s | monettic" },
  description: agency.description,
  openGraph: { title: homeTitle, siteName: agency.name, description: agency.description, type: "website", locale: "en_ZA", images: [shareImage] },
  twitter: { card: "summary_large_image", images: [shareImage] },
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: true, googleBot: { index: process.env.VERCEL_ENV !== "preview", follow: true, "max-image-preview": "large" } },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48 256x256" },
      { url: "/favicon.png", type: "image/png", sizes: "96x96" },
    ],
    apple: { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-ZA" className={editorial.variable}><body id="top"><JsonLd data={{ "@context": "https://schema.org", ...organizationSchema }} /><SiteShell>{children}</SiteShell></body></html>;
}
