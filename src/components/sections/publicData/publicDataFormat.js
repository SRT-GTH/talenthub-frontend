/*
 * publicDataFormat.js — number formatting and the privacy rule of every Theme 8 screen.
 *
 * Counts under SUPPRESSION_THRESHOLD (5) are never shown: they read "<5" (Figma landing / overview notes) and, where a sentence is drawn,
 * "Fewer than 5 · hidden" (8.2.3d). The threshold matches the Platform Admin stories (minimum cell count 5 for aggregated data).
 * Every component that prints a talent count goes through formatCount() so the rule cannot be bypassed on one screen.
 */

export const SUPPRESSION_THRESHOLD = 5;

export const isSuppressed = (n) => typeof n === 'number' && n >= 0 && n < SUPPRESSION_THRESHOLD;

/** 219428 → "219,428"; counts under 5 → "<5". */
export const formatCount = (n) => {
  if (n === null || n === undefined || Number.isNaN(n)) return '–';
  if (isSuppressed(n)) return '<5';
  return new Intl.NumberFormat('en-GH').format(n);
};

/** 2400000 → "GHS 2.4M" (Figma KPI: "GHS 2.4M"). */
export const formatGhs = (n) => {
  if (n >= 1_000_000) return `GHS ${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `GHS ${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `GHS ${n}`;
};

/** 0.193 → "19.3%". */
export const formatPercent = (ratio, digits = 0) => `${(ratio * 100).toFixed(digits)}%`;

/** 42 → "▲ +42%", -3 → "▼ -3%" (Figma change badge text). */
export const formatChange = (pct) => `${pct >= 0 ? '▲ +' : '▼ '}${pct}%`;

/** A share rounded to a whole percent that never shows a bucket with fewer than SUPPRESSION_THRESHOLD people. */
export const safeShare = (part, total) => {
  if (!total || isSuppressed(part)) return null;
  return Math.round((part / total) * 100);
};
