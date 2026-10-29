import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, Wind, HeartPulse, Building2, Layers3 } from "lucide-react";
import { Heading } from "./Shared";
import { virginiaAirQuality as study } from "../content/virginiaAirQuality";
import "./VirginiaAirQualityCaseStudy.css";
import RawDataResearch from "./RawDataResearch";
import RespiratoryVisitsChart from "./capstone/RespiratoryVisitsChart";
import SeasonalCoefficientChart from "./capstone/SeasonalCoefficientChart";
import StatisticalModelExplorer from "./capstone/StatisticalModelExplorer";
import ResearchConclusions from "./capstone/ResearchConclusions";
import ResearchResources from "./capstone/ResearchResources";

function AtmosphereIllustration() {
  return (
    <figure className="uva-atmosphere">
      <svg viewBox="0 0 360 350" role="img" aria-labelledby="uva-atmosphere-title uva-atmosphere-description">
        <title id="uva-atmosphere-title">Atmosphere meets analysis</title>
        <desc id="uva-atmosphere-description">An abstract cloud and flowing atmospheric layers meet a statistical integration symbol. A conceptual illustration, not a chart or measured data.</desc>
        <defs>
          <linearGradient id="uva-atmosphere-wash" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#e9a23b" stopOpacity=".13" />
            <stop offset="1" stopColor="#a8d86f" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <rect x="12" y="22" width="336" height="298" rx="160" fill="url(#uva-atmosphere-wash)" />
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M70 138c-19 0-26-25-9-35-3-22 24-35 40-21 15-30 55-23 60 7 27-7 43 32 18 43H70" fill="var(--cream)" stroke="#97a58c" strokeWidth="1.5" />
          <path d="M34 174c46-30 81 23 125-4s82-29 131-9" stroke="#7fb3d3" strokeOpacity=".65" />
          <path d="M36 198c44-30 83 21 126-5s83-27 142-7" stroke="#7fb3d3" strokeOpacity=".45" />
          <path d="M41 222c52-25 77 19 124-5s88-21 140-6" stroke="#a8d86f" strokeWidth="2" strokeOpacity=".65" />
          <path d="M55 246c49-21 83 13 125-6s72-17 116-5" stroke="#97a58c" strokeOpacity=".45" />
          <rect x="228" y="111" width="89" height="110" rx="8" fill="var(--cream)" stroke="#d7d9ce" />
          <path d="M245 128h14m-14 0v76h14m43-76h-14m14 0v76h-14" stroke="#e9a23b" strokeWidth="1.5" />
        </g>
        <text x="273" y="179" textAnchor="middle" fontFamily="Georgia,serif" fontSize="38" fill="var(--navy)">Σ</text>
        <text x="39" y="292" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="2" fill="var(--muted)">ATMOSPHERE / CONTEXT / ANALYSIS</text>
      </svg>
      <figcaption>Conceptual illustration · Not research data</figcaption>
    </figure>
  );
}

export default function VirginiaAirQualityCaseStudy() {
  const reduceMotion = useReducedMotion();
  const reveal = {
    initial: reduceMotion ? false as const : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduceMotion ? 0 : 0.45 },
  };
  const icons = [Wind, HeartPulse, Building2, Layers3];
  return (
    <article className="uva-case-study">
      <Link className="back-link" to="/projects"><ChevronLeft size={16} />All projects</Link>
      <div className="uva-case-hero">
        <div>
          <Heading label={study.eyebrow} title={study.title} text={study.subtitle} />
          <div className="tags detail-tags" aria-label="Project topics">
            {study.tags.map(tag => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <AtmosphereIllustration />
      </div>
      <dl className="uva-metadata">
        {study.metadata.map(item => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.dateTime ? <time dateTime={item.dateTime}>{item.value}</time> : item.value}</dd>
          </div>
        ))}
      </dl>
      <motion.section {...reveal} className="uva-research" aria-labelledby="uva-question-title">
        <div className="uva-section-heading">
          <span className="eyebrow" aria-hidden="true">01 / THE QUESTION</span>
          <h2 id="uva-question-title">The Research Question</h2>
        </div>
        <div className="uva-research-copy">
          <blockquote>{study.question}</blockquote>
          {study.explanation.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </motion.section>
      <motion.section {...reveal} className="uva-glance" aria-labelledby="uva-glance-title">
        <div className="uva-section-heading">
          <span className="eyebrow" aria-hidden="true">02 / THE FRAMEWORK</span>
          <h2 id="uva-glance-title">Project at a Glance</h2>
        </div>
        <div className="uva-glance-grid">
          {study.glance.map((item, i) => {
            const Icon = icons[i];
            return <section className="uva-glance-block" key={item.title}>
              <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </section>;
          })}
        </div>
      </motion.section>
      <RawDataResearch />
      <RespiratoryVisitsChart />
      <SeasonalCoefficientChart />
      <StatisticalModelExplorer />
      <ResearchConclusions />
      <ResearchResources />
    </article>
  );
}
