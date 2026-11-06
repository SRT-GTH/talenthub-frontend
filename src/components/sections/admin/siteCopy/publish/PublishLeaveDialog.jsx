import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useAdminSession } from '../../useAdminSession.js';
import PublishButton from './PublishButton.jsx';
import PublishModalShell from './PublishModalShell.jsx';
import { PublishCheckIcon } from './PublishIcons.jsx';
import { PUBLISH_COPY, changeCount, plural } from './publishData.js';

const log = debug('PublishLeaveDialog');

/*
 * PublishLeaveDialog — 7.8.4g "Your drafts are kept": shown when someone leaves the editor (a click on any link of the chrome, caught by
 * usePublishGuard) with unpublished changes. "Leave editor" goes on to where they were heading (onLeave), "Publish now" opens the publish
 * dialog (onPublishNow). Roles without "publish" get only "Leave editor" (⚠️ ASSUMPTION: the frame is drawn for a publisher).
 */
const PublishLeaveDialog = ({ changes, onClose, onLeave, onPublishNow }) => {
  const session = useAdminSession();
  const count = changeCount(changes);
  const canPublish = session.copy?.publish !== false;

  useEffect(() => {
    log('mount', { count, canPublish });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PublishModalShell
      label={PUBLISH_COPY.draftsKept}
      title={PUBLISH_COPY.draftsKept}
      tone="green"
      icon={PublishCheckIcon}
      narrow
      onClose={onClose}
    >
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#575755]">
        You have {plural(count, 'unpublished change', 'unpublished changes')}. They stay saved as
        drafts, and only staff can see them. Publish them any time from Site copy.
      </p>
      <div className="flex flex-wrap gap-[12px]">
        <PublishButton grow onClick={onLeave}>
          {PUBLISH_COPY.leaveEditor}
        </PublishButton>
        {canPublish ? (
          <PublishButton grow variant="primary" onClick={onPublishNow}>
            {PUBLISH_COPY.publishNow}
          </PublishButton>
        ) : null}
      </div>
    </PublishModalShell>
  );
};

export default PublishLeaveDialog;
