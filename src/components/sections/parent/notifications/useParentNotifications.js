import iconBell from '../../../../assets/parent/notif-bell.svg';
import { useNotificationFeed } from '../../notifications/useNotificationFeed.js';
import { useParentLiveMode } from '../live/parentLive.js';

/*
 * useParentNotifications — the signed-in parent's own notifications (ADR-15): GET /notifications through the shared feed hook,
 * shaped like the drawn rows (data/notificationsData.js: id, icon, title, sub, chip, chipTone, to) and grouped Today / Earlier.
 * Demo frames (`?state=`, `?demo=1`, Site copy preview, signed out) get `live: false` and keep the drawn rows.
 * Returns { live, feed, rows, groups }.
 */
const internalPath = (to) =>
  typeof to === 'string' && to.startsWith('/') && !to.startsWith('//') ? to : null;

export const useParentNotifications = () => {
  const live = useParentLiveMode();
  const feed = useNotificationFeed({ enabled: live });
  const rows = live
    ? feed.items.map((item) => {
        const unread = feed.isUnread(item);
        return {
          id: item.id,
          kind: 'all',
          today: item.group === 'today',
          icon: iconBell,
          title: item.title,
          sub: [item.body, item.time].filter(Boolean).join(' · '),
          chip: unread ? 'New' : 'From GTH',
          chipTone: unread ? 'active' : 'pending',
          to: internalPath(item.actions?.[0]?.to),
        };
      })
    : [];
  const groups = [
    { id: 'today', label: 'Today', rows: rows.filter((r) => r.today) },
    { id: 'earlier', label: 'Earlier', rows: rows.filter((r) => !r.today) },
  ].filter((g) => g.rows.length);
  return { live, feed, rows, groups };
};
