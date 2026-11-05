import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import { FLAGS_COPY } from './data/flagsData.js';

const log = debug('RecheckDialog');

/*
 * RecheckDialog — PW-06 "Abena fixed “Date of birth”" (Figma 10034:140801, modal 10034:141409): 620 wide, r24, p32, scrim ink at 55 %. Title 26/600 + 15 intro + close (36, #f1f1ee), the Before / Now comparison
 * (two 271px boxes, r14, p16: "BEFORE" on #f9ebea, "NOW" on #e8f2ed, 12/600 caps label over a 20/600 value), "Your note: “…”" 14 #575755, then "Flag again" (secondary) + "Approve fix" (primary).
 * Props: ward ({ firstName }), flag ({ label, before, now, note }), onApprove, onFlagAgain, onClose. Esc / X / scrim call onClose.
 */
const Compare = ({ tone, label, value }) => (
  <div
    className={`flex min-w-0 flex-1 flex-col gap-[8px] rounded-[14px] p-[16px] ${tone === 'before' ? 'bg-[#f9ebea]' : 'bg-[#e8f2ed]'}`}
  >
    <span className="text-[12px] leading-normal font-semibold tracking-[0.72px] text-[#575755] uppercase">
      {label}
    </span>
    <span className="text-[20px] leading-[1.25] font-semibold tracking-[-0.1px] text-[#1c2a21]">
      {value}
    </span>
  </div>
);

const RecheckDialog = ({ ward, flag, onApprove, onFlagAgain, onClose }) => {
  const copy = FLAGS_COPY.recheck;
  log('render', { flag: flag.id });
  const title = copy.title(flag.label, ward);

  return (
    <DialogCard
      label={title}
      onClose={onClose}
      width={620}
      padding={32}
      gap={16}
      focusCard={false}
      className="items-stretch max-sm:!p-[20px]"
    >
      <div className="flex items-start gap-[12px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
          <h2 className="m-0 text-[26px] leading-[1.25] font-semibold tracking-[-0.13px] text-[#1c2a21]">
            {title}
          </h2>
          <p className="m-0 text-[15px] leading-normal text-[#575755]">{copy.intro}</p>
        </div>
        <DialogCloseButton onClose={onClose} tone="grey" />
      </div>

      <div className="flex gap-[12px] max-sm:flex-col">
        <Compare tone="before" label={copy.before} value={flag.before} />
        <Compare tone="now" label={copy.now} value={flag.now} />
      </div>

      <p className="m-0 text-[14px] leading-normal text-[#575755]">{copy.note(flag.note)}</p>

      <div className="flex flex-wrap items-center justify-end gap-[12px]">
        <ParentButton variant="secondary" onClick={onFlagAgain}>
          {copy.again}
        </ParentButton>
        <ParentButton data-autofocus onClick={onApprove}>
          {copy.approve}
        </ParentButton>
      </div>
    </DialogCard>
  );
};

export default RecheckDialog;
