import { useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ChoiceChips from '../../../ui/ChoiceChips.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import spotPrivacy from '../../../../assets/parent/spot-privacy.svg';
import { OPT_OUT_COPY, REPORT_WORRIES } from './data/optOutData.js';

const log = debug('ReportConcernDialog');

/*
 * ReportConcernDialog — PH-03 "Report a safety concern" (Figma 10057:1591, modal 10057:1779): 580 wide, r24, p28, gap 16, scrim ink at 55 %. Spot · Privacy 80 + close (36, green #f8f8f4), 24/600 title, 14 intro,
 * "Who is it about?" (the linked wards + "Someone else"), "What’s worrying you?" (four chips), the required "Tell us more" note (helper "We may contact you on WhatsApp"), the red notice
 * ("If a child is in danger right now, call 112 (or 191 for the police) first." #f9ebea, r14, 12.5/600 #c0392b) and "Cancel" + "Send report".
 * Props: wards ([{ id, firstName }] the parent's linked wards), initial ({ who, worry, note }) — frame seeds for the URL, onClose, onSend({ who, worry, note }).
 * Drawn over the Help and guides page (a later canvas); here it opens over the ward page. ⚠️ ASSUMPTION: "Send report" stays disabled until the note has text; "Who" starts on the first ward and "What" on the
 * first chip (the drawn selections).
 */
const ReportConcernDialog = ({ wards, initial, onClose, onSend }) => {
  const copy = OPT_OUT_COPY.report;
  const whoOptions = [
    ...wards.map((w) => ({ id: w.id, label: w.firstName })),
    { id: 'else', label: copy.someoneElse },
  ];
  const [who, setWho] = useState(initial?.who ?? whoOptions[0].id);
  const [worry, setWorry] = useState(initial?.worry ?? REPORT_WORRIES[0].id);
  const [note, setNote] = useState(initial?.note ?? '');
  const whoId = useId();
  const worryId = useId();
  const ready = note.trim().length > 0;
  log('render', { who, worry, noteLength: note.length, ready });

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    onSend({ who, worry, note: note.trim() });
  };

  return (
    <DialogCard
      label={copy.title}
      onClose={onClose}
      width={580}
      padding={28}
      gap={16}
      focusCard={false}
      className="items-stretch max-sm:!p-[20px]"
    >
      <form onSubmit={submit} noValidate className="contents">
        <div className="flex items-start justify-between">
          <img src={spotPrivacy} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
          <DialogCloseButton onClose={onClose} />
        </div>
        <h2 className="m-0 text-[24px] leading-normal font-semibold text-[#1c2a21]">
          {copy.title}
        </h2>
        <p className="m-0 text-[14px] leading-[1.45] text-[#575755]">{copy.intro}</p>

        <span id={whoId} className="text-[13px] leading-normal font-semibold text-[#1c2a21]">
          {copy.who}
        </span>
        <ChoiceChips options={whoOptions} value={who} onChange={setWho} labelledBy={whoId} />

        <span id={worryId} className="text-[13px] leading-normal font-semibold text-[#1c2a21]">
          {copy.worry}
        </span>
        <ChoiceChips
          options={REPORT_WORRIES}
          value={worry}
          onChange={setWorry}
          labelledBy={worryId}
        />

        <ParentTextField
          label={copy.more}
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          helperText={copy.moreHelp}
          data-autofocus
        />

        <p className="m-0 rounded-[14px] bg-[#f9ebea] p-[14px] text-[12.5px] leading-normal font-semibold text-[#c0392b]">
          {copy.danger}
        </p>

        <div className="flex flex-wrap items-center justify-end gap-[12px]">
          <ParentButton variant="secondary" onClick={onClose}>
            {copy.cancel}
          </ParentButton>
          <ParentButton type="submit" disabled={!ready}>
            {copy.send}
          </ParentButton>
        </div>
      </form>
    </DialogCard>
  );
};

export default ReportConcernDialog;
