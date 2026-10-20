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
import { useTalentHomeState } from '../../components/sections/talentHome/talentHomeState.js';

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
/* Live data loading / failed (never the drawn mock in its place). */
const LiveSettingsStatus = ({ live }) =>
  live.status === 'error' ? (
    <div role="alert" className="flex flex-col items-start gap-[12px] rounded-[20px] bg-white p-[24px]">
      <p className="m-0 text-[15px] font-medium text-[#c0392b]">Couldn’t load your settings. Check your connection and try again.</p>
      <button
        type="button"
        onClick={live.reload}
        className="cursor-pointer rounded-[10px] border border-solid border-[#ccc] bg-white px-[16px] py-[8px] text-[14px] font-semibold text-[#1c2a21]"
      >
        Try again
      </button>
    </div>
  ) : (
    <p aria-live="polite" className="m-0 py-[40px] text-center text-[14px] text-[#737373]">
      Loading your settings…
    </p>
  );

const TalentSettingsPage = ({ sectionParam }) => {
  const base = useTalentSettingsState();
  // Live by default (`?demo=1` keeps the drawn mock): every section reads and saves through `settings.live`.
  const live = useLiveSettings({ enabled: !base.demo });
  const settings = live ? { ...base, live } : base;
  const home = useTalentHomeState();
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
    return <Navigate to="/settings/account" replace />;
  }

  const Body = SECTION_BODIES[settings.section];

  return (
    <DashboardShell
      role="talent"
      activeNav="settings"
      talentHome={liveShell ? { ...home, update: base.update, collapsed: base.collapsed } : settings}
    >
      <UiStyleScope enabled />
      <div className="flex flex-col gap-[clamp(12px,0.926vw,16px)] px-[clamp(12px,1.4vw,24px)] py-[clamp(12px,1.2vw,20px)]">
        {settings.section === 'help' ? (
          <HelpSupportPage settings={settings} />
        ) : (
          <SettingsLayout settings={settings}>
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
