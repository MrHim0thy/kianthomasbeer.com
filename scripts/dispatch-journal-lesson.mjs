import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {importLesson,readPayload} from './import-journal-lesson.mjs';
export async function prepareDispatch(file){const lesson=await readPayload({file});await importLesson(lesson,{dryRun:true});return {ref:'main',inputs:{lesson_json:JSON.stringify(lesson)}};}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const args=process.argv.slice(2);const file=args[args.indexOf('--file')+1];if(!args.includes('--file')||!file)throw Error('Usage: node scripts/dispatch-journal-lesson.mjs --file lesson.json [--output payload.json] [--send]');const payload=await prepareDispatch(file);
 if(args.includes('--output'))await writeFile(args[args.indexOf('--output')+1],JSON.stringify(payload,null,2)+'\n');
 if(!args.includes('--send')){console.log('Dispatch payload validated. Nothing sent, committed, or deployed. Use --send only after owner approval and workflow activation.');}
 else{const repo=process.env.JOURNAL_GITHUB_REPOSITORY,token=process.env.JOURNAL_GITHUB_TOKEN;if(!repo||!/^[-\w.]+\/[-\w.]+$/.test(repo)||!token)throw Error('Set JOURNAL_GITHUB_REPOSITORY and JOURNAL_GITHUB_TOKEN in the trusted publisher environment. Never use VITE_ credentials.');const response=await fetch(`https://api.github.com/repos/${repo}/actions/workflows/publish-journal.yml/dispatches`,{method:'POST',headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2026-03-10'},body:JSON.stringify(payload)});if(!response.ok)throw Error(`Workflow dispatch failed (${response.status}); check repository access and workflow activation.`);console.log('Publishing workflow requested. Check Actions for validation and deployment status.');}
 }catch(e){console.error(e.message);process.exitCode=1;}
}
