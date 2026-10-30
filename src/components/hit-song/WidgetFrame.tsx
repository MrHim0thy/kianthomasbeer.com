import { useEffect, useState } from 'react';
import { ArrowUpRight, Play, RotateCw } from 'lucide-react';

export default function WidgetFrame({ src, title, external = false, tall = false }: { src: string; title: string; external?: boolean; tall?: boolean }) {
  const [active, setActive] = useState(!external);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!active || loaded) return;
    const timer = window.setTimeout(() => setSlow(true), 20000);
    return () => window.clearTimeout(timer);
  }, [active, loaded, attempt]);
  return <div className={`hs-widget ${external ? 'hs-shiny' : ''} ${tall ? 'hs-widget-tall' : ''}`}>
    <div className="hs-widget-tools"><span>{external ? 'EXTERNALLY HOSTED · R / SHINY' : 'ORIGINAL HTML WIDGET'}</span><a href={src} target="_blank" rel="noopener noreferrer">Open {external ? 'app' : 'chart'} <ArrowUpRight size={14} /><span className="hs-sr-only"> in a new tab</span></a></div>
    {!active ? <div className="hs-launch"><span className="hs-launch-icon"><Play size={24} /></span><h3>Your research playground</h3><p>Start the original Shiny application to explore its live filters and charts. It connects to the existing external R server.</p><button onClick={() => setActive(true)}>Launch interactive app <ArrowUpRight size={16} /></button><small>On a small screen, use “Open app” for a dedicated workspace.</small></div> : <>
      {!loaded && <div className="hs-loading" role="status">{slow ? 'Still loading? Use the separate chart or app link above.' : 'Loading original visualization…'}</div>}
      <iframe key={attempt} src={src} title={title} loading={external ? 'eager' : 'lazy'} onLoad={() => setLoaded(true)} onError={() => { setSlow(true); setLoaded(false); }} />
      <div className="hs-frame-note"><span>{external ? 'The app runs on an external service. Its controls and appearance are preserved.' : 'Original chart preserved. On small screens, scroll horizontally inside the chart or open it separately.'}</span><button aria-label={`Reload ${title}`} onClick={() => { setLoaded(false); setSlow(false); setAttempt(a => a + 1); }}><RotateCw size={13} /> Reload</button></div>
    </>}
  </div>;
}
