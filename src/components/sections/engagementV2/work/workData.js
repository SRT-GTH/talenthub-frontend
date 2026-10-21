/*
 * Work stage mock data (API-shaped, frontend-only; swap for GET/POST /profile/work-roles later). Copy verbatim from
 * Figma WK-01..WK-06 (Playful 7707:*, Focused 8285:*). Months are 'YYYY-MM'; `end: null` + `current: true` = ongoing.
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

/* "Jan 2024 – now · 1 yr 10 mo" / "Jun – Dec 2023 · 7 mo" (inclusive months, same convention as the Jun – Dec 2023 example). */
export const formatRange = ({ start, end, current }) => {
  if (!start) return '';
  const last = current || !end ? MOCK_NOW : end;
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
  const range = r.current || !r.end ? `${fmt(r.start)} – now` : `${fmt(r.start)} – ${fmt(r.end)}`;
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
