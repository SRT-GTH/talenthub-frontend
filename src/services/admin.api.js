import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('admin.api');

/*
 * Platform Admin API (backend: srt-backend api.service.js, /api/admin/*).
 * Role gates live inside each backend action (ctx.meta.user.entityType):
 *   super_admin (SA) > senior_admin (SNA) > support_agent (AG) > content_moderator (CM).
 * Responses are returned as-is (no envelope). List endpoints answer { records, total, limit, offset }.
 * Note: accounts/staff `total` is the page length, not the true count (backend bug).
 * Ids are Mongo ObjectIds; docs carry `_id` or `id`, so use docId().
 */

export const docId = (doc) => String(doc?._id || doc?.id || '');

const body = (res) => res?.data ?? res;
const get = async (url, params) => body(await api.get(url, { params }));
const post = async (url, data) => body(await api.post(url, data));
const patch = async (url, data) => body(await api.patch(url, data));
const del = async (url) => body(await api.delete(url));

/** Error message from an axios error (backend sends { message, code, type } or { errors }). */
export const adminError = (err, fallback = 'Something went wrong. Try again.') => {
  const d = err?.response?.data;
  if (d?.errors && typeof d.errors === 'object') {
    const first = Object.values(d.errors)[0];
    if (first) return String(first);
  }
  const msg = d?.message || err?.message || fallback;
  log('error', err?.response?.status, d?.type || d?.code, msg);
  return msg;
};
export const adminErrorType = (err) => err?.response?.data?.type || err?.response?.data?.data?.code || null;
export const adminStatus = (err) => err?.response?.status || 0;

const clean = (o) => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => v !== undefined && v !== null && v !== ''));

// ── Staff (SA writes; SA + SNA read) ─────────────────────────────────────────
export const listStaff = (p = {}) => get('/admin/staff', clean({ limit: 50, offset: 0, ...p }));
export const getStaff = (id) => get(`/admin/staff/${id}`);
export const createStaff = (p) => post('/admin/staff', clean(p));
export const updateStaff = (id, p) => patch(`/admin/staff/${id}`, clean(p));
export const deactivateStaff = (id, reason) => post(`/admin/staff/${id}/deactivate`, { reason });
export const reactivateStaff = (id) => post(`/admin/staff/${id}/reactivate`, {});

// ── Accounts (SA, SNA, AG) ───────────────────────────────────────────────────
export const searchAccounts = (p = {}) => get('/admin/accounts', clean({ limit: 50, offset: 0, ...p }));
export const viewAccount = (id) => get(`/admin/accounts/${id}`);
export const accountActivity = (entityId, p = {}) => get(`/audit/entity/${entityId}`, clean({ limit: 20, ...p }));

// ── Lifecycle ────────────────────────────────────────────────────────────────
export const suspendAccount = (id, { reason, suspendUntil = null, silent = false }) =>
  post(`/admin/lifecycle/${id}/suspend`, { reason, suspendUntil, silent });
export const unsuspendAccount = (id, reason) => post(`/admin/lifecycle/${id}/unsuspend`, clean({ reason }));
export const deleteAccount = (id, reason) => post(`/admin/lifecycle/${id}/delete`, { reason });
export const cancelDeleteAccount = (id, reason) => post(`/admin/lifecycle/${id}/cancel-delete`, { reason });
export const mergeAccounts = (primaryAccountId, secondaryAccountId, reason) =>
  post('/admin/lifecycle/merge', { primaryAccountId, secondaryAccountId, reason });
export const overrideField = (id, { fieldName, newValue, reason, silent = false }) =>
  post(`/admin/lifecycle/${id}/override`, { fieldName, newValue, reason, silent });
export const reverseOverride = (id, overrideIndex, reason) =>
  post(`/admin/lifecycle/${id}/reverse-override`, { overrideIndex, reason });

// ── Approvals ────────────────────────────────────────────────────────────────
export const listApprovals = async (p = {}) => {
  const data = await get('/admin/approvals', clean({ limit: 50, offset: 0, ...p }));
  return Array.isArray(data) ? data : data?.records || [];
};
export const getApproval = (approvalId) => get(`/admin/approvals/${approvalId}`);
export const resolveApproval = (approvalId, decision, reason) =>
  post(`/admin/approvals/${approvalId}/resolve`, clean({ decision, reason }));

// ── Moderation (SA, SNA, CM) ─────────────────────────────────────────────────
export const flagQueue = (p = {}) => get('/admin/moderation/flags', clean({ limit: 50, offset: 0, ...p }));
export const resolveFlag = (flagId, { action, reason, warnAuthor = false }) =>
  post(`/admin/moderation/flags/${flagId}/resolve`, { action, reason, warnAuthor });
export const escalateFlag = (flagId, { escalationReason, escalationSeverity = 'normal', escalationNotes }) =>
  post(`/admin/moderation/flags/${flagId}/escalate`, clean({ escalationReason, escalationSeverity, escalationNotes }));
export const restoreFlag = (flagId, reason) => post(`/admin/moderation/flags/${flagId}/restore`, { reason });
export const proactiveRemove = (p) => post('/admin/moderation/remove', p);
export const postQueue = (p = {}) => get('/admin/moderation/posts', clean({ limit: 50, offset: 0, ...p }));
export const reclassifyPost = (postId, newTag, reason) =>
  post(`/admin/moderation/posts/${postId}/reclassify`, clean({ newTag, reason }));
export const issueWarning = (p) => post('/admin/moderation/warnings', clean(p));

// ── Reports (generate: all staff, scoped by type; realtime: SA, SNA) ─────────
export const generateReport = (reportType, p = {}) => post('/admin/reports/generate', clean({ reportType, ...p }));
export const exportReport = (reportType, p = {}) => post('/admin/reports/export', clean({ reportType, ...p }));
export const reportStatus = (id) => get(`/admin/reports/${id}/status`);
export const realtime = () => get('/admin/reports/realtime');

// ── Comms ────────────────────────────────────────────────────────────────────
export const listTemplates = (p = {}) => get('/admin/comms/templates', clean({ limit: 100, offset: 0, ...p }));
export const createTemplate = (p) => post('/admin/comms/templates', clean(p));
export const updateTemplate = (id, p) => patch(`/admin/comms/templates/${id}`, clean(p));
export const deleteTemplate = (id) => del(`/admin/comms/templates/${id}`);
export const sendDirect = (p) => post('/admin/comms/send-direct', clean(p));
export const sendBulk = (p) => post('/admin/comms/send-bulk', p);
export const bulkStatus = (jobId) => get(`/admin/comms/bulk/${jobId}/status`);

// ── Platform config (SA) ─────────────────────────────────────────────────────
export const listConfig = (p = {}) => get('/admin/config', clean(p));
export const updateConfig = (key, value, reason) => patch(`/admin/config/${encodeURIComponent(key)}`, { value, reason });
export const toggleFlag = (key, enabled, reason) =>
  post(`/admin/config/flags/${encodeURIComponent(key)}/toggle`, { enabled, reason });
export const configHistory = (key) => get(`/admin/config/${encodeURIComponent(key)}/history`);
/** Allowlisted settings any signed-in account can read (e.g. onboarding.bulk_roster_template). */
export const getPublicConfig = (key) => get(`/config/public/${encodeURIComponent(key)}`);

// ── Audit (SA raw, SNA masked) ───────────────────────────────────────────────
export const searchAudit = (p = {}) => get('/admin/audit/search', clean({ limit: 50, offset: 0, ...p }));
export const exportAudit = (p = {}) => post('/admin/audit/export', clean({ exportFormat: 'csv', ...p }));

// ── Observability (Senior / Super Admin; Grafana Cloud read through the server) ─────────────────────
export const obsStatus = () => get('/admin/observability/status');
export const obsSnapshot = () => get('/admin/observability/snapshot');
/** `period` is { range } or { from, to } (ISO). */
export const obsSeries = (names, period = { range: '6h' }) => get('/admin/observability/series', clean({ names: names.join(','), ...period }));
export const obsTop = (name, period = { range: '6h' }) => get(`/admin/observability/top/${name}`, clean(period));
export const obsTraces = (kind = 'errors', limit = 20, period = { range: '24h' }) => get('/admin/observability/traces', clean({ kind, limit, ...period }));
export const obsLogs = (limit = 30) => get('/admin/observability/logs', { limit });

// ── Formatting helpers shared by the screens ─────────────────────────────────
export const personName = (u) => {
  if (!u) return '';
  const full = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
  return full || u.metadata?.displayName || u.username || u.email || 'Unnamed account';
};
export const initialsOf = (name) =>
  String(name || '?')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join('') || '?';

export const timeAgo = (iso) => {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms)) return '';
  const m = Math.round(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
export const shortDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
export const humanize = (s) =>
  String(s || '')
    .replace(/^[A-Z0-9_.]+$/, (all) => all.toLowerCase())
    .replace(/[_.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());

export const ENTITY_LABEL = {
  talent: 'Talent',
  recruiter: 'Recruiter',
  institution: 'Institution',
  parent: 'Parent',
  agency: 'Agency',
  partner: 'Partner',
  super_admin: 'Super Admin',
  senior_admin: 'Senior Admin',
  support_agent: 'Support Agent',
  content_moderator: 'Content Moderator',
};
export const entityLabel = (t) => ENTITY_LABEL[t] || humanize(t) || 'Account';
