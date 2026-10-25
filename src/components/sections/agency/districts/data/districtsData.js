import { getRegion } from '../../../publicData/regions/data/regionsData.js';
import { REGIONS } from '../../../publicData/regionsList.js';

/*
 * districtsData.js — mock API for the agency Districts list (Figma 11.4.2s, frame 9394:19326). Shaped like the future payload:
 *   GET /agency/districts?region=&sort=&q=&page=&pageSize=  ->  { summary, items, total, page, pages, pageSize, hidden, scope }
 *   GET /agency/districts/regions                           ->  region chips + select options
 *
 * What is drawn (Figma): the top 12 rows (name, region, talents, 30-day change, assessment %, placements), the chips "All · 261" … "Upper West · 11",
 * the four tiles (248 of 261 · Tamale Metro +12% · Ho Municipal 78% vs 61% national · 13 districts hidden), "Showing 1–12 of 248", 21 pages.
 * ⚠️ ASSUMPTION (everything below the 12th row): the remaining 236 visible districts. Real district names where theme 8's regionsData lists
 *   them, otherwise "<Region> District NN"; talents fall off smoothly from 1,380 to ~28 so row 13+ never outranks the drawn rows; change,
 *   assessment and placements come from a stable hash of the id (assessment <= 76 and change <= 10 keep the drawn "best / fastest" tiles true).
 * ⚠️ ASSUMPTION: which regions hide the 13 districts under 5 talents (HIDDEN_BY_REGION); the district total per region is regionsData's districtsTotal
 *   (they add up to the 261 of the hero). Hidden districts are never rows: only their count is exposed (privacy rule, counts under 5 are suppressed).
 * ⚠️ ASSUMPTION: sort options other than "Most talents" (growth, assessment, placements, name) — Figma draws only the closed select.
 */

export const PAGE_SIZE = 12;
export const NATIONAL_ASSESSMENT_DRAWN = 61; // "78% vs 61% national" (Figma; regionsData's own national figure is 54)
export const UPDATED_AT = 'updated today 06:00';

export const SORTS = [
  { id: 'talents', label: 'Most talents' },
  { id: 'growth', label: 'Fastest growing' },
  { id: 'assessment', label: 'Best assessment' },
  { id: 'placements', label: 'Most placements' },
  { id: 'name', label: 'Name A–Z' },
];
export const DEFAULT_SORT = 'talents';

export const VIEWS = [
  { id: 'table', label: 'Table' },
  { id: 'map', label: 'Map' },
];

// The ten region chips Figma draws, in its order. The other six regions are reachable from the "All regions" select.
export const CHIP_REGION_IDS = [
  'greater-accra',
  'ashanti',
  'northern',
  'eastern',
  'central',
  'western',
  'volta',
  'bono',
  'upper-east',
  'upper-west',
];

const HIDDEN_BY_REGION = {
  'north-east': 3,
  savannah: 2,
  ahafo: 2,
  oti: 2,
  'western-north': 2,
  'upper-west': 1,
  'bono-east': 1,
};

// [name, regionId, talents, change %, assessment %, placements, district id on the detail page (regionsData)]
const DRAWN = [
  ['Accra Metro', 'greater-accra', 11840, 4, 64, 310, 'accra-metro'],
  ['Kumasi Metro', 'ashanti', 10920, 5, 61, 284, 'kumasi-metropolitan'],
  ['Tema Metro', 'greater-accra', 6410, 3, 66, 198, 'tema-metro'],
  ['Tamale Metro', 'northern', 5880, 12, 52, 141, 'tamale-metropolitan'],
  ['Sekondi-Takoradi Metro', 'western', 4760, 6, 59, 132, 'sekondi-takoradi-metropolitan'],
  ['Cape Coast Metro', 'central', 4120, 4, 71, 118, 'cape-coast-metropolitan'],
  ['Ho Municipal', 'volta', 3340, 7, 78, 96, 'ho-municipal'],
  ['Sunyani Municipal', 'bono', 2980, 2, 63, 74, 'sunyani-municipal'],
  ['New Juaben South', 'eastern', 2760, 3, 60, 70, 'new-juaben-south'],
  ['Wa Municipal', 'upper-west', 1640, 9, 48, 31, 'wa-municipal'],
  ['Bolgatanga Municipal', 'upper-east', 1520, 8, 50, 29, 'bolgatanga-municipal'],
  ['Techiman Municipal', 'bono-east', 1410, -1, 55, 33, 'techiman-municipal'],
];

const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const REGION_NAME = Object.fromEntries(REGIONS.map((r) => [r.id, r.name]));

const build = () => {
  const drawnRows = DRAWN.map(
    ([name, regionId, talents, changePct, assessmentPct, placements, id]) => ({
      id,
      name,
      regionId,
      regionName: REGION_NAME[regionId],
      talents,
      changePct,
      assessmentPct,
      placements,
    })
  );
  const drawnIds = new Set(drawnRows.map((d) => d.id));
  const pool = [];
  const hiddenTotals = {};
  REGIONS.forEach((r) => {
    const region = getRegion(r.id);
    const hidden = HIDDEN_BY_REGION[r.id] ?? 0;
    hiddenTotals[r.id] = { total: region.districtsTotal, hidden };
    const visible = region.districtsTotal - hidden;
    const have = drawnRows.filter((d) => d.regionId === r.id).length;
    const names = region.districts
      .filter((d) => !drawnIds.has(d.id) && !DRAWN.some((x) => x[6] === d.id))
      .map((d) => ({ id: d.id, name: d.name }));
    for (let n = names.length + have + 1; names.length + have < visible; n += 1) {
      const nn = String(n).padStart(2, '0');
      names.push({ id: `${r.id}-district-${nn}`, name: `${r.name} District ${nn}` });
    }
    names.slice(0, visible - have).forEach((d) => pool.push({ ...d, regionId: r.id }));
  });
  pool.sort((a, b) => hash(a.id) - hash(b.id));
  const rest = pool.map((d, i) => {
    const h = hash(`${d.id}:x`);
    const talents = Math.round(1380 * Math.exp(-i * 0.0166));
    return {
      id: d.id,
      name: d.name,
      regionId: d.regionId,
      regionName: REGION_NAME[d.regionId],
      talents,
      changePct: (h % 13) - 2,
      assessmentPct: 38 + (h % 39),
      placements: Math.max(1, Math.round(talents * (0.02 + ((h >> 5) % 15) / 1000))),
    };
  });
  const all = [...drawnRows, ...rest];
  // Detail links: only districts the detail page knows; every other row opens its region page.
  return {
    all: all.map((d) => ({
      ...d,
      to: getDistrictSafe(d.regionId, d.id)
        ? `/agency/regions/${d.regionId}/districts/${d.id}`
        : `/agency/regions/${d.regionId}`,
    })),
    hiddenTotals,
  };
};

function getDistrictSafe(regionId, districtId) {
  const region = getRegion(regionId);
  return Boolean(region?.districts.some((d) => d.id === districtId));
}

const { all: ALL, hiddenTotals: SCOPES } = build();

const matchRegion = (region) => (region && SCOPES[region] ? region : null);

const SORTERS = {
  talents: (a, b) => b.talents - a.talents,
  growth: (a, b) => b.changePct - a.changePct || b.talents - a.talents,
  assessment: (a, b) => b.assessmentPct - a.assessmentPct || b.talents - a.talents,
  placements: (a, b) => b.placements - a.placements || b.talents - a.talents,
  name: (a, b) => a.name.localeCompare(b.name),
};

/** Chips + select options: id, name, districts (including the hidden ones, as "Greater Accra · 29" draws). */
export const getDistrictRegions = () => ({
  total: Object.values(SCOPES).reduce((s, r) => s + r.total, 0),
  regions: REGIONS.map((r) => ({ id: r.id, name: r.name, districts: SCOPES[r.id].total })),
});

/** GET /agency/districts — see the header for the shape. `q` matches district and region names. */
export const getDistricts = ({
  region = null,
  sort = DEFAULT_SORT,
  q = '',
  page = 1,
  pageSize = PAGE_SIZE,
} = {}) => {
  const regionId = matchRegion(region);
  const inScope = ALL.filter((d) => !regionId || d.regionId === regionId);
  const scopeTotals = regionId
    ? SCOPES[regionId]
    : {
        total: Object.values(SCOPES).reduce((s, r) => s + r.total, 0),
        hidden: Object.values(SCOPES).reduce((s, r) => s + r.hidden, 0),
      };
  const byTalents = [...inScope].sort(SORTERS.talents);
  const fastest = [...inScope].sort(SORTERS.growth)[0] ?? null;
  const best = [...inScope].sort(SORTERS.assessment)[0] ?? null;
  const needle = q.trim().toLowerCase();
  const matched = (
    needle
      ? inScope.filter(
          (d) =>
            d.name.toLowerCase().includes(needle) || d.regionName.toLowerCase().includes(needle)
        )
      : inScope
  ).sort(SORTERS[sort] ?? SORTERS.talents);
  // rank = position by talents in scope, whatever the sort (the "#" column of the drawn table is the talents rank)
  const rankOf = new Map(byTalents.map((d, i) => [d.id, i + 1]));
  const pages = Math.max(1, Math.ceil(matched.length / pageSize));
  const current = Math.min(Math.max(1, Math.floor(Number(page)) || 1), pages);
  const start = (current - 1) * pageSize;
  return {
    scope: { regionId, regionName: regionId ? REGION_NAME[regionId] : null },
    summary: {
      withTalents: inScope.length,
      of: scopeTotals.total,
      hidden: scopeTotals.hidden,
      fastest: fastest && { name: fastest.name, changePct: fastest.changePct },
      best: best && { name: best.name, assessmentPct: best.assessmentPct },
      nationalAssessment: NATIONAL_ASSESSMENT_DRAWN,
    },
    items: matched.slice(start, start + pageSize).map((d) => ({ ...d, rank: rankOf.get(d.id) })),
    total: matched.length,
    hidden: scopeTotals.hidden,
    page: current,
    pages,
    pageSize,
    from: matched.length ? start + 1 : 0,
    to: Math.min(matched.length, start + pageSize),
  };
};

/** Per-region totals for the map view: [{ id, count, trendPct }] (visible districts only). */
export const getRegionTotals = () =>
  REGIONS.map((r) => {
    const rows = ALL.filter((d) => d.regionId === r.id);
    const count = rows.reduce((s, d) => s + d.talents, 0);
    const trend = rows.length ? rows.reduce((s, d) => s + d.changePct, 0) / rows.length : 0;
    return { id: r.id, name: r.name, count, trendPct: Math.round(trend) };
  });

/** CSV of the current filter (every page, not just the one on screen): the "Download CSV" mock. */
export const districtsCsv = (params) => {
  const { items } = getDistricts({ ...params, page: 1, pageSize: 100000 });
  const head = [
    'Rank',
    'District',
    'Region',
    'Talents',
    '30-day change %',
    'Assessment %',
    'Placements',
  ];
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  return [
    head,
    ...items.map((d) => [
      d.rank,
      d.name,
      d.regionName,
      d.talents,
      d.changePct,
      d.assessmentPct,
      d.placements,
    ]),
  ]
    .map((r) => r.map(esc).join(','))
    .join('\n');
};
