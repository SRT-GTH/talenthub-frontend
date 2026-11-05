import { debug } from '../../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../../ui/DialogCard.jsx';
import ParentButton from '../../ParentButton.jsx';
import spotWrong from '../../../../../assets/parent/spot-something-went-wrong.svg';
import { COPY } from './data/questionsData.js';

const log = debug('DiscardDialog');

/*
 * DiscardDialog — PE-02b "Discard this evaluation?" (Figma 10042:3545, modal 10042:3822): r24, p28, gap16, spot "Something went wrong" 80 + close 36, 24/600 title, 14/1.45 body,
 * "Keep going" (secondary) + "Discard evaluation" (primary) right-aligned. Props: answered (count), ward (first name), onKeep (X / Esc / scrim / Keep going), onDiscard.
 */
const DiscardDialog = ({ answered, ward, onKeep, onDiscard }) => {
  log('render', { answered, ward });
  return (
    <DialogCard
      label={COPY.discardTitle}
      onClose={onKeep}
      width={500}
      gap={16}
      focusCard={false}
      className="items-start"
    >
      <div className="flex w-full items-start justify-between">
        <img src={spotWrong} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
        <DialogCloseButton onClose={onKeep} />
      </div>
      <h2 className="m-0 w-full text-[24px] leading-[normal] font-semibold text-[#1c2a21]">
        {COPY.discardTitle}
      </h2>
      <p className="m-0 w-full text-[14px] leading-[1.45] font-normal text-[#575755]">
        {COPY.discardBody(answered, ward)}
      </p>
      <div className="flex w-full items-center justify-end gap-[12px] py-[6px] max-sm:flex-wrap">
        <ParentButton variant="secondary" onClick={onKeep} data-autofocus>
          {COPY.keepGoing}
        </ParentButton>
        <ParentButton onClick={onDiscard}>{COPY.discard}</ParentButton>
      </div>
    </DialogCard>
  );
};

export default DiscardDialog;
