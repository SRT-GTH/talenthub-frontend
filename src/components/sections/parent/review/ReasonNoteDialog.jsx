import { useId, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import { MIN_NOTE } from './data/reviewData.js';

const log = debug('ReasonNoteDialog');

/*
 * ReasonNoteDialog — one dialog for "pick a reason, write a note": PR-02b "Decline Abena’s certificate?" (Figma 10041:4530, modal 10041:4858) and PR-04b "Flag “Extraversion · 41st percentile”"
 * (10051:20648, modal 10051:20965). 560 wide, r24, p28, gap16: 24/600 title + grey-green close, 14/20 intro, reason chips (h32, selected = ink), the required note field (design-system TextInput through
 * ParentTextField, helper "At least 10 characters…"), an optional info card (#f8f8f4, r14, p14, 12.5/500) and Cancel + the primary button, right aligned.
 * Props: title, intro, reasons [{ id, label }], noteLabel, noteHelp, noteError, info, cancelLabel, submitLabel, initial { reason, note, check } (frame seeds from the URL), onClose, onSubmit({ reason, note }).
 * The note needs MIN_NOTE (10) characters: a shorter one keeps the dialog open, focuses the field and shows noteError (⚠️ ASSUMPTION: the same error pattern as the flag dialogs; Figma draws none for these two).
 */
const CHIP =
  'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const ReasonNoteDialog = ({
  title,
  intro,
  reasons,
  noteLabel,
  noteHelp,
  noteError,
  info,
  cancelLabel,
  submitLabel,
  initial,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState(initial?.reason || reasons[0].id);
  const [note, setNote] = useState(initial?.note ?? '');
  const [checked, setChecked] = useState(Boolean(initial?.check));
  const inputRef = useRef(null);
  const inputId = useId();
  const tooShort = note.trim().length < MIN_NOTE;
  const showError = checked && tooShort;
  log('render', { title, reason, noteLength: note.length, showError });

  const submit = (e) => {
    e.preventDefault();
    if (tooShort) {
      log('note too short', { length: note.trim().length });
      setChecked(true);
      inputRef.current?.focus();
      return;
    }
    log('submit', { reason });
    onSubmit({ reason, note: note.trim() });
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
        <p className="m-0 text-[14px] leading-[1.45] text-[#575755]">{intro}</p>

        <div role="radiogroup" aria-label="Reason" className="flex flex-wrap gap-[8px]">
          {reasons.map((r) => {
            const on = r.id === reason;
            return (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setReason(r.id)}
                className={`${CHIP} ${
                  on
                    ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                    : 'border-[#e1eae2] bg-white text-[#595959]'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <ParentTextField
          ref={inputRef}
          id={inputId}
          label={noteLabel}
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          helperText={noteHelp}
          error={showError ? noteError : undefined}
          data-autofocus
        />

        {info ? (
          <div className="rounded-[14px] bg-neutral p-[14px] text-[12.5px] leading-[1.45] font-medium text-[#575755] max-lg:text-[12px]">
            {info}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-[12px]">
          <ParentButton variant="secondary" onClick={onClose}>
            {cancelLabel}
          </ParentButton>
          <ParentButton type="submit">{submitLabel}</ParentButton>
        </div>
      </form>
    </DialogCard>
  );
};

export default ReasonNoteDialog;
