import { useCallback, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import AgencyAnalystsTab from '../../components/sections/agency/settings/AgencyAnalystsTab.jsx';
import AgencyApiKeysTab from '../../components/sections/agency/settings/AgencyApiKeysTab.jsx';
import AgencyAuditLogTab from '../../components/sections/agency/settings/AgencyAuditLogTab.jsx';
import AgencyMouTab from '../../components/sections/agency/settings/AgencyMouTab.jsx';
import AgencyNotificationsTab from '../../components/sections/agency/settings/AgencyNotificationsTab.jsx';
import AgencyProfileTab from '../../components/sections/agency/settings/AgencyProfileTab.jsx';
import AgencySettingsLayout from '../../components/sections/agency/settings/AgencySettingsLayout.jsx';
import AgencySettingsToast from '../../components/sections/agency/settings/AgencySettingsToast.jsx';
import {
  SETTINGS_SUBTITLE,
  SETTINGS_TABS,
} from '../../components/sections/agency/settings/data/agencySettingsData.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencySettingsPage');

/*
 * AgencySettingsPage — /agency/settings[/:tab] (Figma 11.6.1a-h). Tabs: (none) = Agency profile · analysts · api-keys · notifications · mou ·
 * audit-log (no settings nav, its own heading). Query keys owned here: modal=invite|remove (+ at=<analyst id>) on analysts; view / kind / layout / page on
 * audit-log. Toasts (saved, invite sent, undo remove ...) are mock state shared by the tabs.
 */
const AgencySettingsPage = () => {
  const data = useAgencyState();
  const { tab: routeTab } = useParams();
  const [toast, setToast] = useState(null);
  const undoRef = useRef(null);

  const showToast = useCallback((next, onUndo) => {
    log('toast', next.title);
    undoRef.current = onUndo ?? null;
    setToast(next);
  }, []);
  const dismiss = useCallback(() => setToast(null), []);
  const undo = () => {
    undoRef.current?.();
    undoRef.current = null;
    setToast(null);
  };

  const tab = routeTab ?? 'profile';
  if (!SETTINGS_TABS.includes(tab) || routeTab === 'profile') {
    log('unknown tab, redirect', routeTab);
    return <Navigate to="/agency/settings" replace />;
  }

  const body = {
    profile: <AgencyProfileTab onToast={showToast} />,
    analysts: <AgencyAnalystsTab data={data} onToast={showToast} />,
    'api-keys': <AgencyApiKeysTab onToast={showToast} />,
    notifications: <AgencyNotificationsTab onToast={showToast} />,
    mou: <AgencyMouTab onToast={showToast} />,
  }[tab];

  return (
    <AgencyFrame data={data} title={tab === 'audit-log' ? 'Audit log' : 'Settings'}>
      {tab === 'audit-log' ? (
        <AgencyAuditLogTab data={data} onToast={showToast} />
      ) : (
        <AgencySettingsLayout
          active={tab}
          subtitle={
            tab === 'analysts'
              ? 'Everyone gets their own login. 3 of 5 analyst seats used under the MoU.'
              : (SETTINGS_SUBTITLE[tab] ?? SETTINGS_SUBTITLE.default)
          }
        >
          {body}
        </AgencySettingsLayout>
      )}
      <AgencySettingsToast toast={toast} onUndo={undo} onDismiss={dismiss} />
    </AgencyFrame>
  );
};

export default AgencySettingsPage;
