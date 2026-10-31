import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { aboutMe as copy } from '../content/aboutMe';
import { profile } from '../content';
import { publishedProjects, getProjectRoute } from '../content/projects';
import './AboutMe.css';

function useAboutMetadata() {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const description = 'Meet Kian Thomasbeer: UVA statistics graduate, curious problem-solver, and explorer of data, technology, music, languages, and everyday ideas.';
    for (const [attribute,key,value] of [['name','description',description],['property','og:title','About Me — Kian Thomasbeer'],['property','og:description',description],['property','og:url','https://kianthomasbeer.com/#/about']] as const) {
      const previous = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      const element = previous ?? document.createElement('meta');
      const content = element.getAttribute('content');
      element.setAttribute(attribute,key); element.content=value;
      if (!previous) document.head.append(element);
      cleanups.push(()=>{if(!previous) element.remove(); else if(content===null) element.removeAttribute('content'); else element.content=content;});
    }
    const previous = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonical = previous ?? document.createElement('link');
    const href = canonical.getAttribute('href');
    canonical.rel='canonical'; canonical.href='https://kianthomasbeer.com/#/about';
    if(!previous) document.head.append(canonical);
    cleanups.push(()=>{if(!previous) canonical.remove(); else if(href===null) canonical.removeAttribute('href'); else canonical.setAttribute('href',href);});
    return ()=>cleanups.reverse().forEach(fn=>fn());
  },[]);
}

export default function AboutMe() {
  useAboutMetadata();
  return <article className="about-me">
    <header className="about-hero">
      <div className="about-introduction"><span className="about-eyebrow">ABOUT ME / KIAN THOMASBEER</span><h1>{copy.headline.lead}<br/><em>{copy.headline.rest}</em></h1><p>{copy.introduction}</p><a className="about-scroll" href="#/about#about-background">A little of my story <ArrowDown size={15}/></a></div>
      <figure className="about-portrait"><div className="about-portrait-mat"><span className="about-portrait-mark" aria-hidden="true">KT /</span><img src={copy.portrait.src} alt={copy.portrait.alt} width={copy.portrait.width} height={copy.portrait.height} fetchPriority="high"/></div><figcaption>{copy.portraitCaption}</figcaption></figure>
    </header>
    <section className="about-background" id="about-background" aria-labelledby="about-background-title"><div className="about-section-label"><span>01 / MY BACKGROUND</span><h2 id="about-background-title">A way of thinking,<br/>not just a toolkit.</h2></div><div className="about-background-copy">{copy.background.map(paragraph=><p key={paragraph}>{paragraph}</p>)}<div className="about-toolkit" aria-label="Technical toolkit">{copy.toolkit.map(tool=><span key={tool}>{tool}</span>)}</div><div className="about-project-links"><span>FOLLOW THE QUESTIONS</span>{publishedProjects.map(project=><Link key={project.slug} to={getProjectRoute(project)}>{project.title}<ArrowUpRight size={15}/></Link>)}</div></div></section>
    <section className="about-path" aria-labelledby="about-path-title"><div className="about-section-label"><span>02 / MY PATH</span><h2 id="about-path-title">Learning.<br/>Making. Moving forward.</h2><p>A few threads that connect where I’ve been with where I’m heading.</p></div><ol>{copy.timeline.map((milestone,index)=><li key={milestone.phase}><span className="about-path-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><span className="about-eyebrow">{milestone.phase}</span><h3>{milestone.title}</h3><p>{milestone.text}</p></div></li>)}</ol></section>
    <section className="about-interests" aria-labelledby="about-interests-title"><div className="about-interests-heading"><div className="about-section-label"><span>03 / BEYOND THE DATA</span><h2 id="about-interests-title">A life outside<br/><em>the spreadsheet.</em></h2></div><p>Things I make time for, places I want to explore, and interests that keep me curious.</p></div><div className="about-gallery">{copy.interests.map((interest,index)=><figure className={`about-interest about-interest-${interest.id}`} key={interest.id}><div className="about-interest-photo">{interest.photo ? <img src={interest.photo.src} alt={interest.photo.alt} width={interest.photo.width} height={interest.photo.height} loading="lazy"/> : <div className="about-photo-placeholder" role="img" aria-label={`Personal photo placeholder for ${interest.title}; photograph not yet supplied`}><span>{String(index+1).padStart(2,'0')} / PERSONAL PHOTOGRAPH</span><strong>{interest.title}</strong><small>Photo to come</small></div>}</div><figcaption><h3>{interest.title}</h3><p>{interest.caption}</p></figcaption></figure>)}</div></section>
    <section className="about-mission" aria-labelledby="about-mission-title"><h2 className="about-eyebrow" id="about-mission-title">04 / WHAT DRIVES ME</h2><blockquote>{copy.mission}</blockquote><span className="about-mission-signature">Keep asking. Keep learning.</span></section>
    <section className="about-next" aria-labelledby="about-next-title"><div className="about-section-label"><span>05 / WHAT’S NEXT</span><h2 id="about-next-title">Room for the<br/><em>next good question.</em></h2></div><div><p>{copy.next}</p><div className="about-next-links"><Link className="about-primary" to="/projects">Explore my projects <ArrowUpRight size={17}/></Link>{profile.resume && <a href={profile.resume} target="_blank" rel="noopener noreferrer">Résumé <ArrowUpRight size={15}/><span className="about-sr-only"> (PDF, opens in a new tab)</span></a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15}/><span className="about-sr-only"> (opens in a new tab)</span></a>}<a href={`mailto:${profile.email}`}>Get in touch <ArrowUpRight size={15}/></a></div></div></section>
  </article>;
}
