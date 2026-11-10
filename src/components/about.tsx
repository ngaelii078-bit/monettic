"use client";

import { Mark, Reveal, SectionLabel } from "./ui";
import { ProjectButton } from "./site-shell";
import { ScrollText } from "./scroll-text";

export function About() {
  return <section id="about" className="about-section section-space" aria-labelledby="about-heading">
    <div className="container">
      <Reveal><SectionLabel number="02" light>THE STUDIO</SectionLabel></Reveal>
      <div className="about-grid">
        <div className="about-left"><div className="studio-symbol" aria-hidden="true"><div className="symbol-ring" /><Mark /><span className="symbol-plus">+</span></div><div className="studio-caption">INDEPENDENT BY DESIGN.<br />COLLABORATIVE BY NATURE.</div></div>
        <div className="about-content">
          <h2 id="about-heading" className="sr-only">A little about monettic</h2>
          <ScrollText className="manifesto" text="Great things happen when bold thinking meets solid craft. We’re here to turn your next big idea into something that matters." highlightFrom={18} />
          <div className="about-detail"><p>monettic builds business websites, ecommerce stores, technology and education websites, portfolios and custom web apps across industries. Alongside design, advanced SEO and AEO, we connect lead-generation campaigns, lead scraping, email outreach and content with a sales dashboard, scripts, AI advice and CRM included.</p><ProjectButton className="text-button">Meet your next growth partner</ProjectButton></div>
        </div>
      </div>
      <div className="studio-values"><div><span>01</span><h3>Think with purpose.</h3><p>Start with the right questions.</p></div><div><span>02</span><h3>Make with care.</h3><p>Every detail earns its place.</p></div><div><span>03</span><h3>Build for what’s next.</h3><p>Solid foundations. Room to grow.</p></div></div>
    </div>
  </section>;
}
