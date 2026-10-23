import { classNames } from '../../../../utils/classNames.js';
import { HEADING, STICKER } from './circleStyles.js';

/*
 * CircleSectionHead — a section title over the card grid: title 22/26 (empty state 20/24) + 13px grey note; Playful can carry the
 * "PICKED FOR YOU" sticker (-3°) at the right. Props: title, note, sticker, size ('lg' | 'md'), className.
 */
const CircleSectionHead = ({ title, note, sticker, size = 'lg', className }) => (
  <div className={classNames('flex flex-wrap items-end justify-between gap-[8px]', className)}>
    <div className="flex min-w-0 flex-col gap-[3px]">
      <h2
        className={classNames(
          HEADING,
          size === 'lg' ? 'text-[22px] leading-[26px]' : 'text-[20px] leading-[24px]'
        )}
      >
        {title}
      </h2>
      {note && (
        <p className="m-0 font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[14px] max-lg:leading-[18px]">
          {note}
        </p>
      )}
    </div>
    {sticker && <span className={classNames(STICKER, '-rotate-[3deg]')}>{sticker}</span>}
  </div>
);

export default CircleSectionHead;
