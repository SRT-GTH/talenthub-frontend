import { classNames } from '../../../../utils/classNames.js';

/*
 * MapKeyboardHint — the "keyboard hint" strip of Figma 8.2.2c (8489:346386, 436x32: white, 1px #e7e7e7, r10, p 8/12, gap 8, 12/14):
 *   Tab or ← → move between regions · Enter opens the region · Esc closes
 * (keys 700 #1c2a21, words 400 #595959). Copy verbatim from the frame, including its wording "opens the region".
 * ⚠️ Behaviour note: in this build Enter PINS the expanded card (the card holds the "View <region> details →" link), as the pointer click does;
 * the strip keeps the Figma wording. Reported to the lead as a Figma inconsistency (8.2.2b says click pins, 8.2.2c says Enter opens).
 * Props: className. Shown by RegionalMapCard while a keyboard user is on the map.
 */

const Key = ({ children }) => <span className="font-bold text-[#1c2a21]">{children}</span>;

const MapKeyboardHint = ({ className }) => (
  <p
    className={classNames(
      'm-0 inline-flex w-fit max-w-full flex-wrap items-center gap-x-[8px] gap-y-[2px] rounded-[10px] border border-solid border-[#e7e7e7] bg-white px-[12px] py-[8px] font-sans text-[12px] leading-[14px] font-normal text-[#595959]',
      className
    )}
  >
    <Key>Tab</Key>
    <span>or</span>
    <Key>← →</Key>
    <span>move between regions ·</span>
    <Key>Enter</Key>
    <span>opens the region ·</span>
    <Key>Esc</Key>
    <span>closes</span>
  </p>
);

export default MapKeyboardHint;
