import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import FlagDetailView from '../../components/sections/admin/moderation/FlagDetailView.jsx';
import {
  FLAG_CHIPS,
  FLAG_TABS,
  RESOLVE_ACTIONS,
  findFlag,
  flagRow,
  isSystemFlag,
} from '../../components/sections/admin/moderation/adminModerationModel.js';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import AdminQueueView from '../../components/sections/admin/queue/AdminQueueView.jsx';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { useAdminData, useAdminToast } from '../../components/sections/admin/useAdminData.js';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import { Checkbox, Select, TextInput } from '../../components/ui/form';
import {
  adminError,
  docId,
  escalateFlag,
  flagQueue,
  humanize,
  issueWarning,
  pendingPosts,
  postQueue,
  reclassifyPost,
  resolveFlag,
  restoreFlag,
  reviewPost,
  shortDate,
  timeAgo,
} from '../../services/admin.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminModerationPage');

/*
 * AdminModerationPage — /admin/moderation/* (Figma 7.2). Real data from /api/admin/moderation (Super Admin, Senior Admin, Content Moderator):
 *   /admin/moderation                    flag queue: ?tab=open|under_review|escalated|approved|rejected · ?chip=all|users|system
 *   /admin/moderation/flags/:flagId      flag detail · ?modal=dismiss | remove | escalate (Content Moderator only) | warn | restore
 *   /admin/moderation/removed            removed content (flags resolved as removed) · Restore (Senior Admin and up)
 *   /admin/moderation/posts              ?tab=pending: posts held before publishing · Review (approve / reject with a reason)
 *                                        ?tab=reported: open flags on community posts · Reclassify
 *   /admin/moderation/communities        new community reviews: no backend yet (empty state says so)
 */

const Page = ({ title, children }) => (
  <div className="flex flex-col gap-[16px] pt-[4px]">
    <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
      {title}
    </h1>
    {children}
  </div>
);

const queueConfig = ({ title, subtitle, tabs, tab, chips, rows, banner, empty, action }) => ({
  title,
  sticker: `${rows.length} shown`,
  subtitle,
  tabs,
  tabTone: 'ink',
  defaultTab: tab,
  chips,
  defaultView: 'list',
  sort: 'Newest first',
  action: action ?? 'Refresh',
  banner,
  rows,
  empty: rows.length ? null : empty,
});

const emptyFlags = (text) => ({
  title: 'All clear',
  text,
  steps: [
    {
      id: 's1',
      icon: 'spark',
      title: 'Check escalated flags',
      meta: 'Escalated tab',
      to: '/admin/moderation?tab=escalated',
    },
    {
      id: 's2',
      icon: 'plus',
      title: 'Review removed content',
      meta: 'Appeals and restores',
      to: '/admin/moderation/removed',
    },
    {
      id: 's3',
      icon: 'user',
      title: 'Community posts',
      meta: 'Reported posts',
      to: '/admin/moderation/posts',
    },
  ],
  primary: 'Back to home',
  onPrimary: '/admin',
  secondary: 'Audit log',
  secondaryTo: '/admin/audit-log',
});

/* ── Flag queue ─────────────────────────────────────────────────────────── */
const FlagQueue = ({ data }) => {
  const tab = data.tab ?? 'open';
  const chip = data.params.get('chip') ?? 'all';
  const list = useAdminData(() => flagQueue({ status: tab, limit: 200 }), [tab]);
  const counts = useAdminData(async () => {
    const r = await Promise.all(
      FLAG_TABS.map((t) => flagQueue({ status: t.id, limit: 1 }).catch(() => null))
    );
    return Object.fromEntries(FLAG_TABS.map((t, i) => [t.id, r[i]?.total ?? null]));
  }, []);
  const all = list.data?.records ?? [];
  const shown = all.filter((f) =>
    chip === 'system' ? isSystemFlag(f) : chip === 'users' ? !isSystemFlag(f) : true
  );
  if (list.loading || list.error) {
    return (
      <Page title="Flag queue">
        <AdminLoadNotice
          loading={list.loading}
          error={list.error}
          status={list.status}
          onRetry={list.reload}
        />
      </Page>
    );
  }
  const config = queueConfig({
    title: 'Flag queue',
    subtitle: 'Reports from users and the system. Decisions are logged under your name.',
    tabs: FLAG_TABS.map((t) => ({ id: t.id, label: t.label, count: counts.data?.[t.id] ?? '–' })),
    tab,
    chips: FLAG_CHIPS.map((c) => ({
      ...c,
      label: `${c.label} ${c.id === 'all' ? all.length : all.filter((f) => (c.id === 'system' ? isSystemFlag(f) : !isSystemFlag(f))).length}`,
    })),
    rows: shown.map((f) => flagRow(f)),
    banner: `${list.data?.total ?? 0} ${(FLAG_TABS.find((t) => t.id === tab)?.label || tab).toLowerCase()} flags. Priority and category aren’t returned by the backend yet, so the list is newest first.`,
    empty: emptyFlags(
      `No ${FLAG_TABS.find((t) => t.id === tab)?.label.toLowerCase()} flags right now.`
    ),
  });
  return (
    <AdminQueueView
      config={config}
      data={data}
      onAction={() => {
        list.reload();
        counts.reload();
      }}
      onRowButton={(row) => data.update({ modal: 'restore', flag: row.id })}
    />
  );
};

/* ── Decision dialogs (detail + removed list) ───────────────────────────── */
const DecisionDialogs = ({ modal, flag, role, onClose, onDone }) => {
  const [reason, setReason] = useState('');
  const [warn, setWarn] = useState(false);
  const [severity, setSeverity] = useState('normal');
  const [authorId, setAuthorId] = useState('');
  const [warnLevel, setWarnLevel] = useState('low');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!flag || !modal) return null;
  const id = docId(flag);
  const run = async (fn, title, body) => {
    if (busy) return;
    if (reason.trim().length < 3) {
      setError('Give a reason (it’s logged).');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await fn();
      onDone(title, body);
    } catch (e) {
      setError(adminError(e));
    } finally {
      setBusy(false);
    }
  };
  const reasonField = (
    <TextInput
      label="Reason (logged)"
      required
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      error={error || undefined}
    />
  );

  if (modal === 'dismiss' || modal === 'remove') {
    const a = RESOLVE_ACTIONS[modal];
    return (
      <AdminConfirmDialog
        title={a.title}
        body={a.body}
        primary={{ label: busy ? 'Saving…' : a.primary, tone: a.tone }}
        secondary="Cancel"
        onPrimary={() =>
          run(
            () =>
              resolveFlag(id, {
                action: a.action,
                reason: reason.trim(),
                warnAuthor: modal === 'remove' && warn,
              }),
            modal === 'remove' ? 'Content removed' : 'Flag dismissed',
            'The flag is closed.'
          )
        }
        onClose={onClose}
      >
        <div className="flex flex-col gap-[12px]">
          {reasonField}
          {modal === 'remove' ? (
            <Checkbox
              label="Also send a warning"
              checked={warn}
              onChange={(e) => setWarn(e.target.checked)}
              labelClassName="text-[14px] font-medium"
            />
          ) : null}
        </div>
      </AdminConfirmDialog>
    );
  }
  if (modal === 'escalate') {
    return (
      <AdminConfirmDialog
        title="Escalate to a Senior Admin?"
        body={
          role === 'moderator'
            ? 'A Senior Admin takes it over. You can still add context.'
            : 'Only Content Moderators escalate flags; Senior and Super Admins decide them directly.'
        }
        primary={{ label: busy ? 'Escalating…' : 'Escalate', arrow: true }}
        secondary="Cancel"
        onPrimary={() =>
          run(
            () =>
              escalateFlag(id, { escalationReason: reason.trim(), escalationSeverity: severity }),
            'Flag escalated',
            'A Senior Admin will pick it up.'
          )
        }
        onClose={onClose}
      >
        <div className="flex flex-col gap-[12px]">
          <Select
            label="Urgency"
            required
            options={['normal', 'urgent', 'critical']}
            value={severity}
            onChange={setSeverity}
          />
          {reasonField}
        </div>
      </AdminConfirmDialog>
    );
  }
  if (modal === 'warn') {
    return (
      <AdminConfirmDialog
        title="Warn the author"
        body="The flag doesn’t say who wrote the content, so paste the author’s account id. Warnings count toward automatic restrictions."
        primary={{ label: busy ? 'Sending…' : 'Send warning', tone: 'red' }}
        secondary="Cancel"
        onPrimary={() =>
          /^[a-f0-9]{24}$/i.test(authorId.trim())
            ? run(
                () =>
                  issueWarning({
                    authorId: authorId.trim(),
                    severity: warnLevel,
                    reason: reason.trim(),
                    flagId: id,
                  }),
                'Warning sent',
                'The author has been warned.'
              )
            : setError('Paste the author’s 24-character account id.')
        }
        onClose={onClose}
      >
        <div className="flex flex-col gap-[12px]">
          <TextInput
            label="Author account id"
            required
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
          />
          <Select
            label="Severity"
            required
            options={['low', 'medium', 'high']}
            value={warnLevel}
            onChange={setWarnLevel}
          />
          {reasonField}
        </div>
      </AdminConfirmDialog>
    );
  }
  if (modal === 'restore') {
    return (
      <AdminConfirmDialog
        title="Restore this content?"
        body="It becomes visible again and the restore is logged. Senior Admins and Super Admins only."
        primary={{ label: busy ? 'Restoring…' : 'Restore', arrow: true }}
        secondary="Cancel"
        onPrimary={() =>
          run(() => restoreFlag(id, reason.trim()), 'Content restored', 'It’s visible again.')
        }
        onClose={onClose}
      >
        {reasonField}
      </AdminConfirmDialog>
    );
  }
  return null;
};

/* ── Flag detail ────────────────────────────────────────────────────────── */
const FlagDetail = ({ data, flagId, role }) => {
  const navigate = useNavigate();
  const [toastEl, toast] = useAdminToast();
  const found = useAdminData(() => findFlag(flagId), [flagId]);
  if (found.loading || found.error || !found.data) {
    return (
      <Page title="Flag detail">
        <AdminLoadNotice
          loading={found.loading}
          error={
            found.error ||
            (!found.data && !found.loading ? 'This flag wasn’t found in any queue.' : null)
          }
          status={found.status}
          onRetry={found.reload}
        />
      </Page>
    );
  }
  return (
    <>
      <FlagDetailView
        flag={found.data.flag}
        siblings={found.data.siblings}
        role={role}
        onRefresh={found.reload}
        onDecide={(id) => data.update({ modal: id })}
      />
      <DecisionDialogs
        key={data.modal}
        modal={data.modal}
        flag={found.data.flag}
        role={role}
        onClose={() => data.update({ modal: null })}
        onDone={(title, body) => {
          toast(title, body);
          data.update({ modal: null });
          found.reload();
        }}
      />
      {toastEl}
      <button type="button" className="sr-only" onClick={() => navigate('/admin/moderation')}>
        Back to the queue
      </button>
    </>
  );
};

/* ── Removed content ────────────────────────────────────────────────────── */
const RemovedList = ({ data, role }) => {
  const [toastEl, toast] = useAdminToast();
  const list = useAdminData(() => flagQueue({ status: 'approved', limit: 200 }), []);
  const records = list.data?.records ?? [];
  const tab = data.tab ?? 'hidden';
  const tabs = [
    { id: 'hidden', label: 'Removed', count: records.filter((f) => f.isHidden).length },
    { id: 'appealed', label: 'Appealed', count: records.filter((f) => f.appealStatus).length },
    { id: 'restored', label: 'Restored', count: records.filter((f) => !f.isHidden).length },
  ];
  const shown = records.filter((f) =>
    tab === 'appealed' ? f.appealStatus : tab === 'restored' ? !f.isHidden : f.isHidden
  );
  const selected = records.find((f) => docId(f) === data.params.get('flag'));
  if (list.loading || list.error) {
    return (
      <Page title="Removed content">
        <AdminLoadNotice
          loading={list.loading}
          error={list.error}
          status={list.status}
          onRetry={list.reload}
        />
      </Page>
    );
  }
  const config = queueConfig({
    title: 'Removed content',
    subtitle:
      'Content removed through a flag. Senior Admins can restore it. Appeals can’t be filed through the backend yet.',
    tabs,
    tab: 'hidden',
    chips: [{ id: 'all', label: 'All' }],
    rows: shown.map((f) => ({
      ...flagRow(f),
      button: f.isHidden && role !== 'moderator' ? 'Restore' : null,
    })),
    banner: `${records.length} flags closed as removed.`,
    empty: emptyFlags('Nothing in this list.'),
  });
  return (
    <>
      <AdminQueueView
        config={config}
        data={data}
        onAction={list.reload}
        onRowButton={(row) => data.update({ modal: 'restore', flag: row.id })}
      />
      <DecisionDialogs
        key={data.modal}
        modal={data.modal === 'restore' ? 'restore' : null}
        flag={selected}
        role={role}
        onClose={() => data.update({ modal: null, flag: null })}
        onDone={(title, body) => {
          toast(title, body);
          data.update({ modal: null, flag: null });
          list.reload();
        }}
      />
      {toastEl}
    </>
  );
};

/* ── Community posts ────────────────────────────────────────────────────── */
const clip = (text, n = 90) => (text.length > n ? `${text.slice(0, n - 1).trimEnd()}…` : text);

/** One post held by the pre-publish check, as a queue row. */
const pendingRow = (p) => ({
  id: p.id,
  lead: { icon: 'warning' },
  title: clip(p.content || '(no text)'),
  sticker: p.edited ? 'Edited' : null,
  sub: [
    p.communityName || (p.communityId ? 'Community post' : 'Feed post'),
    p.authorName || 'Unknown author',
    timeAgo(p.createdAt),
  ].join(' · '),
  chips: (p.reasons || []).map((r) => ({ label: r.label.replace(/^it /, ''), tone: 'amber' })),
  pill: { label: 'Waiting', strong: true },
  age: shortDate(p.createdAt),
  muted: false,
  button: 'Review',
  // The pill and the row open the same review dialog as the button.
  to: `/admin/moderation/posts?modal=review&post=${encodeURIComponent(p.id)}`,
  post: p,
});

const PostsList = ({ data }) => {
  const tab = data.tab === 'reported' ? 'reported' : 'pending';
  return tab === 'pending' ? <PendingPosts data={data} /> : <ReportedPosts data={data} />;
};

const postTabs = (pendingCount, reportedCount) => [
  { id: 'pending', label: 'Waiting for review', count: pendingCount ?? '–' },
  { id: 'reported', label: 'Reported', count: reportedCount ?? '–' },
];

/* Held before publishing (US-2.3.11-01): only the author sees these until a moderator approves. */
const PendingPosts = ({ data }) => {
  const [toastEl, toast] = useAdminToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const list = useAdminData(() => pendingPosts({ limit: 200 }), []);
  const reported = useAdminData(() => postQueue({ limit: 1 }), []);
  const records = list.data?.records ?? [];
  const selected = records.find((p) => p.id === data.params.get('post'));
  if (list.loading || list.error) {
    return (
      <Page title="Community posts">
        <AdminLoadNotice
          loading={list.loading}
          error={list.error}
          status={list.status}
          onRetry={list.reload}
        />
      </Page>
    );
  }
  const config = queueConfig({
    title: 'Community posts',
    subtitle:
      'Posts the automatic check held back. Only their authors see them until you approve one.',
    tabs: postTabs(list.data?.total ?? records.length, reported.data?.total),
    tab: 'pending',
    chips: [{ id: 'all', label: 'All' }],
    rows: records.map(pendingRow),
    banner: `${list.data?.total ?? records.length} waiting, oldest first.`,
    empty: emptyFlags('Nothing is waiting for review.'),
  });
  const close = () => {
    setError('');
    setReason('');
    data.update({ modal: null, post: null });
  };
  const decide = async (decision) => {
    if (busy || !selected) return;
    if (decision === 'reject' && !reason.trim()) {
      setError('Add a reason to reject this post.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await reviewPost(selected.id, decision, reason.trim() || undefined, selected.updatedAt);
      toast(
        decision === 'approve' ? 'Post approved' : 'Post rejected',
        decision === 'approve' ? 'It’s live now.' : 'It stays hidden from everyone but its author.'
      );
      close();
      list.reload();
    } catch (e) {
      setError(adminError(e));
      // Edited or reviewed since it was opened: load the current version so the next try uses it.
      if (e?.response?.data?.type === 'POST_CHANGED' || e?.response?.status === 409) list.reload();
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <AdminQueueView
        config={config}
        data={data}
        onAction={list.reload}
        onRowButton={(row) => data.update({ modal: 'review', post: row.id })}
      />
      {data.modal === 'review' && selected ? (
        <AdminConfirmDialog
          title="Review this post"
          body={`Held because ${(selected.reasons || []).map((r) => r.label).join(' and ') || 'it was edited after a review'}.`}
          primary={{ label: busy ? 'Saving…' : 'Approve and publish', arrow: true }}
          secondary="Reject"
          onPrimary={() => decide('approve')}
          onSecondary={() => decide('reject')}
          onClose={close}
        >
          <div className="flex flex-col gap-[12px]">
            <p className="m-0 max-h-[240px] overflow-y-auto whitespace-pre-wrap rounded-[12px] bg-[#f6f6f4] p-[12px] font-sans text-[14px] leading-[20px] text-[#1c2a21]">
              {selected.content}
            </p>
            <TextInput
              label="Reason"
              optional
              placeholder="Needed to reject"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={error || undefined}
            />
          </div>
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </>
  );
};

const ReportedPosts = ({ data }) => {
  const [toastEl, toast] = useAdminToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState('');
  const [reason, setReason] = useState('');
  const list = useAdminData(() => postQueue({ limit: 200 }), []);
  const waiting = useAdminData(() => pendingPosts({ limit: 1 }), []);
  const records = list.data?.records ?? [];
  const selected = records.find((f) => docId(f) === data.params.get('flag'));
  if (list.loading || list.error) {
    return (
      <Page title="Community posts">
        <AdminLoadNotice
          loading={list.loading}
          error={list.error}
          status={list.status}
          onRetry={list.reload}
        />
      </Page>
    );
  }
  const config = queueConfig({
    title: 'Community posts',
    subtitle: 'Open reports on community posts. Open one to decide it, or reclassify its purpose.',
    tabs: postTabs(waiting.data?.total, list.data?.total ?? records.length),
    tab: 'reported',
    chips: [{ id: 'all', label: 'All' }],
    rows: records.map((f) => ({ ...flagRow(f), button: 'Reclassify' })),
    banner:
      'The backend lists reported posts only; all posts, escalations by community moderators and post text aren’t available yet.',
    empty: emptyFlags('No reported posts.'),
  });
  const close = () => {
    setError('');
    data.update({ modal: null, flag: null });
  };
  return (
    <>
      <AdminQueueView
        config={config}
        data={data}
        onAction={list.reload}
        onRowButton={(row) => data.update({ modal: 'reclassify', flag: row.id })}
      />
      {data.modal === 'reclassify' && selected ? (
        <AdminConfirmDialog
          title="Reclassify this post"
          body={`Current purpose: ${humanize(selected.metadata?.purposeTag || 'not set')}. The new tag decides where the post shows.`}
          primary={{ label: busy ? 'Saving…' : 'Reclassify', arrow: true }}
          secondary="Cancel"
          onPrimary={async () => {
            if (busy || !newTag.trim()) return;
            setBusy(true);
            setError('');
            try {
              await reclassifyPost(selected.resourceId, newTag.trim(), reason.trim() || undefined);
              toast('Post reclassified', `Now tagged ${humanize(newTag)}.`);
              close();
              list.reload();
            } catch (e) {
              setError(adminError(e));
            } finally {
              setBusy(false);
            }
          }}
          onClose={close}
        >
          <div className="flex flex-col gap-[12px]">
            <TextInput
              label="New purpose tag"
              required
              placeholder="question"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <TextInput
              label="Reason"
              optional
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={error || undefined}
            />
          </div>
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </>
  );
};

/* ── Page ───────────────────────────────────────────────────────────────── */
const AdminModerationPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const { pathname } = useLocation();
  const sub = pathname.replace(/^\/admin\/moderation\/?/, '');
  const flagId = sub.startsWith('flags/') ? sub.slice('flags/'.length) : null;

  useEffect(() => {
    log('mount', { sub, modal: data.modal, role });
  }, [sub, data.modal, role]);

  const communities = useMemo(
    () =>
      queueConfig({
        title: 'New communities',
        subtitle: 'Communities waiting for review before they go live.',
        tabs: [{ id: 'new', label: 'New', count: '0' }],
        tab: 'new',
        chips: [{ id: 'all', label: 'All' }],
        rows: [],
        banner: '',
        empty: {
          title: 'Not connected yet',
          text: 'The backend has no community review queue yet, so there is nothing to review here.',
          steps: [
            {
              id: 's1',
              icon: 'spark',
              title: 'Reported community posts',
              meta: 'Moderation › Posts',
              to: '/admin/moderation/posts',
            },
            {
              id: 's2',
              icon: 'plus',
              title: 'Flag queue',
              meta: 'Moderation',
              to: '/admin/moderation',
            },
            {
              id: 's3',
              icon: 'user',
              title: 'Audit log',
              meta: 'Community events',
              to: '/admin/audit-log',
            },
          ],
          primary: 'Back to the flag queue',
          onPrimary: '/admin/moderation',
          secondary: 'Home',
          secondaryTo: '/admin',
        },
      }),
    []
  );

  let title = 'Moderation';
  let body;
  if (flagId) {
    title = 'Flag detail';
    body = <FlagDetail data={data} flagId={flagId} role={role} />;
  } else if (sub === 'removed') {
    title = 'Removed content';
    body = <RemovedList data={data} role={role} />;
  } else if (sub === 'posts') {
    title = 'Community posts';
    body = <PostsList data={data} />;
  } else if (sub === 'communities') {
    title = 'New communities';
    body = <AdminQueueView config={communities} data={data} />;
  } else {
    body = <FlagQueue data={data} />;
  }

  return (
    <AdminFrame data={data} title={title}>
      {body}
    </AdminFrame>
  );
};

export default AdminModerationPage;
