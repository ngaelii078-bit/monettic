import { dashboardFeatures } from "@/lib/home-content";
import { ProjectButton } from "../site-shell";
import { Arrow, LogoTile, Reveal } from "../ui";
import { Eyebrow, SectionHead } from "./primitives";

const columns = [
  { name: "new", leads: [["Retail chain", "Gauteng"], ["Logistics firm", "Durban"]] },
  { name: "replied", leads: [["Property group", "Cape Town"], ["Clinic", "Pretoria"]] },
  { name: "call booked", leads: [["Engineering co.", "Boksburg"]] },
  { name: "won", leads: [["Studio", "Sandton"]] },
];

export function Dashboard() {
  return <section id="dashboard" className="mx-dashboard mx-dark mx-deep" aria-labelledby="dashboard-heading" data-route="0.97" data-station="05 · track">
    <div className="mx-wrap">
      <SectionHead label="In your hands" id="dashboard-heading" title="one dashboard, every lead." dim="scripts and next steps included." aside={<p className="mx-head-copy">Personalised to your business. Every lead lands in one place, so your team knows who to call and what to say.</p>} />
      <Reveal>
        <figure className="mx-app">
          <div className="mx-app-window" aria-hidden="true">
            <div className="mx-app-bar"><span className="mx-app-dots"><i /><i /><i /></span><span>your sales workspace</span><span className="mx-app-live"><i />live</span></div>
            <div className="mx-app-body">
              <nav className="mx-app-nav"><LogoTile className="mx-app-mark" /><b>Pipeline</b><span>Leads</span><span>Scripts</span><span>Activity</span><span>Reports</span></nav>
              <div className="mx-app-board">
                <div className="mx-app-head"><strong>Pipeline</strong><span>this month</span></div>
                <div className="mx-app-cols">{columns.map(column => <div className="mx-app-col" key={column.name}>
                  <span className="mx-app-col-name">{column.name}</span>
                  {column.leads.map(([name, place], i) => <div className={`mx-app-lead${column.name === "call booked" ? " is-hot" : ""}`} key={name}><b>{name}</b><span>{place}</span><i style={{ width: `${70 - i * 18}%` }} /></div>)}
                </div>)}</div>
              </div>
              <aside className="mx-app-side">
                <span className="mx-app-tag">Suggested script</span>
                <p>&ldquo;You mentioned delivery delays in your reply. Can I show you how we cut that for a firm your size?&rdquo;</p>
                <span className="mx-app-tag">AI sales advice</span>
                <ul><li>Lead opened the pricing page twice</li><li>Call before Thursday</li><li>Send the case study after the call</li></ul>
              </aside>
            </div>
          </div>
          <figcaption>Illustrative preview with sample data. Your dashboard is set up around your business.</figcaption>
        </figure>
      </Reveal>
      <ul className="mx-features">
        {dashboardFeatures.map((feature, index) => <Reveal as="li" key={feature.label} delay={index * 0.06} className="mx-feature"><Eyebrow>{feature.label}</Eyebrow><strong>{feature.title}</strong></Reveal>)}
      </ul>
      <div className="mx-dashboard-cta"><ProjectButton className="mx-btn mx-btn-light" service="Sales dashboard" arrow={false}>talk about your sales system <Arrow width="16" height="16" /></ProjectButton></div>
    </div>
  </section>;
}
