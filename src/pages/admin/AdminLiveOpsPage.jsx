import { useEffect } from 'react';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import LiveOpsRestricted from '../../components/sections/admin/liveops/LiveOpsRestricted.jsx';
import AdminLiveOps from '../../components/sections/admin/liveops/AdminLiveOps.jsx';
import {
  ALERT,
  LIVE_ROLES,
} from '../../components/sections/admin/liveops/data/adminLiveOpsData.js';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AdminLiveOpsPage');

/*
 * AdminLiveOpsPage — /admin/live-ops (Figma 7.3.3a dashboard · 7.3.3b `?modal=alert` · 7.3.3c "isn't available for your role").
 * Only Senior and Super Admins see the dashboard; the other roles (e.g. ?role=moderator) get the restricted page.
 */
const AdminLiveOpsPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const allowed = LIVE_ROLES.includes(role);
  useEffect(() => {
    log('mount', { role, allowed, modal: data.modal });
  }, [role, allowed, data.modal]);
  const close = () => data.update({ modal: null });

  if (!allowed) {
    return (
      <AdminFrame data={data} title="Live ops">
        <LiveOpsRestricted />
      </AdminFrame>
    );
  }
  return (
    <AdminFrame data={data} title="Live ops">
      <AdminLiveOps onOpenAlert={() => data.update({ modal: 'alert' })} />
      {data.modal === 'alert' ? (
        <AdminConfirmDialog
          title={ALERT.title}
          body={ALERT.body}
          primary={{ label: ALERT.primary, tone: 'red' }}
          secondary={ALERT.secondary}
          onPrimary={() => {
            log('acknowledge and investigate (no backend)');
            close();
          }}
          onClose={close}
        />
      ) : null}
    </AdminFrame>
  );
};

export default AdminLiveOpsPage;
