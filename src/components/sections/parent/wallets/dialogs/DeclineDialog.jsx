import { useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../../ui/DialogCard.jsx';
import ChoiceChips from '../../../../ui/ChoiceChips.jsx';
import ParentButton from '../../ParentButton.jsx';
import ParentTextField from '../../ParentTextField.jsx';
import { DECLINE_COPY as C, DECLINE_REASONS, DEFAULT_DECLINE_NOTE } from '../data/walletsData.js';

const log = debug('DeclineDialog');

/*
 * DeclineDialog — PWa-04 "Decline Abena’s GHS 90 payment?" (Figma 10042:973): 560 wide, p28, gap16, r24; 24/600 title + green-tone close, 14 intro, four reason chips ("Let’s talk first" selected),
 * the "Note to Abena" field (value "Let’s talk about it at dinner tonight.", helper "Optional · up to 200 characters."), "Cancel" + "Decline payment".
 * Props: ward, request, initial { reason, note } (the frame URL seeds them), onClose, onConfirm(note).
 * ⚠️ ASSUMPTION: picking a reason other than "Other" fills the note with a matching line the parent can edit; the frames draw only the first.
 */
const NOTES = {
  talk: DEFAULT_DECLINE_NOTE,
  expensive: 'That’s a lot for now. Let’s look at cheaper options together.',
  later: 'Not right now. Ask me again next month.',
  other: '',
};

const DeclineDialog = ({ ward, request, initial, onClose, onConfirm }) => {
  const [reason, setReason] = useState(initial?.reason ?? 'talk');
  const [note, setNote] = useState(initial?.note ?? NOTES[initial?.reason ?? 'talk']);
  const title = C.title(request, ward);
  log('render', { reason });

  const pick = (id) => {
    setReason(id);
    setNote(NOTES[id]);
  };

  return (
    <DialogCard label={title} onClose={onClose} width={560} gap={16} className="items-start">
      <div className="flex w-full items-start justify-between gap-[16px]">
        <h2 className="m-0 text-[24px] leading-[normal] font-semibold text-[#1c2a21] max-sm:text-[21px]">
          {title}
        </h2>
        <DialogCloseButton onClose={onClose} />
      </div>
      <p className="m-0 text-[14px] leading-[20px] text-[#575755]">{C.intro(ward)}</p>
      <ChoiceChips options={DECLINE_REASONS} value={reason} onChange={pick} label={C.reasons} />
      <ParentTextField
        label={C.noteLabel(ward)}
        value={note}
        maxLength={200}
        helperText={C.noteHelper}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex w-full flex-wrap items-center justify-end gap-[12px]">
        <ParentButton variant="secondary" onClick={onClose}>
          {C.cancel}
        </ParentButton>
        <ParentButton
          onClick={() => {
            log('decline', { reason });
            onConfirm?.(note.trim());
          }}
        >
          {C.confirm}
        </ParentButton>
      </div>
    </DialogCard>
  );
};

export default DeclineDialog;
