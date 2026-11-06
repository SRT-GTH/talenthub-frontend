import { classNames } from '../../../../../utils/classNames.js';

/*
 * FieldChip — the 32 px pill chip of the Site copy editor (Figma "GTH · Chip · …": r999, 0 / 14 padding, 6 gap, 13 / 600 label).
 * tone: good "Edited" #ebf1ec / #2a5730 · warn "Draft changes (1)" / "Changed" #faf4e8 / #463409 · neutral "Default" / hints #f8f8f4 / #575755 ·
 * info "Used on every page" #eaeffb / #244a9f · dark "YouTube · 1:42" #1c2a21 / white · outline "Policy" white with a #e1eae2 ring · active "Active" #eaf3ec / #27522e.
 * Props: tone, icon (element drawn 14 px before the label), className, children.
 */
const TONES = {
  good: 'bg-[#ebf1ec] text-[#2a5730]',
  warn: 'bg-[#faf4e8] text-[#463409]',
  neutral: 'bg-[#f8f8f4] text-[#575755]',
  info: 'bg-[#eaeffb] text-[#244a9f]',
  dark: 'border border-solid border-[#1c2a21] bg-[#1c2a21] text-white',
  outline: 'border border-solid border-[#e1eae2] bg-white text-[#595959]',
  active: 'bg-[#eaf3ec] text-[#27522e]',
};

const FieldChip = ({ tone = 'neutral', icon = null, className, children }) => (
  <span
    className={classNames(
      'inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap',
      TONES[tone],
      className
    )}
  >
    {icon ? <span className="inline-flex size-[14px] shrink-0 items-center">{icon}</span> : null}
    {children}
  </span>
);

export default FieldChip;
