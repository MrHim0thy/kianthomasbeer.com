import { useEffect, useRef, type RefObject } from 'react';
import { readingProgress } from './readingProgressMath';

export default function ReadingProgress({ articleRef }: { articleRef: RefObject<HTMLElement | null> }) {
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const article = articleRef.current;
    const line = lineRef.current;
    if (!article || !line) return;
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const bounds = article.getBoundingClientRect();
      const progress = readingProgress(window.scrollY, window.scrollY + bounds.top, bounds.height, window.innerHeight);
      line.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(article);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [articleRef]);
  return <div ref={lineRef} className="uva-reading-progress" aria-hidden="true" />;
}

