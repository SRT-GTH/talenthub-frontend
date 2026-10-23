import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  DEMO_DRAFT,
  EMPTY_DRAFT,
  buildOwnedCommunity,
  buildSubmittedCommunity,
  slugify,
} from './createCommunityData.js';

const log = debug('createCommunityStore');

/*
 * Session store for the community a talent is creating / owns (frontend-only stand-in for POST /communities and
 * GET /communities/mine/:id). `sessionStorage` key `gth.community.created.v1` = { draft, owned: { [id]: community } }.
 * Every storage call is wrapped: private windows / blocked storage fall back to memory.
 * Frame URLs (`?demo=1` / `?state=`) never read or write it: they use in-memory fixtures (createCommunityData.js).
 */
const KEY = 'gth.community.created.v1';

const read = () => {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { draft: parsed.draft ?? null, owned: parsed.owned ?? {} };
    }
  } catch (error) {
    log.warn('read failed', error);
  }
  return { draft: null, owned: {} };
};

let snapshot = read();
const listeners = new Set();

const commit = (next) => {
  snapshot = next;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch (error) {
    log.warn('write failed', error);
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => snapshot;

/* Saved object URLs do not survive a reload: a stored blob: cover is dropped on read. */
const cleanCover = (cover) => (cover && cover.src?.startsWith('blob:') ? null : cover);

/*
 * The wizard's draft. Frame URLs (`demo`) edit a throwaway copy of the drawn draft; the real flow saves "as you go".
 * `seed` (edit mode) = a community to start from. Returns { draft, patchDraft(patch), resetDraft() }.
 */
export const useCommunityDraft = ({ demo = false, seed = null } = {}) => {
  const store = useSyncExternalStore(subscribe, getSnapshot);
  const [local, setLocal] = useState(() => seed ?? DEMO_DRAFT);
  const useLocal = demo || Boolean(seed);
  const stored = store.draft
    ? { ...store.draft, cover: cleanCover(store.draft.cover) }
    : EMPTY_DRAFT;
  const draft = useLocal ? local : stored;

  const patchDraft = useCallback(
    (patch) => {
      if (useLocal) {
        setLocal((current) => ({ ...current, ...patch }));
        return;
      }
      log('draft saved', Object.keys(patch));
      commit({ ...snapshot, draft: { ...(snapshot.draft ?? EMPTY_DRAFT), ...patch } });
    },
    [useLocal]
  );
  const resetDraft = useCallback(() => {
    if (useLocal) setLocal(EMPTY_DRAFT);
    else commit({ ...snapshot, draft: null });
  }, [useLocal]);
  return { draft, patchDraft, resetDraft };
};

/* POST /communities — turns the draft into an owned community under review; returns it. */
export const submitCommunity = (draft) => {
  const id = slugify(draft.name);
  const community = buildSubmittedCommunity(draft, id);
  log('submitted', id);
  commit({ draft: null, owned: { ...snapshot.owned, [id]: community } });
  return community;
};

/* PATCH /communities/mine/:id — real-flow edits, `fromStatus` keeps the status unless the name changed. */
export const saveOwnedCommunity = (community) => {
  commit({ ...snapshot, owned: { ...snapshot.owned, [community.id]: community } });
};

/*
 * The owner's community. Frame URLs (`demo`) get an in-memory fixture for `ownerState` (re-seeded when the state changes);
 * the real flow reads the session store. `patch(updater)` applies a change to whichever is active.
 * Returns { community, patch } — community is null when the id is unknown (the page redirects).
 */
export const useOwnedCommunity = ({ communityId, demo, ownerState, requests = 0 }) => {
  const store = useSyncExternalStore(subscribe, getSnapshot);
  const fixtureKey = `${ownerState ?? 'live'}:${requests}`;
  const [fixture, setFixture] = useState(() => ({
    key: fixtureKey,
    value: buildOwnedCommunity(ownerState ?? 'live', { requests }),
  }));
  useEffect(() => {
    if (fixture.key !== fixtureKey) {
      setFixture({
        key: fixtureKey,
        value: buildOwnedCommunity(ownerState ?? 'live', { requests }),
      });
    }
  }, [fixture.key, fixtureKey, ownerState, requests]);

  const community = useMemo(() => {
    if (demo) return fixture.key === fixtureKey ? fixture.value : null;
    return store.owned[communityId] ?? null;
  }, [demo, fixture, fixtureKey, store, communityId]);

  const patch = useCallback(
    (updater) => {
      if (demo) {
        setFixture((current) => ({ ...current, value: updater(current.value) }));
        return;
      }
      const current = snapshot.owned[communityId];
      if (!current) return;
      const next = updater(current);
      log('owned patched', communityId, next.status);
      saveOwnedCommunity(next);
    },
    [demo, communityId]
  );
  return { community, patch };
};

/* True when the talent created this community in the session (CommunityPage sends it to the owner view). */
export const useIsOwnedCommunity = (communityId) => {
  const store = useSyncExternalStore(subscribe, getSnapshot);
  return Boolean(communityId && store.owned[communityId]);
};
