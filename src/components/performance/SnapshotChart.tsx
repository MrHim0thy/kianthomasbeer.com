import { useId, useState } from 'react';
export interface ChartPoint { date:string; value:number|null; detail?:string }
export const shortDate=(date:string)=>new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
export const number=(v:number|null,digits=0)=>v===null?'Not recorded':v.toLocaleString('en-US',{maximumFractionDigits:digits});
export default function SnapshotChart({title,description,points,unit,color='amber',bars=false}:{title:string;description:string;points:ChartPoint[];unit:string;color?:string;bars?:boolean}){
 const id=useId();const [selected,setSelected]=useState<string|null>(null);const current=points.find(p=>p.date===selected&&p.value!==null);const known=points.filter(p=>p.value!==null);const max=Math.max(1,...known.map(p=>p.value!))*1.12;
 const first=points.findIndex(p=>p.value!==null);const last=points.length-1-[...points].reverse().findIndex(p=>p.value!==null);
 const plotPoints=first<0?[]:points.slice(first,last+1);
 const x=(i:number)=>52+i*500/Math.max(1,plotPoints.length-1);const y=(v:number)=>190-v/max*150;
 const line=plotPoints.map((p,i)=>p.value===null?'':`${i===0||plotPoints[i-1].value===null?'M':'L'}${x(i)},${y(p.value)}`).join(' ');
 return <section className={`lab-panel lab-chart lab-${color}`} aria-labelledby={id}>
  <div className="lab-panel-heading"><div><span className="lab-kicker">RECORDED TRENDS</span><h2 id={id}>{title}</h2></div><span className="lab-unit">{unit}</span></div><p className="lab-caption">{description}</p>
  {!known.length?<p className="lab-empty">No recorded measurements in this date range.</p>:<>
   <p className="lab-coverage">Observed window: {shortDate(plotPoints[0].date)}–{shortDate(plotPoints[plotPoints.length-1].date)}. Internal gaps are missing readings.</p>
   <div className="lab-chart-scroll" tabIndex={0} role="group" aria-label={`${title}. Scroll horizontally on small screens. Focus a mark or use the data table for values.`}>
   <svg role="group" viewBox="0 0 600 235" aria-labelledby={`${id}-svg`}><title id={`${id}-svg`}>{title} in {unit}. Missing measurements are gaps.</title>
    {[0,1,2,3].map(i=><g key={i}><line x1="52" x2="570" y1={190-i*50} y2={190-i*50} className="lab-gridline"/><text x="43" y={194-i*50} textAnchor="end">{number(max*i/3,max<20?1:0)}</text></g>)}
    <text x="52" y="23">{unit}</text>
    {!bars&&<path d={line} fill="none" className="lab-line" strokeWidth="2.5"/>}
    {plotPoints.map((p,i)=>p.value===null?null:<g key={p.date} role="button" tabIndex={0} aria-label={`${shortDate(p.date)}, ${number(p.value,1)} ${unit}${p.detail?`, ${p.detail}`:''}`} onMouseEnter={()=>setSelected(p.date)} onFocus={()=>setSelected(p.date)} onClick={()=>setSelected(p.date)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(p.date);}if(e.key==='Escape')setSelected(null);}} className="lab-mark">
      {bars?<rect x={x(i)-Math.min(18,180/plotPoints.length)} y={y(p.value)} width={Math.min(36,360/plotPoints.length)} height={Math.max(1,190-y(p.value))} rx="4" className="lab-bar"/>:<><circle cx={x(i)} cy={y(p.value)} r="12" fill="transparent"/><circle cx={x(i)} cy={y(p.value)} r={selected===p.date?5:3.5} className="lab-dot"/></>}
    </g>)}
    {plotPoints.map((p,i)=>i%Math.max(1,Math.ceil(plotPoints.length/5))===0||i===plotPoints.length-1?<text key={p.date} x={x(i)} y="216" textAnchor="middle">{shortDate(p.date)}</text>:null)}
   </svg></div>
   <div className="lab-chart-readout" aria-live="polite">{current?<><strong>{shortDate(current.date)} · {number(current.value,1)} {unit}</strong>{current.detail&&<span>{current.detail}</span>}</>:<span>Hover, tap, or focus a mark to inspect its recorded value.</span>}</div>
  </>}
  <details className="lab-data"><summary>View accessible data table</summary><div className="lab-table-scroll"><table><caption>{title} — {unit}</caption><thead><tr><th scope="col">Date</th><th scope="col">{unit}</th><th scope="col">Context</th></tr></thead><tbody>{points.map(p=><tr key={p.date}><th scope="row">{p.date}</th><td>{number(p.value,1)}</td><td>{p.detail??'—'}</td></tr>)}</tbody></table></div></details>
 </section>;
}
