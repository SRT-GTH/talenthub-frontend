import { HERO_DEFINITIONS } from './interestsData.js';
import { CARD, HEADING_FONT, PAGE_X } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';

/*
 * InterestsHero: gradient hero of every Interests frame (Figma Hero 7706:92 / 8285:9936): eyebrow, headline, lead, the
 * "What counts as an interest?" card, and (Playful only) a tilted sticker + two doodle stars.
 * Props: sticker (text of the Playful sticker, e.g. "STEP 1: BROAD AREAS" or "3 AREAS · 5 SPECIFICS").
 */
const InterestsHero = ({ sticker }) => (
  <section
    className={`bg-[linear-gradient(135deg,#ebf1ec_0%,#faf4e8_100%)] pt-[clamp(20px,1.97vw,34px)] pb-5 lg:pb-0 playful:lg:pb-[15px] ${PAGE_X}`}
  >
    <div className="mx-auto grid max-w-[1728px] gap-6 lg:grid-cols-[minmax(0,1fr)_clamp(300px,26.6vw,460px)] lg:justify-between lg:gap-[clamp(24px,3.7vw,64px)]">
      <div className="relative flex flex-col gap-3">
        <p className="m-0 font-sans text-[11px] font-bold leading-[13px] tracking-[1.2px] text-[#387440] max-lg:text-[12px]">
          INTERESTS
        </p>
        <h1
          className={`m-0 text-[clamp(28px,2.72vw,47px)] font-semibold leading-[1.107] text-[#111] ${HEADING_FONT}`}
        >
          <span className="text-[#1c2a21]">What actually </span>
          <span className="text-[#387440]">pulls you in?</span>
        </h1>
        <p className="m-0 max-w-[660px] font-sans text-[16px] leading-[24px] text-[#595959]">
          Pick 2–6 broad areas, then add specifics inside each. They drive your role matches, mentor
          suggestions and communities.
        </p>
        {sticker ? (
          <span
            data-testid="interests-sticker"
            className="hidden w-fit rotate-[4deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14px] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_rgba(28,42,33,.45)] playful:inline-block lg:playful:absolute lg:playful:left-[min(541px,calc(100%-170px))] lg:playful:top-[49px]"
          >
            {sticker}
          </span>
        ) : null}
        <Icons.DoodleStarIcon className="hidden text-[24px] text-[#c8951a] lg:playful:absolute lg:playful:left-[714px] lg:playful:top-[29px] lg:playful:block" />
        <Icons.DoodleStarIcon className="hidden text-[13px] text-[#387440] lg:playful:absolute lg:playful:left-[740px] lg:playful:top-[71px] lg:playful:block" />
      </div>

      <div className={`flex flex-col gap-[10px] px-[22px] py-5 ${CARD}`}>
        <h2 className="m-0 font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
          What counts as an interest?
        </h2>
        {HERO_DEFINITIONS.map((d) => {
          const Glyph = Icons[`${d.icon}Icon`];
          return (
            <div key={d.text} className="flex items-center gap-[10px]">
              <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] bg-[#ebf1ec] text-[16px] text-[#387440]">
                <Glyph />
              </span>
              <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#1c2a21] max-lg:text-[12px]">
                {d.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default InterestsHero;
