"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { agency, articles } from "@/lib/content";
import { Arrow, LogoTile } from "./ui";
import { ProjectDialog } from "./project-dialog";

const ProjectContext = createContext<(service?: string, packageName?: string) => void>(() => {});
export function ProjectButton({ children = "Start a project", className = "button button-lime", arrow = true, service, packageName, label }: { children?: ReactNode; className?: string; arrow?: boolean; service?: string; packageName?: string; label?: string }) {
  const open = useContext(ProjectContext);
  return <button className={className} aria-label={label} onClick={() => open(service, packageName)}>{children}{arrow && <span className="button-icon"><Arrow diagonal /></span>}</button>;
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); } };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const links = [["home", "/"], ["clients", "/#partners"], ["services", "/services/"], ["work", "/work/"]];
  const isCurrentPage = (href: string) => href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href.replace(/\/$/, ""));
  return <header className="mx-nav"><div className="mx-nav-bar">
    <Link href="/" className="mx-nav-logo" aria-label="monettic home" onClick={() => setOpen(false)}><LogoTile /><span>monettic</span></Link>
    <nav aria-label="Main navigation" className="mx-nav-links">{links.map(([label, href]) => <Link key={href} href={href} aria-current={isCurrentPage(href) ? "page" : undefined}>{label}</Link>)}</nav>
    <div className="mx-nav-actions"><ProjectButton className="mx-nav-cta" arrow={false}>book a call <Arrow diagonal width="13" height="13" /></ProjectButton><button ref={menuButton} className={`mx-nav-toggle ${open ? "is-open" : ""}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span /><span /></button></div>
  </div><nav id="mobile-navigation" aria-label="Mobile navigation" className={`mx-nav-panel ${open ? "is-open" : ""}`} inert={!open}>{links.map(([label, href], index) => <Link href={href} key={href} aria-current={isCurrentPage(href) ? "page" : undefined} onClick={() => setOpen(false)}><small>{String(index + 1).padStart(2, "0")}</small>{label}<Arrow diagonal /></Link>)}</nav></header>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = (service?: string, packageName?: string) => {
    if (service) {
      const inputs = dialog.current?.querySelectorAll<HTMLInputElement>('input[name="services"]');
      inputs?.forEach(input => { if (input.value === service) input.checked = true; });
    }
    if (packageName) {
      const packageSelect = dialog.current?.querySelector<HTMLSelectElement>('select[name="package"]');
      if (packageSelect) packageSelect.value = packageName;
    }
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
  };
  return <ProjectContext.Provider value={open}><a href="#main" className="skip-link">Skip to content</a><Navigation />{children}<Footer /><ProjectDialog dialogRef={dialog} /></ProjectContext.Provider>;
}

function Footer() {
  return <footer className="mx-footer"><div className="mx-footer-wrap">
    <div className="mx-footer-top">
      <div className="mx-footer-brand">
        <Link href="/" className="mx-nav-logo" aria-label="monettic home"><LogoTile /><span>monettic</span></Link>
        <p>Outreach, content and sales systems that help businesses win more clients, with a sales dashboard and CRM your team will actually use.</p>
        <ProjectButton className="mx-footer-cta" arrow={false}>book a call <Arrow diagonal width="13" height="13" /></ProjectButton>
      </div>
      <nav className="mx-footer-col" aria-label="monettic"><span>monettic</span><Link href="/">home</Link><Link href="/#partners">clients</Link><Link href="/services/">services</Link><Link href="/work/">work</Link></nav>
      <nav className="mx-footer-col" aria-label="Reading"><span>reading</span>{articles.map(article => <Link key={article.slug} href={`/journal/${article.slug}/`}>{article.title.replace(/\.$/, "").toLowerCase()}</Link>)}</nav>
      <nav className="mx-footer-col" aria-label="Contact and legal"><span>contact</span><a href={`mailto:${agency.email}`}>{agency.email}</a><Link href="/privacy/">privacy policy</Link><a href="#top">back to top</a></nav>
    </div>
    <div className="mx-footer-bottom"><span>© {new Date().getFullYear()} monettic · South Africa</span><span>Outreach · content · sales systems</span></div>
  </div></footer>;
}
