"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { projects, type Project } from "@/lib/content";
import { Arrow, Reveal } from "./ui";
import { WordReveal } from "./word-reveal";
import { ProjectButton } from "./site-shell";
import { ProjectDetails } from "./project-details";
import { PortfolioCard } from "./portfolio-card";

const filters = ["All work", ...new Set(projects.map(project => project.group))];

export function WorkPortfolio() {
  const [filter, setFilter] = useState("All work");
  const [selected, setSelected] = useState(projects[0]);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = projects.filter(project => filter === "All work" || project.group === filter);
  const openProject = (project: Project) => {
    setSelected(project);
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
  };

  return <section id="work" className="portfolio-section portfolio-page" aria-labelledby="work-heading">
    <div className="container">
      <header className="portfolio-intro">
        <nav aria-label="Breadcrumb" className="portfolio-breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Our work</span></nav>
        <div className="portfolio-intro-grid">
          <div>
            <p className="portfolio-eyebrow"><span /> THE MONETTIC PORTFOLIO</p>
            <WordReveal as="h1" id="work-heading">Our work.<br /><span className="portfolio-title-accent">Out in the world.</span></WordReveal>
          </div>
          <div className="portfolio-introduction">
            <p>Different industries. Individual stories.<br />Websites made to bring each one to life.</p>
            <div className="portfolio-edition"><span className="portfolio-edition-number">{String(projects.length).padStart(2, "0")}</span><span>WEBSITES TO EXPLORE<br /><span>Designed for every screen.</span></span></div>
            <a href="#portfolio-collection" className="portfolio-jump">Explore the work <Arrow /></a>
          </div>
        </div>
      </header>

      <div id="portfolio-collection" className="portfolio-collection">
        <div className="work-toolbar portfolio-toolbar">
          <div className="work-filters" role="group" aria-label="Filter projects">
            {filters.map(item => {
              const count = item === "All work" ? projects.length : projects.filter(project => project.group === item).length;
              return <button key={item} aria-label={item} aria-pressed={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}<span className="portfolio-filter-count" aria-hidden="true">{String(count).padStart(2, "0")}</span></button>;
            })}
          </div>
          <span className="work-count" role="status">{String(visible.length).padStart(2, "0")} PROJECTS</span>
        </div>

        <div className="work-grid portfolio-grid">
          {visible.map((project, index) => {
            const spotlight = filter === "All work" && index === 0;
            return <Reveal key={project.id} className={`project-reveal ${spotlight ? "portfolio-wide" : ""}`} delay={index % 2 * 0.06}>
              <PortfolioCard project={project} number={projects.indexOf(project) + 1} spotlight={spotlight} onOpen={openProject} />
            </Reveal>;
          })}
        </div>
      </div>

      <Reveal className="portfolio-invite">
        <div><p className="portfolio-eyebrow">YOUR NEXT CHAPTER</p><h2>Your project.<br /><span>Our next great collaboration.</span></h2><p>Have something in mind? Let’s give it a place in the world.</p></div>
        <ProjectButton className="button button-lime button-large">Tell us about your project</ProjectButton>
      </Reveal>
      <ProjectDetails dialogRef={dialog} project={selected} />
    </div>
  </section>;
}
