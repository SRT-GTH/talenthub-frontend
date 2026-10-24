/*
 * trendFormat — number labels of the trend charts, as drawn in Figma: axis ticks "0 · 60k · 120k · 6.3k · 13k · 1.1k · 350", tooltip "7.9k" / "26k".
 * Below 1,000 the plain number; 1,000–9,999 one decimal ("2.5k", "7.5k", "6.3k"); 10,000+ whole thousands ("13k", "38k", "240k").
 * These are chart scales and aggregates (never a count under 5), so they do not need the "<5" rule.
 */
export const formatCompact = (v) => {
  if (v < 1000) return String(Math.round(v));
  if (v < 10000) return `${(v / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${Math.round(v / 1000)}k`;
};

/** Axis tick; `whole` (phone frame) rounds every thousand figure to whole k ("6k" where desktop draws "6.3k"). */
export const formatAxis = (v, whole = false) => {
  if (v === 0) return '0';
  if (whole && v >= 1000) return `${Math.round(v / 1000)}k`;
  return formatCompact(v);
};
