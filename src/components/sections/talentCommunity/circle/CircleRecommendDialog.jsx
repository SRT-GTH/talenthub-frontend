import { useState } from 'react';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleChevronRightIcon, CircleEyeIcon, CircleSparkleIcon } from './circleIcons.jsx';
import CircleButton from './CircleButton.jsx';
import CircleDialogShell from './CircleDialogShell.jsx';
import CircleNoteField from './CircleNoteField.jsx';
import { FOCUS_RING } from './circleStyles.js';

/*
 * CircleRecommendDialog — NW-08 "Recommend {first}": "How do you know {first}?" (select), "What should people know about working
 * with him?" (600 characters), "Help me make it specific", the approval note (eye, #faf4e8), Cancel / "Send to {first}".
 * Props: person, dialog (profile.recommendDialog copy), initialText (the drawn recommendation when ?draft=1), onSend(text, how), onClose,
 * initialHow (editing: the saved relationship), sendLabel (editing: "Save changes"), busy.
 * ⚠️ ASSUMPTIONS: the relationship list beyond the drawn option; "Help me make it specific" fills the canned suggestion (no AI call);
 * Send is disabled while the text is empty.
 */
const CircleRecommendDialog = ({
  person,
  dialog,
  initialText = '',
  initialHow,
  sendLabel,
  busy = false,
  onSend,
  onClose,
}) => {
  const [how, setHow] = useState(initialHow ?? dialog.relationships[0]);
  const [text, setText] = useState(initialText);
  return (
    <CircleDialogShell
      personId={person.id}
      title={dialog.title}
      subtitle={dialog.subtitle}
      titleId="circle-recommend-title"
      width={560}
      onClose={onClose}
    >
      <div className="flex flex-col gap-[8px]">
        <label
          htmlFor="circle-recommend-how"
          className="font-sans text-[13px] font-semibold leading-[16px] text-[#595959] max-lg:text-[14px]"
        >
          {dialog.howLabel}
        </label>
        <div className="relative">
          <select
            id="circle-recommend-how"
            value={how}
            onChange={(e) => setHow(e.target.value)}
            className={`block h-[43px] w-full cursor-pointer appearance-none rounded-[12px] border border-solid border-[#e7e7e7] bg-white py-[12px] pl-[14px] pr-[40px] font-sans text-[14px] leading-[17px] text-[#1c2a21] ${FOCUS_RING}`}
          >
            {dialog.relationships.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <CircleChevronRightIcon className="pointer-events-none absolute right-[14px] top-1/2 size-[16px] -translate-y-1/2 rotate-90 text-[#595959]" />
        </div>
      </div>
      <div className="flex flex-col gap-[8px]">
        <label
          htmlFor="circle-recommend-text"
          className="font-sans text-[13px] font-semibold leading-[16px] text-[#595959] max-lg:text-[14px]"
        >
          {dialog.whatLabel}
        </label>
        <CircleNoteField
          id="circle-recommend-text"
          value={text}
          onChange={setText}
          max={dialog.max}
          label={dialog.whatLabel}
        />
      </div>
      <button
        type="button"
        onClick={() => setText(dialog.suggestion)}
        className={`inline-flex w-fit cursor-pointer items-center gap-[8px] border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:text-[14px] ${FOCUS_RING}`}
      >
        <CircleSparkleIcon className="size-[16px]" />
        {dialog.help}
      </button>
      <div className="flex gap-[10px] rounded-[12px] bg-[#faf4e8] px-[12px] py-[10px]">
        <CircleEyeIcon className="size-[16px] shrink-0 text-[#785910]" />
        <p className="m-0 font-sans text-[12px] leading-[17px] text-[#785910] max-lg:text-[13px]">
          {dialog.approval}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-[10px]">
        <CircleButton tone="soft" onClick={onClose}>
          {COPY.cancel}
        </CircleButton>
        <CircleButton disabled={!text.trim() || busy} onClick={() => onSend(text.trim(), how)}>
          {sendLabel ?? `Send to ${person.firstName}`}
        </CircleButton>
      </div>
    </CircleDialogShell>
  );
};

export default CircleRecommendDialog;
