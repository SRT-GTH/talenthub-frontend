/*
 * Work stage data. Copy verbatim from Figma WK-01..WK-06 (Playful 7707:*, Focused 8285:*). SEED_ROLES are the signed-out
 * demo seeds only; signed-in talents load and save profile.workExperience through rolesFromProfile / rolesToProfile
 * (bottom of this file). COMPLETE_STATS is still static. Months are 'YYYY-MM'; `end: null` + `current: true` = ongoing.
 * `durationLabel` / `rangeLabel` are the strings Figma draws for the seeded roles (kept verbatim, including the
 * drawn inconsistency that Sep 2022 – Aug 2023 reads "11 mo" while Jun – Dec 2023 reads "7 mo"); roles you add or edit
 * get them computed by formatRange().
 */
export const MOCK_NOW = '2025-10';
export const STAGE_YEARS_LABEL = '4+';

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Internship',
  'Freelance',
  'National service',
  'Volunteering',
];

export const SEED_ROLES = [
  {
    id: 'r1',
    title: 'Junior Frontend Developer',
    org: 'Hubtel',
    location: 'Accra, Ghana',
    place: 'Accra',
    type: 'Full-time',
    start: '2024-01',
    end: null,
    current: true,
    rangeLabel: 'Jan 2024 – now · 1 yr 10 mo',
    description:
      'Built React components for the merchant dashboard. Cut page load time by 35% with lazy loading and code splitting. Shipped 4 features with design and backend.',
    tools: ['React', 'TypeScript'],
  },
  {
    id: 'r2',
    title: 'Software Engineering Intern',
    org: 'Hubtel',
    location: 'Accra, Ghana',
    place: 'Accra',
    type: 'Internship',
    start: '2023-06',
    end: '2023-12',
    current: false,
    rangeLabel: 'Jun – Dec 2023 · 7 mo',
    description:
      'Built internal analytics dashboards with Python and Django REST Framework. Improved the CI/CD pipeline with GitHub Actions.',
    tools: ['Python', 'Django'],
  },
  {
    id: 'r3',
    title: 'ICT Instructor',
    org: 'Accra Technical Training Centre',
    location: '',
    place: '',
    type: 'National service',
    start: '2022-09',
    end: '2023-08',
    current: false,
    rangeLabel: 'Sep 2022 – Aug 2023 · 11 mo',
    description:
      'Taught computer literacy to groups of 30+ students. Wrote the course and assessments for two certificate modules.',
    tools: ['Teaching', 'Curriculum design'],
  },
];

/* The "What a strong role looks like" example card on the empty state (WK-01). */
export const EXAMPLE_ROLE = {
  title: 'Junior Frontend Developer',
  org: 'Hubtel',
  place: 'Accra',
  type: 'Full-time',
  rangeLabel: 'Jan 2024 – now · 1 yr 10 mo',
  description:
    'Built React components for the merchant dashboard. Cut page load time by 35% with lazy loading and code splitting. Shipped 4 features with design and backend.',
  tools: ['React', 'TypeScript'],
};

/* Stage-complete numbers (WK-06): mock, from the profile API later. */
export const COMPLETE_STATS = {
  stagesDone: '5/9',
  profile: '56%',
  earned: { playful: '+40 XP', focused: '+40 pts' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const parse = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};
const monthIndex = (ym) => {
  const { y, m } = parse(ym);
  return y * 12 + (m - 1);
};
const fmt = (ym) => `${MONTHS[parse(ym).m - 1]} ${parse(ym).y}`;

/*
 * "Jan 2024 – now · 1 yr 10 mo" / "Jun – Dec 2023 · 7 mo" (inclusive months, same convention as the Jun – Dec 2023
 * example). `now` ('YYYY-MM') ends ongoing roles: MOCK_NOW for the demo, currentMonth() for live profiles.
 */
export const formatRange = ({ start, end, current }, now = MOCK_NOW) => {
  if (!start) return '';
  const last = current || !end ? now : end;
  const total = Math.max(1, monthIndex(last) - monthIndex(start) + 1);
  const yrs = Math.floor(total / 12);
  const mos = total % 12;
  const dur = [yrs ? `${yrs} yr` : '', mos ? `${mos} mo` : ''].filter(Boolean).join(' ');
  let range;
  if (current || !end) range = `${fmt(start)} – now`;
  else if (parse(start).y === parse(end).y) range = `${MONTHS[parse(start).m - 1]} – ${fmt(end)}`;
  else range = `${fmt(start)} – ${fmt(end)}`;
  return `${range} · ${dur}`;
};

/* Delete dialog preview line: "Hubtel · Accra · Jan 2024 – now". */
export const previewMeta = (r) => {
  let range = '';
  if (r.start)
    range = r.current || !r.end ? `${fmt(r.start)} – now` : `${fmt(r.start)} – ${fmt(r.end)}`;
  return [r.org, r.place, range].filter(Boolean).join(' · ');
};

/* "MM / YYYY" text <-> 'YYYY-MM'. */
export const toField = (ym) => (ym ? `${ym.slice(5, 7)} / ${ym.slice(0, 4)}` : '');
export const fromField = (text) => {
  const m = /^\s*(\d{1,2})\s*\/\s*(\d{4})\s*$/.exec(text || '');
  if (!m) return null;
  const mm = Number(m[1]);
  if (mm < 1 || mm > 12) return null;
  return `${m[2]}-${String(mm).padStart(2, '0')}`;
};

/* Confetti on the stage-complete art (Figma 7707:186921..): [centre x, centre y, w, h, rotation deg (CSS), colour, opacity] in the 560x176 art box. */
export const COMPLETE_CONFETTI = [
  [429, 34, 8, 8, -46, '#c0392b', 0.9],
  [409, 23, 5, 11, 68, '#c0392b', 0.9],
  [119, 53, 8, 8, 51, '#ffd86b', 0.9],
  [57, 87, 8, 8, -48, '#ffd86b', 0.9],
  [104, 96, 5, 11, -2, '#387440', 1],
  [52, 142, 5, 11, 85, '#c8951a', 0.9],
  [128, 151, 5, 11, -56, '#387440', 1],
  [425, 112, 8, 8, -39, '#c0392b', 0.9],
  [530, 80, 8, 8, -48, '#c8951a', 0.9],
  [78, 35, 8, 8, 49, '#ffd86b', 0.9],
  [88, 22, 5, 11, 77, '#c0392b', 0.9],
  [477, 83, 8, 8, -48, '#c8951a', 0.9],
  [114, 122, 5, 11, 28, '#ffd86b', 0.9],
  [132, 79, 5, 11, -74, '#387440', 1],
  [119, 111, 5, 11, 26, '#387440', 1],
  [71, 79, 5, 11, -1, '#3062d4', 0.9],
  [457, 81, 5, 11, -11, '#c0392b', 0.9],
  [139, 121, 5, 11, -66, '#c8951a', 0.9],
  [424, 130, 5, 11, 84, '#c8951a', 0.9],
  [472, 121, 5, 11, 25, '#3062d4', 0.9],
];

/*
 * Live profile <-> role cards (signed-in talents). Schema: workExperience [{ company, location, position, startDate,
 * endDate, isCurrent, description }]. UI -> schema: org -> company, title -> position, location -> location,
 * start / end ('YYYY-MM') -> startDate / endDate ('YYYY-MM-01'; endDate null while current), current -> isCurrent,
 * description -> description. Employment type and tools have no profile slot and are not saved (cards loaded from the
 * profile show no type chip; the edit dialog asks for one again). Each card keeps its original item in `source`, so
 * `_id` and fields this screen does not edit are written back unchanged. The list order is the saved order.
 */
const toMonth = (value) => {
  if (!value) return null;
  const text = value instanceof Date ? value.toISOString() : String(value);
  return /^\d{4}-\d{2}/.test(text) ? text.slice(0, 7) : null;
};
const toDate = (ym) => (ym ? `${ym}-01` : null);

/* This month as 'YYYY-MM' (the "now" for ongoing live roles). */
export const currentMonth = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export const rolesFromProfile = (profile, now = currentMonth()) =>
  (Array.isArray(profile?.workExperience) ? profile.workExperience : []).map((item, i) => {
    const current = Boolean(item?.isCurrent);
    const start = toMonth(item?.startDate);
    const end = current ? null : toMonth(item?.endDate);
    const location = item?.location || '';
    return {
      id: String(item?._id ?? item?.id ?? `w${i}`),
      title: item?.position || '',
      org: item?.company || '',
      location,
      place: location.split(',')[0].trim(),
      type: '',
      start,
      end,
      current,
      rangeLabel: formatRange({ start, end, current }, now),
      description: item?.description || '',
      tools: [],
      source: item,
    };
  });

export const rolesToProfile = (roles) => ({
  workExperience: roles.map((r) => {
    const out = { ...(r.source && typeof r.source === 'object' ? r.source : {}) };
    delete out.id;
    return {
      ...out,
      company: r.org,
      position: r.title,
      location: r.location || '',
      startDate: toDate(r.start),
      endDate: r.current ? null : toDate(r.end),
      isCurrent: Boolean(r.current),
      description: r.description || '',
    };
  }),
});

/* Years-of-experience label for live profiles ("4+", "2", "<1"): earliest start to the latest end / now. */
export const yearsLabel = (roles, now = currentMonth()) => {
  const dated = roles.filter((r) => r.start);
  if (!dated.length) return '0';
  const first = Math.min(...dated.map((r) => monthIndex(r.start)));
  const last = Math.max(...dated.map((r) => monthIndex(r.current || !r.end ? now : r.end)));
  const total = Math.max(0, last - first + 1);
  const yrs = Math.floor(total / 12);
  if (!yrs) return '<1';
  return total % 12 ? `${yrs}+` : String(yrs);
};

/*
 * After a save, give the local cards the server's items (new ones get their `_id` via `source`) without losing what the
 * screen shows but cannot store (type, tools). The local `id` never changes (URLs like ?role=<id> keep pointing at it): the list was written whole and in order, so card i <-> workExperience[i].
 * Falls back to a fresh mapping when the lengths differ (another surface changed the list meanwhile).
 */
export const mergeSavedRoles = (roles, profile, now = currentMonth()) => {
  const fresh = rolesFromProfile(profile, now);
  if (fresh.length !== roles.length) return fresh;
  return roles.map((r, i) => ({ ...r, source: fresh[i].source }));
};
