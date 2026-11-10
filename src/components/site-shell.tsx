"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { agency } from "@/lib/content";
import { Arrow, Mark } from "./ui";
import { ProjectDialog } from "./project-dialog";

const ProjectContext = createContext<(service?: string, packageName?: string) => void>(() => {});
export function ProjectButton({ children = "Start a project", className = "button button-lime", arrow = true, service, packageName }: { children?: ReactNode; className?: string; arrow?: boolean; service?: string; packageName?: string }) {
  const open = useContext(ProjectContext);
  return <button className={className} onClick={() => open(service, packageName)}>{children}{arrow && <span className="button-icon"><Arrow diagonal /></span>}</button>;
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
  const links = [["Home", "home"], ["Work", "work"], ["About", "about"], ["What we do", "services"], ["Journal", "journal"]];
  const destination = (anchor: string) => anchor === "home" ? "/" : anchor === "work" ? "/work/" : `${pathname === "/" ? "" : "/"}#${anchor}`;
  const isCurrentPage = (anchor: string) => (anchor === "home" && pathname === "/") || (anchor === "work" && pathname.replace(/\/$/, "") === "/work");
  return <header className="site-header"><div className="nav-wrap">
    <Link href="/" className="wordmark" aria-label="monettic home" onClick={() => setOpen(false)}><Mark /><span>monettic</span></Link>
    <nav aria-label="Main navigation" className="desktop-nav">{links.map(([label, anchor]) => <Link key={anchor} href={destination(anchor)} aria-current={isCurrentPage(anchor) ? "page" : undefined}>{label}<span className="nav-dot" /></Link>)}</nav>
    <div className="nav-actions"><ProjectButton className="button button-nav" /><button ref={menuButton} className={`menu-toggle ${open ? "is-open" : ""}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span /><span /></button></div>
  </div><nav id="mobile-navigation" aria-label="Mobile navigation" className={`mobile-nav ${open ? "is-open" : ""}`} inert={!open}>{links.map(([label, anchor], index) => <Link href={destination(anchor)} key={anchor} aria-current={isCurrentPage(anchor) ? "page" : undefined} onClick={() => setOpen(false)}><small>{String(index + 1).padStart(2, "0")}</small>{label}<Arrow diagonal /></Link>)}<Link href="/#contact" onClick={() => setOpen(false)}><small>{String(links.length + 1).padStart(2, "0")}</small>Get in touch<Arrow diagonal /></Link></nav></header>;
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
  return <footer className="footer"><div className="container"><div className="footer-top"><Link href="/" className="wordmark" aria-label="monettic home"><Mark /><span>monettic</span></Link><p>Independent minds.<br />Extraordinary possibilities.</p><div className="footer-links"><Link href="/">Home</Link><Link href="/work/">Work</Link><Link href="/#about">About</Link><Link href="/services/">Services</Link><Link href="/#contact">Contact</Link></div><a className="footer-email" href={`mailto:${agency.email}`}>{agency.email}<Arrow diagonal /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} monettic</span><span className="footer-crafted">Built with intention. Down to the last pixel.</span><Link href="/privacy/">Privacy policy</Link><a href="#top" className="footer-back">Back to top <Arrow direction="up" width="14" height="14" /></a></div></div></footer>;
}
