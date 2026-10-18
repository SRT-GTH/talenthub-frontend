import { useCallback, useMemo, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { NOTIFICATIONS } from './notificationsData.js';

const log = debug('useNotificationFeed');

/*
 * useNotificationFeed — local read/unread state over the mock feed. Shared by the pop-up and the
 * full screen (each mounts its own copy; there is no backend yet, so state is per-mount).
 * `startRead` seeds everything as read, which is how the Figma "inbox zero" frame (N-06) is reached.
 *
 * Tab/filter -> notification types (Figma only designs All + Unread; the others are a straight
 * type filter over the same rows ⚠️ ASSUMPTION):
 *   jobs / jobs-matches  matches, interview
 *   messages             message
 *   applications         application
 *   learning             badge
 *   community            community
 *   buddy                buddy
 */
const TYPE_FILTERS = {
  jobs: ['matches', 'interview'],
  messages: ['message'],
  applications: ['application'],
  learning: ['badge'],
  community: ['community'],
  buddy: ['buddy'],
};

export const useNotificationFeed = ({ startRead = false } = {}) => {
  const [readIds, setReadIds] = useState(() =>
    startRead ? new Set(NOTIFICATIONS.map((n) => n.id)) : new Set()
  );

  const isUnread = useCallback((n) => Boolean(n.unread) && !readIds.has(n.id), [readIds]);

  const markAllRead = useCallback(() => {
    log('mark all read');
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  }, []);

  const markRead = useCallback((id) => {
    log('mark read', id);
    setReadIds((prev) => new Set(prev).add(id));
  }, []);

  const unreadCount = useMemo(() => NOTIFICATIONS.filter(isUnread).length, [isUnread]);

  const select = useCallback(
    (filter) => {
      if (filter === 'unread') return NOTIFICATIONS.filter(isUnread);
      const types = TYPE_FILTERS[filter];
      return types ? NOTIFICATIONS.filter((n) => types.includes(n.type)) : NOTIFICATIONS;
    },
    [isUnread]
  );

  return { isUnread, markAllRead, markRead, unreadCount, select };
};
