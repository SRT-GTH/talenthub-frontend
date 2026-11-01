import { classNames } from '../../../../../utils/classNames.js';
import { GameV2FeedbackCheckIcon, GameV2FeedbackCloseIcon } from '../GameV2PlatformIcons.jsx';
import { MEMORY_COPY } from './memoryMatchData.js';

/*
 * MemoryMatchFeedback — Figma "GTH · Game feedback" pill under the board (68px slot, pill centred; GV-04 ok, GV-05 wrong).
 *   ok     #e2f1e4, #27522e text, check in a white 24px disc          wrong  #fcebe8, #c73326 text, × in a white disc
 * Playful: 1.2px ink@.35 border + 3px hard shelf (ink@.25). Focused: flat. The slot keeps its height when empty so the board never jumps.
 * `kind` null renders just the slot. role="status" so the result is announced.
 */
const MemoryMatchFeedback = ({ kind }) => {
  const ok = kind === 'pair';
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[68px] w-full items-center justify-center py-[11px]"
    >
      {kind ? (
        <p
          className={classNames(
            'm-0 inline-flex max-w-full items-center gap-[10px] rounded-full py-[10px] pr-[18px] pl-[14px] font-sans text-[14px] leading-[17px] font-semibold',
            'playful:border-[1.2px] playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:shadow-[0_3px_0_rgba(28,42,33,0.25)]',
            ok ? 'bg-[#e2f1e4] text-[#27522e]' : 'bg-[#fcebe8] text-[#c73326]'
          )}
        >
          <span
            aria-hidden="true"
            className="inline-flex size-[24px] shrink-0 items-center justify-center rounded-full bg-white p-[4px]"
          >
            {ok ? (
              <GameV2FeedbackCheckIcon className="size-[16px] text-[#27522e]" />
            ) : (
              <GameV2FeedbackCloseIcon className="size-[16px] text-[#c73326]" />
            )}
          </span>
          <span>{ok ? MEMORY_COPY.pairFeedback : MEMORY_COPY.missFeedback}</span>
        </p>
      ) : null}
    </div>
  );
};

export default MemoryMatchFeedback;
