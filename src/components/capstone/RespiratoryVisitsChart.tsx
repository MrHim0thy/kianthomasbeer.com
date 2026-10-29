import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Database, RefreshCw } from 'lucide-react';
import { districtSeries, formatWeek, lineGeometry, parseRespiratoryDataset, pointLabel, type RespiratoryDataset, type WeeklyPoint } from './respiratoryData';
import './RespiratoryVisitsChart.css';

type LoadState = { status: 'loading' } | { status: 'missing' | 'error'; message: string } | { status: 'ready'; data: RespiratoryDataset };
const dataUrl = '/data/capstone/respiratory-visits.json';

function WeeklyLineChart({ series, district }: { series: WeeklyPoint[]; district: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<'pointer' | 'keyboard'>('pointer');
  const [tableOpen, setTableOpen] = useState(false);
  const id = useId();
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(300, Math.round(entries[0].contentRect.width))));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const chart = useMemo(() => lineGeometry(series, width), [series, width]);
  const active = activeIndex === null ? null : series[activeIndex];
  const known = series.filter(p => p.count !== null).length;
  const suppressed = series.filter(p => p.status === 'suppressed').length;
  const absent = series.filter(p => p.status === 'absent').length;
  const missing = series.filter(p => p.status === 'missing').length;
  function pointFromPointer(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * chart.width;
    const index = Math.round((x - chart.left) / (chart.width - chart.left - chart.right) * (series.length - 1));
    setInputMode('pointer');
    setActiveIndex(Math.max(0, Math.min(series.length - 1, index)));
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, PageUp: -10, PageDown: 10 };
    if (!Object.hasOwn(moves, event.key) && !['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    setInputMode('keyboard');
    setActiveIndex(index => event.key === 'Home' ? 0 : event.key === 'End' ? series.length - 1 : Math.max(0, Math.min(series.length - 1, (index ?? 0) + moves[event.key])));
  }
  return (
    <>
      <p className="respiratory-chart-help" id={`${id}-help`}>Hover or tap the chart for a week. With the chart focused, use Left/Right arrows, Home/End, or Page Up/Down to explore. Gaps mean a count is unavailable, not zero.</p>
      {known ? <div
        className="respiratory-chart-frame"
        ref={container}
        tabIndex={0}
        role="group"
        aria-label={`Interactive weekly respiratory emergency visit chart for ${district}`}
        aria-describedby={`${id}-help ${id}-coverage`}
        onKeyDown={onKeyDown}
        onFocus={() => { setInputMode('keyboard'); setActiveIndex(index => index ?? series.length - 1); }}
        onBlur={() => { setActiveIndex(null); }}
      >
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          role="img"
          aria-labelledby={`${id}-title ${id}-description`}
          onPointerMove={pointFromPointer}
          onPointerDown={pointFromPointer}
          onPointerLeave={() => { if (inputMode === 'pointer') setActiveIndex(null); }}
        >
          <title id={`${id}-title`}>Weekly respiratory emergency visits — {district}</title>
          <desc id={`${id}-description`}>Reported combined COVID-19, influenza, and RSV Emergency Department visit counts from {formatWeek(series[0].date)} to {formatWeek(series[series.length - 1].date)}. Missing and suppressed values break the line. Use the keyboard controls or the data table for exact values.</desc>
          {chart.yTicks.map(tick => <g key={tick}>
            <line x1={chart.left} x2={width - chart.right} y1={chart.y(tick)} y2={chart.y(tick)} className="respiratory-grid-line" />
            <text x={chart.left - 10} y={chart.y(tick) + 4} textAnchor="end" className="respiratory-tick">{tick.toLocaleString('en-US')}</text>
          </g>)}
          <line x1={chart.left} x2={chart.left} y1={chart.top} y2={chart.height - chart.bottom} className="respiratory-axis" />
          <line x1={chart.left} x2={width - chart.right} y1={chart.height - chart.bottom} y2={chart.height - chart.bottom} className="respiratory-axis" />
          {chart.xTicks.map(index => <text key={index} x={chart.x(index)} y={chart.height - chart.bottom + 23} textAnchor={index === 0 ? 'start' : index === series.length - 1 ? 'end' : 'middle'} className="respiratory-tick">{formatWeek(series[index].date, true)}</text>)}
          <text x={(chart.left + width - chart.right) / 2} y={chart.height - 12} textAnchor="middle" className="respiratory-axis-label">Week ending</text>
          <text transform={`translate(15 ${(chart.top + chart.height - chart.bottom) / 2}) rotate(-90)`} textAnchor="middle" className="respiratory-axis-label">Respiratory ED visits (count)</text>
          {chart.paths.map((path, index) => <path key={index} d={path} className="respiratory-data-line" />)}
          {series.map((point, index) => point.count === null ? null : <circle key={point.date} cx={chart.x(index)} cy={chart.y(point.count)} r={1.5} className="respiratory-data-dot" />)}
          {active && activeIndex !== null && <g aria-hidden="true">
            <line x1={chart.x(activeIndex)} x2={chart.x(activeIndex)} y1={chart.top} y2={chart.height - chart.bottom} className="respiratory-cursor" />
            {active.count !== null && <circle cx={chart.x(activeIndex)} cy={chart.y(active.count)} r={4.5} className="respiratory-active-dot" />}
          </g>}
        </svg>
        {active && activeIndex !== null && <div className="respiratory-tooltip" style={{ left: Math.min(Math.max(chart.x(activeIndex) - 100, 8), width - 208) }} aria-hidden="true">
          <span>Week ending {formatWeek(active.date)}</span><strong>{pointLabel(active)}</strong>
        </div>}
      </div> : <div className="respiratory-data-state" role="status"><Database size={23} aria-hidden="true" /><h3>No reported counts available for this district</h3><p>Missing or suppressed observations have not been replaced with zero. Choose another district or inspect the source-status table below.</p></div>}
      <p className="respiratory-coverage" id={`${id}-coverage`}>{known} reported weeks · {suppressed} suppressed · {missing} missing counts · {absent} weeks without an observation.</p>
      <div className="respiratory-readout" aria-live={inputMode === 'keyboard' ? 'polite' : 'off'} aria-atomic="true">
        {active ? <><span>{district} · Week ending {formatWeek(active.date)}</span><strong>{pointLabel(active)}</strong></> : <span>Select a week to inspect its actual count or missing-data status.</span>}
      </div>
      <details className="respiratory-table" onToggle={event => setTableOpen(event.currentTarget.open)}>
        <summary>View weekly data table for {district}</summary>
        {tableOpen && <div className="respiratory-table-scroll" tabIndex={0} role="region" aria-label={`Scrollable weekly data for ${district}`}><table>
          <caption>Reported respiratory emergency visits for {district}. A dash indicates an unavailable count.</caption>
          <thead><tr><th scope="col">Week ending</th><th scope="col">Visit count</th><th scope="col">Source status</th></tr></thead>
          <tbody>{series.map(point => <tr key={point.date}><th scope="row"><time dateTime={point.date}>{formatWeek(point.date)}</time></th><td>{point.count === null ? '—' : point.count.toLocaleString('en-US')}</td><td>{point.count === null ? pointLabel(point) : 'Reported'}</td></tr>)}</tbody>
        </table></div>}
      </details>
    </>
  );
}

export default function RespiratoryVisitsChart() {
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [district, setDistrict] = useState('');
  const [attempt, setAttempt] = useState(0);
  const reduceMotion = useReducedMotion();
  const selectId = useId();
  useEffect(() => {
    const controller = new AbortController();
    setLoad({ status: 'loading' });
    (async () => {
      try {
        const response = await fetch(dataUrl, { signal: controller.signal });
        if (!response.ok) {
          if (response.status === 404) { setLoad({ status: 'missing', message: 'The verified respiratory dataset is not available yet. Import the actual VDH capstone CSV to enable this visualization.' }); return; }
          throw new Error('Data request failed.');
        }
        const data = parseRespiratoryDataset(await response.json());
        if (controller.signal.aborted) return;
        setDistrict(current => data.districts.includes(current) ? current : data.districts[0] ?? '');
        setLoad({ status: 'ready', data });
      } catch {
        if (!controller.signal.aborted) setLoad({ status: 'error', message: 'The respiratory data could not be loaded or did not pass validation. No substitute or sample values are displayed.' });
      }
    })();
    return () => controller.abort();
  }, [attempt]);
  const data = load.status === 'ready' ? load.data : null;
  const series = useMemo(() => data && district ? districtSeries(data, district) : [], [data, district]);
  return (
    <motion.section className="uva-respiratory" aria-labelledby="uva-respiratory-title"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }} transition={{ duration: reduceMotion ? 0 : 0.45 }}>
      <div className="uva-section-heading"><span className="eyebrow" aria-hidden="true">04 / RESPIRATORY HEALTH</span><h2 id="uva-respiratory-title">When Do Respiratory Emergencies Peak?</h2></div>
      <p className="respiratory-subtitle">Weekly emergency department visits associated with COVID-19, influenza, and RSV across Virginia.</p>
      {load.status === 'loading' && <div className="respiratory-data-state" role="status" aria-busy="true"><Database size={23} aria-hidden="true" /><p>Loading verified respiratory visit counts…</p></div>}
      {(load.status === 'missing' || load.status === 'error') && <div className="respiratory-data-state" role="status"><AlertCircle size={23} aria-hidden="true" /><h3>{load.status === 'missing' ? 'Waiting for verified source data' : 'Data unavailable'}</h3><p>{load.message}</p><button type="button" className="text-link" onClick={() => setAttempt(n => n + 1)}><RefreshCw size={15} aria-hidden="true" />Retry loading data</button></div>}
      {data && (!data.records.length || !data.districts.length ? <div className="respiratory-data-state" role="status"><h3>No respiratory observations found</h3><p>The imported file contains no chartable district observations. No values have been generated.</p></div> : <>
        <div className="respiratory-controls"><div><label htmlFor={selectId}>Health district</label><select id={selectId} value={district} onChange={event => setDistrict(event.target.value)} aria-describedby={`${selectId}-coverage`}>
          <option value="" disabled>All Districts — statewide total unavailable</option>
          {data.districts.map(name => <option key={name} value={name}>{name}</option>)}
        </select></div><span>Emergency Department records only<br />{formatWeek(data.coverage.start)} – {formatWeek(data.coverage.end)}</span></div>
        <p className="respiratory-scope" id={`${selectId}-coverage`}><strong>Coverage limitation:</strong> {data.statewide.reason} “All Districts” is disabled to avoid presenting a partial sum as a statewide total.</p>
        <WeeklyLineChart key={district} series={series} district={district} />
        <p className="respiratory-source">Source: Virginia Department of Health, via the capstone’s <code>{data.source.file}</code>. The source’s combined respiratory count is shown as reported; percentages, urgent-care records, and pollution measurements are not included in this chart.</p>
      </>)}
      <aside className="respiratory-observation" aria-label="Observational pattern, not causal evidence"><span className="eyebrow">OBSERVATIONAL PATTERN · NOT CAUSAL EVIDENCE</span><p>Respiratory emergency department visits exhibit strong seasonal patterns, with higher counts during winter and lower counts during spring and summer. Explore individual Virginia health districts to see how these patterns vary geographically.</p><p>These patterns do not establish that air pollution caused the visits.</p></aside>
    </motion.section>
  );
}
