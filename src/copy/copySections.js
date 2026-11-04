/*
 * copySections — how a page section declares which of its texts staff can edit in Site copy (Platform Admin 7.8).
 *
 *   export const HOME_FAQ_COPY = copySection({
 *     id: 'public.home.faq', label: 'FAQ',
 *     data: { FAQ_HEAD, FAQ_ITEMS },                       // the section's own data (the default text)
 *     fields: [['chip', 'Small label', ['FAQ_HEAD', 'chip']], ...],   // [fieldKey, label, path into data, options?]
 *   });
 *   const { FAQ_HEAD, FAQ_ITEMS } = useCopySection(HOME_FAQ_COPY);    // in the component: same shapes, published text applied
 *
 * The same declaration feeds the admin editor (field list, labels, limits, "Original:" text) and the copy manifest the backend keeps,
 * so what staff edit is exactly what the page shows. Section ids are `<portal>.<page>.<section>` (kebab-case); backend keys and field
 * paths are the lower-camel form (`public.home.madeForGhana`, `free-question` → `freeQuestion`).
 */

const camelSeg = (s) => String(s).replace(/[-_]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());
export const copyKeyOf = (sectionId) => String(sectionId).split('.').map(camelSeg).join('.');
export const fieldPathOf = (fieldKey) => camelSeg(fieldKey);

const at = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj);

/** A sensible limit: room to rephrase, but close to the drawn length so layouts hold. */
const limitFor = (text) => Math.max(24, Math.ceil(((text ?? '').length * 1.5) / 5) * 5);

export const copySection = ({ id, label, data, fields, shared = false }) => {
  const [portal, page] = id.split('.');
  return {
    id,
    key: copyKeyOf(id),
    portal,
    page,
    label,
    shared,
    data,
    fields: fields.map(([key, fieldLabel, path, opts = {}]) => {
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

/** The section's data with `values` ({ [fieldPath]: text }) written over the defaults (deep copy; the module data is untouched). */
export const applyCopy = (section, values, fill = (t) => t) => {
  if (!values || !Object.keys(values).length) return section.data;
  const out = structuredClone(section.data);
  section.fields.forEach((f) => {
    const v = values[f.path];
    if (typeof v !== 'string' || !v.trim()) return;
    const parent = at(out, f.dataPath.slice(0, -1));
    if (parent) parent[f.dataPath[f.dataPath.length - 1]] = fill(v);
  });
  return out;
};
