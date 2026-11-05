import { useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ChoiceChips from '../../../ui/ChoiceChips.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import checkIcon from '../../../../assets/parent/optout-check.svg';
import { OPT_OUT_COPY, OPT_OUT_REASONS } from './data/optOutData.js';

const log = debug('OptOutDialog');

/*
 * OptOutDialog — PO-01 "Opt Abena out of GTH?" (Figma 10033:5762, modal 10033:6353): 620 wide, r24, p32, gap 16, scrim ink at 55 %. Title 26/600 + 15 intro + close (36, grey #f1f1ee), "Why are you opting her out?"
 * with four reason chips (Privacy concerns · Safety concerns · Too young · Other), an optional note ("Anything else? (optional)", up to 500 characters, only GTH safety staff see it), the red confirmation row
 * (#f9ebea, r12, p14: a 20px #c0392b checkbox + "I understand Abena will be told her access is paused.") and "Keep access" (secondary) + "Opt out Abena" (secondary with a red #c0392b label).
 * Props: ward ({ firstName, pronoun, possessive }), initial ({ reason, note, ack }) — frame seeds for the URL, onClose, onConfirm({ reasonId, reasonLabel, note }).
 * ⚠️ ASSUMPTION: the reason is optional (none is selected at first; the banner then leaves "reason:" out), "Opt out" stays disabled until the box is ticked, and the unticked box is a white box with a red line.
 */
const OptOutDialog = ({ ward, initial, onClose, onConfirm }) => {
  const copy = OPT_OUT_COPY.optOut;
  const [reason, setReason] = useState(initial?.reason ?? null);
  const [note, setNote] = useState(initial?.note ?? '');
  const [ack, setAck] = useState(Boolean(initial?.ack));
  const whyId = useId();
  const title = copy.title(ward);
  log('render', { ward: ward.id, reason, noteLength: note.length, ack });

  const submit = (e) => {
    e.preventDefault();
    if (!ack) return;
    const picked = OPT_OUT_REASONS.find((r) => r.id === reason);
    onConfirm({ reasonId: picked?.id, reasonLabel: picked?.label, note: note.trim() });
  };

  return (
    <DialogCard
      label={title}
      onClose={onClose}
      width={620}
      padding={32}
      gap={16}
      className="items-stretch max-sm:!p-[20px]"
    >
      <form onSubmit={submit} noValidate className="contents">
        <div className="flex items-start gap-[12px]">
          <div className="flex min-w-0 max-w-[500px] flex-1 flex-col gap-[6px]">
            <h2 className="m-0 text-[26px] leading-[1.25] font-semibold tracking-[-0.13px] text-[#1c2a21]">
              {title}
            </h2>
            <p className="m-0 text-[15px] leading-normal text-[#575755]">{copy.intro(ward)}</p>
          </div>
          <DialogCloseButton onClose={onClose} tone="grey" />
        </div>

        <span
          id={whyId}
          className="text-[13px] leading-normal font-semibold text-[#575755] max-lg:text-[12px]"
        >
          {copy.why(ward)}
        </span>
        <ChoiceChips
          options={OPT_OUT_REASONS}
          value={reason}
          onChange={setReason}
          labelledBy={whyId}
        />

        <ParentTextField
          label={copy.note}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={copy.noteMax}
          helperText={copy.noteHelp}
        />

        <label className="flex cursor-pointer items-center gap-[10px] rounded-[12px] bg-[#f9ebea] p-[14px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#c0392b]">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            className="sr-only"
          />
          <span
            aria-hidden="true"
            className={`flex size-[20px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-solid border-[#c0392b] ${ack ? 'bg-[#c0392b]' : 'bg-white'}`}
          >
            {ack ? <img src={checkIcon} alt="" className="size-[14px]" /> : null}
          </span>
          <span className="text-[14px] leading-normal font-medium text-[#1c2a21]">
            {copy.ack(ward)}
          </span>
        </label>

        <div className="flex flex-wrap items-center justify-end gap-[12px]">
          <ParentButton variant="secondary" onClick={onClose}>
            {copy.keep}
          </ParentButton>
          <ParentButton
            type="submit"
            variant="secondary"
            disabled={!ack}
            className="[&_span]:!text-[#c0392b]"
          >
            {copy.confirm(ward)}
          </ParentButton>
        </div>
      </form>
    </DialogCard>
  );
};

export default OptOutDialog;
