import { debug } from '../../../../../utils/debug.js';
import { GridClockIcon, GridSavedIcon } from './GridGlyphs.jsx';

const log = debug('GridHead');

/*
 * GridHead — the "head" of the Grid Logic / Sum Grid play frames (Figma "head" 1040x140, gap 10):
 *   eyebrow  "INTERMEDIATE · 6×6"        11.5/700 +0.06em #387440
 *   title    "Fill the grid."            36/600 (Playful Bricolage, Focused SF Pro Rounded), -0.01em
 *   intro    15/22 #595959
 *   chips    clock chip ("7:40 so far" / "6:48 total") · "Saved as you go" (omitted when solved) · "Measures" + 3 skill chips
 * Chip row: 30px high pills (white, 1px ink@.12; skills #ebf1ec / #2a5730), gap 8; the "Measures" label has an 8px spacer before it.
 */
const CHIP =
  'inline-flex min-h-[30px] items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21] max-lg:text-[12px]';
const SKILL_CHIP =
  'inline-flex min-h-[30px] items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#2a5730] max-lg:text-[12px]';

const GridHead = ({ eyebrow, title, intro, clockLabel, showSaved = true, measures }) => {
  log('render', { eyebrow, title, clockLabel, showSaved });
  return (
    <div className="flex flex-col gap-[10px]">
      <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.06em] text-[#387440] max-lg:text-[12px]">
        {eyebrow}
      </p>
      <h2 className="m-0 font-sans text-[clamp(26px,2.1vw,36px)] leading-[1.2] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
        {title}
      </h2>
      <p className="m-0 max-w-[720px] font-sans text-[15px] leading-[22px] font-normal text-[#595959]">
        {intro}
      </p>
      <div className="flex flex-wrap items-center gap-[8px]">
        <span className={CHIP}>
          <GridClockIcon className="size-[14px] shrink-0" />
          {clockLabel}
        </span>
        {showSaved ? (
          <span className={CHIP}>
            <GridSavedIcon className="size-[14px] shrink-0" />
            Saved as you go
          </span>
        ) : null}
        <span className="ml-[16px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959] max-lg:text-[12px]">
          Measures
        </span>
        {measures.map((m) => (
          <span key={m} className={SKILL_CHIP}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GridHead;
