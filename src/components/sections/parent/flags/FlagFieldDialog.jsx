import { useId, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ChoiceChips from '../../../ui/ChoiceChips.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import eyeOffIcon from '../../../../assets/parent/ward-eye-off.svg';
import { FLAGS_COPY, SEVERITIES } from './data/flagsData.js';

const log = debug('FlagFieldDialog');

/*
 * FlagFieldDialog — the parent's flag dialog, two drawn variants over the same form:
 *   mode "field"  PW-04 "Flag “Volunteering”" (Figma 10034:5128) + PW-04c error (10077:18202): 600 wide, p32, 26/600 title, 15 intro, "Currently shows" box (#f8f8f4, r14), severity chips,
 *                 required note input, the "hidden from recruiters" hint (#ebf1ec, r12) and Cancel + "Send flag to <ward>".
 *   mode "again"  PW-06c "Flag “Date of birth” again" (Figma 10056:923): 560 wide, p28, 24/600 title, 14 intro, no current box / hint, "What’s still wrong?", Cancel + "Send flag again".
 * Severity chips ("Just so you know" · "Needs correcting" · "Critical") are a radio group, default "Needs correcting" (the drawn selection). The note needs at least 10 characters: sending a shorter note
 * shows PW-04c's error (red input #ebc2bd 1.5px + red text, the "Add a little more…" help line) and keeps focus on the input.
 * Props: ward ({ firstName, possessive }), mode, label (field name), current (value shown in the box, mode "field"), initial ({ severity, note, check }) — frame seeds for the URL, onClose, onSend({ severity, note }).
 * ⚠️ ASSUMPTION: Figma draws PW-04's input 435 wide and PW-04c's 534; both are full width here. The note is a one-line input as drawn.
 */
const FlagFieldDialog = ({ ward, mode = 'field', label, current, initial, onClose, onSend }) => {
  const [severity, setSeverity] = useState(initial?.severity ?? 'correcting');
  const [note, setNote] = useState(initial?.note ?? '');
  const [checked, setChecked] = useState(Boolean(initial?.check));
  const inputRef = useRef(null);
  const inputId = useId();
  const again = mode === 'again';
  const copy = FLAGS_COPY.field;
  const tooShort = note.trim().length < FLAGS_COPY.minNote;
  const showError = checked && tooShort;
  log('render', { mode, label, severity, noteLength: note.length, showError });

  const submit = (e) => {
    e.preventDefault();
    if (tooShort) {
      log('note too short', { length: note.trim().length });
      setChecked(true);
      inputRef.current?.focus();
      return;
    }
    onSend({ severity, note: note.trim() });
  };

  const title = again ? FLAGS_COPY.again.title(label) : copy.title(label);
  const sendLabel = again ? FLAGS_COPY.again.send : copy.send(ward);

  return (
    <DialogCard
      label={title}
      onClose={onClose}
      width={again ? 560 : 600}
      padding={again ? 28 : 32}
      gap={16}
      focusCard={false}
      className="items-stretch max-sm:!p-[20px]"
    >
      <form onSubmit={submit} noValidate className="contents">
        <div className="flex items-start gap-[12px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
            <h2
              className={`m-0 font-semibold text-[#1c2a21] ${
                again
                  ? 'text-[24px] leading-normal'
                  : 'text-[26px] leading-[1.25] tracking-[-0.13px]'
              }`}
            >
              {title}
            </h2>
            {again ? null : (
              <p className="m-0 text-[15px] leading-normal text-[#575755]">{copy.intro(ward)}</p>
            )}
          </div>
          <DialogCloseButton onClose={onClose} tone={again ? 'green' : 'grey'} />
        </div>
        {again ? (
          <p className="m-0 text-[14px] leading-[1.45] text-[#575755]">
            {FLAGS_COPY.again.intro(ward)}
          </p>
        ) : null}

        {!again && current ? (
          <div className="flex flex-col gap-[2px] rounded-[14px] bg-[#f8f8f4] p-[14px]">
            <span className="text-[12px] leading-normal text-[#575755]">{copy.current}</span>
            <span className="text-[15px] leading-normal font-semibold text-[#1c2a21]">
              {current}
            </span>
          </div>
        ) : null}

        <div className="flex flex-col gap-[16px]">
          {!again ? (
            <span
              id={`${inputId}-sev`}
              className="text-[13px] leading-normal font-semibold text-[#575755] max-lg:text-[12px]"
            >
              {copy.severity}
            </span>
          ) : null}
          <ChoiceChips
            options={SEVERITIES}
            value={severity}
            onChange={setSeverity}
            label={again ? 'How important is it?' : undefined}
            labelledBy={again ? undefined : `${inputId}-sev`}
          />
        </div>

        <ParentTextField
          ref={inputRef}
          id={inputId}
          label={again ? FLAGS_COPY.again.noteLabel : copy.noteLabel}
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          helperText={copy.noteHelp(ward)}
          error={showError ? copy.noteError(ward) : undefined}
          data-autofocus
        />

        {!again ? (
          <div className="flex items-center gap-[8px] rounded-[12px] bg-[#ebf1ec] p-[12px]">
            <img src={eyeOffIcon} alt="" aria-hidden="true" className="h-[14px] w-4 shrink-0" />
            <span className="text-[13px] leading-normal font-medium text-[#1c2a21] max-lg:text-[12px]">
              {copy.hidden}
            </span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-[12px]">
          <ParentButton variant="secondary" onClick={onClose}>
            {copy.cancel}
          </ParentButton>
          <ParentButton type="submit">{sendLabel}</ParentButton>
        </div>
      </form>
    </DialogCard>
  );
};

export default FlagFieldDialog;
