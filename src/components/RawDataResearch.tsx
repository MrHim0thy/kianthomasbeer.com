import { useResearchReveal } from './capstone/useResearchReveal';
import { useState } from "react";
import { motion } from "framer-motion";
import { Wind, HeartPulse, Building2, BriefcaseBusiness, CalendarDays, MapPin, Layers3, ArrowUp } from "lucide-react";
import { virginiaAirQuality } from "../content/virginiaAirQuality";
import "./RawDataResearch.css";

export default function RawDataResearch() {
  const reveal = useResearchReveal();
  const data = virginiaAirQuality.dataPreparation;
  const [activeStage, setActiveStage] = useState(1);
  const sourceIcons = [Wind, HeartPulse, Building2, BriefcaseBusiness];
  const stageIcons = [Wind, CalendarDays, MapPin, Layers3];
  const selected = data.stages[activeStage];

  return (
    <motion.section
      className="uva-data-research"
      aria-labelledby="uva-data-title"
      {...reveal}
    >
      <div className="uva-section-heading">
        <span className="uva-chapter-number" aria-hidden="true">03</span>
        <span className="eyebrow" aria-hidden="true">03 / DATA PREPARATION</span>
        <h2 id="uva-data-title">From Raw Data to Research</h2>
      </div>

      <div className="uva-source-grid" aria-label="Research data sources">
        {data.sources.map((source, i) => {
          const Icon = sourceIcons[i];
          return <section className="uva-source-block" key={source.title}>
            <span className="uva-source-icon"><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></span>
            <div><h3>{source.title}</h3><p>{source.description}</p></div>
          </section>;
        })}
      </div>

      <section className="uva-pipeline" aria-labelledby="uva-pipeline-title">
        <div className="uva-pipeline-heading">
          <h3 id="uva-pipeline-title">Bringing the data together</h3>
          <p id="uva-pipeline-help">Hover, focus, or select a stage to explore the process.</p>
        </div>
        <ol className="uva-pipeline-stages" aria-describedby="uva-pipeline-help">
          {data.stages.map((stage, i) => {
            const Icon = stageIcons[i];
            return <li key={stage.title}>
              <button
                type="button"
                className="uva-pipeline-stage"
                aria-pressed={activeStage === i}
                aria-controls="uva-pipeline-explanation"
                onMouseEnter={() => setActiveStage(i)}
                onFocus={() => setActiveStage(i)}
                onClick={() => setActiveStage(i)}
              >
                <span className="uva-stage-top"><Icon size={21} strokeWidth={1.5} aria-hidden="true" /><span aria-hidden="true">0{i + 1}</span></span>
                <span className="uva-stage-title">{stage.title}</span>
                <span className="uva-stage-label">{stage.label}</span>
              </button>
              {stage.inputs && <div className="uva-pipeline-inputs" aria-label={`Additional inputs to ${stage.title}`}>
                <ArrowUp size={15} aria-hidden="true" />
                <span className="uva-input-label">Additional inputs</span>
                {stage.inputs.map(input => <span className="uva-input-chip" key={input}>{input}</span>)}
              </div>}
            </li>;
          })}
        </ol>
        <div id="uva-pipeline-explanation" className="uva-pipeline-explanation" aria-live="polite" aria-atomic="true">
          <span className="eyebrow">{activeStage === 3 ? 'Final merge' : selected.label}</span>
          <h4>{activeStage === 3 ? 'Data Integration' : selected.title}</h4>
          <p>{selected.explanation}</p>
        </div>
      </section>

      <section className="uva-research-notes" aria-labelledby="uva-notes-title">
        <h3 id="uva-notes-title">Research notes</h3>
        <div className="uva-notes-grid">
          {data.notes.map(note => <section className="uva-research-note" key={note.title}>
            <h4>{note.title}</h4><p>{note.description}</p>
          </section>)}
        </div>
      </section>
    </motion.section>
  );
}
