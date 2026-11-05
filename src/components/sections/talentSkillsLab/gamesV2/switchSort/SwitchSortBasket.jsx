import { classNames } from '../../../../../utils/classNames.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import { SS_BASKETS } from './switchSortData.js';
import SwitchSortGlyph from './SwitchSortGlyph.jsx';
import { SwitchSortCrossIcon, SwitchSortTickIcon } from './SwitchSortIcons.jsx';

/*
 * SwitchSortBasket — one of the two baskets (Figma "basket · left" 9619:56519, "basket · right" 9619:56585; states: correct 9619:57429,
 * wrong 9619:59069). Drawn as a 300×41 pill carrying the key hint, with the colour / shape icons and the name hanging below it
 * (the Figma frame is fixed at 41px and the content overflows it — kept as drawn from `lg`; below `lg` the frame wraps the content).
 *   state 'idle' | 'correct' (green tint, 2.5px border, tick badge) | 'wrong' (red tint, cross badge)
 */
const FRAME_BASE = 'pointer-events-none absolute inset-x-0 max-lg:inset-y-0';
const FRAME_TONE = {
  idle: 'rounded-[18px] border border-solid border-[#dee5e0] bg-white shadow-[0_2px_6px_rgba(28,42,33,0.08)] playful:rounded-[24px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_5px_0_rgba(28,42,33,0.45)] lg:top-0 lg:h-[41px]',
  correct:
    'rounded-[18px] border-[2.5px] border-solid border-[#387440] bg-[#e2f1e4] playful:rounded-[24px] lg:-top-[2px] lg:h-[43px]',
  wrong:
    'rounded-[18px] border-[2.5px] border-solid border-[#c73326] bg-[#fcebe8] playful:rounded-[24px] lg:-top-[2px] lg:h-[43px]',
};

const SwitchSortBasket = ({ side, state = 'idle', onPick }) => {
  const basket = SS_BASKETS[side];
  const verdict = state === 'correct' ? 'Correct' : state === 'wrong' ? 'Wrong' : null;
  return (
    <button
      type="button"
      onClick={() => onPick(side)}
      aria-label={`${side === 'left' ? 'Left' : 'Right'} basket: ${basket.title}${verdict ? `. ${verdict}.` : ''}`}
      data-side={side}
      data-state={state}
      className={classNames(
        'group relative block w-full cursor-pointer rounded-[18px] bg-transparent p-0 text-center lg:h-[41px] playful:rounded-[24px]',
        FOCUS_RING
      )}
    >
      <span aria-hidden="true" className={classNames(FRAME_BASE, FRAME_TONE[state])} />
      <span className="relative flex flex-col items-center gap-[12px] pt-[14px] pb-[16px] lg:pt-[19px] lg:pb-0">
        <span
          aria-hidden="true"
          data-key={basket.key}
          className="inline-flex rounded-[6px] bg-[#f2f5f4] px-[8px] py-[2px] font-sans text-[12px] leading-[14px] font-bold text-[#6b6b6b] after:content-[attr(data-key)]"
        />
        <span className="flex items-center gap-[14px]" aria-hidden="true">
          <SwitchSortGlyph colour={basket.colour} shape="square" className="size-[40px]" />
          <span
            data-or="or"
            className="font-sans text-[13px] leading-[16px] font-medium text-[#6b706e] after:content-[attr(data-or)]"
          />
          <span
            className={`size-[40px] border-[3px] border-solid border-[#1c2a21] ${
              basket.shape === 'circle' ? 'rounded-full' : 'rounded-[5px]'
            }`}
          />
        </span>
        <span className="font-sans text-[16px] leading-[19px] font-bold text-[#1c2a21] max-lg:text-[14px]">
          {basket.title}
        </span>
      </span>
      {state !== 'idle' ? (
        <span
          aria-hidden="true"
          className={`absolute top-[10px] right-[10px] inline-flex size-[30px] items-center justify-center rounded-full text-white ${
            state === 'correct' ? 'bg-[#387440]' : 'bg-[#c73326]'
          }`}
        >
          {state === 'correct' ? (
            <SwitchSortTickIcon className="size-[18px]" />
          ) : (
            <SwitchSortCrossIcon className="size-[18px]" />
          )}
        </span>
      ) : null}
    </button>
  );
};

export default SwitchSortBasket;
