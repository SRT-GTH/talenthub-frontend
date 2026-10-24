import { REGIONS } from '../../regionsList.js';

/*
 * mapData.js — API-shaped mock data of the Ghana map (sample content only: every figure is sample data).
 * Shape of one region as the future endpoint returns it (GET /public/regions?…): { id, count, trendPct, education, topInterests }
 *   count        talents in the region under the current filters (a count under 5 is rendered "<5" by the components; the API may send the
 *                real number or null — components never print it raw)
 *   trendPct     change of that count over the last 30 days (null = not enough data)
 *   education    { pre, in, post } counts (pre-tertiary / in-tertiary / post-tertiary)
 *   topInterests the three biggest career-interest clusters, short names, most popular first
 * Counts are the "8.3.1e · One template, 16 regions" data sheet (Figma 8495:347797) and sum to the national 219,428 of the overview.
 * ⚠️ ASSUMPTION: trend %, education split and top interests are drawn only for Greater Accra (+6% · 46/32/22 · Technology, Business, Health),
 * Ashanti (+8%) and Eastern (+5%); the other regions' values are invented sample data.
 */

/* ===== BLOCK 1 · regional counts + per-region card content ============================================================= */
const RAW = [
  ['greater-accra', 42310, 6, [46, 32, 22], ['Technology', 'Business', 'Health']],
  ['ashanti', 38540, 8, [44, 34, 22], ['Technology', 'Business', 'Creative']],
  ['eastern', 16780, 5, [49, 31, 20], ['Agriculture', 'Technology', 'Education']],
  ['northern', 15480, 9, [58, 26, 16], ['Agriculture', 'Education', 'Health']],
  ['western', 14218, 4, [47, 33, 20], ['Engineering', 'Business', 'Technology']],
  ['volta', 13090, 6, [51, 30, 19], ['Health', 'Education', 'Agriculture']],
  ['central', 12340, 3, [48, 33, 19], ['Hospitality', 'Business', 'Education']],
  ['upper-east', 11340, 7, [60, 25, 15], ['Agriculture', 'Health', 'Education']],
  ['bono', 10872, 4, [52, 30, 18], ['Agriculture', 'Business', 'Technology']],
  ['north-east', 9210, 10, [62, 24, 14], ['Agriculture', 'Education', 'Health']],
  ['savannah', 7418, 8, [61, 25, 14], ['Agriculture', 'Education', 'Entrepreneurship']],
  ['bono-east', 6940, 5, [55, 28, 17], ['Agriculture', 'Business', 'Education']],
  ['upper-west', 6120, 9, [59, 26, 15], ['Education', 'Agriculture', 'Health']],
  ['western-north', 5440, 6, [54, 29, 17], ['Agriculture', 'Engineering', 'Business']],
  ['oti', 5210, 11, [56, 27, 17], ['Agriculture', 'Education', 'Health']],
  ['ahafo', 4120, 4, [55, 28, 17], ['Agriculture', 'Business', 'Entrepreneurship']],
];

const toRegion = ([id, count, trendPct, [pre, inn, post], topInterests]) => ({
  id,
  count,
  trendPct,
  education: {
    pre: Math.round((count * pre) / 100),
    in: Math.round((count * inn) / 100),
    post: Math.round((count * post) / 100),
  },
  topInterests,
});

/** The 16 regions in regionsList.js order, each with sample stats. */
export const MAP_REGIONS_SAMPLE = REGIONS.map((r) => {
  const row = RAW.find(([id]) => id === r.id);
  return { name: r.name, ...toRegion(row) };
});

/* ===== BLOCK 2 · derived values ======================================================================================== */

/**
 * Adds `rank` (1 = most talents; a suppressed or missing count has no rank) to a list of regions.
 * The map components receive regions through this so the rank is never trusted from the caller.
 */
export const withRanks = (regions) => {
  const ranked = [...regions]
    .filter((r) => typeof r.count === 'number' && r.count >= 5)
    .sort((a, b) => b.count - a.count);
  return regions.map((r) => ({ ...r, rank: ranked.findIndex((x) => x.id === r.id) + 1 || null }));
};

/** The five biggest regions (rank, id, name, count), as the legend's "Top 5 regions" list. */
export const topRegions = (regions, n = 5) =>
  withRanks(regions)
    .filter((r) => r.rank && r.rank <= n)
    .sort((a, b) => a.rank - b.rank);

/* ===== BLOCK 3 · state samples used by the gallery and the frame comparison ============================================ */

/** 8.2.2d "Low-data region": under a narrow filter Upper West has fewer than 5 matching talents (Figma card: "<5 talents"). */
export const MAP_REGIONS_LOW_DATA = MAP_REGIONS_SAMPLE.map((r) =>
  r.id === 'upper-west' ? { ...r, count: 3, trendPct: null, education: null, topInterests: [] } : r
);
