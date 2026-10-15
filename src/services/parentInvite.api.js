import { useMemo, useSyncExternalStore } from 'react';
import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { toGhanaE164 } from './onboardingMappers.js';
import { debug } from '../utils/debug.js';

const log = debug('parentInvite.api');

/*
 * Invited parent (flow B). The parent notice email links to
 * /onboarding/parent-invited?token=<ward token>.
 *
 *   Welcome   -> loadInvite(token): GET /parent-ward/invite (ward name, school, status)
 *                optOutWithToken(): POST /parent-ward/opt-out-with-token
 *   Identity, Contact -> saveParentDraft() (sessionStorage, no password)
 *   Security  -> setParentPassword() (memory only)
 *   Link ward -> getInvite() for the ward card
 *   Consent   -> createParentAccount(): POST /parent-ward/create-account.
 *                Signed in straight away when the email is the one the notice
 *                went to; otherwise the parent logs in (the login code verifies
 *                the new address).
 *
 * The Ghana Card step is skipped: there is no NIA verification yet.
 */

const INVITE_KEY = 'th:parent-invite';
const DRAFT_KEY = 'th:parent-draft';
let passwordInMemory = null;

// Screens and side panels re-render when the cached invite changes.
const listeners = new Set();
const notify = () => listeners.forEach((l) => l());
const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const inviteSnapshot = () => {
  try {
    return sessionStorage.getItem(INVITE_KEY);
  } catch {
    return null;
  }
};

const readJson = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
};
const writeJson = (key, value) => {
  try {
    if (value == null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: this tab still works */
  }
};

const unwrap = (data) => data?.data ?? data;

/** { token, invite } saved by loadInvite, or null. */
export const getInvite = () => readJson(INVITE_KEY);

export const loadInvite = async (token) => {
  const { data } = await api.get('/parent-ward/invite', { params: { token } });
  const invite = unwrap(data);
  writeJson(INVITE_KEY, { token, invite });
  notify();
  log('invite loaded', { status: invite?.ward?.status });
  return invite;
};

export const getParentDraft = () => readJson(DRAFT_KEY) || {};
export const saveParentDraft = (patch) => {
  const next = { ...getParentDraft(), ...patch };
  writeJson(DRAFT_KEY, next);
  return next;
};
export const setParentPassword = (pw) => {
  passwordInMemory = pw || null;
};
export const hasParentPassword = () => Boolean(passwordInMemory);

export const clearParentOnboarding = () => {
  writeJson(DRAFT_KEY, null);
  passwordInMemory = null;
};

// Screen labels -> backend relationship values.
const RELATIONSHIP_CODES = {
  Mother: 'mother',
  Father: 'father',
  'Older Sibling': 'older_sibling',
  'Legal Guardian': 'guardian',
};
export const toRelationshipCode = (label) => RELATIONSHIP_CODES[label] || 'other';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
/** day "4", month "April", year "1980" -> "1980-04-04" (or undefined). */
export const toIsoDate = ({ day, month, year }) => {
  const m = MONTHS.indexOf(month) + 1;
  const d = Number(day);
  const y = Number(year);
  if (!m || !d || !y) return undefined;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCDate() !== d || date.getUTCMonth() !== m - 1) return undefined;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};

const noPassword = () => {
  const err = new Error('Please set your password again.');
  err.code = 'PASSWORD_MISSING';
  return err;
};
const noInvite = () => {
  const err = new Error('Open the link from your notification email again.');
  err.code = 'INVITE_MISSING';
  return err;
};

export const TERMS_VERSION = '2026-10';

/** Creates the parent account and links the ward. Returns { loggedIn, email }. */
export const createParentAccount = async () => {
  const saved = getInvite();
  if (!saved?.token) throw noInvite();
  if (!passwordInMemory) throw noPassword();
  const d = getParentDraft();
  const payload = {
    wardToken: saved.token,
    firstName: d.firstName,
    lastName: d.lastName,
    middleName: d.middleName || undefined,
    relationship: toRelationshipCode(d.relationship),
    gender: d.gender || undefined,
    dateOfBirth: d.dateOfBirth || undefined,
    nationality: d.nationality || undefined,
    email: String(d.email || '')
      .trim()
      .toLowerCase(),
    phoneNumber: toGhanaE164(d.phone),
    whatsappNumber: toGhanaE164(d.whatsapp) || undefined,
    password: passwordInMemory,
    consentAccepted: true,
    termsVersion: TERMS_VERSION,
  };
  const { data } = await api.post('/parent-ward/create-account', payload);
  const res = unwrap(data);
  const session = res?.session;
  if (session?.accessToken) {
    localStorage.setItem(STORAGE_KEYS.authToken, session.accessToken);
    if (session.refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken);
    if (session.user) localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(session.user));
  }
  passwordInMemory = null;
  const result = { loggedIn: Boolean(session?.accessToken), email: payload.email };
  saveParentDraft({ created: result });
  log('parent account created; signed in:', result.loggedIn);
  return result;
};

export const OPT_OUT_REASONS = [
  { value: 'parental_withdrawal', label: 'I do not want my ward on the platform' },
  { value: 'safety_concern', label: 'I have a safety concern' },
  { value: 'profile_inaccuracy', label: 'Their details are wrong' },
  { value: 'account_misuse', label: 'The account is being misused' },
  { value: 'other', label: 'Something else' },
];

/** Pauses the ward's access with the emailed token (no account needed). */
export const optOutWithToken = async ({ reason, reasonCategory, parentName, relationship }) => {
  const saved = getInvite();
  if (!saved?.token) throw noInvite();
  const { data } = await api.post('/parent-ward/opt-out-with-token', {
    token: saved.token,
    reason,
    reasonCategory,
    parentName: parentName || undefined,
    relationship: relationship ? toRelationshipCode(relationship) : undefined,
  });
  const res = unwrap(data);
  // Reflect the new status on the cached invite.
  if (saved.invite?.ward) {
    writeJson(INVITE_KEY, {
      ...saved,
      invite: { ...saved.invite, ward: { ...saved.invite.ward, status: 'opted_out' } },
    });
    notify();
  }
  return res;
};

/** Display strings for the ward card, with neutral fallbacks. */
export const wardDisplay = (invite = getInvite()?.invite) => {
  const w = invite?.ward || {};
  const firstName = w.firstName || 'your ward';
  const fullName = [w.firstName, w.lastName].filter(Boolean).join(' ') || 'Your ward';
  const initials =
    [w.firstName, w.lastName]
      .filter(Boolean)
      .map((s) => s[0].toUpperCase())
      .join('') || 'W';
  const created = w.createdAt ? new Date(w.createdAt) : null;
  const createdLabel =
    created && !Number.isNaN(created.getTime())
      ? created.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—';
  const statusLabel =
    { active: 'Active', suspended: 'Paused', opted_out: 'Paused by parent' }[w.status] || '—';
  return {
    firstName,
    possessive: w.firstName ? `${w.firstName}'s` : "your ward's",
    fullName,
    initials,
    school: w.school || '—',
    curriculum: w.curriculum || '—',
    createdLabel,
    status: w.status || null,
    statusLabel,
    statusColor: w.status === 'active' ? '#387440' : '#c0392b',
    parentEmailMasked: invite?.parent?.emailMasked || null,
    parentName: invite?.parent?.name || '',
    parentAccountExists: Boolean(invite?.parentAccountExists),
  };
};

/** wardDisplay() that re-renders when the invite is loaded or changes. */
export const useWardDisplay = () => {
  const raw = useSyncExternalStore(subscribe, inviteSnapshot, () => null);
  return useMemo(() => {
    let invite = null;
    try {
      invite = raw ? JSON.parse(raw).invite : null;
    } catch {
      invite = null;
    }
    return wardDisplay(invite);
  }, [raw]);
};
