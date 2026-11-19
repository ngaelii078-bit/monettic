import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/content";
import { featuredWorkIds } from "@/lib/home-content";
import { Arrow, Reveal } from "../ui";
import { Eyebrow, SectionHead } from "./primitives";

const featured = featuredWorkIds.map(id => projects.find(project => project.id === id)!).filter(Boolean);

export function Work() {
  return <section id="work" className="mx-work mx-light mx-tint" aria-labelledby="work-heading" data-route="0.03" data-station="04 · build">
    <div className="mx-wrap">
      <SectionHead label="The work" id="work-heading" title="client sites, live right now." dim="not mockups. click through." />
      <ul className="mx-work-grid">
        {featured.map((project, index) => <Reveal as="li" key={project.id} delay={index * 0.07} className="mx-work-cell">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="mx-work-card">
            <span className="mx-work-shot"><Image src={project.image} alt={`${project.name} website homepage`} width={1200} height={900} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 300px" /></span>
            <span className="mx-work-index">{String(index + 1).padStart(2, "0")}</span>
            <strong>{project.name}</strong>
            <Eyebrow>{project.category}</Eyebrow>
            <span className="mx-work-focus">{project.focus.join(" · ")}</span>
            <span className="mx-work-go">Visit the site <Arrow diagonal width="12" height="12" /><span className="sr-only"> (opens in a new tab)</span></span>
          </a>
        </Reveal>)}
      </ul>
      <div className="mx-work-foot">
        <p>Each one designed and built by monettic, and live today.</p>
        <Link href="/work/" className="mx-link">All {projects.length} client sites <Arrow width="13" height="13" /></Link>
      </div>
    </div>
  </section>;
}
