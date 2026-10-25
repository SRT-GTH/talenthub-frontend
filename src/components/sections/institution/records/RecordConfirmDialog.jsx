import { useId } from 'react';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import { RecordsIconArrowr } from './recordsIcons.jsx';

/*
 * RecordConfirmDialog — "Approve this record?" (Figma 11.2.3c 8593:387102) and "Approve 4 records?" (11.2.3e 8593:388404): white r24 card 528 wide, p64/48, title 32/40 600 -0.16 centred,
 * body 16/24 #575755, then the green confirm (44 high, p10/18, 14/600, arrow) and the white Cancel, centred, gap 8 — on a #1c2a21 scrim at 70 %.
 * role alertdialog: focus starts on Confirm's safe sibling (Cancel), Esc cancels, Tab is trapped, focus returns to the opener (AgencyDialogShell).
 * Props: title, body, confirmLabel, onConfirm, onCancel.
 */
const RecordConfirmDialog = ({ title, body, confirmLabel, onConfirm, onCancel }) => {
  const descId = useId();
  return (
    <AgencyDialogShell
      title={title}
      onClose={onCancel}
      scrim="bg-[#1c2a21]/70"
      role="alertdialog"
      describedBy={descId}
    >
      <div className="mx-auto flex max-w-[528px] flex-col items-center gap-[24px] rounded-[24px] bg-white px-[clamp(20px,2.8vw,48px)] py-[clamp(32px,3.7vw,64px)] text-center shadow-[0_4px_0_rgba(0,0,0,0),0_40px_100px_rgba(0,0,0,0.25)]">
        <h2 className="m-0 font-sans text-[26px] leading-[34px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
          {title}
        </h2>
        <p id={descId} className="m-0 font-sans text-[16px] leading-[24px] text-[#575755]">
          {body}
        </p>
        <div className="flex flex-wrap justify-center gap-[8px]">
          <Button
            type="button"
            variant="primary"
            size="md"
            className="!px-[18px] !py-[10px] !text-[14px] !font-semibold"
            rightIcon={<RecordsIconArrowr className="size-[20px]" />}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            data-autofocus=""
            className="!px-[18px] !py-[10px] !text-[14px] !font-semibold"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </AgencyDialogShell>
  );
};

export default RecordConfirmDialog;
