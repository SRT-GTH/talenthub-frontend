import { useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
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
 * ⚠️ ASSUMPTION: Accessibility and Language and data (nav items with no parent frame) only log.
 */
const TABS = {
  account: AccountTab,
  roles: RolesTab,
  notifications: NotificationsTab,
  security: SecurityTab,
  data: DataTab,
};

const SettingsPage = () => {
  const st = useSettingsState();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  log('render', { tab: st.tab, modal: st.modal, result: st.result });

  const hrefFor = (item) => {
    if (item.undrawn) return `${pathname}${search}`;
    const p = new URLSearchParams(search);
    ['modal', 'confirm', 'state'].forEach((k) => p.delete(k));
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

  return (
    <ParentFrame active="settings" sidebar="linked">
      <SettingsLayout
        settings={{ section: st.tab }}
        items={NAV}
        hrefFor={hrefFor}
        onLogout={() => st.update({ modal: 'logout' })}
      >
        <Tab
          onRoles={() => goTab('roles')}
          onManage={() => navigate('/parent/wards')}
          onClose={() => st.update({ modal: 'close-account', confirm: null })}
        />
      </SettingsLayout>
      {st.modal === 'logout' ? (
        <LogoutDialog
          onStay={() => st.update({ modal: null })}
          onConfirm={() => st.update({ modal: null, state: 'logged-out' }, { replace: true })}
        />
      ) : null}
      {st.modal === 'close-account' ? (
        <CloseAccountDialog
          value={st.confirm}
          onChange={(text) => st.update({ confirm: text }, { replace: true })}
          onKeep={() => st.update({ modal: null, confirm: null })}
          onConfirm={() =>
            st.update({ modal: null, confirm: null, state: 'closed' }, { replace: true })
          }
        />
      ) : null}
    </ParentFrame>
  );
};

export default SettingsPage;
