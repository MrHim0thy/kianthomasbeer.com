# Predicting Customer Loyalty — source provenance

This case study presents collaborative STAT 4630 work by Lexie Boyd, Lauren Dunbar, Kian Thomasbeer, and Stephanie Tiede. Final report: December 9, 2025. No individual responsibilities are inferred.

## Preserved sources

- STAT_4630_Customer_Loyalty.ipynb: byte-for-byte copy of supplied STAT 4630 Project All Code.ipynb.
- Customer_Loyalty_Final_Report.docx: byte-for-byte copy of SML_FinalReport.docx. Download as Word; no fake PDF conversion.
- figures/aggregated-forest-error.png: DOCX word/media/image1.png (537 × 345).
- figures/first-purchase-forest-error.png: word/media/image2.png (651 × 403).
- figures/pruned-customer-tree.png: word/media/image3.png (537 × 345).
- figures/customer-decision-tree.png: word/media/image4.png (1022 × 632).

Figures are extracted from the DOCX ZIP container without reencoding. All four embedded images are included. No saved notebook PNG figures were present. The new thumbnail is conceptual SVG artwork, not a statistical chart.

## Metrics

src/content/customerLoyalty.ts transcribes values; the page plots only these values, not simulated observations. No model was rerun.

- First ridge: notebook zero-based cell 8, AUC .5366630771160923, log loss .642833853485938, baseline log loss .6437088287456223, C .001; saved classification_report accuracy .66 is rounded, shown approximately. Test support 448 + 854 = 1,302.
- Aggregated ridge: cells 5–6, AUC .6525874800958025, log loss .5885052175167126, baseline .6448823115311909; cell 6 accuracy .657, sensitivity .985, specificity .038. Test support 449 + 849 = 1,298. Accuracy displayed approximately as 65.7%.
- Trees: report Decision Trees section; cell 11 contains arithmetic but saved execution stops at missing customer_first_purchase.csv. First accuracy 65.44%, sensitivity 100%, specificity 0%; aggregated 74.16%, 93.19%, 37.48%.
- Forests: report and cell 11 arithmetic. First accuracy 62.61%, sensitivity 66.56%, specificity 39.37%; aggregated 96.39%, 99.11%, 91.86%. Class rates are source claims, not independently verified. Code prints the fitted randomForest object, with no test-set predict() for these rates; appears OOB. Labeled confusion output is missing and rate denominators do not match class totals implied by decision-tree counts. Not a comparable held-out leaderboard.
- FFNN: report only, test AUC .82, accuracy .73, repeat recall .78, non-repeat recall .64, validation AUC near .81, early stop epoch 24. Cell 13 supplies architecture/code without saved output. No first-purchase FFNN is supplied. best_state = model.state_dict() does not deepcopy weights; best-epoch recovery needs verification.

## Timing and reproducibility limits

Target: n_distinct(Invoice) > 1 among positive-quantity purchases. Negative quantities inform any_return; Quantity >= 500 is excluded, not all negative observations. First-purchase construction is not included in the notebook: that CSV is uploaded separately. Cleaning cell also mixes Python upload syntax into an R magic cell.

Report describes matched ridge samples with augmented features. Actual code uses differing samples and different feature sets. Internal ridge CV sees preprocessing fitted on the whole outer training sample, not within each tuning fold. The outer test set stays separate.

All-history features and outcome share an observation window. Removing direct proxies does not establish temporal validity: dates, recency, averages, and returns still reflect later behavior. Random customer splits/OOB validation cannot establish future prediction at acquisition. Test-label threshold exploration in cell 6 needs a separate validation set.

Report says 4,304 customers / ~67% repeat. A local customer_data.csv inspected read-only contains 4,326 rows, 2,830 repeats (~65.4%), with first-purchase dates in 2010–2011. This file is not published or assumed to reproduce all runs. Raw online_retail_data.csv and customer_first_purchase.csv were not found with supplied inputs. Full two-year analysis coverage remains unverified.

UCI source dataset metadata (not model-sample metadata): https://archive.ics.uci.edu/dataset/502/online+retail+ii — Daqing Chen, Online Retail II, DOI 10.24432/C5CG6D. 1,067,371 records, Dec 1 2009–Dec 9 2011. The page links the official source and distinguishes its size from the analysis sample.

Future-work recommendations are explicitly proposals, not completed experiments or claimed business improvements. The original report discloses ChatGPT help for comments, EDA suggestions, and debugging.
