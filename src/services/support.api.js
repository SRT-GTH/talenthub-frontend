import api from './api.js';

/*
 * Support (backend services/support.service.js).
 *   Anyone signed in:   /api/support/*        ask for help, follow your requests, report a safeguarding concern
 *   Support staff:      /api/admin/support/*  the queue (who counts as staff = platformEnum role_group_support)
 * Case types, canned replies and SLA hours are platformEnum lists (Platform Admin › Settings › Lists).
 */

const body = (res) => (res && res.data && res.data.data !== undefined ? res.data.data : res?.data);
const get = async (url, params) => body(await api.get(url, { params, timeout: 30000 }));
const post = async (url, data) => body(await api.post(url, data, { timeout: 30000 }));
const clean = (o) =>
  Object.fromEntries(
    Object.entries(o || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );

// ── requester ───────────────────────────────────────────────────────────────────────────────
export const supportTypes = () => get('/support/types');
export const myRequests = () => get('/support/cases');
export const myRequest = (ref) => get(`/support/cases/${encodeURIComponent(ref)}`);
export const openRequest = (p) => post('/support/cases', clean(p));
export const replyToRequest = (ref, text) =>
  post(`/support/cases/${encodeURIComponent(ref)}/reply`, { body: text });
export const rateRequest = (ref, score, comment) =>
  post(`/support/cases/${encodeURIComponent(ref)}/rate`, clean({ score, comment }));
export const reportConcern = (p) => post('/support/concerns', clean(p));

// ── staff ───────────────────────────────────────────────────────────────────────────────────
export const supportQueue = (p = {}) => get('/admin/support/queue', clean(p));
export const supportClaimNext = () => post('/admin/support/claim-next', {});
export const supportDetail = (ref) => get(`/admin/support/${encodeURIComponent(ref)}`);
export const supportClaim = (ref) => post(`/admin/support/${encodeURIComponent(ref)}/claim`, {});
export const supportReply = (ref, p) =>
  post(`/admin/support/${encodeURIComponent(ref)}/reply`, clean(p));
export const supportNote = (ref, text) =>
  post(`/admin/support/${encodeURIComponent(ref)}/note`, { body: text });
export const supportStatus = (ref, status) =>
  post(`/admin/support/${encodeURIComponent(ref)}/status`, { status });
export const supportEscalate = (ref, p) =>
  post(`/admin/support/${encodeURIComponent(ref)}/escalate`, p);
