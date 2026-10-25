import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { TextInput } from '../../components/ui/form';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AdminAccountDetail from '../../components/sections/admin/accounts/AdminAccountDetail.jsx';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import BulkNotificationView from '../../components/sections/admin/comms/BulkNotificationView.jsx';
import ChannelMessageDialog from '../../components/sections/admin/comms/ChannelMessageDialog.jsx';
import CommsInboxView from '../../components/sections/admin/comms/CommsInboxView.jsx';
import SendingDialog from '../../components/sections/admin/comms/SendingDialog.jsx';
import TemplatesView from '../../components/sections/admin/comms/TemplatesView.jsx';
import VersionHistoryDialog from '../../components/sections/admin/comms/VersionHistoryDialog.jsx';
import {
  APPROVAL_DIALOG,
  CONFIRM_DIALOG,
  EDIT_TEMPLATE,
  MESSAGE_USER,
  PUBLISH_DIALOG,
  TEST_DIALOG,
} from '../../components/sections/admin/comms/data/adminCommsData.js';

const log = debug('AdminCommsPage');

/*
 * AdminCommsPage — Figma 7.4 Comms (11 frames), mounted at /admin/comms/*. The first path segment picks the view, ?modal= the dialog:
 *   /admin/comms                      7.4.0a sent and scheduled (inbox)          ?modal=sending 7.4.2e "Sending to 212,940 people"
 *   /admin/comms/message?account=ID   7.4.1a message a user (account detail behind it; ?to=finance lands here too)
 *   /admin/comms/bulk                 7.4.2a bulk notification                   ?modal=test 7.4.2b · submit 7.4.2c · confirm 7.4.2d
 *   /admin/comms/templates            7.4.3a notification templates              ?modal=edit 7.4.3b · publish 7.4.3c · history 7.4.3d
 * ⚠️ ASSUMPTION: every action is mock (nothing is sent); "Send now" is enabled once CONFIRM is typed and then opens the sending dialog on the inbox.
 */

const Confirm = ({ onSend, onClose }) => {
  const [word, setWord] = useState('');
  const ready = word === CONFIRM_DIALOG.word;
  return (
    <AdminConfirmDialog
      title={CONFIRM_DIALOG.title}
      body={CONFIRM_DIALOG.body}
      primary={{ label: CONFIRM_DIALOG.primary, tone: 'red' }}
      secondary={CONFIRM_DIALOG.secondary}
      onPrimary={() => {
        if (!ready) {
          log('send blocked: CONFIRM not typed');
          return;
        }
        onSend();
      }}
      onClose={onClose}
    >
      <TextInput
        label={CONFIRM_DIALOG.label}
        placeholder={CONFIRM_DIALOG.word}
        value={word}
        onChange={(e) => setWord(e.target.value)}
        autoComplete="off"
      />
    </AdminConfirmDialog>
  );
};

const AdminCommsPage = () => {
  const data = useAdminState();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sub = pathname.replace(/^\/admin\/comms\/?/, '').split('/')[0];
  const { modal } = data;
  const close = () => data.update({ modal: null });
  log('render', { sub, modal });

  if (sub === 'message') {
    const account = data.params.get('account') ?? 'TAL-204-8812';
    const back = () => navigate(`/admin/accounts/${account}`);
    return (
      <AdminFrame data={data} title="Account detail">
        <AdminAccountDetail
          view="talent"
          onActions={() => {}}
          onMessage={() => {}}
          onReactivate={() => {}}
        />
        <ChannelMessageDialog
          title={MESSAGE_USER.title}
          channelLabel={MESSAGE_USER.channelLabel}
          channels={MESSAGE_USER.channels}
          text={MESSAGE_USER.text}
          checkLabel={MESSAGE_USER.link}
          secondary={MESSAGE_USER.preview}
          primary={MESSAGE_USER.send}
          onSecondary={() => log('preview (no preview screen is drawn)')}
          onPrimary={() => {
            log('message sent (mock)', account);
            back();
          }}
          onClose={back}
        />
      </AdminFrame>
    );
  }

  if (sub === 'bulk') {
    return (
      <AdminFrame data={data} title="Bulk notification">
        <BulkNotificationView
          onTest={() => data.update({ modal: 'test' })}
          onSubmit={() => data.update({ modal: 'submit' })}
        />
        {modal === 'test' ? (
          <AdminConfirmDialog
            title={TEST_DIALOG.title}
            body={TEST_DIALOG.body}
            primary={{ label: TEST_DIALOG.primary, arrow: true }}
            secondary={TEST_DIALOG.secondary}
            onPrimary={() => data.update({ modal: 'confirm' })}
            onClose={close}
          />
        ) : null}
        {modal === 'submit' ? (
          <AdminConfirmDialog
            title={APPROVAL_DIALOG.title}
            body={APPROVAL_DIALOG.body}
            primary={{ label: APPROVAL_DIALOG.primary, arrow: true }}
            secondary={APPROVAL_DIALOG.secondary}
            onPrimary={() => {
              log('submitted for approval (mock)');
              close();
            }}
            onClose={close}
          />
        ) : null}
        {modal === 'confirm' ? (
          <Confirm onSend={() => navigate('/admin/comms?modal=sending')} onClose={close} />
        ) : null}
      </AdminFrame>
    );
  }

  if (sub === 'templates') {
    return (
      <AdminFrame data={data} title="Notification templates">
        <TemplatesView
          data={data}
          onOpen={(card) => {
            log('open template', card.id);
            data.update({ modal: 'edit' });
          }}
          onNew={() => data.update({ modal: 'edit' })}
        />
        {modal === 'edit' ? (
          <ChannelMessageDialog
            title={EDIT_TEMPLATE.title}
            channelLabel={EDIT_TEMPLATE.channelLabel}
            channels={MESSAGE_USER.channels.map((c) => ({
              ...c,
              label: c.id === 'sms' ? 'In-platform' : c.label,
              selected: c.id === 'sms',
            }))}
            text={EDIT_TEMPLATE.text}
            checkLabel={EDIT_TEMPLATE.preview}
            secondary={EDIT_TEMPLATE.draft}
            primary={EDIT_TEMPLATE.publish}
            onSecondary={() => {
              log('draft saved (mock)');
              close();
            }}
            onPrimary={() => data.update({ modal: 'publish' })}
            onClose={close}
          />
        ) : null}
        {modal === 'publish' ? (
          <AdminConfirmDialog
            title={PUBLISH_DIALOG.title}
            body={PUBLISH_DIALOG.body}
            primary={{ label: PUBLISH_DIALOG.primary, arrow: true }}
            secondary={PUBLISH_DIALOG.secondary}
            onPrimary={() => {
              log('v5 published (mock)');
              close();
            }}
            onClose={() => data.update({ modal: 'edit' })}
          />
        ) : null}
        {modal === 'history' ? (
          <VersionHistoryDialog
            onClose={close}
            onPublish={() => data.update({ modal: 'publish' })}
            onRollback={() => {
              log('roll back to v3 (mock)');
              close();
            }}
          />
        ) : null}
      </AdminFrame>
    );
  }

  return (
    <AdminFrame data={data} title="Comms">
      <CommsInboxView
        listTab={data.tab ?? 'all'}
        onTab={(tab) => data.update({ tab: tab === 'all' ? null : tab })}
        onNew={() => navigate('/admin/comms/bulk')}
      />
      {modal === 'sending' ? <SendingDialog onClose={close} onPause={close} /> : null}
    </AdminFrame>
  );
};

export default AdminCommsPage;
