import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import SettingsLayout from '../../talentSettings/SettingsLayout.jsx';
import ParentFrame from '../ParentFrame.jsx';
import AccountTab from './AccountTab.jsx';
import CloseAccountDialog from './CloseAccountDialog.jsx';
import DataTab from './DataTab.jsx';
import LogoutDialog from './LogoutDialog.jsx';
import NotificationsTab from './NotificationsTab.jsx';
import { AccessibilityTab, LanguageTab } from './PreferenceTabs.jsx';
import RolesTab from './RolesTab.jsx';
import SecurityTab from './SecurityTab.jsx';
import SettingsResult from './SettingsResult.jsx';
import { NAV } from './data/settingsData.js';
import { useSettingsState } from './settingsState.js';
import { loadParentMe, resetParentLive, useParentLiveMode } from '../live/parentLive.js';
import { whenText } from '../live/parentLiveView.js';
import { logout } from '../../../../services/auth.api.js';
import {
  deactivateAccount,
  downloadMyData,
  fetchNotificationSettings,
  fetchSessions,
  fetchSettingsOverview,
  logOutDevice,
  logOutOtherDevices,
  saveAccount,
  saveNotificationSettings,
  savePreferences,
  serverLogout,
  settingsError,
} from '../../../../services/settings.api.js';

const log = debug('ParentSettings');

/*
 * SettingsPage — /parent/settings, the parent Settings (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 11 Settings and account" 10057:67440). The page frame is the talent `SettingsLayout`
 * (heading, 280px section nav, content) given the parent's nav list; the parent chrome is `ParentFrame`.
 *   ?tab=account|roles|notifications|security|data     PS-01 … PS-05
 *   ?modal=logout                                      PS-06 over the Account tab · ?state=logged-out PS-06b
 *   ?tab=data&modal=close-account[&confirm=CLO]        PS-07 over Data and account · ?state=closed PS-07b
 * Accessibility and Language and data have no parent frames: they reuse the talent screens (PreferenceTabs.jsx).
 * Live (signed in): the settings API the talent Settings use (/settings/*, which serves parents too; the notification
 * matrix has the parent's own rows): Account loads and saves, Notifications loads and saves (and the 24-hour pause),
 * Security lists and logs out real sessions, Data downloads a copy, Log out and Close account are real.
 * "Your roles" (which space opens first, keep spaces apart) stays local: there is no setting for it yet.
 */
const TABS = {
  account: AccountTab,
  roles: RolesTab,
  notifications: NotificationsTab,
  accessibility: AccessibilityTab,
  language: LanguageTab,
  security: SecurityTab,
  data: DataTab,
};

const sessionRow = (s) => ({
  id: s.id,
  kind: s.kind === 'phone' ? 'mobile' : s.kind || 'laptop',
  name: s.device || 'Unknown device',
  meta: `Last active ${whenText(s.lastSeenAt).toLowerCase()}`,
  current: Boolean(s.thisDevice),
});

const SettingsPage = () => {
  const st = useSettingsState();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const live = useParentLiveMode();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  log('render', { tab: st.tab, modal: st.modal, result: st.result, live });

  const load = useCallback(async () => {
    try {
      const [overview, notifications, sessions] = await Promise.all([
        fetchSettingsOverview(),
        fetchNotificationSettings(),
        fetchSessions(),
      ]);
      setData({
        overview: overview || {},
        account: overview?.account || {},
        notifications,
        sessions: sessions.map(sessionRow),
      });
    } catch (err) {
      setError(settingsError(err, 'Could not load your settings.'));
    }
  }, []);
  useEffect(() => {
    if (live && !st.result) load();
  }, [live, st.result, load]);

  const hrefFor = (item) => {
    if (item.undrawn) return `${pathname}${search}`;
    const p = new URLSearchParams(search);
    ['modal', 'confirm', 'state', 'pref'].forEach((k) => p.delete(k));
    p.set('tab', item.id);
    return `${pathname}?${p.toString()}`;
  };

  if (st.result) {
    return (
      <ParentFrame active="settings" sidebar="linked" dimSidebar>
        <SettingsResult
          kind={st.result}
          onLogIn={() => navigate('/login')}
          onCareer={() => navigate('/home')}
          onUndo={() => st.update({ state: null, tab: 'data' }, { replace: true })}
        />
      </ParentFrame>
    );
  }

  const Tab = TABS[st.tab];
  const goTab = (tab) => st.update({ tab, modal: null, confirm: null });

  const liveFor = (tab) => {
    if (!live || !data) return null;
    if (tab === 'account') {
      return {
        account: data.account,
        save: async (v) => {
          const [firstName, ...rest] = String(v.fullName || '')
            .trim()
            .split(/\s+/);
          try {
            await saveAccount({
              firstName: firstName || undefined,
              lastName: rest.join(' ') || undefined,
              phoneNumber: v.phone ? v.phone.replace(/\s+/g, '') : undefined,
              region: v.region || undefined,
              city: v.city || undefined,
            });
          } catch (err) {
            throw new Error(settingsError(err));
          }
          await loadParentMe(true);
        },
      };
    }
    if (tab === 'notifications') {
      return {
        matrix: data.notifications,
        save: async (body) => {
          try {
            await saveNotificationSettings(body);
          } catch (err) {
            throw new Error(settingsError(err));
          }
        },
      };
    }
    if (tab === 'security') {
      return {
        sessions: data.sessions,
        logOut: async (ids) => {
          const others = data.sessions.filter((s) => !s.current).map((s) => s.id);
          if (ids.length > 1 && ids.length === others.length) await logOutOtherDevices();
          else await Promise.all(ids.map((id) => logOutDevice(id)));
          setData((d) => ({ ...d, sessions: d.sessions.filter((s) => !ids.includes(s.id)) }));
        },
      };
    }
    if (tab === 'data') return { download: () => downloadMyData() };
    if (tab === 'accessibility' || tab === 'language') {
      return {
        overview: data.overview,
        savePreferences: async (group, values) => {
          const preferences = await savePreferences({ [group]: values });
          setData((d) => ({ ...d, overview: { ...d.overview, preferences } }));
          return preferences;
        },
      };
    }
    return null;
  };

  const signOut = async (state) => {
    await serverLogout().catch(() => {});
    logout();
    resetParentLive();
    st.update({ modal: null, confirm: null, state }, { replace: true });
  };

  return (
    <ParentFrame active="settings" sidebar="linked">
      <SettingsLayout
        settings={{ section: st.tab }}
        items={NAV}
        hrefFor={hrefFor}
        onLogout={() => st.update({ modal: 'logout' })}
      >
        {live && !data ? (
          <p role={error ? 'alert' : 'status'} className="m-0 font-sans text-[15px] text-[#575755]">
            {error || 'Loading…'}
          </p>
        ) : (
          <Tab
            key={live ? `${st.tab}-live` : st.tab}
            live={liveFor(st.tab)}
            onRoles={() => goTab('roles')}
            onManage={() => navigate('/parent/wards')}
            onClose={() => st.update({ modal: 'close-account', confirm: null })}
          />
        )}
      </SettingsLayout>
      {st.modal === 'logout' ? (
        <LogoutDialog
          onStay={() => st.update({ modal: null })}
          onConfirm={() =>
            live
              ? signOut('logged-out')
              : st.update({ modal: null, state: 'logged-out' }, { replace: true })
          }
        />
      ) : null}
      {st.modal === 'close-account' ? (
        <CloseAccountDialog
          value={st.confirm}
          onChange={(text) => st.update({ confirm: text }, { replace: true })}
          onKeep={() => st.update({ modal: null, confirm: null })}
          onConfirm={async () => {
            if (!live) {
              st.update({ modal: null, confirm: null, state: 'closed' }, { replace: true });
              return;
            }
            try {
              await deactivateAccount();
              await signOut('closed');
            } catch (err) {
              setError(settingsError(err));
              st.update({ modal: null, confirm: null });
            }
          }}
        />
      ) : null}
    </ParentFrame>
  );
};

export default SettingsPage;
