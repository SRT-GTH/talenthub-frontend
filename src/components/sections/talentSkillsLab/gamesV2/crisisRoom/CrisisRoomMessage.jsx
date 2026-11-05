import { classNames } from '../../../../../utils/classNames.js';
import { FOCUS_RING } from '../../labPlayStyles.js';

/*
 * CrisisRoomMessage — one "Your first message to the team" card (Figma "msg A": 510 wide, r16, pad 14/16, gap 12; letter key 25x20
 * r8 + 14.5/21 medium quote). Picked: mint fill, green 1.5px stroke (Focused 1px), soft green lift, green key with white letter.
 */
const CrisisRoomMessage = ({ letter, text, picked, locked, onPick }) => (
  <button
    type="button"
    role="radio"
    aria-checked={picked}
    disabled={locked}
    onClick={() => onPick(letter)}
    className={classNames(
      'flex w-full items-start gap-[12px] rounded-[16px] border border-solid px-[16px] py-[14px] text-left font-sans transition-[background-color,box-shadow,border-color] duration-150 enabled:cursor-pointer disabled:cursor-default',
      picked
        ? 'border-[#387440] bg-[#ebf1ec] shadow-[0_6px_16px_rgba(56,116,64,0.16)] playful:border-[1.5px]'
        : 'border-[rgba(28,42,33,0.12)] bg-white enabled:hover:border-[rgba(28,42,33,0.3)]',
      FOCUS_RING
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'inline-flex h-[20px] min-w-[24px] shrink-0 items-center justify-center rounded-[8px] px-[8px] text-[12px] leading-[14px] font-bold',
        picked ? 'bg-[#387440] text-white' : 'bg-[#f8f8f4] text-[#1c2a21]'
      )}
    >
      {letter}
    </span>
    <span className="min-w-0 text-[14.5px] leading-[21px] font-medium text-[#1c2a21]">{text}</span>
  </button>
);

export default CrisisRoomMessage;
