import { forwardRef } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import { MEMORY_COPY, MEMORY_SYMBOL_NAMES } from './memoryMatchData.js';
import { MEMORY_ICONS } from './memoryMatchIconMap.js';

/*
 * MemoryMatchCard — one card (Figma "card N · face down / open / matched", 96×96). Two faces on a flip: the GTH back and the
 * symbol front whose look follows the card state.
 *   found  #e2f1e4 at 75 %, icon #27522e          pair / up  white, icon #1c2a21         wrong  #fcebe8 + #c73326 border, icon #c73326
 * Playful: r16, 1.5px ink@.55 border, 4px hard shelf (ink@.20 found, ink@.45 otherwise), back #387440.
 * Focused: r12, no border / shelf, open = 2px #387440 ring, back #27522e.
 * `reveal` false = the back is up. The flip is a 0.3s rotateY (skipped under prefers-reduced-motion).
 */
const SHELF = 'playful:border-[1.5px] playful:border-solid playful:border-[rgba(28,42,33,0.55)]';
const BACK = classNames(
  'bg-[#27522e] playful:bg-[#387440] shadow-none playful:shadow-[0_4px_0_rgba(28,42,33,0.45)]',
  SHELF
);
const FRONT = {
  found: classNames(
    'bg-[#e2f1e4] text-[#27522e] opacity-75 playful:shadow-[0_4px_0_rgba(28,42,33,0.2)]',
    SHELF
  ),
  open: classNames(
    'bg-white text-[#1c2a21] border-2 border-solid border-[#387440] playful:shadow-[0_4px_0_rgba(28,42,33,0.45)]',
    'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]'
  ),
  wrong:
    'bg-[#fcebe8] text-[#c73326] border-2 border-solid border-[#c73326] playful:border-[2.5px] playful:shadow-[0_4px_0_rgba(28,42,33,0.45)]',
};

const MemoryMatchCard = forwardRef(function MemoryMatchCard(
  { card, row, col, tabbable, dimmed, onFlip, onKeyDown },
  ref
) {
  const Face = MEMORY_ICONS[card.sym];
  const revealed = card.state !== 'down';
  const tone = card.state === 'found' ? 'found' : card.state === 'wrong' ? 'wrong' : 'open';
  const name = MEMORY_SYMBOL_NAMES[card.sym];
  const label = !revealed
    ? `Card, row ${row}, column ${col}, face down`
    : `${name}, row ${row}, column ${col}${
        card.state === 'found' ? ', matched' : card.state === 'wrong' ? ', not a match' : ''
      }`;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-disabled={revealed || dimmed ? 'true' : undefined}
      tabIndex={tabbable ? 0 : -1}
      data-state={card.state}
      onClick={() => onFlip(card.id)}
      onKeyDown={(e) => onKeyDown(e, card.id)}
      className={classNames(
        'group relative aspect-square w-full min-w-0 cursor-pointer rounded-[12px] border-0 bg-transparent p-0 playful:rounded-[16px] [perspective:600px]',
        revealed || dimmed ? 'cursor-default' : '',
        FOCUS_RING
      )}
    >
      <span
        className={classNames(
          'absolute inset-0 block [transform-style:preserve-3d] motion-safe:transition-transform motion-safe:duration-300',
          revealed ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            'absolute inset-0 flex items-center justify-center rounded-[12px] [backface-visibility:hidden] playful:rounded-[16px]',
            BACK
          )}
        >
          <span className="font-sans text-[15px] leading-[18px] font-bold text-white/55 max-sm:text-[12px]">
            {MEMORY_COPY.faceDown}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={classNames(
            'absolute inset-0 flex items-center justify-center rounded-[12px] [backface-visibility:hidden] [transform:rotateY(180deg)] playful:rounded-[16px]',
            FRONT[tone]
          )}
        >
          <Face className="size-1/2" />
        </span>
      </span>
    </button>
  );
});

export default MemoryMatchCard;
