"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/lib/content";
import { Arrow, LogoTile } from "../ui";
import { Eyebrow, Marquee } from "./primitives";

// Logos come in very different shapes; size each to a similar visual area.
const LOGO_AREA = 5200;
const MAX_W = 168;
const MAX_H = 52;
const optical: Record<string, number> = { "dcb-spares": 0.84, "thunder-brothers": 1.12, "ctcpm-datawarehouse": 1.1, fedpump: 0.92 };
function logoSize(project: Project) {
  const ratio = project.logo.width / project.logo.height;
  let w = Math.sqrt(LOGO_AREA * ratio) * (optical[project.id] ?? 1);
  let h = w / ratio;
  if (w > MAX_W) { w = MAX_W; h = w / ratio; }
  if (h > MAX_H) { h = MAX_H; w = h * ratio; }
  return { width: Math.round(w), height: Math.round(h) };
}

type Client = { name: string; project?: Project };
const leadClients = ["dcb-spares", "fedpump"];
const clients: Client[] = [
  ...leadClients.map(id => projects.find(p => p.id === id)!).map(project => ({ name: project.name, project })),
  { name: "Routed" }, { name: "Rage Festival" }, { name: "10-Four" }, { name: "NutriFlow" },
  ...projects.filter(p => !leadClients.includes(p.id)).map(project => ({ name: project.name, project })),
];

const platforms = [
  { name: "Anthropic", icon: "/images/platforms/anthropic.svg" },
  { name: "OpenAI", icon: "/images/platforms/openai.svg" },
  { name: "Vercel", icon: "/images/platforms/vercel.svg" },
  { name: "Firecrawl", icon: "/images/platforms/firecrawl.svg" },
  { name: "Notion", icon: "/images/platforms/notion.svg" },
  { name: "Higgsfield" },
  { name: "GoHighLevel", soon: true },
  { name: "Apollo", soon: true },
  { name: "Instantly", soon: true },
];

export function Proof() {
  const [paused, setPaused] = useState(false);
  return <section id="partners" className="mx-proof mx-light" aria-labelledby="partners-heading" data-route="0.97" data-station="02 · find">
    <h2 id="partners-heading" className="sr-only">Clients and platforms</h2>
    <div className="mx-wrap">
      <div className="mx-proof-row mx-proof-lead">
        <Eyebrow>Track record</Eyebrow>
        <p><strong>{projects.length} client websites live</strong> for businesses from commercial property to pumps, car care and churches.</p>
        <Link href="/work/" className="mx-link">See the portfolio <Arrow diagonal width="13" height="13" /></Link>
      </div>
      <div className="mx-proof-row">
        <Eyebrow>Clients</Eyebrow>
        <Marquee label="Clients" paused={paused} speed={46} className="mx-logos" items={duplicate => clients.map(client => {
          const project = client.project;
          if (!project) return <li key={client.name}><span className="mx-wordmark">{client.name}</span></li>;
          const size = logoSize(project);
          return <li key={client.name}><a href={project.url} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} className="mx-logo" style={{ "--w": `${size.width}px`, "--h": `${size.height}px` } as CSSProperties}>
            <Image src={project.logo.src} alt="" width={size.width} height={size.height} loading="lazy" />
            <span className="sr-only">{client.name}, visit website (opens in a new tab)</span>
          </a></li>;
        })} />
      </div>
      <div className="mx-proof-row">
        <Eyebrow>Built on</Eyebrow>
        <Marquee label="Platforms we use" paused={paused} speed={40} className="mx-stack" items={() => <>
          <li className="mx-own"><LogoTile className="mx-own-mark" /><span>Monettic Personal Board</span><small>our own platform</small></li>
          {platforms.map(platform => <li key={platform.name} className={platform.soon ? "is-soon" : undefined}>
            {platform.icon && <Image src={platform.icon} alt="" width={22} height={22} />}<span>{platform.name}</span>{platform.soon && <small>soon</small>}
          </li>)}
        </>} />
      </div>
      <div className="mx-proof-foot"><button type="button" className="mx-pause" aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? "Resume scrolling" : "Pause scrolling"}</button></div>
    </div>
  </section>;
}
