import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { parseArgs } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const defaultConfig = resolve(root, 'scripts/capstone/respiratory-import.config.json');
const defaultOutput = resolve(root, 'public/data/capstone/respiratory-visits.json');
const day = 86_400_000;

// RFC 4180-style CSV parsing, including quoted delimiters, escaped quotes, and newlines.
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false, closed = false;
  const finishField = () => { row.push(field); field = ''; closed = false; };
  const finishRow = () => { finishField(); if (row.some(value => value.trim() !== '')) rows.push(row); row = []; };
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else field += char;
    } else if (char === '"') {
      if (field || closed) throw new Error('Unexpected quote in unquoted CSV field.');
      quoted = true;
    } else if (char === ',') finishField();
    else if (char === '\r' || char === '\n') {
      finishRow();
      if (char === '\r' && text[i + 1] === '\n') i++;
    } else {
      if (closed) {
        if (!/\s/.test(char)) throw new Error('Unexpected content after a quoted CSV field.');
      } else field += char;
    }
  }
  if (quoted) throw new Error('CSV ends inside a quoted field.');
  if (row.length || field || closed) finishRow();
  if (!rows.length) throw new Error('CSV is empty.');
  const headers = rows.shift();
  if (headers.some(h => !h.trim()) || new Set(headers).size !== headers.length) throw new Error('CSV headers must be nonempty and unique.');
  const records = rows.map((values, index) => {
    if (values.length !== headers.length) throw new Error(`CSV record ${index + 2} has ${values.length} fields; expected ${headers.length}.`);
    return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
  });
  return { headers, records };
}

export function parseDate(value, line) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Record ${line}: expected an explicit YYYY-MM-DD date, received ${JSON.stringify(value)}.`);
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) throw new Error(`Record ${line}: invalid date.`);
  return timestamp;
}

export function transformCsv(parsed, config, sourceName, sha256) {
  for (const field of ['dateColumn', 'districtColumn', 'countColumn', 'facilityColumn', 'facilityValue']) {
    if (typeof config[field] !== 'string' || !config[field]) throw new Error(`Import config requires ${field}.`);
  }
  for (const column of [config.dateColumn, config.districtColumn, config.countColumn, config.facilityColumn]) {
    if (!parsed.headers.includes(column)) throw new Error(`Missing exact column ${JSON.stringify(column)}. Run --inspect and review the mapping.`);
  }
  if (config.measureType !== 'count' || config.dateFormat !== 'YYYY-MM-DD') throw new Error('Only verified count measures and explicit YYYY-MM-DD dates are supported.');
  if (/percent|percentage|rate|proportion/i.test(config.countColumn)) throw new Error('A rate/percentage column cannot be used as a visit count.');
  const missing = new Set(config.missingTokens.map(v => v.toLowerCase()));
  const suppressed = new Set(config.suppressedTokens);
  const keys = new Set(), districts = new Set(), dates = new Set();
  const records = [];
  let excluded = 0, suppressedCount = 0, missingCount = 0, trimmedDistricts = 0;
  for (const [index, row] of parsed.records.entries()) {
    // Keep clinical setting separate: urgent-care and missing-facility rows are NOT ED visits.
    if (row[config.facilityColumn].trim() !== config.facilityValue) { excluded++; continue; }
    const district = row[config.districtColumn].trim();
    const date = row[config.dateColumn].trim();
    if (!district || missing.has(district.toLowerCase())) throw new Error(`Record ${index + 2}: missing district for selected facility.`);
    parseDate(date, index + 2);
    if (district !== row[config.districtColumn]) trimmedDistricts++;
    const key = `${date}\u0000${district}`;
    if (keys.has(key)) throw new Error(`Duplicate week/district key: ${date}, ${district}. Check facility type, revisions, subgroups, and merge expansion. No rows have been summed or silently discarded.`);
    keys.add(key); districts.add(district); dates.add(date);
    const token = row[config.countColumn].trim();
    let count = null, status;
    if (suppressed.has(token)) { status = 'suppressed'; suppressedCount++; }
    else if (missing.has(token.toLowerCase())) { status = 'missing'; missingCount++; }
    else {
      if (!/^\d+$/.test(token) || !Number.isSafeInteger(Number(token))) throw new Error(`Record ${index + 2}: expected a nonnegative integer count or a documented missing/suppressed token, received ${JSON.stringify(token)}.`);
      count = Number(token);
    }
    records.push({ date, district, count, ...(status ? { status } : {}) });
  }
  if (!records.length) throw new Error('No records match the verified facility filter. Nothing exported.');
  const orderedDates = [...dates].sort();
  const start = orderedDates[0], end = orderedDates.at(-1);
  const startTime = parseDate(start), endTime = parseDate(end);
  for (const date of orderedDates) if ((parseDate(date) - startTime) % (7 * day) !== 0) throw new Error(`Date ${date} is not on the same weekly cadence as ${start}. Review the reporting grain.`);
  const weekCount = (endTime - startTime) / (7 * day) + 1;
  records.sort((a, b) => a.date.localeCompare(b.date) || a.district.localeCompare(b.district));
  return {
    version: 1,
    source: { agency: 'Virginia Department of Health', file: sourceName, sha256, facility: config.facilityValue },
    districts: [...districts].sort((a, b) => a.localeCompare(b)),
    coverage: { start, end, weekCount, missingDistrictWeeks: weekCount * districts.size - records.length },
    statewide: { available: false, reason: config.statewideUnavailableReason || 'Full statewide coverage and non-overlapping district counts have not been verified.' },
    audit: {
      inputRows: parsed.records.length, excludedFacilityRows: excluded, exportedRows: records.length,
      duplicateKeys: 0, suppressedCounts: suppressedCount, missingCounts: missingCount, trimmedDistrictNames: trimmedDistricts,
      grain: 'One Emergency Department combined-respiratory count per week-ending date and health district.',
      transformations: ['Filter to Emergency Department only.', 'Trim district/date/count whitespace; no district aliases or boundary changes inferred.', 'Validate ISO dates and weekly cadence.', 'Reject duplicate week/district keys; no aggregation or deduplication.', 'Retain suppressed/missing counts as null with status; absent district-weeks remain absent.', 'Export only date, district, count, and missing-status fields. No percentage variables exported or summed.'],
    },
    records,
  };
}

async function main() {
  const { values } = parseArgs({ options: {
    input: { type: 'string' }, config: { type: 'string', default: defaultConfig },
    output: { type: 'string', default: defaultOutput }, inspect: { type: 'boolean', default: false },
  } });
  if (!values.input) throw new Error('Usage: node scripts/capstone/import-respiratory.mjs --input <actual.csv> [--inspect] [--config <mapping.json>] [--output <public-data.json>]');
  const input = resolve(values.input), output = resolve(values.output);
  if (input === output) throw new Error('Output must not overwrite the source CSV.');
  const raw = await readFile(input);
  const parsed = parseCsv(raw.toString('utf8'));
  const config = JSON.parse(await readFile(resolve(values.config), 'utf8'));
  if (values.inspect) {
    console.log(JSON.stringify({ file: basename(input), headers: parsed.headers, rows: parsed.records.length,
      facilityValues: parsed.headers.includes(config.facilityColumn) ? Object.fromEntries([...new Set(parsed.records.map(r => r[config.facilityColumn]))].map(v => [v, parsed.records.filter(r => r[config.facilityColumn] === v).length])) : 'Configured facility column absent; review headers.' }, null, 2));
    return;
  }
  const result = transformCsv(parsed, config, basename(input), createHash('sha256').update(raw).digest('hex'));
  await mkdir(dirname(output), { recursive: true });
  // All validation completes before the production data file is replaced.
  await writeFile(output, JSON.stringify(result) + '\n');
  console.log(JSON.stringify({ output: output.startsWith(root) ? output.slice(root.length + 1) : basename(output), coverage: result.coverage, districts: result.districts.length, audit: result.audit, statewide: result.statewide }, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(`Import failed: ${error.message}`); process.exitCode = 1; });
}
