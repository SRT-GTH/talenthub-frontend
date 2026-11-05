import { classNames } from '../../../../../utils/classNames.js';
import SyncOriginalChanged from './SyncOriginalChanged.jsx';
import SyncPaneHead from './SyncPaneHead.jsx';
import SyncTextField from './SyncTextField.jsx';
import { CheckCircleFillIcon, LockIcon } from './SyncIcons.jsx';
import { SYNC_COPY } from './releaseSyncData.js';

/*
 * SyncSectionPane — the right-hand card of the Site copy browse after a release (Figma "Section editor" 885 wide, white, r20, 24 padding, 22 gap; the removed
 * section card of 7.8.8c has a 16 gap): the head (breadcrumb, title + chip, History / Preview), the copy fields with their counters, and
 *   7.8.8a  a new section shows the original text with the "New" chip
 *   7.8.8b  "Your edit is still live", the "Changed" chip + "Reset to default" on the headline and the "original text changed" notice under it
 *   7.8.8c  a removed section is read-only: the grey lock banner, label + text boxes, History only
 * Props: ctx, sectionId, def (SYNC_SECTIONS entry or a generated one), values { [fieldId]: text }, onChange(fieldId, text), changedOpen, onKeep, onUseNew.
 */
const SyncSectionPane = ({
  ctx,
  sectionId,
  def,
  values,
  onChange,
  changedOpen,
  onKeep,
  onUseNew,
}) => {
  const removed = Boolean(def.removed);
  return (
    <section
      aria-label={`${def.title} section`}
      className={classNames(
        'flex w-full min-w-0 flex-1 flex-col rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[16px] sm:p-[24px]',
        removed ? 'gap-[16px]' : 'gap-[22px]'
      )}
    >
      <SyncPaneHead
        ctx={ctx}
        sectionId={sectionId}
        path={def.path}
        title={def.title}
        chip={def.chip}
        removed={removed}
      />
      {removed ? (
        <p className="m-0 flex items-center gap-[12px] rounded-[16px] bg-[#f8f8f4] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#575755]">
          <LockIcon className="size-[18px] shrink-0 text-[#387440]" />
          {SYNC_COPY.removedNote}
        </p>
      ) : null}
      {def.saved ? (
        <p className="m-0 -mt-[10px] flex items-center gap-[6px] font-sans text-[12.5px] leading-[15px] font-medium text-[#575755]">
          <CheckCircleFillIcon className="size-[14px] shrink-0 text-[#387440]" />
          {def.saved}
        </p>
      ) : null}
      {def.fields.map((f) => (
        <div key={f.id} className="flex flex-col gap-[10px]">
          <SyncTextField
            field={f}
            value={values[f.id] ?? f.value}
            onChange={(text) => onChange(f.id, text)}
            headline={f.id === 'headline'}
            changed={Boolean(changedOpen && def.changed?.field === f.id)}
            onReset={onUseNew}
          />
          {changedOpen && def.changed?.field === f.id ? (
            <SyncOriginalChanged
              oldText={def.changed.oldOriginal}
              newText={def.changed.newOriginal}
              onKeep={onKeep}
              onUseNew={onUseNew}
            />
          ) : null}
        </div>
      ))}
    </section>
  );
};

export default SyncSectionPane;
