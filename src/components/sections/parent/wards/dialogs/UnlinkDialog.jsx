import { useId, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../../ui/DialogCard.jsx';
import ParentButton from '../../ParentButton.jsx';
import ParentTextField from '../../ParentTextField.jsx';
import spotWard from '../../../../../assets/parent/spot-ward.svg';
import dialogDot from '../../../../../assets/parent/dialog-dot.svg';
import { unlinkCopy } from './data/dialogsData.js';

const log = debug('UnlinkDialog');

/*
 * UnlinkDialog — PW-15 "Unlink Elliot from your account?" (Figma 10078:23842, modal 10078:24205): 560 wide, r24, p28, gap16, scrim ink at 55 %. Spot · Ward 80 + close 36, 24/600 title, 14/1.45 body,
 * info card (#ebf1ec, r24, p18, three dot rows), required input "Why are you unlinking?" (51px, #ccc border, 2.5px shelf) with the safety-team hint, Cancel + "Unlink <name>" (ParentButton).
 * Props: ward { id, firstName, name, pronoun }, onClose, onUnlink(reason). Cancel / X / scrim / Esc call onClose; the confirm button calls onUnlink(reason) and is disabled while the reason is empty.
 * ⚠️ ASSUMPTION: the input starts with the drawn value "Linked by mistake" (editable); the page closes the dialog and shows the PW-15b toast.
 */
const UnlinkDialog = ({ ward, onClose, onUnlink }) => {
  const copy = unlinkCopy(ward);
  const [reason, setReason] = useState(copy.reasonDefault);
  const inputId = useId();
  const ready = reason.trim().length > 0;
  log('render', { ward: ward?.id, ready });

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    log('unlink', { ward: ward?.id, reasonLength: reason.trim().length });
    onUnlink?.(reason.trim());
  };

  return (
    <DialogCard
      label={copy.title}
      onClose={onClose}
      width={560}
      gap={16}
      focusCard={false}
      className="items-start"
    >
      <form onSubmit={submit} className="contents">
        <div className="flex w-full items-start justify-between">
          <img src={spotWard} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
          <DialogCloseButton
            onClose={() => {
              log('close');
              onClose?.();
            }}
          />
        </div>
        <h2 className="m-0 w-full text-[24px] leading-[normal] font-semibold text-[#1c2a21]">
          {copy.title}
        </h2>
        <p className="m-0 w-full text-[14px] leading-[1.45] font-normal text-[#575755]">
          {copy.body}
        </p>
        <ul className="m-0 flex w-full list-none flex-col gap-[4px] overflow-clip rounded-[24px] bg-[#ebf1ec] p-[18px]">
          {copy.rows.map((r) => (
            <li key={r.title} className="flex items-center gap-[14px] py-[8px]">
              <img src={dialogDot} alt="" aria-hidden="true" className="size-[8px] shrink-0" />
              <span className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[normal]">
                <span className="text-[14px] font-semibold text-[#1c2a21]">{r.title}</span>
                <span className="text-[12px] font-normal text-[#575755]">{r.text}</span>
              </span>
            </li>
          ))}
        </ul>
        <ParentTextField
          id={inputId}
          label={copy.reasonLabel}
          required
          aria-required="true"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          helperText={copy.reasonHint}
          data-autofocus
        />
        <div className="flex w-full items-center justify-end gap-[12px]">
          <ParentButton variant="secondary" onClick={onClose}>
            {copy.cancel}
          </ParentButton>
          <ParentButton type="submit" disabled={!ready}>
            {copy.confirm}
          </ParentButton>
        </div>
      </form>
    </DialogCard>
  );
};

export default UnlinkDialog;
