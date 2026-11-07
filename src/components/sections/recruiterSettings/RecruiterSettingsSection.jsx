import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import SettingsLayout from '../talentSettings/SettingsLayout.jsx';
import WorkspaceSidebar from '../recruiterDashboard/WorkspaceSidebar.jsx';
import {
  RECRUITER_SETTINGS_HEADING,
  RECRUITER_SETTINGS_NAV,
  RECRUITER_SETTINGS_SUBHEADING,
} from './recruiterSettingsData.js';
import { useRecruiterSettingsState } from './recruiterSettingsState.js';
import AccountTab from './tabs/AccountTab.jsx';
import OrganisationTab from './tabs/OrganisationTab.jsx';
import TeamTab from './tabs/TeamTab.jsx';
import HiringTab from './tabs/HiringTab.jsx';
import NotificationsTab from './tabs/NotificationsTab.jsx';
import BillingTab from './tabs/BillingTab.jsx';
import AccessibilityTab from './tabs/AccessibilityTab.jsx';
import LanguageTab from './tabs/LanguageTab.jsx';
import SecurityTab from './tabs/SecurityTab.jsx';
import RecruiterLogoutDialog from './RecruiterLogoutDialog.jsx';
import RecruiterLoggedOut from './RecruiterLoggedOut.jsx';
import RecruiterProfileMenu from './RecruiterProfileMenu.jsx';
import { useRecruiterHelpPanels } from './help/useRecruiterHelpPanels.jsx';
import HiringPausedBanner from './hiring/HiringPausedBanner.jsx';

const log = debug('RecruiterSettingsSection');

const TABS = {
  account: AccountTab,
  organisation: OrganisationTab,
  team: TeamTab,
  hiring: HiringTab,
  notifications: NotificationsTab,
  billing: BillingTab,
  accessibility: AccessibilityTab,
  language: LanguageTab,
  security: SecurityTab,
};

const renderSettingsSidebar = ({ collapsed, onToggle }) =>
  collapsed ? null : <WorkspaceSidebar onToggle={onToggle} showSettings settingsActive />;

/*
 * RecruiterSettingsSection - `/recruiter/settings` (Figma "Recruiter - Settings & Account" 10161:75722): the talent Settings page frame
 * (`talentSettings/SettingsLayout`, recruiter nav + copy) inside the recruiter workspace shell, Settings active in the rail.
 * Every tab is its own file under `tabs/`; dialogs and toasts are rendered by the tab that owns them. State is the URL (`useRecruiterSettingsState`).
 * The top-bar Help pop-over and Profile menu are passed to the shell through `panels` (`onHelp` / `help`, `onProfile` / `profileMenu`).
 * Wiki: recruiter-settings.md.
 */
const RecruiterSettingsSection = () => {
  const settings = useRecruiterSettingsState();
  // Figma draws the recruiter screens in SF Pro Rounded (bundled face, scoped to the recruiter screens).
  useScopedRoundedFont('data-recruiter-ui', true);
  const helpPanels = useRecruiterHelpPanels();
  const profileOpen = settings.get('menu') === 'open';
  useEffect(() => {
    log('mount', { tab: settings.tab, modal: settings.modal, state: settings.state });
  }, [settings.tab, settings.modal, settings.state]);

  if (settings.state === 'logged-out') return <RecruiterLoggedOut settings={settings} />;

  const Tab = TABS[settings.tab] ?? AccountTab;
  const panels = {
    ...helpPanels,
    onProfile: () => settings.update({ menu: profileOpen ? null : 'open', help: null }),
    profileOpen,
    profileMenu: <RecruiterProfileMenu settings={settings} />,
  };

  return (
    <DashboardShell renderSidebar={renderSettingsSidebar} panels={panels}>
      <div className="w-full py-[32px] pr-[clamp(16px,3.24vw,56px)] pl-[clamp(16px,2.3vw,40px)] max-md:py-[12px]">
        <SettingsLayout
          settings={settings}
          items={RECRUITER_SETTINGS_NAV}
          hrefFor={(item) => `/recruiter/settings?tab=${item.id}`}
          onLogout={() => settings.update({ modal: 'logout' })}
          heading={RECRUITER_SETTINGS_HEADING}
          subheading={RECRUITER_SETTINGS_SUBHEADING}
        >
          <HiringPausedBanner settings={settings} />
          <Tab settings={settings} />
        </SettingsLayout>
      </div>
      {settings.modal === 'logout' ? <RecruiterLogoutDialog settings={settings} /> : null}
    </DashboardShell>
  );
};

export default RecruiterSettingsSection;
