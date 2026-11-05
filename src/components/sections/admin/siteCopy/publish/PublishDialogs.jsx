import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import PublishBlockedDialog from './PublishBlockedDialog.jsx';
import PublishConfirmDialog from './PublishConfirmDialog.jsx';
import PublishDiscardDialog from './PublishDiscardDialog.jsx';
import PublishLeaveDialog from './PublishLeaveDialog.jsx';
import PublishToast from './PublishToast.jsx';
import { PublishCheckIcon, PublishInfoIcon } from './PublishIcons.jsx';
import { DEMO_REASONS, PUBLISH_COPY, plural } from './publishData.js';

const log = debug('PublishDialogs');

/*
 * PublishDialogs — every dialog and toast of the publish flow (Platform Admin 7.8.4b-i), picked by `modal`:
 *   publish        7.8.4b  reason + list of changes                    publish-empty   7.8.4c  the same with the "add a reason" message
 *   publish-shared 7.8.4d  a shared section (footer) changes every page   published     7.8.4e  toast "Live · users will see this within a minute"
 *   discard        7.8.4f  discard confirm (the drafts of `discardSectionId`, else all)   discarded  7.8.4i  toast "2 changes discarded · …"
 *   leave          7.8.4g  "Your drafts are kept" (opened by usePublishGuard)   blocked  7.8.4h  an image needs a description / consent
 * Props: modal, changes (see publishData.js), onClose, onDone(result) — result.action is 'published' | 'discarded' | 'left';
 * the host then empties its change set and (usually) sets modal to 'published' / 'discarded' with the same `result`.
 * Optional: onSwitch(modal) (leave → "Publish now" opens 'publish'), ctx (keeps ?role= in links), leaveTo (where "Leave editor" goes, default the
 * Site copy browse), historyTo ("View history"), mediaTo ("Open media library"), discardSectionId, result (toast numbers), seedReason /
 * holdToast (frame URLs only: pre-fills the reason the frame draws; keeps the toast open). Unknown / empty modal renders nothing.
 */
const PublishDialogs = ({
  modal,
  changes = [],
  onClose,
  onDone,
  onSwitch,
  ctx,
  leaveTo,
  historyTo,
  mediaTo,
  discardSectionId,
  result,
  seedReason = false,
  holdToast = false,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    log('modal', { modal, changes: changes.length });
  }, [modal]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!modal) return null;

  if (modal === 'publish' || modal === 'publish-empty' || modal === 'publish-shared') {
    const shared = modal === 'publish-shared';
    return (
      <PublishConfirmDialog
        key={shared ? 'shared' : 'plain'}
        changes={changes}
        shared={shared}
        initialError={modal === 'publish-empty'}
        seedReason={seedReason && modal !== 'publish-empty' ? DEMO_REASONS[modal] : ''}
        onClose={onClose}
        onDone={onDone}
      />
    );
  }

  if (modal === 'discard') {
    const target = discardSectionId
      ? changes.filter((c) => c.sectionId === discardSectionId)
      : changes;
    return <PublishDiscardDialog changes={target} onClose={onClose} onDone={onDone} />;
  }

  if (modal === 'leave') {
    const to = leaveTo ?? copyUrl(ctx, COPY_PATHS.siteCopy);
    return (
      <PublishLeaveDialog
        changes={changes}
        onClose={onClose}
        onLeave={() => {
          log('leave editor', to);
          onDone?.({ action: 'left', to });
          navigate(to);
        }}
        onPublishNow={() => {
          log('publish now');
          onSwitch?.('publish');
        }}
      />
    );
  }

  if (modal === 'blocked') {
    return (
      <PublishBlockedDialog
        changes={changes}
        mediaTo={mediaTo ?? copyUrl(ctx, COPY_PATHS.media)}
        onClose={onClose}
      />
    );
  }

  if (modal === 'published') {
    return (
      <PublishToast
        icon={PublishCheckIcon}
        text={PUBLISH_COPY.liveToast}
        action={{
          label: PUBLISH_COPY.viewHistory,
          to: historyTo ?? copyUrl(ctx, COPY_PATHS.siteCopy),
        }}
        hold={holdToast}
        onClose={onClose}
      />
    );
  }

  if (modal === 'discarded') {
    const count = result?.count ?? 2;
    const name = result?.name ?? 'Hero';
    return (
      <PublishToast
        icon={PublishInfoIcon}
        text={`${plural(count, 'change', 'changes')} discarded · ${name} shows the published text again`}
        hold={holdToast}
        onClose={onClose}
      />
    );
  }

  log('unknown modal', modal);
  return null;
};

export default PublishDialogs;
