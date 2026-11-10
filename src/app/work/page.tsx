import { JsonLd } from "@/components/json-ld";
import { WorkPortfolio } from "@/components/work-portfolio";
import { projects } from "@/lib/content";
import { absoluteUrl, breadcrumbSchema, organizationId, pageMetadata } from "@/lib/seo";
import "./portfolio.css";

export const metadata = pageMetadata(
  "Our Work — Website Design Portfolio",
  "Explore monettic’s website portfolio, including DG Property, MicroLogistics, Ngenzeni Enterprise and more. View each project and visit the live website.",
  "/work/",
);

export default function WorkPage() {
  return <main id="main">
    <JsonLd data={{ "@context": "https://schema.org", "@graph": [
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Our work", path: "/work/" }]),
      {
        "@type": "CollectionPage", "@id": absoluteUrl("/work/#collection"),
        name: "monettic website portfolio", url: absoluteUrl("/work/"),
        publisher: { "@id": organizationId },
        mainEntity: {
          "@type": "ItemList", numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem", position: index + 1, name: project.name, url: project.url,
          })),
        },
      },
    ] }} />
    <WorkPortfolio />
  </main>;
}
