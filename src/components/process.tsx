import { ProjectButton } from "./site-shell";
import { Arrow, Reveal, SectionLabel } from "./ui";
import { WordReveal } from "./word-reveal";

const serviceProcesses = [
  {
    label: "Outreach",
    eyebrow: "REACH THE RIGHT PEOPLE",
    description: "Find potential customers and start conversations with a message shaped around your business.",
    steps: ["Define your audience", "Find relevant leads", "Prepare and send outreach", "Review replies and book calls"],
    service: "Lead generation",
  },
  {
    label: "Content strategy",
    eyebrow: "MAKE YOUR MESSAGE CLEAR",
    description: "Bring your message, content and channels together so the right people understand what you do.",
    steps: ["Understand your audience", "Shape your message", "Plan content for each channel", "Connect content and campaigns"],
    service: "Content integration",
  },
  {
    label: "Sales systems",
    eyebrow: "TURN INTEREST INTO ACTION",
    description: "Give your team the context and tools to follow up, manage leads and move conversations forward.",
    steps: ["Bring leads together", "Review the context", "Start a conversation", "Track progress in your CRM"],
    service: "Sales dashboard",
  },
] as const;

export function ServiceProcess() {
  return <section id="services" className="process-section section-space" aria-labelledby="process-heading">
    <div className="container">
      <Reveal><SectionLabel number="04" light>HOW IT WORKS</SectionLabel></Reveal>
      <div className="process-intro">
        <WordReveal id="process-heading">How each service <span>works.</span></WordReveal>
        <p>Outreach, content and sales systems work together around your business and your team.</p>
      </div>
      <div className="process-cards">
        {serviceProcesses.map((service, index) => <Reveal key={service.label} delay={index * 0.08} className="process-card-reveal">
          <article className="process-card">
            <div className="process-card-top"><span>{service.eyebrow}</span><Arrow diagonal width="15" height="15" /></div>
            <h3>{service.label}</h3>
            <p>{service.description}</p>
            <ol className="process-steps" aria-label={`${service.label} process`}>
              {service.steps.map(step => <li key={step}><span className="process-step-dot" aria-hidden="true" />{step}</li>)}
            </ol>
            <ProjectButton className="process-contact" arrow={false} service={service.service}>Discuss {service.label.toLowerCase()} <Arrow diagonal width="14" height="14" /></ProjectButton>
          </article>
        </Reveal>)}
      </div>
    </div>
  </section>;
}
