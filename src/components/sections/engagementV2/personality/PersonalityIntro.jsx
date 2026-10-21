import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import { BigSmileIcon, CompassIcon } from './personalityIcons.jsx';
import { ARCHETYPES, BEFORE_YOU_START, GETS, INTRO_CHIPS, TRAITS } from './personalityData.js';
import { CARD, CARD_SM, CHIP, DISPLAY, GUTTER, KICKER } from './personalityStyles.js';
import {
  AccentHeading,
  PIcon,
  PageFooter,
  PlayfulSticker,
  PlayfulStar,
  StageTrail,
} from './PersonalityParts.jsx';

const log = debug('PersonalityIntro');

/*
 * PE-01 · Personality · Intro (Figma Focused 8285:11030 / Playful 7659:19366): stage trail, hero (copy + "Which one are you?"
 * archetype preview), "What you get" + six traits (left) and "Before you start" (right), footer.
 * Props: onStart (Start the quiz), onSkip (Skip for now, inert until a destination is drawn), onArcade (Prefer games? chip).
 * Playful adds: "NO WRONG ANSWERS" + "9 TO UNLOCK" stickers and two doodle stars; Bricolage heading.
 */
const PersonalityIntro = ({ onStart, onSkip, onArcade }) => {
  useEffect(() => {
    log('mount');
  }, []);

  return (
    <>
      <StageTrail />
      <section
        className={`relative bg-[linear-gradient(90deg,#ebf1ec_0%,#fffefc_60%,#faf4e8_100%)] ${GUTTER}`}
      >
        <div className="flex flex-col gap-[24px] py-[clamp(24px,2.1vw,36px)] lg:min-h-[250px] lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex w-full max-w-[651px] flex-col gap-[12px]">
            <p className={`${KICKER} m-0 text-[#387440]`}>PERSONALITY</p>
            <div className="relative w-fit max-w-full">
              <AccentHeading
                lead="How you work, "
                accent="measured."
                className={`${DISPLAY} text-[clamp(28px,2.72vw,47px)] leading-[1.1] text-[#1c2a21] lg:whitespace-nowrap`}
              />
              <PlayfulSticker rotate={-5} className="left-[calc(100%-38px)] top-[6px]">
                NO WRONG ANSWERS
              </PlayfulSticker>
              <PlayfulStar size={18} className="left-[calc(100%+126px)] top-[-2px]" />
              <PlayfulStar size={9} green className="left-[calc(100%+142px)] top-[74px]" />
            </div>
            <p className="m-0 max-w-[640px] font-sans text-[16px] leading-[24px] text-[#595959]">
              15 short scenarios from real Ghanaian workplaces. There are no right answers. You get
              one of 9 archetypes and six trait scores that recruiters see on your card.
            </p>
            <div className="flex flex-wrap gap-[8px]">
              {INTRO_CHIPS.map((c) => (
                <span key={c} className={CHIP}>
                  {c}
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  log('arcade entry');
                  onArcade?.();
                }}
                className="inline-flex min-h-[33px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[12px] py-[7px] font-sans text-[14px] leading-[17px] font-semibold text-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[2px_2px_0_rgba(28,42,33,0.45)] max-lg:text-[12px]"
              >
                <BigSmileIcon className="size-[16px]" />
                Prefer games? Try the Personality Arcade
              </button>
            </div>
          </div>

          <div
            className={`${CARD} relative flex w-full max-w-[520px] flex-col gap-[24px] p-[22px_24px]`}
          >
            <div className="flex items-center gap-[12px]">
              <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[14px] bg-[#ebf1ec] text-[#387440]">
                <CompassIcon className="size-[22px]" />
              </span>
              <div className="flex flex-col gap-[2px]">
                <p className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
                  Which one are you?
                </p>
                <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
                  Your archetype is revealed when you finish
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {ARCHETYPES.map((a) => (
                <span key={a} className={CHIP}>
                  {a}
                </span>
              ))}
            </div>
            <PlayfulSticker rotate={5} className="right-[12px] top-[4px]">
              9 TO UNLOCK
            </PlayfulSticker>
          </div>
        </div>
      </section>

      <div
        className={`grid flex-1 grid-cols-1 content-start gap-[clamp(24px,3.7vw,64px)] pb-[24px] pt-[clamp(24px,2.3vw,40px)] lg:grid-cols-[1072fr_464fr] ${GUTTER}`}
      >
        <div className="flex min-w-0 flex-col gap-[28px]">
          <p className={`${KICKER} m-0 text-[#595959]`}>WHAT YOU GET</p>
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
            {GETS.map((g) => (
              <div key={g.id} className={`${CARD} flex flex-col gap-[10px] p-[20px]`}>
                <span className="flex size-[40px] items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
                  <PIcon name={g.icon} className="size-[20px]" />
                </span>
                <h3 className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
                  {g.title}
                </h3>
                <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959] max-lg:text-[12px]">
                  {g.body}
                </p>
              </div>
            ))}
          </div>
          <p className={`${KICKER} m-0 text-[#595959]`}>THE SIX TRAITS WE MEASURE</p>
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            {TRAITS.map((t) => (
              <div
                key={t.id}
                className={`${CARD_SM} flex items-center gap-[14px] p-[14px_16px_14px_14px]`}
              >
                <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#f7f8f4] text-[#387440]">
                  <PIcon name={t.icon} className="size-[18px]" />
                </span>
                <div className="flex flex-col gap-[2px]">
                  <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {t.title}
                  </p>
                  <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
                    {t.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className={`${CARD} flex h-fit flex-col gap-[24px] p-[24px]`}>
          <h2 className="m-0 font-sans text-[20px] leading-[24px] font-semibold text-[#1c2a21]">
            Before you start
          </h2>
          {BEFORE_YOU_START.map((p) => (
            <div key={p.id} className="flex gap-[12px]">
              <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]">
                <PIcon name={p.icon} className="size-[18px]" />
              </span>
              <div className="flex flex-col gap-[3px]">
                <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {p.title}
                </p>
                <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </aside>
      </div>

      <PageFooter
        note="Your progress saves after every answer. Leave and come back any time."
        skip={{ label: 'Skip for now', onClick: onSkip }}
        primary={{ label: 'Start the quiz', onClick: onStart }}
      />
    </>
  );
};

export default PersonalityIntro;
