import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import {
  CheckIcon,
  CloseIcon,
  CourseBulbIcon,
  CoursePlayOutlineIcon,
  SparkleIcon,
} from '../../shared/assets.jsx';
import { CARD_INK, CourseSticker, DualText, FOCUS, Flame, HEAD, BackRow } from './CourseUi.jsx';
import { QUIZ } from './talentLearningCourseData.js';

const log = debug('QuickCheck');

/* ---------- top bar ---------- */
const TopBar = ({ step, onBack, onClose }) => {
  const allDone = step === 'passed' || step === 'retry';
  return (
    <div className="flex items-center gap-[14px]">
      <BackRow label={QUIZ.back} crumb="" onClick={onBack} />
      <div className="flex min-w-0 flex-1 items-center justify-center gap-[8px]">
        <span className="min-w-0 truncate text-[13.5px] leading-[16.1px] font-semibold text-[#595959]">
          {QUIZ.topLabel}
        </span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={classNames(
              'h-[8px] w-[clamp(28px,3.47vw,60px)] shrink-0 rounded-full max-sm:hidden',
              allDone
                ? 'bg-[#387440]'
                : i === 0
                  ? 'border border-[rgba(28,42,33,0.12)] bg-[#ffd86b]'
                  : 'bg-[#e1eae2]'
            )}
          />
        ))}
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={classNames(
          'flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.2px] border-[#1c2a21] bg-white text-[#1c2a21]',
          FOCUS
        )}
      >
        <CloseIcon className="size-[16px]" />
      </button>
    </div>
  );
};

/* ---------- options ---------- */
const OptionRow = ({ option, mode, onPick }) => {
  // mode: idle | selected | correct | wrong | answer | locked
  const looks = {
    idle: 'border border-[#e1eae2] bg-white hover:border-[#c1d4c4]',
    selected:
      'border border-[rgba(28,42,33,0.1)] bg-[#ebf1ec] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
    correct: 'border-2 border-[#1d7c4d] bg-[#e8f2ed]',
    wrong: 'border-2 border-[#c0392b] bg-[#f9ebea]',
    answer: 'border-2 border-[#1d7c4d] bg-white',
    locked: 'border border-[#e1eae2] bg-white',
  };
  const letterLooks = {
    idle: 'border border-[#e1eae2] bg-[#f8f8f4] text-[#595959]',
    selected: 'bg-[#387440] text-white',
    correct: 'bg-[#1d7c4d] text-white',
    wrong: 'bg-[#c0392b] text-white',
    answer: 'bg-[#e8f2ed] text-[#1d7c4d]',
    locked: 'border border-[#e1eae2] bg-[#f8f8f4] text-[#595959]',
  };
  const interactive = mode === 'idle' || mode === 'selected';
  const Tag = interactive ? 'button' : 'div';
  return (
    <Tag
      {...(interactive
        ? { type: 'button', onClick: () => onPick(option.id), 'aria-pressed': mode === 'selected' }
        : {})}
      className={classNames(
        'flex w-full items-center gap-[14px] rounded-[16px] py-[14px] pr-[16px] pl-[14px] text-left',
        interactive && ['cursor-pointer', FOCUS],
        looks[mode]
      )}
    >
      <span
        className={classNames(
          'flex size-[34px] shrink-0 items-center justify-center rounded-[10px] text-[14px] leading-[16.7px] font-bold',
          letterLooks[mode]
        )}
      >
        {mode === 'correct' || mode === 'answer' ? (
          <CheckIcon className="size-[16px]" />
        ) : mode === 'wrong' ? (
          <CloseIcon className="size-[16px]" />
        ) : (
          option.id
        )}
      </span>
      <span className="min-w-0 rounded-[8px] bg-[#f8f8f4] px-[10px] py-[6px] text-[clamp(12.5px,0.87vw,15px)] leading-[17.9px] font-medium break-words text-[#1c2a21]">
        {option.code}
      </span>
      {mode === 'answer' ? (
        <>
          <span className="min-w-0 flex-1" />
          <span className="shrink-0 text-[12.5px] leading-[14.9px] font-bold whitespace-nowrap text-[#1d7c4d]">
            {QUIZ.wrong.rightAnswer}
          </span>
        </>
      ) : null}
    </Tag>
  );
};

/* ---------- feedback bar ---------- */
const FeedbackBar = ({ ok, onNext }) => {
  const copy = ok ? QUIZ.correct : QUIZ.wrong;
  return (
    <div
      role="status"
      className={classNames(
        'flex w-full max-w-[820px] flex-wrap items-center gap-[16px] rounded-[22px] border-[1.5px] py-[16px] pr-[20px] pl-[18px]',
        ok ? 'border-[#1d7c4d] bg-[#e8f2ed]' : 'border-[#c0392b] bg-[#f9ebea]'
      )}
    >
      <span
        className={classNames(
          'flex size-[44px] shrink-0 items-center justify-center rounded-full text-white',
          ok ? 'bg-[#1d7c4d]' : 'bg-[#c0392b]'
        )}
      >
        {ok ? <CheckIcon className="size-[20px]" /> : <CloseIcon className="size-[20px]" />}
      </span>
      <span className="flex min-w-0 flex-1 basis-[200px] flex-col gap-[3px]">
        <span
          className={classNames(
            'text-[17px] leading-[20.3px] font-bold',
            ok ? 'text-[#165d3a]' : 'text-[#902b20]'
          )}
        >
          {copy.title}
        </span>
        <span className="text-[13.5px] leading-[16.1px] text-[#1c2a21]">{copy.body}</span>
      </span>
      <Button variant="primary" size="sm" onClick={onNext} className="max-sm:w-full">
        {copy.cta}
      </Button>
    </div>
  );
};

/* ---------- result cards ---------- */
const ScoreRing = ({ size, fraction, color, children }) => {
  // Figma: donut with inner radius 0.78 starting at 12 o'clock.
  const r = (size / 2) * 0.89;
  const stroke = (size / 2) * 0.22;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e1eae2"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${c * fraction} ${c}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">{children}</span>
    </div>
  );
};

const Passed = ({ onBack, onStart }) => {
  const p = QUIZ.passed;
  return (
    <div
      className={classNames(
        'flex w-full max-w-[720px] flex-col items-center gap-[20px] rounded-[28px] bg-white px-[clamp(16px,2.08vw,36px)] pt-[34px] pb-[30px]',
        CARD_INK
      )}
    >
      <ScoreRing size={130} fraction={1} color="#387440">
        <span className={classNames(HEAD, 'text-[34px] leading-[40.8px] text-[#1c2a21]')}>
          {p.score}
        </span>
      </ScoreRing>
      <CourseSticker textClass="text-[13px]" className="py-[4px]">
        {p.tag}
      </CourseSticker>
      <div className="flex items-center justify-center gap-[5px]">
        <h1
          className={classNames(
            HEAD,
            'text-center text-[clamp(22px,1.79vw,31px)] leading-[1.2] text-[#1c2a21]'
          )}
        >
          {p.title}
        </h1>
        <Flame className="size-[clamp(28px,2.26vw,39px)] shrink-0" />
      </div>
      <div className="flex flex-wrap justify-center gap-[8px]">
        {p.rewards.map((r) => (
          <span
            key={r.id}
            className={classNames(
              'inline-flex items-center gap-[5px] rounded-full border border-[rgba(28,42,33,0.12)] px-[12px] py-[6px] text-[12.5px] leading-[14.9px] font-bold whitespace-nowrap text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]',
              r.tone
            )}
          >
            {r.flame ? <Flame className="size-[14px]" /> : null}
            {typeof r.label === 'string' ? (
              r.label
            ) : (
              <DualText focused={r.label.focused} playful={r.label.playful} />
            )}
          </span>
        ))}
      </div>
      <div className="flex w-full items-center gap-[14px] rounded-[18px] border border-[#e1eae2] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
        <span
          className={classNames(
            HEAD,
            'flex size-[40px] shrink-0 items-center justify-center rounded-full border-[1.2px] border-[#1c2a21] bg-white text-[16px] leading-[19.1px] font-bold text-[#1c2a21]'
          )}
        >
          {p.upNextNum}
        </span>
        <span className="flex min-w-0 flex-col gap-[2px]">
          <span className="text-[11px] max-lg:text-[12px] leading-[13.1px] font-bold text-[#2d5d33]">
            {p.upNext}
          </span>
          <span className="truncate text-[15px] leading-[17.9px] font-semibold text-[#1c2a21]">
            {p.upNextTitle}
          </span>
        </span>
      </div>
      <div className="flex w-full flex-wrap gap-[10px]">
        <Button variant="tertiary" size="lg" onClick={onBack} className="min-w-0 flex-1">
          {p.back}
        </Button>
        <Button variant="primary" size="lg" onClick={onStart} className="min-w-0 flex-1">
          {p.start}
        </Button>
      </div>
    </div>
  );
};

const Retry = ({ onRewatch, onAgain }) => {
  const r = QUIZ.retry;
  return (
    <div
      className={classNames(
        'flex w-full max-w-[720px] flex-col items-center gap-[20px] rounded-[28px] bg-white px-[clamp(16px,2.08vw,36px)] pt-[32px] pb-[30px]',
        CARD_INK
      )}
    >
      <ScoreRing size={120} fraction={1 / 3} color="#c8951a">
        <span className={classNames(HEAD, 'text-[31px] leading-[37.2px] text-[#1c2a21]')}>
          {r.score}
        </span>
      </ScoreRing>
      <CourseSticker tone="white" textClass="text-[12.5px]">
        {r.tag}
      </CourseSticker>
      <h1
        className={classNames(
          HEAD,
          'text-center text-[clamp(20px,1.56vw,27px)] leading-[1.2] text-[#1c2a21]'
        )}
      >
        {r.title}
      </h1>
      <p className="text-center text-[14.5px] leading-[17.3px] text-[#595959]">{r.body}</p>
      <ul className="flex w-full flex-col rounded-[18px] border border-[#e1eae2] bg-[#f8f8f4]">
        {r.review.map((row, i) => (
          <li
            key={row.id}
            className={classNames(
              'flex items-center gap-[12px] py-[12px] pr-[16px] pl-[14px]',
              i > 0 && 'border-t border-[#e1eae2]'
            )}
          >
            <span
              className={classNames(
                'flex size-[26px] shrink-0 items-center justify-center rounded-full text-white',
                row.ok ? 'bg-[#1d7c4d]' : 'bg-[#c0392b]'
              )}
            >
              {row.ok ? (
                <CheckIcon className="size-[13px]" />
              ) : (
                <CloseIcon className="size-[13px]" />
              )}
            </span>
            <span className="min-w-0 flex-1 truncate text-[14.5px] leading-[17.3px] font-semibold text-[#1c2a21]">
              {row.title}
            </span>
            {row.rewatch ? (
              <button
                type="button"
                onClick={onRewatch}
                className={classNames(
                  'inline-flex shrink-0 cursor-pointer items-center gap-[5px] rounded-full border border-[#c1d4c4] bg-white py-[5px] pr-[10px] pl-[8px] text-[12px] leading-[14.3px] font-semibold whitespace-nowrap text-[#2d5d33]',
                  FOCUS
                )}
              >
                <CoursePlayOutlineIcon className="size-[11px]" />
                {row.rewatch}
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="flex w-full flex-wrap gap-[10px]">
        <Button variant="tertiary" size="lg" onClick={onRewatch} className="min-w-0 flex-1">
          {r.rewatch}
        </Button>
        <Button variant="primary" size="lg" onClick={onAgain} className="min-w-0 flex-1">
          {r.again}
        </Button>
      </div>
      <button
        type="button"
        className={classNames(
          'inline-flex cursor-pointer items-center gap-[6px] text-[13.5px] leading-[16.1px] font-semibold text-[#2d5d33]',
          FOCUS
        )}
      >
        <SparkleIcon className="size-[14px]" />
        {r.buddy}
      </button>
    </div>
  );
};

/*
 * QuickCheck — QC-01..QC-05 (`?quick=question|correct|wrong|passed|retry`), shown by LessonPlayer.
 * Focused 8110:17354 / 17644 / 17940 / 18239 / 18522; Playful 7537:1245 / 1563 / 1887 / 2214 / 2527.
 * Local state reproduces the frames: question (B pre-selected, as drawn) -> Check answer ->
 * correct (B) or wrong (chosen answer red, B marked "Right answer"). The Figma file has only
 * question 1 of 3, so Continue -> passed and "Got it, next" -> retry are ⚠️ ASSUMPTION routes.
 */
const QuickCheck = ({ learning }) => {
  const step = learning.quick;
  const [picked, setPicked] = useState(step === 'wrong' ? 'A' : 'B');

  useEffect(() => {
    log('state', { step, picked });
  }, [step, picked]);

  const goLesson = () => {
    log('back to lesson');
    learning.update({ quick: null, view: 'lesson' });
  };
  const goCourse = () => {
    log('back to course');
    learning.update({ quick: null, view: 'course' });
  };
  const check = () => {
    if (!picked) return;
    const ok = picked === QUIZ.answer;
    log('check answer', { picked, ok });
    learning.update({ quick: ok ? 'correct' : 'wrong' });
  };
  const again = () => {
    log('try again');
    setPicked(null);
    learning.update({ quick: 'question' });
  };

  const answered = step === 'correct' || step === 'wrong';
  const modeFor = (id) => {
    if (step === 'question') return picked === id ? 'selected' : 'idle';
    if (step === 'correct') return id === QUIZ.answer ? 'correct' : 'locked';
    if (step === 'wrong') {
      if (id === picked) return 'wrong';
      return id === QUIZ.answer ? 'answer' : 'locked';
    }
    return 'idle';
  };

  return (
    <section
      data-testid="quick-check"
      className="flex min-w-0 flex-col gap-[clamp(14px,1.39vw,24px)]"
    >
      <TopBar step={step} onBack={goLesson} onClose={goLesson} />
      <div
        className={classNames(
          'flex flex-col items-center gap-[18px] pt-[10px]',
          // Figma: result cards sit vertically centred in the 851px body below the header.
          (step === 'passed' || step === 'retry') &&
            'lg:min-h-[clamp(520px,calc(100svh-214px),851px)] lg:justify-center lg:pt-[30px]'
        )}
      >
        {step === 'passed' ? <Passed onBack={goCourse} onStart={goLesson} /> : null}
        {step === 'retry' ? <Retry onRewatch={goLesson} onAgain={again} /> : null}
        {step === 'question' || answered ? (
          <>
            <div
              className={classNames(
                'flex w-full flex-col gap-[16px] rounded-[26px] bg-white px-[clamp(14px,1.74vw,30px)] py-[clamp(16px,1.62vw,28px)]',
                step === 'question' ? 'max-w-[1231px]' : 'max-w-[820px]',
                CARD_INK
              )}
            >
              <div className="flex items-center gap-[10px]">
                <CourseSticker textClass="text-[12px]">{QUIZ.head}</CourseSticker>
                <span className="min-w-0 flex-1" />
                <button
                  type="button"
                  className={classNames(
                    'inline-flex shrink-0 cursor-pointer items-center gap-[6px] rounded-full border border-[#c1d4c4] py-[6px] pr-[12px] pl-[10px] text-[12.5px] leading-[14.9px] font-semibold whitespace-nowrap text-[#2d5d33]',
                    FOCUS
                  )}
                >
                  <CourseBulbIcon className="size-[14px]" />
                  {QUIZ.hint}
                </button>
              </div>
              <h1
                className={classNames(
                  HEAD,
                  'text-[clamp(18px,1.33vw,23px)] leading-[1.25] text-[#1c2a21]'
                )}
              >
                {QUIZ.question}
              </h1>
              <div
                role="group"
                aria-label={QUIZ.question}
                className="flex flex-col gap-[16px] playful:gap-[10px]"
              >
                {QUIZ.options.map((o) => (
                  <OptionRow
                    key={o.id}
                    option={o}
                    mode={modeFor(o.id)}
                    onPick={(id) => {
                      log('pick', id);
                      setPicked(id);
                    }}
                  />
                ))}
              </div>
            </div>
            {step === 'question' ? (
              <div className="flex w-full max-w-[820px] flex-wrap items-center justify-center gap-[10px]">
                <p className="min-w-0 basis-full text-center text-[13px] leading-[15.5px] text-[#737373] sm:basis-auto sm:flex-1 sm:text-left">
                  {QUIZ.hintLine}
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={check}
                  disabled={!picked}
                  className="max-sm:w-full"
                >
                  {QUIZ.check}
                </Button>
              </div>
            ) : (
              <FeedbackBar
                ok={step === 'correct'}
                onNext={() => {
                  log('feedback next', step);
                  learning.update({ quick: step === 'correct' ? 'passed' : 'retry' });
                }}
              />
            )}
          </>
        ) : null}
      </div>
    </section>
  );
};

export default QuickCheck;
