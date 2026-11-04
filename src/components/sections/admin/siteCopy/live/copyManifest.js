import { PAGES, FAQ_ITEMS, SECTION_DEFS, resolveSection } from '../editor/sectionEditorData.js';
import { SITE_PAGES } from '../browse/siteCopyBrowseData.js';
import { htmlToMd, rememberSection, toCopyKey, toFieldPath } from './copyFormat.js';

/*
 * copyManifest — the editable sections this build of the Site copy screens knows about, in the backend manifest shape
 * (POST /api/admin/copy/manifest → platformCopy.syncManifest, utils/platformCopy.normaliseManifestBlock):
 *   { key, portal, page, section, label, shared, fields: [{ path, kind: 'text' | 'rich', label, default, maxLength }] }
 * The screens' own section definitions (editor/sectionEditorData.js) are the source: every section the browse lists and the
 * editor can open, with the field set the editor draws (the FAQ gets the fields of every drawn item).
 * maxLength: plain fields keep the editor's limit; a rich field's stored Markdown is longer than what the reader sees (** and
 * {tokens}), so the backend cap is twice the visible limit — the editor's counter stays the rule people see.
 */

const allSectionIds = () => {
  const ids = new Set(Object.keys(SECTION_DEFS));
  PAGES.forEach((p) => (p.sections ?? []).forEach((s) => ids.add(s.id)));
  Object.values(SITE_PAGES).forEach((portal) => {
    (portal.pages ?? []).forEach((p) => (p.sections ?? []).forEach((s) => ids.add(s.id)));
    // shared rows are drawn as a page holding the one shared section
    (portal.shared ?? []).forEach((p) => (p.sections ?? []).forEach((s) => ids.add(s.id)));
  });
  return [...ids].filter(Boolean);
};

/** Every field of a section (the FAQ: the fields of all its items). */
export const sectionFields = (sectionId) => {
  const def = SECTION_DEFS[sectionId];
  if (def?.fieldsFor) {
    const seen = new Map();
    Object.keys(FAQ_ITEMS).forEach((n) =>
      def.fieldsFor(Number(n)).forEach((f) => seen.set(f.key, f))
    );
    return [...seen.values()];
  }
  return resolveSection(sectionId).fields;
};

const backendKind = (kind) => (kind === 'rich' ? 'rich' : 'text');

let cached = null;

/** { blocks: [...manifest blocks], byKey: { [copyKey]: { sectionId, fields: [screen field + path] } } } */
export const copyManifest = () => {
  if (cached) return cached;
  const blocks = [];
  const byKey = {};
  allSectionIds().forEach((id) => {
    const s = resolveSection(id);
    const fields = sectionFields(id);
    const key = toCopyKey(id);
    const [, , ...rest] = key.split('.');
    rememberSection(id, fields);
    byKey[key] = {
      sectionId: id,
      fields: fields.map((f) => ({ ...f, path: toFieldPath(f.key), kind: f.kind })),
    };
    blocks.push({
      key,
      portal: key.split('.')[0],
      page: key.split('.')[1],
      section: rest.join('.') || key.split('.')[1],
      label: s.label,
      shared: Boolean(s.shared),
      fields: fields.map((f) => ({
        path: toFieldPath(f.key),
        kind: backendKind(f.kind),
        label: f.label,
        default: f.kind === 'rich' ? htmlToMd(f.original ?? '') : (f.original ?? ''),
        maxLength:
          f.kind === 'rich' ? Math.min(5000, (f.max || 1000) * 2) : Math.min(5000, f.max || 160),
      })),
    });
  });
  cached = { blocks, byKey };
  return cached;
};

/** The screen field (with its backend path) of a copy key + path. */
export const manifestField = (key, path) =>
  copyManifest().byKey[key]?.fields.find((f) => f.path === path) ?? null;
