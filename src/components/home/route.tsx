"use client";

import { useEffect, useRef } from "react";

type Vertex = { x: number; y: number };
type Station = { x: number; y: number; label: string; side: 1 | -1; length: number; node?: SVGGElement };

const SVG_NS = "http://www.w3.org/2000/svg";
const STEP = 4;          // sampling resolution along the route, px
const HEAD = 96;         // length of the bright leading segment, px
const SPACING = 190;     // distance between flowing leads, px
const SPEED = 64;        // lead travel speed, px per second
const CORNER = 34;       // corner radius, taken from the curve of the "t" in the Mt monogram
const POOL = 28;         // max leads drawn at once

/** Straight runs joined by rounded corners, so the route reads as an engineered pipeline. */
function roundedPath(points: Vertex[]) {
  const v = points.filter((p, i) => i === 0 || Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) > 0.5);
  if (v.length < 2) return "";
  let d = `M${v[0].x.toFixed(1)} ${v[0].y.toFixed(1)}`;
  for (let i = 1; i < v.length - 1; i++) {
    const a = v[i - 1], p = v[i], b = v[i + 1];
    const la = Math.hypot(a.x - p.x, a.y - p.y), lb = Math.hypot(b.x - p.x, b.y - p.y);
    const r = Math.min(CORNER, la / 2, lb / 2);
    const p1 = { x: p.x + (a.x - p.x) / la * r, y: p.y + (a.y - p.y) / la * r };
    const p2 = { x: p.x + (b.x - p.x) / lb * r, y: p.y + (b.y - p.y) / lb * r };
    const sweep = (p.x - a.x) * (b.y - p.y) - (p.y - a.y) * (b.x - p.x) > 0 ? 1 : 0;
    d += ` L${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 ${sweep} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  const last = v[v.length - 1];
  return `${d} L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
}

/**
 * The pipeline route: a cyan line that leaves the hero label, runs down the page margins,
 * sweeps across each section seam and plugs into the closing "book a call" button.
 * Leads flow along the drawn part; numbered stations light up as the line reaches them.
 *
 * Markup contract (inside <main>):
 *   data-route-start  data-route="x"           where the route begins (right edge of that element)
 *   data-route="x" [data-route-offset] [data-station="NN · name"]   rail x (fraction of width) from that element's top
 *   data-route-end                            where it ends (left edge, vertical centre)
 */
export function Route() {
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGGElement>(null);
  const leadsRef = useRef<SVGGElement>(null);
  const stationsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current, base = baseRef.current, head = headRef.current, tip = tipRef.current, leadsLayer = leadsRef.current, stationsLayer = stationsRef.current;
    const main = svg?.parentElement;
    if (!svg || !base || !head || !tip || !leadsLayer || !stationsLayer || !main) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let xs = new Float32Array(0), ys = new Float32Array(0), count = 0, total = 0;
    let stations: Station[] = [];
    let target = 0, shown = 0, drawnSet = -1, raf = 0, last = 0, built = false;

    const leads: SVGRectElement[] = [];
    for (let i = 0; i < POOL; i++) {
      const lead = document.createElementNS(SVG_NS, "rect");
      lead.setAttribute("x", "-1.75"); lead.setAttribute("y", "-1.75"); lead.setAttribute("width", "3.5"); lead.setAttribute("height", "3.5");
      lead.setAttribute("class", "mx-route-lead");
      leadsLayer.appendChild(lead);
      leads.push(lead);
    }

    /** First sample at or below y (the route only ever moves down or sideways). */
    const indexForY = (y: number) => {
      let lo = 0, hi = count - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (ys[mid] < y) lo = mid + 1; else hi = mid; }
      return lo;
    };

    const computeTarget = () => {
      if (!count) return;
      const y = -main.getBoundingClientRect().top + window.innerHeight * 0.62;
      const i = indexForY(y);
      target = i >= count - 1 && y >= ys[count - 1] ? total : i * STEP;
    };

    const build = () => {
      const start = main.querySelector<HTMLElement>("[data-route-start]");
      const end = main.querySelector<HTMLElement>("[data-route-end]");
      if (!start || !end) return;
      const width = main.clientWidth;
      const box = main.getBoundingClientRect();
      const compact = width < 900;
      const rail = (fraction: string | undefined) => compact ? 10 : parseFloat(fraction ?? "0.5") * width;
      const rel = (element: Element) => { const r = element.getBoundingClientRect(); return { left: r.left - box.left, right: r.right - box.left, top: r.top - box.top, mid: r.top - box.top + r.height / 2 }; };

      const s = rel(start);
      let x = rail(start.dataset.route);
      const vertices: Vertex[] = compact ? [{ x, y: s.mid }] : [{ x: s.right + 22, y: s.mid }, { x, y: s.mid }];
      const pending: Omit<Station, "length">[] = [];
      if (start.dataset.station) pending.push({ x, y: s.mid + 70, label: start.dataset.station, side: x > width / 2 ? -1 : 1 });
      main.querySelectorAll<HTMLElement>("[data-route]:not([data-route-start])").forEach(element => {
        const r = rel(element);
        const nextX = rail(element.dataset.route);
        const turnY = r.top + parseFloat(element.dataset.routeOffset ?? "0");
        if (Math.abs(nextX - x) > 1) { vertices.push({ x, y: turnY }, { x: nextX, y: turnY }); x = nextX; }
        if (element.dataset.station) pending.push({ x, y: turnY + 70, label: element.dataset.station, side: x > width / 2 ? -1 : 1 });
      });
      const e = rel(end);
      vertices.push({ x, y: e.mid });
      const endX = !compact && e.left - 18 > x + 8 ? e.left - 18 : x;
      if (endX !== x) vertices.push({ x: endX, y: e.mid });

      const d = roundedPath(vertices);
      const height = main.scrollHeight;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;
      base.setAttribute("d", d);
      head.setAttribute("d", d);
      total = base.getTotalLength();
      count = Math.floor(total / STEP) + 1;
      xs = new Float32Array(count); ys = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const p = base.getPointAtLength(Math.min(total, i * STEP));
        xs[i] = p.x; ys[i] = i ? Math.max(p.y, ys[i - 1]) : p.y;
      }
      base.style.strokeDasharray = `${total} ${total}`;
      head.style.strokeDasharray = `${HEAD} ${total + HEAD}`;

      stationsLayer.replaceChildren();
      stations = [...pending.map(st => ({ ...st, length: indexForY(st.y) * STEP })), { x: endX, y: e.mid, label: "", side: 1 as const, length: total - 1 }];
      stations.forEach((st, i) => {
        const g = document.createElementNS(SVG_NS, "g");
        g.setAttribute("class", i === stations.length - 1 ? "mx-route-station mx-route-socket" : "mx-route-station");
        g.setAttribute("transform", `translate(${st.x.toFixed(1)} ${st.y.toFixed(1)})`);
        const size = i === stations.length - 1 ? 12 : 9;
        const square = document.createElementNS(SVG_NS, "rect");
        square.setAttribute("x", String(-size / 2)); square.setAttribute("y", String(-size / 2));
        square.setAttribute("width", String(size)); square.setAttribute("height", String(size));
        g.appendChild(square);
        if (st.label) {
          const text = document.createElementNS(SVG_NS, "text");
          text.setAttribute("class", "mx-route-label");
          text.setAttribute("transform", `rotate(90) translate(16 ${st.side === 1 ? -12 : 19})`);
          text.textContent = st.label;
          g.appendChild(text);
        }
        stationsLayer.appendChild(g);
        st.node = g;
      });

      computeTarget();
      if (!built) { shown = 0; built = true; }
      shown = Math.min(shown, total);
      drawnSet = -1;
      if (reduced.matches) render(performance.now());
    };

    const pointAt = (length: number) => {
      const i = Math.max(0, Math.min(count - 1, Math.round(length / STEP)));
      return { x: xs[i], y: ys[i] };
    };

    const render = (now: number) => {
      if (!count) return;
      const still = reduced.matches;
      const drawn = still ? total : shown;
      if (Math.abs(drawn - drawnSet) > 0.4) {
        drawnSet = drawn;
        base.style.strokeDashoffset = String(total - drawn);
        head.style.strokeDashoffset = String(-(drawn - HEAD));
        const tipPoint = pointAt(drawn);
        tip.setAttribute("transform", `translate(${tipPoint.x.toFixed(1)} ${tipPoint.y.toFixed(1)})`);
        for (const st of stations) st.node?.setAttribute("data-on", String(st.length <= drawn + 1));
      }
      tip.style.opacity = still || drawn < 4 ? "0" : "1";
      // Leads flow along the drawn part of the route that is on screen.
      let used = 0;
      if (!still) {
        const viewTop = -main.getBoundingClientRect().top;
        const lo = indexForY(viewTop - 30) * STEP;
        const hi = Math.min(drawn - HEAD * 0.4, indexForY(viewTop + window.innerHeight + 30) * STEP);
        const phase = (now / 1000 * SPEED) % SPACING;
        for (let k = Math.max(0, Math.ceil((lo - phase) / SPACING)); used < POOL; k++) {
          const length = phase + k * SPACING;
          if (length > hi) break;
          const p = pointAt(length);
          leads[used].setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
          leads[used].style.display = "";
          used++;
        }
      }
      for (let i = used; i < POOL; i++) leads[i].style.display = "none";
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      if (!count) return;
      const diff = target - shown;
      shown = Math.abs(diff) > 0.5 ? shown + diff * (1 - Math.exp(-5.5 * dt / 1000)) : target;
      render(now);
    };

    let rebuild = 0;
    const scheduleBuild = () => { cancelAnimationFrame(rebuild); rebuild = requestAnimationFrame(build); };
    const onScroll = () => computeTarget();
    const onMotionChange = () => { drawnSet = -1; render(performance.now()); };

    build();
    raf = requestAnimationFrame(frame);
    const resize = new ResizeObserver(scheduleBuild);
    resize.observe(main);
    document.fonts?.ready.then(scheduleBuild);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleBuild);
    reduced.addEventListener("change", onMotionChange);
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleBuild);
      reduced.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rebuild);
      leadsLayer.replaceChildren();
      stationsLayer.replaceChildren();
    };
  }, []);

  return <svg ref={svgRef} className="mx-route" aria-hidden="true" focusable="false" preserveAspectRatio="none">
    <path ref={baseRef} className="mx-route-base" />
    <path ref={headRef} className="mx-route-head" />
    <g ref={stationsRef} />
    <g ref={leadsRef} />
    <g ref={tipRef} className="mx-route-tip"><rect className="mx-route-halo" x="-9" y="-9" width="18" height="18" /><rect className="mx-route-core" x="-4" y="-4" width="8" height="8" /></g>
  </svg>;
}
