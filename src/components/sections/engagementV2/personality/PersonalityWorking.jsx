import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import { CheckIcon, CompassIcon } from './personalityIcons.jsx';
import { QUIZ_TOTAL, WORKING_STEPS } from './personalityData.js';
import { CARD, DISPLAY, GUTTER } from './personalityStyles.js';
import { PlayfulSticker } from './PersonalityParts.jsx';
import { QuizHeader } from './PersonalityQuiz.jsx';

const log = debug('PersonalityWorking');

/*
 * PE-04 · Personality · Working out your result (Figma Focused 8285:12019 / Playful 7662:65): quiz header in its "Done" state
 * and the centred loader card (88px ring spinner, title, three steps: two done, the last one working).
 * Props: autoAdvanceMs — when set (only after finishing a quiz, via router state) calls onDone after that delay; a direct URL
 * visit never redirects.
 */
const PersonalityWorking = ({ autoAdvanceMs = null, onDone }) => {
  useEffect(() => {
    log('mount', { autoAdvanceMs });
    if (!autoAdvanceMs) return undefined;
    const t = setTimeout(() => {
      log('computing finished -> result');
      onDone?.();
    }, autoAdvanceMs);
    return () => clearTimeout(t);
  }, [autoAdvanceMs, onDone]);

  return (
    <>
      <QuizHeader answered={QUIZ_TOTAL} done />
      <div className={`flex flex-1 justify-center pb-[40px] pt-[44px] ${GUTTER}`}>
        <div
          role="status"
          aria-live="polite"
          className={`${CARD} relative flex h-fit w-full max-w-[560px] flex-col items-center gap-[20px] p-[40px] max-sm:p-[24px]`}
        >
          <PlayfulSticker rotate={6} className="left-[450px] top-[-26px]">
            ALMOST THERE
          </PlayfulSticker>
          <span className="relative flex size-[88px] items-center justify-center">
            <svg
              viewBox="0 0 88 88"
              className="absolute inset-0 size-full motion-safe:animate-spin"
              aria-hidden="true"
            >
              <circle cx="44" cy="44" r="40.48" fill="none" stroke="#ebf1ec" strokeWidth="7.04" />
              <circle
                cx="44"
                cy="44"
                r="40.48"
                fill="none"
                stroke="#387440"
                strokeWidth="7.04"
                strokeDasharray={`${2 * Math.PI * 40.48 * 0.7} ${2 * Math.PI * 40.48}`}
                transform="rotate(-90 44 44)"
              />
            </svg>
            <CompassIcon className="size-[34px] text-[#387440]" />
          </span>
          <h1
            className={`${DISPLAY} m-0 text-center text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold text-[#1c2a21]`}
          >
            Working out your <span className="text-[#387440]">archetype…</span>
          </h1>
          <p className="m-0 text-center font-sans text-[15px] leading-[18px] text-[#595959]">
            This takes a few seconds. Please keep this tab open.
          </p>
          <ul className="m-0 flex w-full max-w-[480px] list-none flex-col gap-[12px] rounded-[16px] bg-[#f7f8f4] p-[20px]">
            {WORKING_STEPS.map((s, i) => {
              const active = i === WORKING_STEPS.length - 1;
              return (
                <li key={s} className="flex items-center gap-[10px]">
                  {active ? (
                    <svg
                      viewBox="0 0 22 22"
                      className="size-[22px] shrink-0 motion-safe:animate-spin"
                      aria-hidden="true"
                    >
                      <circle
                        cx="11"
                        cy="11"
                        r="9.35"
                        fill="none"
                        stroke="#ebf1ec"
                        strokeWidth="3.3"
                      />
                      <path
                        d="M20.35 11 A9.35 9.35 0 0 1 1.65 11"
                        fill="none"
                        stroke="#c8951a"
                        strokeWidth="3.3"
                      />
                    </svg>
                  ) : (
                    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#387440] text-white">
                      <CheckIcon className="size-[13px]" />
                    </span>
                  )}
                  <span
                    className={`font-sans text-[15px] leading-[18px] ${active ? 'font-semibold text-[#1c2a21]' : 'font-medium text-[#595959]'}`}
                  >
                    {s}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PersonalityWorking;
