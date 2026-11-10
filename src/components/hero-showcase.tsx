import Image from "next/image";
import { Arrow } from "./ui";
import { featuredProjects, projects } from "@/lib/content";

function ShowcaseArrow() {
  return <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const portfolio = [...featuredProjects, projects.find(project => project.id === "newlife-united")!];
const digitalProject = projects.find(project => project.id === "dcb-spares")!;

export function HeroShowcase() {
  return <div className="hero-showcase" aria-label="Explore what monettic creates">
    <a className="showcase-item showcase-portfolio" href="#work" aria-label="Explore our selected website projects">
      <div className="showcase-label"><span><i />01 / SELECTED WORK</span><ShowcaseArrow /></div>
      <div className="showcase-panel">
        <div className="showcase-panel-heading"><span>Ideas, made real.</span><span className="showcase-window-dots" aria-hidden="true"><i /><i /><i /></span></div>
        <div className="showcase-gallery">{portfolio.map((project, index) => <div className="showcase-project" key={project.name}>
          <Image src={project.image} alt="" width={220} height={260} sizes="(max-width: 600px) 28vw, 120px" />
          <span className="showcase-project-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="showcase-project-name">{project.name}</span>
        </div>)}</div>
        <div className="showcase-panel-footer"><span>Different brands. A shared ambition.</span><span className="showcase-plus" aria-hidden="true">+</span></div>
      </div>
    </a>

    <a className="showcase-item showcase-growth" href="#growth-services" aria-label="Explore our lead generation and business growth services">
      <div className="showcase-label"><span><i />02 / CONNECTED EXPERIENCES</span><ShowcaseArrow /></div>
      <div className="showcase-panel">
        <div className="showcase-panel-heading"><span>Campaigns. Leads. One pipeline.</span><span className="showcase-flow-indicator" aria-hidden="true"><i />CONNECTED</span></div>
        <div className="showcase-flow" aria-hidden="true">
          <div className="showcase-flow-grid" />
          <svg className="showcase-flow-line" viewBox="0 0 340 116" preserveAspectRatio="none"><defs><linearGradient id="showcase-line-gradient" x1="0" x2="1"><stop offset="0" stopColor="#0089c9" /><stop offset="1" stopColor="#43bedc" /></linearGradient><linearGradient id="showcase-fill-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#43bedc" stopOpacity=".23" /><stop offset="1" stopColor="#43bedc" stopOpacity="0" /></linearGradient></defs><path d="M0 97C50 97 48 71 85 71S129 49 170 49S220 57 255 30S312 22 340 8V116H0Z" fill="url(#showcase-fill-gradient)" /><path d="M0 97C50 97 48 71 85 71S129 49 170 49S220 57 255 30S312 22 340 8" fill="none" stroke="url(#showcase-line-gradient)" strokeWidth="2" /><circle cx="85" cy="71" r="5" fill="#effbff" stroke="#0089c9" strokeWidth="2" /><circle cx="170" cy="49" r="5" fill="#effbff" stroke="#25a6d1" strokeWidth="2" /><circle cx="255" cy="30" r="5" fill="#effbff" stroke="#43bedc" strokeWidth="2" /></svg>
          <span className="showcase-flow-note">A little less friction.<br /><em>A lot more possibility.</em></span>
        </div>
        <div className="showcase-flow-steps"><span><i>01</i>Capture</span><span><i>02</i>Connect</span><span><i>03</i>Convert</span></div>
      </div>
    </a>

    <a className="showcase-item showcase-digital" href="#services" aria-label="Explore our web design and development services">
      <div className="showcase-label"><span><i />03 / DIGITAL CRAFT</span><ShowcaseArrow /></div>
      <div className="showcase-panel">
        <div className="showcase-panel-heading"><span>Made to stand out.</span><span className="showcase-size-label">EVERY SCREEN <Arrow diagonal width="1.5em" height="1.5em" /></span></div>
        <div className="showcase-screens" aria-hidden="true">
          <div className="showcase-browser showcase-browser-back"><div className="showcase-browser-bar"><span /><span /><span /></div><div className="showcase-browser-abstract"><span>Form.<br /><em>Feeling.</em></span><i /></div></div>
          <div className="showcase-browser showcase-browser-front"><div className="showcase-browser-bar"><span /><span /><span /><i>{new URL(digitalProject.url).hostname.replace(/^www\./, "")}</i></div><Image src={digitalProject.image} alt="" width={420} height={280} sizes="(max-width: 600px) 70vw, 300px" /></div>
          <div className="showcase-mobile"><div className="showcase-mobile-speaker" /><span>Big<br /><em>ideas.</em></span><div className="showcase-mobile-orb" /><i /></div>
        </div>
        <div className="showcase-panel-footer"><span>Considered design. Seamless development.</span><span className="showcase-plus" aria-hidden="true">+</span></div>
      </div>
    </a>
  </div>;
}
