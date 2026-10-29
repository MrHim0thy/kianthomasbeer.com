# Step 9 — capstone quality assurance

Audit date: 2026-10-29. Scope: `/projects/virginia-air-quality`; no redesign or research sections added. No commits, pushes, deployments, dependencies, source-data edits, or verified-result changes.

## Files changed

- `src/components/VirginiaAirQualityCaseStudy.tsx`: installs capstone-only metadata and refinement CSS.
- `src/components/capstone/CapstoneQa.css`: new scoped refinements for touch targets, focus, tablet pipeline / tabs, chart-mark contrast, caption and section rhythm, contained tables, and AIC tick alignment.
- `src/components/capstone/SeasonalCoefficientChart.tsx`: narrow charts use a dedicated numeric column to keep negative values away from month labels. Detail heading now reflects the selected total-slope or interaction mode, including January's reference zero.
- `src/components/capstone/RespiratoryVisitsChart.tsx`: memoizes observation marks and coverage statistics so pointer updates do not rebuild static marks or rescan counts.
- `src/components/capstone/respiratoryData.ts`: reuses UTC date formatters rather than constructing Intl formatters on every render / table cell.
- `src/pages/ProjectDetail.tsx`: lazy-loads only the capstone branch, with an accessible loading status; other project rendering is unchanged.
- `src/components/capstone/useCapstoneMetadata.ts`: unique title / description, canonical and Open Graph text; restores original head entries when leaving. No social image invented.
- `scripts/capstone/verify-respiratory.mjs`: extends existing tests for all-missing input, absent-vs-missing statuses, no generated paths, UTC date formatting, and rejection of unlabeled null counts. Fixtures are test-only and never exported.
- `scripts/capstone/qa-report.md`: this audit record.

## Responsive and visual inspection limits

Attempted the four requested browser viewport overrides. The browser service did not honor CSS viewport sizes reliably:

| Requested width | Reported innerWidth | Reported document clientWidth |
| ---: | ---: | ---: |
| 375 | 1500 | 1440 |
| 768 | 3072 | 3011 |
| 1366 | 5465 | 5404 |
| 1920 | 7680 | 7619 |

Screenshot capture returned `Unable to capture screenshot`. These are **not** valid breakpoint inspections. Browser-based visual QA at 375, 768, 1366, and 1920 remains outstanding. Temporary overrides were reset. DOM geometry showed no document overflow in the available environment, but this does not establish visual correctness at the requested widths. CSS was inspected for min-content constraints, bounded controls, local table scrolling, chart viewBoxes and labels. No overflow was hidden globally to conceal content.

Targeted refinements: 44px month labels and resource / disclosure targets; 16px mobile selects; two-column pipeline and model tabs at tablet widths; compact fixed coefficient-value column; visible focus rings; standardized closing-section spacing / source captions. Full device / touch / pinch-zoom testing is outstanding.

## Scientific source verification

Reviewed the local working capstone document's final Technical Report portion (`Capstone Group Doc(1).docx`) and original `sana_full_data.csv`; raw files were not copied into public assets.

- Report cover: 27 April 2026, UVA STAT 4996, team names, Dr. Woo. Displayed April 2026 agrees; the report cover uses Dr. Woo rather than spelling out Jeffrey (the full name was supplied by the user).
- Methods: adjusted R² 0.6245 (original response) and 0.6976 (log(y + 1)); different response scales remain distinguished.
- Methods: Poisson AIC 372,927.14; Negative Binomial AIC 61,538.84. Fit compatibility remains unverified and explicitly labeled as reported. Earlier draft PM10 code does not verify final PM2.5 model rows, likelihoods, or preprocessing.
- Five-fold CV: Poisson slightly lower average MSE, NB lower fold MSE SD (890.84 vs Poisson 923.35). No numeric average MSE, confidence interval, significance claim or universal predictive superiority inferred.
- Results: January described as baseline, PM2.5 coefficient +0.02072. July interaction -0.06989, September +0.06823, October +0.07225. Derived total slopes: July -0.04917, September +0.08895, October +0.09297. The report narrative supports January's reference role; final model object / factor contrast coding is still unavailable for independent verification.
- No uncertainty intervals or p-values available for the combined slopes. Report narrative uses significance language, but the website deliberately does not repeat it as verified inference.
- ED-only source export: 3,658 unique district-weeks, 17 districts, 243 weekly dates Jan 4 2020–Aug 24 2024; 105 suppressed counts and 473 absent district-weeks. Actual zeros are retained. No percentage variables or urgent-care rows summed; no duplicate weekly district keys. The time-series window is distinct from the 2024 EPA analysis window (already documented in the import README).
- All Districts remains disabled. These data do not establish statewide coverage.
- Potential confounders, uneven monitoring coverage (not quantified), and aggregate-vs-individual interpretation remain limitations rather than measured causal findings. Correlation is not treated as predictive accuracy. All diagram / synthesis illustrations remain labeled conceptual.

## Functional browser checks

Passed in local development preview:

- All 17 district dropdown selections: correct named chart and coverage readout, no errors switching.
- Alleghany Home key: Jan 4 2020, 18 visits; Crater Home: no observation in source. Left/Right and Home/End code paths preserve weekly gaps. Source verification checks all district series / line breaks.
- Pointer click on SVG produced an exact-count tooltip and corresponding readout (Feb 26 2022, 38 visits in the inspected Alleghany series). Continuous hover / native touch gestures were not independently exercised.
- Crater expanded table contains all 243 weekly rows; changing district resets chart inspection / table state.
- Seasonal interaction selection for July displayed -0.06989 in the detail heading and the total-slope arithmetic -0.04917 beneath it.
- Deselecting all months shows the empty-state instruction; selecting January restores its reference interaction 0.00000 with explicit convention labeling.
- Model tabs (Home / End), AIC Poisson bar and live readout, pipeline geographic-alignment explanation, Under the Hood, Data & Reproducibility Notes all respond.
- Runtime H1 count one; no skipped heading levels across h1–h4. Table headers/captions, labels, roving tabIndex, tablist/tabpanel relationships, native details semantics and value text inspected. Full assistive-technology audit is not claimed.
- All four source links have accessible names, target=_blank, rel=noopener noreferrer; no report/code placeholder anchors. Official pages opened via web verification; HDPulse / dashboard downloads require their own JS interfaces and were not exercised end to end.

## Accessibility / motion

Measured palette ratios against #faf7ef: navy 15.39:1, muted text 5.87:1, accent 5.37:1. Amber and sage fills alone were 2.02:1 and 2.43:1; preserved their colors but added accent / darker-sage data-mark boundaries (5.37:1 and 3.56:1). Labels and signs also convey values, and tables provide a non-color alternative. Decorative dividers are not data encoding.

Scoped motion remains guarded by useReducedMotion and transitions limited to no-preference queries. OS reduced-motion / screen-reader testing and a full computed-style contrast audit remain outstanding; no blanket WCAG conformance claim.

## SEO / sharing

Runtime title: Air Pollution & Respiratory ER Visits — Kian Thomasbeer. Unique description; OG title/description/type/url/site name; one H1. Canonical uses the actual hash route `https://kianthomasbeer.com/#/projects/virginia-air-quality` rather than advertising an unsupported clean path. Navigating to Projects removes capstone canonical/OG and restores its original title / description (browser verified).

**Publishing limitation:** metadata is client-rendered, and fragment routes are not independent server documents. Crawlers/social bots that do not execute JS or do not distinguish hash routes will not reliably index/share this as a standalone page. Reliable standalone SEO / sharing requires a separately served route / prerendering and hosting support; this audit does not change routing or deployment. No social preview image supplied or invented.

## Performance

Before: main JS ~487.44 kB (153.44 kB gzip). After capstone route split: initial JS ~418.76 kB (134.30 kB gzip), capstone chunk ~71.85 kB (21.48 kB gzip). Initial reduction ~68.68 kB / 14%; loading the capstone still downloads its route chunk. Capstone CSS also split out. Final hashes / exact sizes vary slightly with refinements.

Dataset remains a small static fetch outside the JS bundle, validated once on load. District transforms and geometry were already memoized. Added memoization covers unchanged chart marks and coverage summaries; UTC formatters are reused. Tables render rows only when expanded. No dependency or global application architecture added.

## Commands / results

- `node scripts/capstone/verify-respiratory.mjs --input "C:\Users\kayen\Downloads\sana_full_data.csv"`: PASS including byte-equivalent actual source reimport, duplicate / percentage rejection, suppression / gap / zero invariants, empty / all-missing helper cases.
- `node scripts/capstone/verify-seasonal.mjs`: PASS, exact coefficient sums / reference convention / plot geometry.
- `node scripts/capstone/verify-model-comparison.mjs`: PASS, six reported metrics / five-fold summary / AIC disclosure.
- `node node_modules/typescript/bin/tsc -b --pretty false`: PASS.
- `npm run build`: PASS (type check and Vite production output).
- `git diff --check`: PASS (Git may print Windows line-ending notices).
- package.json has no lint or general test script. Existing capstone verification scripts were run directly. No lint tooling installed merely for this audit.
- Fetch loading / failure / missing-file branches reviewed in source, not forced through browser network mocks. Empty/all-missing helper cases tested; the visual empty-district branch was not induced with fabricated published data.

## Attention needed

1. Real browser/device visual review at 375 / 768 / 1366 / 1920px, reduced-motion and assistive-technology review.
2. Reviewed final report PDF and verified original analysis repository URL to enable those resources.
3. Final fitted model / complete output and CV split protocol to verify factor coding, AIC compatibility and inferential claims independently.
4. Separate routing / prerendering decision if reliable standalone indexing and social previews are required.

Preview: `npm run dev`, then `http://127.0.0.1:5173/#/projects/virginia-air-quality`.
