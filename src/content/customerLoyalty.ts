export type InformationRegime = 'first' | 'history';
export interface LoyaltyResult {
  model: string;
  accuracy: number | null;
  auc: number | null;
  sensitivity: string;
  specificity: string;
  evidence: string;
  interpretation: string;
}
// Transcribed source results, not recomputed fits. See public/projects/customer-loyalty/README.md.
export const loyaltyResults: Record<InformationRegime, LoyaltyResult[]> = {
  first: [
    { model: 'Ridge logistic regression', accuracy: 66, auc: 0.5366630771160923, sensitivity: '1.00', specificity: '0.00', evidence: 'Notebook cell 8 · accuracy rounded to 0.66 in saved output', interpretation: 'AUC is barely above 0.5. At the 0.5 threshold, every test customer is classified as a repeat purchaser.' },
    { model: 'Decision tree', accuracy: 65.44, auc: null, sensitivity: '100%', specificity: '0%', evidence: 'Final report · Decision Trees', interpretation: 'The first-purchase tree is a single node: it predicts the majority class for everyone.' },
    { model: 'Random forest', accuracy: 62.61, auc: null, sensitivity: '66.56%*', specificity: '39.37%*', evidence: 'Final report · Random Forest; notebook cell 11 contains matching arithmetic', interpretation: 'The R code reports the fitted forest and does not show held-out predict() for this score. Its arithmetic appears to use an OOB confusion matrix; evaluation provenance needs confirmation.' },
    { model: 'Feedforward neural network', accuracy: null, auc: null, sensitivity: 'Not reported', specificity: 'Not reported', evidence: 'No first-purchase FFNN result supplied', interpretation: 'The supplied neural-network analysis uses aggregated customer history. No first-purchase score is available.' },
  ],
  history: [
    { model: 'Ridge logistic regression', accuracy: 65.7, auc: 0.6525874800958025, sensitivity: '0.985', specificity: '0.038', evidence: 'Notebook cells 5–6 · accuracy printed as 0.657 in cell 6', interpretation: 'Ranking improves, but threshold classification still favors repeat customers. Features are averages and an ever-returned indicator computed across observed history.' },
    { model: 'Decision tree', accuracy: 74.16, auc: null, sensitivity: '93.19%', specificity: '37.48%', evidence: 'Final report · Decision Trees; notebook cell 11 contains matching arithmetic', interpretation: 'Recency and returns drive the tree. They describe already-observed behavior, not information available at acquisition.' },
    { model: 'Random forest', accuracy: 96.39, auc: null, sensitivity: '99.11%*', specificity: '91.86%*', evidence: 'Final report · Random Forest; notebook cell 11 contains matching arithmetic', interpretation: 'A high retrospective score, not validated future retention performance. The feature list retains first/last purchase dates and end-of-period recency; the score appears to be OOB rather than held-out.' },
    { model: 'Feedforward neural network', accuracy: 73, auc: 0.82, sensitivity: '0.78', specificity: '0.64', evidence: 'Final report · FFNN; notebook cell 13 has code but no saved output', interpretation: 'Reported held-out test results. Removing direct outcome proxies helps, but full-history recency, quantity, and returns still lack a prediction-time cutoff.' },
  ],
};
export const loyaltySources = {
  root: '/projects/customer-loyalty',
  dataset: 'https://archive.ics.uci.edu/dataset/502/online+retail+ii',
  team: ['Lexie Boyd', 'Lauren Dunbar', 'Kian Thomasbeer', 'Stephanie Tiede'],
};

