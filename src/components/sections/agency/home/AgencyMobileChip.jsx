import { classNames } from '../../../../utils/classNames.js';

/*
 * AgencyMobileChip — the 26 high pill of the phone home (Figma "Chip · …"): p 3/8, gap 4, r100, 12/20 500.
 * tone: ok (#e8f2ed / #165d3a) · warn (#faf4e8 / #463409) · mint (#ebf1ec / #2d5d33) · plain (white, 1px #dbded9, #111) · hot (#f9ebea / #902b20) · cool (#eaeffb / #244a9f).
 * Props: tone, icon (node), children, className.
 */

const TONES = {
  ok: 'bg-[#e8f2ed] text-[#165d3a]',
  warn: 'bg-[#faf4e8] text-[#463409]',
  mint: 'bg-[#ebf1ec] text-[#2d5d33]',
  plain: 'border border-solid border-[#dbded9] bg-white text-[#111111]',
  hot: 'bg-[#f9ebea] text-[#902b20]',
  cool: 'bg-[#eaeffb] text-[#244a9f]',
};

const AgencyMobileChip = ({ tone = 'plain', icon, children, className }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center gap-[4px] rounded-full px-[8px] py-[3px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px]',
      TONES[tone],
      className
    )}
  >
    {icon}
    {children}
  </span>
);

export default AgencyMobileChip;
