import { ProjectButton } from "./site-shell";
import { Arrow, Reveal, SectionLabel } from "./ui";
import { WordReveal } from "./word-reveal";

export function DashboardPreview() {
  return <section id="dashboard" className="dashboard-section section-space" aria-labelledby="dashboard-heading">
    <div className="container">
      <Reveal><SectionLabel number="05" light>YOUR SALES SYSTEM</SectionLabel></Reveal>
      <div className="dashboard-layout">
        <div className="dashboard-copy">
          <WordReveal id="dashboard-heading">A sales dashboard built for <span>your team.</span></WordReveal>
          <p>Personalised to your business. Every lead lands in one place, so your team knows who to call and what to say.</p>
          <ProjectButton className="button button-lime" service="Sales dashboard">Talk about your sales system</ProjectButton>
        </div>
        <Reveal className="dashboard-preview-wrap">
          <figure className="dashboard-preview">
            <div className="dashboard-window" aria-hidden="true">
              <div className="dashboard-window-top"><span className="dashboard-dots"><i /><i /><i /></span><span>YOUR SALES WORKSPACE</span><Arrow diagonal width="14" height="14" /></div>
              <div className="dashboard-window-body">
                <div className="dashboard-window-nav"><strong>m.</strong><span className="dashboard-nav-active">Overview</span><span>Leads</span><span>Pipeline</span></div>
                <div className="dashboard-window-main"><span className="dashboard-window-label">YOUR WORKSPACE</span><strong>Good conversations<br /><em>start here.</em></strong><div className="dashboard-window-cards"><div><span>LEADS</span><b>All in one place.</b></div><div><span>FOLLOW-UPS</span><b>A clear next step.</b></div></div><div className="dashboard-window-list"><span>YOUR PIPELINE</span><div>New leads <i /></div><div>Conversations <i /></div><div>Next steps <i /></div></div></div>
              </div>
            </div>
            <figcaption>Illustrative preview. Your dashboard is tailored to your business.</figcaption>
          </figure>
        </Reveal>
      </div>
    </div>
  </section>;
}
