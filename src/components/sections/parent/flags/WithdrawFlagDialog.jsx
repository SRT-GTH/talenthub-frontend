import { useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import { FLAGS_COPY } from './data/flagsData.js';

const log = debug('WithdrawFlagDialog');

/*
 * WithdrawFlagDialog — the parent takes a flag back (no Figma frame: the "Flag again" shell, PW-06c 10056:923 — 560 wide, p28, 24/600 title, 14 intro, Cancel + primary). The field shows to recruiters
 * again and the ward is told there is nothing to change; the note is optional (max 500) and goes to the ward.
 * Props: ward ({ firstName, possessive }), flag ({ id, label }), busy (a write is running), onClose, onWithdraw({ note }). Esc / X / scrim call onClose.
 */
const WithdrawFlagDialog = ({ ward, flag, busy = false, onClose, onWithdraw }) => {
  const copy = FLAGS_COPY.withdraw;
  const [note, setNote] = useState('');
  const inputId = useId();
  const title = copy.title(flag.label);
  log('render', { flag: flag.id, noteLength: note.length });

  const submit = (e) => {
    e.preventDefault();
    if (busy) return;
    onWithdraw({ note: note.trim() });
  };

  return (
    <DialogCard
      label={title}
      onClose={onClose}
      width={560}
      padding={28}
      gap={16}
      focusCard={false}
      className="items-stretch max-sm:!p-[20px]"
    >
      <form onSubmit={submit} noValidate className="contents">
        <div className="flex items-start gap-[12px]">
          <h2 className="m-0 min-w-0 flex-1 text-[24px] leading-normal font-semibold text-[#1c2a21]">
            {title}
          </h2>
          <DialogCloseButton onClose={onClose} tone="green" />
        </div>
        <p className="m-0 text-[14px] leading-[1.45] text-[#575755]">{copy.intro(ward, flag)}</p>
        <ParentTextField
          id={inputId}
          label={copy.noteLabel(ward)}
          value={note}
          maxLength={500}
          onChange={(e) => setNote(e.target.value)}
          helperText={copy.noteHelp(ward)}
          data-autofocus
        />
        <div className="flex flex-wrap items-center justify-end gap-[12px]">
          <ParentButton variant="secondary" onClick={onClose}>
            {copy.cancel}
          </ParentButton>
          <ParentButton type="submit" disabled={busy}>
            {copy.confirm}
          </ParentButton>
        </div>
      </form>
    </DialogCard>
  );
};

export default WithdrawFlagDialog;
