import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import AccountDeleteDialog from '../../components/sections/admin/accounts/AccountDeleteDialog.jsx';
import AccountOverrideDialog from '../../components/sections/admin/accounts/AccountOverrideDialog.jsx';
import AccountSuspendDialog from '../../components/sections/admin/accounts/AccountSuspendDialog.jsx';
import AdminAccountDetail from '../../components/sections/admin/accounts/AdminAccountDetail.jsx';
import AdminQueueView from '../../components/sections/admin/queue/AdminQueueView.jsx';
import AdminActionsMenu from '../../components/sections/admin/accounts/AdminActionsMenu.jsx';
import AdminMergeView from '../../components/sections/admin/accounts/AdminMergeView.jsx';
import { BLOCKED, PARENT } from '../../components/sections/admin/accounts/data/adminMergeData.js';
import {
  ACCOUNT_CHIPS,
  ACCOUNT_TABS,
  accountRow,
  accountsListConfig,
  accountView,
  suspendUntil,
} from '../../components/sections/admin/accounts/adminAccountModel.js';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { useAdminData, useAdminToast } from '../../components/sections/admin/useAdminData.js';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import { Select, TextInput } from '../../components/ui/form';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import {
  accountActivity,
  adminError,
  cancelDeleteAccount,
  deleteAccount,
  docId,
  listStaff,
  mergeAccounts,
  overrideField,
  reverseOverride,
  searchAccounts,
  suspendAccount,
  unsuspendAccount,
  viewAccount,
} from '../../services/admin.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminAccountsPage');

/*
 * AdminAccountsPage — /admin/accounts (7.1.1 list) · /admin/accounts/:accountId (7.1.2-7.1.4, 7.1.6 detail and its dialogs) · /admin/accounts/merge (7.1.5).
 * Real data (services/admin.api.js):
 *   list    GET /admin/accounts { searchQuery (email / username), accountType, status }; Staff tab: GET /admin/staff (Senior Admin and above)
 *   detail  GET /admin/accounts/:id (user _id) + GET /audit/entity/:entityId (recent activity)
 *   actions POST /admin/lifecycle/:id/{suspend | unsuspend | delete | cancel-delete | override | reverse-override}, POST /admin/lifecycle/merge
 * URL states: ?q= search · ?tab=all|talents|orgs|staff · ?chip=all|active|suspended · ?modal=actions|suspend|reactivate|delete|override|merge|cancel-delete|reverse
 * Role gates come from the backend (403 shows a notice). The /merge screen is still the design mock: the backend merge takes two ids and a reason only
 * (no field-by-field choice), so real merges go through the "Merge duplicates" dialog.
 */

const LIMIT = 200;

const listFor = async ({ tab, q, status }) => {
  const t = ACCOUNT_TABS.find((x) => x.id === tab) ?? ACCOUNT_TABS[0];
  if (t.staff) {
    const res = await listStaff({ limit: LIMIT, status });
    const recs = res?.records ?? [];
    const n = q.trim().toLowerCase();
    return n
      ? recs.filter((r) =>
          [r.email, r.username, r.metadata?.displayName, r.firstName, r.lastName]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(n)),
        )
      : recs;
  }
  const res = await searchAccounts({ limit: LIMIT, searchQuery: q.trim() || undefined, accountType: t.accountType, status });
  return res?.records ?? [];
};

const settledCount = (p) => p.then((r) => r.length).catch(() => null);

const AccountsList = ({ data, role }) => {
  const navigate = useNavigate();
  const tab = data.tab ?? 'all';
  const chip = data.params.get('chip') ?? 'all';
  const status = ACCOUNT_CHIPS.find((c) => c.id === chip)?.status;
  const q = data.q;
  const [toastEl, toast] = useAdminToast();
  const [reactivate, setReactivate] = useState(null);
  const [merge, setMerge] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const list = useAdminData(() => listFor({ tab, q, status }), [tab, q, status]);
  const counts = useAdminData(async () => {
    const [all, talents, orgs, staff] = await Promise.all(
      ACCOUNT_TABS.map((t) => settledCount(listFor({ tab: t.id, q, status }))),
    );
    const chips = await Promise.all(
      ACCOUNT_CHIPS.map((c) => settledCount(listFor({ tab, q, status: c.status }))),
    );
    return { tabs: { all, talents, orgs, staff }, chips: Object.fromEntries(ACCOUNT_CHIPS.map((c, i) => [c.id, chips[i]])) };
  }, [q, status, tab]);

  const rows = useMemo(() => (list.data ?? []).map(accountRow), [list.data]);
  const config = accountsListConfig({
    rows,
    counts: counts.data?.tabs,
    chipCounts: counts.data?.chips,
    q,
    tab,
    limit: LIMIT,
    role,
  });

  const doReactivate = async () => {
    setBusy(true);
    try {
      await unsuspendAccount(reactivate.id, 'Reactivated from the accounts list');
      toast('Account reactivated', `${reactivate.title} can sign in again.`);
      setReactivate(null);
      list.reload();
      counts.reload();
    } catch (e) {
      toast('Couldn’t reactivate', adminError(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {list.loading || list.error ? (
        <div className="flex flex-col gap-[16px] pt-[4px]">
          <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">Accounts</h1>
          <AdminLoadNotice loading={list.loading} error={list.error} status={list.status} onRetry={list.reload} />
        </div>
      ) : (
        <AdminQueueView
          config={config}
          data={data}
          onRowButton={(row) => setReactivate(row)}
          onAction={() => {
            setErr('');
            setMerge(true);
          }}
        />
      )}
      {reactivate ? (
        <AdminConfirmDialog
          title={`Reactivate ${reactivate.title}’s account?`}
          body="They can sign in again straight away. The suspension stays in their admin history."
          primary={{ label: busy ? 'Reactivating…' : 'Reactivate', arrow: true }}
          secondary="Cancel"
          onPrimary={busy ? undefined : doReactivate}
          onClose={() => setReactivate(null)}
        />
      ) : null}
      {merge ? (
        <MergeDialog
          busy={busy}
          error={err}
          onClose={() => setMerge(false)}
          onSubmit={async (p) => {
            setBusy(true);
            setErr('');
            try {
              await mergeAccounts(p.primary, p.secondary, p.reason);
              toast('Accounts merged', 'The duplicate is now inactive and points to the kept account.');
              setMerge(false);
              navigate(`/admin/accounts/${p.primary}`);
            } catch (e) {
              setErr(adminError(e));
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : null}
      {toastEl}
    </>
  );
};

const MergeDialog = ({ primaryId = '', busy, error, onClose, onSubmit }) => {
  const [primary, setPrimary] = useState(primaryId);
  const [secondary, setSecondary] = useState('');
  const [reason, setReason] = useState('');
  const ok = /^[a-f0-9]{24}$/i.test(primary.trim()) && /^[a-f0-9]{24}$/i.test(secondary.trim()) && reason.trim().length >= 3;
  return (
    <AdminConfirmDialog
      title="Merge duplicate accounts"
      body="The duplicate is marked inactive and linked to the account you keep. Staff accounts can’t be merged. Paste both account ids (from the account page)."
      primary={{ label: busy ? 'Merging…' : 'Merge', arrow: true }}
      secondary="Cancel"
      onPrimary={() => ok && !busy && onSubmit({ primary: primary.trim(), secondary: secondary.trim(), reason: reason.trim() })}
      onClose={onClose}
    >
      <div className="flex flex-col gap-[12px]">
        <TextInput label="Account to keep (id)" required value={primary} onChange={(e) => setPrimary(e.target.value)} />
        <TextInput label="Duplicate to retire (id)" required value={secondary} onChange={(e) => setSecondary(e.target.value)} />
        <TextInput
          label="Reason (logged)"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={error || undefined}
        />
      </div>
    </AdminConfirmDialog>
  );
};

const AccountDetailScreen = ({ data, role, accountId }) => {
  const navigate = useNavigate();
  const modal = data.modal;
  const [toastEl, toast] = useAdminToast();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [reverseIndex, setReverseIndex] = useState(null);
  const acc = useAdminData(() => viewAccount(accountId), [accountId]);
  const entityId = acc.data?.entityId || acc.data?.currentEntityId;
  // Lifecycle actions log the user id, other services the entity id: load both, newest first, without the "viewed" noise.
  const activity = useAdminData(async () => {
    const ids = [...new Set([String(entityId || ''), String(accountId)].filter(Boolean))];
    const res = await Promise.all(ids.map((x) => accountActivity(x).catch(() => ({ records: [] }))));
    const seen = new Set();
    const records = res
      .flatMap((r) => r?.records ?? [])
      .filter((e) => !/_VIEWED$|_SEARCHED$/.test(e.action || ''))
      .filter((e) => {
        const k = docId(e);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);
    return { records };
  }, [entityId, accountId]);

  const close = () => {
    setErr('');
    data.update({ modal: null });
  };
  const senior = role === 'senior' || role === 'super';
  const allowed = {
    message: role !== 'moderator',
    suspend: role !== 'moderator',
    override: senior,
    merge: senior,
    delete: role === 'super',
  };
  const pick = (id) => {
    log('admin action', id);
    setErr('');
    if (id === 'message') navigate(`/admin/comms/message?account=${accountId}`);
    else data.update({ modal: id });
  };

  const act = async (fn, success) => {
    setBusy(true);
    setErr('');
    try {
      const res = await fn();
      if (res?.requiresApproval) {
        toast('Sent for approval', res.message || 'A Senior Admin must approve this suspension.', 'info');
      } else if (success) {
        toast(...success);
      }
      data.update({ modal: null });
      acc.reload();
      activity.reload();
    } catch (e) {
      setErr(adminError(e));
    } finally {
      setBusy(false);
    }
  };

  if (acc.loading || acc.error) {
    return (
      <div className="flex flex-col gap-[16px] pt-[12px]">
        <AdminLoadNotice loading={acc.loading} error={acc.error} status={acc.status} onRetry={acc.reload} />
        <button
          type="button"
          onClick={() => navigate('/admin/accounts')}
          className="cursor-pointer self-start rounded-full border border-solid border-[#1c2a21] bg-white px-[16px] py-[8px] font-sans text-[14px] font-semibold"
        >
          Back to accounts
        </button>
      </div>
    );
  }

  const account = accountView(acc.data);
  const id = docId(acc.data);

  return (
    <>
      <AdminAccountDetail
        account={account}
        activity={activity.data}
        activityError={activity.error}
        onActions={() => pick('actions')}
        onMessage={() => pick('message')}
        onReactivate={() => pick('reactivate')}
        onCancelDelete={() => pick('cancel-delete')}
        onReverse={(i) => {
          setReverseIndex(i);
          pick('reverse');
        }}
        onActivity={() => navigate(`/admin/audit-log?q=${encodeURIComponent(String(entityId || id))}`)}
      />
      {modal === 'actions' ? <AdminActionsMenu allowed={allowed} onPick={pick} onClose={close} /> : null}
      {modal === 'suspend' ? (
        <AccountSuspendDialog
          name={account.name}
          busy={busy}
          error={err}
          onClose={close}
          onSubmit={({ duration, reason, silent }) =>
            act(() => suspendAccount(id, { reason, suspendUntil: suspendUntil(duration), silent }), [
              'Account suspended',
              `${account.name} is signed out and can’t sign in.`,
            ])
          }
        />
      ) : null}
      {modal === 'reactivate' ? (
        <AdminConfirmDialog
          title={`Reactivate ${account.firstName}’s account?`}
          body="They can sign in again straight away. The suspension stays in their admin history."
          primary={{ label: busy ? 'Reactivating…' : 'Reactivate', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            !busy && act(() => unsuspendAccount(id, 'Reactivated by staff'), ['Account reactivated', `${account.name} can sign in again.`])
          }
          onClose={close}
        >
          {err ? <p className="m-0 text-[14px] text-[#902b20]">{err}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {modal === 'delete' ? (
        <AccountDeleteDialog
          name={account.name}
          busy={busy}
          error={err}
          onClose={close}
          onSubmit={(reason) =>
            act(() => deleteAccount(id, reason), [
              'Deletion requested',
              'The account is hidden. A second Super Admin must approve the purge.',
            ])
          }
        />
      ) : null}
      {modal === 'cancel-delete' ? (
        <ReasonDialog
          title={`Cancel the deletion of ${account.firstName}’s account?`}
          body="The account is restored and they can sign in again."
          action="Cancel deletion"
          busy={busy}
          error={err}
          onClose={close}
          onSubmit={(reason) =>
            act(() => cancelDeleteAccount(id, reason), ['Deletion cancelled', `${account.name}’s account is restored.`])
          }
        />
      ) : null}
      {modal === 'override' ? (
        <AccountOverrideDialog
          account={account}
          busy={busy}
          error={err}
          onClose={close}
          onHistory={close}
          onSubmit={(p) => act(() => overrideField(id, p), ['Field updated', 'The old value is kept in the admin history.'])}
        />
      ) : null}
      {modal === 'reverse' && reverseIndex != null ? (
        <ReasonDialog
          title="Reverse this override?"
          body="The field goes back to its previous value. Reversal is possible for 90 days."
          action="Reverse override"
          busy={busy}
          error={err}
          onClose={close}
          onSubmit={(reason) =>
            act(() => reverseOverride(id, reverseIndex, reason), ['Override reversed', 'The previous value is restored.'])
          }
        />
      ) : null}
      {modal === 'merge' ? (
        <MergeDialog
          primaryId={id}
          busy={busy}
          error={err}
          onClose={close}
          onSubmit={(p) =>
            act(() => mergeAccounts(p.primary, p.secondary, p.reason), [
              'Accounts merged',
              'The duplicate is now inactive and points to this account.',
            ])
          }
        />
      ) : null}
      {toastEl}
    </>
  );
};

const ReasonDialog = ({ title, body, action, busy, error, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  return (
    <AdminConfirmDialog
      title={title}
      body={body}
      primary={{ label: busy ? 'Working…' : action, arrow: true }}
      secondary="Back"
      onPrimary={() => reason.trim().length >= 3 && !busy && onSubmit(reason.trim())}
      onClose={onClose}
    >
      <TextInput
        label="Reason (logged)"
        required
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        error={error || undefined}
      />
    </AdminConfirmDialog>
  );
};

const AdminAccountsPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const navigate = useNavigate();
  const { accountId } = useParams();
  const { pathname } = useLocation();
  const merge = pathname.endsWith('/accounts/merge');
  const modal = data.modal;
  const [parentLink, setParentLink] = useState(PARENT.options[0]);

  useEffect(() => {
    log('mount', { accountId, merge, q: data.q, modal, role });
  }, [accountId, merge, data.q, modal, role]);

  const close = () => data.update({ modal: null });

  if (merge) {
    const minors = data.view === 'minors';
    return (
      <AdminFrame data={data} title="Merge accounts">
        <AdminMergeView variant={minors ? 'minors' : 'adults'} onMerge={() => data.update({ modal: minors ? 'parent' : 'blocked' })} />
        {modal === 'blocked' ? (
          <AdminConfirmDialog
            title={BLOCKED.title}
            body={BLOCKED.body}
            primary={{ label: BLOCKED.primary, tone: 'red' }}
            secondary={BLOCKED.secondary}
            onPrimary={() => navigate('/admin/comms/message?to=finance')}
            onClose={close}
          />
        ) : null}
        {modal === 'parent' ? (
          <AdminConfirmDialog
            title={PARENT.title}
            body={PARENT.body}
            primary={{ label: PARENT.primary, arrow: true }}
            secondary={PARENT.secondary}
            onPrimary={() => {
              log('merge minors with the chosen parent link (design mock)', parentLink);
              close();
            }}
            onClose={close}
          >
            <Select label={PARENT.label} required options={PARENT.options} value={parentLink} onChange={setParentLink} />
          </AdminConfirmDialog>
        ) : null}
      </AdminFrame>
    );
  }

  if (accountId) {
    return (
      <AdminFrame data={data} title="Account detail">
        <AccountDetailScreen data={data} role={role} accountId={accountId} />
      </AdminFrame>
    );
  }

  return (
    <AdminFrame data={data} title="Accounts">
      <AccountsList data={data} role={role} />
    </AdminFrame>
  );
};

export default AdminAccountsPage;
