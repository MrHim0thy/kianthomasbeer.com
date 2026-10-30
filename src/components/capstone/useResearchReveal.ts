import { useReducedMotion } from 'framer-motion';

// Content stays visible when observation is unavailable or motion is reduced.
export function researchReveal(reduced: boolean, canObserve: boolean, amount = 0.06) {
  if (reduced || !canObserve) return { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } };
  return {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount },
    transition: { duration: 0.4 },
  };
}
export function useResearchReveal(amount = 0.06) {
  const reduced = useReducedMotion();
  return researchReveal(Boolean(reduced), typeof IntersectionObserver !== 'undefined', amount);
}
