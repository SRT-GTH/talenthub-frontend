import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AskChangeDialog from '../../components/sections/admin/moderation/AskChangeDialog.jsx';
import CommunityPostsView from '../../components/sections/admin/moderation/CommunityPostsView.jsx';
import FlagDetailView from '../../components/sections/admin/moderation/FlagDetailView.jsx';
import RemoveContentDialog from '../../components/sections/admin/moderation/RemoveContentDialog.jsx';
import ReviewCommunityDialog from '../../components/sections/admin/moderation/ReviewCommunityDialog.jsx';
import {
  CLAIMED,
  DISMISS,
  ESCALATE,
  GOV_BLOCKED,
  RESTORE,
  WARN,
} from '../../components/sections/admin/moderation/data/adminModerationData.js';
import {
  COMMUNITIES,
  FLAGS,
  FLAGS_EMPTY,
  REMOVED,
} from '../../components/sections/admin/moderation/data/adminModerationQueues.js';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import AdminQueueView from '../../components/sections/admin/queue/AdminQueueView.jsx';
import { Select, TextInput } from '../../components/ui/form';
import { debug } from '../../utils/debug.js';

const log = debug('AdminModerationPage');

/*
 * AdminModerationPage — /admin/moderation/* (Figma 7.2). Routes and URL states (shared keys in adminState.js):
 *   /admin/moderation                         flag queue (7.2.1a, ?role=moderator) · ?state=empty → all clear (7.2.1b)
 *   /admin/moderation/flags/FL-2291           flag detail (7.2.2a) · ?modal=dismiss (2b) | remove (2c) | escalate (2d) | claimed (2e) | warn
 *   /admin/moderation/removed                 removed content (7.2.3a, Senior Admin) · ?modal=restore (3b) | government (3c)
 *   /admin/moderation/posts                   community posts (7.2.4a) · ?modal=warn (4b)
 *   /admin/moderation/communities             new community reviews (7.2.5a) · ?modal=review (5b) | ask-change (5c)
 * Real flow (⚠️ ASSUMPTION: mock only): the dialogs close back to the screen they were opened from; "Remove content" goes through "Escalate instead" when it is the third
 * flag; a Super Admin approval for government content is "Send request" (logs). The flag list, search and the sort / filter controls only log.
 */

const AdminModerationPage = () => {
  const data = useAdminState();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const modal = data.modal;
  const sub = pathname.replace(/^\/admin\/moderation\/?/, '');
  const [severity, setSeverity] = useState(WARN.severities[0]);
  const [warnMessage, setWarnMessage] = useState(WARN.message);

  useEffect(() => {
    log('mount', { sub, modal });
  }, [sub, modal]);

  const close = () => data.update({ modal: null });

  let title = 'Moderation';
  let body;
  let dialogs = null;

  if (sub.startsWith('flags/')) {
    title = 'Flag detail';
    body = (
      <FlagDetailView onDecide={(id) => data.update({ modal: id === 'warn' ? 'warn' : id })} />
    );
    dialogs = (
      <>
        {modal === 'dismiss' ? (
          <AdminConfirmDialog
            title={DISMISS.title}
            body={DISMISS.body}
            primary={{ label: DISMISS.primary, tone: 'red' }}
            secondary={DISMISS.secondary}
            onPrimary={() => navigate('/admin/moderation')}
            onClose={close}
          />
        ) : null}
        {modal === 'escalate' ? (
          <AdminConfirmDialog
            title={ESCALATE.title}
            body={ESCALATE.body}
            primary={{ label: ESCALATE.primary, arrow: true }}
            secondary={ESCALATE.secondary}
            onPrimary={() => navigate('/admin/moderation')}
            onClose={close}
          />
        ) : null}
        {modal === 'claimed' ? (
          <AdminConfirmDialog
            title={CLAIMED.title}
            body={CLAIMED.body}
            primary={{ label: CLAIMED.primary, tone: 'red' }}
            secondary={CLAIMED.secondary}
            onPrimary={() => {
              log('ask to reassign (no flow drawn)');
              close();
            }}
            onClose={close}
          />
        ) : null}
        {modal === 'remove' || modal === 'warn' ? (
          <RemoveContentDialog
            onClose={close}
            onRemove={() => navigate('/admin/moderation')}
            onEscalate={() => data.update({ modal: 'escalate' })}
          />
        ) : null}
      </>
    );
  } else if (sub === 'removed') {
    title = 'Removed content';
    body = (
      <AdminQueueView
        config={REMOVED}
        data={data}
        onRowButton={() => data.update({ modal: 'government' })}
      />
    );
    dialogs = (
      <>
        {modal === 'restore' ? (
          <AdminConfirmDialog
            title={RESTORE.title}
            body={RESTORE.body}
            primary={{ label: RESTORE.primary, arrow: true }}
            secondary={RESTORE.secondary}
            onPrimary={close}
            onClose={close}
          />
        ) : null}
        {modal === 'government' ? (
          <AdminConfirmDialog
            title={GOV_BLOCKED.title}
            body={GOV_BLOCKED.body}
            primary={{ label: GOV_BLOCKED.primary, tone: 'red' }}
            secondary={GOV_BLOCKED.secondary}
            onPrimary={() => {
              log('request sent to a Super Admin (mock)');
              close();
            }}
            onClose={close}
          />
        ) : null}
      </>
    );
  } else if (sub === 'posts') {
    title = 'Community posts';
    body = (
      <CommunityPostsView
        data={data}
        onReview={() => data.update({ modal: 'warn' })}
        onRestore={() => data.update({ modal: 'restore' })}
      />
    );
    dialogs = (
      <>
        {modal === 'warn' ? (
          <AdminConfirmDialog
            title={WARN.title}
            body={WARN.body}
            primary={{ label: WARN.primary, tone: 'red' }}
            secondary={WARN.secondary}
            onPrimary={close}
            onClose={close}
          >
            <div className="flex flex-col gap-[16px]">
              <Select
                label={WARN.severityLabel}
                required
                options={WARN.severities}
                value={severity}
                onChange={setSeverity}
              />
              <TextInput
                label={WARN.messageLabel}
                value={warnMessage}
                onChange={(e) => setWarnMessage(e.target.value)}
              />
            </div>
          </AdminConfirmDialog>
        ) : null}
        {modal === 'restore' ? (
          <AdminConfirmDialog
            title={RESTORE.title}
            body={RESTORE.body}
            primary={{ label: RESTORE.primary, arrow: true }}
            secondary={RESTORE.secondary}
            onPrimary={close}
            onClose={close}
          />
        ) : null}
      </>
    );
  } else if (sub === 'communities') {
    title = 'New communities';
    body = (
      <AdminQueueView
        config={COMMUNITIES}
        data={data}
        onRowButton={() => log('reassign (no flow drawn)')}
      />
    );
    dialogs = (
      <>
        {modal === 'review' ? (
          <ReviewCommunityDialog
            onClose={close}
            onReject={close}
            onChange={() => data.update({ modal: 'ask-change' })}
            onApprove={close}
          />
        ) : null}
        {modal === 'ask-change' ? (
          <AskChangeDialog onClose={() => data.update({ modal: 'review' })} onSend={close} />
        ) : null}
      </>
    );
  } else {
    body = (
      <AdminQueueView
        config={data.state === 'empty' ? FLAGS_EMPTY : FLAGS}
        data={data}
        onRowButton={() => log('reassign (no flow drawn)')}
      />
    );
  }

  return (
    <AdminFrame data={data} title={title}>
      {body}
      {dialogs}
    </AdminFrame>
  );
};

export default AdminModerationPage;
