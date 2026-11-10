import Link from "next/link";
import { Arrow } from "@/components/ui";

export default function NotFound() {
  return <main id="main" className="not-found"><span className="eyebrow">404 / A SMALL DETOUR</span><h1>This page hasn’t<br />taken shape.</h1><p>Let’s get you back to monettic.</p><Link href="/" className="button button-lime">Back to the studio <Arrow diagonal /></Link></main>;
}
