import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import DashboardShell from '../../components/sections/dashboard/DashboardShell.jsx';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import {
  SETTINGS_SECTIONS,
  useTalentSettingsState,
} from '../../components/sections/talentSettings/talentSettingsState.js';
import SettingsLayout from '../../components/sections/talentSettings/SettingsLayout.jsx';
import SettingsAccount from '../../components/sections/talentSettings/SettingsAccount.jsx';
import SettingsPrivacy from '../../components/sections/talentSettings/SettingsPrivacy.jsx';
import SettingsNotifications from '../../components/sections/talentSettings/SettingsNotifications.jsx';
import SettingsAccessibility from '../../components/sections/talentSettings/SettingsAccessibility.jsx';
import SettingsLanguage from '../../components/sections/talentSettings/SettingsLanguage.jsx';
import SettingsSecurity from '../../components/sections/talentSettings/SettingsSecurity.jsx';
import SettingsData from '../../components/sections/talentSettings/SettingsData.jsx';
import SettingsGuardian from '../../components/sections/talentSettings/SettingsGuardian.jsx';
import SettingsAppearance from '../../components/sections/talentSettings/SettingsAppearance.jsx';
import HelpSupportPage from '../../components/sections/talentSettings/HelpSupportPage.jsx';
import { useLiveSettings } from '../../components/sections/talentSettings/useLiveSettings.js';
import LiveSettingsStatus from '../../components/sections/talentSettings/LiveSettingsStatus.jsx';
import { useTalentHomeState } from '../../components/sections/talentHome/talentHomeState.js';
// Site copy: the texts staff edit are applied to this page's data (copy/copyBind.js).
import '../../copy/portals/talentPagesCopy.js';

const log = debug('TalentSettingsPage');

const SECTION_BODIES = {
  account: SettingsAccount,
  privacy: SettingsPrivacy,
  notifications: SettingsNotifications,
  accessibility: SettingsAccessibility,
  language: SettingsLanguage,
  security: SettingsSecurity,
  data: SettingsData,
  guardian: SettingsGuardian,
  appearance: SettingsAppearance,
};

/*
 * TalentSettingsPage — `/settings/:section`, Figma "Talent Settings & Account" (7849:530),
 * Focused + Playful in one build. Frame <-> URL table and file ownership: wiki/talent-settings.md.
 * The profile menu, log-out confirm, help pop-over set and feedback / invite dialogs are SHELL-level
 * overlays (any talent page can open them from the URL) — they are mounted by the talent shell, not here.
 */
const TalentSettingsPage = ({ sectionParam }) => {
  const base = useTalentSettingsState();
  // Live by default (`?demo=1` keeps the drawn mock): every section reads and saves through `settings.live`.
  const live = useLiveSettings({ enabled: !base.demo });
  const settings = live ? { ...base, live } : base;
  // `?demo=1` never calls the talent API (a design-QA visit without a session is not sent to /login).
  const home = useTalentHomeState({ enabled: !base.demo });
  const liveShell = !base.demo && Boolean(home?.live);

  useEffect(() => {
    ensurePlayfulFont();
  }, []);

  // Marks <html> while mounted so talentA11y.css (focus ring, reduced motion) covers portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', { section: settings.section, state: settings.state });
  }, [settings.section, settings.state]);

  if (sectionParam && !SETTINGS_SECTIONS.includes(sectionParam)) {
    return <Navigate to={`/settings/account${base.demo ? '?demo=1' : ''}`} replace />;
  }

  const Body = SECTION_BODIES[settings.section];

  return (
    <DashboardShell
      role="talent"
      activeNav="settings"
      talentHome={
        liveShell ? { ...home, update: base.update, collapsed: base.collapsed } : settings
      }
    >
      <UiStyleScope enabled />
      <div className="flex flex-col gap-[clamp(12px,0.926vw,16px)] px-[clamp(12px,1.4vw,24px)] py-[clamp(12px,1.2vw,20px)]">
        {settings.section === 'help' ? (
          <HelpSupportPage settings={settings} />
        ) : (
          <SettingsLayout
            settings={settings}
            // `?demo=1` (drawn mock) stays on while moving between sections.
            hrefFor={(item) => `/settings/${item.id}${base.demo ? '?demo=1' : ''}`}
          >
            {live && live.status !== 'ready' ? (
              <LiveSettingsStatus live={live} />
            ) : Body ? (
              <Body settings={settings} />
            ) : null}
          </SettingsLayout>
        )}
      </div>
    </DashboardShell>
  );
};

export default TalentSettingsPage;
