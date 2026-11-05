import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateCollection} from '../src/data/journal/validation.mjs';
export const repoRoot=resolve(fileURLToPath(new URL('..',import.meta.url)));
export async function readJournal(root=repoRoot){const folder=join(root,'content/journal');const subjects=JSON.parse(await readFile(join(folder,'subjects.json'),'utf8'));const files=(await readdir(join(folder,'lessons'))).filter(f=>f.endsWith('.json')).sort();const lessons=await Promise.all(files.map(async file=>{const lesson=JSON.parse(await readFile(join(folder,'lessons',file),'utf8'));if(file!==`${lesson.id}.json`)throw Error(`Lesson filename must match its ID: ${file}`);return lesson;}));return validateCollection(subjects,lessons,{strict:true});}
export async function buildJournal(root=repoRoot){const {subjects,lessons}=await readJournal(root);const folder=join(root,'public/data/journal');await mkdir(folder,{recursive:true});const published=lessons.filter(l=>l.status==='published');await writeFile(join(folder,'catalog.json'),JSON.stringify({schemaVersion:1,subjects,lessons:published},null,2)+'\n');return {subjects:subjects.length,lessons:published.length};}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{console.log('Journal catalog built:',await buildJournal());}catch(e){console.error(e.message);process.exitCode=1;}}
