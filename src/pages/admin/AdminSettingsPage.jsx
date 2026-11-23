import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import AdminSettingsShell from '../../components/sections/admin/settings/AdminSettingsShell.jsx';
import PlatformConfigTab from '../../components/sections/admin/settings/PlatformConfigTab.jsx';
import PlatformValuesTab from '../../components/sections/admin/settings/PlatformValuesTab.jsx';
import OnboardingTemplateTab from '../../components/sections/admin/settings/OnboardingTemplateTab.jsx';
import RolesPermissionsTab from '../../components/sections/admin/settings/RolesPermissionsTab.jsx';
import OrganisationsTab from '../../components/sections/admin/settings/OrganisationsTab.jsx';
import AgenciesTab from '../../components/sections/admin/settings/AgenciesTab.jsx';
import SystemNotificationsTab from '../../components/sections/admin/settings/SystemNotificationsTab.jsx';
import ReferenceDataTab from '../../components/sections/admin/settings/ReferenceDataTab.jsx';
import StaffTab from '../../components/sections/admin/settings/StaffTab.jsx';
import TwoStepPanel from '../../components/sections/twoStep/TwoStepPanel.jsx';
import OverviewTab from '../../components/sections/admin/settings/insights/OverviewTab.jsx';
import SecurityTab from '../../components/sections/admin/settings/insights/SecurityTab.jsx';
import AccessibilityTab from '../../components/sections/admin/settings/insights/AccessibilityTab.jsx';
import {
  CREATE_ACTION,
  SUBTITLE_PLATFORM,
} from '../../components/sections/admin/settings/data/adminSettingsData.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminSettingsPage');

/*
 * AdminSettingsPage — /admin/settings[/:tab] (Figma 7.5.1-7.5.2, Super Admin persona: add ?role=super). Tabs and URL states (shared keys in adminState.js):
 *   /admin/settings/staff                     Staff accounts (7.5.1a) · ?create=1 → create form (7.5.1b); deactivate / last-Super-Admin dialogs are in StaffTab
 *   /admin/settings/staff-data                old link: shows Staff accounts (deactivating is done from a staff row there)
 *   /admin/settings/overview | security | accessibility   live figures (adminInsights; Senior and Super Admin)
 *   /admin/settings/two-step                  My 2-step verification (MFA Phase 2): the signed-in staff member's own authenticator apps and backup codes
 *   /admin/settings/roles                     Roles and permissions (7.5.1e)
 *   /admin/settings/values                    Platform values: the platformEnum lists in the database (PlatformValuesTab)
 *   /admin/settings  (= /admin/settings/platform)   platform config groups; #feature_flag / #integration scroll to a group (nav: Feature flags / Integrations)
 * Every nav item has a screen; dialogs live in the tabs that use them (StaffTab, PlatformConfigTab, …).
 */

const AdminSettingsPage = () => {
  const data = useAdminState();
  const session = useAdminSession();
  const { tab = 'platform' } = useParams();
  const { hash } = useLocation();
  const creating = data.params.get('create') === '1';

  useEffect(() => {
    log('mount', { tab, creating });
  }, [tab, creating]);

  let active = { '#feature_flag': 'flags', '#integration': 'integrations' }[hash] || 'platform';
  let body;
  let subtitle = SUBTITLE_PLATFORM;
  let action = null;
  let navOrder;

  if (tab === 'staff' || tab === 'staff-data') {
    active = 'staff';
    subtitle = 'GTH staff accounts and their roles. Least privilege for every role.';
    action =
      session.role === 'super'
        ? { label: CREATE_ACTION, onClick: () => data.update({ create: true }) }
        : null;
    body = (
      <StaffTab
        creating={creating}
        onClose={() => data.update({ create: null })}
        session={session}
      />
    );
  } else if (tab === 'two-step') {
    active = 'two-step';
    subtitle =
      'Your own 2-step verification. Staff need it to use the console; every change is emailed to you and logged.';
    body = <TwoStepPanel />;
  } else if (tab === 'onboarding') {
    active = 'onboarding';
    subtitle =
      'Templates institutions and partners use to onboard people in bulk. Super Admins only; every change is logged.';
    body = <OnboardingTemplateTab session={session} />;
  } else if (tab === 'values') {
    active = 'values';
    subtitle =
      'The lists the platform checks values against (education levels, consent types, statuses …), as they are in the database. Super Admins only; every change is logged.';
    body = <PlatformValuesTab session={session} />;
  } else if (tab === 'roles') {
    active = 'roles';
    navOrder = 'roles';
    subtitle =
      'Roles, permissions and role groups from the access-control service. Super Admins make changes; every change is logged.';
    body = <RolesPermissionsTab data={data} session={session} />;
  } else if (tab === 'reference') {
    active = 'reference';
    subtitle =
      'Lists other features read, such as opportunity categories. Senior and Super Admins make changes; each needs a reason and is logged.';
    body = <ReferenceDataTab data={data} session={session} />;
  } else if (tab === 'notifications') {
    active = 'notifications';
    subtitle =
      'Emails and SMS the platform sends by itself, and which notification types each one answers. Every edit is versioned and logged.';
    body = <SystemNotificationsTab data={data} session={session} />;
  } else if (tab === 'organisations') {
    active = 'organisations';
    subtitle =
      'Platform tenants (GTH, and any new national hub) and the organisations under them. Every change is logged.';
    body = <OrganisationsTab data={data} session={session} />;
  } else if (tab === 'agencies') {
    active = 'agencies';
    subtitle =
      'Government agencies with access to aggregate talent figures. Create their accounts, hand over a temporary password, pause or restore access.';
    action =
      session.role === 'super' || session.role === 'senior'
        ? { label: 'Create agency', onClick: () => data.update({ create: true }) }
        : null;
    body = (
      <AgenciesTab
        creating={creating}
        onClose={() => data.update({ create: null })}
        session={session}
      />
    );
  } else if (tab === 'overview') {
    active = 'overview';
    subtitle = 'Each settings area at a glance, with live figures.';
    body = <OverviewTab />;
  } else if (tab === 'security') {
    active = 'security';
    subtitle =
      'Sign-in rules, failed sign-ins and staff sign-in activity. Read only; rules change in Platform settings.';
    body = <SecurityTab session={session} />;
  } else if (tab === 'accessibility') {
    active = 'accessibility';
    subtitle = 'Which accessibility and language options people use. Counts only.';
    body = <AccessibilityTab />;
  } else {
    body = <PlatformConfigTab />;
  }

  return (
    <AdminFrame data={data} title="Settings">
      <AdminSettingsShell active={active} subtitle={subtitle} action={action} navOrder={navOrder}>
        {body}
      </AdminSettingsShell>
    </AdminFrame>
  );
};

export default AdminSettingsPage;
