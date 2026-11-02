import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(path, imports={}) {
 const exports={};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:id=>{assert.ok(id in imports,`Unexpected import ${id}`);return imports[id];}});
 return exports;
}
const data=load('src/content/projects.ts');
const copy=load('src/content/homeTerminal.ts');
const commands=(publishedProjects=data.publishedProjects)=>load('src/components/home/terminalCommands.ts',{'../../content':{profile:{email:'test@example.com',linkedin:'https://example.com',github:'https://example.com'}},'../../content/projects':{...data,publishedProjects},'../../content/homeTerminal':copy});
const c=commands(); const ctx={previousRandomDestination:null,random:()=>0};
const list=c.executeCommand('  PrOjEcTs  ',ctx);
assert.equal(list.output.title,'AVAILABLE PROJECTS');
assert.deepEqual(Array.from(list.output.items,x=>x.href),Array.from(data.publishedProjects,data.getProjectRoute));
assert.equal(list.output.items.length,4);
assert.ok(list.output.items.every(x=>x.internal));
for(const route of c.eligibleRandomRoutes) assert.ok(data.projects.some(p=>data.getProjectRoute(p)===route&&p.published!==false));
const reached=new Set();let previous=null;
for(let i=0;i<100;i++) {const next=c.chooseRandomDestination(c.eligibleRandomRoutes,previous,()=>((i*37)%100)/100);assert.notEqual(next,previous);reached.add(next);previous=next;}
assert.equal(reached.size,4);
const base=data.projects[0];
const updated=data.getPublishedProjects([{...base,slug:'new-project',title:'New title',displayOrder:0},{...base,slug:'later',displayOrder:10},{...base,slug:'hidden',published:false},{...base,slug:''},{...base,slug:'../invalid'},{...base,slug:undefined}]);
assert.deepEqual(Array.from(updated,p=>p.slug),['new-project','later']);
assert.equal(commands(updated).executeCommand('projects',ctx).output.items[0].label,'1. New title');
assert.equal(commands([]).executeCommand('random',ctx).kind,'output');
assert.ok(commands([]).executeCommand('projects',ctx).output.paragraphs.length);
assert.equal(commands([base]).executeCommand('random',ctx).to,data.getProjectRoute(base));
assert.equal(c.chooseRandomDestination([],null,Math.random),null);
for(const name of ['help','whoami','about','skills','interests','now','contact'])assert.equal(c.executeCommand(` ${name.toUpperCase()} `,ctx).kind,'output');
assert.equal(c.executeCommand('clear',ctx).kind,'clear');assert.equal(c.executeCommand(' ',ctx).kind,'none');assert.equal(c.executeCommand('unknown',ctx).kind,'output');
let state=c.terminalReducer(c.initialTerminalState,{type:'execute',command:'projects',result:list});state=c.terminalReducer(state,{type:'edit',value:'draft'});state=c.terminalReducer(state,{type:'history',direction:'up'});assert.equal(state.input,'projects');state=c.terminalReducer(state,{type:'history',direction:'down'});assert.equal(state.input,'draft');
console.log('Terminal project checks passed: live collection, publication/routes/order/rename/addition, empty/single pools, 100 no-repeat selections, normalization and command history.');

