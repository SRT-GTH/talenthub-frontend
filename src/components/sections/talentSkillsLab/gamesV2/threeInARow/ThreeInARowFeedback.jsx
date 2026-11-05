import { ThreeInARowFeedbackCheckIcon, ThreeInARowFeedbackInfoIcon } from './ThreeInARowIcons.jsx';

/*
 * ThreeInARowFeedback — the pill under the board (Figma "GTH · Game feedback" instance in the 460×64 "feedback slot" 9619:62667).
 *   tone 'success' mint #e2f1e4 + green text (win, 9619:64138)     tone 'info' #f2f5f4 + grey text (square taken, 9619:64876)
 * Playful: 1.2px ink@.35 outline + 3px hard shadow. Focused: flat. Always reserves the 64px slot so the board never jumps.
 */
const ThreeInARowFeedback = ({ tone, message }) => (
  <div className="flex min-h-[64px] w-full items-start justify-center pt-[9px]" aria-live="polite">
    {message ? (
      <p
        className={`m-0 inline-flex max-w-full items-center gap-[10px] rounded-full py-[10px] pr-[18px] pl-[14px] font-sans text-[14px] leading-[17px] font-semibold playful:border-[1.2px] playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:shadow-[0_3px_0_rgba(28,42,33,0.25)] ${
          tone === 'success' ? 'bg-[#e2f1e4] text-[#27522e]' : 'bg-[#f2f5f4] text-[#6b6b6b]'
        }`}
      >
        <span className="inline-flex size-[24px] shrink-0 items-center justify-center rounded-full bg-white">
          {tone === 'success' ? (
            <ThreeInARowFeedbackCheckIcon className="size-[16px]" />
          ) : (
            <ThreeInARowFeedbackInfoIcon className="size-[16px]" />
          )}
        </span>
        <span>{message}</span>
      </p>
    ) : null}
  </div>
);

export default ThreeInARowFeedback;
