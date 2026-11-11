"use client";

import Link from "next/link";
import { Arrow, FoundationAccent } from "./ui";
import { ProjectButton } from "./site-shell";
import { WordReveal } from "./word-reveal";
import { Horizon } from "./horizon";
import { HeroShowcase } from "./hero-showcase";

export function Hero() {
  return <section className="hero cinematic-hero" aria-labelledby="hero-heading">
    <Horizon />
    <div className="container hero-inner">
      <div className="hero-copy">
        <div className="eyebrow hero-enter"><span className="status-dot" />MONETTIC · SOUTH AFRICA</div>
        <WordReveal as="h1" id="hero-heading" delay={100}>Bold ideas.<br />Solid <span className="hero-italic">impact.</span></WordReveal>
        <p className="hero-description hero-enter delay-2">Websites, ecommerce, design and lead generation.<br />SEO + AEO, email outreach and integrated sales tools.</p>
        <Link className="hero-offer hero-enter delay-2" href="/services/ai-automation/">Website included with Full AI Integration <Arrow diagonal /></Link>
        <div className="hero-buttons hero-enter delay-3"><ProjectButton className="hero-orb" arrow={false}><Arrow diagonal /><span>Let’s make<br /><strong>it happen.</strong></span></ProjectButton></div>
      </div>
      <div className="hero-margin-note hero-note-left hero-enter delay-3"><span className="margin-note-number">01 — 03</span><p>Find.<br />Connect.<br /><em>Grow.</em></p><span className="margin-note-rule" /><span>BUILT AROUND YOUR BUSINESS.</span></div>
      <div className="hero-margin-note hero-note-right hero-enter delay-3"><span className="margin-note-number">FROM CAMPAIGNS<br />TO YOUR PIPELINE.</span><p>One system.<br /><em>A clear next step.</em></p><a href="#services">Explore what we do <Arrow diagonal /></a></div>
      <HeroShowcase />
      <div className="hero-bottom"><span>WEBSITES + OUTREACH + SALES SYSTEMS</span><span className="hero-bottom-mid">Good conversations. Real possibilities.</span><a href="#services">SCROLL TO EXPLORE <span><Arrow direction="down" width="1em" height="1em" /></span></a></div>
    </div>
  </section>;
}

export function DisciplineStrip() {
  return <div className="discipline-strip" aria-label="Lead scraping, email outreach, SEO and AEO, graphic design, content integration, AI integration and CRM"><div className="discipline-track">{[0, 1].map(copy => <div className="discipline-group" key={copy} aria-hidden={copy === 1}>{["Lead scraping", "Email outreach", "SEO + AEO", "Graphic design", "Content integration", "AI integration + CRM"].map(word => <span key={word}>{word}<FoundationAccent className="strip-accent" /></span>)}</div>)}</div></div>;
}
