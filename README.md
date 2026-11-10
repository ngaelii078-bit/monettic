# monettic

A complete agency website rebuilt from the supplied DigitalFold reference, with monettic branding and enquiries addressed to **eliseeweb@gmail.com**.

## Run locally

```powershell
npm install
npm run dev
```

For the production version:

```powershell
npm run build
npm start
```

The production preview serves at `http://127.0.0.1:3030`. The app now requires the Next.js server for its email endpoint; `out/` from an older static build must not be deployed. Vercel uses the framework and `.next` output configured in `vercel.json`.

## Checks

```powershell
npm run lint
npm run typecheck
$env:PREVIEW_URL = 'http://127.0.0.1:3030'
npm run test:e2e
```

Browser checks use an installed Google Chrome. They cover responsive rendering, showcase imagery and links, hero enquiries, off-screen animation pausing, project filtering, modal focus return, the service accordion, form validation, journal navigation, reduced motion, and automated accessibility checks.

## Structure

- `src/app`: home, full portfolio, service directory and four service pages, journal articles, privacy policy, 404, global styles, sitemap, robots and metadata.
- `src/components`: reusable page sections, navigation, dialogs, word motion, the SVG light horizon, and glass showcase previews.
- `src/app/editorial-theme.css`: the shared ocean-blue, cyan, and icy-glass design system.
- `public/fonts`: self-hosted Cormorant Garamond normal/italic and its SIL Open Font License.
- `src/lib/content.ts`: agency contact information, service descriptions, projects, and journal content.
- `src/lib/service-pages.ts`: distinct service-page content and visitor FAQs; `service-links.ts` keeps client navigation small.
- `src/lib/seo.ts`: production domain, canonical metadata, share images and shared structured data.
- `public/images/projects`: compressed desktop, tablet, phone and composed previews of the nine supplied portfolio websites.
- `.openai/hosting.json`: retained identity for the earlier static Sites preview; production uses Vercel, not this legacy static configuration.
- `src/app/api/enquiry/route.ts`: server-only email endpoint, backed by `src/lib/enquiry-server.ts` and `src/lib/gmail-delivery.ts`.

## Design and behaviour

The latest supplied visual reference guides an ocean-blue and luminous-cyan design with a fluted-glass background. A centered Cormorant Garamond headline sits over moving blue light, fine vertical glass lines, and three linked glass previews. Compact glass navigation, a circular project enquiry button, editorial section headings, and a coordinated blue palette carry the direction through the full site. Portfolio filters, expandable services, and responsive enquiry dialogs retain their original functionality.

The What We Do content reflects the owner's clarified service offering: business websites, ecommerce stores, technology and education websites, portfolios, custom web applications, lead-generation campaigns, lead scraping, email outreach, website lead tracking, advanced SEO/AEO, graphic design, content integration, an AI sales dashboard with scripts and advice, CRM, and AI integration. Ten service entries, an outbound/inbound-to-dashboard workflow, and the Website Build, AI Integration, and Full AI Integration packages explain how these fit together. The included-website offer is tied to Full AI Integration; CRM is included in the connected sales system. The original PDF and internal team material remain outside the public website.

The business growth section explains eight capabilities: high-level SEO/AEO, graphic design, website lead capture, email outreach and lead scraping, the AI sales dashboard with scripts and advice, included CRM, content integration, and AI integration. Website activity can be linked to known leads when contact details are available or shared; the copy does not claim that anonymous clicks identify people. Clicking an offering preselects it in the agency's contact form. The section uses a sticky text sequence on desktop and a compact reveal on mobile, with a static reduced-motion experience. These descriptions advertise client services; they do not install tracking or scraping on this agency website.

Headings now use the motion style requested from FedPump: words rise from clipped masks with a slight rotation, a 48 ms stagger, and a soft 850 ms settle when they enter the viewport. Hero, work, services, business growth, journal, and contact headings share the reusable `WordReveal` component. Native scrolling, readable server-rendered text, and instant reduced-motion rendering are preserved. The studio statement retains its scroll-linked colour fill.

The horizon uses CSS and SVG, pauses when off-screen or the tab is hidden, and becomes static with reduced motion. Small screens and touch devices use a static blue glass background without full-height blur layers. Their header and dialog backdrops also avoid live blur while scrolling. It requires no WebGL or extra animation dependency. Fonts and imagery are self-hosted, and no third-party analytics are installed.

The enquiry form submits to the same-origin `/api/enquiry/` endpoint while the visitor stays on the website. The server sends the name, email, company, package, selected services, budget, and message to **eliseeweb@gmail.com** through Gmail SMTP over TLS. The visitor's email is used for Reply-To; visitors cannot set the sender or destination. A thank-you screen appears only after Gmail accepts the message for that recipient. Pending requests disable duplicate submissions, and unsuccessful requests preserve the visitor's details for retry.

### Email connection

1. Sign in as `eliseeweb@gmail.com` at [Google App Passwords](https://myaccount.google.com/apppasswords). Enable 2-Step Verification if Google requires it, then create an app password named **Concrete Agency**.
2. In Vercel → **concrete** → **Settings** → **Environment Variables**, add **GMAIL_APP_PASSWORD** with that value for Production and Preview. Store it as sensitive when available. This is a dedicated app password, not the normal Google account password.
3. Deploy the updated code after adding the variable. Variable changes need a new deployment. Send one labelled test using the production form and confirm receipt in Gmail before treating delivery as verified.

For local email testing, copy `.env.example` to `.env.local` and set the value there; `.env.local` is ignored by Git. Never use a `NEXT_PUBLIC_` prefix or put the password in frontend code, screenshots, commits, or chat. The endpoint returns a controlled failure when the value is missing; it never substitutes a fake success or opens an email client.

Gmail credentials stay on the server. The endpoint validates origin, payload size, field types and lengths, email format, and the honeypot. Email HTML is escaped; file/URL attachment access is disabled. A bounded in-memory limit permits five attempts per IP per ten minutes per server instance. This is best-effort protection, not a distributed quota; Vercel Firewall can enforce shared limits if needed. Diagnostic logs contain only configuration status or a bounded error code, never enquiry contents or passwords. SMTP acceptance is not proof of inbox placement. Gmail account policies or sending limits may reject a message; check the Vercel function logs and the receiving inbox when troubleshooting.

The enquiry browser tests intercept the website endpoint and never send real email. Coverage includes complete payloads, duplicate prevention, confirmation focus, mobile accessibility, and retries after server, configuration, rate-limit, network, and malformed-response failures. Server tests cover validation, fixed recipients, escaped email content, delivery rejection, missing credentials, and throttling. A passing mocked test does not verify real email delivery.

## Search visibility

The canonical production origin is **https://www.concretetagency.com**. All eleven public pages have a unique title, description, canonical URL and page-specific Open Graph/Twitter metadata. The old ChatGPT preview address is no longer used in metadata. `/sitemap.xml` lists the canonical home, portfolio, service directory, four service pages, three journal articles and privacy policy; it excludes the API and missing URLs. `/robots.txt` advertises the sitemap and excludes the API. Vercel preview builds use noindex metadata and disallow crawling.

The service pages focus on website and ecommerce development, SEO/AEO, AI integration and lead generation for business and consumer audiences across industries in South Africa. They are linked from the homepage and services directory, provide distinct descriptions, scope and FAQs, and open the existing enquiry form with the appropriate service selected. The lead-generation page covers campaigns, email outreach and lead scraping, connected to website activity and an AI sales dashboard with CRM. The AI integration page explains scripts, sales advice, content connections and CRM. The existing `/services/ai-automation/` URL remains unchanged. No invented addresses, ratings, client results, prices or ranking promises are added. Structured data describes the Organization, WebSite, services, service catalogue, articles and breadcrumbs using visible content. Article dates and sitemap modification dates are omitted rather than fabricated.

`public/social-card.png` is a 1200 × 630 branded sharing image. The monettic icon is maintained in `public/favicon.svg` and used to generate the other icon sizes. Root metadata declares a 96 × 96 PNG favicon, a multi-size ICO and a 180 × 180 Apple touch icon. The 512 × 512 `public/logo.png` is also used by the Organization schema. Export the icon sizes with `node scripts/generate-brand-assets.mjs --icons-only`; omit the flag to also regenerate the social card from `social-card.svg` and the brand font. The legacy `favicon.svg` is no longer declared as the search icon. These public assets are crawlable; Google decides when to refresh and display the icon.

After deployment, the owner can verify the site in [Google Search Console](https://search.google.com/search-console/) and submit `https://www.concretetagency.com/sitemap.xml`. Domain verification needs access to the domain's DNS; a URL-prefix property may use the verification method Google offers. No verification token is fabricated and no Search Console submission is implied by deploying this code. Use URL Inspection for the homepage and new service pages, then monitor indexing, queries, clicks and enquiries. These improvements make the content discoverable; indexing and rankings remain search-engine decisions.

`tests/seo.spec.ts` checks the generated HTML without relying on client-side rendering: unique metadata, canonical consistency, structured-data parsing, sitemap coverage, robots rules, PNG dimensions, crawlable service links, real 404 responses, mobile layout, accessibility and service-specific enquiry selection. These checks do not measure search rankings.

## Reference assets

The portfolio contains the nine websites supplied by the owner: [DG Property](https://dg-property.co.za/), [MicroLogistics](https://micrologistics.co.za/), [Newlife United](https://newlifeunited.co.za/), [Thunder Brothers](https://thunderbrothers.co.za/), [CTCPM Data Warehouse](https://www.datawarehouse.ctcpm.cd/), [Lens Photo Studio](https://lensphotostudio.co.za/), [DCB Spares](https://www.dcbspares.co.za/), [Fedpump CC](https://www.fedpump.com/), and [Ngenzeni Enterprise](https://www.ngenzeni.co.za/). Previews are locally served WebP screenshots of their public homepages, captured on 6 November 2026 (Ngenzeni: 9 November 2026). Descriptions explain visible subjects and features without inventing results or testimonials. Each card and project dialog links to the live website. Hero previews use the same portfolio data.

The homepage features DG Property and DCB Spares with a **See more work** link. The hero gallery uses this same featured selection alongside Newlife United. `/work/` presents all nine, including MicroLogistics, in a dedicated editorial layout: a project in focus, an aligned two-column gallery with light captions, industry labels, descriptions and direct website links, category filters with counts, and a project enquiry CTA. It stacks into readable cards on phones while retaining the lightweight mockups. `WorkPortfolio` and `PortfolioCard` own the full gallery; `ProjectDetails` provides the shared accessible dialog for both the homepage and portfolio. Navigation and footer Work links open the full portfolio. `/privacy/` covers website enquiry collection, uses, Vercel/Gmail processing, cookies, retention, security, privacy rights and external links. It is linked from the footer and enquiry form, and does not publish the owner's private street address.

The Work cards and project dialogs display each website in a layered laptop, tablet, and phone composition. Tablet and phone screens use separate captures at 820 × 1100 and 390 × 844 rather than crops of the desktop screenshot. The CSS device frames use graphite edges, a metallic laptop base, soft shadows, and restrained hover motion. The composition scales to small screens and respects reduced-motion preferences.

At widths up to 800px or with a coarse pointer, each mockup is a single locally served `*-devices.webp` composition. The live device layers are hidden, the cards remain still, and the separate screen images are lazy-loaded only when visible. This avoids the filtered, rotated surfaces implicated in Android scrolling artifacts. The nine composed images total about 406 kB; the homepage loads only its two featured mockups, and hero images remain separate. Heading and scroll-text motion is preserved.

After changing screenshots or device styling, run `node scripts/capture-project-mockups.mjs` against the built local preview, then restart the server to discover newly added files (and rebuild before deployment). Pass a project ID, for example `node scripts/capture-project-mockups.mjs ngenzeni`, to capture only that project. The helper opens `/work/`, renders the actual desktop markup at 800px wide and encodes WebP in Chrome; it requires no extra image library. `PREVIEW_URL` may point to another local preview. The touch-rendering regression check covers phone and landscape tablet layouts, image requests, touch scrolling with CPU throttling, and project links with reduced motion turned off.

The journal articles and general agency copy were written for this build. The geometric brand mark and journal illustrations are original SVG/CSS assets.

The parent directory's `demo.html` and `AGENTS.md` have been preserved.
