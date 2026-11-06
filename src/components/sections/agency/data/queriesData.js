import { REGIONS } from '../../publicData/regionsList.js';
import { FILTER_DEFINITIONS } from '../../publicData/ui/data/uiData.js';
import { isSuppressed } from '../../publicData/publicDataFormat.js';

/*
 * queriesData.js — filters, labels and builders of the agency "Queries" screens (Figma 11.5.1a-h).
 * Live data: GET /agency/overview (filters + ?x= extras -> the overview shape), GET/POST/PATCH/DELETE /agency/queries (saved queries),
 * POST /agency/exports (server-built CSV, logged with a purpose, uses the MoU CSV quota). Counts under 5 arrive as 0 + suppressed and
 * are printed "<5" by the components.
 *
 * BLOCK 1 · filters (URL <-> object)   BLOCK 2 · drawer groups   BLOCK 3 · the query result   BLOCK 4 · breakdown
 * BLOCK 5 · saved queries              BLOCK 6 · dialogs (save, export)
 */

/* ===== BLOCK 1 · filters (URL <-> object) ============================================================================== */

export const QUERY_FILTER_KEYS = ['region', 'edu', 'interest', 'age', 'gender'];

/** Region menu rows: the 16 regions, alphabetical (live counts are merged in by regionOptionsWith(overview)). */
export const REGION_OPTIONS = REGIONS.map((r) => ({ id: r.id, label: r.name })).sort((a, b) =>
  a.label.localeCompare(b.label)
);
export const regionOptionsWith = (overview) =>
  REGION_OPTIONS.map((o) => {
    const row = overview?.regions?.find((r) => r.id === o.id);
    return row ? { ...o, count: row.suppressed ? 1 : row.count } : o;
  });

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

/* ===== BLOCK 3 · the query result ===================================================================================== */

/** API params of a filter set (GET /agency/overview and saved-query filters). */
export const queryApiParams = (f) => ({
  region: f.region.join(','),
  edu: f.edu,
  interest: f.interest,
  age: f.age,
  gender: f.gender,
  x: serialiseExtras(f.extras),
});

/** { status: 'ready' | 'zero' | 'suppressed', count, overview, filters, nationalCount } from a live overview. */
export const toQueryResult = (f, overview, { forceZero = false } = {}) => {
  const suppressed = overview?.state === 'suppressed';
  const count = forceZero ? 0 : suppressed ? 1 : (overview?.count ?? 0);
  const status = count === 0 ? 'zero' : suppressed || isSuppressed(count) ? 'suppressed' : 'ready';
  return { status, count, overview, filters: f, nationalCount: overview?.nationalCount ?? null };
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

/** Rows of the Breakdown: [{ key, label, count }] from the live overview (counts under 5 are printed "<5" by BarRow). */
export const breakdownRows = (view, result) => {
  const { overview, filters } = result;
  const rows = (list) =>
    (list || []).map((r) => ({
      key: r.key,
      label: r.label,
      count: r.count,
      suppressed: r.suppressed,
    }));
  switch (view) {
    case 'education':
      return rows(overview.education);
    case 'region':
      return (overview.regions || [])
        .filter((r) => r.count || r.suppressed)
        .map((r) => ({
          key: r.id,
          label: r.name || REGIONS.find((x) => x.id === r.id)?.name || r.id,
          count: r.count,
          suppressed: r.suppressed,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 16);
    case 'age':
      return rows(overview.ages);
    case 'gender':
      return rows(overview.gender);
    case 'capability':
      return rows(overview.capabilities);
    default:
      return (overview.interests?.rows || []).slice(0, filters.interest ? 5 : 10);
  }
};

/* ===== BLOCK 5 · saved queries (Figma 11.5.1e) ========================================================================= */

const CADENCE_LABEL = { weekly: 'Weekly', monthly: 'Monthly', none: 'Not refreshing' };
const FILTER_CHIP = {
  region: 'Region',
  edu: 'Education',
  interest: 'Interest',
  age: 'Age',
  gender: 'Gender',
};

/** A saved query's stored filters ({ region: [], edu, interest, age, gender, x, by }) as the page's filter object. */
export const storedToFilters = (s = {}) => ({
  region: (Array.isArray(s.region) ? s.region : String(s.region || '').split(',')).filter((id) =>
    REGION_IDS.includes(id)
  ),
  edu: s.edu || '',
  interest: s.interest || '',
  age: s.age || '',
  gender: s.gender || '',
  extras: parseExtras(s.x),
  by: s.by || 'interest',
});

/** The URL of a saved query's results. */
export const queryHref = (f) => {
  const p = new URLSearchParams({ state: 'results' });
  if (f.region.length) p.set('region', f.region.join(','));
  ['edu', 'interest', 'age', 'gender'].forEach((k) => f[k] && p.set(k, f[k]));
  const x = serialiseExtras(f.extras);
  if (x) p.set('x', x);
  if (f.by && f.by !== 'interest') p.set('by', f.by);
  return `/agency/queries?${p.toString()}`;
};

/** API saved query -> the card / table row the Saved queries view draws. */
export const toSavedCard = (q) => {
  const f = storedToFilters(q.filters);
  const count = q.suppressed ? 1 : q.count;
  const ratio = q.national ? Math.min(1, count / q.national) : 0;
  const optLabel = (key) => urlOptions(key).find((o) => o.id === f[key])?.label;
  const regions = f.region.length
    ? f.region.map((id) => REGIONS.find((r) => r.id === id)?.name).join(', ')
    : 'All 16 regions';
  const chips = [
    ...Object.keys(FILTER_CHIP)
      .filter((k) => (k === 'region' ? f.region.length : f[k]))
      .map((k) => FILTER_CHIP[k]),
    ...Object.keys(f.extras).map((id) => EXTRA_CHIP[id]?.chip ?? fieldById(id)?.label ?? id),
  ];
  return {
    id: q.id,
    name: q.name,
    iconKey: f.region.length === 1 ? 'map' : Object.keys(f.extras).length ? 'filter' : 'chart',
    schedule: q.status === 'paused' ? 'Not refreshing' : CADENCE_LABEL[q.cadence] || 'Monthly',
    cadence: q.cadence,
    movedPct: q.status === 'paused' ? null : (q.movedPct ?? 0),
    title: queryTitle(f),
    meta: [
      regions,
      optLabel('edu') || (f.extras['edu-level'] ? 'Education filter' : 'Any education'),
      f.age ? `Ages ${optLabel('age')}` : 'Any age',
    ],
    talents: count,
    barRatio: Math.max(0.04, ratio),
    tone: count >= 50 ? 'green' : 'amber',
    chips: chips.length ? chips : ['All talents'],
    saved: q.createdAt
      ? new Date(q.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      : '',
    lastRunAt: q.lastRunAt,
    by: q.by,
    mine: q.mine,
    status: q.status,
    href: queryHref(f),
  };
};

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
export const EXPORT_PURPOSE_DEFAULT = '';

export const EXPORT_OPTIONS = (result) => {
  const f = result.filters;
  const regions = f.region.length
    ? f.region.map((id) => REGIONS.find((r) => r.id === id)?.name).join(', ')
    : 'All 16 regions';
  return [
    {
      id: 'query',
      title: 'This query',
      sub: `${result.status === 'suppressed' ? '<5' : result.count.toLocaleString('en-GB')} talents · breakdown by every group`,
    },
    {
      id: 'district',
      title: 'By district',
      sub: `${regions} · one row per district (under 5 grouped)`,
    },
    { id: 'month', title: 'By month', sub: 'Last 24 months · new and total talents' },
  ];
};

/** A save or a refresh uses 1 query of the MoU quota; an export uses 1 CSV export. */
export const QUOTA_COST = { save: 1, export: 1 };
