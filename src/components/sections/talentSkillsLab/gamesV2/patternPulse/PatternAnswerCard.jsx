import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import NumbersWordsDashedFrame from '../numbersWords/NumbersWordsDashedFrame.jsx';
import { NwCheckMarkIcon, NwCloseMarkIcon } from '../numbersWords/NumbersWordsIcons.jsx';

const log = debug('PatternAnswerCard');

/*
 * PatternAnswerCard — one of the four answer cards (Figma "answer · 16" 180x96, radius 20 Playful / 14 Focused, number 38 / 36,
 * the "shortcut" chip top-left shows the key 1-4). `tone`:
 *   idle     white · Playful 1.5px ink@.55 + 0 5 0 ink@.45 shelf · Focused 1px #dee5e0 + soft 0 2 6
 *   dim      other cards once an answer is in (PP-02 / PP-03): number #6b706e, border #dee5e0, Playful shelf ink@.15, Focused flat
 *   sending  the pressed card while "Checking your answer…": #1c2a21 fill, white number, white chip, three pulsing dots
 *   correct  #e2f1e4 · 2.5px #387440 · number #27522e · green check mark         (Playful shelf #387440@.45)
 *   wrong    #fcebe8 · 2.5px #c73326 · number #c73326 · red cross mark            (Playful shelf #c73326@.45)
 *   reveal   the right card after a miss: white · dashed 2.5px #387440 [6 4] · number #27522e (Playful shelf ink@.45)
 */
const TONES = {
  idle: {
    box: 'bg-white border border-solid border-[#dee5e0] shadow-[0_2px_6px_rgba(28,42,33,0.06)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_5px_0_rgba(28,42,33,0.45)]',
    number: 'text-[#1c2a21]',
    chip: 'bg-[#f2f5f4] text-[#6b6b6b]',
  },
  dim: {
    box: 'bg-white border border-solid border-[#dee5e0] playful:border-[1.5px] playful:shadow-[0_5px_0_rgba(28,42,33,0.15)]',
    number: 'text-[#6b706e]',
    chip: 'bg-[#f2f5f4] text-[#6b6b6b]',
  },
  sending: {
    box: 'bg-[#1c2a21] border border-solid border-[#1c2a21] playful:border-[1.5px]',
    number: 'text-white',
    chip: 'bg-white text-[#1c2a21]',
  },
  correct: {
    box: 'bg-[#e2f1e4] border-[2.5px] border-solid border-[#387440] playful:shadow-[0_5px_0_rgba(56,116,64,0.45)]',
    number: 'text-[#27522e]',
    chip: 'bg-[#f2f5f4] text-[#6b6b6b]',
  },
  wrong: {
    box: 'bg-[#fcebe8] border-[2.5px] border-solid border-[#c73326] playful:shadow-[0_5px_0_rgba(199,51,38,0.45)]',
    number: 'text-[#c73326]',
    chip: 'bg-[#f2f5f4] text-[#6b6b6b]',
  },
  reveal: {
    box: 'bg-white playful:shadow-[0_5px_0_rgba(28,42,33,0.45)]',
    number: 'text-[#27522e]',
    chip: 'bg-[#f2f5f4] text-[#6b6b6b]',
  },
};

const PatternAnswerCard = ({ index, value, tone, disabled, onPick }) => {
  const style = TONES[tone];
  log('render', { index, value, tone });
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPick(index)}
      aria-label={`Answer ${index + 1}: ${value}${tone === 'correct' ? ', correct' : ''}${tone === 'wrong' ? ', not right' : ''}${tone === 'reveal' ? ', the right answer' : ''}`}
      data-tone={tone}
      className={classNames(
        'relative flex min-h-[84px] items-center justify-center rounded-[14px] enabled:cursor-pointer disabled:cursor-default sm:h-[96px] playful:rounded-[20px]',
        style.box,
        FOCUS_RING
      )}
    >
      {tone === 'reveal' ? (
        <NumbersWordsDashedFrame
          strokeWidth={2.5}
          dash="6 4"
          radius={14}
          className="text-[#387440]"
        />
      ) : null}
      {/* the key hint is generated content so the button's text is the answer alone (responsive audit: no wrapped labels) */}
      <span
        aria-hidden="true"
        data-key={index + 1}
        className={classNames(
          'absolute top-[10px] left-[12px] inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-[6px] px-[7px] font-sans text-[12px] leading-[14px] font-bold after:content-[attr(data-key)]',
          style.chip
        )}
      />
      <span
        className={classNames(
          'font-sans text-[clamp(28px,7vw,36px)] leading-[1.2] font-semibold playful:font-heading playful:text-[clamp(28px,7.4vw,38px)]',
          style.number
        )}
      >
        {value}
      </span>
      {tone === 'sending' ? (
        <span
          aria-hidden="true"
          className="absolute top-[14px] right-[14px] flex items-center gap-[4px]"
        >
          <span className="size-[6px] rounded-full bg-white motion-safe:animate-pulse" />
          <span className="size-[6px] rounded-full bg-white/60 motion-safe:animate-pulse [animation-delay:150ms]" />
          <span className="size-[6px] rounded-full bg-white/30 motion-safe:animate-pulse [animation-delay:300ms]" />
        </span>
      ) : null}
      {tone === 'correct' || tone === 'wrong' ? (
        <span
          aria-hidden="true"
          className={classNames(
            'absolute top-[10px] right-[12px] inline-flex size-[22px] items-center justify-center rounded-full text-white',
            tone === 'correct' ? 'bg-[#387440]' : 'bg-[#c73326]'
          )}
        >
          {tone === 'correct' ? (
            <NwCheckMarkIcon className="size-[14px]" />
          ) : (
            <NwCloseMarkIcon className="size-[14px]" />
          )}
        </span>
      ) : null}
    </button>
  );
};

export default PatternAnswerCard;
