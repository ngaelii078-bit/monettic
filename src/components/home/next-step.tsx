import { agency } from "@/lib/content";
import { ProjectButton } from "../site-shell";
import { Arrow } from "../ui";
import { WordReveal } from "../word-reveal";
import { Eyebrow } from "./primitives";

export function NextStep() {
  return <section id="contact" className="mx-next mx-dark" aria-labelledby="contact-heading" data-route="0.03" data-station="08 · close">
    <div className="mx-glow is-static" aria-hidden="true"><i /><i /><i /></div>
    <div className="mx-grain" aria-hidden="true" />
    <div className="mx-wrap mx-next-inner">
      <Eyebrow dot>Next step</Eyebrow>
      <WordReveal id="contact-heading" className="mx-h2 mx-next-title">tell us who you want to reach.<br /><em className="mx-serif">we&rsquo;ll show you how we&rsquo;d reach them.</em></WordReveal>
      <p>One call. We look at your market and your offer, and tell you straight whether outreach will work for you.</p>
      <div className="mx-actions" data-route-end>
        <ProjectButton className="mx-btn mx-btn-light" arrow={false}>book a call <Arrow width="16" height="16" /></ProjectButton>
        <a className="mx-btn mx-btn-ghost" href={`mailto:${agency.email}`}>email us</a>
      </div>
      <a className="mx-next-mail" href={`mailto:${agency.email}`}>Or write to {agency.email} <Arrow diagonal width="12" height="12" /></a>
    </div>
  </section>;
}
