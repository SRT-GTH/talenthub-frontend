/*
 * Backend notification document -> NotificationRow item.
 *
 * The backend (services/notification.service.js, models/notification.model.js) stores
 *   { _id, type, category, title, message, data, isRead, readAt, actionUrl, actionLabel,
 *     priority, createdAt }
 * and the screens were built against the mock shape in notificationsData.js
 *   { id, type, group, unread, title, body, bodyFull, quote, time, avatars | tile, actions }.
 * This file bridges the two; the UI keeps the mock shape so NotificationRow/Popover/Screen stay
 * Figma-exact.
 */
import tileAward from '../../../assets/notifications/icons/tile-award.svg';
import tileBrief from '../../../assets/notifications/icons/tile-brief.svg';

// backend `type` (notification.model.js enum) -> UI type key (NOTIFICATION_TYPES)
const TYPE_PREFIXES = [
  ['profile.viewed', 'profileView'],
  ['message', 'message'],
  ['new.message', 'message'],
  ['opportunity', 'matches'],
  ['new.opportunity', 'matches'],
  ['recommendations', 'matches'],
  ['interview', 'interview'],
  ['job_application', 'application'],
  ['application', 'application'],
  ['status.update', 'application'],
  ['engagement', 'buddy'],
  ['analysis', 'buddy'],
  ['profile', 'badge'],
  ['approval.profile', 'badge'],
  ['user.invit', 'community'],
  ['invitation', 'community'],
];

// backend `category` -> UI type key (fallback when `type` is unknown)
const CATEGORY_TYPES = {
  opportunity: 'matches',
  recommendation: 'matches',
  guidance: 'buddy',
  engagement: 'buddy',
  message: 'message',
  application: 'application',
  interview: 'interview',
  profile: 'badge',
};

export const uiTypeOf = (doc) => {
  const type = String(doc?.type || '');
  const hit = TYPE_PREFIXES.find(([prefix]) => type.startsWith(prefix));
  if (hit) return hit[1];
  return CATEGORY_TYPES[doc?.category] || 'system';
};

const DAY_MS = 24 * 60 * 60 * 1000;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Figma group for a timestamp: today / yesterday / earlier (the full screen labels earlier "This week"). */
export const groupOf = (createdAt, now = new Date()) => {
  const t = new Date(createdAt).getTime();
  if (Number.isNaN(t)) return 'earlier';
  const today = startOfDay(now);
  if (t >= today) return 'today';
  if (t >= today - DAY_MS) return 'yesterday';
  return 'earlier';
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Compact relative time, in the Figma wording: 2m · 18m · 1h · 3h · Yesterday · Mon · 12 Oct. */
export const timeLabel = (createdAt, now = new Date()) => {
  const d = new Date(createdAt);
  const t = d.getTime();
  if (Number.isNaN(t)) return '';
  const diff = Math.max(0, now.getTime() - t);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (t >= startOfDay(now)) return `${hours}h`;
  if (t >= startOfDay(now) - DAY_MS) return 'Yesterday';
  if (diff < 7 * DAY_MS) return WEEKDAYS[d.getDay()];
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

const asArray = (v) => (Array.isArray(v) ? v.filter(Boolean) : v ? [v] : []);

const avatarsOf = (doc) => {
  const d = doc?.data || {};
  const m = doc?.metadata || {};
  return asArray(
    d.avatars || d.avatarUrl || d.senderAvatar || d.avatar || m.avatars || m.avatarUrl || null
  );
};

const actionsOf = (doc) => {
  const d = doc?.data || {};
  const actions = Array.isArray(d.actions) ? d.actions : [];
  if (actions.length) {
    return actions
      .filter((a) => a && a.label)
      .map((a, i) => ({
        label: a.label,
        tone: a.tone || (i === 0 ? 'primary' : 'secondary'),
        to: a.url || a.to,
      }));
  }
  if (doc?.actionUrl) {
    return [{ label: doc.actionLabel || 'View', tone: 'primary', to: doc.actionUrl }];
  }
  return [];
};

/** One backend document -> one row item. `now` is injectable for tests. */
export const toNotificationItem = (doc, now = new Date()) => {
  const type = uiTypeOf(doc);
  const avatars = avatarsOf(doc);
  const message = doc?.message || '';
  const item = {
    id: String(doc?._id || doc?.id || ''),
    type,
    group: groupOf(doc?.createdAt, now),
    unread: !doc?.isRead,
    title: doc?.title || message || 'Notification',
    body: doc?.title ? message : '',
    bodyFull: doc?.title ? message : '',
    time: timeLabel(doc?.createdAt, now),
    createdAt: doc?.createdAt,
    priority: doc?.priority,
    actions: actionsOf(doc),
    raw: doc,
  };
  const quote = doc?.data?.preview || doc?.data?.quote;
  if (quote) item.quote = `“${String(quote).replace(/^[“"]|[”"]$/g, '')}”`;
  if (avatars.length) {
    item.avatars = avatars.slice(0, 3);
  } else {
    // No sender picture: Figma's tile variant (award = gold for achievements, brief = mint otherwise).
    const gold = type === 'badge';
    item.tile = gold ? tileAward : tileBrief;
    item.tileTone = gold ? 'gold' : 'mint';
  }
  return item;
};

export const toNotificationItems = (docs, now = new Date()) =>
  (Array.isArray(docs) ? docs : []).map((d) => toNotificationItem(d, now));
