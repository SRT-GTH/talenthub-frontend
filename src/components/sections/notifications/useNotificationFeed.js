import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../services/notifications.api.js';
import { toNotificationItems } from './notificationsMappers.js';

const log = debug('useNotificationFeed');

/*
 * useNotificationFeed — the talent's notifications from GET /api/notifications, shared by the
 * pop-up and the full screen (each mount fetches its own copy; `enabled: false` skips the fetch
 * for a mounted-but-closed pop-up). Reads are optimistic: the row flips at once, the PUT follows,
 * a failed PUT flips it back. A read in one mount is broadcast (`NOTIFICATIONS_CHANGED` window
 * event) so other mounts — the top-nav bell count, a pop-up on the same page — stay in step.
 *
 * `startRead` seeds everything as read, which is how the Figma "inbox zero" frame (N-06,
 * `?read=all`) is reached without touching the backend.
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

export const NOTIFICATIONS_CHANGED = 'gth:notifications-changed';
const PAGE_SIZE = 50;

const broadcast = (detail) => {
  try {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED, { detail }));
  } catch {
    /* non-browser */
  }
};

export const useNotificationFeed = ({ startRead = false, enabled = true } = {}) => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(enabled ? 'loading' : 'idle'); // idle|loading|ready|error
  const [readIds, setReadIds] = useState(() => new Set());
  const source = useRef(Symbol('feed'));

  const load = useCallback(async () => {
    setStatus((s) => (s === 'ready' ? s : 'loading'));
    try {
      const { items: docs } = await fetchNotifications({ limit: PAGE_SIZE });
      setItems(toNotificationItems(docs));
      setReadIds(new Set());
      setStatus('ready');
    } catch (err) {
      log.error('load failed:', err?.response?.status || err?.message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    load();
    return undefined;
  }, [enabled, load]);

  // Another mount (pop-up vs page) changed read state: refetch so counts agree.
  useEffect(() => {
    if (!enabled) return undefined;
    const onChange = (e) => {
      if (e?.detail?.source === source.current) return;
      log('peer change → reload');
      load();
    };
    window.addEventListener(NOTIFICATIONS_CHANGED, onChange);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGED, onChange);
  }, [enabled, load]);

  const isUnread = useCallback(
    (n) => Boolean(n.unread) && !startRead && !readIds.has(n.id),
    [readIds, startRead]
  );

  const unreadCount = useMemo(() => items.filter(isUnread).length, [items, isUnread]);

  const markRead = useCallback((id) => {
    log('mark read', id);
    setReadIds((prev) => new Set(prev).add(id));
    markNotificationRead(id)
      .then(() => broadcast({ source: source.current, id }))
      .catch((err) => {
        log.error('mark read failed, reverting:', err?.response?.status || err?.message);
        setReadIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      });
  }, []);

  const markAllRead = useCallback(() => {
    log('mark all read');
    const before = readIds;
    setReadIds(new Set(items.map((n) => n.id)));
    markAllNotificationsRead()
      .then(() => broadcast({ source: source.current, all: true }))
      .catch((err) => {
        log.error('mark all read failed, reverting:', err?.response?.status || err?.message);
        setReadIds(before);
      });
  }, [items, readIds]);

  const select = useCallback(
    (filter) => {
      if (filter === 'unread') return items.filter(isUnread);
      const types = TYPE_FILTERS[filter];
      return types ? items.filter((n) => types.includes(n.type)) : items;
    },
    [items, isUnread]
  );

  // Rail / chip counts, live (the Figma numbers were placeholders).
  const counts = useMemo(() => {
    const out = { all: items.length, unread: unreadCount };
    Object.keys(TYPE_FILTERS).forEach((k) => {
      out[k] = select(k).length;
    });
    return out;
  }, [items, unreadCount, select]);

  return {
    items,
    loading: status === 'loading',
    error: status === 'error',
    ready: status === 'ready',
    refresh: load,
    isUnread,
    markAllRead,
    markRead,
    unreadCount,
    counts,
    select,
  };
};
