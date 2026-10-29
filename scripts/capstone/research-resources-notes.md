# Research resources publication checklist

The resource section is implemented in `src/components/capstone/ResearchResources.tsx`, with scoped styles and configuration in `src/content/virginiaResearchResources.ts`.

## Outstanding original research materials

- **Final Technical Report PDF:** not found in repository public assets or among the named capstone / technical-report candidates in Downloads. The existing working Word document and proposal PDF are not published as a final report. Provide the reviewed final PDF; copy to `public/reports/uva-statistics-capstone-2026.pdf` and set `technicalReportPath` to `reports/uva-statistics-capstone-2026.pdf`. The static PDF link uses the site's existing root-base deployment and opens in a new tab. Check that it renders and downloads before enabling.
- **Original capstone analysis repository URL:** no verified URL exists in project configuration. The general GitHub profile and website repository are not substitutes. Supply the repository containing the original R analysis; verify its contents and accessibility before setting `capstoneRepositoryUrl`.

Both values default to null. The website renders plain availability text, with no disabled, empty, or placeholder anchors. No report or analysis repository is fabricated.

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
Open `http://127.0.0.1:5173/#/projects/virginia-air-quality`, scroll to 10 / Explore the Research. Tab through the four source links, verify new-tab security attributes, and use Enter / Space on Data & Reproducibility Notes. Verify no report / repository anchor is rendered while its configuration is null.
