import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { seasonalMonths, januarySlopeUnits, coefficientScale, monthSlope, monthInteraction, coefficientLabel, seasonalModelContent as content } from '../../content/virginiaSeasonalModel';
import './SeasonalCoefficientChart.css';

type MonthName = typeof seasonalMonths[number]['month'];
export default function SeasonalCoefficientChart() {
  const [selectedMonths, setSelectedMonths] = useState<MonthName[]>(seasonalMonths.map(m => m.month));
  const [mode, setMode] = useState<'total' | 'interaction'>('total');
  const [focusedMonth, setFocusedMonth] = useState<MonthName>('September');
  const [width, setWidth] = useState(800);
  const container = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const id = useId();
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(300, Math.round(entries[0].contentRect.width))));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const selected = seasonalMonths.filter(m => selectedMonths.includes(m.month));
  const active = selected.find(m => m.month === focusedMonth) ?? selected[0];
  const left = width < 550 ? 92 : 116, right = 86, top = 26, rowHeight = 62;
  const height = top + selected.length * rowHeight + 67;
  const x = (value: number) => left + (value + 0.1) / 0.2 * (width - left - right);
  const zero = x(0);
  const ticks = width < 550 ? [-0.1, 0, 0.1] : [-0.1, -0.05, 0, 0.05, 0.1];
  const valueFor = mode === 'total' ? monthSlope : monthInteraction;
  function toggleMonth(month: MonthName) {
    setSelectedMonths(current => current.includes(month) ? current.filter(m => m !== month) : [...current, month]);
  }
  return (
    <motion.section className="uva-seasonal" aria-labelledby="uva-seasonal-title"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }} transition={{ duration: reduceMotion ? 0 : 0.45 }}>
      <div className="uva-section-heading"><span className="eyebrow">05 / SEASONAL INTERACTIONS</span><h2 id="uva-seasonal-title">{content.title}</h2></div>
      <p className="seasonal-introduction">{content.introduction}</p>
      <div className="seasonal-scope"><strong>Documented coefficients only.</strong> This compares four reported monthly PM2.5 associations from the Negative Binomial analysis. It is not a prediction of emergency visit counts. January is the reference month; uncertainty estimates are unavailable.</div>
      <div className="seasonal-controls">
        <fieldset><legend>Compare documented months</legend><div className="seasonal-month-options">{seasonalMonths.map(month => <label key={month.month}>
          <input type="checkbox" checked={selectedMonths.includes(month.month)} onChange={() => toggleMonth(month.month)} />
          <span>{month.month}{month.reference ? ' · reference' : ''}</span>
        </label>)}</div></fieldset>
        <div className="seasonal-mode"><label htmlFor={`${id}-mode`}>Coefficient view</label><select id={`${id}-mode`} value={mode} onChange={event => setMode(event.target.value as typeof mode)}>
          <option value="total">Month-specific PM2.5 slope</option><option value="interaction">Interaction relative to January</option>
        </select></div>
      </div>
      <p id={`${id}-help`} className="seasonal-chart-help">{mode === 'total' ? 'Each slope equals the January baseline plus the month’s interaction.' : 'These are interaction terms relative to January, not total month-specific slopes. January’s zero is a reference convention, not a separate estimated interaction.'} Hover, tap, or focus a bar for details. The scale stays fixed when months or views change.</p>
      <div ref={container} className="seasonal-chart-container">
        {selected.length ? <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-labelledby={`${id}-chart-title`} aria-describedby={`${id}-help`}>
          <title id={`${id}-chart-title`}>{mode === 'total' ? 'Month-specific PM2.5 coefficients' : 'PM2.5 interactions relative to January'} — coefficient comparison, not visit counts</title>
          {ticks.map(tick => <g key={tick} aria-hidden="true">
            <line x1={x(tick)} x2={x(tick)} y1={top - 6} y2={top + selected.length * rowHeight - 6} className={tick === 0 ? 'seasonal-zero-line' : 'seasonal-grid-line'} />
            <text x={x(tick)} y={height - 38} textAnchor="middle" className="seasonal-tick">{tick === 0 ? '0' : `${tick > 0 ? '+' : ''}${tick.toFixed(2)}`}</text>
          </g>)}
          {selected.map((month, i) => {
            const value = valueFor(month), end = x(value), y = top + i * rowHeight + 20;
            const label = `${month.month}: ${mode === 'total' ? 'month-specific slope' : 'interaction relative to January'} ${coefficientLabel(value)}${month.reference && mode === 'interaction' ? ', reference convention' : ''}`;
            return <g key={month.month} role="button" tabIndex={0} aria-label={label} className={`seasonal-bar ${month.reference ? 'seasonal-reference-bar' : ''} ${active?.month === month.month ? 'is-active' : ''}`}
              onPointerEnter={() => setFocusedMonth(month.month)} onClick={() => setFocusedMonth(month.month)} onFocus={() => setFocusedMonth(month.month)}
              onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFocusedMonth(month.month); } }}>
              <title>{label}. January baseline {coefficientLabel(januarySlopeUnits / coefficientScale)}; {month.reference ? 'no added interaction' : `interaction ${coefficientLabel(monthInteraction(month))}`}; total slope {coefficientLabel(monthSlope(month))}. Uncertainty unavailable.</title>
              <rect x="5" y={y - 24} width={width - 10} height="49" rx="4" className="seasonal-row-target" />
              <text x="12" y={y + 4} className="seasonal-month-label">{month.month}</text>
              <rect x={Math.min(zero, end)} y={y - 11} width={Math.max(1.5, Math.abs(end - zero))} height="22" rx="2" className={value < 0 ? 'seasonal-negative' : 'seasonal-positive'} />
              <text x={value < 0 ? end - 8 : end + 8} y={y + 4} textAnchor={value < 0 ? 'end' : 'start'} className="seasonal-value">{coefficientLabel(value)}</text>
            </g>;
          })}
          <text x={(left + width - right) / 2} y={height - 10} textAnchor="middle" className="seasonal-axis-label">{width < 550 ? 'PM2.5 coefficient' : 'PM2.5 coefficient per predictor unit · not visit counts'}</text>
        </svg> : <p className="seasonal-empty" role="status">Select at least one documented month to view its coefficient.</p>}
      </div>
      {active && <div className="seasonal-detail" aria-live="polite" aria-atomic="true">
        <span className="eyebrow">{active.month}{active.reference ? ' / REFERENCE MONTH' : ' / COEFFICIENT DETAILS'}</span>
        <h3>{active.month} PM2.5 slope: {coefficientLabel(monthSlope(active))}</h3>
        <p className="seasonal-equation">{active.reference ? `January baseline ${coefficientLabel(monthSlope(active))}; no added interaction term.` : `${coefficientLabel(januarySlopeUnits / coefficientScale)} ${monthInteraction(active) < 0 ? '−' : '+'} ${Math.abs(monthInteraction(active)).toFixed(5)} = ${coefficientLabel(monthSlope(active))}`}</p>
        <p>{active.reference ? 'January defines the comparison baseline.' : `The interaction relative to January is ${coefficientLabel(monthInteraction(active))}. It is added to the baseline to obtain the total month-specific slope.`} Standard errors, confidence intervals, and p-values are not available in the verified coefficient excerpt.</p>
      </div>}
      {selected.length > 0 && <div className="seasonal-table-wrap" tabIndex={0} role="region" aria-label="Documented and derived coefficient values"><table>
        <caption>Reported terms and derived slopes. January reference + interaction = total slope.</caption>
        <thead><tr><th scope="col">Month</th><th scope="col">January baseline</th><th scope="col">Interaction vs. January</th><th scope="col">Total monthly slope</th></tr></thead>
        <tbody>{selected.map(month => <tr key={month.month}><th scope="row">{month.month}</th><td>{coefficientLabel(januarySlopeUnits / coefficientScale)}</td><td>{month.reference ? 'Reference (no added term)' : coefficientLabel(monthInteraction(month))}</td><td>{coefficientLabel(monthSlope(month))}</td></tr>)}</tbody>
      </table></div>}
      <div className="seasonal-interpretation"><h3>What does the interaction mean?</h3><p>The interaction changes the PM2.5 slope relative to January; it is not the month’s baseline visit count. For a log-link Negative Binomial model, the sum of the baseline slope and the interaction is interpreted on the log expected-count scale, holding the model’s other terms fixed. A one-unit multiplicative interpretation would require exponentiating that sum and verifying the predictor’s scaling. These coefficients are not percentages.</p><p>The complete final PM2.5 model object, intercept, remaining coefficients, factor coding, covariate settings, and covariance matrix are not available as a verified prediction specification here. No absolute predictions or uncertainty intervals are reconstructed. Differences in coefficient size alone do not establish statistical significance.</p></div>
      <div className="seasonal-insights">{content.insights.map(insight => <section key={insight.title}><h3>{insight.title}</h3><p>{insight.text}</p></section>)}</div>
      <p className="seasonal-source">Source: <cite>{content.source}</cite> The four terms were verified in the local capstone document’s Results narrative. Only July, September, and October slopes are derived; no coefficients for other months are inferred.</p>
      <p className="seasonal-caution"><strong>Observational model associations, not evidence of causation.</strong> The report narrative does not provide the standard errors or covariance needed to quantify uncertainty for these combined slopes.</p>
    </motion.section>
  );
}
