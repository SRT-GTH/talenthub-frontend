import { useId } from 'react';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';

/*
 * ProgrammeConfirmDialog — the two confirmation cards of the programme screens (Figma "div.vid-card": white, r24, p 64/48, shadow, on a #1c2a21 scrim at 70 %;
 * "Close this programme?" 8610:404288, 528 wide and "Remove contact details to publish" 8610:403186, 565 wide):
 *   title 32/40 600 -0.16 centred · sentence 16/24 #575755 centred · two buttons, right aligned, gap 8: the red confirm (#c0392b, 44 high) and the white
 *   "keep" button (2px rgba(28,42,33,.3), r14).
 * Role alertdialog: focus goes to the "keep" button (the safe choice), Esc = cancel, Tab is trapped, focus returns to the opener (AgencyDialogShell).
 * Props: title, body, confirmLabel, cancelLabel, onConfirm, onCancel, width (px, default 528).
 */

const ProgrammeConfirmDialog = ({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  width = 528,
}) => {
  const descId = useId();
  return (
    <AgencyDialogShell
      title={title}
      onClose={onCancel}
      scrim="bg-[#1c2a21]/70"
      role="alertdialog"
      describedBy={descId}
      className="mx-auto"
    >
      <div
        style={{ maxWidth: width }}
        className="mx-auto flex flex-col gap-[36px] rounded-[24px] bg-white px-[clamp(20px,2.8vw,48px)] py-[clamp(32px,3.7vw,64px)] shadow-[0_4px_0_rgba(0,0,0,0),0_40px_100px_rgba(0,0,0,0.25)]"
      >
        <div className="flex flex-col gap-[10px] text-center">
          <h2 className="m-0 font-sans text-[26px] leading-[34px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
            {title}
          </h2>
          <p id={descId} className="m-0 font-sans text-[16px] leading-[24px] text-[#575755]">
            {body}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-[8px]">
          <Button
            type="button"
            variant="danger"
            size="sm"
            className="!px-[16px] !py-[8.5px] !text-[14px]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            data-autofocus=""
            className="!rounded-[14px] !px-[16px] !py-[8.5px] !text-[14px]"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </AgencyDialogShell>
  );
};

export default ProgrammeConfirmDialog;
