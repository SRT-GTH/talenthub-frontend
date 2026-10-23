import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('circleStore');

/*
 * My circle — session store (frontend-only; swap each action for its API call later).
 * What the talent does on the My circle screens lives here so the Discover list, Invitations, Circle list, the profile and the
 * feed stay in step (a link-up sent from a card shows as "Link-up sent" on the profile too). Persisted in sessionStorage.
 *
 * state.relations[personId] = { status: 'pending-sent' | 'connected' | 'none', note?: string }   overrides the API status
 * state.ignored / dismissed / removed / muted / following   arrays of person ids
 * state.endorsed[personId] = [skillId …]    state.recommended[personId] = text    state.likes[feedId] = boolean
 */
const KEY = 'circle:v1';
const EMPTY = {
  relations: {},
  ignored: [],
  dismissed: [],
  removed: [],
  muted: [],
  following: [],
  endorsed: {},
  recommended: {},
  likes: {},
  congratulated: [],
};

const load = () => {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    // storage blocked: start empty
  }
  return EMPTY;
};

let state = EMPTY;
let loaded = false;
const listeners = new Set();

const ensureLoaded = () => {
  if (loaded) return;
  loaded = true;
  state = load();
};

const commit = (next, label) => {
  state = next;
  log('state', label, next);
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage blocked: in-memory only
  }
  listeners.forEach((fn) => fn());
};

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => {
  ensureLoaded();
  return state;
};

const without = (list, id) => list.filter((x) => x !== id);
const withId = (list, id) => (list.includes(id) ? list : [...list, id]);

export const circleActions = {
  /* A link-up request goes out (with or without a note). */
  linkUp: (id, note = '') =>
    commit(
      {
        ...getSnapshot(),
        relations: { ...state.relations, [id]: { status: 'pending-sent', note } },
      },
      `linkUp ${id}`
    ),
  /* Undo from the "Link-up sent" toast. */
  undoLinkUp: (id) => {
    const relations = { ...getSnapshot().relations };
    delete relations[id];
    commit({ ...state, relations }, `undoLinkUp ${id}`);
  },
  /* Accept an invitation: they join the circle. */
  accept: (id) =>
    commit(
      { ...getSnapshot(), relations: { ...state.relations, [id]: { status: 'connected' } } },
      `accept ${id}`
    ),
  /* Ignore an invitation (the sender is not told). */
  ignore: (id) =>
    commit({ ...getSnapshot(), ignored: withId(getSnapshot().ignored, id) }, `ignore ${id}`),
  /* The little × on a suggestion card. */
  dismiss: (id) =>
    commit({ ...getSnapshot(), dismissed: withId(getSnapshot().dismissed, id) }, `dismiss ${id}`),
  removeConnection: (id) =>
    commit(
      {
        ...getSnapshot(),
        removed: withId(getSnapshot().removed, id),
        relations: { ...state.relations, [id]: { status: 'none' } },
      },
      `remove ${id}`
    ),
  restoreConnection: (id) => {
    const relations = { ...getSnapshot().relations };
    delete relations[id];
    commit({ ...state, removed: without(state.removed, id), relations }, `restore ${id}`);
  },
  toggleMute: (id) =>
    commit(
      {
        ...getSnapshot(),
        muted: state.muted.includes(id) ? without(state.muted, id) : [...state.muted, id],
      },
      `mute ${id}`
    ),
  toggleFollow: (id) =>
    commit(
      {
        ...getSnapshot(),
        following: state.following.includes(id)
          ? without(state.following, id)
          : [...state.following, id],
      },
      `follow ${id}`
    ),
  endorse: (id, skillIds) =>
    commit(
      {
        ...getSnapshot(),
        endorsed: {
          ...state.endorsed,
          [id]: [...new Set([...(state.endorsed[id] ?? []), ...skillIds])],
        },
      },
      `endorse ${id}`
    ),
  recommend: (id, text) =>
    commit(
      { ...getSnapshot(), recommended: { ...state.recommended, [id]: text } },
      `recommend ${id}`
    ),
  toggleLike: (feedId, base) =>
    commit(
      {
        ...getSnapshot(),
        likes: { ...state.likes, [feedId]: !(feedId in state.likes ? state.likes[feedId] : base) },
      },
      `like ${feedId}`
    ),
  congratulate: (id) =>
    commit(
      { ...getSnapshot(), congratulated: withId(getSnapshot().congratulated, id) },
      `congrats ${id}`
    ),
  reset: () => commit({ ...EMPTY }, 'reset'),
};

export const useCircleStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

/* Status of a person: the talent's own action wins over what the API block says. */
export const statusOf = (store, id, apiStatus = 'none') => store.relations[id]?.status ?? apiStatus;
