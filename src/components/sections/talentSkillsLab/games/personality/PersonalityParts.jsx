import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';

import { INK_HAIR } from './personalityStyles.js';

const log = debug('PersonalityParts');

/*
 * PersonalityParts — small pieces repeated by every personality game body (Figma "Body" instance inside SL-GP03 … GP12).
 *
 *   <GameIntro eyebrow title:[plain, accent] body stats:[{icon,label}] reads:[label]/>
 *       eyebrow ("ROUND 2 · SOCIAL"), 36px title whose last words are green, grey intro line, white status chips, then
 *       "Reads" + green trait chips (the traits this game measures).
 *   <KeyTile letter selected/>      the 34px letter box used by option cards (A/B/C/D)
 *   <PickSticker>YOUR PICK</PickSticker>   Playful-only gold sticker pinned to a selected card
 *   (class helpers live in personalityStyles.js)  optionCardClass(selected): class string: white card + ink hairline / selected = mint fill + green stroke + soft green lift
 *
 * Focused = 1px hairlines + soft shadows; Playful = 1.5px ink strokes + stickers (all through `playful:` variants).
 */

export const StatChip = ({ icon, children, tone = 'plain' }) => {
  const Glyph = icon;
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-[6px] rounded-full px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap max-lg:text-[12px]',
        INK_HAIR,
        tone === 'read' ? 'bg-[#ebf1ec] text-[#2a5730]' : 'bg-white text-[#1c2a21]'
      )}
    >
      {Glyph ? <Glyph className="size-[14px] shrink-0 text-[#1c2a21]" /> : null}
      {children}
    </span>
  );
};

export const GameIntro = ({ eyebrow, title, body, stats = [], reads = [] }) => {
  log('render', { eyebrow });
  const [plain, accent] = title;
  return (
    <header className="flex flex-col gap-[10px]">
      <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] uppercase max-lg:text-[12px]">
        {eyebrow}
      </p>
      <h2 className="m-0 font-sans text-[clamp(26px,2.08vw,36px)] leading-[1.19] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
        {plain}
        {accent ? <span className="text-[#387440]">{accent}</span> : null}
      </h2>
      <p className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]">{body}</p>
      <div className="flex flex-wrap items-center gap-[8px]">
        {stats.map((stat) => (
          <StatChip key={stat.label} icon={stat.icon}>
            {stat.label}
          </StatChip>
        ))}
        {reads.length ? (
          <>
            <span aria-hidden="true" className="w-[8px] max-sm:hidden" />
            <span className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959]">
              Reads
            </span>
            {reads.map((label) => (
              <StatChip key={label} tone="read">
                {label}
              </StatChip>
            ))}
          </>
        ) : null}
      </div>
    </header>
  );
};

export const KeyTile = ({ letter, selected, className }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px] border border-solid font-sans text-[14px] leading-[17px] font-bold playful:border-[1.5px]',
      selected
        ? 'border-[rgba(28,42,33,0.12)] bg-[#387440] text-white playful:border-[#1c2a21]'
        : 'border-[rgba(28,42,33,0.12)] bg-[#f8f8f4] text-[#1c2a21] playful:border-[#1c2a21]',
      className
    )}
  >
    {letter}
  </span>
);

export const PickSticker = ({ children, className }) => (
  <span
    data-sticker=""
    className={classNames(
      'pointer-events-none absolute hidden -rotate-[6deg] rounded-full border-[1.5px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[11px] leading-[13px] font-bold whitespace-nowrap text-[#1c2a21] max-lg:text-[12px] playful:inline-block',
      className
    )}
  >
    {children}
  </span>
);
