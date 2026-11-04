/*
 * copySections — how a page section declares which of its texts staff can edit in Site copy (Platform Admin 7.8).
 *
 *   export const HOME_FAQ_COPY = copySection({
 *     id: 'public.home.faq', label: 'FAQ', pageLabel: 'Home',
 *     data: { FAQ_HEAD, FAQ_ITEMS },                       // the section's own data (the default text)
 *     fields: [['chip', 'Small label', ['FAQ_HEAD', 'chip']], ...],   // [fieldKey, label, path into data, options?]
 *     preview: { path: '/', anchor: 'faq' },                // where Site copy → Preview opens the real page
 *   });
 *
 * Two ways to use it on the page:
 *   - useCopySection(section) in a component: the data with the published text applied (landing page);
 *   - bindCopy(section) (copyBind.js): writes the published text into the section's own data objects, so every component that
 *     reads them shows it (the portals, whose texts are read by many components and helpers).
 * The same declaration feeds the admin editor (fields, labels, limits, "Original:" text) and the copy manifest the backend keeps,
 * so what staff edit is exactly what the page shows. Section ids are `<portal>.<page>.<section>` (kebab-case); backend keys and
 * field paths are the lower-camel form (`public.home.madeForGhana`, `free-question` → `freeQuestion`).
 */

const camelSeg = (s) => String(s).replace(/[-_]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());
export const copyKeyOf = (sectionId) => String(sectionId).split('.').map(camelSeg).join('.');
export const fieldPathOf = (fieldKey) => camelSeg(fieldKey);

export const at = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj);

/** A sensible limit: room to rephrase, but close to the drawn length so layouts hold. */
const limitFor = (text) => Math.max(24, Math.ceil(((text ?? '').length * 1.5) / 5) * 5);

/*
 * Placeholders. Page texts fill in values with `{first}`, `{pending}`, `{institution}` …; the backend reads `{word}` as a product-name
 * token (`{assistant}`) and refuses unknown ones, so placeholders are stored as `[first]` and turned back on the way out.
 */
export const TERM_KEYS = new Set([
  'assistant',
  'platform',
  'community',
  'circle',
  'skillsLab',
  'journey',
  'wallet',
]);
export const toStoredText = (text) =>
  typeof text === 'string'
    ? text.replace(/\{([a-z][a-zA-Z0-9]*)\}/g, (m, k) => (TERM_KEYS.has(k) ? m : `[${k}]`))
    : text;
export const fromStoredText = (text) =>
  typeof text === 'string' ? text.replace(/\[([a-z][a-zA-Z0-9]*)\](?!\()/g, '{$1}') : text;

/** Keep the original's leading / trailing spaces (the backend trims saved text; "Good morning, " is followed by a name). */
export const keepEdges = (original, text) => {
  if (typeof original !== 'string' || typeof text !== 'string') return text;
  const lead = original.match(/^\s*/)[0];
  const trail = original.match(/\s*$/)[0];
  return `${lead}${text.trim()}${trail}`;
};

export const copySection = ({
  id,
  label,
  pageLabel,
  data,
  fields,
  shared = false,
  preview = null,
}) => {
  const [portal, page] = id.split('.');
  return {
    id,
    key: copyKeyOf(id),
    portal,
    page,
    pageLabel: pageLabel ?? page,
    label,
    shared,
    preview,
    data,
    fields: fields
      // `{ optional: true }`: a field whose text isn't in this build's data (a block the design dropped) is left out.
      .filter(([, , path, opts = {}]) => !opts.optional || typeof at(data, path) === 'string')
      .map(([key, fieldLabel, path, opts = {}]) => {
        const original = at(data, path);
        if (typeof original !== 'string') throw new Error(`copySection ${id}: ${key} is not text`);
        return {
          key,
          path: fieldPathOf(key),
          dataPath: path,
          label: fieldLabel,
          kind: opts.kind ?? 'text',
          max: opts.max ?? limitFor(original),
          original,
        };
      }),
  };
};

/** Deep copy of plain objects and arrays; anything else (icons, images, functions) is kept as it is. */
const copyPlain = (v) => {
  if (Array.isArray(v)) return v.map(copyPlain);
  if (v && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype) {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copyPlain(x)]));
  }
  return v;
};

/** The section's data with `values` ({ [fieldPath]: text }) written over the defaults (a copy; the module data is untouched). */
export const applyCopy = (section, values, fill = (t) => t) => {
  if (!values || !Object.keys(values).length) return section.data;
  const out = copyPlain(section.data);
  section.fields.forEach((f) => {
    const v = values[f.path];
    if (typeof v !== 'string' || !v.trim()) return;
    const parent = at(out, f.dataPath.slice(0, -1));
    if (parent)
      parent[f.dataPath[f.dataPath.length - 1]] = keepEdges(f.original, fill(fromStoredText(v)));
  });
  return out;
};
