import { agency } from "@/lib/content";
import { Arrow, FoundationAccent, SectionLabel } from "./ui";
import { ProjectButton } from "./site-shell";
import { WordReveal } from "./word-reveal";

export function Contact() {
  return <section id="contact" className="contact-section" aria-labelledby="contact-heading"><div className="contact-aura" aria-hidden="true" /><div className="container"><SectionLabel number="05" light>YOUR NEXT CHAPTER</SectionLabel><div className="contact-topline"><span className="contact-pretitle"><span className="status-dot" /> LET’S TALK ABOUT WHAT’S NEXT.</span><FoundationAccent className="contact-accent-mark" /></div><WordReveal id="contact-heading">Let’s build<br />your next <span className="contact-accent">opportunity.</span></WordReveal><div className="contact-bottom"><p>Tell us about your business, your audience and your goals.<br />Let’s find the right way to reach your next client.</p><ProjectButton className="button button-lime button-large">Talk about your goals</ProjectButton></div><a className="contact-email" href={`mailto:${agency.email}`}>Or say hello at {agency.email}<Arrow diagonal /></a></div></section>;
}
