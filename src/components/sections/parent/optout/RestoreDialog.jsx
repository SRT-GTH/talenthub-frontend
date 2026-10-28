import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import { OPT_OUT_COPY } from './data/optOutData.js';

const log = debug('RestoreDialog');

/*
 * RestoreDialog — PO-03 "Restore Abena’s access?" (Figma 10034:144044, modal 10034:144633): 560 wide, r24, p32, gap 16, scrim ink at 55 %. Title 26/600, 15 intro, close (36, grey #f1f1ee), a 14 line
 * ("She’ll get a message that her access is back. You can opt out again later.") and "Not now" (secondary) + "Restore access" (primary).
 * Props: ward ({ firstName, pronoun, possessive }), onClose (Not now / X / scrim / Esc), onConfirm.
 */
const RestoreDialog = ({ ward, onClose, onConfirm }) => {
  const copy = OPT_OUT_COPY.restore;
  const title = copy.title(ward);
  log('render', { ward: ward.id });

  return (
    <DialogCard
      label={title}
      onClose={onClose}
      width={560}
      padding={32}
      gap={16}
      focusCard={false}
      className="items-stretch max-sm:!p-[20px]"
    >
      <div className="flex items-start gap-[12px]">
        <div className="flex min-w-0 max-w-[440px] flex-1 flex-col gap-[6px]">
          <h2 className="m-0 text-[26px] leading-[1.25] font-semibold tracking-[-0.13px] text-[#1c2a21]">
            {title}
          </h2>
          <p className="m-0 text-[15px] leading-normal text-[#575755]">{copy.intro}</p>
        </div>
        <DialogCloseButton onClose={onClose} tone="grey" />
      </div>
      <p className="m-0 max-w-[496px] text-[14px] leading-normal text-[#575755]">
        {copy.note(ward)}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-[12px]">
        <ParentButton variant="secondary" onClick={onClose}>
          {copy.notNow}
        </ParentButton>
        <ParentButton data-autofocus onClick={onConfirm}>
          {copy.confirm}
        </ParentButton>
      </div>
    </DialogCard>
  );
};

export default RestoreDialog;
