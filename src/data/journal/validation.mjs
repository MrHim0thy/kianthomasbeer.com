// Shared by browser loading, local content builds, and the publishing gate.
export const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const text = (value, max = 500) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
export function validDate(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value+'T00:00:00Z')) && new Date(value+'T00:00:00Z').toISOString().slice(0,10) === value; }
export function validateSubject(s) {
 if (!isRecord(s) || !text(s.id,80) || !idPattern.test(s.id) || !text(s.name,80) || !text(s.category,80) || !text(s.description,500) || typeof s.active !== 'boolean' || !['amber','sage','sky','navy'].includes(s.color)) throw Error('Invalid subject fields.');
 if (s.goal !== undefined && (!isRecord(s.goal) || !Number.isInteger(s.goal.targetLessons) || s.goal.targetLessons < 1 || s.goal.targetLessons > 100000 || !text(s.goal.label,100) || typeof s.goal.example !== 'boolean')) throw Error('Invalid optional publishing goal.');
 return s;
}
export function validateLesson(l, subjectIds, today = new Date().toISOString().slice(0,10)) {
 if (!isRecord(l) || !text(l.id,120) || !idPattern.test(l.id) || !subjectIds.includes(l.subjectId) || !validDate(l.date) || !text(l.title,180) || !text(l.summary,600) || !['published','draft'].includes(l.status) || typeof l.example !== 'boolean') throw Error('Invalid lesson identity, subject, date, or summary.');
 if (l.status === 'published' && l.date > today) throw Error('Published lessons cannot be dated in the future.');
 if (!Array.isArray(l.tags) || l.tags.length > 15 || l.tags.some(t=>!text(t,40)) || new Set(l.tags.map(t=>t.trim().toLowerCase())).size !== l.tags.length) throw Error('Invalid or duplicate tags.');
 if (!isRecord(l.source) || !['manual','scheduled-task','example'].includes(l.source.kind) || !text(l.source.label,180) || (l.example !== (l.source.kind === 'example'))) throw Error('Invalid lesson provenance. Example source and flag must agree.');
 if (!Array.isArray(l.content) || l.content.length < 1 || l.content.length > 60) throw Error('Lesson content must contain 1–60 blocks.');
 for (const b of l.content) {
  if (!isRecord(b) || !['paragraph','heading','code','list','exercise'].includes(b.type)) throw Error('Unknown content block.');
  if (b.type === 'list') { if (!Array.isArray(b.items) || !b.items.length || b.items.length>30 || b.items.some(i=>!text(i,1000))) throw Error('Invalid list block.'); }
  else if (!text(b.text,b.type==='code'?10000:4000)) throw Error('Invalid content text.');
  if (b.type === 'code' && (typeof b.language !== 'string' || !/^[a-z0-9+-]{1,20}$/.test(b.language))) throw Error('Invalid code language.');
 }
 return l;
}
export function validateCollection(subjectInput, lessonInput, {strict=false,today=new Date().toISOString().slice(0,10)}={}) {
 const issues=[]; const subjects=[]; const lessons=[];
 const subjectRows=Array.isArray(subjectInput)?subjectInput:[];const lessonRows=Array.isArray(lessonInput)?lessonInput:[];
 if (!Array.isArray(subjectInput)||!Array.isArray(lessonInput)) issues.push('The journal must contain subject and lesson arrays.');
 const duplicates=rows=>{const counts=new Map();for(const r of rows)if(isRecord(r)&&typeof r.id==='string')counts.set(r.id,(counts.get(r.id)??0)+1);return new Set([...counts].filter(([,n])=>n>1).map(([id])=>id));};
 const subjectDuplicates=duplicates(subjectRows),lessonDuplicates=duplicates(lessonRows);
 for(const [index,s] of subjectRows.entries())try{if(subjectDuplicates.has(s?.id))throw Error('Duplicate subject ID.');subjects.push(validateSubject(s));}catch(e){issues.push(`Subject ${index+1}: ${e.message}`);}
 for(const [index,l] of lessonRows.entries())try{if(lessonDuplicates.has(l?.id))throw Error('Duplicate lesson ID.');lessons.push(validateLesson(l,subjects.map(s=>s.id),today));}catch(e){issues.push(`Lesson ${index+1}: ${e.message}`);}
 if(strict&&issues.length)throw Error(issues.join('\n'));
 return {subjects,lessons:lessons.sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id)),issues};
}
