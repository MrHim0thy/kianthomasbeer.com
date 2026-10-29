// Values verified in the Technical Report's Results narrative; no model is refitted here.
// Store five-decimal coefficients as integer units to keep the sums exact.
export const januarySlopeUnits = 2072;
export const coefficientScale = 100000;
export const seasonalMonths = [
  { month: 'January', interactionUnits: 0, reference: true },
  { month: 'July', interactionUnits: -6989, reference: false },
  { month: 'September', interactionUnits: 6823, reference: false },
  { month: 'October', interactionUnits: 7225, reference: false },
] as const;
export type SeasonalMonth = typeof seasonalMonths[number];
export const monthSlope = (month: SeasonalMonth) => (januarySlopeUnits + month.interactionUnits) / coefficientScale;
export const monthInteraction = (month: SeasonalMonth) => month.interactionUnits / coefficientScale;
export const coefficientLabel = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(5)}`;
export const seasonalModelContent = {
  title: 'Does Air Pollution Matter More in Certain Seasons?',
  introduction: 'Our analysis found that the association between PM2.5 concentrations and respiratory emergency visits was not constant throughout the year. While winter had higher baseline visit counts, the estimated relationship between PM2.5 and visits was stronger during parts of the fall.',
  source: 'University of Virginia Statistics Capstone Technical Report, April 2026, Results section.',
  insights: [
    { title: 'Fall showed stronger positive associations', text: 'September and October had positive PM2.5 interaction coefficients relative to January.' },
    { title: 'Summer showed a weaker association', text: 'July had a negative interaction coefficient relative to January.' },
    { title: 'Seasonality matters', text: 'The estimated relationship between particulate matter and respiratory visits changed throughout the year, suggesting that a single year-round pollution coefficient would miss important variation.' },
  ],
};
