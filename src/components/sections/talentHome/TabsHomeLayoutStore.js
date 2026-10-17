import { useSyncExternalStore } from 'react';
import { debug } from '../../../utils/debug.js';
import { DEFAULT_HOME_CARDS } from './talentHomeTabsData.js';

const log = debug('TabsHomeLayoutStore');

/*
 * TabsHomeLayoutStore — mock persistence for HM-05 "Edit home" (order / hidden / available).
 * Module-level store so the banner, the tray and every card's edit chrome share one state.
 * Replace `load`/`commit` with API calls when the backend exists; the hook's shape
 * ({ cards, hide, show, add, move, moveBy, reset }) stays the same.
 *
 * card = { id, label, section: 'main' | 'more', state: 'shown' | 'hidden' | 'available',
 *          fromUser? }. `fromUser` marks cards hidden during editing: those also appear in the
 * "Add a card" tray (Figma: "hidden cards also appear here").
 */

const fresh = () => DEFAULT_HOME_CARDS.map((c) => ({ ...c }));
let cards = fresh();
const listeners = new Set();

const commit = (next, why) => {
  log(why, next.filter((c) => c.state !== 'available').length, 'on page');
  cards = next;
  listeners.forEach((l) => l());
};
const patch = (id, fn, why) =>
  commit(
    cards.map((c) => (c.id === id ? fn(c) : c)),
    `${why} ${id}`
  );

const store = {
  subscribe: (l) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot: () => cards,
  hide: (id) => patch(id, (c) => ({ ...c, state: 'hidden', fromUser: true }), 'hide'),
  show: (id) => patch(id, (c) => ({ ...c, state: 'shown', fromUser: false }), 'show'),
  add: (id) => patch(id, (c) => ({ ...c, state: 'shown', fromUser: false }), 'add'),
  // Move `id` to sit where `toId` is (same section only; tray-only cards don't move).
  move: (id, toId) => {
    const from = cards.findIndex((c) => c.id === id);
    const to = cards.findIndex((c) => c.id === toId);
    if (from < 0 || to < 0 || from === to || cards[from].section !== cards[to].section) return;
    const next = cards.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    commit(next, `move ${id} ->`);
  },
  // Keyboard reorder: shift by one visible slot inside the same section.
  moveBy: (id, delta) => {
    const onPage = cards.filter((c) => c.state !== 'available');
    const i = onPage.findIndex((c) => c.id === id);
    const target = onPage[i + delta];
    if (target) store.move(id, target.id);
  },
  reset: () => commit(fresh(), 'reset'),
};

export const homeLayoutStore = store;

export const useHomeLayout = () => {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return {
    cards: snapshot,
    onPage: snapshot.filter((c) => c.state !== 'available'),
    tray: snapshot.filter((c) => c.state === 'available' || (c.state === 'hidden' && c.fromUser)),
    hide: store.hide,
    show: store.show,
    add: store.add,
    move: store.move,
    moveBy: store.moveBy,
    reset: store.reset,
  };
};
