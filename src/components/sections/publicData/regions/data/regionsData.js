import { REGIONS, regionById } from '../../regionsList.js';
import { MAP_REGIONS_SAMPLE } from '../../map/data/mapData.js';

/*
 * regionsData.js — API-shaped mock data of the region, district and compare pages (Theme 8 public dashboards; every figure is sample data).
 *
 * Endpoints this module stands in for (anonymous, read-only, aggregated; counts under 5 are rendered "<5" by the components, never here):
 *   GET /public/regions/:id                       → getRegion(id)
 *   GET /public/regions/:id/districts/:districtId → getDistrict(regionId, districtId)
 *   GET /public/compare?regions=a,b[,c]           → getCompare(ids)
 *
 * Source of the numbers: the Figma data sheet "8.3.1e One template, 16 regions" (8495:347797) gives, per region, the talent count, the rank
 * and the national share; map/data/mapData.js was derived from the same sheet, so the counts are read from there (Greater Accra 42,310 …).
 * Everything the sheet does not give is drawn only for Greater Accra (8493:9), Ashanti and Northern (compare 8495:2187) and Accra Metro
 * (8494:2009); the rest is ⚠️ ASSUMPTION sample data, generated deterministically below (marked per block).
 *
 * Figma inconsistencies kept (reported): Greater Accra says "29 districts" / "Top 10 of 29" but draws, lists and links 14 ("View all 14
 * districts"); the Oti low-data page says "42 talents" while the sheet says 5,210 (the low-data screen is a forced state, ?state=low-data);
 * GA is "#5 for 30-day growth" but +6% ranks lower than that against the map's trends; Northern grows +12% in the compare frame, +9% on the map.
 */

/* ===== BLOCK 1 · the 16 regions: sheet + profile ======================================================================== */

export const NATIONAL_TALENTS = 219428;
export const NATIONAL_ASSESSMENT = 54;
export const DATA_AS_OF = '17 Oct 2026 · 14:02 GMT';

// ⚠️ ASSUMPTION (except Greater Accra, Oti, Ashanti, Northern which are drawn): capital, district total, assessment completion %,
// placements, active partners, strongest-capability split, gender split. Order = regionsList.js.
const PROFILE = {
  'greater-accra': {
    capital: 'Accra',
    districts: 29,
    assessment: 61,
    placements: 1020,
    partners: 68,
  },
  ashanti: { capital: 'Kumasi', districts: 43, assessment: 58, placements: 812, partners: 41 },
  eastern: { capital: 'Koforidua', districts: 33, assessment: 55, placements: 1070, partners: 30 },
  northern: { capital: 'Tamale', districts: 16, assessment: 47, placements: 214, partners: 19 },
  western: {
    capital: 'Sekondi-Takoradi',
    districts: 14,
    assessment: 56,
    placements: 150,
    partners: 22,
  },
  volta: { capital: 'Ho', districts: 18, assessment: 62, placements: 150, partners: 20 },
  central: { capital: 'Cape Coast', districts: 22, assessment: 66, placements: 190, partners: 24 },
  'upper-east': {
    capital: 'Bolgatanga',
    districts: 15,
    assessment: 53,
    placements: 110,
    partners: 14,
  },
  bono: { capital: 'Sunyani', districts: 12, assessment: 54, placements: 100, partners: 15 },
  'north-east': { capital: 'Nalerigu', districts: 6, assessment: 45, placements: 80, partners: 8 },
  savannah: { capital: 'Damongo', districts: 7, assessment: 49, placements: 74, partners: 7 },
  'bono-east': { capital: 'Techiman', districts: 11, assessment: 50, placements: 70, partners: 9 },
  'upper-west': { capital: 'Wa', districts: 11, assessment: 48, placements: 60, partners: 9 },
  'western-north': {
    capital: 'Sefwi Wiawso',
    districts: 9,
    assessment: 51,
    placements: 56,
    partners: 8,
  },
  oti: { capital: 'Dambai', districts: 9, assessment: 44, placements: 38, partners: 5 },
  ahafo: { capital: 'Goaso', districts: 6, assessment: 52, placements: 24, partners: 4 },
};

// Drawn for Greater Accra (8493:1913 / 8493:1941 / 8500:350946 / 8493:1989), Ashanti and Northern (compare 8495:2187); the rest ⚠️ ASSUMPTION.
const COMPOSITION = {
  'greater-accra': {
    edu: [39, 34, 27],
    age: [15, 41, 31, 13],
    caps: [46, 24, 17, 9, 4],
    gender: [49, 50, 1],
  },
  ashanti: {
    edu: [44, 34, 22],
    age: [19, 42, 27, 12],
    caps: [41, 27, 18, 10, 4],
    gender: [50, 49, 1],
  },
  northern: {
    edu: [57, 29, 14],
    age: [24, 44, 22, 10],
    caps: [33, 18, 21, 19, 9],
    gender: [47, 52, 1],
  },
};

const AGE_BASE = [18, 42, 28, 12];
const CAPS_BASE = [34, 22, 20, 15, 9];

// The 3 strongest interests with counts: drawn for Greater Accra, Ashanti, Northern (compare); the others use the map's top interests
// (names mapped to the long names of the compare frame) with counts that fall off from the region total (⚠️ ASSUMPTION).
const INTEREST_LONG = {
  Business: 'Business & Finance',
  Health: 'Health & Medical',
  Creative: 'Creative & Media',
  Education: 'Education & Training',
};
const INTERESTS_DRAWN = {
  'greater-accra': [
    ['Technology', 11240],
    ['Business & Finance', 8930],
    ['Creative & Media', 6410],
  ],
  ashanti: [
    ['Technology', 8120],
    ['Business & Finance', 6930],
    ['Health & Medical', 5860],
  ],
  northern: [
    ['Agriculture', 3920],
    ['Health & Medical', 2610],
    ['Education & Training', 2140],
  ],
};

// Trend of the last 30 days (%): the map's value, except Northern (+12% in the compare frame).
const TREND_OVERRIDE = { northern: 12 };

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const normalise = (parts) => {
  const total = parts.reduce((a, b) => a + b, 0);
  const out = parts.map((p) => Math.round((p / total) * 100));
  out[0] += 100 - out.reduce((a, b) => a + b, 0);
  return out;
};

/** Deterministic wobble in [-1, 1] from a string, so generated numbers are stable between renders. */
const wobble = (key, salt = 0) => {
  let h = 7 + salt * 13;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) % 9973;
  return ((h % 200) - 100) / 100;
};

const composeFor = (id, edu) => {
  if (COMPOSITION[id]) return COMPOSITION[id];
  const w = wobble(id);
  const age = normalise(AGE_BASE.map((v, i) => v + Math.round(wobble(id, i + 1) * 3)));
  const caps = normalise(CAPS_BASE.map((v, i) => v + Math.round(wobble(id, i + 6) * 4)));
  return {
    edu,
    age,
    caps,
    gender: [49 + Math.round(w), 50 - Math.round(w), 1],
  };
};

const sparkFor = (id, trendPct) => {
  // 12 weekly points rising with the 30-day trend (⚠️ ASSUMPTION: the series is not in the sheet).
  const slope = Math.max(trendPct, 1);
  return Array.from({ length: 12 }, (_, i) => {
    const base = 100 + (i * slope) / 2.4;
    return Math.round((base + wobble(id, i) * 1.2) * 10) / 10;
  });
};

/* ===== BLOCK 2 · derived region records ================================================================================ */

const SHEET_ORDER = [...MAP_REGIONS_SAMPLE].sort((a, b) => b.count - a.count).map((r) => r.id);

const rankOf = (id, field) => {
  const sorted = [...REGIONS]
    .map((r) => ({ id: r.id, v: field(r.id) }))
    .sort((a, b) => b.v - a.v || SHEET_ORDER.indexOf(a.id) - SHEET_ORDER.indexOf(b.id));
  return sorted.findIndex((r) => r.id === id) + 1;
};

const trendOf = (id) => TREND_OVERRIDE[id] ?? MAP_REGIONS_SAMPLE.find((r) => r.id === id).trendPct;
const countOf = (id) => MAP_REGIONS_SAMPLE.find((r) => r.id === id).count;
const totalPlacements = REGIONS.reduce((n, r) => n + PROFILE[r.id].placements, 0);

const partnerTiles = (partners, id) => {
  if (id === 'greater-accra') return [28, 12, 9, 4, 15];
  const parts = [0.4, 0.17, 0.13, 0.06, 0.24].map((p) => Math.round(partners * p));
  parts[0] += partners - parts.reduce((a, b) => a + b, 0);
  return parts;
};

const PARTNER_KINDS = ['Schools', 'Universities', 'NGOs', 'Gov. agencies', 'Employers'];

const buildRegion = (listed) => {
  const { id, name } = listed;
  const map = MAP_REGIONS_SAMPLE.find((r) => r.id === id);
  const p = PROFILE[id];
  const count = countOf(id);
  const trendPct = trendOf(id);
  const comp = composeFor(id, [
    Math.round((map.education.pre / count) * 100),
    Math.round((map.education.in / count) * 100),
    Math.round((map.education.post / count) * 100),
  ]);
  const interests =
    INTERESTS_DRAWN[id] ??
    map.topInterests.map((t, i) => [
      INTEREST_LONG[t] ?? t,
      Math.round(count * [0.27, 0.2, 0.15][i]),
    ]);
  const rank = rankOf(id, countOf);
  const placeShare = Math.round((p.placements / totalPlacements) * 100);
  const delta = id === 'greater-accra' ? 2410 : Math.round(count - count / (1 + trendPct / 100));
  return {
    id,
    name,
    capital: p.capital,
    districtsTotal: p.districts,
    talents: count,
    rank,
    ofRegions: REGIONS.length,
    sharePct: Math.round((count / NATIONAL_TALENTS) * 1000) / 10,
    sharePctLabel: `${((count / NATIONAL_TALENTS) * 100).toFixed(1)}%`,
    trendPct,
    deltaLast30: delta,
    series: sparkFor(id, trendPct),
    assessmentPct: p.assessment,
    placements: p.placements,
    placementsSharePct: placeShare,
    partners: p.partners,
    ranks: {
      registrations: rank,
      assessment: rankOf(id, (r) => PROFILE[r].assessment),
      placements: rankOf(id, (r) => PROFILE[r].placements),
      // Figma draws "#5 for 30-day growth" for Greater Accra (see the header note); the others are computed.
      growth: id === 'greater-accra' ? 5 : rankOf(id, trendOf),
    },
    education: comp.edu,
    ageShares: comp.age,
    capabilityShares: comp.caps,
    genderShares: comp.gender,
    interests,
    partnerCounts: partnerTiles(p.partners, id),
    // The "low-data" screen (8.3.1c) is drawn for Oti with these numbers; any other region forced into it uses the same sample (⚠️ ASSUMPTION).
    lowData: { talents: 42, joined: 17, partners: 3 },
  };
};

export const REGION_RECORDS = REGIONS.map(buildRegion);

export const NATIONAL_EDUCATION = [46, 32, 22]; // "National" bar of the Education card (8493:1921, widths 176 : 123 : 84)

/* ===== BLOCK 3 · districts ============================================================================================ */

// Greater Accra's 14 drawn districts: [name, capital, talents, 30-day change %, zoom-map marker {x, y, d} (top-left, relative to the 652x420
// "zoom map" frame 8493:1785), label top-left or null]. Talents and rank order are the district table of 8493:9 (top 10); the last four are
// ⚠️ ASSUMPTION (not drawn in the table): Ningo-Prampram, Shai-Osudoku, Ada East, Ada West (38: the low-data example 8494:2390).
const GA_DISTRICTS = [
  ['Accra Metro', 'Accra', 11840, 4, { x: 166, y: 276, d: 44 }, { x: 214, y: 291 }],
  ['Tema Metro', 'Tema', 5920, 7, { x: 254, y: 230, d: 35 }, { x: 293, y: 240 }],
  ['Ga East', 'Abokobi', 3410, 9, { x: 178, y: 205, d: 29 }, null],
  ['Ga West', 'Amasaman', 3080, 6, { x: 128, y: 219, d: 28 }, { x: 161, y: 227 }],
  ['Ga South', 'Weija', 2760, 5, { x: 115, y: 284, d: 27 }, null],
  ['Adentan', 'Adenta', 2540, 8, { x: 193, y: 215, d: 27 }, null],
  ['Ashaiman', 'Ashaiman', 2310, 3, { x: 252, y: 225, d: 26 }, null],
  ['La Nkwantanang-Madina', 'Madina', 2280, 5, { x: 189, y: 230, d: 26 }, null],
  ['Ledzokuku', 'Teshie', 1960, 2, { x: 221, y: 276, d: 25 }, null],
  ['Kpone-Katamanso', 'Kpone', 1720, 11, { x: 294, y: 226, d: 24 }, { x: 323, y: 231 }],
  ['Ningo-Prampram', 'Prampram', 1150, 6, { x: 318, y: 218, d: 22 }, null],
  ['Shai-Osudoku', 'Dodowa', 940, 5, { x: 241, y: 150, d: 21 }, { x: 266, y: 153 }],
  ['Ada East', 'Ada Foah', 620, 4, { x: 556, y: 182, d: 20 }, { x: 580, y: 185 }],
  ['Ada West', 'Sege', 38, 9, { x: 474, y: 164, d: 19 }, null],
];

// ⚠️ ASSUMPTION: the other regions' district lists (real district names, invented sample counts that fall off from the region total).
// The Figma template shows only Greater Accra's districts; "View all N districts" uses the region's district total.
const OTHER_DISTRICTS = {
  ashanti: [
    ['Kumasi Metropolitan', 'Kumasi'],
    ['Obuasi Municipal', 'Obuasi'],
    ['Ejisu', 'Ejisu'],
    ['Mampong Municipal', 'Mampong'],
    ['Asokore Mampong', 'Asokore Mampong'],
    ['Bekwai Municipal', 'Bekwai'],
  ],
  eastern: [
    ['New Juaben South', 'Koforidua'],
    ['Nsawam-Adoagyiri', 'Nsawam'],
    ['Akuapem North', 'Akropong'],
    ['Suhum', 'Suhum'],
    ['Kwahu West', 'Nkawkaw'],
    ['Birim Central', 'Akim Oda'],
  ],
  northern: [
    ['Tamale Metropolitan', 'Tamale'],
    ['Sagnarigu', 'Sagnarigu'],
    ['Yendi', 'Yendi'],
    ['Savelugu', 'Savelugu'],
    ['Tolon', 'Tolon'],
    ['Kumbungu', 'Kumbungu'],
  ],
  western: [
    ['Sekondi-Takoradi Metropolitan', 'Sekondi-Takoradi'],
    ['Tarkwa-Nsuaem', 'Tarkwa'],
    ['Ahanta West', 'Agona Nkwanta'],
    ['Shama', 'Shama'],
    ['Effia-Kwesimintsim', 'Kwesimintsim'],
  ],
  volta: [
    ['Ho Municipal', 'Ho'],
    ['Keta', 'Keta'],
    ['Hohoe', 'Hohoe'],
    ['Kpando', 'Kpando'],
    ['Ketu South', 'Aflao'],
    ['Anloga', 'Anloga'],
  ],
  central: [
    ['Cape Coast Metropolitan', 'Cape Coast'],
    ['Awutu Senya East', 'Kasoa'],
    ['Mfantseman', 'Saltpond'],
    ['Assin Central', 'Assin Fosu'],
    ['Gomoa Central', 'Afransi'],
    ['Twifo-Ati Morkwa', 'Twifo Praso'],
  ],
  'upper-east': [
    ['Bolgatanga Municipal', 'Bolgatanga'],
    ['Bawku Municipal', 'Bawku'],
    ['Kassena-Nankana Municipal', 'Navrongo'],
    ['Bongo', 'Bongo'],
    ['Talensi', 'Tongo'],
  ],
  bono: [
    ['Sunyani Municipal', 'Sunyani'],
    ['Berekum East', 'Berekum'],
    ['Dormaa Central', 'Dormaa Ahenkro'],
    ['Wenchi', 'Wenchi'],
    ['Jaman South', 'Drobo'],
  ],
  'north-east': [
    ['East Mamprusi', 'Gambaga'],
    ['West Mamprusi', 'Walewale'],
    ['Chereponi', 'Chereponi'],
    ['Bunkpurugu-Nakpanduri', 'Bunkpurugu'],
    ['Yunyoo-Nasuan', 'Yunyoo'],
  ],
  savannah: [
    ['West Gonja', 'Damongo'],
    ['East Gonja', 'Salaga'],
    ['Bole', 'Bole'],
    ['Central Gonja', 'Buipe'],
    ['Sawla-Tuna-Kalba', 'Sawla'],
  ],
  'bono-east': [
    ['Techiman Municipal', 'Techiman'],
    ['Kintampo North', 'Kintampo'],
    ['Atebubu-Amantin', 'Atebubu'],
    ['Nkoranza South', 'Nkoranza'],
    ['Sene West', 'Kwame Danso'],
  ],
  'upper-west': [
    ['Wa Municipal', 'Wa'],
    ['Nadowli-Kaleo', 'Nadowli'],
    ['Lawra', 'Lawra'],
    ['Jirapa', 'Jirapa'],
    ['Sissala East', 'Tumu'],
  ],
  'western-north': [
    ['Sefwi Wiawso Municipal', 'Sefwi Wiawso'],
    ['Bibiani-Anhwiaso-Bekwai', 'Bibiani'],
    ['Juaboso', 'Juaboso'],
    ['Aowin', 'Enchi'],
    ['Bodi', 'Bodi'],
  ],
  oti: [
    ['Krachi East', 'Dambai'],
    ['Nkwanta South', 'Nkwanta'],
    ['Jasikan', 'Jasikan'],
    ['Kadjebi', 'Kadjebi'],
    ['Biakoye', 'Nkonya Ahenkro'],
  ],
  ahafo: [
    ['Asunafo North', 'Goaso'],
    ['Asutifi North', 'Kenyasi'],
    ['Tano North', 'Duayaw Nkwanta'],
    ['Tano South', 'Bechem'],
    ['Asunafo South', 'Kukuom'],
  ],
};

const FALL_OFF = [0.24, 0.13, 0.09, 0.07, 0.06, 0.05];

const regionDistricts = (region) => {
  if (region.id === 'greater-accra') {
    return GA_DISTRICTS.map(([name, capital, talents, trendPct, marker, label]) => ({
      id: slug(name),
      name,
      capital,
      talents,
      trendPct,
      marker,
      label,
    }));
  }
  const list = OTHER_DISTRICTS[region.id] ?? [];
  return list.map(([name, capital], i) => ({
    id: slug(name),
    name,
    capital,
    talents: Math.round(region.talents * FALL_OFF[i]),
    trendPct: Math.max(1, region.trendPct + Math.round(wobble(name) * 4)),
    marker: null,
    label: null,
  }));
};

// Accra Metro's 13 areas (8494:2009 table: top 10 drawn; the last three are ⚠️ ASSUMPTION).
const ACCRA_METRO_AREAS = [
  ['Osu Klottey', 1620, 5],
  ['Ablekuma Central', 1480, 3],
  ['Ayawaso East', 1310, 6],
  ['Okaikwei South', 1240, 4],
  ['Korle Klottey', 1120, 2],
  ['Ashiedu Keteke', 980, 1],
  ['Ablekuma North', 940, 7],
  ['Ayawaso Central', 910, 4],
  ['Ablekuma West', 880, -1],
  ['Ayawaso North', 760, 3],
  ['Ayawaso West', 640, 2],
  ['Okaikwei North', 520, 3],
  ['Ablekuma South', 410, 1],
].map(([name, talents, trendPct]) => ({ id: slug(name), name, talents, trendPct }));

// Drawn for Accra Metro (8494:2009); the other districts derive from their region (⚠️ ASSUMPTION).
const ACCRA_METRO_DETAIL = {
  assessmentPct: 64,
  placements: 310,
  partners: 34,
  deltaLast30: 460,
  education: [35, 36, 29],
  ageShares: [12, 40, 34, 14],
  capabilityShares: [48, 26, 16, 7, 3],
  genderShares: [49, 50, 1],
  partnerCounts: [11, 6, 5, 3, 9],
  ranks: { registrations: 1, assessment: 4, placements: 1 },
};

/* ===== BLOCK 4 · API getters ========================================================================================== */

export const getRegion = (regionId) => {
  const base = REGION_RECORDS.find((r) => r.id === regionId);
  if (!base) return null;
  const districts = regionDistricts(base)
    .sort((a, b) => b.talents - a.talents)
    .map((d, i) => ({ ...d, rank: i + 1 }));
  return {
    ...base,
    districts,
    districtsListed: districts.length,
    // Position of the page in the template: "1 of 16 regions" is the count, not the rank (Figma).
    nationalAssessmentPct: NATIONAL_ASSESSMENT,
  };
};

export const getDistrict = (regionId, districtId) => {
  const region = getRegion(regionId);
  if (!region) return null;
  const d = region.districts.find((x) => x.id === districtId);
  if (!d) return null;
  const share = d.talents / region.talents;
  const isMetro = regionId === 'greater-accra' && districtId === 'accra-metro';
  const detail = isMetro
    ? ACCRA_METRO_DETAIL
    : {
        assessmentPct: Math.max(
          30,
          Math.min(90, region.assessmentPct + Math.round(wobble(d.id) * 6))
        ),
        placements: Math.max(1, Math.round(region.placements * share)),
        partners: Math.max(1, Math.round(region.partners * share * 1.2)),
        deltaLast30: Math.round(d.talents - d.talents / (1 + d.trendPct / 100)),
        education: region.education,
        ageShares: normalise(region.ageShares.map((v, i) => v + Math.round(wobble(d.id, i) * 2))),
        capabilityShares: normalise(
          region.capabilityShares.map((v, i) => v + Math.round(wobble(d.id, i + 3) * 3))
        ),
        genderShares: region.genderShares,
        partnerCounts: partnerTiles(Math.max(1, Math.round(region.partners * share * 1.2)), d.id),
        ranks: {
          registrations: d.rank,
          assessment: Math.min(region.districtsTotal, d.rank + 1),
          placements: d.rank,
        },
      };
  const lowCount = d.talents < 50;
  return {
    ...detail,
    id: d.id,
    name: d.name,
    capital: d.capital,
    regionId: region.id,
    regionName: region.name,
    regionTalents: region.talents,
    regionAssessmentPct: region.assessmentPct,
    regionEducation: region.education,
    regionPlacements: region.placements,
    districtsTotal: region.districtsTotal,
    talents: d.talents,
    trendPct: d.trendPct,
    rank: d.rank,
    sharePct: Math.round(share * 100),
    placementsSharePct: Math.round((detail.placements / region.placements) * 100),
    subtitle: isMetro
      ? `District in ${region.name} · Accra Metropolitan Assembly`
      : `District in ${region.name} · capital ${d.capital}`,
    areas: isMetro ? ACCRA_METRO_AREAS : [],
    areasTotal: isMetro ? ACCRA_METRO_AREAS.length : 0,
    series: sparkFor(d.id, d.trendPct),
    marker: d.marker,
    lowData: lowCount
      ? { talents: d.talents, joined: 9, partners: 2 }
      : // Forced ?state=low-data on a district with enough talents shows the Ada West example (⚠️ ASSUMPTION).
        { talents: 38, joined: 9, partners: 2 },
    isLowCount: lowCount,
    districts: region.districts,
  };
};

/** All 16 regions for the switcher / the compare modal: id, name, talents, ordered by talents (the switcher) — the modal sorts by name. */
export const listRegions = () =>
  REGION_RECORDS.map(({ id, name, talents }) => ({ id, name, talents })).sort(
    (a, b) => b.talents - a.talents
  );

export const COMPARE_COLOURS = ['#387440', '#eb6834', '#2a78d6'];
export const COMPARE_COLOUR_NAMES = ['green', 'orange', 'blue'];
export const COMPARE_MAX = 3;
export const COMPARE_MIN = 2;
export const AGE_BANDS = ['14–17', '18–24', '25–29', '30–35'];

/** "greater-accra,ashanti,x" → valid, unique region ids, at most COMPARE_MAX. */
export const parseCompareIds = (raw) =>
  (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((id, i, all) => regionById(id) && all.indexOf(id) === i)
    .slice(0, COMPARE_MAX);

export const getCompare = (ids) =>
  ids
    .map((id) => REGION_RECORDS.find((r) => r.id === id))
    .filter(Boolean)
    .slice(0, COMPARE_MAX)
    .map((r, i) => ({ ...r, colour: COMPARE_COLOURS[i] }));

/* ===== BLOCK 5 · Greater Accra zoom map geometry ====================================================================== */

// Figma "Greater Accra outline" 8493:1786 (560x229, fill #ebf1ec, 2px #6ca271), exported as SVG (563x232 with the stroke); it sits at
// (46, 95) of the 652x420 zoom map, so the SVG starts at (44.5, 93.5). ⚠️ PLACEHOLDER GEOMETRY until the GSS district files arrive.
export const GA_ZOOM = {
  width: 652,
  height: 420,
  outline: {
    x: 44.5,
    y: 93.5,
    w: 563,
    h: 232,
    d: 'M537.758 109.065L399.375 98.8591L379.063 102.261L304.819 125.875L284.607 142.785L267.697 149.489L247.485 169.802L213.664 183.31L190.05 193.416L92.1919 227.136L68.5777 230.538L55.0697 190.014L24.6515 169.802L1.03736 125.875L4.4394 102.261L34.7575 95.5571L48.2656 112.367L82.0858 119.171L105.7 109.065L112.404 98.8591L142.822 109.065L159.732 98.8591L183.346 51.6309L206.96 38.1228L213.664 11.1066L233.977 21.2127L260.993 4.40263H281.205L291.311 21.2127L314.925 34.7208L331.835 58.4349H341.941L358.851 48.2288L385.867 14.5087L416.186 1.0006H453.308L487.128 11.1066L504.038 21.2127L517.446 65.1389L534.356 78.647L551.266 85.351L561.372 95.5571L537.758 109.065Z',
  },
  // the mini national map (84x123) sits in the top-right corner: abs (906,676) − zoom origin (352,662)
  mini: { x: 554, y: 14, w: 84, h: 123 },
};

export { PARTNER_KINDS };
