import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/content";
import { Arrow, Reveal } from "./ui";

// Logos have very different shapes (wide wordmarks vs. square badges).
// Sizing each one to a similar visual area keeps the wall balanced.
const LOGO_AREA = 8000;
const MAX_WIDTH = 200;
const MAX_HEIGHT = 76;
// Optical corrections: solid badges read larger, detailed emblems read smaller.
const opticalScale: Record<string, number> = { "dcb-spares": 0.82, "thunder-brothers": 1.14, "ctcpm-datawarehouse": 1.14, "fedpump": 0.95 };

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
  return <section id="partners" className="partners" aria-labelledby="partners-heading">
    <div className="partners-heading">
      <div><span className="eyebrow">OUR PARTNERS</span><h3 id="partners-heading">Businesses we’ve <span>built for.</span></h3></div>
      <p>Each logo opens a live website we designed and built. Click one to see it for yourself.</p>
    </div>
    <ul className="partners-grid" role="list">{projects.map((project, index) => {
      const size = logoSize(project.id, project.logo.width, project.logo.height);
      return <Reveal as="li" className="partner-item" key={project.id} delay={index % 3 * 0.07}>
        <a className="partner-tile" href={project.url} target="_blank" rel="noopener noreferrer" style={{ "--logo-w": `${size.width}px`, "--logo-h": `${size.height}px` } as CSSProperties}>
          <span className="partner-logo"><Image src={project.logo.src} alt="" width={size.width} height={size.height} loading="lazy" /></span>
          <span className="partner-meta"><span className="partner-name"><strong>{project.name}</strong><small>{project.category}</small></span><span className="partner-visit" aria-hidden="true"><Arrow diagonal /></span></span>
          <span className="sr-only"> — visit website (opens in a new tab)</span>
        </a>
      </Reveal>;
    })}</ul>
    <div className="partners-foot"><span>{String(projects.length).padStart(2, "0")} LIVE WEBSITES</span><Link href="/work/">See the full portfolio <Arrow diagonal width="1em" height="1em" /></Link></div>
  </section>;
}
