/*
 * EditorKpiTile — one "T8 · KPI tile" of the Content Editor home (Figma 320 x 146, p24, gap 8, no fill): a 12/600 uppercase eyebrow (.72 tracking, #595959),
 * the 40/700 #2a5730 value and a 14/20 #595959 line. Props: eyebrow, value, sub.
 */
const EditorKpiTile = ({ eyebrow, value, sub }) => (
  <div className="flex min-w-0 flex-col gap-[8px] p-[clamp(16px,1.8vw,24px)] font-sans">
    <p className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase">
      {eyebrow}
    </p>
    <p className="m-0 text-[clamp(32px,3vw,40px)] leading-[1.2] font-bold text-[#2a5730]">
      {value}
    </p>
    <p className="m-0 text-[14px] leading-[20px] text-[#595959]">{sub}</p>
  </div>
);

export default EditorKpiTile;
