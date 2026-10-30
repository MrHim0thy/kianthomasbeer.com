export function readingProgress(scrollY: number, articleTop: number, articleHeight: number, viewportHeight: number) {
  const distance = articleHeight - viewportHeight;
  if (distance <= 0) return scrollY + viewportHeight >= articleTop + articleHeight ? 1 : 0;
  return Math.min(1, Math.max(0, (scrollY - articleTop) / distance));
}
