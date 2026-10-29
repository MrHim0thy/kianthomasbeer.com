export interface RespiratoryRecord {
  date: string;
  district: string;
  count: number | null;
  status?: 'suppressed' | 'missing';
}
export interface RespiratoryDataset {
  version: 1;
  source: { agency: string; file: string; sha256: string; facility: string };
  districts: string[];
  coverage: { start: string; end: string; weekCount: number; missingDistrictWeeks: number };
  statewide: { available: false; reason: string };
  audit: { inputRows: number; excludedFacilityRows: number; exportedRows: number; duplicateKeys: number; suppressedCounts: number; missingCounts: number; trimmedDistrictNames: number; grain: string; transformations: string[] };
  records: RespiratoryRecord[];
}
export interface WeeklyPoint {
  date: string;
  count: number | null;
  status?: 'suppressed' | 'missing' | 'absent';
}
const weekMilliseconds = 7 * 86400000;
function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value + 'T00:00:00Z');
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}
export function parseRespiratoryDataset(value: unknown): RespiratoryDataset {
  if (!value || typeof value !== 'object') throw new Error('Invalid data document.');
  const data = value as RespiratoryDataset;
  if (data.version !== 1 || !Array.isArray(data.records) || !Array.isArray(data.districts) || !data.districts.every(d => typeof d === 'string' && d.trim()) || new Set(data.districts).size !== data.districts.length) throw new Error('Invalid districts or records.');
  if (!validDate(data.coverage?.start) || !validDate(data.coverage?.end) || data.coverage.end < data.coverage.start) throw new Error('Invalid coverage dates.');
  const start = Date.parse(data.coverage.start + 'T00:00:00Z');
  const end = Date.parse(data.coverage.end + 'T00:00:00Z');
  const weeks = (end - start) / weekMilliseconds + 1;
  if (!Number.isInteger(weeks) || weeks > 5200 || weeks !== data.coverage.weekCount) throw new Error('Invalid weekly cadence.');
  // Statewide aggregation must be reviewed against a full non-overlapping district roster first.
  if (data.statewide?.available !== false || typeof data.statewide.reason !== 'string') throw new Error('Statewide coverage has not been reviewed for this dataset schema.');
  if (typeof data.source?.file !== 'string' || /[\\/]/.test(data.source.file) || data.source.facility !== 'Emergency Department') throw new Error('Invalid data provenance or clinical setting.');
  const districts = new Set(data.districts), keys = new Set<string>();
  for (const row of data.records) {
    if (!row || !validDate(row.date) || !districts.has(row.district)) throw new Error('Invalid observation key.');
    const time = Date.parse(row.date + 'T00:00:00Z');
    if (time < start || time > end || (time - start) % weekMilliseconds !== 0) throw new Error('Observation is outside the weekly grid.');
    if (row.count === null ? row.status !== 'suppressed' && row.status !== 'missing' : !Number.isSafeInteger(row.count) || row.count < 0 || row.status !== undefined) throw new Error('Invalid count or missing status.');
    const key = row.date + '\u0000' + row.district;
    if (keys.has(key)) throw new Error('Duplicate weekly district observations.');
    keys.add(key);
  }
  return data;
}
export function districtSeries(data: RespiratoryDataset, district: string): WeeklyPoint[] {
  const observations = new Map(data.records.filter(r => r.district === district).map(r => [r.date, r]));
  const series: WeeklyPoint[] = [];
  const start = Date.parse(data.coverage.start + 'T00:00:00Z');
  for (let i = 0; i < data.coverage.weekCount; i++) {
    const date = new Date(start + i * weekMilliseconds).toISOString().slice(0, 10);
    const row = observations.get(date);
    series.push(row ? { date, count: row.count, status: row.status } : { date, count: null, status: 'absent' });
  }
  return series;
}
const weekFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const compactWeekFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export function formatWeek(date: string, compact = false): string {
  return (compact ? compactWeekFormatter : weekFormatter).format(new Date(date + 'T00:00:00Z'));
}
export function pointLabel(point: WeeklyPoint): string {
  if (point.count !== null) return `${point.count.toLocaleString('en-US')} visits`;
  if (point.status === 'suppressed') return 'Suppressed by source (*)';
  if (point.status === 'absent') return 'No observation in source';
  return 'Missing count in source';
}
export function lineGeometry(series: WeeklyPoint[], width: number) {
  // Presentation only: desktop plot area grows from 236px to 307px (~30%).
  const desktop = width >= 700;
  const left = desktop ? 76 : 71, right = 22, top = 32, bottom = 72, height = desktop ? 411 : 342;
  const max = Math.max(0, ...series.flatMap(p => p.count === null ? [] : [p.count]));
  const rawStep = Math.max(1, max / 4), magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = Math.max(1, Math.ceil(rawStep / magnitude) * magnitude);
  const yMax = Math.max(step, Math.ceil(max / step) * step);
  const x = (index: number) => left + index / Math.max(1, series.length - 1) * (width - left - right);
  const y = (count: number) => top + (1 - count / yMax) * (height - top - bottom);
  const paths: string[] = [];
  let path = '';
  series.forEach((point, index) => {
    if (point.count === null) { if (path) paths.push(path); path = ''; }
    else path += `${path ? ' L' : 'M'}${x(index).toFixed(2)},${y(point.count).toFixed(2)}`;
  });
  if (path) paths.push(path);
  const yTicks = Array.from({ length: Math.round(yMax / step) + 1 }, (_, i) => i * step);
  const tickCount = width < 550 ? 3 : 5;
  const xTicks = [...new Set(Array.from({ length: tickCount }, (_, i) => Math.round(i / (tickCount - 1) * (series.length - 1))))];
  return { width, height, left, right, top, bottom, x, y, paths, xTicks, yTicks };
}
