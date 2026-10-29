import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { parseArgs } from 'node:util';
import assert from 'node:assert/strict';
import { parseCsv, parseDate, transformCsv } from './import-respiratory.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
const moduleExports = {};
const helper = await readFile(resolve(root, 'src/components/capstone/respiratoryData.ts'), 'utf8');
new Function('exports', ts.transpileModule(helper, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText)(moduleExports);
const { parseRespiratoryDataset, districtSeries, lineGeometry } = moduleExports;
const data = parseRespiratoryDataset(JSON.parse(await readFile(resolve(root, 'public/data/capstone/respiratory-visits.json'), 'utf8')));
assert.equal(data.statewide.available, false);
assert.equal(data.records.length, data.audit.exportedRows);
for (const row of data.records) assert.ok(Object.keys(row).every(key => ['date', 'district', 'count', 'status'].includes(key)));
let absent = 0, suppressed = 0;
for (const district of data.districts) {
  const series = districtSeries(data, district);
  assert.equal(series.length, data.coverage.weekCount);
  const original = new Map(data.records.filter(r => r.district === district).map(r => [r.date, r]));
  let runs = 0, previousKnown = false;
  for (const point of series) {
    if (original.has(point.date)) assert.equal(point.count, original.get(point.date).count);
    else { assert.equal(point.count, null); assert.equal(point.status, 'absent'); absent++; }
    if (point.status === 'suppressed') { assert.equal(point.count, null); suppressed++; }
    const known = point.count !== null;
    if (known && !previousKnown) runs++;
    previousKnown = known;
  }
  assert.equal(lineGeometry(series, 800).paths.length, runs, 'Every missing/suppressed interval must break the SVG line.');
}
assert.equal(absent, data.coverage.missingDistrictWeeks);
assert.equal(suppressed, data.audit.suppressedCounts);
assert.ok(data.records.some(r => r.count === 0), 'Actual reported zeros must be retained.');
assert.throws(() => parseRespiratoryDataset({ ...data, records: [...data.records, data.records[0]] }), /Duplicate/);
assert.throws(() => parseRespiratoryDataset({ ...data, statewide: { available: true, reason: 'Not verified' } }), /Statewide/);
assert.equal(parseRespiratoryDataset({ ...data, records: [], districts: [] }).records.length, 0);
// Test-only missing-count fixture; never exported to the website or treated as research data.
const missingOnly = parseRespiratoryDataset({ ...data, districts: [data.districts[0]], records: [
  { date: data.coverage.start, district: data.districts[0], count: null, status: 'missing' },
] });
const missingSeries = districtSeries(missingOnly, data.districts[0]);
assert.ok(missingSeries.every(point => point.count === null));
assert.equal(missingSeries[0].status, 'missing');
assert.equal(missingSeries[1].status, 'absent');
assert.deepEqual(lineGeometry(missingSeries, 330).paths, []);
assert.equal(moduleExports.pointLabel(missingSeries[0]), 'Missing count in source');
assert.equal(moduleExports.formatWeek('2024-08-24'), 'Aug 24, 2024');
assert.throws(() => parseRespiratoryDataset({ ...data, records: [{ ...data.records[0], count: null, status: undefined }] }), /Invalid count/);
assert.throws(() => parseDate('2024-02-30', 1), /invalid date/);
assert.throws(() => parseCsv('a,a\n1,2'), /unique/);
assert.throws(() => parseCsv('a,b\n"unfinished'), /quoted field/);
assert.deepEqual(parseCsv('label,description\r\n"A,B","a ""quoted"" label"').records, [{ label: 'A,B', description: 'a "quoted" label' }]);
const { values } = parseArgs({ options: { input: { type: 'string' } } });
if (values.input) {
  const raw = await readFile(resolve(values.input));
  const parsed = parseCsv(raw.toString('utf8'));
  const config = JSON.parse(await readFile(resolve(root, 'scripts/capstone/respiratory-import.config.json'), 'utf8'));
  const hash = createHash('sha256').update(raw).digest('hex');
  assert.deepEqual(transformCsv(parsed, config, basename(values.input), hash), data, 'Reimport must exactly reproduce the published static JSON.');
  const edRow = parsed.records.find(row => row[config.facilityColumn] === config.facilityValue);
  assert.throws(() => transformCsv({ ...parsed, records: [...parsed.records, edRow] }, config, basename(values.input), hash), /Duplicate/);
  assert.throws(() => transformCsv(parsed, { ...config, countColumn: 'Percent.of.ED.Visits.Combined' }, basename(values.input), hash), /percentage/);
  console.log('PASS: Actual source reimport is byte-equivalent in content; duplicate ED rows and percentage measures are rejected.');
}
console.log(`PASS: ${data.records.length} actual records validated; ${suppressed} suppressed values and ${absent} absent weeks remain gaps; all district line segments, source fields, reported zeros, schema checks, and CSV parsing verified.`);
