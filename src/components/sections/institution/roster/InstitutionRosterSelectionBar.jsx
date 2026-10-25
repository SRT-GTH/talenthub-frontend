import { Roster20ArrowRightIcon } from './rosterIcons.jsx';

/*
 * InstitutionRosterSelectionBar — the dark bulk bar of the Not linked filter (Figma "Selection bar" 8744:434840, 1329 x 68, #1c2a21, r14, p 12/18, gap 14):
 * "6 selected" 14/17 600 white · Clear 14/17 500 white · green "Send reminder →" shelf button (156 x 44, p 10/18, r10, 14/24 600).
 * Props: count, onClear, onSend.
 */
const InstitutionRosterSelectionBar = ({ count, onClear, onSend }) => (
  <div
    role="region"
    aria-label="Selected students"
    className="flex items-center gap-[14px] rounded-[14px] bg-[#1c2a21] px-[18px] py-[12px]"
  >
    <p
      aria-live="polite"
      className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-white"
    >
      {count} selected
    </p>
    <div className="flex-1" />
    <button
      type="button"
      onClick={onClear}
      className="min-h-[24px] cursor-pointer border-0 bg-transparent px-[4px] font-sans text-[14px] leading-[17px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      Clear
    </button>
    <button
      type="button"
      onClick={onSend}
      disabled={count === 0}
      className="inline-flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-[3px] active:shadow-[0_1px_0_#2a5730] disabled:cursor-not-allowed disabled:opacity-50"
    >
      Send reminder
      <Roster20ArrowRightIcon className="size-[20px]" />
    </button>
  </div>
);

export default InstitutionRosterSelectionBar;
