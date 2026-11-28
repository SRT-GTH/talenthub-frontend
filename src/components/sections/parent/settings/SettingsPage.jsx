import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout as clearLocalSession } from '../../../../services/auth.api.js';
import { serverLogout } from '../../../../services/settings.api.js';
import { debug } from '../../../../utils/debug.js';
import LiveSettingsStatus from '../../talentSettings/LiveSettingsStatus.jsx';
import { useLiveSettings } from '../../talentSettings/useLiveSettings.js';
import { resetParentLive, useParentLiveMode, useParentMe } from '../live/parentLive.js';
import SettingsAccessibility from '../../talentSettings/SettingsAccessibility.jsx';
import SettingsLanguage from '../../talentSettings/SettingsLanguage.jsx';
import SettingsLayout from '../../talentSettings/SettingsLayout.jsx';
import ParentFrame from '../ParentFrame.jsx';
import AccountTab from './AccountTab.jsx';
import CloseAccountDialog from './CloseAccountDialog.jsx';
import DataTab from './DataTab.jsx';
import LogoutDialog from './LogoutDialog.jsx';
import NotificationsTab from './NotificationsTab.jsx';
import RolesTab from './RolesTab.jsx';
import SecurityTab from './SecurityTab.jsx';
import SettingsResult from './SettingsResult.jsx';
import { NAV } from './data/settingsData.js';
import { useSettingsState } from './settingsState.js';

const log = debug('ParentSettings');

/*
 * SettingsPage — /parent/settings, the parent Settings (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 11 Settings and account" 10057:67440). The page frame is the talent `SettingsLayout`
 * (heading, 280px section nav, content) given the parent's nav list; the parent chrome is `ParentFrame`.
 *   ?tab=account|roles|notifications|security|data     PS-01 … PS-05
 *   ?modal=logout                                      PS-06 over the Account tab · ?state=logged-out PS-06b
 *   ?tab=data&modal=close-account[&confirm=CLO]        PS-07 over Data and account · ?state=closed PS-07b
 *   ?tab=accessibility|language                        ⚠️ ASSUMPTION: no parent frame, so these reuse the talent sections (ST-04 / ST-05) inside the same layout
 * Live (signed-in parent, not a frame URL): `useLiveSettings` (the talent Settings hook: GET /settings/overview + /settings/notifications) is passed to
 * every tab as `settings.live`; Account, Notifications, Accessibility, Language, Security and Data save through it. Roles and closing the parent account
 * have no endpoint yet. Log out always ends the session (POST /users/logout, then the local tokens), as the talent and recruiter Log out do.
 */
// Tabs that read GET /settings/overview: they wait for it (loading / error note) when live.
const NEEDS_OVERVIEW = ['account', 'notifications', 'accessibility', 'language', 'security'];
const CLOSE_UNAVAILABLE =
  'Closing a parent account is not available online yet. Ask us from Help and we will close it for you.';
const TABS = {
  account: AccountTab,
  roles: RolesTab,
  notifications: NotificationsTab,
  security: SecurityTab,
  data: DataTab,
  accessibility: SettingsAccessibility,
  language: SettingsLanguage,
};

const SettingsPage = () => {
  const st = useSettingsState();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const liveMode = useParentLiveMode();
  const live = useLiveSettings({ enabled: liveMode });
  const me = useParentMe();
  const [byeName, setByeName] = useState('');
  const [closeError, setCloseError] = useState(null);
  log('render', { tab: st.tab, modal: st.modal, result: st.result, live: live?.status ?? 'demo' });

  const logOut = async () => {
    const first = live?.overview?.account?.firstName || me.data?.parent?.firstName || '';
    log('log out', { live: Boolean(live) });
    // The server call never blocks the screen for long (a cold staging server can take many seconds).
    await Promise.race([serverLogout(), new Promise((r) => setTimeout(r, 3000))]);
    clearLocalSession();
    resetParentLive();
    setByeName(first);
    st.update({ modal: null, state: 'logged-out' }, { replace: true });
  };

  const hrefFor = (item) => {
    if (item.undrawn) return `${pathname}${search}`;
    const p = new URLSearchParams(search);
    ['modal', 'confirm', 'state', 'sstate'].forEach((k) => p.delete(k));
    p.set('tab', item.id);
    return `${pathname}?${p.toString()}`;
  };

  if (st.result) {
    return (
      <ParentFrame active="settings" sidebar="linked" dimSidebar>
        <SettingsResult
          kind={st.result}
          name={st.result === 'logged-out' ? byeName : ''}
          onLogIn={() => navigate('/login')}
          onCareer={() => navigate('/home')}
          onUndo={() => st.update({ state: null, tab: 'data' }, { replace: true })}
        />
      </ParentFrame>
    );
  }

  const Tab = TABS[st.tab];
  const goTab = (tab) => st.update({ tab, modal: null, confirm: null });

  return (
    <ParentFrame active="settings" sidebar="linked">
      <SettingsLayout
        settings={{ section: st.tab }}
        items={NAV}
        hrefFor={hrefFor}
        onLogout={() => st.update({ modal: 'logout' })}
      >
        {live && live.status !== 'ready' && NEEDS_OVERVIEW.includes(st.tab) ? (
          <LiveSettingsStatus live={live} />
        ) : (
          <Tab
            key={live ? 'live' : 'demo'}
            settings={{
              state: st.sectionState,
              update: st.sectionUpdate,
              ...(live ? { live } : {}),
            }}
            onRoles={() => goTab('roles')}
            onManage={() => navigate('/parent/wards')}
            onClose={() => {
              setCloseError(null);
              st.update({ modal: 'close-account', confirm: null });
            }}
          />
        )}
      </SettingsLayout>
      {st.modal === 'logout' ? (
        <LogoutDialog onStay={() => st.update({ modal: null })} onConfirm={logOut} />
      ) : null}
      {st.modal === 'close-account' ? (
        <CloseAccountDialog
          value={st.confirm}
          onChange={(text) => st.update({ confirm: text }, { replace: true })}
          onKeep={() => st.update({ modal: null, confirm: null })}
          error={closeError}
          onConfirm={() => {
            // No endpoint closes only the parent role (POST /settings/deactivate turns the whole account off, My career too).
            if (live) {
              log('close parent account: no endpoint, not closed');
              setCloseError(CLOSE_UNAVAILABLE);
              return;
            }
            st.update({ modal: null, confirm: null, state: 'closed' }, { replace: true });
          }}
        />
      ) : null}
    </ParentFrame>
  );
};

export default SettingsPage;
