// User-supplied final report, copied unchanged into public assets.
export const technicalReportPath: string | null = 'reports/uva-statistics-capstone-2026.pdf';

export const capstonePublicSources = [
  { name: 'EPA', title: 'Daily air quality measurements', url: 'https://www.epa.gov/outdoor-air-quality-data/download-daily-data', description: 'Official monitor-level daily air quality query and download tool.' },
  { name: 'Virginia Department of Health', title: 'Respiratory emergency visits', url: 'https://www.vdh.virginia.gov/epidemiology/respiratory-diseases-in-virginia/data/emergency-visits-for-respiratory-illness/', description: 'Official respiratory-illness emergency visit surveillance page.' },
  { name: 'HDPulse', title: 'Virginia household income', url: 'https://hdpulse.nimhd.nih.gov/data-portal/_social/income/map?demo=00011&statefips=51', description: 'Official county-level median household income portal for Virginia.' },
  { name: 'Bureau of Labor Statistics', title: 'Employment & wages', url: 'https://www.bls.gov/cew/data.htm', description: 'Official Quarterly Census of Employment and Wages data access page.' },
];
export const researchResourceContent = {
  introduction: 'This interactive case study presents the central findings of our research. For a deeper look at the methodology, statistical models, diagnostic analyses, and supporting figures, explore the original technical report and project resources.',
  notes: [
    { title: 'Original research inputs', text: 'The original group analysis combined EPA pollution measurements, VDH respiratory emergency department records, and socioeconomic indicators from HDPulse and the Bureau of Labor Statistics.' },
    { title: 'What powers this website', text: 'The respiratory time-series chart uses processed research data. Its static export retains only the fields needed for the visualization, preserves missing and suppressed counts, and does not provide a complete statewide total. The seasonal and model comparison displays use verified reported coefficients and metrics; they do not rerun the fitted models.' },
    { title: 'Methods and reproducibility', text: 'Data transformations and model assumptions are documented in the Technical Report. Website-specific processing and verification are documented in the capstone scripts. The complete final fitted-model specification and validation outputs have not been independently verified here, so these displays are not a claim of full end-to-end reproducibility.' },
    { title: 'Public sources and processed files', text: 'The official links lead to original public source portals, not the cleaned or merged analytical dataset. Current source releases, definitions, access conditions, and licensing may differ from the files used in the study. A live source link does not establish that the complete analytical datasets are publicly available.' },
    { title: 'Responsible publication', text: 'Any published processed data should exclude restricted or sensitive information and comply with the applicable source terms. Only reviewed materials should be released; no permission to redistribute all source or analytical files is implied.' },
  ],
};
