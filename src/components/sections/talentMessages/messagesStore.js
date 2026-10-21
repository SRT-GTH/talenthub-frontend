import { useSyncExternalStore } from 'react';
import { debug } from '../../../utils/debug.js';

const log = debug('messagesStore');

/*
 * Talent Messages — in-memory conversation state (frontend-only mocks; swap for the API later).
 * Module-level store (like messagesDraft.js) so the inbox list, the thread and the lead's dialogs share it:
 *   sent       { [convId]: item[] }   messages the talent sent in this session (kind 'sent')
 *   status     { [msgId]: status }    status overrides (retry: failed -> sending -> delivered)
 *   accepted / declined / removed / muted / read   Set-like arrays of conversation ids
 *   card       { [convId]: 'pending'|'passing'|'passed'|'applied'|'closed' }  job-card state (the thread owns it)
 * Lead hook-up: `setMessagesCardState('owura', 'applied')` when "Continue application" is pressed in the pre-apply dialog.
 */
const EMPTY = {
  sent: {},
  status: {},
  accepted: [],
  declined: [],
  removed: [],
  muted: [],
  read: [],
  card: {},
  order: [],
};
let state = EMPTY;
const listeners = new Set();
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => state;
const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn());
};
const add = (key, id) => (state[key].includes(id) ? state[key] : [...state[key], id]);
const bump = (id) => [id, ...state.order.filter((x) => x !== id)];

export const useMessagesStore = () => useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

export const nowLabel = () => {
  const d = new Date();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
};

let counter = 0;

export const messagesActions = {
  send(convId, text, { online = true } = {}) {
    const body = String(text ?? '').trim();
    if (!body) return null;
    const id = `local-${(counter += 1)}`;
    const item = { kind: 'sent', id, text: body, time: nowLabel() };
    log('send', { convId, online, chars: body.length });
    set({
      sent: { ...state.sent, [convId]: [...(state.sent[convId] ?? []), item] },
      status: { ...state.status, [id]: online ? 'delivered' : 'sending' },
      order: bump(convId),
    });
    return id;
  },
  setStatus(msgId, status) {
    log('status', msgId, status);
    set({ status: { ...state.status, [msgId]: status } });
  },
  accept(id) {
    log('accept', id);
    set({ accepted: add('accepted', id), order: bump(id) });
  },
  decline(id) {
    log('decline', id);
    set({ declined: add('declined', id) });
  },
  remove(id) {
    log('remove', id);
    set({ removed: add('removed', id) });
  },
  toggleMute(id) {
    log('toggleMute', id);
    set({
      muted: state.muted.includes(id) ? state.muted.filter((x) => x !== id) : [...state.muted, id],
    });
  },
  markRead(id) {
    if (state.read.includes(id)) return;
    log('markRead', id);
    set({ read: add('read', id) });
  },
  setCard(convId, cardState) {
    log('card', convId, cardState);
    set({ card: { ...state.card, [convId]: cardState } });
  },
  reset() {
    state = EMPTY;
    listeners.forEach((fn) => fn());
  },
};

export const setMessagesCardState = (convId, cardState) =>
  messagesActions.setCard(convId, cardState);
