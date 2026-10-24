import { regionById } from '../../regionsList.js';
import { MAP_REGIONS_SAMPLE } from '../../map/data/mapData.js';
import { FILTER_DEFINITIONS, SAMPLE_SPARKLINE, filterOptionLabel } from '../../ui/data/uiData.js';
import { formatGhs, isSuppressed, safeShare } from '../../publicDataFormat.js';

/*
 * overviewData.js — API-shaped mock data of the national overview (Figma 8.2.1a-f, 8.2.3a-d). SAMPLE CONTENT ONLY: every figure is sample data.
 *
 * The future endpoint: GET /public/overview?region=&edu=&interest=&age=&gender=   (absent / empty = all). `getOverview(filters)` below is the
 * mock of that call, written so the response shape is what the endpoint returns:
 *   {
 *     filters, activeFilters: string[], state: 'ok' | 'zero' | 'suppressed',
 *     count,                                     talents matching the filters (a count under 5 is rendered "<5" by the components)
 *     asOf: { label, short },                    "Data as of 17 Oct 2026 · 14:02 GMT" / "17 Oct, 14:02"
 *     hero: { eyebrow, count, label, change, note, noteShort, series },
 *     kpis: { placements, scholarships, partners, today },
 *     regions: [{ id, count, trendPct, education, topInterests }],   the same shape as map/data/mapData.js (count null = no talents here)
 *     interests: { aside, rows: [{ key, label, count }] },
 *     education: [{ key, label, count }],  ages: [{ key, label, count }],  medianAge,
 *     capabilities: [{ key, label, count }],  gender: [{ key, label, count }],
 *     today: [{ key, value, prefix, label, labelShort }]
 *   }
 * Totals stay consistent: the 16 regions of map/data/mapData.js sum to the national 219,428; education / age / gender buckets always sum to the
 * matching count (largest-remainder rounding); every bucket under 5 is left as a raw number here and printed through formatCount() / safeShare()
 * by the components.
 */

/* ===== BLOCK 1 · national figures (Figma 8.2.1a) ====================================================================== */

export const NATIONAL_TALENTS = 219428;
const NATIONAL_NEW_90D = 64120;
const NEW_90D_RATIO = NATIONAL_NEW_90D / NATIONAL_TALENTS;
export const QUARTER_CHANGE_PCT = 42;
export const NATIONAL_PLACEMENTS = 4218;
const NATIONAL_SCHOLARSHIPS_GHS = 2400000;
export const NATIONAL_PARTNERS = 185;

export const DATA_AS_OF = {
  label: 'Data as of 17 Oct 2026 · 14:02 GMT',
  short: 'data as of 17 Oct, 14:02',
};

/** Career-interest clusters, nationally (a talent can pick several, so the rows do not sum to the total). Order = Figma order. */
const NATIONAL_INTERESTS = [
  ['technology', 'Technology', 48320],
  ['business-finance', 'Business & Finance', 36790],
  ['health-medical', 'Health & Medical', 32850],
  ['creative-media', 'Creative & Media', 28120],
  ['education-training', 'Education & Training', 25140],
  ['agriculture-agribusiness', 'Agriculture & Agribusiness', 23210],
  ['engineering-construction', 'Engineering & Construction', 20340],
  ['hospitality-tourism', 'Hospitality & Tourism', 17420],
  ['entrepreneurship', 'Entrepreneurship', 15480],
  ['public-service-policy', 'Public Service & Policy', 11650],
];

const NATIONAL_EDUCATION = [
  ['pre-tertiary', 'Pre-tertiary', 100937],
  ['in-tertiary', 'In-tertiary', 70217],
  ['post-tertiary', 'Post-tertiary', 48274],
];

/** Whole-percent shares (Figma: 18 · 42 · 28 · 12 and 48 · 51 · 1). */
const AGE_BANDS = [
  ['14-17', '14–17', 18, 16],
  ['18-24', '18–24', 42, 21],
  ['25-29', '25–29', 28, 27],
  ['30-35', '30–35', 12, 32],
];
const GENDER_SHARES = [
  ['female', 'Female', 48],
  ['male', 'Male', 51],
  ['not-shared', 'Not shared', 1],
];

const CAPABILITY_LABELS = {
  technical: 'Technical',
  creative: 'Creative',
  analytical: 'Analytical',
  social: 'Social / caring',
  exploring: 'Still exploring',
};
/** Strongest capability shares, nationally (Figma 8.2.1a) and inside Technology (Figma 8.2.1d, where Analytical overtakes Creative). */
const CAPABILITIES_NATIONAL = [
  ['technical', 41],
  ['creative', 22],
  ['analytical', 18],
  ['social', 13],
  ['exploring', 6],
];
const CAPABILITIES_TECHNOLOGY = [
  ['technical', 63],
  ['analytical', 21],
  ['creative', 11],
  ['social', 3],
  ['exploring', 2],
];

/** "Today on GTH" (Figma 8.2.1a): not affected by the filters. */
export const TODAY_STATS = [
  { key: 'signups', value: 328, prefix: '+', label: 'New sign-ups', labelShort: 'Sign-ups' },
  { key: 'assessments', value: 1247, label: 'Assessments taken', labelShort: 'Assessments' },
  { key: 'matches', value: 82, label: 'Matches made', labelShort: 'Matches' },
  { key: 'opportunities', value: 14, label: 'Opportunities posted', labelShort: 'Opportunities' },
];

/* ===== BLOCK 2 · per-region figures (sum to the national totals) ======================================================= */

/** Placements per region: sums to 4,218. Ashanti 812 is drawn in Figma 8.2.3a. */
const PLACEMENTS_BY_REGION = {
  'greater-accra': 780,
  ashanti: 812,
  eastern: 320,
  northern: 290,
  western: 270,
  volta: 262,
  central: 240,
  'upper-east': 215,
  bono: 205,
  'north-east': 170,
  savannah: 140,
  'bono-east': 130,
  'upper-west': 115,
  'western-north': 100,
  oti: 95,
  ahafo: 74,
};

/** Scholarship funding per region in GHS: sums to 2,400,000. Ashanti GHS 410K is drawn in Figma 8.2.3a. */
const SCHOLARSHIPS_BY_REGION = {
  'greater-accra': 540000,
  ashanti: 410000,
  eastern: 190000,
  northern: 180000,
  western: 160000,
  volta: 150000,
  central: 140000,
  'upper-east': 130000,
  bono: 120000,
  'north-east': 90000,
  savannah: 70000,
  'bono-east': 60000,
  'upper-west': 55000,
  'western-north': 45000,
  oti: 35000,
  ahafo: 25000,
};

/** Active partners based in each region: sums to 185. Ashanti 41 and Volta 9 are drawn in Figma. */
const PARTNERS_BY_REGION = {
  'greater-accra': 55,
  ashanti: 41,
  eastern: 14,
  northern: 11,
  western: 9,
  volta: 9,
  central: 10,
  'upper-east': 6,
  bono: 7,
  'north-east': 3,
  savannah: 3,
  'bono-east': 4,
  'upper-west': 5,
  'western-north': 3,
  oti: 3,
  ahafo: 2,
};

/** Partner mix [schools, universities, NGOs, agencies]. Drawn for Ashanti and Volta; the others are split with the national mix (⚠️ sample). */
const PARTNER_MIX_NATIONAL = [127, 34, 18, 6];
const PARTNER_MIX_DRAWN = { ashanti: [28, 7, 5, 1], volta: [6, 0, 2, 1] };

/* ===== BLOCK 3 · drawn sample combinations (Figma 8.2.3a Ashanti, 8.2.1d Volta · Technology · 18–24) ================== */

/** Sub-clusters inside one interest (Figma draws Technology; the other nine are ⚠️ sample content). Weights are shares of the matching talents. */
const SUB_CLUSTERS = {
  technology: [
    ['Software development', 82],
    ['Data & analytics', 54],
    ['Design & UX', 41],
    ['Networking & IT support', 33],
    ['Hardware & electronics', 27],
  ],
  'business-finance': [
    ['Accounting & finance', 30],
    ['Sales & marketing', 27],
    ['Banking & fintech', 20],
    ['Operations & logistics', 14],
    ['Business administration', 9],
  ],
  'health-medical': [
    ['Nursing & midwifery', 31],
    ['Community health', 24],
    ['Pharmacy & lab science', 20],
    ['Public health', 15],
    ['Medical technology', 10],
  ],
  'creative-media': [
    ['Graphic design', 28],
    ['Video & film', 24],
    ['Music & audio', 20],
    ['Writing & content', 16],
    ['Photography', 12],
  ],
  'education-training': [
    ['Teaching', 38],
    ['Early childhood', 22],
    ['Tutoring & coaching', 18],
    ['Curriculum & e-learning', 12],
    ['Special needs support', 10],
  ],
  'agriculture-agribusiness': [
    ['Crop farming', 34],
    ['Agri-processing', 22],
    ['Livestock & poultry', 20],
    ['Agri-tech', 14],
    ['Farm supply & trade', 10],
  ],
  'engineering-construction': [
    ['Civil & construction', 32],
    ['Electrical', 24],
    ['Mechanical', 20],
    ['Renewable energy', 14],
    ['Surveying & planning', 10],
  ],
  'hospitality-tourism': [
    ['Hotels & lodging', 30],
    ['Food & catering', 28],
    ['Tour guiding', 18],
    ['Events', 14],
    ['Travel services', 10],
  ],
  entrepreneurship: [
    ['Starting a business', 36],
    ['Small-shop retail', 24],
    ['Trades & services', 18],
    ['Online selling', 14],
    ['Social enterprise', 8],
  ],
  'public-service-policy': [
    ['Public administration', 34],
    ['Policy & research', 24],
    ['Community development', 20],
    ['Law & governance', 14],
    ['Civic participation', 8],
  ],
};

/**
 * Combinations the Figma frames draw with exact numbers. Everything else is computed by the model below.
 * key = `${region}|${edu}|${interest}|${age}|${gender}`.
 */
const DRAWN = {
  'ashanti||||': {
    new90d: 9870,
    education: [16958, 13104, 8478],
    interests: [8120, 6930, 5860, 4410, 3920, 3550, 2870, 1610, 1010, 260],
  },
  'volta||technology|18-24|': {
    count: 237,
    new90d: 31,
    placements: 11,
    scholarshipsGhs: 18000,
    education: [90, 104, 43],
    gender: [97, 137, 3],
  },
};

/* ===== BLOCK 4 · the model ============================================================================================ */

/** Largest-remainder rounding: integer parts that add up to `total` exactly. */
const apportion = (total, weights) => {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const exact = weights.map((w) => (total * w) / sum);
  const floors = exact.map(Math.floor);
  let left = total - floors.reduce((a, b) => a + b, 0);
  exact
    .map((v, i) => [v - Math.floor(v), i])
    .sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => {
      if (left > 0) {
        floors[i] += 1;
        left -= 1;
      }
    });
  return floors;
};

const normalise = (filters = {}) => ({
  region: regionById(filters.region) ? filters.region : '',
  edu: NATIONAL_EDUCATION.some(([id]) => id === filters.edu) ? filters.edu : '',
  interest: NATIONAL_INTERESTS.some(([id]) => id === filters.interest) ? filters.interest : '',
  age: AGE_BANDS.some(([id]) => id === filters.age) ? filters.age : '',
  gender: GENDER_SHARES.some(([id]) => id === filters.gender) ? filters.gender : '',
});

const REGION_BY_ID = Object.fromEntries(MAP_REGIONS_SAMPLE.map((r) => [r.id, r]));

const pluralise = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const partnerParts = (id) => {
  const mix = PARTNER_MIX_DRAWN[id] ?? apportion(PARTNERS_BY_REGION[id], PARTNER_MIX_NATIONAL);
  return mix;
};

const partnersSentence = (id, suffix = '') => {
  if (!id) return '127 schools · 34 universities · 18 NGOs · 6 government agencies.';
  const [s, u, n, a] = partnerParts(id);
  const parts = [
    s && pluralise(s, 'school', 'schools'),
    u && pluralise(u, 'university', 'universities'),
    n && (n === 1 ? '1 NGO' : `${n} NGOs`),
    a && pluralise(a, 'agency', 'agencies'),
  ].filter(Boolean);
  return `${parts.join(' · ')}${suffix}.`;
};

const partnersShort = (id) => {
  if (!id) return '127 schools · 34 unis · 24 other';
  const [s, u, n, a] = partnerParts(id);
  return `${s} schools · ${u} unis · ${n + a} other`;
};

const interestShort = (id) =>
  id === 'technology'
    ? 'tech'
    : (filterOptionLabel('interest', id) ?? '').split(/[ &]/)[0].toLowerCase();

const upperK = (ghs) => formatGhs(ghs).replace(/k$/, 'K');

/** Mock of GET /public/overview. Pure and synchronous; the page wraps it in a hook that also models loading / error. */
export const getOverview = (rawFilters) => {
  const filters = normalise(rawFilters);
  const activeFilters = Object.keys(filters).filter((k) => filters[k]);
  const key = ['region', 'edu', 'interest', 'age', 'gender'].map((k) => filters[k]).join('|');
  const drawn = DRAWN[key] ?? null;
  const region = filters.region ? REGION_BY_ID[filters.region] : null;
  const regionName = region ? regionById(region.id).name : null;

  /* --- count ------------------------------------------------------------ */
  const base = region ? region.count : NATIONAL_TALENTS;
  const eduRows = region
    ? [region.education.pre, region.education.in, region.education.post]
    : NATIONAL_EDUCATION.map((e) => e[2]);
  const eduTotal = eduRows.reduce((a, b) => a + b, 0);
  const eduIndex = NATIONAL_EDUCATION.findIndex(([id]) => id === filters.edu);
  const interestRow = NATIONAL_INTERESTS.find(([id]) => id === filters.interest);
  const ageRow = AGE_BANDS.find(([id]) => id === filters.age);
  const genderRow = GENDER_SHARES.find(([id]) => id === filters.gender);
  const product =
    base *
    (eduIndex >= 0 ? eduRows[eduIndex] / eduTotal : 1) *
    (interestRow ? interestRow[2] / NATIONAL_TALENTS : 1) *
    (ageRow ? ageRow[2] / 100 : 1) *
    (genderRow ? genderRow[2] / 100 : 1);
  const count = drawn?.count ?? Math.round(product);
  const state = count === 0 ? 'zero' : isSuppressed(count) ? 'suppressed' : 'ok';
  const share = base ? count / base : 0;

  const asOf = DATA_AS_OF;
  const base_ = { filters, activeFilters, count, state, asOf };
  if (state !== 'ok') return base_;

  /* --- hero ------------------------------------------------------------- */
  const others = activeFilters.filter((k) => k !== 'region');
  const eyebrow = !activeFilters.length
    ? 'Total registered talents'
    : others.length
      ? 'Talents matching filters'
      : `Talents in ${regionName}`;
  const new90d = drawn?.new90d ?? Math.round(count * NEW_90D_RATIO);
  const hero = {
    eyebrow,
    count,
    label: 'Ghanaian talents, discovered.',
    change: { pct: QUARTER_CHANGE_PCT, suffix: 'vs last quarter' },
    note: `+${new Intl.NumberFormat('en-GH').format(new90d)} in the last 90 days`,
    noteShort: `+${new Intl.NumberFormat('en-GH').format(new90d)} in 90 days`,
    series: SAMPLE_SPARKLINE,
  };

  /* --- KPIs ------------------------------------------------------------- */
  const regionPlacements = region ? PLACEMENTS_BY_REGION[region.id] : NATIONAL_PLACEMENTS;
  const regionGhs = region ? SCHOLARSHIPS_BY_REGION[region.id] : NATIONAL_SCHOLARSHIPS_GHS;
  const placementsCount = drawn?.placements ?? Math.round(regionPlacements * share);
  const ghs =
    drawn?.scholarshipsGhs ??
    (others.length ? Math.round((regionGhs * share) / 1000) * 1000 : regionGhs);
  const partnersCount = region ? PARTNERS_BY_REGION[region.id] : NATIONAL_PARTNERS;
  const kpis = {
    placements: {
      count: placementsCount,
      sub: filters.interest
        ? `Matched into ${interestShort(filters.interest)} jobs, internships and training.`
        : region
          ? `${regionName} talents placed into jobs, internships and training.`
          : 'Talents matched into jobs, internships and training through GTH.',
      subShort: 'Jobs, internships, training',
    },
    scholarships: {
      value: upperK(ghs),
      sub: others.length
        ? 'Funding matched to this group in 12 months.'
        : region
          ? `Funding matched to eligible ${regionName} talents in 12 months.`
          : 'Funding matched to eligible talents in the last 12 months.',
      subShort: 'Last 12 months',
    },
    partners: {
      count: partnersCount,
      sub: partnersSentence(region?.id, region && others.length ? ` in ${regionName}` : ''),
      subShort: partnersShort(region?.id),
    },
    today: { value: '+328', sub: 'New sign-ups' },
  };

  /* --- regions (the map) ------------------------------------------------ */
  const regions = MAP_REGIONS_SAMPLE.map((r) => {
    if (region) {
      return r.id === region.id
        ? { ...r, count, education: null, topInterests: r.topInterests }
        : { ...r, count: null, trendPct: null, education: null, topInterests: [] };
    }
    if (!activeFilters.length) return r;
    return { ...r, count: Math.round(r.count * share), education: null };
  });

  /* --- interests -------------------------------------------------------- */
  let interests;
  if (interestRow) {
    const subs = SUB_CLUSTERS[interestRow[0]];
    const counts = drawn
      ? [82, 54, 41, 33, 27]
      : apportion(
          count,
          subs.map((s) => s[1])
        );
    interests = {
      aside: `Within ${interestRow[1]} · talents`,
      rows: subs.map(([label], i) => ({ key: label, label, count: counts[i] })),
    };
  } else {
    interests = {
      aside: 'Top 10 clusters · talents',
      rows: NATIONAL_INTERESTS.map(([id, label, n], i) => ({
        key: id,
        label,
        count: drawn?.interests ? drawn.interests[i] : Math.round(n * (count / NATIONAL_TALENTS)),
      })),
    };
  }

  /* --- composition ------------------------------------------------------ */
  const educationCounts =
    eduIndex >= 0
      ? NATIONAL_EDUCATION.map((_, i) => (i === eduIndex ? count : 0))
      : (drawn?.education ?? apportion(count, eduRows));
  const education = NATIONAL_EDUCATION.map(([id, label], i) => ({
    key: id,
    label,
    count: educationCounts[i],
  }));

  const ageCounts = ageRow
    ? AGE_BANDS.map(([id]) => (id === ageRow[0] ? count : 0))
    : apportion(
        count,
        AGE_BANDS.map((b) => b[2])
      );
  const ages = AGE_BANDS.map(([id, label], i) => ({ key: id, label, count: ageCounts[i] }));
  const medianAge = ageRow ? ageRow[3] : 21;

  const capList =
    filters.interest === 'technology' ? CAPABILITIES_TECHNOLOGY : CAPABILITIES_NATIONAL;
  const capCounts = apportion(
    count,
    capList.map((c) => c[1])
  );
  const capabilities = capList.map(([id], i) => ({
    key: id,
    label: CAPABILITY_LABELS[id],
    count: capCounts[i],
  }));

  const genderCounts = genderRow
    ? GENDER_SHARES.map(([id]) => (id === genderRow[0] ? count : 0))
    : (drawn?.gender ??
      apportion(
        count,
        GENDER_SHARES.map((g) => g[2])
      ));
  const gender = GENDER_SHARES.map(([id, label], i) => ({
    key: id,
    label,
    count: genderCounts[i],
  }));

  return {
    ...base_,
    hero,
    kpis,
    regions,
    interests,
    education,
    ages,
    medianAge,
    capabilities,
    gender,
    today: TODAY_STATS,
  };
};

/** Share of a capability row printed as a percentage (a group under 5 people reads "<5"). */
export const capabilityValueText = (count, total) => {
  const pct = safeShare(count, total);
  return pct === null ? '<5' : `${pct}%`;
};

/* ===== BLOCK 5 · filter helpers shared by the page and the sheet ====================================================== */

/** "Volta · Technology · 18–24": the label of the active filters (used by the map hint, Figma 8489:346399 style). */
export const filtersLabel = (filters) =>
  FILTER_DEFINITIONS.map((d) =>
    filters?.[d.key] ? filterOptionLabel(d.key, filters[d.key]) : null
  )
    .filter(Boolean)
    .join(' · ');

/* ===== BLOCK 6 · the four map frames (?map=hover|pinned|keyboard|low-data&at=<region id>) ============================== */

/** The filter hint the low-data frame draws in the card header (Figma 8489:346399). */
const LOW_DATA_FILTER_LABEL = 'Filtered · Public Service · 30–35';
/** Region each frame draws when ?at= is absent (8.2.2a Ashanti · 8.2.2b Greater Accra · 8.2.2c Eastern · 8.2.2d Upper West). */
const MAP_FRAME_DEFAULTS = {
  hover: 'ashanti',
  pinned: 'greater-accra',
  keyboard: 'eastern',
  'low-data': 'upper-west',
};
/** Hover card anchor of 8.2.2a inside the 400x584 map box (the card's top-left is at 166/355 in the frame; the card sits 18px right of and 50px above the pointer). */
const HOVER_POINTER = { x: 148, y: 405 };

/** { regions, forced, filterLabel } for the RegionalMapCard of a forced frame state; the live state (no ?map=) passes everything through. */
export const mapStateFor = (map, at, regions) => {
  if (!MAP_FRAME_DEFAULTS[map]) return { regions, forced: undefined, filterLabel: undefined };
  const id = regionById(at) ? at : MAP_FRAME_DEFAULTS[map];
  if (map === 'low-data') {
    return {
      regions: regions.map((r) =>
        r.id === id ? { ...r, count: 3, trendPct: null, education: null, topInterests: [] } : r
      ),
      forced: { active: { id, mode: 'hover' } },
      filterLabel: LOW_DATA_FILTER_LABEL,
    };
  }
  if (map === 'keyboard') return { regions, forced: { active: { id, mode: 'keyboard' } } };
  if (map === 'pinned') return { regions, forced: { active: { id, mode: 'hover' }, pinnedId: id } };
  return { regions, forced: { active: { id, mode: 'hover' }, pointerAt: HOVER_POINTER } };
};
