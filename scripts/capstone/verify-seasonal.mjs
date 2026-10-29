import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url), ts = require('typescript');
function load(source) {
  const exports = {};
  new Function('exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText)(exports);
  return exports;
}
const model = load(await readFile(resolve(root, 'src/content/virginiaSeasonalModel.ts'), 'utf8'));
assert.equal(model.januarySlopeUnits / model.coefficientScale, 0.02072);
assert.deepEqual(model.seasonalMonths.map(m => m.month), ['January', 'July', 'September', 'October']);
assert.deepEqual(model.seasonalMonths.map(model.monthInteraction), [0, -0.06989, 0.06823, 0.07225]);
assert.deepEqual(model.seasonalMonths.map(model.monthSlope), [0.02072, -0.04917, 0.08895, 0.09297]);
assert.equal(model.seasonalMonths.filter(m => m.reference).length, 1);
assert.equal(model.seasonalMonths[0].reference, true);
assert.deepEqual(model.seasonalMonths.map(m => model.coefficientLabel(model.monthSlope(m))), ['+0.02072', '-0.04917', '+0.08895', '+0.09297']);
const helpers = load(await readFile(resolve(root, 'src/components/capstone/respiratoryData.ts'), 'utf8'));
const data = helpers.parseRespiratoryDataset(JSON.parse(await readFile(resolve(root, 'public/data/capstone/respiratory-visits.json'), 'utf8')));
const series = helpers.districtSeries(data, data.districts[0]);
const geometry = helpers.lineGeometry(series, 1100);
assert.equal(geometry.height - geometry.top - geometry.bottom, 307);
assert.ok(Math.abs(307 / 236 - 1.3) < 0.005);
assert.equal(helpers.lineGeometry(series, 330).height, 342);
console.log('PASS: Four documented terms, exact monthly slope sums, reference convention, coefficient labels, and ~30% desktop plot-height increase verified. No predictions or uncertainty values generated.');
