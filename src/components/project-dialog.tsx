"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { services, growthServices } from "@/lib/content";
import { sendEnquiry } from "@/lib/enquiry-delivery";
import { Arrow } from "./ui";

export function ProjectDialog({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const request = useRef<AbortController | null>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const errorNotice = useRef<HTMLParagraphElement>(null);

  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (status === "sent") {
      dialogRef.current?.scrollTo({ top: 0, behavior: "instant" });
      confirmation.current?.focus({ preventScroll: true });
    } else if (status === "error") errorNotice.current?.focus();
  }, [status, dialogRef]);

  function close() {
    request.current?.abort();
    request.current = null;
    document.body.style.overflow = "";
    setStatus("idle");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || status === "sent") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    setError("");
    setStatus("sending");
    try {
      await sendEnquiry(data, controller.signal);
      if (request.current !== controller) return;
      setReplyEmail(String(data.get("email") || "").trim());
      form.reset();
      setStatus("sent");
    } catch (cause) {
      if (request.current !== controller) return;
      const fallback = "We couldn’t confirm your submission. Please check your connection and try again. Your details are still here.";
      setError(cause instanceof Error && !["AbortError", "TypeError", "SyntaxError"].includes(cause.name) ? cause.message : fallback);
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) request.current = null;
    }
  }

  return <dialog ref={dialogRef} className="project-dialog" aria-labelledby="project-title" onClose={close} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
    <div className="dialog-inner"><button className="close-button" aria-label="Close project form" onClick={() => dialogRef.current?.close()}>×</button>
      {status === "sent" ? <div ref={confirmation} className="enquiry-confirmation" role="status" tabIndex={-1}>
        <span className="enquiry-confirmation-icon" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="m11 20 6 6 13-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        <div className="eyebrow">A GOOD CONVERSATION STARTS HERE</div>
        <h2 id="project-title">Thank you.<br /><span>Message sent.</span></h2>
        <p className="dialog-description">Your enquiry has been sent to the monettic team. We’ll get back to you at <strong className="enquiry-success-email">{replyEmail}</strong>.</p>
        <div className="enquiry-confirmation-note"><strong>WHAT HAPPENS NEXT</strong><p>We’ll review your ideas and get in touch to discuss the next step.</p></div>
        <button className="button button-lime" onClick={() => dialogRef.current?.close()}>Back to the website<span className="button-icon"><Arrow diagonal /></span></button>
      </div> : <>
        <div className="eyebrow">GOOD THINGS START WITH A CONVERSATION</div>
        <h2 id="project-title">Let’s build<br /><span>something great.</span></h2>
        <p className="dialog-description">Tell us what you have in mind. Big ideas, small details — we’re all ears.</p>
        <form className="enquiry-form" method="post" onSubmit={submit} aria-busy={status === "sending"}>
          <fieldset className="enquiry-fields" disabled={status === "sending"}>
            <legend className="sr-only">Your project enquiry</legend>
            <div className="form-grid"><label>Your name <span>*</span><input name="name" autoComplete="name" required placeholder="Alex Smith" maxLength={100} /></label><label>Email address <span>*</span><input name="email" type="email" autoComplete="email" required placeholder="alex@company.com" maxLength={254} /></label></div>
            <label>Company<input name="company" autoComplete="organization" placeholder="Your company or brand" maxLength={150} /></label>
            <label>Package<select name="package" defaultValue="Help me choose"><option>Help me choose</option><option>Website Build</option><option>AI Integration</option><option>Full AI Integration</option></select></label>
            <fieldset><legend>What we do</legend><div className="service-options">{services.map(service => <label key={service.short}><input type="checkbox" name="services" value={service.short} /><span>{service.short}</span></label>)}</div></fieldset>
            <fieldset><legend>Lead generation &amp; business growth</legend><div className="service-options">{growthServices.map(service => <label key={service.short}><input type="checkbox" name="services" value={service.short} /><span>{service.short}</span></label>)}</div></fieldset>
            <label>Project budget<select name="budget" defaultValue="Let's discuss"><option>Let&apos;s discuss</option><option>Under R15,000</option><option>R15,000–R30,000</option><option>R30,000–R60,000</option><option>R60,000+</option></select></label>
            <label>A little about your project <span>*</span><textarea name="message" required rows={3} placeholder="The idea, the ambition, the thing keeping you up at night…" maxLength={3000} /></label>
            <input className="enquiry-honeypot" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          </fieldset>
          <p className="form-note">Your details go directly to our team so we can respond to your enquiry. <Link href="/privacy/" onClick={() => dialogRef.current?.close()}>Privacy policy</Link>.</p>
          {status === "error" && <p ref={errorNotice} tabIndex={-1} className="enquiry-error" role="alert">{error}</p>}
          <button type="submit" className="button button-lime enquiry-submit" disabled={status === "sending"}>{status === "sending" ? <>Sending message<span className="enquiry-spinner" aria-hidden="true" /></> : <>Send message<span className="button-icon"><Arrow diagonal /></span></>}</button>
          <noscript><p className="form-note">Please enable JavaScript to send an enquiry through this form.</p></noscript>
        </form>
      </>}
    </div>
  </dialog>;
}
