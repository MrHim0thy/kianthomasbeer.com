import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const require=createRequire(import.meta.url), ts=require('typescript');
function load(file) {const exports={};new Function('exports','require',ts.transpileModule(readFileSync(resolve(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(exports,require);return exports;}
const {readingProgress}=load('src/components/capstone/readingProgressMath.ts');
assert.equal(readingProgress(0,200,2000,800),0);
assert.equal(readingProgress(200,200,2000,800),0);
assert.equal(readingProgress(800,200,2000,800),.5);
assert.equal(readingProgress(1400,200,2000,800),1);
assert.equal(readingProgress(9000,200,2000,800),1);
assert.equal(readingProgress(0,200,300,800),1);
assert.equal(readingProgress(0,900,300,800),0);
assert.equal(readingProgress(800,200,2600,800),1/3); // expanded content changes the denominator
const {researchReveal}=load('src/components/capstone/useResearchReveal.ts');
const visibleFallback={initial:false,animate:{opacity:1,y:0},transition:{duration:0}};
assert.deepEqual(researchReveal(true,true),visibleFallback);
assert.deepEqual(researchReveal(false,false),visibleFallback);
assert.equal(researchReveal(false,true).viewport.once,true);
assert.equal(researchReveal(false,true).initial.y,10);
const files=['VirginiaAirQualityCaseStudy.tsx','RawDataResearch.tsx','capstone/RespiratoryVisitsChart.tsx','capstone/SeasonalCoefficientChart.tsx','capstone/StatisticalModelExplorer.tsx','capstone/ResearchConclusions.tsx','capstone/ResearchResources.tsx'];
function contentSignature(source) {
 const file=ts.createSourceFile('component.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),text=[],handlers=[];
 function visit(node) {
  if(ts.isJsxElement(node)) {
   const classAttr=node.openingElement.attributes.properties.find(prop=>ts.isJsxAttribute(prop)&&prop.name.getText(file)==='className');
   if(classAttr?.initializer&&ts.isStringLiteral(classAttr.initializer)&&['uva-chapter-number','uva-notebook-label'].includes(classAttr.initializer.text))return;
  }
  if(ts.isJsxText(node)){const value=node.text.replace(/\s+/g,' ').trim();if(value)text.push(value);}
  if(ts.isJsxAttribute(node)&&/^on[A-Z]/.test(node.name.getText(file)))handlers.push(node.getText(file));
  ts.forEachChild(node,visit);
 }
 visit(file);return {text,handlers};
}
for(const file of files){const path=`src/components/${file}`;const baseline=execFileSync('git',['show',`HEAD:${path}`],{cwd:root,encoding:'utf8'});assert.deepEqual(contentSignature(readFileSync(resolve(root,path),'utf8')),contentSignature(baseline),`${path}: research JSX text and event handlers must stay identical`);}
execFileSync('git',['diff','--exit-code','--','src/content','public/data','public/reports','src/components/capstone/respiratoryData.ts','src/components/capstone/CapstoneQa.css','src/pages','src/App.tsx','src/styles.css'],{cwd:root});
console.log('PASS: Reading-progress bounds, dynamic-height denominator, once-only reveal and safe motion/observer fallbacks. Original research JSX text, event handlers, datasets, coefficients/content, QA styles, routing, metadata and unrelated pages are unchanged.');
