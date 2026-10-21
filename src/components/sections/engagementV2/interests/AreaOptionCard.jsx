import { FOCUS_RING, SHELF_ONLY } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';

/*
 * AreaOptionCard: one selectable area (Figma "Category · …": IN-01 grid 329x74 r18, IN-04 dialog 239x66 r16).
 * Props: area {id,label,icon}, selected, added (dialog: already in the list, dimmed, "Added" chip, not selectable),
 * disabled (limit reached), onToggle, variant 'page' | 'dialog'.
 * Selected look (dialog frame): #f5f9f5 face, green tile with white glyph, green checked box. The page frame draws no selected
 * state, so IN-01 reuses the dialog one.
 */
const AreaOptionCard = ({
  area,
  selected,
  added = false,
  disabled = false,
  onToggle,
  variant = 'page',
}) => {
  const Glyph = Icons[`${area.icon}Icon`];
  const dialog = variant === 'dialog';
  const inkBorder = `border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SHELF_ONLY}`;
  const face = added
    ? 'border-[#e7e7e7] bg-[#f7f8f4] opacity-60'
    : selected
      ? `bg-[#f5f9f5] ${inkBorder}`
      : dialog
        ? `bg-white ${inkBorder}`
        : 'border-[#e7e7e7] bg-white';
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={added || selected}
      aria-label={added ? `${area.label}, added` : area.label}
      disabled={added}
      aria-disabled={disabled && !selected ? true : undefined}
      onClick={() => onToggle?.(area.id)}
      className={`flex w-full min-w-0 cursor-pointer items-center border border-solid text-left ${FOCUS_RING} disabled:cursor-default ${
        dialog ? 'gap-[10px] rounded-[16px] p-[14px]' : 'gap-3 rounded-[18px] p-4'
      } ${face}`}
    >
      <span
        className={`grid shrink-0 place-items-center ${
          dialog
            ? 'size-[34px] rounded-[10px] text-[17px]'
            : 'size-[40px] rounded-[12px] text-[20px]'
        } ${selected ? 'bg-[#387440] text-white' : 'bg-[#ebf1ec] text-[#387440]'}`}
      >
        <Glyph />
      </span>
      <span
        className={`min-w-0 flex-1 font-sans font-semibold text-[#1c2a21] ${
          dialog ? 'text-[14px] leading-[18px]' : 'text-[15px] leading-[20px]'
        } max-lg:text-[14px]`}
      >
        {area.label}
      </span>
      {added ? (
        <span className="inline-flex shrink-0 items-center rounded-full border border-solid border-[#e7e7e7] bg-white px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] text-[#595959] max-lg:text-[12px]">
          Added
        </span>
      ) : (
        <span
          className={`grid shrink-0 place-items-center rounded-[6px] border-2 border-solid ${
            dialog ? 'size-[20px]' : 'size-[22px]'
          } ${selected ? 'border-[#387440] bg-[#387440] text-white' : 'border-[#babab7] bg-white'}`}
        >
          {selected ? <Icons.CheckIcon className="size-[15px]" /> : null}
        </span>
      )}
    </button>
  );
};

export default AreaOptionCard;
