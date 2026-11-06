import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import PublishButton from './PublishButton.jsx';
import PublishChangeRow from './PublishChangeRow.jsx';
import PublishModalShell from './PublishModalShell.jsx';
import { PublishWarningIcon } from './PublishIcons.jsx';
import { PUBLISH_COPY, findBlockers, plural } from './publishData.js';

const log = debug('PublishBlockedDialog');

/*
 * PublishBlockedDialog — 7.8.4h "Fix 2 things before publishing": an image field without a description (alt text) and / or an identifiable
 * photo without consent stops the publish (findBlockers). Nothing was published. "Open media library" goes to `mediaTo`
 * (⚠️ ASSUMPTION: the frame does not say where; the media library is where alt text and consent live), "Close" closes.
 */
const PublishBlockedDialog = ({ changes, mediaTo = '/admin/media', onClose }) => {
  const blockers = findBlockers(changes);

  useEffect(() => {
    log('mount', { blockers: blockers.length });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const title = `Fix ${plural(blockers.length, 'thing', 'things')} before publishing`;
  return (
    <PublishModalShell
      label={title}
      title={title}
      tone="red"
      icon={PublishWarningIcon}
      onClose={onClose}
    >
      <ul className="m-0 flex list-none flex-col gap-[8px] p-0" aria-label="What to fix">
        {blockers.map((b) => (
          <PublishChangeRow key={b.id} tone="blocker" title={b.title} detail={b.detail} />
        ))}
      </ul>
      <p className="m-0 font-sans text-[13.5px] leading-[16px] text-[#575755] max-lg:text-[12px]">
        {PUBLISH_COPY.blockedBody}
      </p>
      <div className="flex flex-wrap gap-[12px]">
        <PublishButton grow data-autofocus="" onClick={onClose}>
          {PUBLISH_COPY.close}
        </PublishButton>
        <PublishButton grow variant="primary" to={mediaTo}>
          {PUBLISH_COPY.openMedia}
        </PublishButton>
      </div>
    </PublishModalShell>
  );
};

export default PublishBlockedDialog;
