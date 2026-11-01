import { TR_COPY } from './threeInARowData.js';

/*
 * ThreeInARowMatchPanel — Kwaku + the match score (Figma "match panel" 9619:62668, 380 wide, padding 22, gap 16).
 *   Kwaku row (64px avatar · name · quote) · [thinking chip] · divider · "MATCH · BEST OF 3" · three score tiles · game chips · status line
 * Figma draws this card at a fixed 47px height with its content spilling out (and clipped by the frame, so the chips' second row and the
 * status line are cut off). Kept as one card that encloses its content; the copy, order and sizes are the drawn ones.
 */
const TILE =
  'flex flex-1 flex-col items-center gap-[4px] rounded-[14px] bg-[#f2f5f4] p-[12px] max-sm:px-[6px]';
const NUM =
  'font-sans text-[24px] leading-[29px] font-semibold text-[#1c2a21] playful:font-heading playful:text-[26px] playful:leading-[31px]';

const ThreeInARowMatchPanel = ({
  quote,
  thinking,
  score,
  chips,
  status,
  statusTone,
  animateDots,
}) => (
  <section
    aria-label="Match against Kwaku"
    className="flex w-[380px] max-w-full flex-col gap-[16px] rounded-[18px] border border-solid border-[#dee5e0] bg-white p-[22px] max-lg:w-full max-lg:max-w-[460px] max-sm:p-[16px] playful:rounded-[24px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_4px_0_rgba(28,42,33,0.45)]"
  >
    <div className="flex items-center gap-[14px]">
      <span
        aria-hidden="true"
        className="inline-flex size-[64px] shrink-0 items-center justify-center rounded-full bg-[#e0a526] font-sans text-[26px] leading-[31px] font-semibold text-[#1c2a21] playful:border-[1.5px] playful:border-solid playful:border-[rgba(28,42,33,0.55)] playful:font-heading playful:text-[28px] playful:leading-[34px]"
      >
        K
      </span>
      <div className="flex min-w-0 flex-col gap-[3px]">
        <p className="m-0 font-sans text-[17px] leading-[20px] font-bold text-[#1c2a21]">Kwaku</p>
        <p className="m-0 font-sans text-[13.5px] leading-[19px] text-[#6b6b6b]">{quote}</p>
      </div>
    </div>
    {thinking ? (
      <p
        role="status"
        className="m-0 inline-flex w-fit items-center gap-[8px] rounded-full bg-[#f2f5f4] px-[12px] py-[8px] font-sans text-[13px] leading-[16px] font-semibold text-[#6b6b6b] playful:border-[1.2px] playful:border-solid playful:border-[rgba(28,42,33,0.35)]"
      >
        <span aria-hidden="true" className="flex items-center gap-[8px]">
          {[0.6, 0.36, 0.18].map((alpha, i) => (
            <span
              key={alpha}
              className={`size-[8px] rounded-full ${animateDots ? 'motion-safe:animate-pulse' : ''}`}
              style={{
                background: `rgba(28,42,33,${alpha})`,
                animationDelay: `${i * 160}ms`,
              }}
            />
          ))}
        </span>
        {TR_COPY.thinkingChip}
      </p>
    ) : null}
    <hr className="m-0 h-px border-0 bg-[#dee5e0]" />
    <p className="m-0 font-sans text-[12px] leading-[14px] font-bold tracking-[0.06em] text-[#6b706e] uppercase">
      MATCH · BEST OF 3
    </p>
    <div className="flex gap-[10px]">
      {score.map((tile) => (
        <div key={tile.label} className={TILE}>
          <span className={NUM}>{tile.value}</span>
          <span className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#6b6b6b]">
            {tile.label}
          </span>
        </div>
      ))}
    </div>
    <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
      {chips.map((chip) => (
        <li
          key={chip}
          className="rounded-full bg-[#f2f5f4] px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold text-[#6b6b6b]"
        >
          {chip}
        </li>
      ))}
    </ul>
    <p
      className={`m-0 font-sans text-[14px] leading-[17px] font-semibold ${
        statusTone === 'muted' ? 'text-[#6b6b6b]' : 'text-[#27522e]'
      }`}
    >
      {status}
    </p>
  </section>
);

export default ThreeInARowMatchPanel;
