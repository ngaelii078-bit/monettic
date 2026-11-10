"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "@/lib/content";
import { serviceLinks } from "@/lib/service-links";
import { Arrow, Reveal, SectionLabel } from "./ui";
import { ProjectButton } from "./site-shell";
import { WordReveal } from "./word-reveal";

const packages = [
  {
    name: "Website Build",
    label: "A strong foundation",
    description: "A website, online store or web app shaped around your business.",
    features: ["Business websites, ecommerce stores or custom web apps", "Responsive design and agreed integrations", "Search foundations and graphic design"],
    service: "Website build",
  },
  {
    name: "AI Integration",
    label: "A connected system",
    description: "We build the system. Your team works the opportunities.",
    features: ["Website, advanced SEO + AEO and graphic design", "Lead scraping and email outreach setup", "Website lead tracking and content integration", "AI sales dashboard, scripts and advice", "CRM included and monthly reporting"],
    service: "Email outreach setup",
  },
  {
    name: "Full AI Integration",
    label: "Built and run for you",
    description: "Your connected growth system, managed end to end.",
    features: ["Multi-page website included at no extra cost", "Managed campaigns, lead scraping and email outreach", "Advanced SEO + AEO, graphic design and content", "AI sales dashboard, scripts, advice and CRM included", "Weekly reviews and monthly visibility reporting"],
    service: "Sales dashboard",
  },
];

function ServiceSystem() {
  return <figure className="service-system" aria-labelledby="service-system-caption">
    <figcaption id="service-system-caption"><span>THE BIG PICTURE</span><strong>Different ways in. <em>One place to act.</em></strong></figcaption>
    <div className="service-system-map">
      <div className="service-system-lanes">
        <div className="service-system-lane">
          <div className="service-system-lane-label"><span>01</span><strong>Outbound</strong><small>Reach your audience</small></div>
          <div className="service-system-steps"><span>Lead scraper</span><Arrow /><span>Email outreach</span></div>
        </div>
        <div className="service-system-lane">
          <div className="service-system-lane-label"><span>02</span><strong>Inbound</strong><small>Your audience finds you</small></div>
          <div className="service-system-steps"><span>SEO, AEO + content</span><Arrow /><span>Your website</span></div>
        </div>
      </div>
      <div className="service-system-converge" aria-hidden="true"><span /><Arrow /></div>
      <div className="service-system-dashboard"><span className="service-system-signal" aria-hidden="true"><i /><i /><i /></span><span>AI SALES DASHBOARD + CRM</span><strong>Who to call.<br />Why. What to say.</strong><p>Lead context, scripts and AI sales advice. CRM included.</p></div>
    </div>
    <div className="service-system-outcomes"><span>THEN YOUR TEAM</span><ol><li>Reviews the lead</li><li><Arrow width="1em" height="1em" />Starts a conversation</li><li><Arrow width="1em" height="1em" />Tracks progress</li></ol><p>Results feed the next improvement <Arrow diagonal width="1em" height="1em" /></p></div>
  </figure>;
}

function ServicePackages() {
  return <section id="service-packages" className="service-packages" aria-labelledby="packages-heading">
    <div className="service-packages-heading"><div><span className="eyebrow">CHOOSE YOUR STARTING POINT</span><h3 id="packages-heading">Three ways to <span>move forward.</span></h3></div><p>Start with a website, connect your sales tools, or let us build and run the whole system.</p></div>
    <div className="service-packages-grid">{packages.map((item, index) => <article className={`service-package ${index === 2 ? "service-package-full" : ""}`} key={item.name}>
      <span className="service-package-label">{item.label}</span><h4>{item.name}</h4><p>{item.description}</p>
      <ul>{item.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
      <ProjectButton className="text-button" service={item.service} packageName={item.name}>Discuss {item.name}</ProjectButton>
    </article>)}</div>
    <p className="service-packages-note">We commit to the work and clear reporting. Rankings, lead counts and sales are never guaranteed.</p>
  </section>;
}

export function Services() {
  const [active, setActive] = useState<number | null>(0);
  return <section id="services" className="services-section services-overview light-section section-space" aria-labelledby="services-heading">
    <div className="container">
      <div>
        <SectionLabel number="03">WHAT WE DO</SectionLabel>
        <div className="section-heading-row">
          <WordReveal id="services-heading">What we <span className="serif-word">do.</span></WordReveal>
          <div className="section-intro"><p>Business websites, ecommerce stores and custom web apps, alongside advanced SEO and AEO, graphic design and lead-generation campaigns. We connect email outreach, website lead tracking and content with an AI sales dashboard, scripts, sales advice and CRM included.</p><a className="growth-jump" href="#growth-services">Explore our business growth services <Arrow diagonal /></a></div>
        </div>
      </div>
      <ServiceSystem />
      <nav className="service-guide-links" aria-label="Explore our services">{serviceLinks.map(service => <Link href={`/services/${service.slug}/`} key={service.slug}>{service.name} <Arrow diagonal width="1em" height="1em" /></Link>)}</nav>
      <div className="services-overview-list-label"><span>THE SYSTEM, PART BY PART</span><span>10 CONNECTED SERVICES</span></div>
      <div className="service-list">{services.map((service, index) => <Reveal key={service.name}>
        <div className={`service-item ${active === index ? "is-active" : ""}`}>
          <h3><button aria-expanded={active === index} aria-controls={`service-panel-${index}`} id={`service-trigger-${index}`} onClick={() => setActive(active === index ? null : index)}><span className="service-number">{String(index + 1).padStart(2, "0")}</span><span className="service-title">{service.name}</span><span className="service-toggle" aria-hidden="true">{active === index ? "−" : "+"}</span></button></h3>
          <div id={`service-panel-${index}`} role="region" aria-labelledby={`service-trigger-${index}`} className="service-panel" hidden={active !== index}>
            <div className="service-panel-inner"><div className="services-overview-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}<span>PART OF THE SYSTEM</span></div><div><p>{service.description}</p><div className="service-tags">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div><ProjectButton className="text-button dark-text" arrow={false} service={service.short}>Let’s talk {service.short.toLowerCase()}<Arrow diagonal /></ProjectButton></div></div>
          </div>
        </div>
      </Reveal>)}</div>
      <ServicePackages />
    </div>
  </section>;
}
