/*
 * RankChips — the "comparison strip" under the hero (Figma 8493:1765): caption "HOW GREATER ACCRA RANKS" (13/16 600 +0.78 #595959, caps) and
 * white pills (p 8/14, 1px #e7e7e7, gap 6): "#1" 14/17 700 #2a5730 + "for registrations" 14/17 500 #1c2a21. Wraps on narrow widths (the tablet frame
 * 8508:351373 draws a 4-column grid whose texts clip; here they wrap instead). Not drawn on phones.
 * Props: label, chips [{ rank, text }].
 */

const RankChips = ({ label, chips }) => (
  <section
    aria-label={label}
    className="flex flex-wrap items-center gap-[10px] font-sans max-md:hidden"
  >
    <h2 className="m-0 mr-[0px] text-[13px] leading-[16px] font-semibold tracking-[0.78px] text-[#595959] uppercase">
      {label}
    </h2>
    <ul className="m-0 flex list-none flex-wrap gap-[10px] p-0">
      {chips.map((c) => (
        <li
          key={c.text}
          className="flex items-center gap-[6px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[14px] py-[8px] text-[14px] leading-[17px]"
        >
          <span className="font-bold text-[#2a5730]">{`#${c.rank}`}</span>
          <span className="font-medium text-[#1c2a21]">{c.text}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default RankChips;
