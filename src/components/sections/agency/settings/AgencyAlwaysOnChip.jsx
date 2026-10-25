import { AgencyLockIcon } from '../agencyIcons.jsx';

/* AgencyAlwaysOnChip — Figma "Chip · Always on" 8611:640: 109x32 white pill, 1px #e1eae2, lock 14 + "Always on" 13/600 #595959. */
const AgencyAlwaysOnChip = ({ children = 'Always on' }) => (
  <span className="inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#595959]">
    <AgencyLockIcon className="size-[14px]" />
    {children}
  </span>
);

export default AgencyAlwaysOnChip;
