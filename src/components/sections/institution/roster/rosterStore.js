import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import { BASE_COUNTS, CONSENT_ROWS, FORM_TABS, SEED_STUDENTS } from './data/rosterData.js';

const log = debug('rosterStore');

/*
 * rosterStore — the in-memory mock roster of the institution (⚠️ ASSUMPTION: no API; a module-level store shared by the students page, the
 * student record and the home page, lost on reload). Shaped like the future /institution/students responses.
 *   students   Form 3 rows (SEED_STUDENTS + whatever the admin adds); removed ones are dropped
 *   imported   students added by a CSV import that have no row in the list (count only)
 *   transfers  ids with a transfer request sent
 *   consentSent  the "Send 41 consent requests" action ran
 * Counts (tabs, chips, header, banner) = the Figma base + the delta of the store against the seed.
 */

let state = {
  students: SEED_STUDENTS,
  imported: 0,
  consentSent: false,
  transfers: [],
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

/** Derived counts for the header, the class tabs and the filter chips. */
export const rosterCounts = (s) => {
  const seedIds = new Set(SEED_STUDENTS.map((x) => x.id));
  const added = s.students.filter((x) => !seedIds.has(x.id));
  const removed = SEED_STUDENTS.filter((x) => !s.students.some((y) => y.id === x.id));
  const dForm3 = added.length - removed.length + s.imported;
  const dLinked = added.filter((x) => x.linked).length - removed.filter((x) => x.linked).length;
  const dNot = dForm3 - dLinked;
  const tabs = Object.fromEntries(
    FORM_TABS.map((t) => [t.id, t.base + (t.id === '3' ? dForm3 : 0)])
  );
  return {
    total: BASE_COUNTS.total + dForm3,
    tabs,
    linked: BASE_COUNTS.linked + dLinked,
    notLinked: BASE_COUNTS.notLinked + dNot,
    all: tabs['3'],
  };
};

export const useRosterStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const initialsOf = (name) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const rosterActions = {
  addStudent(form) {
    const name = form.name.trim();
    let id = slug(name);
    if (state.students.some((x) => x.id === id)) id = `${id}-${state.students.length}`;
    const s = {
      id,
      name,
      initials: initialsOf(name),
      form: form.year || '3',
      programme: form.programme,
      profile: 0,
      last: 'now',
      linked: false,
      cardVerified: true,
      note: form.invite ? 'invite sent today' : 'no invite sent',
      pill: null,
      chips: [],
      more: 0,
      under18: Boolean(form.under18),
    };
    log('add', { id });
    set({ students: [...state.students, s] });
    return s;
  },
  removeStudent(id) {
    log('remove', { id });
    set({ students: state.students.filter((x) => x.id !== id) });
  },
  transferOut(id) {
    log('transfer', { id });
    set({ transfers: [...state.transfers, id] });
  },
  importBatch({ count, rows }) {
    log('import', { count, rows: rows.length });
    const seen = new Set(state.students.map((x) => x.id));
    const fresh = rows
      .filter((r) => !seen.has(slug(r.name)))
      .map((r) => ({
        id: slug(r.name),
        name: r.name,
        initials: initialsOf(r.name),
        form: r.year || '3',
        programme: r.programme || '',
        profile: 0,
        last: 'now',
        linked: false,
        cardVerified: true,
        note: 'invite sent today',
        pill: null,
        chips: [],
        more: 0,
      }));
    set({
      students: [...state.students, ...fresh],
      imported: state.imported + Math.max(0, count - fresh.length),
    });
  },
  markConsentSent() {
    set({ consentSent: true });
  },
  toast(t) {
    const body = typeof t === 'string' ? { message: t } : t;
    set({ toast: { id: Date.now(), ...body } });
  },
  clearToast() {
    set({ toast: null });
  },
};

export const consentRowsFor = (s) =>
  CONSENT_ROWS.map((r) =>
    s.consentSent && r.status === 'none' ? { ...r, status: 'sent', date: 'today' } : r
  );
