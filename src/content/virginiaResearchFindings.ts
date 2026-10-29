export const researchFindings = {
  introduction: 'Our analysis revealed a complex relationship between particulate matter and respiratory emergency department visits. Seasonal patterns were pronounced, and the estimated association with PM2.5 varied throughout the year. However, pollution alone was not a strong predictor of respiratory visits.',
  findings: [
    { title: 'Respiratory visits followed strong seasonal patterns', text: 'Emergency department visits associated with COVID-19, influenza, and RSV were generally higher during winter and lower during spring and summer. This visit pattern did not consistently mirror pollution concentrations.', visual: 'seasons', source: 'Technical Report, exploratory seasonal and monthly visit-pattern discussion.' },
    { title: 'PM2.5 associations varied by month', text: 'The Negative Binomial model included PM2.5 × month interactions. September and October had stronger positive estimated PM2.5 slopes than January, while July had a lower estimated slope. These coefficient differences alone do not establish statistical significance.', visual: 'coefficients', source: 'Technical Report, Results; the verified coefficient analysis in Section 05.' },
    { title: 'Pollution alone was a weak predictor', text: 'The exploratory correlation analysis found near-zero overall correlations between particulate matter and respiratory visit counts. A weak overall correlation does not rule out relationships that vary by season, location, or other conditions. Overall correlation alone is not a measure of predictive performance.', visual: 'correlation', source: 'Technical Report, exploratory correlation matrix discussion.' },
    { title: 'Socioeconomic context mattered', text: 'Employment and other socioeconomic indicators were associated with variation in respiratory emergency visits. These aggregate associations do not establish causation or show that socioeconomic factors independently explain an individual’s health outcomes.', visual: 'context', source: 'Technical Report, correlation matrix discussion and Results.' },
  ],
  summary: [
    { title: 'Seasonality', text: 'Strong seasonal patterns characterized respiratory visit counts.' },
    { title: 'Context', text: 'Geographic and socioeconomic differences complicated the pollution–health relationship.' },
    { title: 'Statistical Modeling', text: 'Count models with seasonal interaction terms provided a more appropriate framework for investigating these associations.' },
  ],
  limitations: [
    { title: 'Incomplete pollution monitoring', text: 'Station-based EPA measurements do not establish exposure at every Virginia location. Uneven geographic monitoring coverage was not quantified in the available report. PM10 measurements were missing for the final four months of the analyzed year.' },
    { title: 'Temporal resolution', text: 'Respiratory visits were available weekly, limiting the ability to identify precise day-level lagged relationships between pollution exposure and health outcomes.' },
    { title: 'Geographic aggregation', text: 'Health district-level analysis may obscure important differences between individual communities and does not establish individual-level exposure.' },
    { title: 'Confounding factors', text: 'Respiratory infections, population differences, healthcare access, weather, and other unmeasured factors could influence observed associations. These are potential sources of confounding, not a claim that all were explicitly measured or adjusted for.' },
    { title: 'Observational design', text: 'The study identified statistical associations, not causal effects of air pollution on emergency visits.' },
  ],
  conclusion: [
    'Our findings suggest that the relationship between particulate matter and respiratory emergency department visits in Virginia depends on more than pollution concentrations alone. Seasonal patterns, geographic differences, and socioeconomic conditions all contribute to the complexity of the observed relationships.',
    'By integrating multiple public datasets and comparing statistical models, we developed a more nuanced understanding of how environmental and public health data can be analyzed together.',
    'The project reinforced the importance of choosing models that reflect the structure of the data, carefully interpreting interactions, and acknowledging the limitations of observational research.',
  ],
  reflection: [
    'Working on this team project helped me develop a more deliberate approach to data science. Integrating messy public datasets at different temporal and geographic resolutions made the preparation work part of the research itself: before asking what a model could tell us, we had to understand what our combined data could represent.',
    'The team’s comparison of models reinforced the importance of checking assumptions rather than choosing a model solely by a performance metric. Interpreting seasonal interactions also strengthened my ability to explain how an association can change with context, while keeping statistical associations separate from causal claims.',
    'Presenting the group’s research on this website is a separate communication exercise. It is helping me practice making complex methods accessible without hiding uncertainty or overstating the findings. These reflections describe skills developed through collaboration, not a claim that I individually completed every research component.',
  ],
};


