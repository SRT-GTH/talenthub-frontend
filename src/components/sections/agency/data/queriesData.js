import { getOverview, NATIONAL_TALENTS } from '../../publicData/overview/data/overviewData.js';
import { REGIONS } from '../../publicData/regionsList.js';
import { MAP_REGIONS_SAMPLE } from '../../publicData/map/data/mapData.js';
import { FILTER_DEFINITIONS } from '../../publicData/ui/data/uiData.js';
import { isSuppressed } from '../../publicData/publicDataFormat.js';

/*
 * queriesData.js — API-shaped MOCK data of the agency "Queries" screens (Figma 11.5.1a-h, canvas 8605:395409). SAMPLE CONTENT ONLY.
 * Future endpoints: POST /agency/queries/run (filters -> overview shape), GET/POST /agency/queries (saved queries),
 * POST /agency/queries/:id/export (CSV, logged with a purpose, consumes the MoU quota).
 * The numbers come from Theme 8's getOverview(); extra profile filters multiply the count by a sample share. Every count under 5 is
 * printed through formatCount() / safeShare() by the components ("<5").
 *
 * BLOCK 1 · filters (URL <-> object)   BLOCK 2 · drawer groups   BLOCK 3 · the query model   BLOCK 4 · breakdown
 * BLOCK 5 · saved queries              BLOCK 6 · dialogs (save, export)   BLOCK 7 · quota
 */

/* ===== BLOCK 1 · filters (URL <-> object) ============================================================================== */

export const QUERY_FILTER_KEYS = ['region', 'edu', 'interest', 'age', 'gender'];

/** Region menu rows: the 16 regions with their talent counts (Figma 11.5.1a "Oti 5,210 · Savannah 7,418 ..."), alphabetical. */
export const REGION_OPTIONS = REGIONS.map((r) => ({
  id: r.id,
  label: r.name,
  count: MAP_REGIONS_SAMPLE.find((m) => m.id === r.id)?.count ?? 0,
})).sort((a, b) => a.label.localeCompare(b.label));

/**
 * ⚠️ ASSUMPTION: the profile preset of frame 11.5.1g ("?profile=1": Volta + TVET/HND + Internship + Ready now + 1 verified certificate +
 * Builders) is expressed as extra filters; the page applies it when ?profile=1 is set and no ?x= is given.
 */
export const PROFILE_PRESET = {
  'edu-level': ['tvet', 'hnd'],
  'work-exp': ['internship'],
  readiness: ['ready-now'],
  certs: ['at-least-1'],
  personality: ['builders'],
};

/** "field~a~b;field2~c" <-> { field: [a, b], field2: [c] } (the ?x= key). */
export const parseExtras = (raw) => {
  const out = {};
  String(raw ?? '')
    .split(';')
    .filter(Boolean)
    .forEach((part) => {
      const [field, ...values] = part.split('~');
      if (field && values.length) out[field] = values;
    });
  return out;
};

export const serialiseExtras = (extras) =>
  Object.entries(extras)
    .filter(([, v]) => v?.length)
    .map(([k, v]) => [k, ...v].join('~'))
    .join(';');

const REGION_IDS = REGIONS.map((r) => r.id);

/** Parse the query-related URL keys into one filter object. */
export const parseQueryFilters = (params) => {
  const profile = params.get('profile') === '1';
  const rawX = params.get('x');
  const extras = rawX ? parseExtras(rawX) : profile ? { ...PROFILE_PRESET } : {};
  const preset = profile && !rawX;
  const region = (params.get('region') ?? '').split(',').filter((id) => REGION_IDS.includes(id));
  return {
    region,
    edu: params.get('edu') || '',
    // ⚠️ ASSUMPTION: the profile preset frame draws neither Interest nor Age chips, so the preset ignores them
    interest: preset ? '' : params.get('interest') || '',
    age: preset ? '' : params.get('age') || '',
    gender: params.get('gender') || '',
    extras,
    by: params.get('by') || (preset ? 'education' : 'interest'),
  };
};

export const activeFilterCount = (f) =>
  f.region.length +
  [f.edu, f.interest, f.age, f.gender].filter(Boolean).length +
  Object.keys(f.extras).length;

/* ===== BLOCK 2 · the "More filters" drawer groups (Figma 11.5.1h 8707:421597) ======================================== */

/*
 * Group titles, the drawn fields and the drawn values come from the frame. Option lists that the frame does not draw (marked ⚠️) are
 * the most conservative guess; nothing here is personal data, every option is a broad group.
 * source 'url' = one of the five top-level filters, 'x' = an extra (?x=)
 */
export const DRAWER_GROUPS = [
  {
    id: 'location',
    title: 'Location',
    fields: [{ id: 'region', label: 'Region', source: 'url', multi: true }],
  },
  {
    id: 'about',
    title: 'About them',
    fields: [
      { id: 'age', label: 'Age range', source: 'url' },
      { id: 'gender', label: 'Gender', source: 'url' },
      // ⚠️ ASSUMPTION: the third filter of the collapsed group is not drawn
      {
        id: 'language',
        label: 'Languages',
        source: 'x',
        options: [
          { id: 'english', label: 'English' },
          { id: 'twi', label: 'Twi' },
          { id: 'ewe', label: 'Ewe' },
          { id: 'ga', label: 'Ga' },
          { id: 'dagbani', label: 'Dagbani' },
        ],
      },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    fields: [
      {
        id: 'edu-level',
        label: 'Education level',
        source: 'x',
        multi: true,
        options: [
          { id: 'shs', label: 'SHS / WASSCE' },
          { id: 'tvet', label: 'TVET', longLabel: 'TVET certificate' },
          { id: 'hnd', label: 'HND' },
          { id: 'degree', label: 'Tertiary degree' },
        ],
      },
      {
        id: 'field',
        label: 'Field of study',
        source: 'x',
        options: [
          { id: 'stem', label: 'Science and technology' },
          { id: 'business', label: 'Business' },
          { id: 'arts', label: 'Arts and humanities' },
        ],
      },
      {
        id: 'institution',
        label: 'Institution type',
        source: 'x',
        options: [
          { id: 'public', label: 'Public' },
          { id: 'private', label: 'Private' },
          { id: 'tvet-centre', label: 'TVET centre' },
        ],
      },
      {
        id: 'enrolled',
        label: 'Currently enrolled',
        source: 'x',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
        ],
      },
    ],
  },
  {
    id: 'experience',
    title: 'Experience',
    fields: [
      {
        id: 'work-exp',
        label: 'Work experience',
        source: 'x',
        options: [
          { id: 'none', label: 'None yet' },
          { id: 'internship', label: 'Internship' },
          { id: 'one-to-three', label: '1 to 3 years' },
          { id: 'three-plus', label: '3+ years' },
        ],
      },
      {
        id: 'exp-type',
        label: 'Experience type',
        source: 'x',
        options: [
          { id: 'paid', label: 'Paid' },
          { id: 'volunteer', label: 'Volunteer' },
          { id: 'national-service', label: 'National service' },
        ],
      },
      {
        id: 'industry',
        label: 'Industry of experience',
        source: 'x',
        options: [
          { id: 'technology', label: 'Technology' },
          { id: 'agriculture', label: 'Agriculture' },
          { id: 'services', label: 'Services' },
        ],
      },
    ],
  },
  {
    id: 'certifications',
    title: 'Certifications',
    fields: [
      {
        id: 'certs',
        label: 'Certifications held',
        source: 'x',
        options: [
          { id: 'none', label: 'None' },
          { id: 'at-least-1', label: 'At least 1', longLabel: 'At least 1, verified' },
        ],
      },
    ],
  },
  {
    id: 'interests',
    title: 'Interests and goals',
    fields: [
      { id: 'interest', label: 'Career interest', source: 'url' },
      // ⚠️ ASSUMPTION: the two other filters of the collapsed group are not drawn
      {
        id: 'goal',
        label: 'Career goal',
        source: 'x',
        options: [
          { id: 'job', label: 'A job' },
          { id: 'training', label: 'Training' },
          { id: 'own-business', label: 'Own business' },
        ],
      },
      {
        id: 'setting',
        label: 'Preferred setting',
        source: 'x',
        options: [
          { id: 'on-site', label: 'On site' },
          { id: 'remote', label: 'Remote' },
        ],
      },
    ],
  },
  {
    id: 'personality',
    title: 'Personality and strengths',
    fields: [
      {
        id: 'personality',
        label: 'Personality type',
        source: 'x',
        options: [
          { id: 'builders', label: 'Builders', longLabel: 'Builders (broad group)' },
          { id: 'thinkers', label: 'Thinkers' },
          { id: 'helpers', label: 'Helpers' },
        ],
      },
      {
        id: 'capability',
        label: 'Strongest capability',
        source: 'x',
        options: [
          { id: 'technical', label: 'Technical' },
          { id: 'analytical', label: 'Analytical' },
          { id: 'creative', label: 'Creative' },
          { id: 'social', label: 'Social / caring' },
        ],
      },
    ],
  },
  {
    id: 'skills',
    title: 'Skills and readiness',
    fields: [
      {
        id: 'readiness',
        label: 'Readiness level',
        source: 'x',
        options: [
          { id: 'ready-now', label: 'Ready now' },
          { id: 'one-month', label: 'Within 1 month' },
          { id: 'three-months', label: 'Within 3 months' },
        ],
      },
    ],
  },
  {
    id: 'programmes',
    title: 'Programmes and outcomes',
    fields: [
      {
        id: 'programme',
        label: 'Programme',
        source: 'x',
        options: [
          { id: 'youthstart', label: 'YouthStart Digital Grant' },
          { id: 'nss', label: 'NSS Placement Matching' },
        ],
      },
      {
        id: 'outcome',
        label: 'Outcome',
        source: 'x',
        options: [
          { id: 'placed', label: 'Placed' },
          { id: 'enrolled', label: 'Enrolled' },
        ],
      },
    ],
  },
];

/** Chip / summary labels of an extra: the Figma wording of the drawn ones ("Education: TVET, HND", "Experience: Internship"). */
export const EXTRA_CHIP = {
  'edu-level': { chip: 'Education', summary: 'Education level' },
  'work-exp': { chip: 'Experience', summary: 'Work experience' },
  readiness: { chip: 'Readiness', summary: 'Readiness level' },
  certs: { chip: 'Certifications', summary: 'Certifications held' },
  personality: { chip: 'Personality', summary: 'Personality type' },
};

const ALL_FIELDS = DRAWER_GROUPS.flatMap((g) => g.fields);
export const fieldById = (id) => ALL_FIELDS.find((f) => f.id === id);

const urlOptions = (key) => FILTER_DEFINITIONS.find((d) => d.key === key)?.options ?? [];

/** Options of a drawer field (URL fields come from Theme 8's filter definitions). */
export const optionsOfField = (field) =>
  field.source === 'url'
    ? field.id === 'region'
      ? REGION_OPTIONS
      : urlOptions(field.id)
    : (field.options ?? []);

export const optionLabel = (field, id, long = false) => {
  const option = optionsOfField(field).find((o) => o.id === id);
  return (long ? option?.longLabel : null) ?? option?.label ?? id;
};

/** Sentence-style summary chips of a query: [{ key, label }] with the Figma wording ("Region: Volta", "Career interest: Technology"). */
export const querySummary = (f, long = false) => {
  const chips = [];
  if (f.region.length)
    chips.push({
      key: 'region',
      label: `Region: ${f.region.map((id) => REGIONS.find((r) => r.id === id)?.name).join(', ')}`,
    });
  if (f.edu)
    chips.push({
      key: 'edu',
      label: `Education level: ${urlOptions('edu').find((o) => o.id === f.edu)?.label}`,
    });
  if (f.interest)
    chips.push({
      key: 'interest',
      label: `Career interest: ${urlOptions('interest').find((o) => o.id === f.interest)?.label}`,
    });
  if (f.age)
    chips.push({
      key: 'age',
      label: `Age range: ${urlOptions('age').find((o) => o.id === f.age)?.label}`,
    });
  if (f.gender)
    chips.push({
      key: 'gender',
      label: `Gender: ${urlOptions('gender').find((o) => o.id === f.gender)?.label}`,
    });
  Object.entries(f.extras).forEach(([id, values]) => {
    const field = fieldById(id);
    if (!field) return;
    chips.push({
      key: `x:${id}`,
      label: `${EXTRA_CHIP[id]?.summary ?? field.label}: ${values.map((v) => optionLabel(field, v, long)).join(', ')}`,
    });
  });
  return chips;
};

/** "Volta · Technology · ages 18–24" — the title of the summary banner and the default name of a saved query. */
export const queryTitle = (f) => {
  const parts = [];
  if (f.region.length)
    parts.push(f.region.map((id) => REGIONS.find((r) => r.id === id)?.name).join(' & '));
  if (f.interest) parts.push(urlOptions('interest').find((o) => o.id === f.interest)?.label);
  if (f.age) parts.push(`ages ${urlOptions('age').find((o) => o.id === f.age)?.label}`);
  if (f.edu) parts.push(urlOptions('edu').find((o) => o.id === f.edu)?.label);
  if (f.gender) parts.push(urlOptions('gender').find((o) => o.id === f.gender)?.label);
  const extras = Object.keys(f.extras).length;
  if (extras) parts.push(`${extras} profile filter${extras === 1 ? '' : 's'}`);
  // ⚠️ ASSUMPTION: with no filter at all the title reads "All talents in your MoU view" (not drawn)
  return parts.length ? parts.join(' · ') : 'All talents in your MoU view';
};

/* ===== BLOCK 3 · the query model ======================================================================================= */

/** ⚠️ ASSUMPTION: sample shares of each extra value (share of the matching talents). The preset multiplies to 0.00733 (Volta 13,090 -> 96, Figma 11.5.1g). */
const EXTRA_SHARE = {
  'edu-level': 0.2,
  'work-exp': 0.25,
  readiness: 0.4,
  certs: 0.5,
  personality: 0.733,
};
const DEFAULT_EXTRA_SHARE = 0.6;

const extrasFactor = (extras) =>
  Object.keys(extras).reduce((acc, id) => acc * (EXTRA_SHARE[id] ?? DEFAULT_EXTRA_SHARE), 1);

const scale = (n, ratio) => (typeof n === 'number' ? Math.round(n * ratio) : n);

const scaleBuckets = (rows, ratio) => rows.map((r) => ({ ...r, count: scale(r.count, ratio) }));

/** Scale a getOverview() answer to a new total (several regions, extra filters). */
const scaleOverview = (o, count) => {
  if (!o.count) return o;
  const ratio = count / o.count;
  const fixUp = (rows) => {
    const scaled = scaleBuckets(rows, ratio);
    const sum = scaled.reduce((a, r) => a + (r.count ?? 0), 0);
    if (scaled.length && sum !== count) {
      const biggest = scaled.reduce((bi, r, i) => (r.count > scaled[bi].count ? i : bi), 0);
      scaled[biggest] = { ...scaled[biggest], count: scaled[biggest].count + (count - sum) };
    }
    return scaled;
  };
  return {
    ...o,
    count,
    hero: { ...o.hero, count },
    kpis: {
      ...o.kpis,
      placements: { ...o.kpis.placements, count: scale(o.kpis.placements.count, ratio) },
    },
    education: fixUp(o.education),
    ages: fixUp(o.ages),
    capabilities: fixUp(o.capabilities),
    gender: fixUp(o.gender),
    interests: { ...o.interests, rows: scaleBuckets(o.interests.rows, ratio) },
    regions: o.regions.map((r) => ({
      ...r,
      count: r.count === null ? null : scale(r.count, ratio),
    })),
  };
};

/**
 * Mock of POST /agency/queries/run. Returns { status: 'ready' | 'zero' | 'suppressed', count, overview, filters }.
 * `forceZero` is the ?state=zero frame. Counts under 5 never reach the screen as numbers (the components print "<5").
 */
export const runQuery = (f, { forceZero = false } = {}) => {
  const others = { edu: f.edu, interest: f.interest, age: f.age, gender: f.gender };
  let overview;
  if (f.region.length <= 1) {
    overview = getOverview({ ...others, region: f.region[0] ?? '' });
  } else {
    const nationalCut = getOverview({ ...others, region: '' });
    const total = f.region.reduce(
      (sum, id) => sum + (getOverview({ ...others, region: id }).count ?? 0),
      0
    );
    overview = nationalCut.state === 'ok' ? scaleOverview(nationalCut, total) : nationalCut;
  }
  const factor = extrasFactor(f.extras);
  if (factor < 1 && overview.state === 'ok') {
    overview = scaleOverview(overview, Math.round(overview.count * factor));
  }
  const count = forceZero ? 0 : overview.count;
  const status = count === 0 ? 'zero' : isSuppressed(count) ? 'suppressed' : 'ready';
  return { status, count, overview, filters: f, nationalCount: NATIONAL_TALENTS };
};

/* ===== BLOCK 4 · the Breakdown card ("View by") ======================================================================== */

export const VIEW_BY = [
  { id: 'interest', label: 'Career interest' },
  { id: 'education', label: 'Education level' },
  { id: 'region', label: 'Region' },
  { id: 'age', label: 'Age range' },
  { id: 'gender', label: 'Gender' },
  { id: 'capability', label: 'Strongest capability' },
];

/** Education levels of the Breakdown (Figma 11.5.1g rows). Weights = share of an unfiltered cut; the drawn cut is TVET 58 · HND 38. */
const EDU_ROWS = [
  { id: 'tvet', label: 'TVET certificate', weight: 58 },
  { id: 'hnd', label: 'HND / diploma', weight: 38 },
  { id: 'degree', label: 'Tertiary degree', weight: 30 },
  { id: 'shs', label: 'SHS / WASSCE', weight: 40 },
];

const distribute = (total, weights) => {
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

/** Rows of the Breakdown: [{ key, label, count }] (counts under 5 are printed "<5" by BarRow). */
export const breakdownRows = (view, result) => {
  const { overview, filters } = result;
  switch (view) {
    case 'education': {
      const picked = filters.extras['edu-level'];
      const live = picked ? EDU_ROWS.filter((r) => picked.includes(r.id)) : EDU_ROWS;
      const counts = distribute(
        overview.count,
        live.map((r) => r.weight)
      );
      return EDU_ROWS.map((r) => {
        const i = live.indexOf(r);
        return { key: r.id, label: r.label, count: i >= 0 ? counts[i] : 3 };
      });
    }
    case 'region':
      return overview.regions
        .filter((r) => r.count !== null)
        .map((r) => ({
          key: r.id,
          label: REGIONS.find((x) => x.id === r.id)?.name ?? r.id,
          count: r.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    case 'age':
      return overview.ages.map((a) => ({ key: a.key, label: a.label, count: a.count }));
    case 'gender':
      return overview.gender.map((g) => ({ key: g.key, label: g.label, count: g.count }));
    case 'capability':
      return overview.capabilities.map((c) => ({ key: c.key, label: c.label, count: c.count }));
    default:
      return overview.interests.rows.slice(0, filters.interest ? 5 : 10);
  }
};

/* ===== BLOCK 5 · saved queries (Figma 11.5.1e 8609:2458) ============================================================== */

/** ⚠️ ASSUMPTION: the fourth saved query is not drawn (the header says "4 saved", the frame shows three); it is sample content. */
export const SAVED_QUERIES = [
  {
    id: 'neet-by-district',
    name: 'NEET by district',
    iconKey: 'map',
    schedule: 'Monthly',
    movedPct: 7,
    title: 'Not in work or training · all districts',
    meta: ['All 16 regions · 261 districts', 'Readiness', 'Ages 18–35'],
    talents: 12410,
    barRatio: 0.92,
    tone: 'green',
    chips: ['District', 'Readiness', 'Age'],
    saved: '2 Sep',
    by: 'Efua Owusu',
    status: 'scheduled',
    href: '/agency/queries?state=results',
  },
  {
    id: 'volta-tech-18-24',
    name: 'Volta tech, 18–24',
    iconKey: 'chart',
    schedule: 'Monthly',
    movedPct: 2,
    title: 'Technology interest · Volta',
    meta: ['Volta · 18 districts', 'Any education', 'Ages 18–24'],
    talents: 237,
    barRatio: 0.55,
    tone: 'amber',
    chips: ['Region', 'Interest', 'Age'],
    saved: '18 Sep',
    by: 'Kojo Mensah',
    status: 'scheduled',
    href: '/agency/queries?state=results&region=volta&interest=technology&age=18-24',
  },
  {
    id: 'upper-west-placements',
    name: 'Upper West placements',
    iconKey: 'filter',
    schedule: 'Not refreshing',
    movedPct: null,
    title: 'Placements · outcomes',
    meta: ['Upper West · 11 districts', 'Placed', 'Any age'],
    talents: 3,
    barRatio: 0.45,
    tone: 'amber',
    chips: ['Region', 'Outcome', 'Programme'],
    saved: '1 Aug',
    by: 'Efua Owusu',
    status: 'paused',
    href: '/agency/queries?state=zero&region=upper-west&interest=technology&age=18-24',
  },
  {
    id: 'northern-readiness',
    name: 'Northern readiness',
    iconKey: 'map',
    schedule: 'Weekly',
    movedPct: 1,
    title: 'Ready now · Northern',
    meta: ['Northern · 14 districts', 'Readiness', 'Any age'],
    talents: 1860,
    barRatio: 0.7,
    tone: 'green',
    chips: ['Region', 'Readiness'],
    saved: '9 Sep',
    by: 'Kojo Mensah',
    status: 'scheduled',
    href: '/agency/queries?state=results&region=northern',
  },
];

/** The notice bar over the saved queries (Figma: """NEET by district"" moved by 7% since last month ..."). */
export const SAVED_NOTICE = {
  queryId: 'neet-by-district',
  text: '“NEET by district” moved by 7% since last month. Open it to see which districts changed.',
};

export const SAVED_TABS = [
  { id: 'build', label: 'Build', count: '—' },
  { id: 'recent', label: 'Recent', count: '12' },
  { id: 'saved', label: 'Saved', count: null },
  { id: 'shared', label: 'Shared with me', count: '2' },
];

export const SAVED_SORTS = ['Recently run', 'Name', 'Talents'];

/* ===== BLOCK 6 · dialogs (save, export) ================================================================================ */

/** Refresh schedule steps of the Save dialog (Figma slider: "Weekly · every Monday" ... "Monthly · 1st of the month"). */
export const REFRESH_STEPS = [
  { id: 'weekly', label: 'Weekly', hint: 'Weekly · every Monday' },
  { id: 'monthly', label: 'Monthly', hint: 'Monthly · 1st of the month' },
];

export const NOTIFY_CHANNELS = [
  { id: 'gth', label: 'In GTH', icon: 'bell' },
  { id: 'email', label: 'Email', icon: 'mail' },
  { id: 'push', label: 'Push on my phone', icon: 'phone' },
];

export const EXPORT_PURPOSE_MAX = 200;
export const EXPORT_PURPOSE_DEFAULT = 'YouthStart 2027 planning · Volta tech cohort';

export const EXPORT_OPTIONS = (result) => {
  const f = result.filters;
  const regions =
    f.region.length === 1 ? 'Volta’s 18 districts · 252 rows' : 'All 261 districts · 261 rows';
  return [
    { id: 'query', title: 'This query', sub: `${result.count} talents · 14 columns` },
    { id: 'district', title: 'By district', sub: regions },
    { id: 'month', title: 'By month', sub: 'Last 24 months · 24 rows' },
  ];
};

/* ===== BLOCK 7 · quota (mock) ========================================================================================= */

/** A save or an export uses 1 query of the MoU quota (Figma 11.5.1c: "Each refresh uses 1 query from your quota (64% used)."). */
export const QUOTA_COST = { save: 1, export: 1 };

/* ===== BLOCK 8 · CSV export (mock of POST /agency/queries/:id/export) ================================================= */

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const csvCell = (value) => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const printed = (n) => (isSuppressed(n) ? '<5' : String(n));

/**
 * Aggregates only, counts under 5 written as "<5" (privacy rule of the whole programme). ⚠️ ASSUMPTION: the district split is not modelled
 * in the mock, so "By district" lists the selected regions (all 16 when none) and "By month" spreads the total over the last 24 months.
 */
export const buildExportCsv = (kind, result) => {
  const { overview, filters } = result;
  const rows = [];
  if (kind === 'district') {
    rows.push(['region', 'talents']);
    overview.regions
      .filter((r) => r.count !== null)
      .forEach((r) =>
        rows.push([REGIONS.find((x) => x.id === r.id)?.name ?? r.id, printed(r.count)])
      );
  } else if (kind === 'month') {
    rows.push(['month', 'talents']);
    const weights = Array.from({ length: 24 }, (_, i) => i + 6);
    const counts = distribute(overview.count, weights);
    counts.forEach((n, i) => {
      const d = new Date(2024, 10 + i, 1);
      rows.push([`${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`, printed(n)]);
    });
  } else {
    rows.push(['group', 'value', 'talents']);
    overview.education.forEach((e) => rows.push(['Education level', e.label, printed(e.count)]));
    overview.ages.forEach((a) => rows.push(['Age range', a.label, printed(a.count)]));
    overview.gender.forEach((g) => rows.push(['Gender', g.label, printed(g.count)]));
    overview.capabilities.forEach((c) =>
      rows.push(['Strongest capability', c.label, printed(c.count)])
    );
    overview.interests.rows.forEach((i) =>
      rows.push(['Career interest', i.label, printed(i.count)])
    );
    rows.push([
      'Total',
      filters.region.length ? 'Selected regions' : 'All regions',
      printed(overview.count),
    ]);
  }
  return rows.map((r) => r.map(csvCell).join(',')).join('\n');
};
