import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import AdminRecordDialog from '../../components/sections/admin/settings/AdminRecordDialog.jsx';
import AdminSettingsShell from '../../components/sections/admin/settings/AdminSettingsShell.jsx';
import DeactivateDialog from '../../components/sections/admin/settings/DeactivateDialog.jsx';
import PlatformTab from '../../components/sections/admin/settings/PlatformTab.jsx';
import PlatformConfigTab from '../../components/sections/admin/settings/PlatformConfigTab.jsx';
import OnboardingTemplateTab from '../../components/sections/admin/settings/OnboardingTemplateTab.jsx';
import RolesTab from '../../components/sections/admin/settings/RolesTab.jsx';
import StaffTab from '../../components/sections/admin/settings/StaffTab.jsx';
import {
  CHANGE_SETTING,
  CREATE_ACTION,
  FLAG_IN_USE,
  LAST_SUPER,
  SUBTITLE_PLATFORM,
} from '../../components/sections/admin/settings/data/adminSettingsData.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminSettingsPage');

/*
 * AdminSettingsPage — /admin/settings[/:tab] (Figma 7.5.1-7.5.2, Super Admin persona: add ?role=super). Tabs and URL states (shared keys in adminState.js):
 *   /admin/settings/staff                     Staff accounts (7.5.1a) · ?create=1 → create form (7.5.1b) · ?modal=last-super → "You can’t deactivate the last Super Admin" (7.5.1d)
 *   /admin/settings/staff-data                the Platform-settings page drawn behind the deactivate dialog · ?modal=deactivate (7.5.1c)
 *   /admin/settings/roles                     Roles and permissions (7.5.1e)
 *   /admin/settings  (= /admin/settings/platform)   feature flags, maintenance, credentials (7.5.2a) · ?modal=setting (7.5.2b "Change a setting") | in-use (7.5.2c)
 * Real flow (⚠️ ASSUMPTION: mock only): "Create a staff account" opens the form, Send set-up link closes it; a staff "Review" goes to the deactivate dialog; "Turn off" opens the
 * in-use warning and confirming just closes it; the maintenance switch opens the change dialog (Schedule change closes it). The nav items without a screen only log.
 */

const AdminSettingsPage = () => {
  const data = useAdminState();
  const session = useAdminSession();
  const navigate = useNavigate();
  const { tab = 'platform' } = useParams();
  const modal = data.modal;
  const creating = data.params.get('create') === '1';

  useEffect(() => {
    log('mount', { tab, modal, creating });
  }, [tab, modal, creating]);

  const close = () => data.update({ modal: null });

  let active = 'platform';
  let body;
  let subtitle = SUBTITLE_PLATFORM;
  let action = null;
  let navOrder;

  if (tab === 'staff') {
    active = 'staff';
    subtitle = 'GTH staff accounts and their roles. Least privilege for every role.';
    action =
      session.role === 'super'
        ? { label: CREATE_ACTION, onClick: () => data.update({ create: true }) }
        : null;
    body = <StaffTab creating={creating} onClose={() => data.update({ create: null })} session={session} />;
  } else if (tab === 'onboarding') {
    active = 'onboarding';
    subtitle = 'Templates institutions and partners use to onboard people in bulk. Super Admins only; every change is logged.';
    body = <OnboardingTemplateTab session={session} />;
  } else if (tab === 'roles') {
    active = 'roles';
    navOrder = 'roles';
    body = <RolesTab />;
  } else if (tab === 'staff-data') {
    body = (
      <PlatformTab view="staff-data" onDeactivate={() => data.update({ modal: 'deactivate' })} />
    );
  } else {
    body = <PlatformConfigTab />;
  }

  return (
    <AdminFrame data={data} title="Settings">
      <AdminSettingsShell active={active} subtitle={subtitle} action={action} navOrder={navOrder}>
        {body}
      </AdminSettingsShell>
      {modal === 'last-super' ? (
        <AdminConfirmDialog
          title={LAST_SUPER.title}
          body={LAST_SUPER.body}
          primary={{ label: LAST_SUPER.primary, tone: 'red' }}
          secondary={LAST_SUPER.secondary}
          onPrimary={() => {
            log('change a role (no screen drawn)');
            close();
          }}
          onClose={close}
        />
      ) : null}
      {modal === 'deactivate' ? (
        <DeactivateDialog
          onClose={close}
          onConfirm={() => {
            log('deactivate (mock)');
            navigate('/admin/settings/staff');
          }}
        />
      ) : null}
      {modal === 'in-use' ? (
        <AdminConfirmDialog
          title={FLAG_IN_USE.title}
          body={FLAG_IN_USE.body}
          primary={{ label: FLAG_IN_USE.primary, arrow: true }}
          secondary={FLAG_IN_USE.secondary}
          onPrimary={close}
          onClose={close}
        />
      ) : null}
      {modal === 'setting' ? (
        <AdminRecordDialog
          chip={CHANGE_SETTING.chip}
          title={CHANGE_SETTING.title}
          sub={CHANGE_SETTING.sub}
          file={CHANGE_SETTING.file}
          rows={CHANGE_SETTING.rows}
          checkbox={{ label: CHANGE_SETTING.tell, checked: true }}
          notice={CHANGE_SETTING.allowed}
          link={{ label: CHANGE_SETTING.cancelLink }}
          secondary={CHANGE_SETTING.cancel}
          primary={CHANGE_SETTING.primary}
          onSubmit={close}
          onClose={close}
        />
      ) : null}
    </AdminFrame>
  );
};

export default AdminSettingsPage;
