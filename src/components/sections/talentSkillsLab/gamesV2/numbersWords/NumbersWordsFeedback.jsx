import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { NwBulbDuotoneIcon, NwCheckCircleDuotoneIcon, NwCrossIcon } from './NumbersWordsIcons.jsx';

const log = debug('NumbersWordsFeedback');

/*
 * NumbersWordsFeedback — Figma "GTH · Game feedback" pill (46 high, gap 10, padding 10/18/10/14, radius 999) inside the 68px
 * "feedback slot". Playful: 1.2px ink@.35 border + hard 0 3 ink@.25 shadow. Focused: flat fill, no border / shadow (44 high).
 *   tone  ok   #e2f1e4 · text #27522e · check circle       "The jump grows by 1 each time." / "Midwife. Well done."
 *         info #e5f0fa · text #2966b0 · bulb               "Hint: it starts with M." / the rule after a miss
 *         bad  #fcebe8 · text #c73326 · cross              "Not quite. You have one more try."
 * The slot keeps its 68px even when empty so nothing below it jumps (Figma draws the empty slot in the thinking states).
 */
const TONES = {
  ok: { box: 'bg-[#e2f1e4] text-[#27522e]', Icon: NwCheckCircleDuotoneIcon },
  info: { box: 'bg-[#e5f0fa] text-[#2966b0]', Icon: NwBulbDuotoneIcon },
  bad: { box: 'bg-[#fcebe8] text-[#c73326]', Icon: NwCrossIcon },
};

const NumbersWordsFeedback = ({ tone, message, className }) => {
  const entry = tone ? TONES[tone] : null;
  const Glyph = entry?.Icon;
  log('render', { tone, message });
  return (
    <div
      aria-live="polite"
      className={classNames('flex min-h-[68px] items-center justify-center py-[11px]', className)}
    >
      {entry ? (
        <p
          className={classNames(
            'm-0 inline-flex max-w-full items-center gap-[10px] rounded-full py-[10px] pr-[18px] pl-[14px] font-sans text-[14px] leading-[17px] font-semibold max-lg:text-[12px]',
            entry.box,
            'playful:border-[1.2px] playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:shadow-[0_3px_0_rgba(28,42,33,0.25)]'
          )}
        >
          <span className="inline-flex size-[24px] shrink-0 items-center justify-center rounded-full bg-white">
            <Glyph className="size-[16px]" />
          </span>
          {message}
        </p>
      ) : null}
    </div>
  );
};

export default NumbersWordsFeedback;
