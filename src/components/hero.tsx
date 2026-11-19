"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow, FoundationAccent, Reveal } from "./ui";
import { ProjectButton } from "./site-shell";
import { WordReveal } from "./word-reveal";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const element = section.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <section ref={section} className="hero reference-hero" aria-labelledby="hero-heading">
    <div className="reference-hero-light" data-active={visible} aria-hidden="true" />
    <div className="container reference-hero-inner">
      <div className="reference-hero-content">
        <div className="reference-hero-eyebrow hero-enter"><span aria-hidden="true" /> MONETTIC · OUTREACH · CONTENT · SALES SYSTEMS</div>
        <WordReveal as="h1" id="hero-heading" delay={100}>We help your business<br /><span className="reference-hero-accent">win more clients.</span></WordReveal>
        <p className="reference-hero-description hero-enter delay-2">We run your outreach, build your content strategy and set up a sales system that gets clients over the line.</p>
        <div className="reference-hero-actions hero-enter delay-3">
          <ProjectButton className="reference-hero-primary" arrow={false}>Start a conversation <Arrow diagonal width="15" height="15" /></ProjectButton>
          <a href="#partners" className="reference-hero-secondary">Meet our clients <Arrow diagonal width="15" height="15" /></a>
        </div>
      </div>
      <div className="reference-hero-bottom"><span>OUTREACH · CONTENT · SALES SYSTEMS</span><a href="#services">EXPLORE WHAT WE DO <Arrow direction="down" width="14" height="14" /></a></div>
    </div>
  </section>;
}

export function DisciplineStrip() {
  return <div className="discipline-strip" aria-label="Lead scraping, email outreach, SEO and AEO, graphic design, content integration, AI integration and CRM"><div className="discipline-track">{[0, 1].map(copy => <div className="discipline-group" key={copy} aria-hidden={copy === 1}>{["Lead scraping", "Email outreach", "SEO + AEO", "Graphic design", "Content integration", "AI integration + CRM"].map(word => <span key={word}>{word}<FoundationAccent className="strip-accent" /></span>)}</div>)}</div></div>;
}

const coreServices = [
  { name: "Outreach", description: "We reach out to new clients for you, whether you sell to other businesses (B2B) or to the public (B2C)." },
  { name: "Content strategy", description: "We build a content plan for your business, so the right people see what you do." },
  { name: "Sales systems", description: "We set up a sales system that makes selling easier for your team and gets more clients over the line." },
];

export function CoreServices() {
  return <section className="core-services" aria-labelledby="core-services-heading"><div className="container">
    <Reveal><div className="core-services-heading"><span className="eyebrow">WHAT WE DO</span><h2 id="core-services-heading">A clearer path to your <em>next client.</em></h2></div></Reveal>
    <div className="core-services-grid">{coreServices.map((service, index) => <Reveal key={service.name} delay={index * .08}>
      <article className="core-service"><span className="core-service-number">0{index + 1}</span><h3>{service.name}</h3><p>{service.description}</p></article>
    </Reveal>)}</div>
  </div></section>;
}
