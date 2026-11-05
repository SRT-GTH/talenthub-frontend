import { classNames } from '../../../../../utils/classNames.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import NumbersWordsDashedFrame from '../numbersWords/NumbersWordsDashedFrame.jsx';
import { NwLockIcon } from '../numbersWords/NumbersWordsIcons.jsx';

/*
 * WordTile — one letter tile of Word Shuffle (Figma "tile · M": 80px in the answer row, 64px in the tray; the size comes from the
 * row's `--t`). Letter 38.4 / 30.72 Bricolage (Playful), 36.4 / 28.72 SF Pro (Focused) = .48 / .455 of the tile.
 *   normal  #ebd3a6 · Playful 1.5px ink@.55, radius 14, hard 0 5 0 #7a5a2e shelf + white@.5 top highlight · Focused 1px #b98a4b, radius 10, soft shadow
 *   hint    the hint-locked first letter: #fef8ec · 2.5px #8a6100 · letter #8a6100 · white lock badge (top-right)
 *   bad     wrong guess: #fcebe8 · 2.5px #c73326 · letter #c73326
 *   ok      right word: #e2f1e4 · 2.5px #387440 · letter #27522e
 *   empty   unfilled answer slot: white, dashed 1.5px ink@.30
 *   used    tray slot whose tile sits in the answer row: #f2f5f4 · 1.5px #dee5e0 (Focused 1px), no letter
 * With `onClick` it is a real button (tray: add the letter; answer row: take it back).
 */
const TONES = {
  normal:
    'bg-[#ebd3a6] border border-solid border-[#b98a4b] shadow-[0_2px_6px_rgba(28,42,33,0.08)] text-[#1c2a21] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_5px_0_#7a5a2e,inset_0_2px_0_rgba(255,255,255,0.5)]',
  hint: 'bg-[#fef8ec] border-[2.5px] border-solid border-[#8a6100] text-[#8a6100]',
  bad: 'bg-[#fcebe8] border-[2.5px] border-solid border-[#c73326] text-[#c73326]',
  ok: 'bg-[#e2f1e4] border-[2.5px] border-solid border-[#387440] text-[#27522e]',
  empty: 'bg-white',
  used: 'bg-[#f2f5f4] border border-solid border-[#dee5e0] playful:border-[1.5px]',
};

const WordTile = ({ letter, tone, onClick, label, disabled, className }) => {
  const Tag = onClick ? 'button' : 'div';
  const interactive = onClick
    ? { type: 'button', onClick, disabled, 'aria-label': label ?? letter }
    : { 'aria-hidden': tone === 'empty' || tone === 'used' ? 'true' : undefined };
  return (
    <Tag
      {...interactive}
      data-tone={tone}
      className={classNames(
        'relative flex shrink-0 items-center justify-center rounded-[10px] playful:rounded-[14px]',
        TONES[tone],
        onClick ? classNames('cursor-pointer disabled:cursor-default', FOCUS_RING) : '',
        className
      )}
      style={{ width: 'var(--t)', height: 'var(--t)' }}
    >
      {tone === 'empty' ? (
        <NumbersWordsDashedFrame
          strokeWidth={1.5}
          dash="5 5"
          radius={12}
          className="text-[#dee5e0] [stroke-width:1] playful:text-[rgba(28,42,33,0.3)] playful:[stroke-width:1.5]"
        />
      ) : null}
      {letter ? (
        <span className="font-sans text-[max(14px,calc(var(--t)*0.455))] leading-none font-semibold playful:font-heading playful:text-[max(14px,calc(var(--t)*0.48))]">
          {letter}
        </span>
      ) : null}
      {tone === 'hint' ? (
        <span
          data-testid="ws-lock"
          className="absolute top-[4px] right-[4px] inline-flex size-[18px] items-center justify-center rounded-full bg-white text-[#8a6100]"
        >
          <NwLockIcon className="size-[12px]" />
        </span>
      ) : null}
    </Tag>
  );
};

export default WordTile;
