import { classNames } from '../../../../utils/classNames.js';

/*
 * InstitutionStatusChip — the small pill next to a row title (Figma "chip · Linked" (Active / Invited): Active = #387440 / #e7e7e7 11/700 with a check,
 * Invited = #faf4e8 / #785910, plus the nav "Admin" chip #faf4e8 / #c8951a and the "Request" / "Active" category chips #faf4e8 / #463409).
 * Props: tone active | invited | admin | note | quota, icon, children. 12px below lg.
 */
const TONES = {
  active:
    'gap-[6px] border border-[rgba(28,42,33,0.12)] bg-[#387440] px-[8px] font-bold text-[#e7e7e7]',
  invited:
    'gap-[6px] border border-[rgba(28,42,33,0.12)] bg-[#faf4e8] px-[8px] font-bold text-[#785910]',
  admin: 'bg-[#faf4e8] px-[7px] font-semibold text-[#c8951a]',
  note: 'bg-[#faf4e8] px-[7px] font-semibold text-[#463409]',
};

const InstitutionStatusChip = ({ tone = 'active', icon, className, children }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full py-[2px] text-[11px] leading-[13px] whitespace-nowrap max-lg:text-[12px]',
      TONES[tone],
      className
    )}
  >
    {icon}
    {children}
  </span>
);

export default InstitutionStatusChip;
