import { useEffect, useId, useRef, useState } from 'react';
import './BeerBuddy.css';

const buddies = {
  peeking: { message: 'You found me.', pose: 'peeking over the edge', width: 260, height: 199 },
  laptop: { message: 'Just one more line of code.', pose: 'working on a laptop', width: 269, height: 257 },
  reading: { message: 'One more rabbit hole...', pose: 'reading a book', width: 259, height: 265 },
  frisbee: { message: 'Always chasing the disc.', pose: 'playing ultimate frisbee', width: 298, height: 227 },
  music: { message: 'Good music, good questions.', pose: 'listening to music', width: 257, height: 275 },
  hiking: { message: 'Taking the scenic route.', pose: 'hiking', width: 273, height: 273 },
};
export type BeerBuddyVariant = keyof typeof buddies;
export default function BeerBuddy({ variant, className = '' }: { variant: BeerBuddyVariant; className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const buddy = buddies[variant];
  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);
  return <div ref={root} className={`beer-buddy-egg beer-buddy-${variant} ${className}`}>
    <button type="button" aria-label={`Beer Buddy ${buddy.pose}: ${open ? 'hide' : 'reveal'} a little message`} aria-expanded={open} aria-controls={id}
      onClick={() => setOpen(value => !value)} onBlur={() => setOpen(false)}
      onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); event.stopPropagation(); } }}>
      <img src={`/assets/beer-buddy/${variant}.png`} width={buddy.width} height={buddy.height} alt="" loading="lazy" decoding="async" />
    </button>
    <span id={id} className="beer-buddy-speech" role="status" hidden={!open}>{buddy.message}</span>
  </div>;
}
