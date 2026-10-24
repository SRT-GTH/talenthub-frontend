import { classNames } from '../../../../utils/classNames.js';
import { formatCount, isSuppressed } from '../publicDataFormat.js';

/*
 * SuppressedValue — Figma "T8 · Suppressed value" (8488:955, used in the result bar of 8.2.3d "Filters · Fewer than 5") and the
 * legend row "Fewer than 5 · hidden" (8484:60, map legend).
 * The privacy rule in one component: any count under 5 reads "<5" and is never replaced by a real number.
 *
 * Props
 *   value    number | null   optional raw count. If it is suppressed (< 5) the chip prints "<5" (through formatCount); if it is NOT
 *                            suppressed the plain formatted number is printed instead (so the component is safe to use for any count).
 *   label    string          text to print when no `value` is given (default "<5").
 *   variant  'chip' | 'text'  chip = grey pill (#e4e4df, radius 6) with the info ring; text = the legend sentence style (13/16, #595959).
 *   title    string          tooltip + SR description, default "Fewer than 5 · hidden" (copy of the map legend).
 *   className
 * a11y: role="img" with the sentence as its name ("<5, fewer than 5 · hidden") so a screen reader never reads the glyph "<".
 * ⚠️ The Figma "info" layer of the chip is an empty 14px ring (no glyph is drawn inside it); it is reproduced as the ring only.
 */

const SuppressedValue = ({
  value,
  label = '<5',
  variant = 'chip',
  title = 'Fewer than 5 · hidden',
  className,
}) => {
  const printed = value === undefined ? label : formatCount(value);
  const hidden = value === undefined || isSuppressed(value);
  if (variant === 'text') {
    return (
      <span
        className={classNames(
          'font-sans text-[13px] leading-[16px] font-medium text-[#595959]',
          className
        )}
      >
        {title}
      </span>
    );
  }
  if (!hidden) {
    return (
      <span
        className={classNames(
          'font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]',
          className
        )}
      >
        {printed}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={`${printed}, ${title.charAt(0).toLowerCase()}${title.slice(1)}`}
      title={title}
      className={classNames(
        'inline-flex items-center gap-[6px] rounded-[6px] bg-[#e4e4df] py-[4px] pr-[8px] pl-[10px] font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]',
        className
      )}
    >
      <span aria-hidden="true">{printed}</span>
      <span
        aria-hidden="true"
        className="size-[14px] shrink-0 rounded-full border-[1.4px] border-solid border-[#70706e]"
      />
    </span>
  );
};

export default SuppressedValue;
