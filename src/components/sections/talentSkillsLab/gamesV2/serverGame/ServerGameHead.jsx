import { debug } from '../../../../../utils/debug.js';

const log = debug('ServerGameHead');

/*
 * ServerGameHead — the head block of the two "server" games (Figma "Body / head": eyebrow 11.5 · title 36 · prompt 15 ·
 * status pills + "Measures"/"Shows" chips, gap 10 / 8). Playful sets the title in Bricolage (`playful:font-heading`).
 *   eyebrow, title, body       strings
 *   stats    [{ icon, label }]  white pills (icon is a component)
 *   readLabel                   "Measures" | "Shows"
 *   reads    [string]           mint pills
 */
const PILL =
  'inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap max-lg:text-[12px]';

const ServerGameHead = ({ eyebrow, title, body, stats = [], readLabel, reads = [] }) => {
  log('render', { eyebrow, stats: stats.length, reads: reads.length });
  return (
    <header className="flex flex-col gap-[10px]">
      <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] uppercase max-lg:text-[12px]">
        {eyebrow}
      </p>
      <h2 className="m-0 font-sans text-[clamp(26px,2.08vw,36px)] leading-[1.19] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
        {title}
      </h2>
      <p className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]">{body}</p>
      <div className="flex flex-wrap items-center gap-[8px]">
        {stats.map((stat) => {
          const Glyph = stat.icon;
          return (
            <span key={stat.label} className={`${PILL} bg-white text-[#1c2a21]`}>
              <Glyph className="size-[14px] shrink-0 text-[#1c2a21]" />
              {stat.label}
            </span>
          );
        })}
        {reads.length ? (
          <>
            <span aria-hidden="true" className="w-[8px] max-sm:hidden" />
            <span className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959] max-lg:text-[12px]">
              {readLabel}
            </span>
            {reads.map((label) => (
              <span key={label} className={`${PILL} bg-[#ebf1ec] text-[#2a5730]`}>
                {label}
              </span>
            ))}
          </>
        ) : null}
      </div>
    </header>
  );
};

export default ServerGameHead;
