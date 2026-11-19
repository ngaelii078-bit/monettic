"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mark } from "./ui";
import "./platforms.css";

const platforms = [
  { name: "Anthropic", icon: "/images/platforms/anthropic.svg" },
  { name: "OpenAI", icon: "/images/platforms/openai.svg" },
  { name: "Vercel", icon: "/images/platforms/vercel.svg" },
  { name: "Monettic Personal Board", monettic: true },
  { name: "Higgsfield" },
  { name: "Firecrawl", icon: "/images/platforms/firecrawl.svg" },
  { name: "Notion", icon: "/images/platforms/notion.svg" },
];

const comingSoon = ["GoHighLevel", "Apollo", "Instantly"];

export function Platforms() {
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rail.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <section className="platforms-section section-space" aria-labelledby="platforms-heading">
    <div className="container">
      <div className="platforms-heading">
        <div><span className="eyebrow">OUR TOOLKIT</span><h2 id="platforms-heading">The platforms <em>we use.</em></h2></div>
        <p>We bring the right tools together around your business and your team.</p>
      </div>
    </div>
    <div className="platforms-rail" ref={rail}>
      <div className={`platforms-track${paused || !visible ? " is-paused" : ""}`}>
        {[false, true].map(duplicate => <ul className="platforms-list" aria-label={duplicate ? undefined : "Platforms we use"} aria-hidden={duplicate || undefined} key={String(duplicate)}>
          {platforms.map(platform => <li className="platforms-item" key={platform.name}><span className="platforms-brand">{"icon" in platform && platform.icon && <Image className="platforms-icon" src={platform.icon} width={25} height={25} alt="" />}{"monettic" in platform && platform.monettic && <Mark className="platforms-monettic-icon" />}<span>{platform.name}</span></span></li>)}
          {comingSoon.map(name => <li className="platforms-item platforms-item-soon" key={name}><span>{name}</span><small>Coming soon</small></li>)}
          <li className="platforms-item platforms-item-more"><span>and more</span></li>
        </ul>)}
      </div>
    </div>
    <div className="container"><button className="platforms-motion-toggle" type="button" onClick={() => setPaused(current => !current)}>{paused ? "Resume platform scrolling" : "Pause platform scrolling"}</button></div>
  </section>;
}
