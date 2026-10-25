import { docId, flagQueue, humanize, shortDate, timeAgo } from '../../../../services/admin.api.js';

/*
 * adminModerationModel — shapes the moderation flag queue (GET /api/admin/moderation/flags, Super Admin / Senior Admin / Content Moderator).
 * The backend filters one status at a time and does not return severity, category, the assigned reviewer, the flagged content or its author,
 * so rows show the reason, content type and reporter type, and there is no claim / priority. There is no GET-by-id: the detail screen finds the
 * flag in the status lists.
 */

export const FLAG_TABS = [
  { id: 'open', label: 'Pending' },
  { id: 'under_review', label: 'In review' },
  { id: 'escalated', label: 'Escalated' },
  { id: 'approved', label: 'Removed' },
  { id: 'resolved', label: 'Dismissed' },
];
/** What each backend flag status means to staff. */
export const statusLabel = (st) =>
  ({ open: 'Pending', under_review: 'In review', escalated: 'Escalated', approved: 'Removed', resolved: 'Dismissed', rejected: 'Dismissed' })[st] ||
  humanize(st);

export const FLAG_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'users', label: 'User reports' },
  { id: 'system', label: 'System flags' },
];
const SYSTEM_REPORTERS = ['admin', 'system', 'super_admin', 'senior_admin', 'content_moderator'];
export const isSystemFlag = (f) => SYSTEM_REPORTERS.includes(f?.flaggedByType);

export const flagTitle = (f) => `Flag ${docId(f).slice(-6).toUpperCase()} · ${humanize(f.flagReason || 'reported')}`;

export const flagRow = (f, base = '/admin/moderation/flags') => {
  const id = docId(f);
  const escalated = f.status === 'escalated';
  return {
    id,
    lead: { icon: f.status === 'approved' ? 'archive' : 'warning' },
    title: flagTitle(f),
    sticker: escalated ? 'Escalated' : f.isHidden ? 'Hidden' : null,
    sub: [
      humanize(f.resourceType),
      isSystemFlag(f) ? 'system flag' : `reported by a ${humanize(f.flaggedByType || 'user').toLowerCase()}`,
      `${timeAgo(f.createdAt)}`,
    ].join(' · '),
    chips: [
      { label: statusLabel(f.status), tone: escalated ? 'amber' : 'green' },
      f.metadata?.purposeTag ? { label: humanize(f.metadata.purposeTag), tone: 'grey' } : null,
      f.appealStatus ? { label: `Appeal ${humanize(f.appealStatus).toLowerCase()}`, tone: 'amber' } : null,
    ].filter(Boolean),
    pill: { label: f.status === 'open' ? 'Open' : 'View', strong: f.status === 'open' },
    age: shortDate(f.createdAt),
    muted: false,
    button: f.status === 'approved' && f.isHidden ? 'Restore' : null,
    to: `${base}/${id}`,
    flag: f,
  };
};

/** Finds a flag by id across the status lists (the backend has no GET-by-id). */
export const findFlag = async (id) => {
  for (const status of [...FLAG_TABS.map((t) => t.id), 'rejected', 'dismissed']) {
    const res = await flagQueue({ status, limit: 200 }).catch(() => null);
    if (!res) continue;
    const hit = (res?.records ?? []).find((f) => docId(f) === id);
    if (hit) return { flag: hit, siblings: res.records };
  }
  return null;
};

export const RESOLVE_ACTIONS = {
  dismiss: { action: 'dismiss', title: 'Dismiss this flag?', body: 'The content stays up and the flag closes. The reporter isn’t told who reviewed it.', primary: 'Dismiss flag', tone: 'red' },
  remove: { action: 'approve', title: 'Remove this content?', body: 'The content is hidden from everyone and the flag closes as removed. A Senior Admin can restore it later.', primary: 'Remove content', tone: 'red' },
};
