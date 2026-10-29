import { useEffect } from 'react';

// The deployed application uses HashRouter and a root-base GitHub Pages build.
// A clean-path canonical would advertise a route the static host cannot currently serve.
export const capstoneSeo = {
  title: 'Air Pollution & Respiratory ER Visits — Kian Thomasbeer',
  description: 'A University of Virginia statistics capstone exploring respiratory emergency visits, PM2.5, seasonality, and socioeconomic context in Virginia, with interactive research visualizations.',
  url: 'https://kianthomasbeer.com/#/projects/virginia-air-quality',
};

export function useCapstoneMetadata() {
  useEffect(() => {
    const restore: Array<() => void> = [];
    const previousTitle = document.title;
    document.title = capstoneSeo.title;
    restore.push(() => { document.title = previousTitle; });
    function meta(key: 'name' | 'property', name: string, value: string) {
      const existing = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${name}"]`);
      const node = existing ?? document.createElement('meta');
      const previous = node.getAttribute('content');
      node.setAttribute(key, name);
      node.content = value;
      if (!existing) document.head.appendChild(node);
      restore.push(() => { if (!existing) node.remove(); else if (previous === null) node.removeAttribute('content'); else node.content = previous; });
    }
    meta('name', 'description', capstoneSeo.description);
    meta('property', 'og:title', capstoneSeo.title);
    meta('property', 'og:description', capstoneSeo.description);
    meta('property', 'og:type', 'article');
    meta('property', 'og:url', capstoneSeo.url);
    meta('property', 'og:site_name', 'Kian Thomasbeer');
    const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonical = existing ?? document.createElement('link');
    const previousHref = canonical.getAttribute('href');
    canonical.rel = 'canonical';
    canonical.href = capstoneSeo.url;
    if (!existing) document.head.appendChild(canonical);
    restore.push(() => { if (!existing) canonical.remove(); else if (previousHref === null) canonical.removeAttribute('href'); else canonical.setAttribute('href', previousHref); });
    // No social preview image has been provided; do not manufacture one.
    return () => restore.reverse().forEach(undo => undo());
  }, []);
}
