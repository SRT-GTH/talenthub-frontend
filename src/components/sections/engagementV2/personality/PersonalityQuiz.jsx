import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoCircleIcon,
  LockIcon,
} from './personalityIcons.jsx';
import {
  QUESTIONS,
  QUIZ_ANSWERED_BEFORE,
  QUIZ_TOTAL,
  QUIZ_TRAITS_SO_FAR,
} from './personalityData.js';
import { CARD, DISPLAY, GUTTER, KICKER } from './personalityStyles.js';
import { PageFooter, PlayfulSticker, PlayfulStar } from './PersonalityParts.jsx';

const log = debug('PersonalityQuiz');

/*
 * Quiz header shared by PE-02 / PE-03 / PE-04: the 80px #2a5730 "Quiz bar" + the 64px progress row with one segment per
 * question (15 in the demo). `done` marks the loader screen ("Done" subtitle, "All N answered").
 * Live: `total` = the bank's size, `answeredIdx` (bool per question) colours the segments by which questions are answered
 * (Previous / Skip make that differ from "the first n"), `subtitle` / `savedLabel` replace the demo copy.
 */
export const QuizHeader = ({
  answered,
  currentIndex = null,
  done = false,
  onExit,
  total = QUIZ_TOTAL,
  answeredIdx = null,
  subtitle = null,
  savedLabel = 'Saved after every answer',
}) => (
  <>
    <div
      className={`relative flex min-h-[80px] items-center justify-between gap-4 bg-[#2a5730] py-3 ${GUTTER}`}
    >
      <div className="flex min-w-0 items-center gap-[16px]">
        <button
          type="button"
          aria-label="Exit quiz"
          onClick={() => {
            log('exit quiz');
            onExit?.();
          }}
          className="flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[rgba(255,255,255,0.12)] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <CloseIcon className="size-[16px]" />
        </button>
        <div className="relative flex flex-col gap-[2px]">
          <p
            className={`${DISPLAY} m-0 font-sans text-[23px] leading-[29px] font-semibold text-white`}
          >
            Personality quiz
          </p>
          <p className="m-0 font-sans text-[13px] leading-[16px] font-medium text-white/80 max-lg:text-[12px]">
            {subtitle ?? `15 scenarios · No right answers · ${done ? 'Done' : 'About 4 min left'}`}
          </p>
          <PlayfulSticker rotate={-4} className="left-[318px] top-[12px]">
            NO WRONG ANSWERS
          </PlayfulSticker>
        </div>
      </div>
      <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-white max-md:hidden">
        <CheckCircleIcon className="size-[14px]" />
        {savedLabel}
      </p>
      <PlayfulStar size={16} className="right-[284px] top-[14px]" />
      <PlayfulStar size={8} green className="right-[370px] top-[46px]" />
      <PlayfulStar size={7} green className="right-[301px] top-[42px]" />
    </div>
    <div
      className={`flex min-h-[64px] items-center gap-[clamp(12px,2.8vw,48px)] bg-white py-2 ${GUTTER}`}
    >
      <p className="m-0 min-w-[112px] shrink-0 whitespace-nowrap font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] max-md:w-auto">
        {done ? `All ${total} answered` : `Question ${currentIndex + 1} of ${total}`}
      </p>
      <div
        className="flex h-[8px] min-w-0 flex-1 gap-[4px]"
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuenow={answered}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        {Array.from({ length: total }, (_, i) => {
          const isDone = done || (answeredIdx ? Boolean(answeredIdx[i]) : i < answered);
          const isCurrent =
            i === currentIndex && !done && (answeredIdx ? !answeredIdx[i] : answered <= i);
          return (
            <span
              key={i}
              className={classNames(
                'h-full flex-1 rounded-[4px]',
                isCurrent ? 'bg-[#c8951a]' : isDone ? 'bg-[#387440]' : 'bg-[#e7e7e7]'
              )}
            />
          );
        })}
      </div>
      <p className="m-0 min-w-[72px] shrink-0 text-right font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-md:hidden">
        {done
          ? `${total} answered`
          : `${answered} answered${answeredIdx ? '' : ' · about 4 min left'}`}
      </p>
    </div>
  </>
);

/*
 * PE-02 / PE-03 · Personality quiz (Figma Focused 8285:11238 / 8285:11406, Playful 7659:19623 / 7659:19809).
 * Props: q (question number), answer (option index or null), onAnswer(index), onNext, onPrev, onSkip, onExit.
 * Demo (no `live`): question 7, the only drawn one; picking an option marks segment 7 done, bumps "6 answered" to
 * "7 answered", enables Next and switches the footer note. The page passes no onNext/onPrev/onSkip/onExit there.
 * Live: `live` = { question ({ n, kicker, titleLead, titleAccent, context, options:[{ letter, text }] }), total,
 * answeredIdx, answeredCount, traitsSoFar ([{ id, label, status, fill }]), traitsNote, nextLabel, subtitle, savedLabel,
 * notice } — one statement of the Big Five bank, the five 1–5 agree options, the real progress; `notice` is a
 * role="status" line (e.g. "answer question 4 to finish").
 */
const PersonalityQuiz = ({
  q = 7,
  answer = null,
  onAnswer,
  onNext,
  onPrev,
  onSkip,
  onExit,
  live = null,
}) => {
  const question = live?.question ?? QUESTIONS[q] ?? QUESTIONS[7];
  const picked = answer !== null;
  const answered = live ? live.answeredCount : QUIZ_ANSWERED_BEFORE + (picked ? 1 : 0);
  const traitsSoFar = live?.traitsSoFar ?? QUIZ_TRAITS_SO_FAR;

  useEffect(() => {
    log('mount', { q: question.n, answer });
  }, [question.n, answer]);

  return (
    <>
      <QuizHeader
        answered={answered}
        currentIndex={question.n - 1}
        onExit={onExit}
        total={live?.total}
        answeredIdx={live?.answeredIdx}
        subtitle={live?.subtitle}
        savedLabel={live?.savedLabel}
      />
      <div
        className={`grid flex-1 grid-cols-1 content-start gap-[clamp(24px,3.7vw,64px)] pb-[24px] pt-[clamp(24px,2.3vw,40px)] lg:grid-cols-[1072fr_464fr] ${GUTTER}`}
      >
        <div className="flex min-w-0 flex-col gap-[20px]">
          <p className={`${KICKER} m-0 text-[#387440]`}>{question.kicker}</p>
          <h1
            className={`${DISPLAY} m-0 text-[clamp(24px,1.85vw,32px)] leading-[1.2] font-semibold text-[#1c2a21]`}
          >
            {question.titleLead}
            <span className="text-[#387440]">{question.titleAccent}</span>
          </h1>
          <div className="flex gap-[12px] rounded-[14px] border border-solid border-[#387440] bg-[#f7f8f4] p-[16px_20px_16px_16px]">
            <InfoCircleIcon className="mt-[2px] size-[18px] shrink-0 text-[#387440]" />
            <p className="m-0 font-sans text-[15px] leading-[23px] text-[#1c2a21] max-lg:text-[14px]">
              {question.context}
            </p>
          </div>
          {live?.notice ? (
            <p
              role="status"
              className="m-0 rounded-[12px] bg-[#faf4e8] px-[16px] py-[10px] font-sans text-[14px] leading-[20px] font-medium text-[#785910]"
            >
              {live.notice}
            </p>
          ) : null}
          <div role="radiogroup" aria-label="Answers" className="flex flex-col gap-[12px]">
            {question.options.map((o, i) => {
              const on = answer === i;
              return (
                <button
                  key={o.letter}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    log('answer', { letter: o.letter });
                    onAnswer?.(i);
                  }}
                  className={classNames(
                    'flex w-full cursor-pointer items-center gap-[16px] rounded-[16px] border border-solid border-[rgba(28,42,33,0.1)] p-[18px_20px_18px_18px] text-left shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    on ? 'bg-[#f5f9f5]' : 'bg-white'
                  )}
                >
                  <span
                    className={classNames(
                      'flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-solid font-sans text-[13px] leading-[16px] font-bold playful:border-[1.2px]',
                      on
                        ? 'border-[rgba(28,42,33,0.12)] bg-[#387440] text-white playful:border-[#1c2a21]'
                        : 'border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21] playful:border-[#1c2a21]'
                    )}
                  >
                    {o.letter}
                  </span>
                  <span
                    className={classNames(
                      'font-sans text-[15px] leading-[22px] text-[#1c2a21]',
                      on ? 'font-semibold' : 'font-medium'
                    )}
                  >
                    {o.text}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-[20px]">
            <button
              type="button"
              onClick={() => {
                log('previous question');
                onPrev?.();
              }}
              className="inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21] max-lg:text-[12px]"
            >
              <ArrowLeftIcon className="size-[16px]" />
              Previous question
            </button>
            <button
              type="button"
              onClick={() => {
                log('skip this one');
                onSkip?.();
              }}
              className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#595959] max-lg:text-[12px]"
            >
              Skip this one
            </button>
          </div>
        </div>

        <div className="flex h-fit min-w-0 flex-col gap-[14px]">
          <aside
            className={classNames(
              CARD,
              'flex flex-col p-[24px]',
              picked ? 'gap-[14px]' : 'gap-[24px]'
            )}
          >
            <div className="flex items-center gap-[8px]">
              <ChartBarIcon className="size-[18px] text-[#387440]" />
              <h2 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
                Your traits so far
              </h2>
            </div>
            {traitsSoFar.map((t) => (
              <div key={t.id} className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                    {t.label}
                  </span>
                  <span className="font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
                    {t.status}
                  </span>
                </div>
                <div className="h-[8px] rounded-[4px] bg-[#eeeeea]">
                  <div
                    className="h-full rounded-[4px] bg-[#387440]"
                    style={{ width: `${t.fill * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
              {live?.traitsNote ??
                'Bars move as you answer. Your final scores appear after question 15.'}
            </p>
          </aside>
          <aside
            className={classNames(
              CARD,
              'flex flex-col p-[20px_24px]',
              picked ? 'gap-[8px]' : 'gap-[16px]'
            )}
          >
            <div className="flex items-center gap-[8px]">
              <LockIcon className="size-[16px] text-[#387440]" />
              <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                Your answers are private
              </h2>
            </div>
            <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
              Recruiters see your trait scores and archetype, never the answers you pick.
            </p>
          </aside>
        </div>
      </div>

      <PageFooter
        noteIcon="InfoCircle"
        noteIconClass="text-[#595959]"
        note={
          picked
            ? 'Answer saved. You can change it until you move on'
            : 'Pick the option closest to what you’d really do'
        }
        primary={{
          label: live?.nextLabel ?? 'Next question',
          disabled: !picked,
          onClick: () => {
            log('next question');
            onNext?.();
          },
        }}
      />
    </>
  );
};

export default PersonalityQuiz;
