import { classNames } from '../../../../utils/classNames.js';

/* QueuePill — the small status pills in a list row (Figma "why you match" 8602:19351): amber (waiting / issued, 11/600) or green (kind, 11.5/600 #2d5d33). Props: tone amber|green, icon, children. */
const QueuePill = ({ tone = 'green', icon, children, className }) => (
  <span
    className={classNames(
      'inline-flex items-center gap-[4px] rounded-full border border-solid font-sans whitespace-nowrap',
      tone === 'amber'
        ? 'gap-[5px] border-[#c8951a] bg-[#faf4e8] px-[9px] py-[4px] text-[11px] max-lg:text-[12px] leading-[13px] font-semibold text-[#1c2a21]'
        : 'border-[#c1d4c4] bg-[#ebf1ec] py-[3px] pr-[8px] pl-[6px] text-[11.5px] max-lg:text-[12px] leading-[14px] font-semibold text-[#2d5d33]',
      className
    )}
  >
    {icon}
    {children}
  </span>
);

export default QueuePill;
