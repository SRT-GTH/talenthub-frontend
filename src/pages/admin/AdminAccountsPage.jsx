import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import AccountDeleteDialog from '../../components/sections/admin/accounts/AccountDeleteDialog.jsx';
import AccountOverrideDialog from '../../components/sections/admin/accounts/AccountOverrideDialog.jsx';
import AccountSuspendDialog from '../../components/sections/admin/accounts/AccountSuspendDialog.jsx';
import AdminAccountDetail from '../../components/sections/admin/accounts/AdminAccountDetail.jsx';
import AdminQueueView from '../../components/sections/admin/queue/AdminQueueView.jsx';
import AdminActionsMenu from '../../components/sections/admin/accounts/AdminActionsMenu.jsx';
import AdminMergeView from '../../components/sections/admin/accounts/AdminMergeView.jsx';
import {
  REACTIVATE,
  RECLASSIFY,
  SECOND_APPROVAL,
} from '../../components/sections/admin/accounts/data/adminAccountDetailData.js';
import { BLOCKED, PARENT } from '../../components/sections/admin/accounts/data/adminMergeData.js';
import {
  ACCOUNT_ROWS,
  accountsConfig,
  DETAIL_ID,
} from '../../components/sections/admin/accounts/data/adminAccountsData.js';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { Select } from '../../components/ui/form';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AdminAccountsPage');

/*
 * AdminAccountsPage — /admin/accounts (7.1.1 list) · /admin/accounts/:accountId (7.1.2-7.1.4, 7.1.6 detail and its dialogs) · /admin/accounts/merge (7.1.5).
 * URL states (see adminState.js for the shared keys):
 *   /admin/accounts/merge                                    merge duplicates (7.1.5a) · &modal=blocked (7.1.5b) · ?view=minors (7.1.5c) · &modal=parent
 *   /admin/accounts                                          search results for the default query (7.1.1a, Senior Admin)
 *   /admin/accounts?q=Kwamme&state=empty&role=support        no results (7.1.1b)
 *   /admin/accounts/TAL-204-8812                             talent detail (7.1.2a) · ?role=super → 7.1.2c · ?view=minor → minor account (7.1.2b)
 *   …?modal=actions | suspend (7.1.3a) | approval (7.1.3d) | override (7.1.6a) | reclassify (&view=minor, 7.1.6b) | delete (?role=super, 7.1.4a)
 *   …?state=suspended (7.1.3b) · &modal=reactivate (7.1.3c)
 * Real flow (⚠️ ASSUMPTION: mock only): Admin actions → Suspend → 7 / 30 days suspends, Indefinite asks for a second approval; Reactivate lifts the suspension;
 * override "Review change" → the minor → adult confirmation. Suspend, override and merge need Senior Admin or Super Admin; delete needs Super Admin.
 */

const matches = (q) => {
  if (!q.trim()) return true;
  const n = q.trim().toLowerCase();
  return ACCOUNT_ROWS.some((r) => r.name.toLowerCase().includes(n));
};

const AdminAccountsPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const navigate = useNavigate();
  const { accountId } = useParams();
  const { pathname } = useLocation();
  const merge = pathname.endsWith('/accounts/merge');
  const empty = data.state === 'empty' || !matches(data.q);
  const view =
    data.state === 'suspended' ? 'suspended' : data.view === 'minor' ? 'minor' : 'talent';
  const modal = data.modal;
  const [parentLink, setParentLink] = useState(PARENT.options[0]);

  useEffect(() => {
    log('mount', { accountId, merge, empty, q: data.q, view, modal, role });
  }, [accountId, merge, empty, data.q, view, modal, role]);

  const close = () => data.update({ modal: null });
  const senior = role === 'senior' || role === 'super';
  const allowed = {
    message: true,
    suspend: senior,
    override: senior,
    merge: senior,
    delete: role === 'super',
  };
  const pick = (id) => {
    log('admin action', id);
    if (id === 'message') navigate(`/admin/comms/message?account=${accountId}`);
    else if (id === 'merge') navigate('/admin/accounts/merge');
    else data.update({ modal: id });
  };

  if (merge) {
    const minors = data.view === 'minors';
    return (
      <AdminFrame data={data} title="Merge accounts">
        <AdminMergeView
          variant={minors ? 'minors' : 'adults'}
          onMerge={() => data.update({ modal: minors ? 'parent' : 'blocked' })}
        />
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
              log('merge minors with the chosen parent link (mock)', parentLink);
              close();
            }}
            onClose={close}
          >
            <Select
              label={PARENT.label}
              required
              options={PARENT.options}
              value={parentLink}
              onChange={setParentLink}
            />
          </AdminConfirmDialog>
        ) : null}
      </AdminFrame>
    );
  }

  if (accountId) {
    return (
      <AdminFrame data={data} title="Account detail">
        <AdminAccountDetail
          view={view}
          onActions={() => data.update({ modal: 'actions' })}
          onMessage={() => pick('message')}
          onReactivate={() => data.update({ modal: 'reactivate' })}
        />
        {modal === 'actions' ? (
          <AdminActionsMenu allowed={allowed} onPick={pick} onClose={close} />
        ) : null}
        {modal === 'suspend' ? (
          <AccountSuspendDialog
            onClose={close}
            onSuspend={() => data.update({ modal: null, state: 'suspended' })}
            onIndefinite={() => data.update({ modal: 'approval' })}
          />
        ) : null}
        {modal === 'approval' ? (
          <AdminConfirmDialog
            title={SECOND_APPROVAL.title}
            body={SECOND_APPROVAL.body}
            primary={{ label: SECOND_APPROVAL.primary, arrow: true }}
            secondary={SECOND_APPROVAL.secondary}
            onPrimary={() => {
              log('sent for second approval (mock)');
              close();
            }}
            onSecondary={() => data.update({ modal: 'suspend' })}
            onClose={close}
          />
        ) : null}
        {modal === 'reactivate' ? (
          <AdminConfirmDialog
            title={REACTIVATE.title}
            body={REACTIVATE.body}
            primary={{ label: REACTIVATE.primary, arrow: true }}
            secondary={REACTIVATE.secondary}
            onPrimary={() => data.update({ modal: null, state: null })}
            onClose={close}
          />
        ) : null}
        {modal === 'delete' ? (
          <AccountDeleteDialog
            onClose={close}
            onSubmit={() => {
              log('delete sent to second approver (mock)');
              close();
            }}
          />
        ) : null}
        {modal === 'override' ? (
          <AccountOverrideDialog
            onClose={close}
            onReview={() => data.update({ modal: 'reclassify', view: 'minor' })}
          />
        ) : null}
        {modal === 'reclassify' ? (
          <AdminConfirmDialog
            title={RECLASSIFY.title}
            body={RECLASSIFY.body}
            primary={{ label: RECLASSIFY.primary, arrow: true }}
            secondary={RECLASSIFY.secondary}
            onPrimary={() => data.update({ modal: null, view: null })}
            onClose={close}
          />
        ) : null}
      </AdminFrame>
    );
  }

  return (
    <AdminFrame data={data} title="Accounts">
      <AdminQueueView
        config={accountsConfig(empty)}
        data={data}
        onRowButton={() =>
          navigate(`/admin/accounts/${DETAIL_ID}?state=suspended&modal=reactivate`)
        }
      />
    </AdminFrame>
  );
};

export default AdminAccountsPage;
