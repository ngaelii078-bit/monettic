import Link from "next/link";
import { Arrow } from "@/components/ui";
import { agency } from "@/lib/content";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import "./privacy.css";

export const metadata = pageMetadata("Privacy Policy", "How monettic collects, uses and protects website enquiry information, which providers process it, and how to exercise your privacy rights.", "/privacy/");

const sections = [
  ["who-we-are", "Who we are"],
  ["information", "Information we collect"],
  ["how-we-use-it", "How we use it"],
  ["providers", "Who processes it"],
  ["cookies", "Cookies & analytics"],
  ["storage", "Storage & security"],
  ["your-rights", "Your choices & rights"],
  ["external-websites", "External websites"],
  ["updates", "Policy updates"],
];

export default function Privacy() {
  return <main id="main" className="article-page light-section privacy-page">
    <JsonLd data={{ "@context": "https://schema.org", ...breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy policy", path: "/privacy/" }]) }} />
    <div className="article-container">
      <Link className="article-back" href="/"><Arrow direction="left" />Back to the studio</Link>
      <header className="privacy-heading">
        <div className="eyebrow">CLEAR BY DESIGN</div>
        <h1>Privacy policy.</h1>
        <p className="article-standfirst">Your information deserves the same care as your project. Here’s what we collect, why we need it, and the choices you have.</p>
        <p className="privacy-updated">Last updated <time dateTime="2026-11-09">9 November 2026</time></p>
      </header>
      <div className="privacy-layout">
        <aside className="privacy-sidebar">
          <nav aria-label="Privacy policy contents"><span className="eyebrow">ON THIS PAGE</span>{sections.map(([id, title], index) => <a href={`#${id}`} key={id}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{title}</a>)}</nav>
          <div className="privacy-help"><strong>A question about your data?</strong><p>Contact our team using the details in this policy.</p><a href="#your-rights">Your choices & rights <Arrow diagonal width="1em" height="1em" /></a></div>
        </aside>
        <div className="article-body privacy-body">
          <section id="who-we-are"><h2>01. Who we are</h2><p>monettic is a digital agency based in Bedfordview, Johannesburg, South Africa. This policy covers personal information collected through our website and the enquiries you send to us. monettic is responsible for deciding how that enquiry information is used.</p><p>For privacy questions or requests, email <a href={`mailto:${agency.email}`}>{agency.email}</a>.</p></section>
          <section id="information"><h2>02. Information we collect</h2><p>When you send a project enquiry, we collect your name, email address and message. You may also provide your company, preferred package, selected services and budget. These additional details are optional. We also receive any information you choose to share in later correspondence.</p><p>You can browse without completing the form. Your name, email address and project message are needed to submit an enquiry so we can understand your request and reply. Please do not send passwords, payment card details or other sensitive information.</p><p>Our hosting provider may process technical information such as your IP address, browser details, requested pages and access times to deliver and protect the website. The enquiry endpoint also uses temporary IP-based request limits to reduce spam.</p></section>
          <section id="how-we-use-it"><h2>03. How we use it</h2><p>We use enquiry information to respond to your questions, understand your requirements, prepare proposals and communicate about potential or agreed work. Technical information helps keep the website available and prevent abuse.</p><p>Depending on the circumstances, processing is necessary to take steps towards a contract at your request, perform an agreement, meet legal obligations or pursue legitimate interests such as responding to enquiries and protecting the website. Where consent is required, you may withdraw it.</p><p>Sending an enquiry does not automatically subscribe you to a mailing list. We do not sell information collected through this website or use the form to make automated decisions about you.</p></section>
          <section id="providers"><h2>04. Who processes it</h2><p>Your enquiry passes through our hosting provider, Vercel, and is delivered to our team’s Gmail inbox. Google processes and stores the message as part of our email correspondence. The website shows a success message after our email provider accepts the submission.</p><p>These providers may process information outside South Africa. Their privacy notices describe their processing locations and applicable protections: <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer">Vercel’s privacy notice</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a>.</p><p>We may also disclose relevant information where required by law or necessary to establish, exercise or defend legal rights.</p></section>
          <section id="cookies"><h2>05. Cookies & analytics</h2><p>The website’s application code does not currently use tracking cookies, advertising pixels or analytics tools. Fonts and portfolio images are served with the website. Our hosting provider may process access and security logs to operate the service.</p><p>We do not save your form entries in your browser’s local storage. If we introduce optional tracking, we will update this policy and provide any choices required by applicable law.</p></section>
          <section id="storage"><h2>06. Storage & security</h2><p>Enquiries are kept in our email correspondence to handle your request and any resulting work. Retention depends on the purpose, our relationship with you and any legal, accounting or dispute-related requirements. You can ask us about the records we hold or request deletion.</p><p>The form uses HTTPS, and email delivery from our server uses an encrypted connection. The website does not maintain a separate enquiry database. Its request limits use temporary server memory. No internet transmission or storage system can be guaranteed completely secure.</p></section>
          <section id="your-rights"><h2>07. Your choices & rights</h2><p>Subject to South Africa’s Protection of Personal Information Act (POPIA), you may request access to your personal information, ask for correction or deletion, object to applicable processing, or withdraw consent where processing relies on it. Some records may need to be retained where the law allows or requires this.</p><p>Email our team using the privacy contact above and explain your request. We may need to confirm your identity before sharing or changing personal information. You can also raise a complaint with the <a href="https://inforegulator.org.za/" target="_blank" rel="noopener noreferrer">Information Regulator of South Africa</a>.</p></section>
          <section id="external-websites"><h2>08. External websites</h2><p>Our portfolio links to live client websites. Following one of these links takes you to a separate website with its own privacy practices. This policy covers the monettic website, not the websites linked from it.</p></section>
          <section id="updates"><h2>09. Policy updates</h2><p>We may update this policy when our website or information-handling practices change. The date at the top shows when it was last revised. The current policy will remain available from the website footer and project enquiry form.</p></section>
        </div>
      </div>
    </div>
  </main>;
}
