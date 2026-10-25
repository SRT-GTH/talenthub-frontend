import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import { DEFAULT_DRAFT, SCHEDULED_AT, THREADS } from './data/messagesData.js';

const log = debug('messagesStore');

/*
 * messagesStore — the MOCK "server state" of the institution Messages (in memory only: a reload restores the seed).
 * Future API: POST /institution/messages (send), PATCH /institution/messages/:id (edit schedule), POST /institution/messages/:id/retry-sms.
 * Holds the thread list, the compose draft, the scheduled time of thread-3 and the SMS retry state of thread-1 (idle | retrying | done).
 */

let state = {
  threads: THREADS,
  draft: DEFAULT_DRAFT,
  scheduledAt: SCHEDULED_AT,
  scheduledSent: false,
  retry: 'idle',
  followUps: {},
  counter: 0,
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

export const updateDraft = (patch) => set({ draft: { ...state.draft, ...patch } });

/** Send the draft: a new thread goes to the top of the list. Returns its id. */
export const sendDraft = ({ title, stat, header, initials, text }) => {
  const id = `thread-new-${state.counter + 1}`;
  log('send', id);
  set({
    counter: state.counter + 1,
    draft: DEFAULT_DRAFT,
    threads: [
      {
        id,
        initials,
        title,
        when: 'Today',
        stat,
        header,
        placeholder: 'Write a follow-up…',
        timeline: [{ id: 'm1', kind: 'out', text, time: 'Now', status: '0 opened' }],
      },
      ...state.threads,
    ],
  });
  return id;
};

/** Saves the compose draft on the "Draft · …" thread. */
export const saveDraftThread = ({ title }) => {
  log('save draft');
  set({
    threads: state.threads.map((t) =>
      t.draft ? { ...t, title: `Draft · ${title}`, when: 'Today', stat: 'Not sent yet' } : t
    ),
  });
};

export const sendScheduledNow = () => {
  log('send scheduled now');
  set({ scheduledSent: true });
};

export const setScheduledAt = (value) => {
  log('reschedule', value);
  set({ scheduledAt: value });
};

export const retryDelivery = () => {
  log('retry sms');
  set({ retry: 'retrying' });
  setTimeout(() => set({ retry: 'done' }), 1500);
};

export const addFollowUp = (threadId, text) => {
  log('follow-up', threadId);
  const list = state.followUps[threadId] ?? [];
  set({
    followUps: {
      ...state.followUps,
      [threadId]: [
        ...list,
        { id: `f${list.length + 1}`, kind: 'out', text, time: 'Now', status: 'Sent' },
      ],
    },
  });
};
