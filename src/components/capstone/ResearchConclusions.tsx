import { useResearchReveal } from './useResearchReveal';
import { motion } from 'framer-motion';
import { researchFindings as content } from '../../content/virginiaResearchFindings';
import { seasonalMonths, monthSlope, coefficientLabel } from '../../content/virginiaSeasonalModel';
import './ResearchConclusions.css';

function FindingVisual({ kind }: { kind: string }) {
  if (kind === 'coefficients') return <div className="uva-finding-coefficients"><span className="eyebrow">ESTIMATED PM2.5 SLOPES</span><dl>{seasonalMonths.map(month => <div key={month.month}><dt>{month.month}</dt><dd>{coefficientLabel(monthSlope(month))}</dd></div>)}</dl><p>From Section 05 · coefficients, not visit counts or percentages. Uncertainty estimates unavailable.</p></div>;
  if (kind === 'seasons') return <div className="uva-finding-type"><span className="eyebrow">REPORTED SEASONAL PATTERN</span><strong>Winter <span aria-hidden="true">↔</span> Spring &amp; summer</strong><p>Generally higher visits / generally lower visits</p><span className="uva-finding-qualifier">Qualitative summary · not a plotted time series</span></div>;
  if (kind === 'correlation') return <div className="uva-finding-type"><span className="eyebrow">OVERALL CORRELATION</span><strong>Near zero.<br />Not the whole picture.</strong><p>Particulate matter ↔ respiratory visits</p><span className="uva-finding-qualifier">Reported description · no numeric correlation inferred</span></div>;
  return <div className="uva-finding-type"><span className="eyebrow">AGGREGATE CONTEXT</span><strong>Employment.<br />Income. Geography.</strong><p>District-level associations ≠ individual outcomes</p><span className="uva-finding-qualifier">Conceptual summary · not a causal pathway</span></div>;
}

export default function ResearchConclusions() {
  const reveal = useResearchReveal(0.08);
  return <div className="uva-closing-research">
    <motion.section {...reveal} className="uva-closing-section" aria-labelledby="uva-findings-title">
      <div className="uva-section-heading"><span className="uva-chapter-number" aria-hidden="true">07</span><span className="eyebrow">07 / RESEARCH FINDINGS</span><h2 id="uva-findings-title">What Did the Data Reveal?</h2></div>
      <p className="uva-closing-intro">{content.introduction}</p>
      <ol className="uva-findings-list">{content.findings.map((finding, index) => <li key={finding.title}>
        <span className="uva-finding-number" aria-hidden="true">0{index + 1}</span>
        <div className="uva-finding-copy"><h3>{finding.title}</h3><p>{finding.text}</p><p className="uva-finding-source"><cite>{finding.source}</cite></p></div>
        <FindingVisual kind={finding.visual} />
      </li>)}</ol>
      <figure className="uva-research-synthesis"><figcaption>The research, in perspective<span>Conceptual synthesis · connections show the analytical progression, not causal effects</span></figcaption>
        <ol>{content.summary.map((item, index) => <li key={item.title}><span className="uva-synthesis-node" aria-hidden="true">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p>{index < content.summary.length - 1 && <span className="uva-synthesis-arrow" aria-hidden="true">→</span>}</li>)}</ol>
      </figure>
    </motion.section>
    <motion.section {...reveal} className="uva-closing-section uva-limitations" aria-labelledby="uva-limitations-title">
      <div className="uva-section-heading"><span className="uva-chapter-number" aria-hidden="true">08</span><span className="eyebrow">08 / RESEARCH LIMITATIONS</span><h2 id="uva-limitations-title">What the Data Couldn't Tell Us</h2><p>Boundaries on what these observations can support.</p></div>
      <dl>{content.limitations.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
    </motion.section>
    <motion.section {...reveal} className="uva-closing-section uva-conclusion" aria-labelledby="uva-conclusion-title">
      <div className="uva-section-heading"><span className="uva-chapter-number" aria-hidden="true">09</span><span className="eyebrow">09 / CONCLUSION</span><h2 id="uva-conclusion-title">A More Complicated Picture Than Pollution Alone</h2></div>
      <div className="uva-conclusion-copy">{content.conclusion.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      <aside className="uva-team-reflection" aria-labelledby="uva-reflection-title"><span className="eyebrow">A PERSONAL REFLECTION / A TEAM PROJECT</span><h3 id="uva-reflection-title">What This Project Taught Me</h3>{content.reflection.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</aside>
      <p className="uva-closing-provenance">Research source: <cite>University of Virginia Statistics Capstone Technical Report, April 2026, exploratory analysis, Methods, and Results.</cite> Findings summarize the original group research by Kian Thomasbeer, Sana Rehan, and Ariyah Walker. The interactive website is a subsequent presentation of that work. Potential confounders and aggregation limits describe interpretive constraints; they are not additional measured results.</p>
    </motion.section>
  </div>;
}
