import Link from "next/link";
import { Arrow } from "@/components/ui";
import { Contact } from "@/components/contact";
import { JsonLd } from "@/components/json-ld";
import { servicePages } from "@/lib/service-pages";
import { absoluteUrl, breadcrumbSchema, organizationId, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Websites, Ecommerce & Growth Services", "Explore business websites, ecommerce stores, custom web apps, SEO and AEO, graphic design, lead generation and AI integration with CRM included.", "/services/");

export default function ServiceIndex() {
  return <main id="main"><JsonLd data={{ "@context": "https://schema.org", "@graph": [
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }]),
    { "@type": "OfferCatalog", "@id": `${absoluteUrl("/services/")}#catalog`, name: "monettic services", itemListElement: servicePages.map(item => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: item.name, url: absoluteUrl(`/services/${item.slug}/`), provider: { "@id": organizationId } } })) },
  ] }} />
    <section className="article-page light-section service-detail"><div className="article-container"><Link className="article-back" href="/"><Arrow direction="left" />Back to the studio</Link><div className="eyebrow">WHAT WE DO · SOUTH AFRICA</div><h1>Good ideas.<br />Connected services.</h1><p className="article-standfirst">Business websites, ecommerce stores, technology and education websites, portfolios and custom web apps. We also bring advanced SEO and AEO, graphic design and campaigns together with lead scraping, email outreach, content and AI integration, including a sales dashboard and CRM.</p>
      <div className="service-directory">{servicePages.map((service, index) => <article key={service.slug}><span className="eyebrow">0{index + 1}</span><h2><Link href={`/services/${service.slug}/`}>{service.name}<span><Arrow diagonal /></span></Link></h2><p>{service.summary}</p></article>)}</div>
      <Link className="text-button dark-text" href="/#partners">See the businesses we’ve built for <Arrow diagonal /></Link>
    </div></section><Contact /></main>;
}
