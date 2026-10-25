import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AdminQueueView from '../../components/sections/admin/queue/AdminQueueView.jsx';
import { SUPPORT } from '../../components/sections/admin/support/data/adminSupportData.js';
import {
  EscalateDialog,
  ReplyDialog,
} from '../../components/sections/admin/support/SupportDialogs.jsx';
import SupportDetail from '../../components/sections/admin/support/SupportDetail.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AdminSupportPage');

/*
 * AdminSupportPage — /admin/support (7.7.1a query queue) and /admin/support/:queryId (7.7.1b detail; `?modal=reply` 7.7.1c, `?modal=escalate` 7.7.1d).
 * ⚠️ ASSUMPTION: mock only. Every row opens the one drawn query; sending the reply or escalating returns to the queue (no message is stored).
 */
const AdminSupportPage = () => {
  const data = useAdminState();
  const navigate = useNavigate();
  const { queryId } = useParams();
  useEffect(() => {
    log('mount', { queryId, modal: data.modal });
  }, [queryId, data.modal]);
  const close = () => data.update({ modal: null });
  const back = () => navigate('/admin/support');

  if (!queryId) {
    return (
      <AdminFrame data={data} title="Support queries">
        <AdminQueueView
          config={SUPPORT}
          data={data}
          onRowButton={() => log('reassign (no flow drawn)')}
        />
      </AdminFrame>
    );
  }
  return (
    <AdminFrame data={data} title="Support queries">
      <SupportDetail
        onReply={() => data.update({ modal: 'reply' })}
        onEscalate={() => data.update({ modal: 'escalate' })}
      />
      {data.modal === 'reply' ? (
        <ReplyDialog
          onClose={close}
          onChangeTemplate={() => log('change template (no template list drawn)')}
          onSend={(r) => {
            log('reply sent (mock)', r);
            back();
          }}
        />
      ) : null}
      {data.modal === 'escalate' ? (
        <EscalateDialog
          onClose={close}
          onEscalate={(r) => {
            log('escalated (mock)', r);
            back();
          }}
        />
      ) : null}
    </AdminFrame>
  );
};

export default AdminSupportPage;
