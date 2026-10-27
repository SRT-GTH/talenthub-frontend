import { classNames } from '../../../../utils/classNames.js';

/*
 * RelationChips — the "Relationship" pill row (Figma "Chip · Son …": h32, px14, r999, 13/600). Selected = ink #1c2a21 face with white label; the others white with a #e1eae2 hairline and #595959 label.
 * Used by the search page (six chips, PW-07) and the link-code dialog (five, PW-07b). A radiogroup: one chip is selected at a time; clicking the selected chip keeps it.
 * Props: items [{ id, label }], value (id), onChange(id), label (accessible name), className.
 */
const RelationChips = ({ items, value, onChange, label = 'Relationship', className }) => (
  <div
    role="radiogroup"
    aria-label={label}
    className={classNames('flex flex-wrap gap-[8px]', className)}
  >
    {items.map((item) => {
      const on = item.id === value;
      return (
        <button
          key={item.id}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange?.(item.id)}
          className={classNames(
            'inline-flex h-[32px] cursor-pointer items-center justify-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
            on
              ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
              : 'border-brand-green-light-hover bg-white text-[#595959] hover:bg-brand-green-light'
          )}
        >
          {item.label}
        </button>
      );
    })}
  </div>
);

export default RelationChips;
