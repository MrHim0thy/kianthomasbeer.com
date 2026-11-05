import { useMemo, useState } from "react";
import { Heading } from "../components/Shared";
import journal from "../data/learning-journal.json";

type Topic = {id:string;name:string;area:string;description?:string;goalLessons?:number};
type Entry = {id:string;topicId:string;date:string;title:string;summary:string;tags:string[];body?:string;status?:string};
const topics:Topic[] = journal.topics;
const entries:Entry[] = journal.entries;
const styles = {
  shell:{maxWidth:1100,margin:"0 auto",padding:"24px 24px 100px"} as const,
  card:{border:"1px solid #e3dccd",borderRadius:18,padding:24,background:"#fffdf8"} as const,
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16} as const,
};
export default function CuriosityJournal(){
 const [topic,setTopic]=useState("all");
 const [search,setSearch]=useState("");
 const [examples,setExamples]=useState(true);
 const [expanded,setExpanded]=useState<string|null>(null);
 const published=entries.filter(e=>e.status!=="example");
 const visible=useMemo(()=>entries.filter(e=>(examples||e.status!=="example")&&(topic==="all"||e.topicId===topic)&&[e.title,e.summary,e.body||"",...e.tags].join(" ").toLowerCase().includes(search.toLowerCase())).sort((a,b)=>b.date.localeCompare(a.date)),[topic,search,examples]);
 const dates=new Set(published.map(e=>e.date));
 const days=Array.from({length:35},(_,i)=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-34+i);const key=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");return {key,active:dates.has(key)};});
 return <><Heading label="A LIVING NOTEBOOK" title="Curiosity Journal" text="A running archive of the things I'm exploring, one lesson at a time."/><section style={styles.shell}>
 <div style={styles.grid}>{[[published.length,"Published lessons"],[topics.length,"Learning tracks"],[dates.size,"Days with lessons"]].map(([value,label])=><div style={styles.card} key={label}><div style={{fontSize:40,fontWeight:800}}>{value}</div><span>{label}</span></div>)}</div>
 <h2 style={{marginTop:52}}>What I'm learning</h2><p>Progress reflects published lessons, not proficiency.</p>
 <div style={styles.grid}>{topics.map(t=>{const count=published.filter(e=>e.topicId===t.id).length;return <button key={t.id} onClick={()=>setTopic(topic===t.id?"all":t.id)} aria-pressed={topic===t.id} style={{...styles.card,textAlign:"left",cursor:"pointer",borderColor:topic===t.id?"#bb842e":"#e3dccd",color:"inherit",font:"inherit"}}><small style={{color:"#a97425"}}>{t.area.toUpperCase()}</small><h3 style={{fontSize:26,margin:"12px 0"}}>{t.name}</h3><p>{t.description}</p>{t.goalLessons?<><div style={{height:8,background:"#eee9de",borderRadius:10,overflow:"hidden"}}><div style={{height:"100%",background:"#cc9239",width:Math.min(100,count/t.goalLessons*100)+"%"}}/></div><small>{count} / {t.goalLessons} published lessons</small></>:<small>{count} published lessons</small>}</button>})}</div>
 <h2 style={{marginTop:52}}>Learning activity</h2><p>Past 35 days, published lessons only.</p><div style={{display:"grid",gridTemplateColumns:"repeat(35,minmax(0,1fr))",gap:4,maxWidth:720}}>{days.map(d=><span key={d.key} title={d.key+(d.active?": lesson published":": no lesson")} style={{aspectRatio:"1",borderRadius:3,background:d.active?"#c58a35":"#e9e4d9"}}/>)}</div>
 <h2 style={{marginTop:52}}>Lesson timeline</h2><div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
 <input aria-label="Search lessons" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search lessons or tags" style={{padding:12,border:"1px solid #ddd5c7",borderRadius:10,flex:"1 1 200px"}}/>
 <select aria-label="Filter by topic" value={topic} onChange={e=>setTopic(e.target.value)} style={{padding:12,border:"1px solid #ddd5c7",borderRadius:10}}><option value="all">All subjects</option>{topics.map(t=><option value={t.id} key={t.id}>{t.name}</option>)}</select>
 <label style={{display:"flex",alignItems:"center",gap:6}}><input type="checkbox" checked={examples} onChange={e=>setExamples(e.target.checked)}/> Show examples</label></div>
 <div style={styles.grid}>{visible.map(e=><article key={e.id} style={styles.card}><div style={{fontSize:12,color:"#8a672f"}}><time dateTime={e.date}>{e.date}</time> · {topics.find(t=>t.id===e.topicId)?.name||e.topicId}</div>{e.status==="example"&&<small style={{display:"inline-block",marginTop:10,background:"#eaecef",padding:"4px 8px",borderRadius:10}}>Example, not a real lesson</small>}<h3 style={{fontSize:22,margin:"16px 0 8px"}}>{e.title}</h3><p>{e.summary}</p><p style={{color:"#a97425",fontSize:12}}>{e.tags.map(t=>"#"+t).join("  ")}</p>{e.body&&<><button onClick={()=>setExpanded(expanded===e.id?null:e.id)} aria-expanded={expanded===e.id} style={{background:"none",border:0,padding:"10px 0",color:"#a97425",fontWeight:700,cursor:"pointer"}}>{expanded===e.id?"Hide notes":"Read notes"}</button>{expanded===e.id&&<p style={{whiteSpace:"pre-wrap",borderTop:"1px solid #eee",paddingTop:12}}>{e.body}</p>}</>}</article>)}</div>
 {!visible.length&&<p role="status">No lessons match these filters.</p>}
 <p style={{fontSize:12,opacity:.7,marginTop:30}}>Historical entries are loaded from a versioned JSON file. Automatic ChatGPT publishing is not connected yet.</p>
 </section></>;
}
