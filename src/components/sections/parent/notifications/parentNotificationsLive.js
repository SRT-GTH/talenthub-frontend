import iconBell from '../../../../assets/parent/notif-bell.svg';
import iconFileCheck from '../../../../assets/parent/notif-file-check.svg';
import iconStar from '../../../../assets/parent/notif-star.svg';
import iconUserCheck from '../../../../assets/parent/notif-user-check.svg';
import iconWallet from '../../../../assets/parent/notif-wallet.svg';
import { groupOf, timeLabel } from '../../notifications/notificationsMappers.js';

/*
 * parentNotificationsLive — the signed-in parent's notifications (GET /api/notifications, the same feed the talent bell
 * and page read through notifications/useNotificationFeed) mapped onto the drawn parent row shape
 *   { id, kind, icon, title, sub, chip, chipTone, to, unread }
 * and grouped like PN-04 (Today / This week / Earlier).
 * 🔶 LIKELY: the backend has no parent-specific notification types yet, so the tab ("kind") is guessed from the
 * document's `type` / `category` words: payment / wallet / certificate / approval -> Approvals, milestone / badge /
 * achievement -> Milestones, ward / flag / link / parent -> Ward activity, anything else -> From GTH.
 * `to` is the document's actionUrl when it is an app path (never an outside link).
 */

const KINDS = [
  ['approvals', /payment|wallet|certificate|approv|top.?up/i],
  ['milestones', /milestone|badge|achiev|streak|celebrat/i],
  ['ward-activity', /ward|flag|link|parent|correct|evaluat|opt.?out/i],
];

const LOOK = {
  approvals: { chip: 'Needs you', chipTone: 'ink', icon: iconWallet },
  milestones: { chip: 'Milestone', chipTone: 'active', icon: iconStar },
  'ward-activity': { chip: 'Ward activity', chipTone: 'pending', icon: iconUserCheck },
  'from-gth': { chip: 'From GTH', chipTone: 'pending', icon: iconBell },
};

const safePath = (link) => (typeof link === 'string' && /^\/(?![/\\])/.test(link) ? link : null);

export const parentKindOf = (doc) => {
  const words = `${doc?.type || ''} ${doc?.category || ''}`;
  return KINDS.find(([, re]) => re.test(words))?.[0] || 'from-gth';
};

/** One backend document -> one drawn parent row. */
export const toParentRow = (doc, now = new Date()) => {
  const kind = parentKindOf(doc);
  const look = LOOK[kind];
  const message = doc?.message || '';
  const time = timeLabel(doc?.createdAt, now);
  const sub = [doc?.title ? message : '', time].filter(Boolean).join(' · ');
  return {
    id: String(doc?._id || doc?.id || ''),
    kind,
    icon: /certificate/i.test(doc?.type || '') ? iconFileCheck : look.icon,
    title: doc?.title || message || 'Notification',
    sub,
    chip: look.chip,
    chipTone: look.chipTone,
    to: safePath(doc?.actionUrl) || safePath(doc?.data?.url),
    unread: !doc?.isRead,
    group: groupOf(doc?.createdAt, now),
  };
};

const GROUPS = [
  { id: 'today', label: 'Today', from: ['today'] },
  { id: 'week', label: 'This week', from: ['yesterday', 'earlier'] },
  { id: 'older', label: 'Earlier', from: ['older'] },
];

/** Rows -> the page's cards (empty groups left out). */
export const groupParentRows = (rows) =>
  GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    rows: rows.filter((r) => g.from.includes(r.group)),
  })).filter((g) => g.rows.length > 0);

/** Tab counts from the live rows (the drawn counts are placeholders). */
export const countParentRows = (rows) => ({
  all: rows.length,
  approvals: rows.filter((r) => r.kind === 'approvals').length,
  milestones: rows.filter((r) => r.kind === 'milestones').length,
  'ward-activity': rows.filter((r) => r.kind === 'ward-activity').length,
  'from-gth': rows.filter((r) => r.kind === 'from-gth').length,
});
