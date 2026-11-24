import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isLoggedIn } from '../../../../services/auth.api.js';
import { circleApi } from '../../../../services/circle.api.js';
import { debug } from '../../../../utils/debug.js';
import { isSampleMode } from '../../../../utils/sampleMode.js';
import { INVITATIONS_RESPONSE } from './circleData.js';
import { useCircleStore } from './circleStore.js';

const log = debug('useCirclePending');

/*
 * useCirclePending — how many people are waiting to link up with the talent (the count on the Community sidebar item and on the
 * "My circle" switch).
 * Signed-in talent (ADR-15): the real number, GET /circle/summary `pendingInvitations`; null (no badge) while it loads, when it
 * fails and when nobody is waiting. Demo and preview pages (`?demo=1`, `?state=`, Site copy preview, signed out) and the
 * recruiter screens (mock only) keep the drawn invitations not yet ignored or accepted this session.
 */
export const useCirclePending = () => {
  const store = useCircleStore();
  const { pathname, search } = useLocation();
  const live =
    isLoggedIn() &&
    !isSampleMode(search) &&
    !new URLSearchParams(search).has('state') &&
    !pathname.startsWith('/recruiter');
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    circleApi
      .summary()
      .then((summary) => {
        const n = summary?.pendingInvitations;
        log('live pending invitations:', n);
        if (alive) setCount(typeof n === 'number' ? n : null);
      })
      .catch((err) => log.error('summary failed:', err?.response?.status || err?.message));
    return () => {
      alive = false;
    };
  }, [live]);

  if (live) return count || null;
  return INVITATIONS_RESPONSE.received.filter(
    (r) => !store.ignored.includes(r.id) && store.relations[r.id]?.status !== 'connected'
  ).length;
};
