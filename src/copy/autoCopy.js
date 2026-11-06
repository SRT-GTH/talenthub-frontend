import { copyKeyOf, fieldPathOf } from './copySections.js';

/*
 * autoCopy — the rest of each portal's text (detail pages, dialogs, empty states …), found in the portal's data files instead of
 * declared by hand. Every data file of a portal is one Site copy section (`<portal>.<folder>.<file>`); its fields are the strings
 * inside its exported objects and arrays that read like words people see. Ids, routes, colours, class names, icons, file names,
 * numbers, dates and sample people (names, emails, phones, companies …) are left out, and so are long lists (sample rows).
 * Top-level string exports can't be rewritten in place, so they are left out too.
 *
 * The admin builds the sections from every data file (eager glob, see portals/autoPortals.js); a portal page only loads the data
 * files that have published text (lazy glob) and binds them (copyBind.js), so pages pay nothing for files nobody edited.
 */

// Keys whose values are never copy (identifiers, links, styling, media, sample people and numbers).
const SKIP_KEYS = new Set(
  [
    'id',
    'key',
    'to',
    'href',
    'route',
    'url',
    'path',
    'link',
    'icon',
    'iconKey',
    'tint',
    'ink',
    'bg',
    'fill',
    'color',
    'colour',
    'tone',
    'kind',
    'variant',
    'look',
    'photo',
    'image',
    'img',
    'avatar',
    'initials',
    'src',
    'slug',
    'type',
    'accent',
    'shelf',
    'name',
    'firstName',
    'lastName',
    'fullName',
    'email',
    'phone',
    'company',
    'school',
    'org',
    'date',
    'when',
    'time',
    'at',
    'value',
    'count',
    'n',
    'pct',
    'score',
    'amount',
    'salary',
    'rank',
    'delta',
    'level',
    'xp',
    'pts',
    'points',
    'version',
    'className',
    'class',
    'style',
    'width',
    'height',
    'size',
    'ratio',
    'aspect',
    'format',
    'mime',
    'testId',
    'aria',
    'anchor',
  ].map((k) => k.toLowerCase())
);
const MAX_LIST = 12; // longer arrays are sample data (rows, feeds)

// Exports that hold sample records (people, rows, feeds), not interface text — unless the name says it is copy.
const SAMPLE_EXPORT =
  /(ROWS|LIST|ITEMS|SAMPLE|MOCK|PEOPLE|FEED|THREADS|CONVERSATIONS|STUDENTS|APPLICANTS|CANDIDATES|WARDS|RECORDS|MATCHES|JOBS|COURSES|POSTS|MEMBERS|USERS|CONTACTS|ACTIVITY|HISTORY|TRANSACTIONS|EVENTS|REVIEWS|QUERIES|PERSONAS?|LEADERBOARD|RANKING|SCHOOLS|DISTRICTS|REGIONS|PROGRAMMES|OPPORTUNITIES|PAYMENTS|INVOICES|LOGS?)\b/;
const COPY_EXPORT =
  /(COPY|TEXT|TEXTS|LABELS?|HEAD|HEADER|HEADING|TITLE|INTRO|HERO|EMPTY|ERROR|DIALOG|MODAL|CONFIRM|TOAST|BANNER|CTA|HELP|TIPS?|STEPS?|NAV|TABS?|FILTERS?|OPTIONS?|MENU|STRINGS)/;
const isSampleExport = (name) => SAMPLE_EXPORT.test(name) && !COPY_EXPORT.test(name);
// A record: an object describing one person / thing (has a name or photo, or an id with sample-looking fields).
const isRecord = (o) =>
  o &&
  typeof o === 'object' &&
  !Array.isArray(o) &&
  ('photo' in o ||
    'avatar' in o ||
    'initials' in o ||
    'email' in o ||
    'phone' in o ||
    ('name' in o && ('id' in o || 'age' in o || 'meta' in o)));
const MAX_DEPTH = 6;
const MAX_FIELDS = 150; // per section (the backend allows 200)

const NOT_COPY = [
  /^#[0-9a-f]{3,8}$/i, // colour
  /^(https?:|\/|mailto:|tel:|data:|cid:)/i, // link
  /^[a-z0-9]+([-_.:/][a-z0-9]+)*$/, // id, slug, route, token
  /\.(png|jpe?g|svg|webp|gif|avif|mp4|pdf|js|css)$/i, // file
  /^[\d\s.,:%+\-–/·×x]+$/i, // number, date, ratio
  /^\d{4}-\d{2}-\d{2}/, // ISO date
  /\b(bg|text|border|rounded|px|py|pt|pb|pl|pr|mx|my|w|h|min-w|max-w|flex|grid|gap|font|leading|tracking)-[\w[\]#./%-]+/, // classes
  /^[A-Z][a-zA-Z]+$/, // component / icon name ("UserIcon")
];

/** True for text a person reads (at least one letter, and not a code-like value). */
export const looksLikeCopy = (s) => {
  if (typeof s !== 'string') return false;
  const t = s.trim();
  if (t.length < 2 || t.length > 1200 || !/[A-Za-zÀ-ɏ]/.test(t)) return false;
  if (NOT_COPY.some((re) => re.test(t))) {
    // A single capitalised word ("Home", "Save") is a label, not a component name, when it is short and plain.
    return /^[A-Z][a-z]{1,15}$/.test(t);
  }
  return true;
};

const keySeg = (p) =>
  /^[A-Z][A-Z0-9_]*$/.test(String(p))
    ? String(p)
        .toLowerCase()
        .replace(/_+([a-z0-9])/g, (_, c) => c.toUpperCase())
    : String(p);

const humanise = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

/** Fields of one module: [{ key, path, dataPath, label, kind, max, original }]. */
export const fieldsOfModule = (mod, { exclude = [] } = {}) => {
  const out = [];
  const seen = new Set();
  const walk = (v, dataPath, depth) => {
    if (out.length > MAX_FIELDS * 4 || depth > MAX_DEPTH || v == null) return;
    if (typeof v === 'string') {
      if (dataPath.length < 2 || !looksLikeCopy(v)) return;
      // STATUS_LEGEND -> statusLegend, so the key maps to the same backend path everywhere (copyFormat.toFieldPath).
      const key = dataPath
        .map(keySeg)
        .join('-')
        .replace(/[^A-Za-z0-9-]/g, '');
      if (seen.has(key)) return;
      seen.add(key);
      out.push({
        key,
        path: fieldPathOf(key),
        dataPath,
        label: dataPath.map((p) => (typeof p === 'number' ? p + 1 : humanise(p))).join(' › '),
        kind: 'text',
        max: Math.max(24, Math.ceil((v.length * 1.5) / 5) * 5),
        original: v,
      });
      return;
    }
    if (isRecord(v)) return;
    if (Array.isArray(v)) {
      if (v.length > MAX_LIST) return;
      if (v.length >= 3 && v.filter(isRecord).length >= 2) return; // a list of sample records
      v.forEach((x, i) => walk(x, [...dataPath, i], depth + 1));
      return;
    }
    if (typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype) {
      const vals = Object.values(v);
      if (vals.length >= 3 && vals.filter(isRecord).length >= 2) return; // a map of sample records
      Object.entries(v).forEach(([k, x]) => {
        if (SKIP_KEYS.has(k.toLowerCase())) return;
        walk(x, [...dataPath, k], depth + 1);
      });
    }
  };
  Object.keys(mod)
    .sort()
    .forEach((name) => {
      if (
        name === 'default' ||
        name.startsWith('DEMO_') ||
        exclude.includes(name) ||
        isSampleExport(name)
      )
        return;
      const v = mod[name];
      if (v && typeof v === 'object') walk(v, [name], 1);
    });
  return out;
};

const kebab = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');

/**
 * Where a data file sits in Site copy: { portal, folder, file, id }. `roots` maps a folder prefix of the glob path to the portal and
 * the folder name staff see, e.g. { 'sections/parent/': ['parent', null], 'sections/talentJobs/': ['talent', 'jobs'] } (null: the
 * first sub-folder names the page).
 */
export const placeOf = (globPath, roots) => {
  const rel = globPath.replace(/^.*?components\//, '');
  const entry = Object.entries(roots).find(([prefix]) => rel.startsWith(prefix));
  if (!entry) return null;
  const [prefix, [portal, folderName]] = entry;
  const rest = rel.slice(prefix.length).split('/');
  const file = rest.pop().replace(/\.js$/, '');
  const folder = folderName ?? (rest.filter((x) => x !== 'data')[0] || 'main');
  return { portal, folder: kebab(folder), file: kebab(file) };
};

/**
 * Sections for a portal's data modules ({ [globPath]: module }). Ids are stable: `<portal>.<folder>.<file>[-<n>]`, sorted by path,
 * and a section with more than MAX_FIELDS fields is split into `-2`, `-3` … so every section fits the backend.
 */
export const autoSections = (modules, { roots, exclude = {}, preview = {}, ids: given }) => {
  // `ids`: computed over every data-file path (the page passes them so a few loaded files keep the admin's ids)
  const ids = given ?? autoIds(Object.keys(modules), roots);
  const sections = [];
  Object.keys(modules)
    .sort()
    .forEach((globPath) => {
      const place = ids[globPath];
      if (!place) return;
      const fields = fieldsOfModule(modules[globPath], {
        exclude: exclude[globPath.split('/').pop()] ?? [],
      });
      for (let i = 0; i < fields.length; i += MAX_FIELDS) {
        const part = i / MAX_FIELDS;
        const id = part ? `${place.id}-part${part + 1}` : place.id;
        sections.push({
          id,
          key: copyKeyOf(id),
          portal: place.portal,
          page: place.folder,
          pageLabel: humanise(place.folder),
          label: `${humanise(place.file.replace(/-?data$/, '') || place.file)} texts${part ? ` (${part + 1})` : ''}`,
          shared: false,
          auto: true,
          globPath,
          data: modules[globPath],
          fields: fields.slice(i, i + MAX_FIELDS),
          // the page's own route when known (`<portal>.<page>`), else the portal's home
          preview: preview[`${place.portal}.${place.folder}`] ?? preview[place.portal] ?? null,
        });
      }
    });
  return sections;
};

/**
 * Stable section ids for data-file paths, from the paths alone (so a page can tell which files have published text without
 * loading them): `<portal>.<folder>.<file>`, with `-2`, `-3` … when two files share a folder and name. { [globPath]: place + id }
 */
export const autoIds = (paths, roots) => {
  const out = {};
  const used = new Set();
  [...paths].sort().forEach((globPath) => {
    const place = placeOf(globPath, roots);
    if (!place) return;
    let id = `${place.portal}.${place.folder}.${place.file}`;
    for (let n = 2; used.has(id); n += 1) id = `${place.portal}.${place.folder}.${place.file}-${n}`;
    used.add(id);
    out[globPath] = { ...place, id, key: copyKeyOf(id) };
  });
  return out;
};
