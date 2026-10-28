import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import spotPrivacy from '../../../../assets/parent/spot-privacy.svg';
import { HIDE_EVALUATION } from './data/reviewData.js';

/*
 * HideEvaluationDialog — PR-03b "Don’t show this to Elliot?" (Figma 10041:4921, modal 10041:5225): 520 wide, r24, p28, gap16. Spot · Privacy 80 + the green 36px close, 24/600 title, 14/20 #575755 body,
 * the tip card (#faf4e8, r24, p16, 13/500 ink), then "Keep reviewing" (secondary) + "Don’t show Elliot" (primary), right aligned.
 * Props: onClose, onConfirm. "Keep reviewing", the close button, Esc and the scrim all call onClose.
 */
const HideEvaluationDialog = ({ onClose, onConfirm }) => (
  <DialogCard
    label={HIDE_EVALUATION.title}
    onClose={onClose}
    width={520}
    padding={28}
    gap={16}
    className="items-stretch max-sm:!p-[20px]"
  >
    <div className="flex items-start justify-between">
      <img src={spotPrivacy} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
      <DialogCloseButton onClose={onClose} tone="green" />
    </div>
    <h2 className="m-0 text-[24px] leading-normal font-semibold text-[#1c2a21]">
      {HIDE_EVALUATION.title}
    </h2>
    <p className="m-0 text-[14px] leading-[1.45] text-[#575755]">{HIDE_EVALUATION.body}</p>
    <div className="rounded-[24px] bg-accent-light p-[16px] text-[13px] leading-normal font-medium text-[#1c2a21]">
      {HIDE_EVALUATION.tip}
    </div>
    <div className="flex flex-wrap items-center justify-end gap-[12px]">
      <ParentButton variant="secondary" onClick={onClose}>
        {HIDE_EVALUATION.keep}
      </ParentButton>
      <ParentButton onClick={onConfirm}>{HIDE_EVALUATION.confirm}</ParentButton>
    </div>
  </DialogCard>
);

export default HideEvaluationDialog;
