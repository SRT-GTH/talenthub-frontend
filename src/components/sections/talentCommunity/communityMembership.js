import { useCallback, useSyncExternalStore } from 'react';
import { debug } from '../../../utils/debug.js';
import { COMMUNITIES_RESPONSE } from './communityData.js';

const log = debug('communityMembership');

/*
 * Join / mute state shared by every Community v2 screen (frontend-only; swap for `POST /communities/:id/members`,
 * `DELETE /communities/:id/members/me` and `PUT /communities/:id/notifications` later and keep the hook's shape).
 * Seeded from the catalogue (`joined: true` = Software Engineering Ghana, as drawn) and kept in sessionStorage so a
 * Join on /community is still a Join on /community/:id in the same tab.
 *   const { joinedIds, isJoined, join, leave, muted, toggleMute } = useCommunityMembership();
 */
const KEY = 'gth:community-membership';

const seed = () => ({
  joined: COMMUNITIES_RESPONSE.communities.filter((c) => c.joined).map((c) => c.id),
  muted: [],
});

let state = null;
const listeners = new Set();

const read = () => {
  if (state) return state;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.joined) && Array.isArray(parsed.muted)) {
      state = parsed;
      return state;
    }
  } catch {
    /* storage can throw in private windows: fall through to the seed */
  }
  state = seed();
  return state;
};

const write = (next) => {
  state = next;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn());
};

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const toggleIn = (list, id, on) => {
  const has = list.includes(id);
  if (on && !has) return [...list, id];
  if (!on && has) return list.filter((x) => x !== id);
  return list;
};

export const useCommunityMembership = () => {
  const snapshot = useSyncExternalStore(subscribe, read, read);
  const join = useCallback((id) => {
    log('join', id);
    write({ ...read(), joined: toggleIn(read().joined, id, true) });
  }, []);
  const leave = useCallback((id) => {
    log('leave', id);
    write({
      joined: toggleIn(read().joined, id, false),
      muted: toggleIn(read().muted, id, false),
    });
  }, []);
  const toggleMute = useCallback((id) => {
    const on = !read().muted.includes(id);
    log('mute', id, on);
    write({ ...read(), muted: toggleIn(read().muted, id, on) });
  }, []);
  return {
    joinedIds: snapshot.joined,
    mutedIds: snapshot.muted,
    isJoined: (id) => snapshot.joined.includes(id),
    isMuted: (id) => snapshot.muted.includes(id),
    join,
    leave,
    toggleMute,
  };
};
