import AccentText from '../shared/AccentText.jsx';
import { SectionChip } from './StoryParts.jsx';
import { STORY_NUMBERS } from './StoriesData.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('StoriesNumbers');

/*
 * StoriesNumbers — "Section · Numbers" (Figma 7797:30806, 1728x456, #14301a, lime glow 600px blur 200 at top-right, pad 100/96, gap 40).
 * Head: gold chip + Instrument Serif 56 (tablet 35, mobile 32). Stat cards 369x124 r24, white 8% fill + 1px white border, gap 20:
 * value Bricolage 47/600 gold (35 / 32), label 15/600 white. Tablet: 4 across (173 wide); mobile: 2x2 (183 wide).
 */
const StoriesNumbers = () => {
  log('render');
  return (
    <section className="relative isolate overflow-hidden bg-[#14301a] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="pointer-events-none absolute -right-[72px] -top-[100px] -z-10 size-[600px] rounded-full bg-[#84cc16]/15 blur-[200px]" />
      <div className="mx-auto flex w-full max-w-[1536px] flex-col items-center gap-5 md:gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <SectionChip>{STORY_NUMBERS.chip}</SectionChip>
          <h2 className="m-0 font-heading text-[32px] font-semibold leading-[1.1] md:text-[35px] xl:text-[47px] text-white">
            <AccentText accent="big results." tone="gold">
              {STORY_NUMBERS.title}
            </AccentText>
          </h2>
        </header>
        <ul className="m-0 grid w-full list-none grid-cols-2 gap-5 p-0 md:grid-cols-4">
          {STORY_NUMBERS.items.map((n) => (
            <li
              key={n.label}
              className="flex flex-col items-center justify-center gap-1 rounded-[24px] border border-white bg-white/[0.08] p-6 text-center"
            >
              <span className="font-heading text-[clamp(32px,calc(23px+1.4vw),47px)] font-semibold leading-[1.1] text-[#ffd86b]">
                {n.value}
              </span>
              <span className="font-sans text-[15px] font-semibold leading-[17.9px] text-white">
                {n.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StoriesNumbers;
