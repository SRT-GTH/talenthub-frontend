/*
 * Portfolio stage data. Copy verbatim from Figma PF-01..PF-06 (Playful 7709:* / 7710:*, Focused 8285:*). UI project shape:
 *   { id, title, type, year, role, description, tags[], links: [{ label, url }], pinned, cover: { name, size } | null, icon,
 *     raw? }
 * `icon` is the tile glyph Figma draws for the seeded project ('image' | 'chartBar' | 'users'); added projects use 'image'.
 * Link labels are the ones Figma draws for the seeded links; a link you type gets its host name as label.
 * SEED_PROJECTS feed the signed-out demo frames only. Signed-in talents load / save profile.portfolio through
 * projectFromProfile / projectToProfile (bottom of this file); `raw` is the profile item a UI project came from.
 */
export const PROJECT_TYPES = ['Mobile app', 'Design / UX', 'Data analysis', 'Research'];
export const MAX_DESCRIPTION = 400;

export const EXAMPLE_PROJECT = {
  id: 'example',
  title: 'Accra Bus Tracker',
  year: '2024',
  role: 'Solo developer',
  description:
    'Real-time bus tracking for Accra commuters. Live positions from 40+ drivers through a lightweight web app. Used by 200+ commuters in the KNUST pilot.',
  tags: ['React Native', 'Firebase'],
  links: [
    { label: 'Live demo', url: '' },
    { label: 'GitHub', url: '' },
  ],
};

export const SEED_PROJECTS = [
  {
    id: 'p1',
    title: 'Accra Bus Tracker',
    type: 'Mobile app',
    year: '2024',
    role: 'Solo developer',
    description:
      'Real-time bus tracking for Accra commuters. Live positions from 40+ drivers through a lightweight web app. Used by 200+ commuters in the KNUST pilot.',
    tags: ['React Native', 'Firebase'],
    links: [
      { label: 'Live demo', url: 'https://accrabuses.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/kofi/accra-bus' },
    ],
    pinned: true,
    cover: { name: 'accra-bus-cover.png', size: '840 KB' },
    icon: 'image',
  },
  {
    id: 'p2',
    title: 'GhanaPay dashboard redesign',
    type: 'Design / UX',
    year: '2024',
    role: 'Lead UX designer',
    description:
      'Redesigned the dashboard so people find balances and transfers faster. Task time dropped 28% in usability tests with 12 users.',
    tags: ['UX research', 'Figma'],
    links: [{ label: 'Figma file', url: '' }],
    pinned: false,
    cover: null,
    icon: 'image',
  },
  {
    id: 'p3',
    title: 'Youth unemployment in Ghana',
    type: 'Data analysis',
    year: '2023',
    role: 'Solo analyst',
    description:
      'Analysed unemployment data across all 16 regions with Python and Pandas. The charts were cited in a university policy brief.',
    tags: ['Python', 'Pandas'],
    links: [{ label: 'GitHub', url: '' }],
    pinned: false,
    cover: null,
    icon: 'chartBar',
  },
  {
    id: 'p4',
    title: 'Mobile money for market traders',
    type: 'Research',
    year: '2023',
    role: 'Researcher, team of 3',
    description:
      'Interviewed 24 traders at Kejetia Market about mobile money apps and proposed 5 fixes to the onboarding flow.',
    tags: ['User interviews', 'Synthesis'],
    links: [{ label: 'Notion write-up', url: '' }],
    pinned: false,
    cover: null,
    icon: 'users',
  },
];

export const COMPLETE_STATS = {
  stagesDone: '6/9',
  profile: '67%',
  earned: { playful: '+40 XP', focused: '+40 pts' },
};

/* Stage-complete confetti: [left, top, w, h, rotateDeg(CSS), colour, opacity] inside the 560x176 art. */
export const COMPLETE_CONFETTI = [
  [425, 30, 8, 8, -46, '#c0392b', 0.9],
  [407, 17, 5, 11, 68, '#c0392b', 0.9],
  [117, 48, 5, 11, 51, '#ffd86b', 0.9],
  [55, 82, 5, 11, -48, '#ffd86b', 0.9],
  [102, 91, 5, 11, -2, '#387440', 1],
  [49, 136, 5, 11, 85, '#c8951a', 0.9],
  [125, 145, 5, 11, -56, '#387440', 1],
  [422, 106, 5, 11, -39, '#c0392b', 0.9],
  [528, 74, 5, 11, -48, '#c8951a', 0.9],
  [75, 30, 5, 11, 49, '#ffd86b', 0.9],
  [85, 16, 5, 11, 77, '#c0392b', 0.9],
  [475, 78, 5, 11, -48, '#c8951a', 0.9],
  [111, 116, 5, 11, 28, '#ffd86b', 0.9],
  [129, 73, 5, 11, -74, '#387440', 1],
  [117, 106, 5, 11, 26, '#387440', 1],
  [69, 73, 5, 11, -1, '#3062d4', 0.9],
  [455, 75, 5, 11, -11, '#c0392b', 0.9],
  [137, 115, 5, 11, -66, '#c8951a', 0.9],
  [422, 125, 5, 11, 84, '#c8951a', 0.9],
  [470, 115, 5, 11, 25, '#3062d4', 0.9],
];

export const hostLabel = (url) => {
  try {
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/*
 * profile.portfolio item <-> UI project. Schema: { title, description, url, skillsUsed[], startDate, endDate } (+ _id).
 *   title / description <-> title / description;  tags <-> skillsUsed;  first link <-> url;  year <-> startDate (Jan 1).
 * Type and the second link have no schema slot and are not stored; the cover (coverImage url) and role are (2026-11-01). Pinned is list order: the first
 * project is the pinned one. Writing spreads the original item's schema keys (keeps _id, endDate, ...).
 */
// 2026-11-01: coverImage (the uploaded cover's url) and role are stored too - they were dropped before.
const PORTFOLIO_KEYS = [
  '_id',
  'title',
  'description',
  'url',
  'skillsUsed',
  'startDate',
  'endDate',
  'coverImage',
  'role',
];

const yearOf = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? '' : String(d.getUTCFullYear());
};

export const projectFromProfile = (item, index) => ({
  id: String(item?._id ?? item?.id ?? `p${index}`),
  title: item?.title || '',
  type: '',
  year: yearOf(item?.startDate),
  role: item?.role || '',
  description: item?.description || '',
  tags: Array.isArray(item?.skillsUsed) ? [...item.skillsUsed] : [],
  links: item?.url ? [{ label: hostLabel(item.url), url: item.url }] : [],
  pinned: index === 0,
  cover: item?.coverImage
    ? { name: 'Cover image', size: '', previewUrl: item.coverImage, url: item.coverImage }
    : null,
  icon: 'image',
  raw: item,
});

export const projectToProfile = (project) => {
  const raw = project.raw || {};
  const out = {};
  PORTFOLIO_KEYS.forEach((k) => {
    if (raw[k] !== undefined) out[k] = raw[k];
  });
  out.title = project.title;
  out.description = project.description || '';
  out.skillsUsed = [...(project.tags || [])];
  const url = project.links?.find((l) => l.url)?.url;
  if (url) out.url = url;
  else delete out.url;
  if (project.cover?.url) out.coverImage = project.cover.url;
  else delete out.coverImage;
  const role = (project.role || '').trim();
  if (role) out.role = role;
  else delete out.role;
  const year = /^\d{4}$/.test(project.year || '') ? project.year : '';
  if (!year) delete out.startDate;
  else if (yearOf(raw.startDate) !== year) out.startDate = `${year}-01-01`;
  return out;
};

/* Signed-in order rule: only the first project is pinned (a reorder that changes the first project re-pins). */
export const pinByOrder = (projects) =>
  projects.map((p, i) => (Boolean(p.pinned) === (i === 0) ? p : { ...p, pinned: i === 0 }));

/* After a save: a project saved with "Pin" checked moves to the front. */
export const pinnedFirst = (projects) => {
  const pinIdx = projects.findIndex((p) => p.pinned);
  return pinByOrder(
    pinIdx > 0
      ? [projects[pinIdx], ...projects.slice(0, pinIdx), ...projects.slice(pinIdx + 1)]
      : projects
  );
};

/*
 * After a save + re-read: attach the stored item as `raw` (so later saves carry its _id). The local `id` never changes
 * (open dialogs / URLs keep pointing at it). Items that already had an _id are matched by it; items without one
 * take the stored items whose _id no local item claims, in order. Returns null when the lists don't line up.
 */
export const adoptSavedIds = (list, saved) => {
  if (!Array.isArray(saved) || saved.length !== list.length) return null;
  const byId = new Map(saved.filter((s) => s?._id).map((s) => [String(s._id), s]));
  const claimed = new Set(list.map((x) => x.raw?._id && String(x.raw._id)).filter(Boolean));
  const fresh = saved.filter((s) => s?._id && !claimed.has(String(s._id)));
  let ok = true;
  const next = list.map((x) => {
    const own = x.raw?._id ? byId.get(String(x.raw._id)) : fresh.shift();
    if (!own) {
      ok = false;
      return x;
    }
    return { ...x, raw: own };
  });
  return ok ? next : null;
};
