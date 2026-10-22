import AccentText from '../shared/AccentText.jsx';
import { MATCHING } from './OpportunitiesData.js';
import { BoltGlyph, BulbGlyph, TargetGlyph, TrendUpGlyph } from './OpportunitiesIcons.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('HowMatchingWorks');

const ICONS = { bolt: BoltGlyph, bulb: BulbGlyph, target: TargetGlyph, trend: TrendUpGlyph };

/*
 * Section · How matching works (Figma 7797:28748 desktop 1728x531 / tablet 7815:304601 / mobile 7815:306092):
 * dark #14301a band, lime glow, centred head (chip · Bricolage 56/600 title · 18/400 sub) and four #fffdf7 cards (4 col → 2 col → 1 col).
 */
const HowMatchingWorks = () => {
  log('render');
  return (
    <section className="relative isolate overflow-hidden bg-[#14301a] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="pointer-events-none absolute -top-[100px] right-[-72px] -z-10 size-[600px] rounded-full bg-[#84cc16]/15 blur-[200px]" />
      <div className="mx-auto flex max-w-[1536px] flex-col gap-5 md:gap-10">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-3 text-center">
          <span className="inline-flex h-7 items-center rounded-full border border-[#1c2a21] bg-[#ffd86b] px-3 font-sans text-[13px] font-semibold text-[#1c2a21]">
            {MATCHING.chip}
          </span>
          <h2 className="m-0 font-heading text-[32px] font-semibold leading-[1.1] md:text-[35px] xl:text-[47px] text-white">
            <AccentText accent="explained." tone="gold">
              {MATCHING.title}
            </AccentText>
          </h2>
          <p className="m-0 font-sans text-[16px] leading-[27px] text-white md:text-[18px]">
            {MATCHING.subtitle}
          </p>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 xl:grid-cols-4">
          {MATCHING.cards.map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <li
                key={card.id}
                className="flex flex-col gap-[10px] rounded-[26px] border-[1.4px] border-[#1c2a21]/[0.32] bg-[#fffdf7] p-[22px] shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]"
              >
                <span
                  className="flex size-11 items-center justify-center rounded-[14px] border-[1.5px] border-[#1c2a21] text-[#1c2a21]"
                  style={{ background: card.tile }}
                >
                  <span className="size-[22px]">
                    <Icon />
                  </span>
                </span>
                <h3 className="m-0 font-heading text-[22px] font-semibold leading-[27.5px] text-[#1c2a21]">
                  {card.title}
                </h3>
                <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
                  {card.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default HowMatchingWorks;
