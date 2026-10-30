import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../../services/notifications.api.js';
import { debug } from '../../../../utils/debug.js';
import iconHeart from '../../../../assets/parent/notif-heart.svg';
import iconFileCheck from '../../../../assets/parent/notif-file-check.svg';
import iconUserCheck from '../../../../assets/parent/notif-user-check.svg';
import iconUserPlus from '../../../../assets/parent/notif-user-plus.svg';
import iconRefresh from '../../../../assets/parent/notif-refresh.svg';
import iconBell from '../../../../assets/parent/notif-bell.svg';
import { useParentLiveMode } from './parentLive.js';
import { whenText } from './parentLiveView.js';

const log = debug('parentNotifications');

/*
 * parentNotifications — the signed-in parent's notifications (GET /notifications) for the bell panel, the top-bar count
 * and /parent/notifications, in the row shape the drawn screens read (notificationsData: id, icon, title, sub, chip,
 * chipTone, kind, to, unread).
 * The parent services keep what happened in `data.kind` (the stored `type` is the notification model's generic one,
 * see backend parentWard._notify); the tab and the row's link follow that kind.
 */
const KINDS = {
  // Needs the parent: corrections to check
  'ward.flag.fixed': {
    tab: 'approvals',
    chip: 'Needs you',
    tone: 'pending',
    icon: iconRefresh,
    to: '/parent/review?tab=corrections',
  },
  // Ward activity
  ward_opted_out: {
    tab: 'ward-activity',
    chip: 'Ward activity',
    tone: 'ink',
    icon: iconUserCheck,
    to: '/parent/wards',
  },
  ward_opt_out_reversed_confirm: {
    tab: 'ward-activity',
    chip: 'Ward activity',
    tone: 'ink',
    icon: iconUserCheck,
    to: '/parent/wards',
  },
  parent_evaluation_request: {
    tab: 'approvals',
    chip: 'Needs you',
    tone: 'pending',
    icon: iconFileCheck,
    to: '/parent/evaluate',
  },
  parent_linked: {
    tab: 'ward-activity',
    chip: 'Ward activity',
    tone: 'ink',
    icon: iconUserPlus,
    to: '/parent/wards',
  },
  // Milestones (a ward shared something)
  milestone_shared: {
    tab: 'milestones',
    chip: 'Milestone',
    tone: 'active',
    icon: iconHeart,
    to: null,
  },
};
const FROM_GTH = { tab: 'from-gth', chip: 'From GTH', tone: 'ink', icon: iconBell, to: null };

export const notificationRow = (n) => {
  const kind = (n.data && n.data.kind) || n.type;
  const k = KINDS[kind] || FROM_GTH;
  return {
    id: String(n._id || n.id),
    kind: k.tab,
    icon: k.icon,
    title: n.title || 'Notification',
    sub: [n.message, whenText(n.createdAt)].filter(Boolean).join(' · '),
    chip: k.chip,
    chipTone: k.tone,
    to: k.to,
    unread: !n.isRead,
    at: n.createdAt,
  };
};

let state = { status: 'idle', rows: [], unread: 0, error: null };
const listeners = new Set();
const emit = (next) => {
  state = next;
  listeners.forEach((l) => l());
};
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const loadParentNotifications = async () => {
  if (state.status === 'loading') return;
  emit({ ...state, status: state.rows.length ? 'ready' : 'loading' });
  try {
    const { items, unreadCount } = await fetchNotifications({ limit: 50 });
    emit({ status: 'ready', rows: items.map(notificationRow), unread: unreadCount, error: null });
  } catch (err) {
    log('load failed', err?.message);
    emit({ ...state, status: 'error', error: err?.message || 'failed' });
  }
};

/** { live, status, rows, unread, markRead(id), markAllRead() } — loads on first use. */
export const useParentNotifications = () => {
  const live = useParentLiveMode();
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
  const idle = s.status === 'idle';
  useEffect(() => {
    if (live && idle) loadParentNotifications();
  }, [live, idle]);
  const markRead = useCallback(async (id) => {
    const row = state.rows.find((r) => r.id === id);
    if (!row || !row.unread) return;
    emit({
      ...state,
      rows: state.rows.map((r) => (r.id === id ? { ...r, unread: false } : r)),
      unread: Math.max(0, state.unread - 1),
    });
    await markNotificationRead(id).catch((err) => log('mark read failed', err?.message));
  }, []);
  const markAllRead = useCallback(async () => {
    emit({ ...state, rows: state.rows.map((r) => ({ ...r, unread: false })), unread: 0 });
    await markAllNotificationsRead().catch((err) => log('mark all read failed', err?.message));
  }, []);
  return { live, ...s, markRead, markAllRead };
};

/** Rows grouped as the page draws them: Today, This week, Earlier. */
export const groupRows = (rows) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekAgo = start - 6 * 864e5;
  const t = (r) => new Date(r.at).getTime();
  return [
    { id: 'today', label: 'Today', rows: rows.filter((r) => t(r) >= start) },
    { id: 'week', label: 'This week', rows: rows.filter((r) => t(r) < start && t(r) >= weekAgo) },
    { id: 'earlier', label: 'Earlier', rows: rows.filter((r) => t(r) < weekAgo) },
  ].filter((g) => g.rows.length);
};
