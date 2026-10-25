import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionSession } from '../../components/sections/institution/useInstitutionSession.js';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import InstitutionAuditLogTab from '../../components/sections/institution/settings/InstitutionAuditLogTab.jsx';
import InstitutionDataTab from '../../components/sections/institution/settings/InstitutionDataTab.jsx';
import InstitutionNotificationsTab from '../../components/sections/institution/settings/InstitutionNotificationsTab.jsx';
import InstitutionProfileTab from '../../components/sections/institution/settings/InstitutionProfileTab.jsx';
import InstitutionRemoveStaffDialog from '../../components/sections/institution/settings/InstitutionRemoveStaffDialog.jsx';
import InstitutionSettingsLayout from '../../components/sections/institution/settings/InstitutionSettingsLayout.jsx';
import InstitutionSettingsToast from '../../components/sections/institution/settings/InstitutionSettingsToast.jsx';
import InstitutionStaffTab from '../../components/sections/institution/settings/InstitutionStaffTab.jsx';
import {
  SETTINGS_SUBTITLE,
  SETTINGS_TABS,
  STAFF_SEATS,
  STAFF_SEATS_HIDDEN_REV,
  TOASTS,
} from '../../components/sections/institution/settings/data/institutionSettingsData.js';
import { useInstitutionStaff } from '../../components/sections/institution/settings/useInstitutionStaff.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionSettingsPage');

/*
 * InstitutionSettingsPage — /institution/settings[/:tab] (Figma 11.6.1a-g). Tabs: profile (default) · staff · notifications · data · audit-log (no
 * settings nav, its own heading). URL keys owned here: modal=invite (+ invitee= / invitee_email= prefill) on staff, modal=remove (+ at=<staff id>,
 * default kwame-asante) on ANY tab — 11.6.1f draws the dialog over the Data tab, the trigger lives on the staff tab; view / kind / layout / page on audit-log.
 * Toasts (saved, invite sent, undo remove ...) are mock state shared by the tabs. The staff list lives here so the staff tab and the remove dialog share it.
 * FIGMA INCONSISTENCY: 11.6.1e / 11.6.1f (8746:*) are a revised copy of 11.6.1b / 11.6.1d (8597:*): `revised` selects it while the invite card
 * (staff tab) or the remove dialog (data tab) is open (see institutionSettingsData.js).
 */
const InstitutionSettingsPage = () => {
  const data = useInstitutionState();
  const session = useInstitutionSession();
  const { tab: routeTab } = useParams();
  const team = useInstitutionStaff();
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
  const removeId = data.modal === 'remove' ? (data.params.get('at') ?? 'kwame-asante') : null;
  const removing = team.staff.find((s) => s.id === removeId && s.status === 'active' && !s.self);

  useEffect(() => {
    log('mount', { tab, modal: data.modal });
  }, [tab, data.modal]);

  if (!routeTab || !SETTINGS_TABS.includes(tab)) {
    log('unknown tab, redirect', routeTab);
    return <Navigate to="/institution/settings/profile" replace />;
  }

  const revised =
    (tab === 'staff' && data.modal === 'invite') || (tab === 'data' && Boolean(removing));

  const closeRemove = () => data.update({ modal: null, at: null });
  const confirmRemove = () => {
    const { gone, index } = team.remove(removing.id);
    closeRemove();
    showToast({ ...TOASTS.removed, body: `${gone.name} was signed out.`, undo: true }, () => {
      log('undo remove', gone.id);
      team.restore(gone, index);
    });
  };

  const seatsUsed = team.staff.length + STAFF_SEATS_HIDDEN_REV;
  let subtitle = SETTINGS_SUBTITLE.default;
  if (tab === 'staff') {
    subtitle =
      data.modal === 'invite'
        ? SETTINGS_SUBTITLE.staffRev(seatsUsed, STAFF_SEATS.rev)
        : SETTINGS_SUBTITLE.staff;
  } else if (tab === 'data' && revised) {
    subtitle = SETTINGS_SUBTITLE.dataRev;
  }

  const body = {
    profile: <InstitutionProfileTab onToast={showToast} />,
    staff: <InstitutionStaffTab data={data} team={team} revised={revised} onToast={showToast} />,
    notifications: <InstitutionNotificationsTab onToast={showToast} />,
    data: <InstitutionDataTab revised={revised} onToast={showToast} />,
  }[tab];

  return (
    <InstitutionFrame
      data={data}
      title={tab === 'audit-log' ? 'Audit log' : 'Settings'}
      active="none"
    >
      {tab === 'audit-log' ? (
        <InstitutionAuditLogTab data={data} onToast={showToast} />
      ) : (
        <InstitutionSettingsLayout active={tab} subtitle={subtitle} revised={revised}>
          {body}
        </InstitutionSettingsLayout>
      )}
      {removing ? (
        <InstitutionRemoveStaffDialog
          member={removing}
          actorName={session.admin.name}
          onClose={closeRemove}
          onConfirm={confirmRemove}
        />
      ) : null}
      <InstitutionSettingsToast toast={toast} onUndo={undo} onDismiss={dismiss} />
    </InstitutionFrame>
  );
};

export default InstitutionSettingsPage;
