import {readFile,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
import {validateLesson} from '../src/data/journal/validation.mjs';
import {readJournal,repoRoot} from './build-journal.mjs';
export async function importLesson(value,{root=repoRoot,dryRun=false}={}){
 const collection=await readJournal(root);const lesson=validateLesson(value,collection.subjects.map(s=>s.id));
 if(lesson.status!=='published'||lesson.example)throw Error('Publishing accepts only real, published lessons. Examples and drafts belong in manual content files.');
 const existing=collection.lessons.find(l=>l.id===lesson.id);
 if(existing){if(isDeepStrictEqual(existing,lesson))return {changed:false,id:lesson.id};throw Error('This ID already exists with different content. Edit the source deliberately; automated imports cannot overwrite it.');}
 if(dryRun)return {changed:true,id:lesson.id};
 await writeFile(join(root,'content/journal/lessons',`${lesson.id}.json`),JSON.stringify(lesson,null,2)+'\n',{flag:'wx'});
 return {changed:true,id:lesson.id};
}
export async function readPayload({eventPath,file}={}){
 let raw;
 if(eventPath){const event=JSON.parse(await readFile(eventPath,'utf8'));if(typeof event.inputs?.lesson_json!=='string')throw Error('Missing lesson_json workflow input.');raw=event.inputs.lesson_json;}
 else if(file)raw=await readFile(file,'utf8');else throw Error('Provide --file lesson.json or --event event.json.');
 if(Buffer.byteLength(raw,'utf8')>50000)throw Error('Lesson payload exceeds 50 KB.');
 return JSON.parse(raw);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const args=process.argv.slice(2);const arg=name=>args[args.indexOf(name)+1];const result=await importLesson(await readPayload({eventPath:args.includes('--event')?arg('--event'):undefined,file:args.includes('--file')?arg('--file'):undefined}),{dryRun:args.includes('--dry-run')});if(process.env.GITHUB_OUTPUT)await writeFile(process.env.GITHUB_OUTPUT,`changed=${result.changed}\n`,{flag:'a'});console.log(`${args.includes('--dry-run')?'Validated':'Imported'} lesson ${result.id}; changed=${result.changed}`);}catch(e){console.error(e.message);process.exitCode=1;}
}
