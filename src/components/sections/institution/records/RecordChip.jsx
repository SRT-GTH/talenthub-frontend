import { classNames } from '../../../../utils/classNames.js';

/* RecordChip — the 32px pill chip of the profile (Figma "Chip · …" 8158:2188): icon 14 + 13/600 label; tone green (#ebf1ec, border #c1d4c4, #387440) or plain (white, border #e1eae2, #595959). Props: icon, tone, children. */
const RecordChip = ({ icon, tone = 'plain', children }) => (
  <span
    className={classNames(
      'inline-flex h-[32px] items-center gap-[6px] rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap',
      tone === 'green'
        ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        : 'border-[#e1eae2] bg-white text-[#595959]'
    )}
  >
    {icon ? (
      <span className="size-[14px] shrink-0 text-[#387440] [&_svg]:size-full">{icon}</span>
    ) : null}
    {children}
  </span>
);

export default RecordChip;
