# Respiratory emergency visits visualization

## Verified source and grain

The current export uses the actual local capstone file `sana_full_data.csv`, not simulated data. The source file is not copied into public assets. Its SHA-256 is recorded in `public/data/capstone/respiratory-visits.json` so an identical source can be verified.

Inspected exact headers:

- Date: `Week.Ending.Date` (ISO `YYYY-MM-DD`)
- District: `Health_District`
- Combined respiratory count: `Combined.Respiratory.Viruses.Count`
- Clinical setting: `Facility.Type`, filtered to exactly `Emergency Department`

This merged file contains both Emergency Department and Urgent Care records, plus rows with missing facility labels. Treating all rows as ED counts would be incorrect. Of 7,932 source rows, 3,658 are ED records. Filtering to ED produces exactly one row per week/district key with no duplicates, so **no aggregation or deduplication is performed**. Pollution station data (`pm_all_Ariyah.csv`) was not used: the station-level merged grain could repeat clinical counts.

Observed coverage: January 4, 2020 through August 24, 2024; 243 weekly dates, 17 health districts. There are 105 suppressed counts (`*`) and 473 absent district-weeks on that date range's weekly grid. There are no additional missing-count tokens among the selected ED rows in this source. The chart displays the available multi-year respiratory series; it is not restricted to the 2024 EPA pollution-analysis window.

**Statewide totals are disabled.** These 17 districts are not a verified complete Virginia roster, and coverage varies by week. Neither a partial sum nor a sum of clinical settings is presented as a statewide total. A complete, reviewed district-level ED source with non-overlapping geographic units is required before enabling an All Districts total. Schema v1 intentionally rejects a flag claiming statewide coverage; implementing it requires a separate coverage review.

## Reproduce the export

From the repository root, with Node.js 22 or later:

```sh
node scripts/capstone/import-respiratory.mjs --input "C:\path\to\sana_full_data.csv" --inspect
```

Read the actual headers and facility values before importing. The verified column mapping is in `scripts/capstone/respiratory-import.config.json`. If a new CSV uses other column names, review its grain and update the mapping; do not assume the expected labels are correct. Prefer the original district-level weekly VDH respiratory ED extract, or the actual capstone merged CSV with the clinical-setting field intact. A station-expanded table or separate virus/subgroup rows must be reviewed before use.

After reviewing the mapping and clinical setting:

```sh
node scripts/capstone/import-respiratory.mjs --input "C:\path\to\sana_full_data.csv"
```

The default output is `public/data/capstone/respiratory-visits.json`. Optional `--config` and `--output` arguments support another explicit mapping or output path. Import failures occur before the existing output is replaced.

## Transformations and safeguards

1. Parse quoted UTF-8 CSV fields and exact headers; reject malformed rows, empty headers, and duplicate headers.
2. Filter `Facility.Type` to `Emergency Department`. Exclude Urgent Care and missing-setting rows; count those exclusions in the audit.
3. Trim district/date/count whitespace. Do not infer district aliases, boundary changes, or reporting revisions.
4. Require valid ISO dates on a consistent seven-day cadence. Require district identifiers.
5. **Reject all duplicate date/district keys**, including identical duplicates. Never silently sum, pick a revision, average counts, or discard duplicated rows.
6. Accept only nonnegative integer counts, configured missing tokens, and documented suppression markers. Reject percentage/rate column names and unexpected count tokens. Numeric zero remains a genuine reported zero.
7. Preserve suppressed values as `count: null, status: "suppressed"`. Preserve missing counts as `count: null, status: "missing"`. Never infer the suppressed value.
8. Export only `date`, `district`, `count`, and (where needed) missing/suppression `status` per record. No percentages, pollution values, income, wages, or other raw fields are exported. Metadata includes source basename/hash, district list, coverage, and an audit.
9. The browser constructs a weekly grid for the selected district. Weeks absent from the source become **display gaps**, not new observed rows or zeros. The SVG line stops at every null/absent observation, including missing weeks between known values. No interpolation or smoothing is applied.

No full local source paths are included in the public JSON. All observations remain aggregate district-level counts.

## Chart implementation and verification

No charting library or dependency was added. `src/components/capstone/RespiratoryVisitsChart.tsx` uses React and SVG for this single series. `respiratoryData.ts` validates the fetched schema and computes weekly gaps, integer axis ticks, and separate line segments. The JSON is fetched once; switching districts does not call external services.

```sh
npm run build
npm run dev
```

Validate all exported records, line gaps, reported zeros, duplicate rejection, and exact reproducibility against the real CSV:

```sh
node scripts/capstone/verify-respiratory.mjs --input "C:\path\to\sana_full_data.csv"
```

Without `--input`, this verification script checks the committed JSON and chart helpers without needing the private source CSV. Its failure tests reuse actual source observations in memory; no simulated chart datasets are created or served.

Open `http://127.0.0.1:5173/#/projects/virginia-air-quality` and scroll below **From Raw Data to Research**. Select a district; hover/tap for the week-ending date and count. Tab to the chart and use Left/Right, Home/End, or Page Up/Down. Expand the weekly data table to inspect exact values and missing-status labels. Compare a table value with the corresponding original ED row; suppression and absent weeks must never show zero.

The source-data URL is `/data/capstone/respiratory-visits.json`, served directly by Vite and copied into the GitHub Pages build. Loading, unavailable/invalid data, empty datasets, and districts without any reported counts have explicit states. No illustrative fallback exists. Scroll reveals honor reduced-motion preferences; chart exploration has no animated line drawing.

The supplied seasonal-pattern paragraph is labeled observational and explicitly states that it does not establish pollution causation. It should not be interpreted as a model result or a statewide-coverage claim.
