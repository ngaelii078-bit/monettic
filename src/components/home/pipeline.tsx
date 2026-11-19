"use client";

import { useEffect, useRef, useState } from "react";
import { handoverStage, pipelineStages } from "@/lib/home-content";
import { ProjectButton } from "../site-shell";
import { Arrow } from "../ui";
import { Eyebrow, SectionHead } from "./primitives";

export function Pipeline() {
  const steps = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = steps.current;
    if (!list || !("IntersectionObserver" in window)) return;
    const items = list.querySelectorAll<HTMLElement>("[data-step]");
    const observer = new IntersectionObserver(entries => {
      const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(Number(hit.target.getAttribute("data-step")));
    }, { rootMargin: "-45% 0px -54% 0px" });
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const handedOver = active >= handoverStage;

  return <section id="outreach" className="mx-pipeline mx-dark" aria-labelledby="pipeline-heading" data-route="0.03" data-station="03 · reach">
    <div className="mx-wrap">
      <SectionHead label="How it runs" id="pipeline-heading" title="one campaign, lead to client." dim="your team takes the call." />
      <div className="mx-pipeline-grid" data-route="0.5" data-route-offset="-48">
        <div className="mx-pipeline-aside">
          <figure className="mx-funnel" aria-label="The six stages of a monettic outreach campaign">
            <div className="mx-funnel-top"><Eyebrow>One campaign · six stages</Eyebrow><Eyebrow>monettic</Eyebrow></div>
            <ol className="mx-funnel-rows">
              {pipelineStages.map((stage, index) => <li key={stage.label} className="mx-funnel-row" data-state={index < active ? "done" : index === active ? "active" : "next"} data-handover={index === handoverStage || undefined}>
                <i className="mx-funnel-node" aria-hidden="true" />
                <span className="mx-funnel-label">{stage.label}</span>
                <span className="mx-funnel-bar" aria-hidden="true"><b style={{ width: `${stage.bar}%` }} /></span>
                <span className="mx-funnel-out">{stage.short}</span>
              </li>)}
            </ol>
            <div className="mx-handover" data-on={handedOver}><span>your team takes over here.</span><Eyebrow>Calls booked</Eyebrow></div>
            <figcaption>Illustrative shape. Real volumes depend on your market and your offer.</figcaption>
          </figure>
        </div>
        <div className="mx-pipeline-steps">
          <ol ref={steps} aria-label="Outreach process">
            {pipelineStages.map((stage, index) => <li key={stage.label} className="mx-step" data-step={index} data-active={index === active}>
              <Eyebrow>{String(index + 1).padStart(2, "0")} · {stage.label}</Eyebrow>
              <h3>{stage.heading}</h3>
              <p>{stage.description}</p>
            </li>)}
          </ol>
          <div className="mx-step-cta"><ProjectButton className="mx-btn mx-btn-light" service="Lead generation" arrow={false}>talk about outreach <Arrow width="16" height="16" /></ProjectButton></div>
        </div>
      </div>
    </div>
  </section>;
}
