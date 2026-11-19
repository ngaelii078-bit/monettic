"use client";

import { useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { WordReveal } from "../word-reveal";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Mono uppercase label used at the left of every section, as in the reference. */
export function Eyebrow({ children, dot = false, className = "", ...rest }: { children: ReactNode; dot?: boolean; className?: string } & HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={`mx-eyebrow ${className}`.trim()}>{dot && <i className="mx-dot" aria-hidden="true" />}{children}</span>;
}

/** Label on the left, two-tone heading on the right. */
export function SectionHead({ label, id, title, dim, aside, align = "split" }: { label: string; id: string; title: ReactNode; dim: ReactNode; aside?: ReactNode; align?: "split" | "stack" }) {
  return <div className={`mx-head mx-head-${align}`}>
    <Eyebrow>{label}</Eyebrow>
    <div className="mx-head-main">
      <WordReveal id={id} className="mx-h2">{title}<br /><span className="mx-dim">{dim}</span></WordReveal>
      {aside}
    </div>
  </div>;
}

/** Counts up once when scrolled into view. Server HTML carries the real value. */
export function CountUp({ value, suffix = "", duration = 1500 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useIsoLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const format = (n: number) => `${Math.round(n).toLocaleString("en-ZA")}${suffix}`;
    element.textContent = format(0);
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        element.textContent = format(value * (1 - Math.pow(2, -10 * t)));
        if (t < 1) frame = requestAnimationFrame(tick);
        else element.textContent = format(value);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); element.textContent = format(value); };
  }, [value, suffix, duration]);
  return <span ref={ref}>{`${value.toLocaleString("en-ZA")}${suffix}`}</span>;
}

/** Tracks whether an element is on screen, so off-screen motion can pause. */
export function useOnScreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, visible] as const;
}

/**
 * Endless horizontal strip. The second copy is hidden from assistive tech and
 * the keyboard; motion pauses on hover, on focus, off screen, or by toggle.
 */
export function Marquee({ label, items, paused, speed = 48, className = "" }: { label: string; items: (duplicate: boolean) => ReactNode; paused: boolean; speed?: number; className?: string }) {
  const [ref, visible] = useOnScreen<HTMLDivElement>();
  return <div ref={ref} className={`mx-marquee ${className}`.trim()}>
    <div className={`mx-marquee-track${paused || !visible ? " is-paused" : ""}`} style={{ animationDuration: `${speed}s` }}>
      {[false, true].map(duplicate => <ul key={String(duplicate)} className="mx-marquee-group" aria-label={duplicate ? undefined : label} aria-hidden={duplicate || undefined}>{items(duplicate)}</ul>)}
    </div>
  </div>;
}
