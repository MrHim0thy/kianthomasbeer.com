export interface ModelStage {
  id: string;
  name: string;
  shortName: string;
  metricLabel: string;
  metricValue: string;
  metricContext: string;
  contribution: string;
  diagnostic: string;
  explanation: string;
  final: boolean;
  aic?: number;
}
export const modelingContent = {
  title: 'Finding the Right Model for Respiratory ER Visits',
  introduction: 'Predicting emergency department visits requires more than finding correlations. Our outcome variable consisted of nonnegative visit counts with substantial variability, so choosing a model that respected the structure of the data was essential. We evaluated several approaches, examined their assumptions, and ultimately selected Negative Binomial regression.',
  source: 'University of Virginia Statistics Capstone Technical Report, April 2026, Methods and Results sections.',
  aicExplanation: 'AIC evaluates relative model fit while penalizing model complexity. Lower values are preferred when models are fitted to the same response observations under comparable likelihoods.',
  aicLimitation: 'Reported comparison — fit compatibility not independently verified. The available final-model materials do not establish identical response rows and comparable likelihoods for these exact AIC values. This is the Technical Report’s comparison, not a recomputed comparison.',
  crossValidation: { folds: 5, poissonFoldMseSd: 923.35, negativeBinomialFoldMseSd: 890.84 },
  technicalDetails: [
    { title: 'Why are ER visits count data?', text: 'Observed visit counts are whole numbers at or above zero. Count models respect this outcome structure. Their predicted conditional mean can still be fractional; an expected count is not a literal number of individual patients.' },
    { title: 'Why does heteroskedasticity matter?', text: 'Heteroskedasticity means the conditional error variance changes with the predictors or fitted values. The increasing spread in the reported linear-model residual plots did not support a constant-variance assumption. This matters for the usual uncertainty calculations; it does not by itself establish biased coefficient estimates.' },
    { title: 'What is overdispersion?', text: 'For a Poisson model, the conditional variance equals the conditional mean. Overdispersion occurs when variability exceeds what that assumption can accommodate after accounting for the modeled predictors. A wide spread in raw counts alone is not enough to establish it.' },
    { title: 'How does Negative Binomial differ from Poisson?', text: 'Negative Binomial regression introduces a dispersion parameter so the conditional variance can exceed the mean. In the common NB2 parameterization, Var(Y | X) = μ + μ²/θ, where μ is the conditional mean and θ > 0. This formula is a conceptual explanation; no fitted dispersion value is supplied here.' },
    { title: 'Why include PM2.5 × month?', text: 'The interaction lets the PM2.5 slope vary by month rather than imposing a single year-round association. In the coefficient comparison above, a month-specific slope combines the January baseline and the month’s interaction term. This remains an observational association, not a causal effect.' },
    { title: 'Why use both AIC and cross-validation?', text: 'AIC assesses penalized in-sample fit for comparable likelihood-based models. Cross-validation evaluates performance on held-out observations under a specified split and fitting protocol. Average fold MSE describes the reported error level; its standard deviation describes variability across those folds. The two evaluation approaches answer different questions and need not rank models identically.' },
  ],
};
export const modelStages: ModelStage[] = [
  {
    id: 'linear', name: 'Multiple Linear Regression', shortName: 'Multiple Linear',
    metricLabel: 'Adjusted R²', metricValue: '0.6245', metricContext: 'Reported on the original response scale.',
    contribution: 'Established an initial multivariable baseline and provided residual diagnostics to guide the next modeling step.',
    diagnostic: 'Residual plots showed increasing variance at higher fitted values (heteroskedasticity).',
    explanation: 'Standard linear regression assumes constant conditional error variance, which was not supported by the reported residual diagnostics.',
    final: false,
  },
  {
    id: 'log-linear', name: 'Log-Transformed Linear Regression', shortName: 'Log-Transformed Linear',
    metricLabel: 'Adjusted R²', metricValue: '0.6976', metricContext: 'Reported for the transformed response log(y + 1).',
    contribution: 'The log(y + 1) response transformation produced more stable residual variance, informing the treatment of the outcome’s variability.',
    diagnostic: 'Some residual patterns remained, and the transformed model was less directly interpretable for visit counts.',
    explanation: 'The transformed-response adjusted R² is not on the same response scale as the original linear model. It should not be treated as a like-for-like measure of count prediction accuracy.',
    final: false,
  },
  {
    id: 'poisson', name: 'Poisson Regression', shortName: 'Poisson',
    metricLabel: 'AIC · as reported', metricValue: '372,927.14', metricContext: 'Count-model fit; compatibility of the reported AIC comparison is unverified.',
    contribution: 'Modeled the outcome as nonnegative counts and included PM2.5 × month interaction terms to represent seasonal variation.',
    diagnostic: 'Severe overdispersion: the observed conditional variability exceeded what the Poisson mean-variance assumption could accommodate.',
    explanation: 'The Poisson framework respects the count outcome, but assumes that conditional variance equals the conditional mean. The reported diagnostics motivated a more flexible variance model.',
    final: false, aic: 372927.14,
  },
  {
    id: 'negative-binomial', name: 'Negative Binomial Regression', shortName: 'Negative Binomial',
    metricLabel: 'AIC · as reported', metricValue: '61,538.84', metricContext: 'Lower reported AIC; interpretation requires compatible model fits.',
    contribution: 'The final selected model accommodated overdispersion by allowing the conditional variance to exceed the mean.',
    diagnostic: 'Provided a more flexible count-data variance structure and a lower AIC in the reported comparison.',
    explanation: 'Negative Binomial was selected in the report. Its lower fold MSE variability did not translate into a lower average MSE than Poisson; model fit and prediction consistency are distinct considerations.',
    final: true, aic: 61538.84,
  },
];
export const reportedAicModels = modelStages.filter((model): model is ModelStage & { aic: number } => model.aic !== undefined);
export const aicAxisMaximum = 400000;
export const formatModelMetric = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
