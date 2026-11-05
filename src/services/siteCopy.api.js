import api from './api.js';

/*
 * Site copy / Product names API (backend: srt-backend services/platformCopy.service.js, routes /api/admin/copy/*).
 * Permissions are checked by the backend per action (copy.read / copy.edit / copy.publish / copy.publishTerms) from the staff
 * account's entityType; every list answer carries `permissions` for the signed-in staff member.
 * Keys are backend copy keys (`public.home.howItWorks`), not the screen ids (`public.home.how-it-works`): see live/copyFormat.js.
 */
const body = (res) => res?.data ?? res;
const k = (key) => encodeURIComponent(key);

// ── Sections (copy blocks) ───────────────────────────────────────────────────
export const listCopyBlocks = async (params = {}) =>
  body(await api.get('/admin/copy/blocks', { params }));
export const getCopyBlock = async (key) => body(await api.get(`/admin/copy/blocks/${k(key)}`));
/** fields: { [path]: value | null } (null = back to the original). */
export const saveCopyDraft = async (key, fields, baseVersion) =>
  body(
    await api.put(`/admin/copy/blocks/${k(key)}/draft`, {
      fields,
      ...(baseVersion !== undefined ? { baseVersion } : {}),
    })
  );
export const discardCopyDraft = async (key) =>
  body(await api.post(`/admin/copy/blocks/${k(key)}/discard`, {}));
export const publishCopyBlock = async (key, reason) =>
  body(await api.post(`/admin/copy/blocks/${k(key)}/publish`, { reason }));
export const copyBlockHistory = async (key) =>
  body(await api.get(`/admin/copy/blocks/${k(key)}/history`));
export const restoreCopyBlock = async (key, version, reason) =>
  body(await api.post(`/admin/copy/blocks/${k(key)}/restore`, { version, reason }));

// ── Product names (terms) ────────────────────────────────────────────────────
export const listCopyTerms = async () => body(await api.get('/admin/copy/terms'));
export const saveTermDraft = async (key, forms) =>
  body(await api.put(`/admin/copy/terms/${k(key)}/draft`, { forms }));
export const discardTermDrafts = async () => body(await api.post('/admin/copy/terms/discard', {}));
/** Publishes EVERY saved name draft at once (backend rule). */
export const publishTerms = async (reason) =>
  body(await api.post('/admin/copy/terms/publish', { reason }));

// ── Preview and manifest ─────────────────────────────────────────────────────
export const copyPreviewToken = async () => body(await api.post('/admin/copy/preview-token', {}));
/** Super admin / release pipeline only: upsert the editable sections the frontend knows about. */
export const syncCopyManifest = async (blocks, { retireMissing = false } = {}) =>
  body(await api.post('/admin/copy/manifest', { blocks, retireMissing }));
