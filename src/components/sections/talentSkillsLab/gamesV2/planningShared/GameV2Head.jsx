import { debug } from '../../../../../utils/debug.js';

const log = debug('GameV2Head');

/*
 * GameV2Head — the head block above every planning / chess board (Figma "head" 1040x140, gap 10):
 *   eyebrow  11.5/14 700 uppercase ls .69 #387440
 *   title    36/43 600 (Playful Bricolage heading, Focused SF Pro)
 *   lead     15/22 400 #595959
 *   chips    "status + checks" row (gap 8): white ink@.12 pills with a 14px icon, a "Measures" label and green skill pills.
 * Props: eyebrow, title, lead, stats [{ icon, label }], measures [string].
 */
const STAT_CHIP =
  'inline-flex min-h-[30px] items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]';
const MEASURE_CHIP =
  'inline-flex min-h-[30px] items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#2a5730]';

const GameV2Head = ({ eyebrow, title, lead, stats = [], measures = [] }) => {
  log('render', { eyebrow, title, stats: stats.map((s) => s.label) });
  return (
    <header className="flex flex-col gap-[10px]">
      <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] uppercase max-lg:text-[12px]">
        {eyebrow}
      </p>
      <h1 className="m-0 font-sans text-[length:clamp(28px,2.9vw,36px)] leading-[1.2] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
        {title}
      </h1>
      <p className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]">{lead}</p>
      <div className="flex flex-wrap items-center gap-[8px]" aria-live="polite">
        {stats.map((stat) => {
          const Glyph = stat.icon;
          return (
            <span key={stat.label} className={STAT_CHIP}>
              <Glyph className="size-[14px] shrink-0" />
              {stat.label}
            </span>
          );
        })}
        {measures.length ? (
          <>
            <span className="ml-[8px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959]">
              Measures
            </span>
            {measures.map((m) => (
              <span key={m} className={MEASURE_CHIP}>
                {m}
              </span>
            ))}
          </>
        ) : null}
      </div>
    </header>
  );
};

export default GameV2Head;
