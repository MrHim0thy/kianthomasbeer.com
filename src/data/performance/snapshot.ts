/// <reference types="vite/client" />
export interface Workout { date:string; start:string; end:string; activityCode:number; activity:string; durationMinutes:number|null; distanceMiles:number|null; energyKcal:number|null }
export interface DailyActivity { date:string; steps:number|null; walkingRunningMiles:number|null }
export interface HeartRate { date:string; bpm:number|null }
export interface Sleep { date:string; minutesAsleep:number|null; end:string }
export interface Snapshot { metadata:{ source:string; snapshotCreated:string; lastDataDate:string; status:string; notes:string[] }; workouts:Workout[]; dailyActivity:DailyActivity[]; restingHeartRate:HeartRate[]; sleepSessions:Sleep[] }
// HealthKit enum values, verified against the SDK binding maintained by Microsoft.
// https://github.com/dotnet/macios/blob/main/src/HealthKit/Enums.cs
export const sports:Record<number,string>={11:'Cross training',13:'Cycling',20:'Functional strength',34:'Racquetball',37:'Running',47:'Table tennis',50:'Traditional strength',52:'Walking',63:'HIIT',75:'Disc sports',79:'Pickleball'};
export const sportName=(w:Workout)=>sports[w.activityCode]??`Unmapped activity · ${w.activityCode}`;
const validDate=(v:unknown):v is string=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(`${v}T00:00:00Z`));
const record=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const metric=(v:unknown)=>v===null||(typeof v==='number'&&Number.isFinite(v)&&v>=0);
export function parseSnapshot(value:unknown):Snapshot {
  if(!record(value)||!record(value.metadata))throw Error('Snapshot metadata is missing.');
  const m=value.metadata;
  if(!validDate(m.lastDataDate)||!validDate(m.snapshotCreated)||typeof m.source!=='string'||m.status!=='historical_snapshot_not_live'||!Array.isArray(m.notes)||!m.notes.every(x=>typeof x==='string'))throw Error('Invalid historical snapshot metadata.');
  const specs=[['workouts',['durationMinutes','distanceMiles','energyKcal']],['dailyActivity',['steps','walkingRunningMiles']],['restingHeartRate',['bpm']],['sleepSessions',['minutesAsleep']]] as const;
  for(const [key,fields]of specs){const rows=value[key];if(!Array.isArray(rows))throw Error(`Missing ${key} records.`);for(const row of rows){if(!record(row)||!validDate(row.date)||fields.some(f=>!metric(row[f])))throw Error(`Invalid or missing value in ${key}. Use null for unavailable measurements.`);if(row.date>m.lastDataDate)throw Error('A record exceeds the declared last data date.');if(key==='workouts'&&(!Number.isInteger(row.activityCode)||typeof row.activity!=='string'||typeof row.start!=='string'||typeof row.end!=='string'||!Number.isFinite(Date.parse(row.start))||!Number.isFinite(Date.parse(row.end))||Date.parse(row.end)<=Date.parse(row.start)))throw Error('Invalid workout interval.');if(key==='sleepSessions'&&(typeof row.end!=='string'||!Number.isFinite(Date.parse(row.end))))throw Error('Invalid sleep end time.');}}
  for(const key of ['dailyActivity','restingHeartRate']as const){const rows=value[key]as {date:string}[];if(new Set(rows.map(r=>r.date)).size!==rows.length)throw Error(`Duplicate dates in ${key}; resolve source grain before aggregation.`);}
  return value as unknown as Snapshot;
}
export async function loadSnapshot(signal?:AbortSignal):Promise<Snapshot>{const response=await fetch(`${import.meta.env.BASE_URL}data/performance-lab/health-snapshot.json`,{signal});if(!response.ok)throw Error(`Snapshot could not be loaded (${response.status}).`);return parseSnapshot(await response.json());}
export function reconcileWorkouts(rows:Workout[]){
 const seen=new Set<string>();let duplicates=0;const unique=rows.filter(w=>{const key=`${Date.parse(w.start)}|${Date.parse(w.end)}`;if(seen.has(key)){duplicates++;return false;}seen.add(key);return true;}).sort((a,b)=>Date.parse(a.start)-Date.parse(b.start));
 const conflicted=new Set<Workout>();for(let i=0;i<unique.length;i++)for(let j=i+1;j<unique.length&&Date.parse(unique[j].start)<Date.parse(unique[i].end);j++){conflicted.add(unique[i]);conflicted.add(unique[j]);}
 return {workouts:unique.filter(w=>!conflicted.has(w)),duplicates,excluded:conflicted.size};
}
export const sumKnown=(values:(number|null)[]):number|null=>{const known=values.filter((v):v is number=>v!==null);return known.length?known.reduce((a,b)=>a+b,0):null;};
export const average=(values:(number|null)[]):number|null=>{const known=values.filter((v):v is number=>v!==null);return known.length?known.reduce((a,b)=>a+b,0)/known.length:null;};
export const inRange=(date:string,start:string,end:string)=>date>=start&&date<=end;
export function daysBetween(start:string,end:string){const result:string[]=[];for(let t=Date.parse(start+'T00:00:00Z');t<=Date.parse(end+'T00:00:00Z');t+=86400000)result.push(new Date(t).toISOString().slice(0,10));return result;}
export function monday(date:string){const d=new Date(date+'T00:00:00Z');d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10);}
export function sleepByDay(rows:Sleep[]){const map=new Map<string,Sleep[]>();for(const r of rows)map.set(r.date,[...(map.get(r.date)??[]),r]);return [...map].map(([date,sessions])=>({date,total:sumKnown(sessions.map(s=>s.minutesAsleep)),longest:sessions.reduce<number|null>((max,s)=>s.minutesAsleep===null?max:Math.max(max??0,s.minutesAsleep),null),sessions:sessions.length})).sort((a,b)=>a.date.localeCompare(b.date));}
