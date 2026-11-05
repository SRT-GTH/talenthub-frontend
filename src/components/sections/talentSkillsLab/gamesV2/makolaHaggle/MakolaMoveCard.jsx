import { classNames } from '../../../../../utils/classNames.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import { KeyTile, PickSticker } from '../../games/personality/PersonalityParts.jsx';
import { optionCardClass } from '../../games/personality/personalityStyles.js';

/*
 * MakolaMoveCard — one move (Figma "Move A": 512x72, r18, pad 16/18, gap 14; key tile 34 · title 16/19 semibold + sub 13.5/16 ·
 * 20px icon). Picked: mint fill, green stroke, lift, green key, sub in ink, and the Playful-only gold "YOUR PICK" sticker above
 * the top right corner. The key tile / sticker / card surface are the shared personality-game parts.
 */
const MakolaMoveCard = ({ letter, move, icon, picked, locked, onPick }) => {
  const Glyph = icon;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={picked}
      aria-keyshortcuts={`${letter} ${letter.charCodeAt(0) - 64}`}
      disabled={locked}
      onClick={onPick}
      className={classNames(
        'relative flex min-h-[71px] cursor-pointer items-center gap-[14px] rounded-[18px] px-[18px] py-[16px] font-sans disabled:cursor-default',
        optionCardClass(picked),
        FOCUS_RING
      )}
    >
      <KeyTile letter={letter} selected={picked} />
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
          {move.title}
        </span>
        <span
          className={classNames(
            'text-[13.5px] leading-[16px] font-normal',
            picked ? 'text-[#1c2a21]' : 'text-[#595959]'
          )}
        >
          {move.sub}
        </span>
      </span>
      <Glyph className="size-[20px] shrink-0 text-[#1c2a21]" />
      {picked ? (
        <PickSticker className="-top-[21px] max-md:right-[6px] md:-right-[22px]">
          YOUR PICK
        </PickSticker>
      ) : null}
    </button>
  );
};

export default MakolaMoveCard;
