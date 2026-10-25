import { useEffect } from 'react';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AuditExportDialog from '../../components/sections/admin/audit/AuditExportDialog.jsx';
import AuditLogView from '../../components/sections/admin/audit/AuditLogView.jsx';
import { EVENT_DETAIL } from '../../components/sections/admin/audit/data/adminAuditData.js';
import AdminRecordDialog from '../../components/sections/admin/settings/AdminRecordDialog.jsx';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminAuditPage');

/*
 * AdminAuditPage — /admin/audit-log (Figma 7.5.3). URL states (shared keys in adminState.js):
 *   /admin/audit-log?role=super                 Platform audit log (7.5.3a) · ?modal=event → Event detail (7.5.3b) · ?modal=export → Export the log (7.5.3c)
 *   /admin/audit-log?role=senior                Senior Admin view, masked (7.5.3d; senior is the default role)
 * ⚠️ ASSUMPTION: the toolbar has no export button in Figma, so the export dialog is reached by its URL only; "Open account" and "Copy JSON" only log; confirming the export closes it.
 */

const AdminAuditPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const masked = role === 'senior';
  const modal = data.modal;

  useEffect(() => {
    log('mount', { role, masked, modal });
  }, [role, masked, modal]);

  const close = () => data.update({ modal: null });

  return (
    <AdminFrame data={data} title="Audit log">
      <AuditLogView data={data} masked={masked} onOpen={() => data.update({ modal: 'event' })} />
      {modal === 'event' ? (
        <AdminRecordDialog
          chip={EVENT_DETAIL.chip}
          title={EVENT_DETAIL.title}
          sub={EVENT_DETAIL.sub}
          file={EVENT_DETAIL.file}
          rows={EVENT_DETAIL.rows}
          checkbox={{ label: EVENT_DETAIL.linked, checked: true }}
          notice={EVENT_DETAIL.integrity}
          link={{ label: EVENT_DETAIL.closeLink }}
          secondary={EVENT_DETAIL.close}
          primary={EVENT_DETAIL.primary}
          onSubmit={() => {
            log('open account (no screen drawn)');
            close();
          }}
          onClose={close}
        />
      ) : null}
      {modal === 'export' ? <AuditExportDialog onClose={close} onSubmit={close} /> : null}
    </AdminFrame>
  );
};

export default AdminAuditPage;
