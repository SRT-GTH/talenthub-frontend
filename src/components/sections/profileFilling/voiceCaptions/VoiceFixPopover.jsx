import { useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { CaptionCheckIcon, CaptionEditIcon } from './VoiceCaptionIcons.jsx';
import { VOICE_COPY } from './voiceCaptionData.js';

/*
 * "Did you mean…" popover on a doubtful word of a saved voice turn - Figma 9149:84827 (Playful) / 9149:87514 (Focused).
 * White, radius 14, padding 12, 8px gap; Playful: 1.5 ink border @55% + hard shadow + "QUICK FIX" sticker (rotated +4deg),
 * Focused: 1px #e7e7e7 + soft shadow. Chips (28 high, pill): suggestion (Playful solid green / Focused pale green),
 * `Keep “heard”`, `Type it` with the pencil.
 *
 * "Type it" swaps the chip row for a text field: Enter (or the check button) uses the typed word, Esc goes back.
 * ⚠️ ASSUMPTION: Figma draws no typing state; this one is the smallest field + check button, no extra copy.
 */
const CHIP =
  'inline-flex cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-full border border-solid border-[#e7e7e7] bg-white px-[12px] py-[6px] font-sans text-[13px] font-medium leading-[15.5px] text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21] max-lg:min-h-11';

const VoiceFixPopover = ({ heard, suggestion, onPick, onKeep, onClose }) => {
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      if (typing) setTyping(false);
      else onClose?.();
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [typing, onClose]);

  const submitTyped = () => {
    const word = draft.trim();
    if (word) onPick(word);
  };

  return (
    <div
      role="dialog"
      aria-label={VOICE_COPY.didYouMean}
      className={classNames(
        'absolute right-0 top-[calc(100%+10px)] z-[3] flex w-[min(320px,calc(100vw-32px))] flex-col gap-[8px] rounded-[14px] border border-solid border-[#e7e7e7] bg-white p-[12px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_6px_20px_rgba(28,42,33,0.06)] lg:right-[72px]',
        'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-[16px] -top-[14px] hidden rotate-[4deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[9px] py-[3px] font-sans text-[11px] max-lg:text-[12px] font-bold leading-[13px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block"
      >
        {VOICE_COPY.quickFix}
      </span>
      <p className="m-0 font-sans text-[12px] font-semibold leading-[14.3px] text-[#737373]">
        {VOICE_COPY.didYouMean}
      </p>
      {typing ? (
        <div className="flex items-center gap-[8px]">
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitTyped();
              }
            }}
            aria-label="Type the word"
            className="min-w-0 flex-1 rounded-full border border-solid border-[#e7e7e7] bg-white px-[12px] py-[6px] font-sans text-[13px] leading-[15.5px] text-[#1c2a21] outline-none focus-visible:border-[#387440] max-lg:min-h-11 max-lg:text-[14px]"
          />
          <button
            type="button"
            onClick={submitTyped}
            aria-label="Use this word"
            className="inline-flex size-[28px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#387440] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21] max-lg:size-11"
          >
            <CaptionCheckIcon className="size-[14px]" />
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-[8px]">
          <button
            type="button"
            onClick={() => onPick(suggestion)}
            className="inline-flex cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-full border-0 bg-[#ebf1ec] px-[12px] py-[6px] font-sans text-[13px] font-semibold leading-[15.5px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21] playful:bg-[#387440] playful:text-white max-lg:min-h-11"
          >
            <CaptionCheckIcon className="size-[14px]" />
            {suggestion}
          </button>
          <button type="button" onClick={onKeep} className={CHIP}>
            {`Keep \u201c${heard}\u201d`}
          </button>
          <button type="button" onClick={() => setTyping(true)} className={CHIP}>
            <CaptionEditIcon className="size-[14px] text-[#1c2a21]" />
            {VOICE_COPY.typeIt}
          </button>
        </div>
      )}
      <p className="m-0 font-sans text-[11px] leading-[13.1px] text-[#737373] max-lg:text-[12px]">
        {VOICE_COPY.learns}
      </p>
    </div>
  );
};

export default VoiceFixPopover;
