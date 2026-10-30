import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, AudioLines, Disc3, Headphones } from 'lucide-react';
import { hitSongReport, hitSongSections } from '../../content/hitSong';
import WidgetFrame from './WidgetFrame';
import './HitSongCaseStudy.css';

function useMusicMetadata() {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const description = 'An interactive music analytics case study exploring audio features, song duration, titles, and engagement through original R, Plotly, and Shiny visualizations.';
    for (const [attribute, key, value] of [['name', 'description', description], ['property', 'og:title', 'What Makes a Hit Song? — Kian Thomasbeer'], ['property', 'og:description', description], ['property', 'og:url', 'https://kianthomasbeer.com/#/projects/what-makes-a-hit-song']] as const) {
      const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      const node = existing ?? document.createElement('meta');
      const previous = node.getAttribute('content');
      node.setAttribute(attribute, key); node.content = value;
      if (!existing) document.head.append(node);
      cleanups.push(() => { if (!existing) node.remove(); else if (previous === null) node.removeAttribute('content'); else node.content = previous; });
    }
    const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonical = existing ?? document.createElement('link');
    const previous = canonical.getAttribute('href');
    canonical.rel = 'canonical'; canonical.href = 'https://kianthomasbeer.com/#/projects/what-makes-a-hit-song';
    if (!existing) document.head.append(canonical);
    cleanups.push(() => { if (!existing) canonical.remove(); else if (previous === null) canonical.removeAttribute('href'); else canonical.setAttribute('href', previous); });
    return () => cleanups.reverse().forEach(cleanup => cleanup());
  }, []);
}

export default function HitSongCaseStudy() {
  useMusicMetadata();
  return <article className="hit-song-case-study">
    <div className="hs-topline"><Link to="/projects"><ArrowLeft size={15} /> All projects</Link><span><AudioLines size={16} /> RESEARCH / IN STEREO</span></div>
    <header className="hs-hero">
      <div><span className="hs-kicker">MUSIC ANALYTICS</span><h1>What Makes<br />a <em>Hit Song?</em></h1><p className="hs-intro">Millions of tracks. No single formula.<br />An exploration of the sound, structure, and cross-platform life of popular music.</p><div className="hs-tags">{['R', 'Spotify', 'Billboard', 'Plotly', 'Shiny'].map(tag => <span key={tag}>{tag}</span>)}</div><a className="hs-primary" href={hitSongReport} target="_blank" rel="noopener noreferrer">Read the original publication <ArrowUpRight size={18} /><span className="hs-sr-only"> (opens in a new tab)</span></a></div>
      <div className="hs-deck"><div className="hs-deck-label"><Headphones size={16} /> THE ANATOMY OF A HIT <span>VOL. 01</span></div><div className="hs-record" aria-hidden="true"><div><Disc3 size={42} /><span>SOUND<br />MEETS DATA</span></div></div><div className="hs-wave" aria-hidden="true">{Array.from({ length: 49 }, (_, i) => <i key={i} style={{ height: `${12 + Math.abs(Math.sin(i * .68) * Math.cos(i * .21)) * 64}px`, animationDelay: `${i * -.12}s` }} />)}</div><span className="hs-art-caption">ABSTRACT AUDIO MOTIF · NOT MEASURED DATA</span></div>
    </header>
    <nav className="hs-index" aria-label="Research chapters">{[['01', 'Sound', 'audio-profile'], ['02', 'Engagement', 'engagement-lab'], ['03', 'Time', 'duration'], ['04', 'Language', 'title-words']].map(([n,label,id]) => <a key={id} href={`#/projects/what-makes-a-hit-song#${id}`}><span>{n}</span>{label}<ArrowUpRight size={14} /></a>)}</nav>
    <section className="hs-context" aria-labelledby="hs-context-title"><div><span className="hs-kicker">THE LISTENING ROOM</span><h2 id="hs-context-title">Different datasets.<br />Different perspectives.</h2><p>The original research combines three distinct collections. Their scope matters: the charts describe selected songs, not all music or a causal formula for success.</p></div><div className="hs-cohorts"><div><span>01 / SPOTIFY HITS</span><h3>The billion-stream collection</h3><p>Songs with at least one billion Spotify streams, as of November 2025. Used for duration and the Song Explorer.</p></div><div><span>02 / BILLBOARD</span><h3>Charting audio & titles</h3><p>The report describes roughly 9,000 Hot 100 songs since 1990, with audio-feature validity filters applied in R.</p></div><div><span>03 / CROSS-PLATFORM</span><h3>Beyond one definition of a hit</h3><p>A separate Spotify / YouTube dataset includes hits and non-hits. Its exact version and row count remain a source clarification.</p></div></div></section>
    <div className="hs-research-grid">{hitSongSections.map((section, i) => <section id={section.id} className={`hs-panel hs-panel-${i + 1}`} key={section.id} aria-labelledby={`hs-title-${i}`}>
      <div className="hs-panel-head"><span className="hs-section-number">{String(i + 1).padStart(2, '0')} / RESEARCH</span><span className="hs-format">{section.type}</span></div><h2 id={`hs-title-${i}`}>{section.title}</h2><p className="hs-description">{section.description}</p><span className="hs-cohort">{section.cohort}</span>
      {'asset' in section ? <figure className="hs-static"><a href={`/projects/hit-song/figures/${section.asset}`} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size ${section.label} in a new tab`}><img src={`/projects/hit-song/figures/${section.asset}`} alt={section.label} loading="lazy" width={i === 0 ? 1920 : 1344} height={i === 0 ? 1344 : 960} /></a><figcaption>{section.label} · Original R figure · Open for full size</figcaption></figure> : 'widget' in section ? <WidgetFrame src={`/projects/hit-song/widgets/${section.widget}`} title={section.label} tall={section.id === 'duration'} /> : <WidgetFrame src={section.app} title={section.label} external />}
      <div className="hs-reading"><span>IN THE ORIGINAL REPORT</span><p>{section.finding}</p></div>{'note' in section && <details className="hs-source-note"><summary>Source clarification</summary><p>{section.note}</p></details>}
    </section>)}</div>
    <section className="hs-outro"><span className="hs-kicker">THE FINAL TRACK</span><h2>A recognizable profile.<br /><em>No guaranteed formula.</em></h2><p>The original report brings together energy, danceability, song length, familiar title language, and engagement across Spotify and YouTube. These are exploratory observations within distinct selected datasets—not proof that any one trait makes a song successful.</p><a className="hs-primary" href={hitSongReport} target="_blank" rel="noopener noreferrer">Explore the complete research <ArrowUpRight size={17} /></a></section>
    <details className="hs-methods"><summary>Research provenance & interpretation notes</summary><p>All three static figures and all three HTML widgets were extracted from the original compiled report without recalculating values or changing chart colors. The two Shiny applications retain their external R hosting and original controls. Word-cloud positioning may vary as the original widget lays out its words.</p><p>The source radar scaling and fourth scatterplot’s axis-label mismatch are documented alongside those figures. The engagement widget contains more plotted positions than the report’s approximate 17,000-song description; plotted points are not necessarily unique songs. Dataset versions and exact sample counts need confirmation before stronger quantitative claims are made.</p><p>The report’s explanations about production, vocal range, replay value, explicit content, and marketing are exploratory interpretations. No causal effects or new statistical tests are asserted here. The original publication remains available for the complete wording and methodology.</p></details>
    <div className="hs-bottom"><Link to="/projects"><ArrowLeft size={16} /> Back to all projects</Link><a href={hitSongReport} target="_blank" rel="noopener noreferrer">Original RPubs report <ArrowUpRight size={15} /></a></div>
  </article>;
}
