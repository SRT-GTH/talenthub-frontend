/*
 * supportModel.js — view helpers for Platform Admin › Support queries on live data (GET /api/admin/support/queue, /:ref).
 * Pure functions, no React. Tabs / chips / rows follow the queue config of AdminQueueView (Figma 7.7.1a).
 */

export const SUPPORT_TABS = [
  { id: 'open', label: 'Open' },
  { id: 'waiting', label: 'Waiting on user' },
  { id: 'escalated', label: 'Escalated' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'all', label: 'All' },
];

export const STATUS_LABEL = {
  new: 'New',
  open: 'Open',
  waiting: 'Waiting on user',
  escalated: 'Escalated',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const STATUS_ACTION = {
  open: 'Reopen',
  waiting: 'Mark waiting on user',
  resolved: 'Mark resolved',
  closed: 'Close',
};

const ROLE_LABEL = {
  talent: 'talent',
  parent: 'guardian',
  recruiter: 'recruiter',
  government_institution: 'agency',
  institution_admin: 'school',
  content_moderator: 'staff',
  support_agent: 'staff',
  senior_admin: 'staff',
  super_admin: 'staff',
};

export const roleLabel = (t) => ROLE_LABEL[t] || (t ? String(t).replace(/_/g, ' ') : 'user');

/** "40m", "6h", "3d" since a date. */
export const ageOf = (at, now = Date.now()) => {
  const ms = now - new Date(at).getTime();
  if (!Number.isFinite(ms)) return '';
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h`;
  return `${Math.round(h / 24)}d`;
};

export const timeOf = (at) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(at));

export const dateTimeOf = (at) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(at));

/** One queue row → QueueRow's shape. */
export const rowOf = (r, me) => {
  const mine = r.assignee && me && r.assignee.userId === me.userId;
  const chips = [];
  if (r.overdue) chips.push({ label: 'Overdue', tone: 'amber' });
  chips.push({ label: r.typeLabel, tone: 'green' });
  if (r.requester.isMinor) chips.push({ label: 'Minor', tone: 'grey' });
  else if (r.priority === 'urgent' || r.priority === 'high')
    chips.push({ label: r.priority === 'urgent' ? 'Urgent' : 'High', tone: 'grey' });
  const closed = r.status === 'resolved' || r.status === 'closed';
  return {
    id: r.ref,
    lead: {
      icon: r.restricted
        ? 'warning'
        : r.requester.segment === 'orgs'
          ? 'company'
          : r.type === 'account'
            ? 'shield'
            : 'book',
    },
    title: `${r.ref} · ${r.subject}`,
    sticker: mine
      ? 'Mine'
      : r.status === 'escalated'
        ? 'Escalated'
        : r.status === 'new'
          ? 'New'
          : null,
    sub: `${r.requester.name} · ${roleLabel(r.requester.entityType)} · ${
      r.assignee && !mine ? `with ${r.assignee.name} · ` : ''
    }sent ${ageOf(r.createdAt)} ago`,
    chips: chips.slice(0, 3),
    pill: { label: closed ? 'View' : STATUS_LABEL[r.status] || r.status, strong: !closed && mine },
    age: '',
    muted: closed,
    button: null,
    to: `/admin/support/${r.ref}`,
    sortAt: new Date(r.createdAt).getTime(),
  };
};

/** The "Mine / All" list beside the conversation. */
export const listItemOf = (r, me, selectedRef) => ({
  id: r.ref,
  title: `${r.ref} · ${r.typeLabel}`,
  subject: r.subject,
  age: ageOf(r.createdAt),
  status:
    r.assignee && me && r.assignee.userId === me.userId
      ? `${STATUS_LABEL[r.status]} · yours`
      : r.assignee
        ? `${STATUS_LABEL[r.status]} · ${r.assignee.name}`
        : STATUS_LABEL[r.status],
  overdue: r.overdue,
  selected: r.ref === selectedRef,
});

/** Initials for the monogram. */
export const monogramOf = (name) =>
  String(name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
