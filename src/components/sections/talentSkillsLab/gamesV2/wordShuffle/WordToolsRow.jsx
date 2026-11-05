import { classNames } from '../../../../../utils/classNames.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import {
  NwBackspaceArrowIcon,
  NwBulbDuotoneIcon,
  NwRefreshIcon,
} from '../numbersWords/NumbersWordsIcons.jsx';

/*
 * WordToolsRow — Figma "tools": Shuffle · Clear · Hint pills (38 high, gap 12, padding 9/14/9/12, icon 16 + 8 + 14/17 600).
 * Playful 1.5px ink@.55 + hard 0 3 0 ink@.35 · Focused 1px #dee5e0, flat. The hint pill is amber (#8a6100) and, once used,
 * reads "Hint used · this word is now worth ¾" (still drawn, no longer pressable).
 */
const TOOL =
  'inline-flex min-h-[38px] items-center gap-[8px] rounded-full border border-solid border-[#dee5e0] bg-white py-[9px] pr-[14px] pl-[12px] font-sans text-[14px] leading-[17px] font-semibold enabled:cursor-pointer disabled:cursor-default playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_3px_0_rgba(28,42,33,0.35)] max-lg:text-[12px]';

const WordToolsRow = ({ hintUsed, hintLabel, resolved, onShuffle, onClear, onHint }) => (
  <div className="flex flex-wrap items-center justify-center gap-[12px]">
    <button
      type="button"
      onClick={onShuffle}
      disabled={resolved}
      className={classNames(TOOL, 'text-[#1c2a21]', FOCUS_RING)}
    >
      <NwRefreshIcon className="size-[16px] shrink-0" />
      Shuffle
    </button>
    <button
      type="button"
      onClick={onClear}
      disabled={resolved}
      className={classNames(TOOL, 'text-[#1c2a21]', FOCUS_RING)}
    >
      <NwBackspaceArrowIcon className="size-[16px] shrink-0" />
      Clear
    </button>
    <button
      type="button"
      onClick={onHint}
      disabled={resolved || hintUsed}
      className={classNames(TOOL, 'text-[#8a6100]', FOCUS_RING)}
    >
      <NwBulbDuotoneIcon className="size-[16px] shrink-0" />
      {hintLabel}
    </button>
  </div>
);

export default WordToolsRow;
