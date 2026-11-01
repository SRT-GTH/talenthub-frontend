/*
 * Work style (2026-11-01) - the About tab card's four rows, as drawn in Figma (Looking for / Where / Start /
 * Languages). The live card used to show the home town as "Where", put the current course in a "Studying" row (it is
 * on the Education card already) and had no way to edit any of it. Stories: opportunity type + location filters
 * (US-4.1.1-01, US-6.2.1-01) and the recruiter availability filter (US-6.1.2-01).
 *
 * Profile fields: preferredJobTypes [string], preferredJobLocations [string], availableToStart { status, from },
 * languages [{ name, proficiency }].
 */

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'National service',
  'Contract',
  'Freelance / gig',
  'Apprenticeship',
  'Volunteering',
];

export const LOCATION_SUGGESTIONS = [
  'Accra',
  'Kumasi',
  'Takoradi',
  'Tamale',
  'Cape Coast',
  'Remote',
  'Anywhere in Ghana',
];

export const START_OPTIONS = [
  { id: 'immediately', label: 'Immediately' },
  { id: 'within_2_weeks', label: 'Within 2 weeks' },
  { id: 'within_1_month', label: 'Within a month' },
  { id: 'within_3_months', label: 'Within 3 months' },
  { id: 'from_date', label: 'From a date' },
  { id: 'not_looking', label: 'Not looking right now' },
];

/* Profile language levels (the CV reader's enum) and how a person says them. */
export const LANGUAGE_LEVELS = [
  { id: 'Beginner', word: 'basic' },
  { id: 'Intermediate', word: 'conversational' },
  { id: 'Advanced', word: 'fluent' },
  { id: 'Expert', word: 'native' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const list = (v) => (Array.isArray(v) ? v : []);
const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/* 'YYYY-MM' (month input) <-> stored date. */
export const monthInputValue = (d) => {
  if (!d) return '';
  const x = new Date(d);
  return Number.isNaN(x.getTime())
    ? ''
    : `${x.getUTCFullYear()}-${String(x.getUTCMonth() + 1).padStart(2, '0')}`;
};

export const startLabel = (a) => {
  if (!a || !a.status) return null;
  if (a.status === 'from_date') {
    const m = /^(\d{4})-(\d{2})/.exec(monthInputValue(a.from));
    return m ? `From ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : null;
  }
  return START_OPTIONS.find((o) => o.id === a.status)?.label || null;
};

export const languageLabel = (l) => {
  const name = clean(typeof l === 'string' ? l : l?.name);
  if (!name) return '';
  const word = LANGUAGE_LEVELS.find((x) => x.id === l?.proficiency)?.word;
  return word ? `${name} (${word})` : name;
};

/* Card rows: value, or null + a prompt when the talent hasn't said yet. */
export const workStyleRows = (p = {}) => {
  const types = list(p.preferredJobTypes).map(clean).filter(Boolean);
  const places = list(p.preferredJobLocations).map(clean).filter(Boolean);
  const langs = list(p.languages).map(languageLabel).filter(Boolean);
  return [
    {
      label: 'Looking for',
      value: types.join(' · ') || null,
      prompt: 'Add the kind of work you want',
    },
    { label: 'Where', value: places.join(' · ') || null, prompt: 'Add where you want to work' },
    { label: 'Start', value: startLabel(p.availableToStart), prompt: 'Add when you can start' },
    { label: 'Languages', value: langs.join(' · ') || null, prompt: 'Add the languages you speak' },
  ];
};

export const workStyleForm = (p = {}) => ({
  types: list(p.preferredJobTypes).map(clean).filter(Boolean),
  places: list(p.preferredJobLocations).map(clean).filter(Boolean),
  start: p.availableToStart?.status || '',
  from: monthInputValue(p.availableToStart?.from),
  languages: list(p.languages)
    .filter((l) => clean(l?.name))
    .map((l) => ({ name: l.name, level: l.proficiency || '', source: l })),
});

/* -> error message or ''. */
export const workStyleProblem = (form) => {
  if (form.start === 'from_date' && !/^\d{4}-\d{2}$/.test(form.from))
    return 'Pick the month you can start from.';
  if (form.languages.some((l) => !clean(l.name)))
    return 'Name each language, or remove the empty row.';
  return '';
};

const uniq = (arr) => {
  const seen = new Set();
  return arr.filter((x) => {
    const k = x.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/* Form -> PATCH /profiles/fields body. Languages keep their stored item (_id, yearsOfExperience...). */
export const workStyleFields = (form) => {
  const out = {
    preferredJobTypes: uniq(form.types.map(clean).filter(Boolean)),
    preferredJobLocations: uniq(form.places.map(clean).filter(Boolean)),
    availableToStart: form.start
      ? {
          status: form.start,
          ...(form.start === 'from_date' ? { from: `${form.from}-01` } : {}),
        }
      : null,
    languages: form.languages
      .filter((l) => clean(l.name))
      .map((l) => {
        const item = { ...(l.source && typeof l.source === 'object' ? l.source : {}) };
        delete item.id;
        item.name = clean(l.name);
        item.proficiency = l.level || null; // null, not the schema's "Intermediate" default, when not given
        return item;
      }),
  };
  return out;
};
