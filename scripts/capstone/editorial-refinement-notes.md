# Virginia air quality — editorial refinement validation

Date: 2026-10-30. Scope: presentation of the existing capstone only. No research content, data, results, handlers, route definitions, shared styling, homepage, or deployment changes. No dependencies, commits or pushes.

## Files modified

Existing components:

- `src/components/VirginiaAirQualityCaseStudy.tsx`: decorative hero airflow contours, route annotation, decorative chapter marks, article ref / progress component, scoped stylesheet, shared reveal hook.
- `src/components/RawDataResearch.tsx`: decorative chapter mark and shared reveal hook only.
- `src/components/capstone/RespiratoryVisitsChart.tsx`: decorative chapter mark and shared section reveal only. Fetch, validation, filtering, memoization, geometry, tooltip, table, and key handlers unchanged.
- `src/components/capstone/SeasonalCoefficientChart.tsx`: decorative chapter mark and shared section reveal only. Coefficients, scale, selectors, calculations, value placement, detail text and keyboard handlers unchanged.
- `src/components/capstone/StatisticalModelExplorer.tsx`: decorative chapter mark and shared section reveal. Existing panel transition / reduced-motion behavior, tab keyboard handler and all metrics unchanged.
- `src/components/capstone/ResearchConclusions.tsx`: decorative marks for chapters 07–09 and shared reveal hook. Findings, limitations, conclusion and reflection copy unchanged.
- `src/components/capstone/ResearchResources.tsx`: decorative chapter mark and shared reveal hook. Report, public-source links and team credits unchanged; no code-sharing entry restored.

Added:

- `src/components/capstone/CaseStudyEditorial.css`: all rules scoped to `.uva-case-study`; loaded after existing scoped styles and CapstoneQa.css.
- `src/components/capstone/ReadingProgress.tsx`: article-scoped passive scroll / resize listeners, coalesced RAF updates, article ResizeObserver, cleanup on unmount; no React state updates on scrolling. Decorative fixed 3px line; no animated chart marks.
- `src/components/capstone/readingProgressMath.ts`: pure clamped reading-position calculation, including short and expanding articles.
- `src/components/capstone/useResearchReveal.ts`: reuses existing Framer Motion; once-only 10px entrances and visible zero-duration fallback when reduced motion is requested or IntersectionObserver is unavailable. An explicit animate target also restores visibility if motion preferences change after mount.
- `scripts/capstone/verify-editorial.mjs`: progress/fallback tests and preservation audit against HEAD. The preservation portion is intended for reviewing this visual-only diff; legitimate subsequent research changes require a new reviewed baseline.
- `scripts/capstone/editorial-refinement-notes.md`: this record.

## Visual direction

Hero: low-opacity flowing SVG lines, concentrated toward the open right-hand area with a faded left edge; static, abstract and aria-hidden. The original cloud illustration and conceptual-not-data caption are retained. Editorial serif title and monospaced research label connect to the existing warm identity.

Chapters: original numbers 01–10 appear as separate aria-hidden marks with reserved space, never duplicate semantic headings. Sidebar headings use an above-heading mark; full-width chapters use a right margin. Thin amber rules, serif hierarchy and controlled chapter spacing establish rhythm.

Figures: paper-like border/shadow treatment around the existing SVG chart frames and AIC figure; polished native dropdowns, month controls, model tabs, pipeline stages and interpretation groups. No stroke encodings, axes, values, plotted coordinates, chart timing or behavior changed. Frame overflow remains visible for tooltips / focus; wide tables retain local scrolling.

Findings / closure: more scannable serif findings headings and restrained alternating margin accents; a lightly tinted conclusion with unchanged text; resources keep their existing semantic links and grouping.

Deliberately omitted: Virginia silhouette (no verified appropriate geographic asset), extra Beer Buddy (keep research focus), new factual annotations/figure statistics, parallax, continuous effects, chart animation, new animation libraries.

## Validation results

Commands passed:

```sh
node node_modules/typescript/bin/tsc -b --pretty false
npm run build
node scripts/capstone/verify-editorial.mjs
node scripts/capstone/verify-respiratory.mjs --input "C:\Users\kayen\Downloads\sana_full_data.csv"
node scripts/capstone/verify-seasonal.mjs
node scripts/capstone/verify-model-comparison.mjs
git diff --check
```

Preservation audit: original research JSX text (excluding new decorative marks) and JSX event handlers match HEAD exactly. Content modules, static datasets / PDF, chart helper calculations, previous CapstoneQa.css, routes / page components, metadata cleanup, global styles and other pages have no diff. Data verification retains 3,658 actual records, 105 suppressed counts and 473 absent district-weeks as gaps; actual-source reimport matches. All seasonal sums and six model metrics remain verified by the existing scripts.

No lint script is configured; no lint dependency added. The Vite production build still splits the capstone route; its JS chunk is approximately 73.8 kB / 22.2 kB gzip. No runtime dependency added and initial JS remains approximately 427.5 kB / 137.1 kB gzip.

## Browser and responsive review

Actual screenshot review completed at 375px mobile, 768px tablet, 1366px laptop and 1920px desktop. All four reported the requested innerWidth; no horizontal document overflow. After increasing the numeral's reserved space, no heading/number rectangles overlap at any tested width. Mobile figure / tooltip and conclusion screenshots, plus laptop figure and tablet / desktop hero screenshots, were inspected. No fixed-height research panels or chart-data animation were introduced; entrances use transforms without changing layout.

Representative browser checks passed:

- Pipeline geographic-alignment button updates the original explanation.
- Crater selection yields 31 reported weeks and 212 absent weeks; keyboard Home reports Jan 4 2020 as unavailable, not zero.
- Expanded Crater table retains all 243 weekly rows.
- July interaction selection updates the detail heading to -0.06989.
- Tab Home / Arrow navigation works, with a visible solid focus outline under keyboard use.
- Poisson AIC bar updates the live readout to 372,927.14.
- Mobile pointer tooltip shows Oct 23 2021, 75 visits in the inspected Alleghany series; tooltip is inside the frame and parent overflow is visible.
- Resource links preserve targets and noopener/noreferrer; report action still points to the actual static PDF. Reproducibility notes expand through keyboard input.
- Reading progress starts at 0, changes while scrolling (observed ~0.56 mid-article), reaches 1 at the end, and accounts for expandable content via ResizeObserver. It is absent after navigating Home. Listeners/observer/RAF are cleaned up on unmount.
- One primary H1; all 10 chapter marks and hero contours are aria-hidden. Existing chart labels, data tables, focus states, semantic reading order and note disclosures remain.

Reduced-motion and unavailable-IntersectionObserver branches were tested programmatically: initial=false, explicit visible animate target, duration=0, and no whileInView observer configuration. Native OS preference toggling, a screen-reader session and a full WCAG audit were not performed. The application remains the existing client-rendered SPA; full non-JavaScript rendering would require a separate prerendering/routing decision, outside this visual pass. No new CSS-dependent content hiding was added.

## Preview and captures

Preview server: `http://127.0.0.1:5173/#/projects/virginia-air-quality`.
The stopped preview server was restarted outside the sandbox for browser access. Viewport override was reset after the review.

Screenshots saved under the task visualization directory:

- `capstone-editorial-desktop.png` — 1920px hero.
- `capstone-editorial-tablet.png` — 768px hero.
- `capstone-editorial-mobile.png` — 375px hero.
- `capstone-editorial-figure.png` — 1366px seasonal figure.

No remaining visual overlap or overflow identified in the inspected views. Existing scientific verification limitations and hash-routing / client-rendered SEO limitations remain as documented in the prior QA report; this presentation pass does not alter them.
