import { INVITATIONS_RESPONSE } from './circleData.js';
import { useCircleStore } from './circleStore.js';

/*
 * useCirclePending — how many people are waiting to link up with the talent (the "3" on the Community sidebar item and on the
 * "My circle" switch): the invitations not yet ignored or accepted this session.
 */
export const useCirclePending = () => {
  const store = useCircleStore();
  return INVITATIONS_RESPONSE.received.filter(
    (r) => !store.ignored.includes(r.id) && store.relations[r.id]?.status !== 'connected'
  ).length;
};
