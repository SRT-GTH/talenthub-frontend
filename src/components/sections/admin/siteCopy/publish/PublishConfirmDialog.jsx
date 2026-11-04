import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useAdminSession } from '../../useAdminSession.js';
import PublishButton from './PublishButton.jsx';
import PublishChangeRow from './PublishChangeRow.jsx';
import PublishModalShell from './PublishModalShell.jsx';
import PublishReasonField from './PublishReasonField.jsx';
import { PublishCheckIcon, PublishUsersIcon } from './PublishIcons.jsx';
import { publishChanges } from './publishStore.js';
import { PUBLISH_COPY, REASON_MIN, changeCount, changeRows, plural } from './publishData.js';

const log = debug('PublishConfirmDialog');

/*
 * PublishConfirmDialog — 7.8.4b "Publish 3 changes" (reason + list of changes), 7.8.4c (same, reason missing: the red message), 7.8.4d
 * "This changes the footer on every page" (a shared section: blue users tile, an intro line, "Publish on every page"). Publishing really
 * moves the drafts (publishStore.publishChanges) and calls onDone({ action: 'published', count, versions, sectionIds, shared }).
 * An empty / too short reason (< 3 characters, ⚠️ ASSUMPTION: the message says "3–200") shows the 4c message and publishes nothing.
 * Props: changes, shared (boolean), initialError (the 4c URL), seedReason (frame URLs only), onClose, onDone.
 * The "Users see the change within about a minute." line is drawn only in 7.8.4b (not in 4c, nor in the shared 4d): kept as drawn.
 */
const PublishConfirmDialog = ({
  changes,
  shared = false,
  initialError = false,
  seedReason = '',
  onClose,
  onDone,
}) => {
  const session = useAdminSession();
  const [reason, setReason] = useState(seedReason);
  const [tried, setTried] = useState(initialError);
  const count = changeCount(changes);
  const rows = changeRows(changes);
  const sharedInfo = changes.find((c) => c.shared)?.shared;
  const error = tried && reason.trim().length < REASON_MIN;

  useEffect(() => {
    log('mount', { shared, count, initialError, seeded: Boolean(seedReason) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < REASON_MIN) {
      log('blocked: reason too short', trimmed.length);
      setTried(true);
      return;
    }
    const { versions } = publishChanges({
      changes,
      reason: trimmed,
      who: session.staff?.name ?? 'Staff',
    });
    log('published', { count, shared });
    onDone?.({
      action: 'published',
      count,
      versions,
      sectionIds: changes.map((c) => c.sectionId),
      shared: Boolean(sharedInfo),
    });
  };

  const title = shared
    ? `This changes the ${sharedInfo?.name ?? 'section'} on every page`
    : `Publish ${plural(count, 'change', 'changes')}`;
  const noun = changes.find((c) => c.shared)?.fields?.[0]?.label?.toLowerCase() ?? 'text';

  return (
    <PublishModalShell
      label={title}
      title={title}
      tone={shared ? 'blue' : 'green'}
      icon={shared ? PublishUsersIcon : PublishCheckIcon}
      onClose={onClose}
    >
      <form onSubmit={submit} noValidate className="contents">
        {shared ? (
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#575755]">
            The new {noun} will show on all {sharedInfo?.pages ?? 0} public pages, including{' '}
            {PUBLISH_COPY.sharedExamples}.
          </p>
        ) : null}
        <ul className="m-0 flex list-none flex-col gap-[8px] p-0" aria-label="Changes to publish">
          {rows.map((r) => (
            <PublishChangeRow key={r.id} title={r.title} detail={r.detail} />
          ))}
        </ul>
        <PublishReasonField value={reason} onChange={setReason} error={error} autoFocus />
        {!shared && !error ? (
          <p className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#575755] max-lg:text-[12px]">
            {PUBLISH_COPY.minuteNote}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-[12px]">
          <PublishButton grow onClick={onClose}>
            {PUBLISH_COPY.cancel}
          </PublishButton>
          <PublishButton grow variant="primary" type="submit">
            {shared ? 'Publish on every page' : `Publish ${plural(count, 'change', 'changes')}`}
          </PublishButton>
        </div>
      </form>
    </PublishModalShell>
  );
};

export default PublishConfirmDialog;
