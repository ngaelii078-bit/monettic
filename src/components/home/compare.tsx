import { comparisonColumns, comparisonRows, outreachStandards } from "@/lib/home-content";
import { ProjectButton } from "../site-shell";
import { Arrow, Reveal } from "../ui";
import { WordReveal } from "../word-reveal";

const Cross = () => <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>;
const Check = () => <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.4l3 3 6-6.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function Compare() {
  return <section id="how-we-work" className="mx-compare mx-light" aria-labelledby="compare-heading" data-route="0.03" data-station="06 · connect">
    <div className="mx-wrap mx-compare-grid">
      <div className="mx-compare-copy">
        <WordReveal id="compare-heading" className="mx-h2">one team for the whole path.<br /><span className="mx-dim">not five tools and three freelancers.</span></WordReveal>
        <p>Outreach, content, design and your sales system, set up together around your business and your team.</p>
        <ProjectButton className="mx-btn mx-btn-dark" arrow={false}>book a call <Arrow width="16" height="16" /></ProjectButton>
      </div>
      <div className="mx-compare-main">
        <Reveal>
          <div className="mx-table-scroll" role="region" aria-label="Comparison table" tabIndex={0}>
            <table className="mx-table">
              <caption className="sr-only">How monettic compares with hiring in house or using separate freelancers</caption>
              <thead><tr><td />{comparisonColumns.map((column, i) => <th scope="col" key={column} className={i === 2 ? "is-us" : undefined}>{column}</th>)}</tr></thead>
              <tbody>{comparisonRows.map(row => <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, i) => <td key={i} className={i === 2 ? "is-us" : undefined}>{i === 2 ? <Check /> : <Cross />}<span>{value}</span></td>)}
              </tr>)}</tbody>
            </table>
          </div>
        </Reveal>
        <div className="mx-standards">
          <h3>outreach we&rsquo;ll put our name to.</h3>
          <ol>{outreachStandards.map((standard, index) => <Reveal as="li" key={standard.title} delay={index * 0.06}>
            <span className="mx-standard-n">{String(index + 1).padStart(2, "0")}</span>
            <strong>{standard.title}</strong>
            <p>{standard.text}</p>
          </Reveal>)}</ol>
        </div>
      </div>
    </div>
  </section>;
}
