import { classNames } from '../../utils/classNames.js';

/*
 * ChoiceChips — a single-choice pill group of the parent dialogs (Figma "severity" 10034:5969, "reasons" 10033:6361, "who" / "what" 10057:1787 / 10057:1792): 32px pills, px14, 13/600 (12 below lg), 8px gap,
 * wrapping. Selected = ink #1c2a21 fill + white label; others = white with a #e1eae2 line and #595959 label. A radio group for assistive tech (role="radiogroup" / "radio", aria-checked).
 * Props: options [{ id, label }], value (the selected id; none selected when it matches no option), onChange(id), label (accessible name) or labelledBy (id of a visible label), className.
 * Used by parent/flags/FlagFieldDialog (severity) and parent/optout (opt-out reason, report who / what).
 */
const CHIP =
  'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] max-lg:text-[12px]';

const ChoiceChips = ({ options, value, onChange, label, labelledBy, className }) => (
  <div
    role="radiogroup"
    aria-label={labelledBy ? undefined : label}
    aria-labelledby={labelledBy}
    className={classNames('flex flex-wrap gap-[8px]', className)}
  >
    {options.map((o) => {
      const on = o.id === value;
      return (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(o.id)}
          className={classNames(
            CHIP,
            on
              ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
              : 'border-[#e1eae2] bg-white text-[#595959]'
          )}
        >
          {o.label}
        </button>
      );
    })}
  </div>
);

export default ChoiceChips;
