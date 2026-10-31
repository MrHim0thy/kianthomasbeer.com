import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowDown, ArrowUpRight, RotateCw } from 'lucide-react';
import { mathEveryday as study } from '../../content/mathEveryday';
import './MathEverydayCaseStudy.css';

const root = '/projects/math-everyday';
function useGalleryMetadata() {
  useEffect(() => {
    const undo: (() => void)[] = [];
    const description = 'A visual exhibition of everyday mathematics: original calorie proportions, a heart-rate illustration, email word frequencies, and a daily activity treemap, with source transparency notes.';
    for (const [attribute,key,value] of [['name','description',description],['property','og:title',study.title],['property','og:description',description],['property','og:url','https://kianthomasbeer.com/#/projects/math-everyday']] as const) {
      const previous = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      const element = previous ?? document.createElement('meta');
      const content = element.getAttribute('content');
      element.setAttribute(attribute,key); element.content = value;
      if (!previous) document.head.append(element);
      undo.push(()=> { if (!previous) element.remove(); else if (content === null) element.removeAttribute('content'); else element.content=content; });
    }
    const previous = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonical = previous ?? document.createElement('link');
    const href = canonical.getAttribute('href');
    canonical.rel='canonical'; canonical.href='https://kianthomasbeer.com/#/projects/math-everyday';
    if (!previous) document.head.append(canonical);
    undo.push(()=>{if (!previous) canonical.remove(); else if (href===null) canonical.removeAttribute('href'); else canonical.setAttribute('href',href);});
    return ()=>undo.reverse().forEach(fn=>fn());
  }, []);
}

function EmailCloud() {
  const [loaded,setLoaded]=useState(false);
  const [attempt,setAttempt]=useState(0);
  const [open,setOpen]=useState(false);
  return <div className="me-cloud">
    <div className="me-frame-tools"><span>ORIGINAL INTERACTIVE WORDCLOUD2</span><a href={`${root}/widgets/email-words.html`} target="_blank" rel="noopener noreferrer">Open separately <ArrowUpRight size={14}/><span className="me-sr-only"> (new tab)</span></a></div>
    {!loaded && <p className="me-loading" role="status">Loading the original word cloud… If it does not appear, use “Open separately” above.</p>}
    <iframe key={attempt} src={`${root}/widgets/email-words.html`} title="Original email word-frequency cloud" loading="lazy" onLoad={()=>setLoaded(true)} />
    <div className="me-frame-footer"><span>Explore words with your pointer. Small screen? Scroll inside the frame or open it separately.</span><button onClick={()=>{setLoaded(false);setAttempt(a=>a+1);}} aria-label="Reload email word cloud"><RotateCw size={13}/> Reload</button></div>
    <details onToggle={e=>setOpen(e.currentTarget.open)}><summary>Read the first 30 word frequencies as a table</summary>{open && <div className="me-word-table" role="region" aria-label="First 30 original word frequencies" tabIndex={0}><table><caption>Original widget order and counts · text alternative to the canvas</caption><thead><tr><th scope="col">Word</th><th scope="col">Count</th></tr></thead><tbody>{study.wordFrequencies.map(({word,count})=><tr key={word}><th scope="row">{word}</th><td>{count}</td></tr>)}</tbody></table></div>}</details>
  </div>;
}

export default function MathEverydayCaseStudy() {
  useGalleryMetadata();
  return <article className="math-everyday">
    <div className="me-top"><Link to="/projects"><ArrowLeft size={15}/> All projects</Link><span>A VISUAL EXHIBITION BY {study.author.toUpperCase()}</span></div>
    <header className="me-hero">
      <div className="me-hero-copy"><span className="me-label">EVERYDAY LIFE, THROUGH A DIFFERENT LENS</span><h1>Math<br/><em>Everyday.</em></h1><p className="me-subtitle">Visual Stories of Daily Life</p><p className="me-deck">A meal. A rhythm. A conversation. A day.<br/>Four ways to see the mathematics hiding in ordinary routines.</p><a className="me-explore" href="#/projects/math-everyday#me-introduction">Step into the gallery <ArrowDown size={16}/></a></div>
      <div className="me-hero-art"><img src={`${root}/cover.svg`} alt="Concept artwork combining a portion symbol, a rhythm line, word forms, and a treemap motif; not measured data" width="600" height="600"/><div className="me-hero-art-caption"><span>R / VISUAL STORYTELLING</span><span>CONCEPT ARTWORK · NOT DATA</span></div></div>
    </header>
    <div className="me-exhibit-index" role="navigation" aria-label="Gallery exhibits">{study.sections.map((s,i)=><a key={s.id} href={`#/projects/math-everyday#me-${s.id}`}><span>0{i+1}</span>{s.heading}<ArrowUpRight size={15}/></a>)}</div>
    <section className="me-introduction" id="me-introduction" aria-labelledby="me-intro-title"><div><span className="me-label">THE IDEA</span><h2 id="me-intro-title">Ordinary routines.<br/>Unexpected patterns.</h2><span className="me-byline">Kian Thomasbeer · R · Data visualization</span></div><div><span className="me-original-label">FROM THE ORIGINAL PUBLICATION</span><p>{study.introduction}</p><p className="me-intro-note">Original figures and explanations are retained below. Source clarifications distinguish documented inputs from claims that the available R source does not substantiate.</p></div></section>
    {study.sections.map((section,index)=><section className={`me-exhibit me-${section.id}`} id={`me-${section.id}`} key={section.id} aria-labelledby={`me-title-${section.id}`}>
      <header className="me-exhibit-heading"><span className="me-exhibit-number">0{index+1}</span><div><span className="me-label">{['PROPORTION','RHYTHM','LANGUAGE','TIME'][index]}</span><h2 id={`me-title-${section.id}`}>{section.heading}</h2><p>{section.subtitle}</p></div><span className="me-tech">{section.technology}</span></header>
      {section.id==='heart-rate' && <aside className="me-clarification"><strong>Source clarification — simulated series, not verified tracker measurements.</strong><p>The published prose below describes a tracker export. However, the matching R Markdown constructs values at five-minute intervals using phase-based assumptions and random noise. The original image is preserved; it is not presented here as a verified personal heart-rate recording. A genuine tracker export would be needed to substantiate that claim.</p></aside>}
      <div className="me-exhibit-layout"><div className="me-exhibit-narrative"><span className="me-original-label">ORIGINAL EXPLANATION</span><p>{section.description}</p><div className="me-source"><span>BEHIND THE VISUAL</span><p>{section.source}</p></div></div>
        <div className="me-artwork">{'image' in section ? <figure><a href={`${root}/figures/${section.image}`} target="_blank" rel="noopener noreferrer" aria-label={`Open full-resolution ${section.subtitle} in a new tab`}><img src={`${root}/figures/${section.image}`} alt={section.subtitle} width={section.width} height={section.height} loading="lazy"/></a><figcaption>Original published figure · {section.technology} · Open for full size</figcaption></figure>:<EmailCloud/>}</div>
      </div><div className="me-caption"><span>THE MATHEMATICAL CONNECTION</span><p>{section.caption}</p></div>
    </section>)}
    <section className="me-meaning" aria-labelledby="me-meaning-title"><span className="me-label">THE BIGGER PICTURE</span><h2 id="me-meaning-title">Why These<br/><em>Visuals Matter.</em></h2><aside className="me-clarification"><strong>A note on the original conclusion</strong><p>The original text mentions a heatmap, but the published HTML contains only the four visualizations above. No additional heatmap has been supplied or invented. The email text’s claimed five-year coverage also remains unverified; the R source names a file without documenting that timespan.</p></aside><div className="me-conclusion">{study.conclusion.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div></section>
    <section className="me-publication" aria-labelledby="me-publication-title"><div><span className="me-label">CONTINUE EXPLORING</span><h2 id="me-publication-title">The original story,<br/>in its original home.</h2><p>Read Kian Thomasbeer’s complete Math Everyday publication on RPubs.</p></div><a href={study.publication} target="_blank" rel="noopener noreferrer">Read the original publication <ArrowUpRight size={19}/><span className="me-sr-only"> (opens in a new tab)</span></a></section>
    <details className="me-provenance"><summary>About the sources & preservation</summary><p>The local compiled HTML matches the published RPubs HTML exactly. The three PNGs and full word-cloud payload were extracted without recalculating data or changing chart colors. Original explanatory paragraphs are preserved verbatim. Only the widget’s broken reload guard is bypassed, preserving its word frequencies and hover behavior. Raw email text is not included in the website.</p><p>The original pie chart shows entered meal proportions; the heart-rate image is retained with a simulation clarification; the word cloud uses the published frequencies; and the treemap uses the original listed activity minutes. The word cloud may lay out its words differently as the original runtime reflows. Its first 30 frequencies are available as a keyboard-readable table.</p></details>
    <Link className="me-back" to="/projects"><ArrowLeft size={16}/> Back to all projects</Link>
  </article>;
}
