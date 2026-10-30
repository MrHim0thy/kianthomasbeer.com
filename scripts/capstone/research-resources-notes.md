# Research resources publication checklist

The resource section is implemented in `src/components/capstone/ResearchResources.tsx`, with scoped styles and configuration in `src/content/virginiaResearchResources.ts`.

## Technical Report

The user-supplied final PDF was added on 2026-10-30 at `public/reports/uva-statistics-capstone-2026.pdf`. It contains 16 pages and is copied byte-for-byte from the supplied file. `technicalReportPath` enables the report action in a new tab. The static asset can also be saved using the browser PDF viewer.

The resources section contains the Technical Report and official data sources. No analysis repository configuration or resource entry is included.

## Official source pages

Verified by opening / searching official pages on 2026-10-29:

- EPA: https://www.epa.gov/outdoor-air-quality-data/download-daily-data
- VDH: https://www.vdh.virginia.gov/epidemiology/respiratory-diseases-in-virginia/data/emergency-visits-for-respiratory-illness/
- HDPulse: https://hdpulse.nimhd.nih.gov/data-portal/_social/income/map?demo=00011&statefips=51
- BLS: https://www.bls.gov/cew/data.htm

These are current official portals, not immutable copies of the historical research extracts. HDPulse currently uses the NIH NIMHD domain. Some source interfaces require JavaScript; definitions and available releases can change. No permission to redistribute original or merged files is asserted.

## Credits and navigation

Team names and advisor reuse the existing capstone metadata. Spring 2026 is supplied by the user. No individual responsibilities or profile links are added. The existing All projects link at the top of the case study is retained; a duplicate bottom link is omitted per the request.

## Preview

`npm run build`, then `npm run dev -- --host 127.0.0.1`.
Open `http://127.0.0.1:5173/#/projects/virginia-air-quality`, scroll to 10 / Explore the Research. Tab through the four source links, verify new-tab security attributes, and use Enter / Space on Data & Reproducibility Notes. Verify the View Report action opens the actual PDF in a new tab and that no code resource entry is displayed.
