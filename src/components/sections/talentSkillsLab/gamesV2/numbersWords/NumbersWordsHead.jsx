import { debug } from '../../../../../utils/debug.js';

const log = debug('NumbersWordsHead');

/*
 * NumbersWordsHead — the head of every Pattern Pulse / Word Shuffle frame (Figma "head" 1040x140, gap 10):
 *   eyebrow  "ROUND 4 · INTERMEDIATE"  11.5/14 700, tracking .69, #387440
 *   title    36/43, Bricolage (Playful) / SF Pro (Focused), tracking -.36
 *   sub      15/22 #595959
 *   chips    status pills (white, ink .12 hairline) · "Measures" · skill chips (#ebf1ec / #2a5730)
 * `stats`  [{ icon: Component, label }]   `measures` ['Pattern recognition', …]
 */
const STAT_PILL =
  'inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#1c2a21] max-lg:text-[12px]';
const SKILL_PILL =
  'inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#2a5730] max-lg:text-[12px]';

const NumbersWordsHead = ({ eyebrow, title, sub, stats, measures }) => {
  log('render', { eyebrow, title, sub, stats: stats.map((s) => s.label) });
  return (
    <header className="flex flex-col gap-[10px]">
      <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] max-lg:text-[12px]">
        {eyebrow}
      </p>
      <h2 className="m-0 font-sans text-[clamp(26px,5.6vw,36px)] leading-[1.19] font-semibold tracking-[-0.36px] text-[#1c2a21] playful:font-heading">
        {title}
      </h2>
      <p
        aria-live="polite"
        className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]"
      >
        {sub}
      </p>
      <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[8px]">
        {stats.map((stat) => {
          const Glyph = stat.icon;
          return (
            <span key={stat.label} className={STAT_PILL}>
              <Glyph className="size-[14px] shrink-0" />
              {stat.label}
            </span>
          );
        })}
        <span className="ml-[8px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959] max-lg:text-[12px]">
          Measures
        </span>
        {measures.map((label) => (
          <span key={label} className={SKILL_PILL}>
            {label}
          </span>
        ))}
      </div>
    </header>
  );
};

export default NumbersWordsHead;
