import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  institutionAddStudent,
  institutionImportStudents,
  institutionRemindStudents,
  institutionRemoveStudent,
  institutionSendConsent,
  institutionStudents,
  institutionTransferStudent,
  institutionUpdateStudent,
} from '../../../../services/institutionPortal.api.js';

const log = debug('rosterStore');

/*
 * rosterStore — the institution's roster, from GET /api/institution/students (backend services/institutionRoster.service.js). A module-level store
 * shared by the students page, the student record, the dialogs and the home page; every change goes to the API and then reloads the list.
 *   students   every row (all class tabs): {id, name, initials, form, programme, profile, last, linked, status, note, pill, chips, under18, consent, ...}
 *   counts     {total, linked, notLinked, consentNeeded, tabs: {1, 2, 3, graduates}}
 *   programmes the study programmes used on the roster
 * Actions resolve to { ok, ...result } or { ok: false, message }.
 */

let state = {
  loaded: false,
  loading: false,
  error: null,
  students: [],
  counts: {
    total: 0,
    linked: 0,
    notLinked: 0,
    consentNeeded: 0,
    tabs: { 1: 0, 2: 0, 3: 0, graduates: 0 },
  },
  programmes: [],
  toast: null,
};
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const set = (patch) => {
  state = { ...state, ...patch };
  emit();
};
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => state;

/** Counts for the header, the class tabs and the filter chips (all = the current tab's size). */
export const rosterCounts = (s, tab = '3') => ({
  total: s.counts.total,
  tabs: s.counts.tabs,
  linked: s.counts.linked,
  notLinked: s.counts.notLinked,
  consentNeeded: s.counts.consentNeeded,
  all: s.counts.tabs[tab] || 0,
});

export const useRosterStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

const attempt = async (what, fn, { reload = true } = {}) => {
  try {
    const out = await fn();
    log(what, 'ok');
    if (reload) await rosterActions.load();
    return { ok: true, ...(out || {}) };
  } catch (err) {
    log(what, 'failed', err?.response?.status);
    return { ok: false, message: apiMessage(err), data: err?.response?.data };
  }
};

export const rosterActions = {
  async load() {
    set({ loading: true, error: null });
    try {
      const out = await institutionStudents();
      set({
        loaded: true,
        loading: false,
        students: out.items || [],
        counts: out.counts || state.counts,
        programmes: out.programmes || [],
      });
    } catch (err) {
      set({ loading: false, error: apiMessage(err) });
    }
  },
  /** form: {name, email, phone, ghanaCard, programme, indexNumber, dateOfBirth, form, guardianName, guardianPhone, guardianEmail, invite} */
  addStudent(form) {
    return attempt('add', async () => ({ student: await institutionAddStudent(form) }));
  },
  /** patch: {form, programme, indexNumber, guardianName, guardianPhone, guardianEmail}; resolves with the student's new detail. */
  updateStudent(id, patch) {
    return attempt('update', async () => ({ detail: await institutionUpdateStudent(id, patch) }));
  },
  removeStudent(id, reason) {
    return attempt('remove', () => institutionRemoveStudent(id, reason));
  },
  transferOut(id, to, note) {
    return attempt('transfer', () => institutionTransferStudent(id, to, note));
  },
  /** rows: [{name, ghanaCard, programme, indexNumber, dateOfBirth, form, guardianPhone, email}]; commit false = check only. */
  importRows(rows, commit, invite = true) {
    return attempt(
      'import',
      async () => ({ result: await institutionImportStudents(rows, commit, invite) }),
      { reload: commit }
    );
  },
  remind(ids) {
    return attempt('remind', async () => ({ result: await institutionRemindStudents(ids) }));
  },
  sendConsent(ids) {
    return attempt('consent', async () => ({ result: await institutionSendConsent(ids) }));
  },
  toast(t) {
    const body = typeof t === 'string' ? { message: t } : t;
    set({ toast: { id: Date.now(), ...body } });
  },
  clearToast() {
    set({ toast: null });
  },
};

/** The under-18s for the guardian consent dialog. */
export const consentRowsFor = (s) =>
  s.students
    .filter((r) => r.under18)
    .map((r) => ({
      id: r.id,
      name: r.name,
      age: r.age,
      guardian: r.guardianLine || 'No guardian contact on file',
      hasContact: Boolean(r.guardianContact),
      status: ['agreed', 'sent', 'declined'].includes(r.consent?.status)
        ? r.consent.status
        : 'none',
      date: r.consent?.date || '',
    }));
