import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import AgencyQuickActions from '../../components/sections/agency/home/AgencyQuickActions.jsx';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { HOME } from '../../components/sections/admin/data/adminHomeData.js';
import AdminPaginationBar from '../../components/sections/admin/home/AdminPaginationBar.jsx';
import AdminNextStepCard from '../../components/sections/admin/home/AdminNextStepCard.jsx';
import AdminSnapshotCard from '../../components/sections/admin/home/AdminSnapshotCard.jsx';
import AdminStatsCard from '../../components/sections/admin/home/AdminStatsCard.jsx';
import AdminWorkTable from '../../components/sections/admin/home/AdminWorkTable.jsx';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import { useAdminData, useAdminToast } from '../../components/sections/admin/useAdminData.js';
import { TextInput } from '../../components/ui/form';
import {
  adminError,
  docId,
  flagQueue,
  humanize,
  listApprovals,
  listStaff,
  realtime,
  resolveApproval,
  timeAgo,
} from '../../services/admin.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminHomePage');

/*
 * AdminHomePage — /admin (Figma 7.0.2a-e, one structure for every role) on real data:
 *   hero          greeting with the staff member's name + a one-line summary of their queue
 *   quick actions the role's four design shortcuts with live counts (open flags, pending approvals, active accounts, staff)
 *   snapshot      GET /admin/reports/realtime (Senior and Super Admin) — other roles see their flag numbers
 *   stats / next  counts from the same calls; the next step is the oldest item in the queue
 *   work queue    pending dual approvals (Senior and Super Admin: GET /admin/approvals, Approve / Reject here) + open flags (moderation roles)
 * The design's team-health cards and SLA percentages have no backend yet and aren't drawn. Approving a request records the decision, but the
 * backend doesn't carry out the approved action yet (see the gap list).
 */

const INK = { '#ebf1ec': '#2d5d33', '#eaeffb': '#244a9f', '#f5f3ff': '#6d28d9' };
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};
const waitFor = (iso) => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  return h < 48 ? `${h}h ${mins % 60}m` : `${Math.floor(h / 24)}d`;
};

const ROW_STYLE = {
  approval: { chipbg: '#f5f3ff', chipink: '#6d28d9', pillfill: '#f5f3ff', pillstroke: '#e4dcff', pillink: '#6d28d9' },
  flag: { chipbg: '#c1e9c9', chipink: '#32683a', pillfill: '#f8f8f4', pillstroke: '#e8e8e4', pillink: '#737373' },
};

const AdminHomePage = () => {
  const data = useAdminState();
  const { role, staff, user } = useAdminSession();
  const navigate = useNavigate();
  const [toastEl, toast] = useAdminToast();
  const design = HOME[role] ?? HOME.senior;
  const senior = role === 'senior' || role === 'super';
  const moderates = role === 'moderator' || senior;

  const live = useAdminData(() => (senior ? realtime() : Promise.resolve(null)), [senior]);
  const approvals = useAdminData(() => (senior ? listApprovals() : Promise.resolve([])), [senior]);
  const flags = useAdminData(() => (moderates ? flagQueue({ status: 'open', limit: 50 }) : Promise.resolve(null)), [moderates]);
  const staffList = useAdminData(() => (senior ? listStaff({ limit: 200 }) : Promise.resolve(null)), [senior]);

  const pending = useMemo(() => approvals.data ?? [], [approvals.data]);
  const openFlags = useMemo(() => flags.data?.records ?? [], [flags.data]);
  const flagTotal = flags.data?.total ?? openFlags.length;
  const m = live.data?.metrics ?? {};
  const firstName = user?.firstName || staff?.firstName || (user?.metadata?.displayName || '').split(' ')[0] || 'there';

  useEffect(() => {
    log('mount', { role, approvals: pending.length, flags: openFlags.length });
  }, [role, pending.length, openFlags.length]);

  const rows = useMemo(() => {
    const a = pending.map((p) => ({
      ...ROW_STYLE.approval,
      id: `ap-${docId(p)}`,
      kind: 'approval',
      item: p,
      initials: 'AP',
      title: `Approval · ${humanize(p.actionType)}`,
      sub: `Needs a ${humanize(p.requiredApproverRole || 'senior_admin')} · from ${humanize(p.initiatorRole || 'staff')}`,
      status: p.status === 'pending_cooldown' ? 'Cooling down' : 'Needs you',
      prio: 'High',
      prioink: '#6d28d9',
      barw: 0.9,
      barfill: '#6d28d9',
      wait: waitFor(p.createdAt),
      created: p.createdAt,
    }));
    const f = openFlags.map((fl) => ({
      ...ROW_STYLE.flag,
      id: `fl-${docId(fl)}`,
      kind: 'flag',
      item: fl,
      initials: 'FL',
      title: `Flag · ${humanize(fl.flagReason)}`,
      sub: `${humanize(fl.resourceType)} · reported by a ${humanize(fl.flaggedByType || 'user').toLowerCase()}`,
      status: fl.status === 'escalated' ? 'Escalated' : 'Open',
      prio: fl.escalationLevel ? 'High' : 'Normal',
      prioink: '#1f4a2b',
      barw: fl.escalationLevel ? 0.88 : 0.5,
      barfill: '#00522b',
      wait: waitFor(fl.createdAt),
      created: fl.createdAt,
    }));
    return [...a, ...f].sort((x, y) => new Date(x.created) - new Date(y.created));
  }, [pending, openFlags]);

  const loadingAny = approvals.loading || flags.loading;
  const summary = loadingAny
    ? 'Loading your queue…'
    : rows.length
      ? `Your queue has ${rows.length} item${rows.length === 1 ? '' : 's'}${senior ? `: ${pending.length} approval${pending.length === 1 ? '' : 's'}` : ''}${moderates ? `${senior ? ' and' : ':'} ${flagTotal} open flag${flagTotal === 1 ? '' : 's'}` : ''}.`
      : 'Your queue is clear.';

  const metaFor = (i) => {
    const counts = {
      senior: [`${flagTotal} open`, `${Number(m.totalActiveUsers ?? 0).toLocaleString('en-GB')} active`, 'Not connected yet', `${pending.length} need you`],
      super: [`${pending.length} need you`, `${staffList.data?.records?.length ?? '–'} staff`, 'Not connected yet', 'Every action'],
      support: ['Search by email', 'From an account page', 'Your reports', 'Not connected yet'],
      moderator: [`${flagTotal} open`, 'Reported posts', 'Removed content', 'From a flag'],
      dpo: ['Not connected yet', 'Exports', 'Exports', 'Every action'],
    };
    return (counts[role] ?? counts.senior)[i];
  };
  const TARGETS = {
    senior: ['/admin/moderation', '/admin/accounts', '/admin/verification', '/admin?modal=approvals'],
    support: ['/admin/accounts', '/admin/accounts', '/admin/reports', '/admin/support'],
    moderator: ['/admin/moderation', '/admin/moderation/posts', '/admin/moderation/removed', '/admin/moderation'],
    super: ['/admin?modal=approvals', '/admin/settings/staff', '/admin/verification', '/admin/audit-log'],
    dpo: ['/admin/verification', '/admin/reports', '/admin/reports', '/admin/audit-log'],
  };
  const actions = design.actions.map((a, i) => ({ ...a, meta: metaFor(i), ink: INK[a.tint], to: (TARGETS[role] ?? TARGETS.senior)[i] }));

  const snapshot = senior
    ? {
        eyebrow: 'LIVE OPS',
        headline: live.loading ? 'Loading…' : `${Number(m.totalActiveUsers ?? 0).toLocaleString('en-GB')} active accounts · ${m.openModerationFlags ?? 0} flags open`,
        line: `${m.newRegistrationsLastHour ?? 0} sign-ups in the last hour · ${m.recentEventCount ?? 0} events in the last hour`,
        action: 'Open live ops',
      }
    : {
        eyebrow: moderates ? 'MODERATION' : 'ACCOUNTS',
        headline: moderates ? `${flagTotal} flags waiting` : 'Look up an account',
        line: moderates ? 'Newest first. Decisions are logged under your name.' : 'Search by email or username. Contact details stay masked for your role.',
        action: moderates ? 'Open the flag queue' : 'Search accounts',
      };
  const stats = {
    range: 'Now',
    items: [
      { label: 'Open flags', value: moderates ? String(flagTotal) : '–', ink: '#1f4a2b' },
      { label: 'Approvals', value: senior ? String(pending.length) : '–', ink: '#32683a' },
      { label: 'Sign-ups (1h)', value: senior ? String(m.newRegistrationsLastHour ?? 0) : '–', ink: '#32683a' },
    ],
  };
  const oldest = rows[0];
  const next = oldest
    ? { eyebrow: 'Next step', title: oldest.title, body: `Waiting ${oldest.wait}. ${oldest.sub}.` }
    : { eyebrow: 'Next step', title: 'Nothing waiting', body: 'New flags and approvals show up here as they arrive.' };

  /* approvals dialog */
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const selected = pending.find((p) => docId(p) === data.params.get('approval'));
  const decide = async (decision) => {
    if (busy) return;
    setBusy(true);
    setErr('');
    try {
      const res = await resolveApproval(docId(selected), decision, reason.trim() || undefined);
      toast(
        decision === 'approve' ? (res?.pendingCooldown ? 'Approved after a cool-down' : 'Approved') : 'Rejected',
        res?.message || `${humanize(selected.actionType)} ${decision === 'approve' ? 'approved' : 'rejected'}.`,
      );
      data.update({ modal: null, approval: null });
      setReason('');
      approvals.reload();
    } catch (e) {
      setErr(adminError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminFrame data={data} title="Home">
      <AgencyPageHero
        title={`${greeting()}, ${firstName}`}
        subtitle={summary}
        actions={<AgencyButton onClick={() => navigate('/admin/settings/roles')}>My permissions</AgencyButton>}
      />
      <AgencyQuickActions actions={actions} />
      <AdminSnapshotCard snapshot={snapshot} to={senior ? '/admin/live-ops' : moderates ? '/admin/moderation' : '/admin/accounts'} />
      <div className="grid gap-[24px] xl:grid-cols-[minmax(0,878fr)_minmax(0,427fr)]">
        <AdminStatsCard stats={stats} />
        <AdminNextStepCard next={next} />
      </div>
      <div className="flex flex-col gap-[8px]">
        {rows.length ? (
          <AdminWorkTable
            rows={rows}
            label="Your work queue"
            onOpen={(row) =>
              row.kind === 'approval'
                ? data.update({ modal: 'approval', approval: docId(row.item) })
                : navigate(`/admin/moderation/flags/${docId(row.item)}`)
            }
          />
        ) : null}
        <AdminPaginationBar summary={loadingAny ? 'Loading…' : `Showing ${rows.length} item${rows.length === 1 ? '' : 's'} in your queue`} />
      </div>

      {data.modal === 'approvals' ? (
        <AdminConfirmDialog
          title={`${pending.length} approval${pending.length === 1 ? '' : 's'} waiting`}
          body={pending.length ? 'Pick one from your work queue to approve or reject it.' : 'Nothing needs your approval right now.'}
          primary={{ label: 'OK' }}
          secondary="Close"
          onPrimary={() => data.update({ modal: null })}
          onClose={() => data.update({ modal: null })}
        />
      ) : null}
      {data.modal === 'approval' && selected ? (
        <AdminConfirmDialog
          title={humanize(selected.actionType)}
          body={`Requested ${timeAgo(selected.createdAt)} by a ${humanize(selected.initiatorRole || 'staff member')}. ${
            selected.resolutionReason ? `Reason: ${selected.resolutionReason}. ` : ''
          }Expires ${timeAgo(selected.expiresAt)?.replace(' ago', '') || 'soon'}.`}
          primary={{ label: busy ? 'Saving…' : 'Approve', arrow: true }}
          secondary="Reject"
          onPrimary={() => decide('approve')}
          onSecondary={() => decide('reject')}
          onClose={() => data.update({ modal: null, approval: null })}
        >
          <div className="flex flex-col gap-[10px]">
            <pre className="m-0 max-h-[160px] overflow-auto rounded-[12px] bg-[#f8f8f4] p-[10px] font-mono text-[12px] whitespace-pre-wrap">
              {JSON.stringify(selected.payload ?? {}, null, 2)}
            </pre>
            <TextInput label="Note (optional, logged)" value={reason} onChange={(e) => setReason(e.target.value)} error={err || undefined} />
          </div>
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </AdminFrame>
  );
};

export default AdminHomePage;
