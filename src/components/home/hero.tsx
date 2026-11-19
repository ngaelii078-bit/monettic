"use client";

import { heroPromises, heroStats } from "@/lib/home-content";
import { ProjectButton } from "../site-shell";
import { Arrow } from "../ui";
import { WordReveal } from "../word-reveal";
import { CountUp, Eyebrow, useOnScreen } from "./primitives";

export function HomeHero() {
  const [ref, visible] = useOnScreen<HTMLElement>();
  return <section ref={ref} className="mx-hero mx-dark" aria-labelledby="hero-heading">
    <div className="mx-glow" data-active={visible} aria-hidden="true"><i /><i /><i /></div>
    <div className="mx-grain" aria-hidden="true" />
    <div className="mx-wrap mx-hero-inner">
      <Eyebrow dot className="mx-enter" data-route-start data-route="0.97" data-station="01 · signal">Outreach · content · sales systems · one team</Eyebrow>
      <WordReveal as="h1" id="hero-heading" className="mx-h1" delay={80}>we find your next clients.<br /><em className="mx-serif">then help you close them.</em></WordReveal>
      <p className="mx-hero-copy mx-enter mx-d2">We research your market, run personal email outreach and hand every warm reply to your team, with a sales dashboard and CRM ready to close it.</p>
      <div className="mx-actions mx-enter mx-d3">
        <ProjectButton className="mx-btn mx-btn-light" arrow={false}>book a call <Arrow width="16" height="16" /></ProjectButton>
        <a href="#partners" className="mx-btn mx-btn-ghost">see our clients</a>
      </div>
      <ul className="mx-promises mx-enter mx-d4" aria-label="How we work">
        {heroPromises.map(promise => <li key={promise}><i className="mx-dot" aria-hidden="true" />{promise}</li>)}
      </ul>
      <dl className="mx-stats mx-enter mx-d5">
        {heroStats.map(stat => <div className="mx-stat" key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd><strong><CountUp value={stat.value} suffix={stat.suffix} /></strong><span aria-hidden="true">{stat.label}</span></dd>
        </div>)}
      </dl>
    </div>
  </section>;
}
