import { classNames } from '../../../../utils/classNames.js';

/*
 * FilterChip — Figma "T8 · Filter chip" (component 8482:43; default 8487:345991 "Region ▾" 82x35, "Education level" 131x35, "Interest" 85x35,
 * "Age range" 101x35, "Gender" 84x35; ACTIVE variant 8489:90 "Region: Ashanti ✕" fill #387440, white text; mobile chips 8507:47 "Region ▾" 65x35).
 *   pill r100, gap 6, padding 8/12/8/14, 1px border #e7e7e7, white; label 14/17 500 #1c2a21; trail "▾" 11px 700 #595959
 *   active: fill + border #387440, label white, trail "✕" white 11px 700
 * Props
 *   label     string    text on the chip ("Region" or, when active, "Region: Ashanti")
 *   active    boolean   a value is selected (green pill with ✕)
 *   open      boolean   its menu is open (⚠️ ASSUMPTION: not drawn; a 2px #387440 ring, aria-expanded=true)
 *   disabled  boolean   ⚠️ ASSUMPTION: not drawn; 50% opacity, not focusable
 *   onClick   fn        toggles the menu / sheet. The chip is a button with aria-haspopup="listbox" (or "dialog" via `popup`)
 *   onClear   fn        the ✕ of an active chip (a second, separate button inside the pill so there are no nested buttons)
 *   clearLabel string   accessible name of the ✕ ("Clear Region filter")
 *   popup     'listbox' | 'dialog'
 *   controls  string    id of the menu element (aria-controls)
 *   buttonRef ref       ref of the main button (the menu returns focus to it)
 *   className
 */

const RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-[#387440]';

const FilterChip = ({
  label,
  active = false,
  open = false,
  disabled = false,
  onClick,
  onClear,
  clearLabel,
  popup = 'listbox',
  controls,
  buttonRef,
  className,
}) => (
  <div
    className={classNames(
      'inline-flex h-[35px] shrink-0 items-center gap-[6px] rounded-full border border-solid py-[8px] pr-[12px] pl-[14px] font-sans',
      active
        ? 'border-[#387440] bg-[#387440] text-white'
        : classNames(
            'bg-white text-[#1c2a21]',
            open ? 'border-[#387440] ring-2 ring-[#387440]/30' : 'border-[#e7e7e7]',
            !disabled && !open && 'hover:border-[#c1d4c4] hover:bg-[#f8f8f4]'
          ),
      disabled && 'opacity-50',
      className
    )}
  >
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-haspopup={popup}
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      className={classNames(
        'inline-flex min-h-[24px] items-center gap-[6px] rounded-full bg-transparent p-0 text-[14px] leading-[17px] font-medium whitespace-nowrap',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        active ? 'text-white' : 'text-[#1c2a21]',
        RING
      )}
    >
      {label}
      {!active && (
        <span
          aria-hidden="true"
          className="text-[length:var(--fs-11)] leading-[13px] font-bold text-[#595959]"
        >
          ▾
        </span>
      )}
    </button>
    {active && (
      <button
        type="button"
        onClick={onClear}
        aria-label={clearLabel ?? `Clear ${label} filter`}
        className={classNames(
          '-mx-[7px] inline-flex min-h-[24px] min-w-[24px] cursor-pointer items-center justify-center rounded-full bg-transparent p-0 text-[length:var(--fs-11)] leading-[13px] font-bold text-white',
          RING
        )}
      >
        <span aria-hidden="true">✕</span>
      </button>
    )}
  </div>
);

export default FilterChip;
