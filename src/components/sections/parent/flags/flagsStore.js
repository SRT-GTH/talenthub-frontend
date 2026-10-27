import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import { FLAGS_BADGE_BASE, INITIAL_FLAGS, PROFILE_GROUPS } from './data/flagsData.js';

const log = debug('flagsStore');

/*
 * flagsStore — the in-memory mock of Abena's flags, shared by the Profile tab, the Flags tab, the dialogs and the To review page, so a flag sent on one screen shows on the others while the
 * parent navigates (the To review "Check" button lands on the Flags tab with the re-review dialog open). A module-level store (no provider) so no shared router file has to wrap it; a reload resets it.
 * State: { flags: Flag[] (drawn order: Date of birth, Volunteering, School), sent, approved } — `badge` is FLAGS_BADGE_BASE + sent - approved (see flagsData).
 * Actions: sendFlag(fieldId, { severity, note }) -> undo token, undoSend(token), approveFix(flagId), flagAgain(flagId, { severity, note }), ensureSent(), ensureApproved(flagId) (the last two make the frame URLs
 * PW-04b / PW-06b reproduce their state on a fresh load, idempotently), reset().
 * ⚠️ ASSUMPTION: a flag sent for a field that has none is added before the first approved flag; sending again on a field already flagged (Volunteering is pending in every frame) updates that flag.
 */
const FIELD_LABELS = Object.fromEntries(
  PROFILE_GROUPS.flatMap((g) => g.fields).map((f) => [f.id, f.label])
);

const fresh = () => ({ flags: INITIAL_FLAGS.map((f) => ({ ...f })), sent: 0, approved: 0 });

let state = fresh();
const listeners = new Set();

const emit = (next) => {
  state = next;
  listeners.forEach((l) => l());
};
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getState = () => state;

export const flagsBadge = (s) => FLAGS_BADGE_BASE + s.sent - s.approved;

export const flagsActions = {
  sendFlag(fieldId, { severity, note }) {
    const prev = state;
    const existing = prev.flags.find((f) => f.fieldId === fieldId);
    let flags;
    if (existing) {
      flags = prev.flags.map((f) =>
        f.fieldId === fieldId ? { ...f, status: 'pending', severity, note, flaggedOn: 'today' } : f
      );
    } else {
      const added = {
        id: fieldId,
        fieldId,
        label: FIELD_LABELS[fieldId] ?? fieldId,
        icon: 'flag',
        status: 'pending',
        flaggedOn: 'today',
        severity,
        note,
      };
      const at = prev.flags.findIndex((f) => f.status === 'approved');
      flags = [...prev.flags];
      flags.splice(at === -1 ? flags.length : at, 0, added);
    }
    log('sendFlag', { fieldId, severity, noteLength: note.length, isNew: !existing });
    emit({ ...prev, flags, sent: prev.sent + 1 });
    return prev;
  },
  undoSend(token) {
    log('undoSend');
    emit(token);
  },
  approveFix(flagId) {
    const f = state.flags.find((x) => x.id === flagId);
    if (!f || f.status === 'approved') return;
    log('approveFix', { flagId });
    emit({
      ...state,
      flags: state.flags.map((x) =>
        x.id === flagId ? { ...x, status: 'approved', approvedOn: 'today' } : x
      ),
      approved: state.approved + 1,
    });
  },
  flagAgain(flagId, { severity, note }) {
    log('flagAgain', { flagId, severity, noteLength: note.length });
    emit({
      ...state,
      flags: state.flags.map((x) =>
        x.id === flagId ? { ...x, status: 'reflagged', severity, note: x.note, againNote: note } : x
      ),
    });
  },
  ensureSent() {
    if (state.sent === 0)
      flagsActions.sendFlag('volunteering', {
        severity: 'correcting',
        note: 'It was the Osu library, not Accra Central.',
      });
  },
  ensureApproved(flagId) {
    flagsActions.approveFix(flagId);
  },
  reset() {
    emit(fresh());
  },
};

export const useWardFlags = () => useSyncExternalStore(subscribe, getState, getState);
