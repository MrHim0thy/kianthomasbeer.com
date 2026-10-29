# Seasonal PM2.5 coefficient comparison

## Source verification and scope

The source is the UVA Statistics Capstone Technical Report, April 2026, Results section. The local document `Capstone Group Doc(1).docx` contains the Technical Report; its Results narrative reports January `2.072e-02`, September interaction `6.823e-02`, October interaction `7.225e-02`, and July interaction `-6.989e-02`. These match the values supplied for this website step.

No verified complete final PM2.5 model object, full coefficient/covariance output, or prediction specification was found in the repository. The local capstone document also includes older R code using **PM10**. That code is not treated as the final PM2.5 model and is not refitted to manufacture predictions. The poster Rmd references static plots rather than providing a full fitted model. A local R workspace without verified provenance does not establish a usable final model specification.

Only the four documented months are visualized. The chart does not use raw visit observations or the respiratory chart's counts to infer regression coefficients. It does not estimate undocumented months or convert month-level terms into season-wide averages.

## Exact arithmetic

The canonical source is `src/content/virginiaSeasonalModel.ts`. Values are stored as integer units of 0.00001 so the derived sums retain five-decimal accuracy:

| Month | January baseline | Interaction relative to January | Total monthly PM2.5 slope |
| --- | --- | --- | --- |
| January | 0.02072 | Reference, no added term | 0.02072 |
| July | 0.02072 | -0.06989 | -0.04917 |
| September | 0.02072 | 0.06823 | 0.08895 |
| October | 0.02072 | 0.07225 | 0.09297 |

January's interaction-view zero is a **reference convention**, not a separately estimated zero coefficient. Bars default to total monthly slopes; the selector can instead show interaction terms. Both views keep the axis fixed at -0.10 to +0.10, including when months are deselected. Positive/negative values are encoded by position and numeric labels as well as color.

## Interpretation and limitations

A month-specific slope is the January PM2.5 baseline plus that month's PM2.5 interaction term. The interaction is not the month's count intercept. For a log-link Negative Binomial model, this sum is a slope on the log expected-count scale, conditional on the model's other terms. The page explains this **conditionally** because the complete final model specification and predictor scaling have not been verified from a fitted model object. It does not assert a per-microgram interpretation, calculate rate ratios/percent changes, or create absolute count predictions.

The narrative does not supply standard errors, confidence intervals, or the covariance needed to calculate uncertainty for combined slopes. No uncertainty bars, p-values, or significance claims are created from coefficient magnitudes or unsupported narrative language. To add those, provide the verified final model summary and variance-covariance matrix (or a complete fitted model with factor levels/contrasts, preprocessing, predictor units, and covariate definitions). Absolute prediction curves additionally need an agreed covariate scenario and complete model coefficients including the intercept.

All associations are observational and are explicitly not evidence that pollution caused visits.

## Existing respiratory chart

Only presentation geometry and font sizing change. At desktop widths, the plot area grows from 236px to 307px (about 30%); the responsive mobile plot remains approximately its previous height. Tick/axis labels are now 12px, and tooltip text is 12–14px. The exported JSON, district series, date/count handling, integer tick values, line-gap logic, keyboard controls, data table, and statewide-coverage warning are preserved.

## Verify

```sh
node scripts/capstone/verify-respiratory.mjs
node scripts/capstone/verify-seasonal.mjs
npm run build
npm run dev
```

Open `http://127.0.0.1:5173/#/projects/virginia-air-quality` and scroll to **05 / Seasonal Interactions**. Toggle month checkboxes, switch coefficient view, and hover/tap a bar. Tab to each bar or checkbox and use Enter/Space; the details panel and native tooltips expose the actual coefficient arithmetic. Clear all months to check the explicit empty state. The coefficient table supplies the same information without relying on the graphic. Test narrow mobile widths and the OS reduced-motion preference. No chart dependencies are added.
