import { isSuppressed } from '../publicDataFormat.js';

/*
 * mapBins.js — the five talent-count bins of the Ghana map legend plus the suppressed / no-data fill (Figma "T8 · Map legend" 8487:346081).
 * Legend copy is verbatim from the frame (en dashes and non-breaking structure as drawn):
 *   Under 6,000 · 6,000 – 9,999 · 10,000 – 14,999 · 15,000 – 29,999 · 30,000+ · Fewer than 5 · hidden
 * `fill` is the region fill, `ink` is the label colour that reads on it (white on the three dark greens, #1c2a21 on the light ones).
 * A count under 5 (or a missing count) is never binned: it gets the neutral "Fewer than 5 · hidden" fill.
 */

export const MAP_BINS = [
  { id: 'bin-1', label: 'Under 6,000', min: 0, fill: '#c1d4c4', ink: '#1c2a21' },
  { id: 'bin-2', label: '6,000 – 9,999', min: 6000, fill: '#6ca271', ink: '#1c2a21' },
  { id: 'bin-3', label: '10,000 – 14,999', min: 10000, fill: '#387440', ink: '#ffffff' },
  { id: 'bin-4', label: '15,000 – 29,999', min: 15000, fill: '#224626', ink: '#ffffff' },
  { id: 'bin-5', label: '30,000+', min: 30000, fill: '#142916', ink: '#ffffff' },
];

export const MAP_SUPPRESSED_BIN = {
  id: 'suppressed',
  label: 'Fewer than 5 · hidden',
  fill: '#e4e4df',
  ink: '#1c2a21',
};

/** Loading skeleton fill of every region (Figma 8488:151). */
export const MAP_SKELETON_FILL = '#f2f2ee';

/** The un-highlighted fill of the mini map (region page "Zoomed map" 8493:1807). */
export const MAP_MINI_BASE_FILL = '#efefea';
export const MAP_MINI_HIGHLIGHT_FILL = '#224626';

/** The bin of a talent count; counts under 5 or missing counts are the suppressed bin. */
export const binForCount = (count) => {
  if (count === null || count === undefined || Number.isNaN(count) || isSuppressed(count)) {
    return MAP_SUPPRESSED_BIN;
  }
  let found = MAP_BINS[0];
  MAP_BINS.forEach((b) => {
    if (count >= b.min) found = b;
  });
  return found;
};
