/// <reference types="vite/client" />
import { validateCollection, isRecord, type Journal, type Lesson } from './validation.mjs';
export type { Journal, Lesson, Subject, ContentBlock } from './validation.mjs';
export async function loadJournal(signal?:AbortSignal):Promise<Journal>{
 const response=await fetch(`${import.meta.env.BASE_URL}data/journal/catalog.json`,{signal,cache:'no-cache'});
 if(!response.ok)throw Error(`Journal could not be loaded (${response.status}).`);
 const data:unknown=await response.json();if(!isRecord(data)||data.schemaVersion!==1)throw Error('Unsupported journal format.');
 const parsed=validateCollection(data.subjects,data.lessons);return {...parsed,lessons:parsed.lessons.filter(l=>l.status==='published')};
}
export function filterLessons(lessons:Lesson[],{subject,tag,query,kind,date}:{subject:string;tag:string;query:string;kind:string;date:string}){
 const q=query.trim().toLocaleLowerCase();return lessons.filter(l=>(subject==='all'||l.subjectId===subject)&&(tag==='all'||l.tags.includes(tag))&&(kind==='all'||(kind==='examples'?l.example:!l.example))&&(!date||l.date===date)&&(!q||[l.title,l.summary,...l.tags,...l.content.flatMap(b=>b.type==='list'?b.items:[b.text])].join(' ').toLocaleLowerCase().includes(q)));
}
export const dateLabel=(date:string)=>new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
export function countByDate(lessons:Lesson[]){const counts=new Map<string,number>();for(const l of lessons)counts.set(l.date,(counts.get(l.date)??0)+1);return counts;}
export function journalDays(end:string,length=84){return Array.from({length},(_,i)=>new Date(Date.parse(end+'T00:00:00Z')-(length-i-1)*86400000).toISOString().slice(0,10));}
