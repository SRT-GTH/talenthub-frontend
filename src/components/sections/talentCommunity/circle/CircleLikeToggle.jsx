import { classNames } from '../../../../utils/classNames.js';
import { CircleLikeFilledIcon, CircleLikeIcon } from './circleIcons.jsx';
import { FOCUS_RING } from './circleStyles.js';

/*
 * CircleLikeToggle — Figma `GTH · Like toggle`: 28px pill, p6/8, 16px thumb + count 13px. Liked = #ebf1ec with a green count (600);
 * not liked = transparent with a grey count (500). Props: liked, count, label (aria), onToggle().
 */
const CircleLikeToggle = ({ liked, count, label, onToggle }) => (
  <button
    type="button"
    aria-pressed={liked}
    aria-label={label}
    onClick={onToggle}
    className={classNames(
      'inline-flex h-[28px] cursor-pointer items-center gap-[6px] rounded-[10px] border-0 px-[8px] py-[6px] font-sans text-[13px] leading-[16px] max-lg:min-h-[44px]',
      liked
        ? 'bg-[#ebf1ec] font-semibold text-[#387440]'
        : 'bg-transparent font-medium text-[#595959]',
      FOCUS_RING
    )}
  >
    {liked ? (
      <CircleLikeFilledIcon className="size-[16px] text-[#387440]" />
    ) : (
      <CircleLikeIcon className="size-[16px]" />
    )}
    {count}
  </button>
);

export default CircleLikeToggle;
