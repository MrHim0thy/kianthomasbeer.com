# Math Everyday source preservation

Publication: https://rpubs.com/KianT/1378325

The matching local compiled HTML was compared with the published S3 document and
matched exactly. Its checksum is recorded in `public/projects/math-everyday/provenance.json`.

```sh
node scripts/math-everyday/extract-report.mjs path/to/Math-Everyday_Visual-Stories-of-Daily-Life.html
```

The script preserves three original PNGs (ggplot2 pie chart, heart-rate time series,
and ggplot2/treemapify activity treemap), plus one wordcloud2 HTML widget. It copies
the complete widget JSON, original runtime dependencies and tooltip styles. It
does not rerun R or regenerate random values. Its extraction selectors target this
published report; review them before supplying a different compiled version.

All narrative paragraphs are preserved, including original spelling and source
conflicts. The page prominently documents the following:

- Heart-rate prose claims tracker observations, but the matching R Markdown uses
  phase-based assumptions and `rnorm()` at five-minute intervals. The original
  PNG is retained as a simulated illustration, not verified personal observations.
- The email prose claims five years. The R source reads `emails_week.txt`; the
  precise timespan is unverified. No raw email text is copied to the website.
- The conclusion mentions a heatmap; none occurs in the published report.
- Meal proportions are manually entered in R. Activity minutes are manually
  listed and sum to 1,440; original rounded labels are retained.

The wordcloud's published onRender hook references an undeclared `iii` guard and
an invalid `False` value in a reload branch. A small iframe-local `iii=true`
compatibility guard suppresses that branch without changing the JSON, frequencies,
colors, or hover code. The original runtime may randomize layout and colors.
The widget retains a 672px minimum workspace and internal horizontal scrolling,
with a standalone link. A table exposes the first 30 original frequencies to
keyboard users without trying to replace the complete interactive widget.

The new project is not featured, preserving the homepage's existing first three
projects. The route uses the existing HashRouter: `/#/projects/math-everyday`.

Verification: compare original PNG bytes and widget JSON, inspect all four visuals,
test word-cloud hover and the accessible table, verify card navigation and category
filters, check mobile/tablet/desktop widths, and run `npm run build`.
