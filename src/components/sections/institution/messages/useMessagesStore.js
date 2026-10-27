import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import { apiMessage, listMessages } from '../../../../services/institutionPortal.api.js';
import { EMPTY_DRAFT } from './data/messagesData.js';

const log = debug('messagesStore');

/*
 * messagesStore — the thread list as GET /api/institution/messages returns it, and the compose draft (kept while the dialog moves from
 * "New message" to the "Send to n students?" confirmation). draftId is the saved draft / scheduled message being edited, if any.
 */

let state = {
  threads: [],
  counts: { all: 0, drafts: 0 },
  loaded: false,
  error: '',
  draft: EMPTY_DRAFT,
  draftId: null,
};
const listeners = new Set();

const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getState = () => state;

export const useMessagesStore = () => useSyncExternalStore(subscribe, getState, getState);

export const loadThreads = async () => {
  try {
    const res = await listMessages();
    log('threads', res?.items?.length);
    set({
      threads: res?.items ?? [],
      counts: res?.counts ?? { all: 0, drafts: 0 },
      loaded: true,
      error: '',
    });
  } catch (err) {
    set({ loaded: true, error: apiMessage(err) });
  }
};

export const updateDraft = (patch) => set({ draft: { ...state.draft, ...patch } });

/** Start a new message (draftId null) or edit a saved one. */
export const startDraft = (draft = EMPTY_DRAFT, draftId = null) =>
  set({ draft: { ...EMPTY_DRAFT, ...draft }, draftId });

export const resetDraft = () => set({ draft: EMPTY_DRAFT, draftId: null });
