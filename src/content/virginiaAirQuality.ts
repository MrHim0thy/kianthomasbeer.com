export const virginiaAirQuality = {
  eyebrow: 'UNIVERSITY OF VIRGINIA · STAT 4996 · 2026',
  title: 'Air Pollution & Respiratory Emergency Visits in Virginia',
  subtitle: 'Investigating how particulate matter, seasonal patterns, and socioeconomic conditions relate to respiratory emergency department visits across Virginia.',
  tags: ['R', 'Statistical Modeling', 'Environmental Health', 'Geospatial Analysis'],
  metadata: [
    { label: 'Institution', value: 'University of Virginia' },
    { label: 'Date', value: 'April 2026', dateTime: '2026-04' },
    { label: 'Team', value: 'Kian Thomasbeer, Sana Rehan, Ariyah Walker' },
    { label: 'Faculty advisor', value: 'Dr. Jeffrey Woo' },
  ],
  question: 'How do fluctuations in PM10 and PM2.5 predict respiratory-related emergency department visits across Virginia, and how do seasonal trends and socioeconomic factors moderate this relationship?',
  explanation: [
    'Air pollution is a major environmental health concern, but its relationship with respiratory emergencies is not straightforward. Seasonal illness, geographic differences, and socioeconomic conditions can all influence the number of patients seeking emergency care.',
    'For our UVA statistics capstone, we investigated these relationships by combining environmental monitoring data, public health records, and socioeconomic indicators. Our goal was to understand whether changes in particulate matter could help explain respiratory emergency department visits, and whether these associations varied throughout the year.',
  ],
  glance: [
    { title: 'Air Quality', description: 'EPA daily PM2.5 and PM10 measurements from Virginia monitoring stations.' },
    { title: 'Respiratory Health', description: 'Virginia Department of Health weekly emergency department visit counts associated with COVID-19, influenza, and RSV.' },
    { title: 'Socioeconomic Context', description: 'Median household income, employment, and wage information from HDPulse and the Bureau of Labor Statistics.' },
    { title: 'Statistical Analysis', description: 'Geographic data integration, exploratory analysis, regression modeling, seasonal interactions, and model evaluation.' },
  ],
  dataPreparation: {
    sources: [
      { title: 'EPA — Air Quality', description: 'Daily PM2.5 and PM10 measurements collected at monitoring stations across Virginia. Our analysis used 2024 EPA daily pollution data.' },
      { title: 'Virginia Department of Health — Respiratory Visits', description: 'Weekly emergency department visit counts associated with COVID-19, influenza, and RSV, reported by Virginia health district.' },
      { title: 'HDPulse — Socioeconomic Indicators', description: 'Median household income and county-level income rankings from the National Cancer Institute.' },
      { title: 'Bureau of Labor Statistics — Employment', description: 'Employment and average weekly wage measurements used to provide additional socioeconomic context.' },
    ],
    stages: [
      { title: 'EPA Daily Measurements', label: 'Daily observations', explanation: 'Daily PM2.5 and PM10 measurements collected at monitoring stations across Virginia. Our analysis used 2024 EPA daily pollution data.' },
      { title: 'Weekly Aggregation', label: 'A common time scale', explanation: 'Daily PM2.5 and PM10 measurements were aggregated into weekly averages to match the VDH reporting frequency.' },
      { title: 'Geographic Alignment', label: 'A common geography', explanation: 'Pollution monitoring station coordinates and county-level socioeconomic observations were mapped to Virginia Department of Health districts.', inputs: ['VDH health districts', 'HDPulse + BLS observations'] },
      { title: 'Combined Analytical Dataset', label: 'Data Integration', explanation: 'Weekly pollution measurements, respiratory visit counts, and socioeconomic indicators were joined by geographic district and relevant time period.', inputs: ['VDH weekly respiratory visits', 'Socioeconomic indicators'] },
    ],
    notes: [
      { title: 'Different Time Resolutions', description: 'EPA measurements were recorded daily, while VDH respiratory visits were reported weekly. This required aggregation and limited the ability to investigate precise day-level delayed effects.' },
      { title: 'Incomplete PM10 Coverage', description: 'PM10 observations were missing for the final four months of the analyzed year. The team prioritized PM2.5 for subsequent modeling because it provided more complete temporal coverage.' },
    ],
  },
};
