"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/lib/content";
import { Arrow } from "./ui";

// Logos have very different shapes (wide wordmarks vs. square badges).
// Sizing each one to a similar visual area keeps the wall balanced.
const LOGO_AREA = 8000;
const MAX_WIDTH = 200;
const MAX_HEIGHT = 76;
// Optical corrections: solid badges read larger, detailed emblems read smaller.
const opticalScale: Record<string, number> = { "dcb-spares": 0.82, "thunder-brothers": 1.14, "ctcpm-datawarehouse": 1.14, "fedpump": 0.95 };

type Partner = { id: string; name: string; project?: Project };
const priorityPartners: Partner[] = [
  { id: "dcb-spares", name: "DCB Auto Spares", project: projects.find(project => project.id === "dcb-spares") },
  { id: "fedpump", name: "FedPump", project: projects.find(project => project.id === "fedpump") },
  { id: "routed", name: "Routed" },
  { id: "rage-festival", name: "Rage Festival" },
  { id: "10-four", name: "10-Four" },
  { id: "nutriflow", name: "NutriFlow" },
];
const partners: Partner[] = [
  ...priorityPartners,
  ...projects.filter(project => !priorityPartners.some(partner => partner.id === project.id)).map(project => ({ id: project.id, name: project.name, project })),
];

function logoSize(id: string, width: number, height: number) {
  const ratio = width / height;
  const scale = opticalScale[id] ?? 1;
  let w = Math.sqrt(LOGO_AREA * ratio) * scale;
  let h = w / ratio;
  if (w > MAX_WIDTH) { w = MAX_WIDTH; h = w / ratio; }
  if (h > MAX_HEIGHT) { h = MAX_HEIGHT; w = h * ratio; }
  return { width: Math.round(w), height: Math.round(h) };
}

export function Partners() {
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const section = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = section.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <section id="partners" className="partners light-section section-space" aria-labelledby="partners-heading"><div className="container">
    <div className="partners-heading">
      <div><span className="eyebrow">OUR CLIENTS</span><h2 id="partners-heading">Businesses we’ve <span>worked with.</span></h2></div>
      <p>Businesses we’ve worked with to build stronger connections and reach their goals.</p>
    </div>
    </div>
    <div className="partners-rail" ref={section} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.scrollLeft = 0; }}>
      <div className={`partners-track${paused || !visible ? " is-paused" : ""}`}>
        {[false, true].map(duplicate => <ul className="partners-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
          {partners.map(partner => {
            const project = partner.project;
            const size = project ? logoSize(project.id, project.logo.width, project.logo.height) : null;
            return <li className="partner-item" key={partner.id}>
              {project && size ? <a className={duplicate ? "partner-clone-link" : "partner-tile"} href={project.url} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} style={{ "--logo-w": `${size.width}px`, "--logo-h": `${size.height}px` } as CSSProperties}>
                <span className="partner-logo"><Image src={project.logo.src} alt="" width={size.width} height={size.height} loading="lazy" /></span>
                <span className="sr-only">{partner.name} — visit website (opens in a new tab)</span>
              </a> : <span className="partner-wordmark">{partner.name}</span>}
              <span className="partners-separator" aria-hidden="true" />
            </li>;
          })}
        </ul>)}
      </div>
    </div>
    <div className="container">
    <button className="partners-motion-toggle" type="button" onClick={() => setPaused(current => !current)}>{paused ? "Resume scrolling" : "Pause scrolling"}</button>
    <div className="partners-foot"><span>SELECTED CLIENTS</span><Link href="/work/">See the full portfolio <Arrow diagonal width="1em" height="1em" /></Link></div>
  </div></section>;
}
