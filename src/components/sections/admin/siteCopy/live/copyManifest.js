import { COPY_SECTIONS } from '../../../../../copy/copyRegistry.js';
import { htmlToMd, rememberSection, toBackendValue } from './copyFormat.js';

/*
 * copyManifest — the editable sections this build knows about, in the backend manifest shape
 * (POST /api/admin/copy/manifest → platformCopy.syncManifest, utils/platformCopy.normaliseManifestBlock):
 *   { key, portal, page, section, label, shared, fields: [{ path, kind: 'text' | 'rich', label, default, maxLength }] }
 * The source is the pages' own declarations (copy/copyRegistry.js), so only text a page really shows is registered.
 * maxLength: plain fields keep the editor's limit; a rich field's stored Markdown is longer than what the reader sees (** and
 * {tokens}), so the backend cap is twice the visible limit — the editor's counter stays the rule people see.
 */

/** Every field of a section. */
export const sectionFields = (sectionId) => COPY_SECTIONS[sectionId]?.fields ?? [];

const backendKind = (kind) => (kind === 'rich' ? 'rich' : 'text');

let cached = null;

/** { blocks: [...manifest blocks], byKey: { [copyKey]: { sectionId, fields: [screen field + path] } } } */
export const copyManifest = () => {
  if (cached) return cached;
  const blocks = [];
  const byKey = {};
  Object.values(COPY_SECTIONS).forEach((s) => {
    rememberSection(s.id, s.fields);
    const [, , ...rest] = s.key.split('.');
    byKey[s.key] = { sectionId: s.id, fields: s.fields };
    blocks.push({
      key: s.key,
      portal: s.key.split('.')[0],
      page: s.key.split('.')[1],
      section: rest.join('.') || s.key.split('.')[1],
      label: s.label,
      shared: Boolean(s.shared),
      fields: s.fields.map((f) => ({
        path: f.path,
        kind: backendKind(f.kind),
        label: f.label,
        default:
          f.kind === 'rich' ? htmlToMd(f.original ?? '') : toBackendValue(f, f.original ?? ''),
        maxLength:
          f.kind === 'rich' ? Math.min(5000, (f.max || 1000) * 2) : Math.min(5000, f.max || 160),
      })),
    });
  });
  cached = { blocks, byKey };
  return cached;
};

/** A backend-declared section joins the lookups (never the manifest the admin sends: the backend owns it). */
export const registerManifestSection = (s) => {
  const m = copyManifest();
  rememberSection(s.id, s.fields);
  m.byKey[s.key] = { sectionId: s.id, fields: s.fields };
};

/** The screen field (with its backend path) of a copy key + path. */
export const manifestField = (key, path) =>
  copyManifest().byKey[key]?.fields.find((f) => f.path === path) ?? null;
