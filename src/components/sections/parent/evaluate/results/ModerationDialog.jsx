import { debug } from '../../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../../ui/DialogCard.jsx';
import StatusPill from '../../../../ui/StatusPill.jsx';
import ParentButton from '../../ParentButton.jsx';
import spotEvaluations from '../../../../../assets/parent/eval-spot-evaluations.svg';
import checkCircle from '../../../../../assets/parent/eval-check-circle.svg';
import warning from '../../../../../assets/parent/eval-warning.svg';
import { MODERATION } from './data/resultsData.js';

const log = debug('ModerationDialog');

/*
 * ModerationDialog — PE-05c "Our team reviewed 2 items" (Figma modal 10052:5118): 540 wide, r24, p28, gap 16; Spot 80 + close 36, 24/600 title, 14/1.45 body,
 * card (r24, p16) with two rows (Item 1 kept -> "Published" pill; Item 2 removed -> "Removed" pill), 12.5 note, Done + "Evaluate again" right-aligned.
 * Props: onClose (Done / X / scrim / Esc). "Evaluate again" is a link to /parent/evaluate.
 */
const ModerationDialog = ({ onClose }) => (
  <DialogCard
    label={MODERATION.title}
    onClose={onClose}
    width={540}
    gap={16}
    className="items-start"
  >
    <div className="flex w-full items-start justify-between">
      <img src={spotEvaluations} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
      <DialogCloseButton onClose={onClose} />
    </div>
    <h2 className="m-0 w-full text-[24px] leading-[normal] font-semibold text-[#1c2a21]">
      {MODERATION.title}
    </h2>
    <p className="m-0 w-full text-[14px] leading-[1.45] text-[#575755]">{MODERATION.body}</p>
    <ul className="m-0 flex w-full list-none flex-col gap-[4px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[16px] shadow-[0_5px_17px_rgba(28,42,33,0.03)]">
      {MODERATION.rows.map((r, i) => (
        <li
          key={r.id}
          className={`flex items-center gap-[14px] py-[12px] ${i === 0 ? 'border-0 border-b border-solid border-[#e7e7e7]' : ''}`}
        >
          <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
            <img
              src={r.kind === 'kept' ? checkCircle : warning}
              alt=""
              aria-hidden="true"
              className="size-[20px]"
            />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[normal]">
            <span className="text-[14px] font-semibold text-[#1c2a21]">{r.label}</span>
            <span className="text-[12px] text-[#575755]">{r.sub}</span>
          </span>
          <StatusPill tone={r.kind === 'kept' ? 'active' : 'pending'}>{r.chip}</StatusPill>
        </li>
      ))}
    </ul>
    <p className="m-0 w-full text-[12.5px] leading-[normal] text-[#575755]">{MODERATION.note}</p>
    <div className="flex w-full flex-wrap items-center justify-end gap-[12px]">
      <ParentButton
        variant="secondary"
        onClick={() => {
          log('done');
          onClose?.();
        }}
      >
        {MODERATION.done}
      </ParentButton>
      <ParentButton to="/parent/evaluate" onClick={() => log('evaluate again')}>
        {MODERATION.again}
      </ParentButton>
    </div>
  </DialogCard>
);

export default ModerationDialog;
