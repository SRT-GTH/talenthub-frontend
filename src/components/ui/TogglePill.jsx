import { classNames } from '../../utils/classNames.js';

/*
 * TogglePill — a multi-select pill button (Figma "Chip · Mid-level" selected / "Pill · …" unselected in the More filters drawer 10102:40554).
 * Unselected: white, 1px #dbded9 line, 14/500 #111, 8px 16px padding. Selected: #ebf1ec fill, 1.5px #387440 border, #2a5730 label and the 2px #224626 shelf shadow.
 * Props: selected, onClick, children, className. Exposes aria-pressed; a 40px-high target.
 */
const TogglePill = ({ selected = false, onClick, className, children, ...rest }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={classNames(
      'inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-full px-[16px] py-[7px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      selected
        ? 'border-[1.5px] border-solid border-[#387440] bg-[#ebf1ec] text-[#2a5730] shadow-[0_2px_0_rgba(34,70,38,0.8)]'
        : 'border border-solid border-[#dbded9] bg-white text-[#111]',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default TogglePill;
