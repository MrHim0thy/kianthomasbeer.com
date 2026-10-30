import { useResearchReveal } from './useResearchReveal';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Layers3 } from 'lucide-react';
import { modelStages, modelingContent as content, reportedAicModels, aicAxisMaximum, formatModelMetric } from '../../content/virginiaModelComparison';
import './StatisticalModelExplorer.css';

export default function StatisticalModelExplorer() {
  const reveal = useResearchReveal();
  const [selectedIndex, setSelectedIndex] = useState(3);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const reduceMotion = useReducedMotion();
  const selected = modelStages[selectedIndex];
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % modelStages.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + modelStages.length) % modelStages.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = modelStages.length - 1;
    else return;
    event.preventDefault();
    setSelectedIndex(next);
    tabs.current[next]?.focus();
  }
  return (
    <motion.section className="uva-modeling" aria-labelledby="uva-modeling-title"
      {...reveal}>
      <div className="uva-section-heading"><span className="uva-chapter-number" aria-hidden="true">06</span><span className="eyebrow">06 / STATISTICAL MODELING</span><h2 id="uva-modeling-title">{content.title}</h2></div>
      <p className="modeling-introduction">{content.introduction}</p>
      <div role="tablist" aria-label="Explore modeling approaches" className="modeling-tabs" aria-orientation="horizontal">
        {modelStages.map((model, index) => <button key={model.id} ref={element => { tabs.current[index] = element; }}
          type="button" role="tab" id={`${id}-tab-${model.id}`} aria-controls={`${id}-panel`}
          aria-selected={selectedIndex === index} tabIndex={selectedIndex === index ? 0 : -1}
          onClick={() => setSelectedIndex(index)} onFocus={() => setSelectedIndex(index)} onKeyDown={event => onTabKey(event, index)}>
          <span className="modeling-tab-number">Model {index + 1}</span><span>{model.shortName}</span>
          {model.final && <span className="modeling-final"><Check size={12} aria-hidden="true" />Final selection</span>}
        </button>)}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${selected.id}`} tabIndex={0} className="modeling-panel">
        <motion.div key={selected.id} initial={reduceMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }} className="modeling-panel-grid">
          <div><div className="eyebrow">MODEL {selectedIndex + 1} / {selected.final ? 'FINAL SELECTION' : 'ANALYTICAL PROGRESSION'}</div><h3>{selected.name}</h3>
            <h4>What it contributed</h4><p>{selected.contribution}</p><h4>What the diagnostics taught us</h4><p>{selected.diagnostic}</p><p>{selected.explanation}</p></div>
          <aside className="modeling-metric"><span>{selected.metricLabel}</span><strong>{selected.metricValue}</strong><p>{selected.metricContext}</p></aside>
        </motion.div>
      </div>
      <p className="modeling-metric-note">Adjusted R² describes the linear-model stages on their respective response scales. AIC describes the reported count-model fits. These are different criteria and are not interchangeable scores.</p>

      <section className="modeling-aic" aria-labelledby="modeling-aic-title">
        <h3 id="modeling-aic-title">Comparing the reported count-model fits</h3><p>{content.aicExplanation}</p>
        <aside className="modeling-limitation">{content.aicLimitation}</aside>
        <figure className="modeling-aic-figure" aria-describedby={`${id}-aic-note`}>
          <figcaption>Reported AIC · select a bar to explore that model</figcaption>
          <div className="modeling-aic-rows">{reportedAicModels.map(model => <button type="button" key={model.id}
            className={`modeling-aic-row ${model.final ? 'modeling-aic-final' : ''}`}
            aria-pressed={selected.id === model.id} onClick={() => setSelectedIndex(modelStages.findIndex(item => item.id === model.id))}
            aria-label={`${model.name}: reported AIC ${formatModelMetric(model.aic)}. Explore model.`}
            title={`${model.name} — reported AIC ${formatModelMetric(model.aic)}. Fit compatibility unverified.`}>
            <span className="modeling-aic-name">{model.shortName}</span><span className="modeling-aic-track" aria-hidden="true"><span style={{ width: `${model.aic / aicAxisMaximum * 100}%` }} /></span><strong>{formatModelMetric(model.aic)}</strong>
          </button>)}</div>
          <div className="modeling-aic-axis" aria-hidden="true"><span /><div>{[0, 100000, 200000, 300000, 400000].map(tick => <span key={tick}>{tick === 0 ? '0' : `${tick / 1000}k`}</span>)}</div><span /></div>
          <span className="modeling-aic-axis-label">AIC (reported value; lower is preferred only for comparable fits)</span>
        </figure>
        <div className="modeling-aic-readout" aria-live="polite" aria-atomic="true">{selected.aic !== undefined ? <><strong>{selected.name} · {formatModelMetric(selected.aic)}</strong><span>{selected.final ? 'Final selection in the report; lower reported AIC.' : 'The count-data baseline in the reported comparison.'} This value is not a prediction error.</span></> : <span>Select a count-model bar to inspect its reported AIC. No AIC values are supplied here for the linear-model stages.</span>}</div>
        <p id={`${id}-aic-note`} className="modeling-metric-note">The bars start at zero and show the reported AIC values directly. AIC is not prediction accuracy, and the difference is not a percentage improvement.</p>
      </section>

      <section className="modeling-cv" aria-labelledby="modeling-cv-title"><h3 id="modeling-cv-title">Did the Better-Fitting Model Also Predict Better?</h3>
        <p>The Technical Report describes five-fold cross-validation. Poisson regression had a slightly lower average mean squared error, while Negative Binomial had less variation in fold MSE. Numeric average MSE values are not supplied and are not inferred here.</p>
        <div className="modeling-cv-table"><table><caption>Reported standard deviation of fold MSE · {content.crossValidation.folds}-fold cross-validation</caption><thead><tr><th scope="col">Model</th><th scope="col">Standard deviation of fold MSE</th></tr></thead><tbody>
          <tr><th scope="row">Poisson regression</th><td>{formatModelMetric(content.crossValidation.poissonFoldMseSd)}</td></tr>
          <tr><th scope="row">Negative Binomial regression</th><td>{formatModelMetric(content.crossValidation.negativeBinomialFoldMseSd)}</td></tr>
        </tbody></table></div>
        <p className="modeling-limitation">Negative Binomial was more consistent across the reported folds, but did not outperform Poisson on average MSE. This is not definitive evidence of superior predictive performance. Verified fold assignments and final fitting specifications for these results are not available for reproduction here.</p>
      </section>

      <section className="modeling-dispersion" aria-labelledby="modeling-dispersion-title"><h3 id="modeling-dispersion-title">Why did a more flexible count model help?</h3>
        <p>Poisson ties conditional variability to the expected count. Negative Binomial can accommodate additional variability.</p>
        <figure className="modeling-concept"><div className="modeling-concept-grid">
          <div><span className="eyebrow">POISSON</span><p className="modeling-formula">Variance = Mean</p><span>Var(Y | X) = μ</span></div>
          <div><span className="eyebrow">NEGATIVE BINOMIAL</span><p className="modeling-formula">Variance can exceed Mean</p><span>Var(Y | X) = μ + μ²/θ, θ &gt; 0</span></div>
        </div><figcaption><Layers3 size={14} aria-hidden="true" />Conceptual relationships, not observed residual diagnostics. μ is the conditional mean; the Negative Binomial formula uses the common NB2 parameterization. No fitted dispersion value or simulated observations are shown.</figcaption></figure>
      </section>

      <details className="modeling-under-hood"><summary>Under the Hood</summary><div>{content.technicalDetails.map(item => <section key={item.title}><h4>{item.title}</h4><p>{item.text}</p></section>)}</div></details>
      <p className="modeling-source">Source: <cite>{content.source}</cite> Reported metrics were verified against the local capstone document. No residual figures or fitted models have been fabricated; no statistical significance is inferred from these comparisons.</p>
    </motion.section>
  );
}
