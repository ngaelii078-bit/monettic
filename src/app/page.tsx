import { JsonLd } from "@/components/json-ld";
import { HomeHero } from "@/components/home/hero";
import { Proof } from "@/components/home/proof";
import { Pipeline } from "@/components/home/pipeline";
import { Work } from "@/components/home/work";
import { Dashboard } from "@/components/home/dashboard";
import { Compare } from "@/components/home/compare";
import { Record } from "@/components/home/record";
import { NextStep } from "@/components/home/next-step";
import { Route } from "@/components/home/route";
import "@/components/home/home.css";
import { agency } from "@/lib/content";
import { absoluteUrl, homePageTitle, organizationId, pageMetadata, websiteId } from "@/lib/seo";

export const metadata = pageMetadata(homePageTitle, agency.description, "/");

export default function Home() {
  return <main id="main" className="mx">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", "@id": websiteId, name: agency.name, url: absoluteUrl(), description: agency.description, inLanguage: "en-ZA", publisher: { "@id": organizationId } }} />
    <Route />
    <HomeHero />
    <Proof />
    <Pipeline />
    <Work />
    <Dashboard />
    <Compare />
    <Record />
    <NextStep />
  </main>;
}
