import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('parent.api');

/*
 * Parent dashboard API (backend services/parentDashboard.service.js + parentWard.service.js).
 *
 *   GET  /parent/me                                     parent, wards (summaries), counts, recent activity
 *   GET  /parent/wards/:wardId                          ward page: summary, kpis, profile groups, flags, activity, optOut
 *   POST /parent/wards/:wardId/flags                    { fieldKey, severity, note }
 *   POST /parent/wards/:wardId/flags/:flagId/approve
 *   POST /parent/wards/:wardId/flags/:flagId/flag-again { severity, note }
 *   POST /parent-ward/opt-out                           { wardEntityId, reason, reasonCategory }
 *   POST /parent-ward/reverse-opt-out                   { wardEntityId, reversedReason? }
 *   POST /parent-ward/unlink-ward                       { wardEntityId }
 *   POST /parent/link-with-code                         { code (6 chars), relationship }
 *        errors: CODE_INVALID | CODE_EXPIRED | WARD_ALREADY_LINKED | MAX_WARDS_REACHED
 *   POST /parent/link-code                              (talent) -> { code, expiresAt }
 *
 * Every function returns the unwrapped payload and throws on failure; `parentError` turns a failure
 * into the sentence the screens show.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const enc = encodeURIComponent;

export const parentError = (err, fallback = 'Something went wrong. Try again.') => {
  const body = err?.response?.data;
  if (body?.errors && typeof body.errors === 'object') {
    const first = Object.values(body.errors)[0];
    if (first) return String(first);
  }
  return body?.message || err?.message || fallback;
};

export const parentErrorCode = (err) =>
  err?.response?.data?.type || err?.response?.data?.code || null;

export const fetchParentMe = async () => {
  const data = unwrap(await api.get('/parent/me'));
  log('me', { wards: data?.wards?.length, toReview: data?.counts?.toReview });
  return data;
};

export const fetchParentWard = async (wardId) => {
  const data = unwrap(await api.get(`/parent/wards/${enc(wardId)}`));
  log('ward', { wardId, flags: data?.flags?.length, status: data?.ward?.status });
  return data;
};

export const flagWardField = async (wardId, { fieldKey, severity, note }) =>
  unwrap(await api.post(`/parent/wards/${enc(wardId)}/flags`, { fieldKey, severity, note }));

export const approveWardFix = async (wardId, flagId) =>
  unwrap(await api.post(`/parent/wards/${enc(wardId)}/flags/${enc(flagId)}/approve`, {}));

export const flagWardFieldAgain = async (wardId, flagId, { severity, note }) =>
  unwrap(
    await api.post(`/parent/wards/${enc(wardId)}/flags/${enc(flagId)}/flag-again`, {
      severity,
      note,
    })
  );

export const optOutWard = async (wardId, { reason, reasonCategory }) =>
  unwrap(await api.post('/parent-ward/opt-out', { wardEntityId: wardId, reason, reasonCategory }));

export const restoreWard = async (wardId, reversedReason) =>
  unwrap(
    await api.post('/parent-ward/reverse-opt-out', {
      wardEntityId: wardId,
      ...(reversedReason ? { reversedReason } : {}),
    })
  );

export const unlinkWard = async (wardId) =>
  unwrap(await api.post('/parent-ward/unlink-ward', { wardEntityId: wardId }));

export const linkWardWithCode = async ({ code, relationship }) =>
  unwrap(await api.post('/parent/link-with-code', { code, relationship }));

/* Evaluate my child (started by the parent; parentDashboard evaluation actions). */
export const fetchParentEvaluations = async () => unwrap(await api.get('/parent/evaluations'));
export const fetchParentEvaluation = async (id) =>
  unwrap(await api.get(`/parent/evaluations/${enc(id)}`));
export const startParentEvaluation = async ({ wardId, kind }) =>
  unwrap(await api.post('/parent/evaluations', { wardId, kind }));
export const saveParentEvaluationDraft = async (id, answers) =>
  unwrap(await api.put(`/parent/evaluations/${enc(id)}/draft`, { answers }));
export const submitParentEvaluation = async (id) =>
  unwrap(await api.post(`/parent/evaluations/${enc(id)}/submit`, {}));
export const discardParentEvaluation = async (id) =>
  unwrap(await api.post(`/parent/evaluations/${enc(id)}/discard`, {}));

/** Talent side (Settings › Parent or guardian): a fresh 6-character code, valid 24 h. */
export const createParentLinkCode = async () => unwrap(await api.post('/parent/link-code', {}));

// Screen relationship labels -> backend values (the backend has no separate "younger sibling" or
// "aunt / uncle": those are "other").
const RELATIONSHIP_CODES = {
  mother: 'mother',
  father: 'father',
  'legal guardian': 'guardian',
  guardian: 'guardian',
  'older sibling': 'older_sibling',
};
export const toParentRelationship = (label) =>
  RELATIONSHIP_CODES[
    String(label || '')
      .trim()
      .toLowerCase()
  ] || 'other';

/** The parent's direct conversation with one ward (found or created): { conversationId, created }. Messages then use messages.api.js. */
export const openWardConversation = async (wardId) =>
  unwrap(await api.post(`/parent/wards/${encodeURIComponent(wardId)}/conversation`, {}));

/** Talent side: the parents or guardians linked to the signed-in talent: { guardians: [{ linkId, name, relationship, status, linkedAt }] }. */
export const fetchMyGuardians = async () => unwrap(await api.get('/parent/my-guardians'));
