"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectButton } from "./site-shell";
import { Arrow, SectionLabel } from "./ui";
import "./outreach-pipeline.css";

const outreachSteps = [
  {
    label: "Leads found",
    heading: "Start with the right audience.",
    description: "We define who your business wants to reach, whether you sell to other businesses, consumers or both.",
  },
  {
    label: "Contacts sourced",
    heading: "Build a clearer lead list.",
    description: "We organise available contact details from public and approved sources, review audience fit and remove duplicates.",
  },
  {
    label: "Emails sent",
    heading: "Reach out with purpose.",
    description: "We prepare outreach around your offer and audience, with messages reviewed before they are sent.",
  },
  {
    label: "Replies",
    heading: "Make every response useful.",
    description: "Replies are organised for your team. A no or no response ends outreach, and contact preferences are respected.",
  },
  {
    label: "Calls booked",
    heading: "Move the conversation forward.",
    description: "Interested leads reach your team with context so you can follow up and arrange a conversation.",
  },
  {
    label: "Clients closed",
    heading: "Keep the next step in view.",
    description: "Your team can track conversations, sales progress and closed clients together in the CRM.",
  },
] as const;

export function OutreachPipeline() {
  const section = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const element = section.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const steps = element.querySelectorAll<HTMLElement>("[data-outreach-step]");
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const index = visible[0]?.target.getAttribute("data-outreach-step");
      if (index !== undefined && index !== null) setActiveStep(Number(index));
    }, { rootMargin: "-25% 0px -55% 0px", threshold: 0 });
    steps.forEach(step => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return <section ref={section} id="outreach" className="outreach-pipeline section-space" aria-labelledby="outreach-pipeline-heading">
    <div className="container">
      <SectionLabel number="03" light>HOW OUTREACH WORKS</SectionLabel>
      <div className="outreach-pipeline-intro">
        <h2 id="outreach-pipeline-heading">From first contact to <span>the next client.</span></h2>
        <p>A connected process for finding the right people, starting conversations and helping your team follow up.</p>
      </div>
      <div className="outreach-pipeline-layout">
        <div className="outreach-pipeline-aside" aria-hidden="true">
          <div className="outreach-pipeline-card">
            <div className="outreach-pipeline-card-top"><span>THE OUTREACH JOURNEY</span><span>MONETTIC</span></div>
            <div className="outreach-pipeline-rail">
              {outreachSteps.map((step, index) => <div className="outreach-pipeline-rail-item" data-active={activeStep === index} key={step.label}>
                <span className="outreach-pipeline-node" /><span>{step.label}</span><span className="outreach-pipeline-rule" />
              </div>)}
            </div>
            <div className="outreach-pipeline-card-foot">ONE CONNECTED PROCESS <Arrow diagonal width="14" height="14" /></div>
          </div>
        </div>
        <ol className="outreach-pipeline-steps" aria-label="Outreach process">
          {outreachSteps.map((step, index) => <li className="outreach-pipeline-step" data-outreach-step={index} data-active={activeStep === index} key={step.label}>
            <div className="outreach-pipeline-step-label"><span>{String(index + 1).padStart(2, "0")}</span><span>{step.label}</span></div>
            <h3>{step.heading}</h3>
            <p>{step.description}</p>
          </li>)}
        </ol>
      </div>
      <div className="outreach-pipeline-action"><p>Outreach, content and your sales tools work together around your business.</p><ProjectButton className="button button-lime" service="Lead generation">Talk about outreach</ProjectButton></div>
    </div>
  </section>;
}
