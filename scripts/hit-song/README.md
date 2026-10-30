# Preserving the original music visualizations

Run from the repository root:

```sh
node scripts/hit-song/extract-widgets.mjs /path/to/original/final.html
```

The input is the original compiled R Markdown report matching RPubs publication
1375691. Extraction copies PNG bytes and the complete HTML-widget JSON (including
Plotly frames, hover text, and callbacks), plus the original runtime dependencies.
It does not execute R, fetch a new Spotify snapshot, refit models, or transform data.
Shared dependency files are content-hashed and served locally for browser caching.
The original word-cloud onRender hook references an undeclared `iii` variable and
contains an accidental reload branch. A small iframe-local `window.iii = true`
compatibility guard prevents that branch; original payload and hover remain intact.
Widgets retain a minimum 672px workspace with internal horizontal scrolling on
smaller screens, preserving original labels, word-cloud scale, and controls.
`public/projects/hit-song/provenance.json` records the source HTML checksum.
The extractor targets this published document's dependency order and widget IDs;
review it before using a different report version.

Shiny apps remain at their existing shinyapps.io URLs. Static hosting cannot run
their reactive R code. The page starts each app on request and provides an external
link if embedding or the remote service is unavailable. An iframe load event only
confirms the document loaded, not that every remote R output is healthy.

Source ambiguities are disclosed on the page: radar scaling, the fourth energy
panel's mismatched labels, and differences between approximate dataset counts and
serialized plotted positions. Preserve these notes until the source is clarified.

Verification: compare all eight visualizations in original order; exercise Plotly
play/slider/hover/zoom, both Shiny apps' filters/tabs/table, and word-cloud hover.
Check 375, 768, 1366 and 1920 px layouts, keyboard focus and reduced motion. Static
figures link to their original full-resolution PNG for small-screen inspection.
The duration animation is user-controlled; decorative waveform motion is disabled
under prefers-reduced-motion. No chart filters or color remapping are applied.
