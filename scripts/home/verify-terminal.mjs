import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url), ts = require('typescript');
const cache = new Map();
// Test-only TS loader, following the existing capstone verification scripts; never shipped to browsers.
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {}; cache.set(file, exports);
  const source = readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const localRequire = path => {
    assert.ok(path.startsWith('.'), 'Command registry must remain dependency-free apart from local content.');
    const resolved = resolve(dirname(file), path);
    return load(existsSync(resolved + '.ts') ? resolved + '.ts' : resolve(resolved, 'index.ts'));
  };
  new Function('exports', 'require', compiled)(exports, localRequire);
  return exports;
}
const terminal = load(resolve(root, 'src/components/home/terminalCommands.ts'));
const content = load(resolve(root, 'src/content/projects.ts'));
const profile = load(resolve(root, 'src/content.ts')).profile;
const context = { previousRandomDestination: null, random: () => 0.5 };
const run = value => terminal.executeCommand(value, context);
const expected = ['help','whoami','about','projects','skills','interests','now','random','contact','clear','sudo'];
assert.deepEqual(terminal.commandRegistry.map(c => c.name), expected);
assert.equal(terminal.suggestedCommands.length, 10);
assert.ok(!terminal.suggestedCommands.some(c => c.name === 'sudo'));
assert.equal(run('help').output.items.length, 10);
assert.ok(!JSON.stringify(run('help')).includes('sudo'));
assert.deepEqual(run('  HeLp  '), run('help'));
assert.equal(run('   ').kind, 'none');
for (const name of expected) assert.ok(['output','clear','navigate'].includes(run(name).kind));
assert.equal(run('sudo').output.paragraphs[0], "Permission denied. Even Beer Buddy doesn't have admin privileges.");
assert.equal(run('sudo ls').output.paragraphs[0], "Command not found: sudo ls. Type 'help' to see available commands.");
const hostile = '<img src=x onerror=alert(1)>';
assert.equal(run(hostile).output.paragraphs[0], `Command not found: ${hostile}. Type 'help' to see available commands.`);
assert.deepEqual(run('projects').output.items.map(item => item.href), content.projects.map(content.getProjectRoute));
assert.equal(run('projects').output.items.length, 4);
assert.deepEqual(run('contact').output.items.map(item => item.href), [`mailto:${profile.email}`,profile.linkedin,profile.github]);
assert.deepEqual(terminal.eligibleRandomRoutes, ['/projects/virginia-air-quality']);
assert.equal(run('random').to, '/projects/virginia-air-quality');
assert.equal(terminal.chooseRandomDestination([], null, () => 0), null);
assert.equal(terminal.chooseRandomDestination(['/', '//example.com'], null, () => 0), null);
assert.equal(terminal.chooseRandomDestination(['/a','/b','/a'], '/a', () => 0), '/b');
assert.equal(terminal.chooseRandomDestination(['/a','/b'], '/b', () => 0.999), '/a');
assert.equal(terminal.chooseRandomDestination(['/a'], '/a', () => 0), '/a');
let state = terminal.initialTerminalState;
assert.equal(state.input, ''); assert.equal(state.output, null); assert.deepEqual(state.history, []);
for (const command of ['whoami','skills','contact']) state = terminal.terminalReducer(state,{type:'execute',command,result:run(command)});
assert.deepEqual(state.history,['whoami','skills','contact']);
assert.equal(state.output.title, "LET'S CONNECT"); // latest result only
state = terminal.terminalReducer(state,{type:'edit',value:'unfinished draft'});
for (const expectedCommand of ['contact','skills','whoami','whoami']) { state=terminal.terminalReducer(state,{type:'history',direction:'up'}); assert.equal(state.input,expectedCommand); }
for (const expectedCommand of ['skills','contact','unfinished draft']) { state=terminal.terminalReducer(state,{type:'history',direction:'down'}); assert.equal(state.input,expectedCommand); }
assert.equal(state.historyIndex,null);
state=terminal.terminalReducer(state,{type:'execute',command:'clear',result:run('clear')});
assert.equal(state.output,null); assert.equal(state.input,''); assert.deepEqual(state.history,[]); assert.equal(state.historyIndex,null); assert.equal(state.draft,'');
assert.equal(terminal.terminalReducer(state,{type:'history',direction:'up'}).input,'');
assert.equal(terminal.terminalReducer(state,{type:'execute',command:' ',result:run(' ')}), state);
assert.equal(terminal.terminalReducer(state,{type:'edit',value:'x'.repeat(300)}).input.length,160);
const home = readFileSync(resolve(root,'src/pages/Home.tsx'),'utf8');
assert.ok(home.includes('<TerminalHero />') && home.includes('<Background />'));
for (const asset of ['public/images/kian-website-portrait.png','public/brand/beer-buddy-hanging.png','public/Kian_Thomasbeer_Resume.pdf']) assert.ok(existsSync(resolve(root,asset)));
console.log('PASS: 11 commands, 10 suggestions, hidden sudo, safe unknown results, all project/contact routes, reviewed random eligibility and non-repeat selection, case/whitespace/empty handling, session history/draft restoration/clear, input bounds, and reused assets.');
