// Usage: node scripts/hit-song/extract-widgets.mjs path/to/original/final.html
// Extracts the published artifact, without rerunning analyses or changing widget data.
import fs from 'node:fs';
import crypto from 'node:crypto';
const input = process.argv[2];
if (!input) throw new Error('Provide the original compiled final.html report.');
const html = fs.readFileSync(input, 'utf8');
const root = 'public/projects/hit-song';
for (const folder of ['figures', 'widgets', 'widgets/lib']) fs.mkdirSync(`${root}/${folder}`, { recursive: true });
const head = html.match(/<head>([\s\S]*?)<\/head>/i)[1];
const scripts = [...head.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
// Exact dependency order from the published R Markdown document. Report-only
// Bootstrap, syntax highlighting and jQuery tab helpers are deliberately omitted.
const dependencies = { plotly: [1, 7, 8, 9, 10, 11], wordcloud2: [1, 7, 12, 13, 14] };
const dependencyTags = {};
for (const [type, indexes] of Object.entries(dependencies)) {
  dependencyTags[type] = indexes.map(i => {
    const source = scripts[i][2];
    const hash = crypto.createHash('sha256').update(source).digest('hex').slice(0, 12);
    const filename = `dependency-${hash}.js`;
    fs.writeFileSync(`${root}/widgets/lib/${filename}`, source);
    return `<script src="lib/${filename}"></script>`;
  }).join('\n');
}
const figures = [...html.matchAll(/<img[^>]*src="data:image\/png;base64,([^"]+)"[^>]*>/g)];
if (figures.length !== 3) throw new Error('Expected exactly three original figures.');
['radar', 'energy-relationships', 'key-distribution'].forEach((name, i) => fs.writeFileSync(`${root}/figures/${name}.png`, Buffer.from(figures[i][1], 'base64')));
const widgets = [
  ['duration', 'htmlwidget-a8e085e8d132cc592c42', 'plotly', 'Song duration since 1957'],
  ['title-words', 'htmlwidget-adc5f638eff92ba352c5', 'wordcloud2', 'Most frequent song title words'],
  ['platform-engagement', 'htmlwidget-a1f933139b2ea8744cfa', 'plotly', 'Spotify streams and YouTube engagement'],
];
for (const [name, id, type, title] of widgets) {
  const payload = html.match(new RegExp(`<script type="application/json" data-for="${id}">([\\s\\S]*?)<\\/script>`))[1];
  JSON.parse(payload); // Fail rather than ship a truncated widget.
  const sizing = html.match(new RegExp(`<script type="application/htmlwidget-sizing" data-for="${id}">([\\s\\S]*?)<\\/script>`));
  fs.writeFileSync(`${root}/widgets/${name}.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>${dependencyTags[type]}<style>html,body{margin:0;background:white;width:100%;height:100%}html{overflow:auto}body{min-width:672px;overflow:hidden}.html-widget{width:100%!important;height:100%!important}body{font-family:Arial,sans-serif}</style>${type === 'wordcloud2' ? '<script>/* Published onRender references an undeclared iii guard. Suppress its accidental reload branch without changing data or hover. */ window.iii = true;</script>' : ''}</head><body><div class="${type} html-widget html-fill-item" id="${id}" style="width:100%;height:100%"></div><script type="application/json" data-for="${id}">${payload}</script>${sizing ? sizing[0] : ''}</body></html>`);
}
fs.writeFileSync(`${root}/provenance.json`, JSON.stringify({ source: 'https://rpubs.com/KianT/1375691', sourceSha256: crypto.createHash('sha256').update(html).digest('hex'), method: 'Original embedded PNG bytes, widget JSON, sizing configuration and runtime dependencies extracted without recalculation.', widgets: widgets.map(([file,id,type]) => ({file,id,type})) }, null, 2));
console.log('Extracted 3 original PNGs and 3 standalone HTML widgets.');
