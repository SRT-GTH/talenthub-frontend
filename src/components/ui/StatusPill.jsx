import { classNames } from '../../utils/classNames.js';

/*
 * StatusPill — the status pill used on row and header titles (Figma "Chip · Active" 10033:5737, "chip · Opted out" 10033:5730, "Chip · Pending link" 10033:5747).
 * tone: 'active' (green on #ebf1ec, h32, 13/600) | 'pending' (white, line border, h32) | 'opted' (red on #f9ebea, 12/600, no fixed height).
 * Props: tone, className, children. For the 11px agency chip see AgencyStatusChip; both could fold into one component once the agency flows are settled.
 */
const TONES = {
  active:
    'h-[32px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] text-[#387440]',
  pending:
    'h-[32px] border border-solid border-[#e1eae2] bg-white px-[14px] text-[13px] text-[#595959]',
  opted: 'bg-[#f9ebea] px-[10px] py-[4px] text-[12px] text-[#c0392b]',
};

const StatusPill = ({ tone = 'active', className, children }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center gap-[6px] rounded-full font-sans leading-normal font-semibold whitespace-nowrap',
      TONES[tone] ?? TONES.active,
      className
    )}
  >
    {children}
  </span>
);

export default StatusPill;
