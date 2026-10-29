# Step 6 — statistical model comparison

## Provenance

All displayed metrics were checked against the local University of Virginia Statistics Capstone Technical Report (April 2026), Methods and Results narrative:

| Model / criterion | Reported value |
| --- | ---: |
| Multiple linear regression adjusted R² | 0.6245 |
| log(y + 1) linear regression adjusted R² | 0.6976 |
| Poisson AIC | 372,927.14 |
| Negative Binomial AIC | 61,538.84 |
| Poisson fold MSE standard deviation | 923.35 |
| Negative Binomial fold MSE standard deviation | 890.84 |

The report describes five-fold cross-validation and qualitatively states that Poisson had slightly lower average MSE. No numeric average MSE is inferred. Fold MSE standard deviations are not standard errors or confidence intervals.

## Verification limits

The available source document includes earlier draft code using PM10. That code cannot establish the final PM2.5 fits associated with these reported metrics. Verified final model objects, row identifiers / nobs, preprocessing, likelihood specifications, fold assignments, and reproducible final cross-validation outputs were not available. Consequently the AIC visualization is explicitly labeled **as reported in the Technical Report**, with compatibility unverified. It is not an independently validated like-for-like comparison. To verify it, supply the final model-fitting code and exact input rows or saved final model objects, including the likelihood specifications and validation fold protocol.

Adjusted R² on the original and transformed response scales is kept separate. AIC is never treated as predictive accuracy, a percentage improvement, or interchangeable with adjusted R². Negative Binomial is the report's final selection, but Poisson's lower reported average MSE is retained.

The overdispersion graphic contains conceptual conditional mean-variance formulas, including the common NB2 parameterization, not fitted dispersion estimates, fabricated residuals, or simulated measurements. No causal or significance inference is made.

## Implementation and checks

Page-only component: `src/components/capstone/StatisticalModelExplorer.tsx` and its scoped stylesheet.
Content and metrics: `src/content/virginiaModelComparison.ts`.
Integration: one import and one render immediately after `SeasonalCoefficientChart` in `VirginiaAirQualityCaseStudy.tsx`.
No new dependencies, source dataset changes, or earlier-section changes.

Run:

```sh
node scripts/capstone/verify-model-comparison.mjs
node scripts/capstone/verify-seasonal.mjs
node scripts/capstone/verify-respiratory.mjs
npm run build
npm run dev -- --host 127.0.0.1
```

Preview: `http://127.0.0.1:5173/#/projects/virginia-air-quality`.

Verify all four tabs by pointer and Left/Right/Home/End keys; the reported AIC bar buttons update the selected model and live readout. Expand Under the Hood with keyboard or pointer. Check desktop and narrow widths for readable labels and no horizontal overflow. Animation is disabled for reduced-motion users.
