import { classNames } from '../../../../../utils/classNames.js';
import {
  NwBriefcaseIcon,
  NwHeartIcon,
  NwInfoIcon,
  NwWarningIcon,
} from '../numbersWords/NumbersWordsIcons.jsx';

/*
 * WordClueChips — Figma "clue": three 22px chips, gap 10 (icon 13 + 5 + 12/14 600):
 *   "Field: Health" #e5f0fa / #2966b0 · "7 letters" #f2f5f4 / #6b6b6b · "1 tries left" (same grey, copy as drawn) or
 *   "Last try" #fef8ec / #8a6100 after a wrong guess.
 */
const CHIP =
  'inline-flex items-center gap-[5px] rounded-full px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold whitespace-nowrap';

const WordClueChips = ({ field, letterCount, lastTry, triesLabel }) => (
  <ul
    className="m-0 flex list-none flex-wrap items-center justify-center gap-[10px] p-0"
    aria-label="Clue"
  >
    <li className={classNames(CHIP, 'bg-[#e5f0fa] text-[#2966b0]')}>
      <NwBriefcaseIcon className="size-[13px] shrink-0" />
      {`Field: ${field}`}
    </li>
    <li className={classNames(CHIP, 'bg-[#f2f5f4] text-[#6b6b6b]')}>
      <NwInfoIcon className="size-[13px] shrink-0" />
      {`${letterCount} letters`}
    </li>
    {lastTry ? (
      <li className={classNames(CHIP, 'bg-[#fef8ec] text-[#8a6100]')}>
        <NwWarningIcon className="size-[13px] shrink-0" />
        Last try
      </li>
    ) : (
      <li className={classNames(CHIP, 'bg-[#f2f5f4] text-[#6b6b6b]')}>
        <NwHeartIcon className="size-[13px] shrink-0" />
        {triesLabel}
      </li>
    )}
  </ul>
);

export default WordClueChips;
