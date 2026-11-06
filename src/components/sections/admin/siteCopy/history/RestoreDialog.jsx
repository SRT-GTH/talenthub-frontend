import { useId, useState } from 'react';
import Button from '../../../../ui/Button.jsx';
import { debug } from '../../../../../utils/debug.js';
import AgencyDialog from '../../../agency/onboarding/AgencyDialog.jsx';
import { PreviewClockIcon, PreviewCloseIcon } from '../preview/PreviewIcons.jsx';

const log = debug('RestoreDialog');

/*
 * RestoreDialog — "Restore version 4?" (Figma 7.8.5c: 540 wide, white, r24, p28, gap16, scrim #1c2a21 at 55 %): the 44 px tile with the clock, the 24/29 600 title and
 * the 30 px close, the sentence "Version 6 goes live with version 4’s text: “…”. Version 5 stays in history.", the reason input "Why are you publishing this?" with the
 * "9 / 200 · everyone on the team can see this in history" counter, Cancel and the primary "Restore and publish". The reason must be 3-200 characters.
 * ⚠️ ASSUMPTION: the restore error reuses the publish dialog's wording ("Add a short reason (3–200 characters) so the team knows why this changed. Nothing was published.").
 * Props: version (the one restored), next (the new live version), live (the current live version), quote (text of its first changed field or ''), initialReason, onCancel, onConfirm(reason).
 */
const REASON_MIN = 3;
const REASON_MAX = 200;

const RestoreDialog = ({ version, next, live, quote, initialReason = '', onCancel, onConfirm }) => {
  const [reason, setReason] = useState(initialReason);
  const [touched, setTouched] = useState(false);
  const id = useId();
  const length = reason.trim().length;
  const invalid = length < REASON_MIN;
  const showError = touched && invalid;

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (invalid) {
      log('blocked: reason too short', { length });
      return;
    }
    log('confirm', { version, reason: reason.trim() });
    onConfirm(reason.trim());
  };

  return (
    <AgencyDialog
      label={`Restore version ${version}?`}
      onClose={onCancel}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(540px,calc(100vw-24px))]"
    >
      <form
        onSubmit={submit}
        noValidate
        className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(18px,5vw,28px)] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center gap-[12px]">
          <span className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#ebf1ec]/50 text-[#27522e]">
            <PreviewClockIcon className="size-[21px]" />
          </span>
          <h2 className="m-0 min-w-0 flex-1 font-sans text-[clamp(20px,5vw,24px)] leading-[29px] font-semibold tracking-[-0.01em] text-[#1c2a21]">
            {`Restore version ${version}?`}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8f8f4] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <PreviewCloseIcon className="size-[18px]" />
          </button>
        </div>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#575755]">
          {quote
            ? `Version ${next} goes live with version ${version}’s text: “${quote}”. Version ${live} stays in history.`
            : `Version ${next} goes live with version ${version}’s text. Version ${live} stays in history.`}
        </p>
        <div className="flex flex-col gap-[6px]">
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor={id}
              className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
            >
              Why are you publishing this?
            </label>
            <input
              id={id}
              data-autofocus
              type="text"
              value={reason}
              maxLength={REASON_MAX}
              aria-invalid={showError}
              aria-describedby={`${id}-hint`}
              onChange={(e) => setReason(e.target.value)}
              className={`h-[51px] w-full rounded-[10px] border border-solid bg-white px-[20px] py-[13px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_11px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.06)] outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440] ${showError ? 'border-[#c0392b]' : 'border-[#ccc]'}`}
            />
          </div>
          <p
            id={`${id}-hint`}
            className="m-0 font-sans text-[12.5px] leading-[15px] text-[#575755]"
          >
            {`${reason.length} / ${REASON_MAX} · everyone on the team can see this in history`}
          </p>
          <p
            role="alert"
            className="m-0 font-sans text-[12.5px] leading-[16px] font-medium text-[#c0392b]"
          >
            {showError
              ? 'Add a short reason (3–200 characters) so the team knows why this changed. Nothing was published.'
              : ''}
          </p>
        </div>
        <div className="flex flex-col gap-[12px] sm:flex-row">
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            className="min-w-0 flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" className="min-w-0 flex-1">
            Restore and publish
          </Button>
        </div>
      </form>
    </AgencyDialog>
  );
};

export default RestoreDialog;
