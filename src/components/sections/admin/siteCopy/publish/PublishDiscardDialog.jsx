import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import PublishButton from './PublishButton.jsx';
import PublishModalShell from './PublishModalShell.jsx';
import { PublishTrashIcon, PublishWarningIcon } from './PublishIcons.jsx';
import { discardChanges } from './publishStore.js';
import { PUBLISH_COPY, changeCount, plural, quotedList } from './publishData.js';

const log = debug('PublishDiscardDialog');

/*
 * PublishDiscardDialog — 7.8.4f "Discard 2 changes?": the drafts of `changes` (the section being edited) go back to the published text; an amber
 * banner warns it cannot be undone. "Keep editing" is focused first (the safe choice). Confirm removes the drafts (publishStore.discardChanges)
 * and calls onDone({ action: 'discarded', count, name, sectionIds }).
 */
const PublishDiscardDialog = ({ changes, onClose, onDone }) => {
  const count = changeCount(changes);
  const where = changes.map((c) => c.label).join(' and ');
  const published = changes.flatMap((c) => c.fields.map((f) => f.before));

  useEffect(() => {
    log('mount', { count, sections: changes.map((c) => c.sectionId) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const confirm = () => {
    discardChanges({ changes });
    log('discarded', { count });
    onDone?.({
      action: 'discarded',
      count,
      name: changes.map((c) => c.name ?? c.label).join(' and '),
      sectionIds: changes.map((c) => c.sectionId),
    });
  };

  const title = `Discard ${plural(count, 'change', 'changes')}?`;
  return (
    <PublishModalShell
      label={title}
      title={title}
      tone="red"
      icon={PublishTrashIcon}
      narrow
      onClose={onClose}
    >
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#575755]">
        {where} goes back to the published text: {quotedList(published)}.
      </p>
      <div className="flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px]">
        <PublishWarningIcon className="size-[18px] shrink-0 text-[#8a6100]" />
        <p className="m-0 font-sans text-[14px] leading-[20px] font-medium text-[#463409]">
          {PUBLISH_COPY.discardWarn}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-[12px]">
        <PublishButton grow data-autofocus="" onClick={onClose}>
          {PUBLISH_COPY.keepEditing}
        </PublishButton>
        <PublishButton grow variant="warn" onClick={confirm}>
          {PUBLISH_COPY.discardChanges}
        </PublishButton>
      </div>
    </PublishModalShell>
  );
};

export default PublishDiscardDialog;
