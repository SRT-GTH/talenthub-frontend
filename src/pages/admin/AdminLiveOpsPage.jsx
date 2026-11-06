import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import LiveOpsRestricted from '../../components/sections/admin/liveops/LiveOpsRestricted.jsx';
import AdminLiveOps from '../../components/sections/admin/liveops/AdminLiveOps.jsx';
import { LIVE_ROLES } from '../../components/sections/admin/liveops/data/adminLiveOpsData.js';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AdminLiveOpsPage');

/*
 * AdminLiveOpsPage — /admin/live-ops (Figma 7.3.3a dashboard · 7.3.3b alert dialog · 7.3.3c "isn't available for your role").
 * Only Senior and Super Admins see the dashboard; the other roles get the restricted page.
 * Alerts come from GET /api/admin/live-ops/snapshot. "Acknowledge and investigate" opens the screen to check
 * (accounts, audit log, observability or moderation); "Mute 1 hour" hides that alert for this viewer.
 */

const MUTE_KEY = 'th:liveops-muted';
const readMuted = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(MUTE_KEY) || '{}');
    return Object.fromEntries(Object.entries(raw).filter(([, until]) => until > Date.now()));
  } catch {
    return {};
  }
};
const INVESTIGATE = {
  'Sign-up spike': '/admin/accounts',
  'Login failures': '/admin/audit-log?tab=logins&q=LOGIN_FAILED',
  'Error rate': '/admin/observability',
  'Queue backlog': '/admin/moderation',
};

const AdminLiveOpsPage = () => {
  const data = useAdminState();
  const navigate = useNavigate();
  const { role } = useAdminSession();
  const allowed = LIVE_ROLES.includes(role);
  const [alert, setAlert] = useState(null);
  const [muted, setMuted] = useState(readMuted);
  useEffect(() => {
    log('mount', { role, allowed, modal: data.modal });
  }, [role, allowed, data.modal]);
  const close = () => {
    setAlert(null);
    data.update({ modal: null });
  };

  if (!allowed) {
    return (
      <AdminFrame data={data} title="Live ops">
        <LiveOpsRestricted />
      </AdminFrame>
    );
  }
  return (
    <AdminFrame data={data} title="Live ops">
      <AdminLiveOps
        muted={muted}
        onOpenAlert={(a) => {
          setAlert(a);
          data.update({ modal: 'alert' });
        }}
      />
      {data.modal === 'alert' && alert ? (
        <AdminConfirmDialog
          title={`Alert: ${alert.title}`}
          body={alert.body}
          primary={{ label: 'Acknowledge and investigate', tone: 'red' }}
          secondary="Mute 1 hour"
          onPrimary={() => {
            log('investigate', alert.key);
            const to = INVESTIGATE[alert.kind] || '/admin';
            close();
            navigate(to);
          }}
          onSecondary={() => {
            const next = { ...readMuted(), [alert.key]: Date.now() + 60 * 60 * 1000 };
            try {
              localStorage.setItem(MUTE_KEY, JSON.stringify(next));
            } catch {
              /* storage unavailable: mute for this page view only */
            }
            setMuted(next);
            close();
          }}
          onClose={close}
        />
      ) : null}
    </AdminFrame>
  );
};

export default AdminLiveOpsPage;
