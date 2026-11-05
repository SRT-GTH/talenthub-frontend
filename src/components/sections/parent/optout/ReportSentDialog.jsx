import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import spotSent from '../../../../assets/parent/spot-sent.svg';
import { PARENT } from '../data/parentCoreData.js';
import { OPT_OUT_COPY, REPORT_REFERENCE } from './data/optOutData.js';

const log = debug('ReportSentDialog');

/*
 * ReportSentDialog — PH-03b "Thank you, Emma. We’re on it." (Figma 10057:1806, modal 10057:1994): 500 wide, r24, p28, gap 16, scrim ink at 55 %. Spot · Sent 80 + close (36, green #f8f8f4), 24/600 title,
 * 14 intro with the report number, the "While you wait" card (#ebf1ec, r24, p16: 13/600 title over a 12.5 line) and "Opt Abena out" (secondary) + "Done" (primary).
 * Props: ward (the ward the report is about: { firstName, possessive } — omit for "Someone else": the card and the Opt-out button are left out), onOptOut, onClose (Done / X / scrim / Esc).
 * ⚠️ ASSUMPTION: the report number is the drawn mock (GTH-S-4821); "While you wait" and "Opt <ward> out" only show for a linked ward (the frame draws the Abena report).
 */
const ReportSentDialog = ({ ward, onOptOut, onClose }) => {
  const copy = OPT_OUT_COPY.sent;
  const title = copy.title(PARENT);
  log('render', { ward: ward?.id ?? 'someone-else' });

  return (
    <DialogCard
      label={title}
      onClose={onClose}
      width={500}
      padding={28}
      gap={16}
      focusCard={false}
      className="items-stretch max-sm:!p-[20px]"
    >
      <div className="flex items-start justify-between">
        <img src={spotSent} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
        <DialogCloseButton onClose={onClose} />
      </div>
      <h2 className="m-0 text-[24px] leading-normal font-semibold text-[#1c2a21]">{title}</h2>
      <p className="m-0 text-[14px] leading-[1.45] text-[#575755]">
        {copy.intro(REPORT_REFERENCE)}
      </p>
      {ward ? (
        <div className="flex flex-col gap-[8px] rounded-[24px] bg-[#ebf1ec] p-[16px]">
          <span className="text-[13px] leading-normal font-semibold text-[#1c2a21]">
            {copy.waitTitle}
          </span>
          <span className="text-[12.5px] leading-[1.45] text-[#575755]">{copy.wait(ward)}</span>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-end gap-[12px]">
        {ward ? (
          <ParentButton variant="secondary" onClick={onOptOut}>
            {copy.optOut(ward)}
          </ParentButton>
        ) : null}
        <ParentButton data-autofocus onClick={onClose}>
          {copy.done}
        </ParentButton>
      </div>
    </DialogCard>
  );
};

export default ReportSentDialog;
