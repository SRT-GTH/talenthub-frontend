import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  CREDENTIALS,
  CREDENTIAL_COUNTS,
  DRAFTS,
  FORM_DEFAULTS,
  NUMBER_PREFIX,
  TOAST_BULK,
} from './data/credentialsData.js';

const log = debug('credentialsStore');

/*
 * credentialsStore — the MOCK "server state" of the credential screens (issue, revoke with two approvers, corrected copy, bulk issue) plus the form being edited.
 * ⚠️ ASSUMPTION: in memory only (a reload restores the seed). Future API: POST /institution/credentials, POST /institution/credentials/:id/revocation
 * (first / second approver), POST /institution/credentials/:id/corrected, POST /institution/credentials/bulk.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "18 / 10 / 2026" → { iso, short: "18 Oct", long: "18 Oct 2026" } (falls back to the drawn date). */
export const parseFormDate = (text) => {
  const m = /^\s*(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4})\s*$/.exec(text ?? '');
  const day = m ? Number(m[1]) : 18;
  const month = m ? Number(m[2]) : 10;
  const year = m ? Number(m[3]) : 2026;
  const label = MONTHS[Math.min(Math.max(month, 1), 12) - 1];
  return {
    iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    short: `${day} ${label}`,
    long: `${day} ${label} ${year}`,
  };
};

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

let state = {
  credentials: [...CREDENTIALS, ...DRAFTS],
  form: { ...FORM_DEFAULTS },
  added: { valid: 0, completion: 0, awards: 0 },
  revokedNow: 0,
  toast: null,
  issuedCount: 0,
};
const listeners = new Set();

const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getState = () => state;

export const useCredentialsStore = () => useSyncExternalStore(subscribe, getState, getState);

export const credentialCounts = (s) => ({
  valid: CREDENTIAL_COUNTS.valid + s.added.valid - s.revokedNow,
  revoked: CREDENTIAL_COUNTS.revoked + s.revokedNow,
  all: CREDENTIAL_COUNTS.all + s.added.valid,
  drafts: CREDENTIAL_COUNTS.drafts,
  completion: CREDENTIAL_COUNTS.completion + s.added.completion,
  awards: CREDENTIAL_COUNTS.awards + s.added.awards,
});

export const setForm = (patch) => set({ form: { ...state.form, ...patch } });
export const resetForm = () => set({ form: { ...FORM_DEFAULTS } });

export const showToast = (message, action) => {
  log('toast', message);
  set({ toast: { id: Date.now(), message, action } });
};
export const dismissToast = () => set({ toast: null });

export const issueCredential = () => {
  const { form } = state;
  const date = parseFormDate(form.date);
  const student = form.student.split(' · ')[0].trim() || FORM_DEFAULTS.student.split(' · ')[0];
  const kind = /completion/i.test(form.type) ? 'completion' : 'award';
  const n = 323 + state.issuedCount;
  const number = `${NUMBER_PREFIX}${String(n).padStart(5, '0')}`;
  const credential = {
    id: `cred-new-${state.issuedCount + 1}`,
    student,
    initials: initialsOf(student),
    status: 'valid',
    kind,
    kindLabel: kind === 'completion' ? 'Completion' : 'Award',
    number,
    title: form.type,
    sub: `${form.type} · ${form.title} · ${number}`,
    issuedOn: date.iso,
    issuedLabel: `Issued ${date.short}`,
    issuedLong: date.long,
    programme: form.title,
    grade: form.grade,
    signedBy: form.signedBy,
    second: form.second,
  };
  log('issue', credential.id, number);
  set({
    credentials: [credential, ...state.credentials],
    issuedCount: state.issuedCount + 1,
    added: {
      valid: state.added.valid + 1,
      completion: state.added.completion + (kind === 'completion' ? 1 : 0),
      awards: state.added.awards + (kind === 'award' ? 1 : 0),
    },
  });
  return credential;
};

export const approveRevocation = (id) => {
  log('revoke approved', id);
  set({
    credentials: state.credentials.map((c) =>
      c.id === id && c.status === 'revoking' ? { ...c, status: 'revoked', approvals: 2 } : c
    ),
    revokedNow: state.revokedNow + 1,
  });
};

export const applyCorrection = (id) => {
  log('corrected', id);
  set({
    credentials: state.credentials.map((c) =>
      c.id === id ? { ...c, corrected: true, number: `${c.number} (v2)` } : c
    ),
  });
};

/* ⚠️ ASSUMPTION: a bulk issue of more than 50 waits for the second approver, so nothing is added to the counts until he approves. */
export const bulkIssue = (count) => {
  log('bulk sent for approval', count);
  showToast(TOAST_BULK);
};
