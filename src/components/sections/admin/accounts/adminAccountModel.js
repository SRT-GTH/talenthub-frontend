import markMinor from '../../../../assets/admin/account-mark-minor.svg';
import markRecruiter from '../../../../assets/admin/account-mark-recruiter.svg';
import markTalent from '../../../../assets/admin/account-mark-talent.svg';
import {
  docId,
  entityLabel,
  humanize,
  personName,
  shortDate,
  timeAgo,
} from '../../../../services/admin.api.js';

/*
 * adminAccountModel — turns backend account docs (GET /api/admin/accounts, /api/admin/accounts/:id) into what the Accounts screens draw.
 * The backend has no human account number, Ghana Card, 2-step or device data; those rows say so instead of showing sample values.
 * Contact details come back masked for Support Agents only (backend rule), so the copy doesn't promise masking for other roles.
 */

const ORG_TYPES = ['recruiter', 'institution', 'agency', 'partner', 'organization', 'organisation'];
const STAFF_TYPES = ['super_admin', 'senior_admin', 'support_agent', 'content_moderator'];

export const ACCOUNT_TABS = [
  { id: 'all', label: 'All', accountType: undefined },
  { id: 'talents', label: 'Talents', accountType: 'talent' },
  { id: 'orgs', label: 'Recruiters', accountType: 'recruiter' },
  { id: 'staff', label: 'Staff', staff: true },
];
export const ACCOUNT_CHIPS = [
  { id: 'all', label: 'All', status: undefined },
  { id: 'active', label: 'Active', status: 'active' },
  { id: 'suspended', label: 'Suspended', status: 'suspended' },
];

/** The account's type: top-level entityType, else the first linked entity's type. */
export const typeOf = (a) => a?.entityType || (Array.isArray(a?.entities) && a.entities[0]?.entityType) || '';

export const isSuspended = (a) => a?.status === 'suspended';
export const isDeleted = (a) => Boolean(a?.softDeletedAt);
const markFor = (a) =>
  a?.isMinor ? markMinor : ORG_TYPES.includes(typeOf(a)) ? markRecruiter : markTalent;

export const statusLabel = (a) => {
  if (isDeleted(a)) return 'Deletion pending';
  if (a?.mergedInto) return 'Merged';
  return humanize(a?.status || 'unknown');
};

const contactLine = (a) =>
  [a.email, a.phoneNumber, a.createdAt ? `joined ${shortDate(a.createdAt)}` : null]
    .filter(Boolean)
    .join(' · ');

/** One QueueRow for an account doc. */
export const accountRow = (a) => {
  const id = docId(a);
  const suspended = isSuspended(a);
  const chips = [
    { label: a.isMinor ? 'Minor' : statusLabel(a), tone: 'amber' },
    a.region ? { label: a.region, tone: 'green' } : null,
    a.locality || a.district ? { label: a.locality || a.district, tone: 'grey' } : null,
  ].filter(Boolean);
  return {
    id,
    lead: { src: markFor(a) },
    title: personName(a),
    sticker: entityLabel(typeOf(a)),
    sub: [contactLine(a), suspended && a.suspendedAt ? `suspended ${shortDate(a.suspendedAt)}` : null]
      .filter(Boolean)
      .join(' · '),
    chips,
    pill: { label: 'Open', strong: !suspended },
    age: a.lastLogin ? timeAgo(a.lastLogin) : '',
    muted: suspended,
    button: suspended ? 'Reactivate' : null,
    to: `/admin/accounts/${id}`,
    account: a,
  };
};

const countLabel = (n, limit) => (n >= limit ? `${n}+` : String(n));

/** The AdminQueueView config for the Accounts list. */
export const accountsListConfig = ({ rows, counts, chipCounts, q, tab, limit, role }) => {
  const empty = rows.length === 0;
  const masked = role === 'support';
  const subtitle = masked
    ? 'Search every account on GTH by email or username. Contact details stay masked for your role.'
    : 'Search every account on GTH by email or username.';
  const tabs = ACCOUNT_TABS.map((t) => ({
    id: t.id,
    label: t.label,
    count: counts?.[t.id] == null ? '–' : countLabel(counts[t.id], limit),
  }));
  const chips = ACCOUNT_CHIPS.map((c) => ({
    id: c.id,
    label: chipCounts?.[c.id] == null ? c.label : `${c.label} ${countLabel(chipCounts[c.id], limit)}`,
  }));
  const shown = `Showing ${rows.length}${rows.length >= limit ? '+' : ''} ${rows.length === 1 ? 'account' : 'accounts'}`;
  return {
    title: 'Accounts',
    sticker: `${countLabel(counts?.all ?? rows.length, limit)} ${(counts?.all ?? rows.length) === 1 ? 'account' : 'accounts'}`,
    subtitle,
    tabs,
    tabTone: 'ink',
    defaultTab: 'all',
    chips,
    defaultView: 'list',
    sort: 'Newest first',
    action: 'Merge duplicates',
    banner: q ? `${shown} for “${q}”.` : `${shown}, newest first.`,
    rows,
    empty: empty
      ? {
          title: 'No accounts found',
          text: q
            ? `Nothing matches “${q}”. Search looks at email and username only.`
            : 'No accounts match these filters.',
          steps: [
            { id: 's1', icon: 'plus', title: 'Clear the search', meta: 'Show every account', to: '/admin/accounts' },
            { id: 's2', icon: 'spark', title: 'Show all statuses', meta: 'Remove the status filter', to: `/admin/accounts${q ? `?q=${encodeURIComponent(q)}` : ''}` },
            { id: 's3', icon: 'user', title: 'Search staff', meta: 'Staff tab', to: '/admin/accounts?tab=staff' },
          ],
          primary: 'Reset filters',
          onPrimary: '/admin/accounts',
          secondary: 'Back to home',
          secondaryTo: '/admin',
        }
      : null,
    tab,
  };
};

/** The detail-screen model of one account doc. */
export const accountView = (a) => {
  const id = docId(a);
  const name = personName(a);
  const firstName = a.firstName || name.split(' ')[0];
  const suspended = isSuspended(a);
  const deleted = isDeleted(a);
  const kind = entityLabel(typeOf(a));
  const status = statusLabel(a);
  const lastActive = a.lastLogin ? `last active ${timeAgo(a.lastLogin)}` : 'never signed in';
  const overrides = Array.isArray(a.overrideLog) ? a.overrideLog : [];
  return {
    id,
    shortId: id.slice(-8).toUpperCase(),
    raw: a,
    name,
    firstName,
    kind,
    status,
    suspended,
    deleted,
    staff: STAFF_TYPES.includes(typeOf(a)),
    minor: Boolean(a.isMinor),
    verified: a.isVerified ? 'Verified' : null,
    handle: [a.username && !a.username.includes('@') ? `@${a.username}` : null, a.createdAt ? `joined ${shortDate(a.createdAt)}` : null]
      .filter(Boolean)
      .join(' · '),
    headline: [kind, [a.locality || a.district, a.region].filter(Boolean).join(', ')].filter(Boolean).join(' · '),
    chips: [
      { label: status, icon: 'target', tone: 'green' },
      a.region ? { label: a.region, icon: 'pin', tone: 'white' } : null,
      a.isMinor ? { label: 'Under 18', icon: 'lang', tone: 'white' } : null,
    ].filter(Boolean),
    stats: [
      { value: String(a.loginCount ?? 0), label: 'sign-ins' },
      { value: String(overrides.length), label: 'overrides' },
      { value: a.lastLogin ? shortDate(a.lastLogin) : '—', label: 'last active' },
    ],
    bar: {
      title: `${name} · account ${id.slice(-8).toUpperCase()}`,
      sub: [
        kind,
        status.toLowerCase(),
        a.createdAt ? `joined ${shortDate(a.createdAt)}` : null,
        lastActive,
        suspended && a.suspendedReason ? `reason: ${a.suspendedReason}` : null,
        deleted && a.hardDeleteScheduledAt ? `hard delete scheduled ${shortDate(a.hardDeleteScheduledAt)}` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    },
    cover: deleted ? 'Deletion pending' : suspended ? 'Suspended' : a.isMinor ? 'Under 18' : status,
    railText:
      'Every action needs a reason and is logged under your name. Suspend, override and merge need Senior Admin or above; delete needs Super Admin.',
    record: [
      { icon: 'target', text: `Email · ${a.email || 'none'}${a.isVerified ? ' · verified' : ''}` },
      { icon: 'file', text: `Phone · ${a.phoneNumber || 'none'}` },
      { icon: 'voice', text: `Sign-ins · ${a.loginCount ?? 0}${a.lastLogin ? ` · last ${timeAgo(a.lastLogin)}` : ''}` },
      { icon: 'shield', text: `Status · ${status}${a.suspendedUntil ? ` until ${shortDate(a.suspendedUntil)}` : ''}` },
      { icon: 'phone', text: `Region · ${[a.locality || a.district, a.region].filter(Boolean).join(', ') || 'not set'}` },
      {
        icon: 'wallet',
        text: `Admin history · ${overrides.length} override${overrides.length === 1 ? '' : 's'}${
          overrides.length ? ` (last ${shortDate(overrides[overrides.length - 1].overriddenAt)})` : ''
        }`,
      },
    ],
    overrides,
  };
};

/** Fields an admin may override on the user record (backend: adminAccount.overrideProfileField writes the user doc). */
export const OVERRIDE_FIELDS = [
  { value: 'firstName', label: 'First name' },
  { value: 'lastName', label: 'Last name' },
  { value: 'username', label: 'Username' },
  { value: 'phoneNumber', label: 'Phone number' },
  { value: 'region', label: 'Region' },
  { value: 'district', label: 'District' },
  { value: 'locality', label: 'Town' },
  { value: 'educationInstitution', label: 'School / institution' },
];

/** ISO end date of a suspension duration label, or null for indefinite. */
export const suspendUntil = (duration) => {
  const days = { '7 days': 7, '30 days': 30 }[duration];
  if (!days) return null;
  return new Date(Date.now() + days * 86400000).toISOString();
};
