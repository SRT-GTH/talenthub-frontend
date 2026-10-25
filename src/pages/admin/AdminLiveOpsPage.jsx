import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import AdminLiveOps from '../../components/sections/admin/liveops/AdminLiveOps.jsx';
import {
  ALERT,
  LIVE_ROLES,
  RESTRICTED,
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
        <section className="flex flex-col items-start gap-[12px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[32px] font-sans">
          <h1 className="m-0 text-[28px] leading-[34px] font-semibold text-[#1c2a21]">
            {RESTRICTED.title}
          </h1>
          <p className="m-0 max-w-[560px] text-[16px] leading-[24px] text-[#595959]">
            {RESTRICTED.body}
          </p>
          <Link to="/admin" className="font-semibold text-[#387440] no-underline hover:underline">
            {RESTRICTED.action}
          </Link>
        </section>
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
