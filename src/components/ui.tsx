"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode, SVGProps } from "react";

const arrowPaths = {
  right: "M4 12h15m-6-6 6 6-6 6",
  left: "M20 12H5m6-6-6 6 6 6",
  up: "M12 20V5m-6 6 6-6 6 6",
  down: "M12 4v15m-6-6 6 6 6-6",
};

export function Arrow({ diagonal = false, direction = "right", className = "", ...props }: SVGProps<SVGSVGElement> & { diagonal?: boolean; direction?: keyof typeof arrowPaths }) {
  return <svg className={`icon-arrow ${className}`.trim()} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}><path d={diagonal ? "M5 19 19 5M5 5h14v14" : arrowPaths[direction]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function FoundationAccent({ className = "" }: { className?: string }) {
  return <svg className={`foundation-accent ${className}`.trim()} width="1em" height="1em" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false"><path d="m24 4 18 10v20L24 44 6 34V14L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="m6 14 18 10 18-10M24 24v20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>;
}

export function Mark({ className = "" }: { className?: string }) {
  return <svg className={className} width="37" height="37" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M5 34V6h7l8 12L28 6h7v28h-7V18l-8 11-8-11v16H5Z" fill="currentColor" /></svg>;
}

export function Reveal({ children, className = "", delay = 0, as = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" }) {
  const reduced = useReducedMotion();
  const Component = as === "li" ? motion.li : motion.div;
  return <Component className={className} initial={false} whileInView={reduced ? undefined : { opacity: [0.15, 1], y: [24, 0] }} viewport={{ once: true, margin: "0px 0px -40px 0px" }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}>{children}</Component>;
}

export function SectionLabel({ number, children, light = false }: { number: string; children: ReactNode; light?: boolean }) {
  return <div className={`section-label ${light ? "label-light" : ""}`}><span className="label-cross" aria-hidden="true">+</span><span>{number} / {children}</span></div>;
}
