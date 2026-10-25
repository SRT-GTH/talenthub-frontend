import { classNames } from '../../../../utils/classNames.js';

/*
 * InstitutionRecordChip — the 32 high pill of the student record (Figma "Chip · …": px 14 (icon 12), gap 6, r999, 1px, 13/16 600).
 * tone: 'plain' (white, #e1eae2, #595959) · 'green' (#ebf1ec, #c1d4c4, #387440). Props: icon (node, 14), tone, children, className.
 */
const InstitutionRecordChip = ({ icon, tone = 'plain', children, className }) => (
  <span
    className={classNames(
      'inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap',
      icon && 'pl-[12px]',
      tone === 'green'
        ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        : 'border-[#e1eae2] bg-white text-[#595959]',
      className
    )}
  >
    {icon}
    {children}
  </span>
);

export default InstitutionRecordChip;
