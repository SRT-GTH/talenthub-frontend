/*
 * ChessClockCards — the two stat cards above the move list (Figma "clocks", 229 x 83 each, gap 12, r16, padding 14/18):
 * a dark #1c2a21 card (label #c1d4c4, value white) and a white card (label #595959, value #1c2a21). Value 32/38 600 ls -.32
 * (Playful Bricolage, Focused SF Pro). Props: dark { label, value }, light { label, value }.
 */
const VALUE =
  'font-sans text-[length:clamp(24px,2.2vw,32px)] leading-[1.19] font-semibold tracking-[-0.01em] playful:font-heading';

const ChessClockCards = ({ dark, light }) => (
  <div className="grid grid-cols-2 gap-[12px]">
    <div className="flex min-h-[83px] flex-col gap-[2px] rounded-[16px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#1c2a21] px-[18px] py-[14px]">
      <span className="font-sans text-[11px] leading-[13px] font-bold text-[#c1d4c4] max-lg:text-[12px]">
        {dark.label}
      </span>
      <span className={`${VALUE} text-white`}>{dark.value}</span>
    </div>
    <div className="flex min-h-[83px] flex-col gap-[2px] rounded-[16px] border border-solid border-[rgba(28,42,33,0.1)] bg-white px-[18px] py-[14px]">
      <span className="font-sans text-[11px] leading-[13px] font-bold text-[#595959] max-lg:text-[12px]">
        {light.label}
      </span>
      <span className={`${VALUE} text-[#1c2a21]`}>{light.value}</span>
    </div>
  </div>
);

export default ChessClockCards;
