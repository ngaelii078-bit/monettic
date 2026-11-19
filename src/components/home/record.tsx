"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "@/lib/content";
import { serviceSlugs } from "@/lib/home-content";
import { ProjectButton } from "../site-shell";
import { Arrow } from "../ui";
import { Eyebrow, Marquee, SectionHead } from "./primitives";

export function Record() {
  const [paused, setPaused] = useState(false);
  return <section id="services" className="mx-record mx-light mx-tint" aria-labelledby="services-heading" data-route="0.97" data-station="07 · grow">
    <div className="mx-wrap">
      <SectionHead align="stack" label="What we do" id="services-heading" title={`${services.length} services, one system.`} dim="everything your pipeline needs, connected." aside={<Link href="/services/" className="mx-btn mx-btn-dark">see all services <Arrow width="16" height="16" /></Link>} />
    </div>
    <Marquee label="Services" paused={paused} speed={70} className="mx-record-rail" items={duplicate => services.map((service, index) => {
      const slug = serviceSlugs[service.short];
      const inner = <>
        <span className="mx-record-top"><span className="mx-record-n">{String(index + 1).padStart(2, "0")}</span><Eyebrow>{service.short}</Eyebrow></span>
        <strong>{service.name}</strong>
        <span className="mx-record-tags">{service.tags.slice(0, 2).join(" · ")}</span>
        <span className="mx-record-go">{slug ? "Read more" : "Ask about this"} <Arrow width="12" height="12" /></span>
      </>;
      return <li key={service.short} className="mx-record-card">
        {slug
          ? <Link href={`/services/${slug}/`} tabIndex={duplicate ? -1 : undefined} aria-label={`${service.name}: read more`}>{inner}</Link>
          : duplicate ? <span>{inner}</span> : <ProjectButton className="mx-record-button" service={service.short} arrow={false} label={`Ask about ${service.name}`}>{inner}</ProjectButton>}
      </li>;
    })} />
    <div className="mx-wrap mx-record-foot"><button type="button" className="mx-pause" aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? "Resume service scrolling" : "Pause service scrolling"}</button></div>
  </section>;
}
