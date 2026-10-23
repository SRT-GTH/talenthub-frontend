import { classNames } from '../../../../utils/classNames.js';
import { PlayfulChip } from '../../../ui/PlayfulChatParts.jsx';
import { usePlayfulScope } from '../../../ui/PlayfulScope.js';
import { sendBuddyChip } from './opportunityEvents.js';

/*
 * ThreadChips - the white answer pills Figma draws under a Career Buddy message, inside the thread (the demo frames and the
 * "Why these 3?" row under the match cards). Clicking one answers as if typed (opportunityEvents.js). `onPick` overrides that
 * for static demo frames.
 */
const ThreadChips = ({ chips, onPick, className }) => {
  const playful = usePlayfulScope();
  const pick = onPick ?? sendBuddyChip;
  return (
    <div
      className={classNames(
        'mt-[12px] flex flex-wrap items-center gap-x-[16px] gap-y-[14px]',
        className
      )}
    >
      {chips.map((chip) =>
        playful ? (
          <PlayfulChip key={chip} onClick={() => pick(chip)}>
            {chip}
          </PlayfulChip>
        ) : (
          <button
            key={chip}
            type="button"
            onClick={() => pick(chip)}
            className="flex min-h-[24px] cursor-pointer items-center rounded-[16px] border-[0.8px] border-solid border-[#e5e7eb] bg-white px-[16px] py-[8px] text-left font-sans text-[15px] text-[#575755] hover:border-brand-green hover:text-brand-green max-lg:py-1 max-lg:text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {chip}
          </button>
        )
      )}
    </div>
  );
};

export default ThreadChips;
