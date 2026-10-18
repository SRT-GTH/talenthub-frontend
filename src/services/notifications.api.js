import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('notifications.api');

/*
 * Talent notifications API (backend services/notification.service.js, gateway /api/notifications).
 *
 *   GET  /notifications?limit&offset&isRead   { notifications, unreadCount, total }
 *   PUT  /notifications/:id/read              { success }
 *   PUT  /notifications/mark-all-read         { success, marked }
 *   GET  /notifications/preferences           { preferences }
 *   PUT  /notifications/preferences           { preferences }
 *
 * Every function returns the unwrapped payload and throws on failure (the feed hook decides what
 * the screen shows). `markNotificationRead` also sends `notificationId` in the body: the gateway
 * alias is `PUT /:id/read` but the action used to validate a `notificationId` param, so the path
 * param alone was a 422 (fixed backend-side on fix/notifications-mark-read; the body keeps both
 * backend versions working).
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchNotifications = async ({ limit = 50, offset = 0, isRead } = {}) => {
  const params = { limit, offset };
  if (isRead !== undefined) params.isRead = isRead;
  const data = unwrap(await api.get('/notifications', { params }));
  log('fetched', { count: data?.notifications?.length, unread: data?.unreadCount });
  return {
    items: data?.notifications || [],
    unreadCount: data?.unreadCount ?? 0,
    total: data?.total ?? data?.notifications?.length ?? 0,
  };
};

export const markNotificationRead = async (id) => {
  const data = unwrap(
    await api.put(`/notifications/${encodeURIComponent(id)}/read`, { notificationId: id })
  );
  log('marked read', id);
  return data;
};

export const markAllNotificationsRead = async () => {
  const data = unwrap(await api.put('/notifications/mark-all-read', {}));
  log('marked all read', data?.marked);
  return data;
};

export const fetchNotificationPreferences = async () => {
  const data = unwrap(await api.get('/notifications/preferences'));
  return data?.preferences ?? null;
};

export const updateNotificationPreferences = async (updates) => {
  const data = unwrap(await api.put('/notifications/preferences', updates));
  return data?.preferences ?? null;
};
