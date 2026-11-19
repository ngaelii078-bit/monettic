# TASTE.md: monettic homepage

**skip bakeoff**: approved by Tristan on 2026-11-19. The reference was supplied directly (spectraacquisition.com), so no variant bakeoff was run.

## Reference and line
- Reference: Spectra Acquisition homepage. We take its structure and rhythm, not its brand.
- In this niche, everyone shows a services grid and a contact form. We show the whole path from lead to client, laid out as one campaign.

## Section order (homepage)
1. Hero: mono eyebrow, two-tone headline (sans + cyan serif italic), two CTAs, promise chips, four count-up stats
2. Proof strip: track record line, client logo marquee, "built on" platform marquee
3. How it runs: sticky six-stage funnel card + scroll-driven steps, handover box at "calls booked"
4. The work: four live client sites in a bordered grid
5. In your hands: sales dashboard preview + five feature cells
6. One team: comparison table + five outreach standards
7. What we do: numbered service cards in a marquee
8. Next step: closing CTA on the hero light
9. Footer: brand, three link columns, mono base line

## Signature move
The pipeline route (`src/components/home/route.tsx`): a cyan line that leaves the hero label, runs down the page margins in straight runs joined by corners cut to the radius of the "t" in the Mt logo, sweeps across every section seam, and plugs into the closing "book a call" button. Square "leads" (the logo tile, small) flow along the drawn part; eight numbered stations (01 · signal to 08 · close) light up as it reaches them. Deliberately unlike the reference's free-hand thread: geometric, engineered, on-brand. Under 900px it collapses to a straight rail in the left gutter; under reduced motion it is fully drawn and still.

## Constants (`src/app/shell.css`)
- Colours: night `#030d14`, ink `#061722`, mist `#f2f6f8`, white, accent cyan `#4fd2f2` (on dark) / `#0a7194` (on light). One accent only.
- Type: Manrope Variable (display + body), Cormorant Garamond italic (accent line only), JetBrains Mono Variable (labels, uppercase, 0.14em tracking).
- Container: 1256px, gutter `clamp(20px, 6.4vw, 92px)`. Easing `cubic-bezier(.22,1,.36,1)`.
- Section rhythm alternates dark and light: hero dark, proof light, pipeline dark, work tint, dashboard night, compare light, services tint, CTA dark, footer night.

## Never
- No invented numbers. Every stat is true today; real campaign figures replace them in `src/lib/home-content.ts`.
- No em dashes in shipped copy. No stock photos of people.
- No second accent colour. No more than one scroll-driven effect beyond the signal line and the funnel.
