import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, FileText, Code2, Database } from 'lucide-react';
import { virginiaAirQuality as study } from '../../content/virginiaAirQuality';
import { technicalReportPath, capstoneRepositoryUrl, capstonePublicSources, researchResourceContent as content } from '../../content/virginiaResearchResources';
import './ResearchResources.css';

export default function ResearchResources() {
  const reduced = useReducedMotion();
  const team = study.metadata.find(item => item.label === 'Team')?.value.split(', ') ?? [];
  const advisor = study.metadata.find(item => item.label === 'Faculty advisor')?.value;
  const reportUrl = technicalReportPath ? `/${technicalReportPath.replace(/^\/+/, '')}` : null;
  return <motion.section className="uva-resources" aria-labelledby="uva-resources-title"
    initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.06 }} transition={{ duration: reduced ? 0 : 0.4 }}>
    <div className="uva-section-heading"><span className="eyebrow">10 / EXPLORE THE RESEARCH</span><h2 id="uva-resources-title">Go Beyond the Visualizations</h2></div>
    <p className="uva-resources-intro">{content.introduction}</p>
    <div className="uva-resource-list">
      <section className="uva-resource-row" aria-labelledby="uva-report-resource"><FileText aria-hidden="true" size={24} strokeWidth={1.5} />
        <div><h3 id="uva-report-resource">Read the Technical Report</h3><p>Full research methodology, statistical analysis, figures, model diagnostics, and conclusions.</p></div>
        {reportUrl ? <a className="uva-resource-action" href={reportUrl} target="_blank" rel="noopener noreferrer" aria-label="View the UVA capstone Technical Report PDF (opens in a new tab)">View Report<ArrowUpRight size={15} aria-hidden="true" /></a> : <p className="uva-resource-availability">Report PDF not yet published.</p>}
      </section>
      <section className="uva-resource-row" aria-labelledby="uva-code-resource"><Code2 aria-hidden="true" size={24} strokeWidth={1.5} />
        <div><h3 id="uva-code-resource">Explore the Code</h3><p>R scripts for data cleaning, geospatial integration, statistical modeling, and visualization.</p></div>
        {capstoneRepositoryUrl ? <a className="uva-resource-action" href={capstoneRepositoryUrl} target="_blank" rel="noopener noreferrer" aria-label="Explore the original capstone analysis on GitHub (opens in a new tab)">Explore GitHub<ArrowUpRight size={15} aria-hidden="true" /></a> : <p className="uva-resource-availability">Analysis repository not yet linked.</p>}
      </section>
      <section className="uva-resource-row uva-resource-data" aria-labelledby="uva-data-resource"><Database aria-hidden="true" size={24} strokeWidth={1.5} />
        <div><h3 id="uva-data-resource">Explore the Data Sources</h3><p>Public environmental, health, and socioeconomic datasets used in the study.</p>
          <p className="uva-resource-source-note">Original public source portals · these are separate from the cleaned and derived analytical files. Current releases may differ from the study’s historical extracts.</p>
          <ul className="uva-official-sources">{capstonePublicSources.map(source => <li key={source.name}><a href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`${source.name}: ${source.title} (official source, opens in a new tab)`}><span>{source.name}<small>{source.title}</small></span><ArrowUpRight size={15} aria-hidden="true" /></a><p>{source.description}</p></li>)}</ul>
        </div>
      </section>
    </div>
    <section className="uva-team-credits" aria-labelledby="uva-team-title"><div><h3 id="uva-team-title">The People Behind the Research</h3><p>University of Virginia · STAT 4996 · Spring 2026</p><p className="uva-team-collaboration">A collaborative statistics capstone, presented here as an interactive case study.</p></div>
      <div className="uva-team-names"><h4>Research team</h4><ul>{team.map(name => <li key={name}>{name}</li>)}</ul><h4>Faculty advisor</h4><p>{advisor}</p></div>
    </section>
    <details className="uva-reproducibility"><summary>Data &amp; Reproducibility Notes</summary><div>{content.notes.map(note => <section key={note.title}><h4>{note.title}</h4><p>{note.text}</p></section>)}</div></details>
  </motion.section>;
}

