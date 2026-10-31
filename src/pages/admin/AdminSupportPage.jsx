import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AdminQueueView from '../../components/sections/admin/queue/AdminQueueView.jsx';
import { useAdminData, useAdminToast } from '../../components/sections/admin/useAdminData.js';
import {
  EscalateDialog,
  NoteDialog,
  ReplyDialog,
} from '../../components/sections/admin/support/SupportDialogs.jsx';
import SupportDetail from '../../components/sections/admin/support/SupportDetail.jsx';
import { SUPPORT_TABS, rowOf } from '../../components/sections/admin/support/supportModel.js';
import { adminError } from '../../services/admin.api.js';
import {
  supportClaim,
  supportClaimNext,
  supportDetail,
  supportEscalate,
  supportNote,
  supportQueue,
  supportReply,
  supportStatus,
} from '../../services/support.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminSupportPage');

/*
 * AdminSupportPage — Platform Admin › Support queries (Figma 7.7) on live data from /api/admin/support (backend support.service, caseQueue mixin):
 *   /admin/support          queue · ?tab=open|waiting|escalated|resolved|all · ?chip=all|talents|orgs (oldest first) · "Claim next"
 *   /admin/support/:ref     the request · ?modal=reply | note | escalate
 * Who may open it is the platformEnum role group role_group_support; safeguarding (restricted) requests appear only for
 * role_group_support_senior. Case types, canned replies and SLA hours come from Settings › Lists.
 */

const CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'talents', label: 'Talents' },
  { id: 'orgs', label: 'Organisations' },
];

const Queue = ({ data }) => {
  const navigate = useNavigate();
  const tab = data.tab ?? 'open';
  const chip = data.params.get('chip') ?? 'all';
  const q = useAdminData(() => supportQueue({ tab, chip }), [tab, chip]);
  const [toastEl, toast] = useAdminToast();
  const [claiming, setClaiming] = useState(false);
  if (q.loading || q.error) {
    return (
      <div className="flex flex-col gap-[16px] pt-[4px]">
        <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
          Support queries
        </h1>
        <AdminLoadNotice loading={q.loading} error={q.error} status={q.status} onRetry={q.reload} />
      </div>
    );
  }
  const d = q.data;
  const rows = d.rows.map((r) => rowOf(r, d.me));
  const claimNext = async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const res = await supportClaimNext();
      if (res?.ref) navigate(`/admin/support/${res.ref}`);
      else toast('Nothing unclaimed right now');
    } catch (e) {
      toast(adminError(e));
    } finally {
      setClaiming(false);
    }
  };
  const config = {
    title: 'Support queries',
    sticker: `${d.counts.open} open`,
    subtitle:
      'Questions people send through Help. Reply with a template or your own words. Anything that changes an account goes to a Senior Admin.',
    tabs: SUPPORT_TABS.map((t) => ({ ...t, count: String(d.counts[t.id] ?? 0) })),
    tabTone: 'ink',
    defaultTab: tab,
    chips: CHIPS.map((c) => ({ ...c, label: `${c.label} ${d.chips[c.id] ?? 0}` })),
    defaultChip: chip,
    defaultView: 'list',
    sort: 'Oldest first',
    action: claiming ? 'Claiming…' : 'Claim next',
    pinKey: 'support',
    banner: d.overdue
      ? `${d.overdue} ${d.overdue === 1 ? 'query has' : 'queries have'} missed the first-reply target. Oldest first.`
      : 'Nothing has missed its first-reply target. Oldest first.',
    rows,
    empty: rows.length
      ? null
      : {
          title: tab === 'open' ? 'No open queries' : 'Nothing here',
          text:
            tab === 'open'
              ? 'New questions from Help show up here.'
              : 'Queries in this state show up here.',
          steps: [
            {
              id: 's1',
              icon: 'user',
              title: 'Accounts',
              meta: 'Search accounts',
              to: '/admin/accounts',
            },
            {
              id: 's2',
              icon: 'spark',
              title: 'All queries',
              meta: 'Every state',
              to: '/admin/support?tab=all',
            },
            {
              id: 's3',
              icon: 'plus',
              title: 'Canned replies',
              meta: 'Settings › Lists',
              to: '/admin/settings/reference?section=lists',
            },
          ],
          primary: 'Back to home',
          onPrimary: '/admin',
          secondary: 'Audit log',
          secondaryTo: '/admin/audit-log',
        },
  };
  return (
    <>
      <AdminQueueView config={config} data={data} onAction={claimNext} />
      {toastEl}
    </>
  );
};

const Detail = ({ data, refId }) => {
  const navigate = useNavigate();
  const q = useAdminData(() => supportDetail(refId), [refId]);
  const list = useAdminData(() => supportQueue({ tab: 'all' }), [refId]);
  const [toastEl, toast] = useAdminToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const modal = data.modal;
  const close = () => {
    setError('');
    data.update({ modal: null });
  };
  const run = async (fn, done) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      toast(done);
      data.update({ modal: null });
      q.reload();
      list.reload();
    } catch (e) {
      const msg = e?.response ? adminError(e) : e.message;
      if (modal) setError(msg);
      else toast(msg);
    } finally {
      setBusy(false);
    }
  };

  if (q.loading || q.error || !q.data) {
    return (
      <div className="flex flex-col gap-[16px] pt-[4px]">
        <button
          type="button"
          onClick={() => navigate('/admin/support')}
          className="w-fit cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold text-[#387440] underline"
        >
          ← Support queries
        </button>
        <AdminLoadNotice loading={q.loading} error={q.error} status={q.status} onRetry={q.reload} />
      </div>
    );
  }
  const d = q.data;
  const first = d.account?.firstName || d.requester.name.split(' ')[0];
  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/admin/support')}
        className="mb-[8px] w-fit cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold text-[#387440] underline"
      >
        ← Support queries
      </button>
      <SupportDetail
        detail={d}
        list={list.data?.rows || []}
        busy={busy}
        onClaim={() => run(() => supportClaim(d.ref), 'Claimed')}
        onReply={() => data.update({ modal: 'reply' })}
        onNote={() => data.update({ modal: 'note' })}
        onEscalate={() => data.update({ modal: 'escalate' })}
        onStatus={(s) => run(() => supportStatus(d.ref, s), 'Status changed')}
      />
      {toastEl}
      {modal === 'reply' ? (
        <ReplyDialog
          firstName={first}
          replies={d.replies}
          busy={busy}
          error={error}
          onClose={close}
          onSend={(p) =>
            run(() => supportReply(d.ref, p), p.close ? 'Reply sent · resolved' : 'Reply sent')
          }
        />
      ) : null}
      {modal === 'note' ? (
        <NoteDialog
          busy={busy}
          error={error}
          onClose={close}
          onSave={(text) => run(() => supportNote(d.ref, text), 'Note saved')}
        />
      ) : null}
      {modal === 'escalate' ? (
        <EscalateDialog
          firstName={first}
          seniors={d.seniors}
          busy={busy}
          error={error}
          onClose={close}
          onEscalate={(p) => run(() => supportEscalate(d.ref, p), 'Escalated')}
        />
      ) : null}
    </>
  );
};

const AdminSupportPage = () => {
  const data = useAdminState();
  const { queryId } = useParams();
  useEffect(() => {
    log('mount', { queryId, modal: data.modal });
  }, [queryId, data.modal]);
  return (
    <AdminFrame data={data} title="Support queries">
      {queryId ? <Detail data={data} refId={queryId} /> : <Queue data={data} />}
    </AdminFrame>
  );
};

export default AdminSupportPage;
