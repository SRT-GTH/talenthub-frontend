import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import {
  CheckIcon,
  CourseCaptionsIcon,
  CourseExpandIcon,
  CourseNoteIcon,
  CoursePlayOutlineIcon,
  CourseQuizHelpIcon,
  CourseSendPlaneIcon,
  CourseVolumeIcon,
  ProfilePauseGlyph,
} from '../../shared/assets.jsx';
import buddyRobot from '../../../assets/talent-home/career-buddy-robot.png';
import QuickCheck from './QuickCheck.jsx';
import { BackRow, CARD_INK, CARD_SOFT, CourseSticker, FOCUS, HEAD } from './CourseUi.jsx';
import { LESSON } from './talentLearningCourseData.js';
import { useLearningData } from './useLearningData.js';

const log = debug('LessonPlayer');

const TOKEN = { kw: 'text-[#84cc16]', fn: 'text-[#ffd86b]', tx: 'text-white' };

const CodeBox = () => (
  <div className="flex flex-col gap-[8px] rounded-[18px] border border-[#1c2a21] bg-[#1c2a21] px-[clamp(14px,1.4vw,24px)] py-[clamp(14px,1.27vw,22px)] text-[13px] leading-[1.19] font-medium @[760px]:absolute @[760px]:top-[10.5%] @[760px]:left-[4.3%] @[760px]:w-[345px] @[760px]:text-[17px]">
    {LESSON.code.map((line, i) => (
      <div key={i} className="flex gap-[8px] whitespace-pre">
        {line.map(([text, kind], j) => (
          <span key={j} className={TOKEN[kind]}>
            {text}
          </span>
        ))}
      </div>
    ))}
  </div>
);

const ResultTable = () => (
  <div className="flex w-full max-w-[234px] flex-col overflow-hidden rounded-[14px] bg-white @[760px]:absolute @[760px]:top-[18.4%] @[760px]:left-[59.8%]">
    <div className="grid grid-cols-3 bg-[#ebf1ec] py-[8px]">
      {LESSON.table.head.map((h) => (
        <span key={h} className="px-[14px] text-[13.5px] leading-[20px] font-bold text-[#2d5d33]">
          {h}
        </span>
      ))}
    </div>
    {LESSON.table.rows.map((row) => (
      <div
        key={row[0]}
        className={classNames('grid grid-cols-3 py-[8px]', row[3] && 'bg-[#ffd86b]/50')}
      >
        {row.slice(0, 3).map((cell, i) => (
          <span
            key={i}
            className="px-[14px] text-[13.5px] leading-[20px] font-medium text-[#1c2a21]"
          >
            {cell}
          </span>
        ))}
      </div>
    ))}
  </div>
);

const VideoPlayer = () => (
  <div className={classNames('overflow-hidden rounded-[26px] bg-[#1c2a21]', CARD_INK)}>
    <div className="@container relative bg-[#1c2a21]">
      <div className="flex flex-col gap-[14px] p-[clamp(14px,1.3vw,22px)] @[760px]:block @[760px]:h-[clamp(300px,22vw,380px)] @[760px]:p-0">
        <CodeBox />
        <ResultTable />
        <CourseSticker
          rotate="playful:rotate-[5deg]"
          textClass="text-[12px]"
          className="self-start @[760px]:absolute @[760px]:top-[73.7%] @[760px]:left-[59.8%]"
        >
          {LESSON.tableTag}
        </CourseSticker>
      </div>
    </div>
    <div className="flex items-center gap-[14px] bg-[#1c2a21] pt-[12px] pr-[18px] pb-[14px] pl-[18px]">
      <button
        type="button"
        aria-label="Pause"
        className={classNames(
          'flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#ffd86b] text-[#1c2a21]',
          FOCUS
        )}
      >
        <ProfilePauseGlyph className="size-[16px]" />
      </button>
      <span className="shrink-0 text-[13px] leading-[15.5px] font-semibold whitespace-nowrap text-white">
        {LESSON.time}
      </span>
      <span className="relative h-[6px] min-w-[24px] flex-1 overflow-hidden rounded-full bg-white/20">
        <span className="absolute inset-y-0 left-0 w-[52.9%] rounded-full bg-[#387440]" />
      </span>
      <span className="hidden shrink-0 rounded-full border border-white/40 px-[9px] py-[3px] text-[12.5px] leading-[14.9px] font-bold text-white sm:inline-block">
        {LESSON.speed}
      </span>
      <CourseCaptionsIcon className="hidden size-[18px] shrink-0 text-white sm:block" />
      <CourseVolumeIcon className="hidden size-[18px] shrink-0 text-white sm:block" />
      <CourseExpandIcon className="size-[18px] shrink-0 text-white" />
    </div>
  </div>
);

const QuickCheckGate = ({ onTake }) => (
  <div className="flex flex-wrap items-center gap-[16px] rounded-[20px] border-[1.2px] border-[#c8951a] bg-[#faf4e8] px-[18px] py-[16px]">
    <span
      className={classNames(
        'flex size-[48px] shrink-0 items-center justify-center rounded-[14px] border border-[rgba(28,42,33,0.1)] bg-[#ffd86b] playful:rotate-[6deg] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
      )}
    >
      <CourseQuizHelpIcon className="size-[22px] text-[#1c2a21]" />
    </span>
    <span className="flex min-w-0 flex-1 basis-[200px] flex-col gap-[2px]">
      <span className="text-[15px] leading-[17.9px] font-semibold text-[#1c2a21]">
        {LESSON.gate.title}
      </span>
      <span className="text-[13px] leading-[15.5px] text-[#595959]">{LESSON.gate.body}</span>
    </span>
    <Button variant="primary" size="sm" onClick={onTake} className="max-sm:w-full">
      {LESSON.gate.cta}
    </Button>
  </div>
);

const ModuleList = ({ progress = LESSON.progress }) => {
  return (
    <section
      className={classNames(
        'flex flex-col gap-[16px] rounded-[22px] px-[14px] pt-[18px] pb-[14px]',
        CARD_SOFT
      )}
    >
      <div className="flex flex-col gap-[6px] px-[4px] pb-[8px]">
        <h2 className={classNames(HEAD, 'text-[19px] leading-[1.25] text-[#1c2a21]')}>
          {progress.title}
        </h2>
        <span className="block h-[8px] w-full overflow-hidden rounded-full bg-[#e1eae2]">
          <span
            className="block h-full rounded-full bg-[#387440]"
            style={{ width: `${progress.pct}%` }}
          />
        </span>
        <span className="text-[12.5px] leading-[14.9px] font-medium text-[#737373]">
          {progress.summary}
        </span>
      </div>
      <ol className="flex flex-col gap-[0px]">
        {progress.modules.map((m) => (
          <li
            key={m.title}
            className={classNames(
              'flex items-center gap-[10px] rounded-[12px] py-[9px] pr-[10px] pl-[8px]',
              m.state === 'current' && 'border border-[#387440] bg-[#ebf1ec] playful:border-[1.2px]'
            )}
          >
            <span
              className={classNames(
                'flex size-[26px] shrink-0 items-center justify-center rounded-full text-[11.5px] max-lg:text-[12px] leading-[13.7px] font-bold',
                m.state === 'done' &&
                  'border border-[rgba(28,42,33,0.12)] bg-[#387440] text-white playful:border-[1.2px] playful:border-[#1c2a21]',
                m.state === 'current' &&
                  'border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]',
                m.state === 'todo' && 'border-[1.2px] border-[#c1d4c4] bg-white text-[#737373]'
              )}
            >
              {m.state === 'done' ? <CheckIcon className="size-[13px]" /> : null}
              {m.state === 'current' ? <CoursePlayOutlineIcon className="size-[11px]" /> : null}
              {m.state === 'todo' ? m.n : null}
            </span>
            <span
              className={classNames(
                'min-w-0 flex-1 truncate text-[14px] leading-[16.7px]',
                m.state === 'current' ? 'font-semibold text-[#1c2a21]' : 'font-medium',
                m.state === 'todo' ? 'text-[#737373]' : 'text-[#1c2a21]'
              )}
            >
              {m.title}
            </span>
            {m.right ? (
              <span className="shrink-0 text-[11.5px] max-lg:text-[12px] leading-[13.7px] font-semibold whitespace-nowrap text-[#2d5d33]">
                {m.right}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
};

const AskBuddy = ({ placeholder = LESSON.buddy.placeholder }) => (
  <section
    className={classNames(
      'flex flex-col gap-[10px] rounded-[22px] bg-[#387440] p-[16px]',
      CARD_INK
    )}
  >
    <div className="flex items-center gap-[10px]">
      <img
        src={buddyRobot}
        alt=""
        width={32}
        height={32}
        draggable="false"
        className="size-[32px] shrink-0 rounded-full object-cover"
      />
      <span className="min-w-0 truncate text-[15px] leading-[17.9px] font-semibold text-white">
        {LESSON.buddy.title}
      </span>
    </div>
    <div className="flex items-center gap-[8px] rounded-full bg-white py-[10px] pr-[10px] pl-[14px]">
      <input
        type="text"
        aria-label={LESSON.buddy.title}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[13px] leading-[15.5px] text-[#1c2a21] outline-none placeholder:text-[#737373]"
      />
      <button
        type="button"
        aria-label={LESSON.buddy.title}
        className={classNames(
          'flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#ffd86b] text-[#1c2a21]',
          FOCUS
        )}
      >
        <CourseSendPlaneIcon className="size-[14px]" />
      </button>
    </div>
  </section>
);

/*
 * LessonPlayer — ML-03 "Lesson player · SQL Module 4" (`?view=lesson`); hosts QuickCheck (`?quick=…`).
 * Focused 8110:11625 / Playful 7524:306.
 */
/*
 * Live lesson (training API). Courses carry only `totalModules` — no lesson media and no quick-check
 * questions — so the player shows the real course / module / progress and an honest "no content yet"
 * panel. ⚠️ INTERIM: "Mark module done" records progress (POST /training/progress) until the backend
 * serves quiz questions; Figma's rule is "marked done when you pass the check".
 */
const LiveLesson = ({ learning, data }) => {
  const card = data.selectedCourse;
  const e = card ? data.enrolmentFor(card.id) : null;
  const [saving, setSaving] = useState(false);
  const goBack = () => learning.update({ view: 'course', quick: null });

  if (data.loading) return null;
  if (!card || !e) {
    return (
      <section className="flex flex-col gap-[16px]">
        <BackRow label="Back to My Learning" crumb="" onClick={() => learning.update({ view: null })} />
        <p className="m-0 font-sans text-[15px] text-[#595959]">
          Start this course from its overview to open the lessons.
        </p>
      </section>
    );
  }
  const total = e.totalModules || card.totalModules || 1;
  const finished = e.status === 'completed' || e.completedCount >= total;
  const current = finished ? total : e.nextModule || 1;
  const progress = {
    title: LESSON.progress.title,
    pct: e.pct,
    summary: `${e.completedCount} of ${total} modules done · ${e.pct}%`,
    modules: Array.from({ length: total }, (_, i) => {
      const n = i + 1;
      const state = n <= e.completedCount ? 'done' : n === current && !finished ? 'current' : 'todo';
      return { n, title: `Module ${n}`, state };
    }),
  };
  const markDone = async () => {
    setSaving(true);
    const res = await data.completeModule(card.id);
    setSaving(false);
    if (res?.isComplete) learning.update({ view: 'certificates' });
  };

  return (
    <section
      className="flex min-w-0 flex-col gap-[clamp(12px,0.93vw,16px)]"
      data-testid="lesson-player"
    >
      <BackRow
        label={card.title}
        crumb={finished ? '·  Completed' : `·  Module ${current} of ${total}`}
        onClick={goBack}
      />
      <div className="flex min-w-0 flex-col gap-[16px] lg:flex-row lg:items-start lg:gap-[clamp(16px,1.39vw,24px)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-[10px] rounded-[26px] bg-[#1c2a21] p-[24px] text-center">
            <p className="m-0 font-sans text-[16px] font-semibold text-white">
              {finished ? 'You finished this course' : `Module ${current}`}
            </p>
            <p className="m-0 max-w-[460px] font-sans text-[13.5px] leading-[1.45] text-[#c1d4c4]">
              {card.externalUrl
                ? `This course is hosted by ${card.provider}. Learn there, then come back to record your progress.`
                : 'Lesson videos for this course aren’t published yet.'}
            </p>
            {card.externalUrl ? (
              <a
                href={card.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames(
                  'mt-[4px] rounded-full bg-[#ffd86b] px-[18px] py-[10px] font-sans text-[14px] font-semibold text-[#1c2a21]',
                  FOCUS
                )}
              >
                Open on {card.provider}
              </a>
            ) : null}
          </div>
          <h1
            className={classNames(
              HEAD,
              'm-0 text-[clamp(22px,1.62vw,28px)] leading-[1.25] tracking-[-0.01em] text-[#1c2a21]'
            )}
          >
            {card.title}
          </h1>
          {!finished ? (
            <div className="flex flex-wrap items-center gap-[12px] rounded-[18px] border border-[#eedeb8] bg-[#faf4e8] px-[16px] py-[14px]">
              <span className="min-w-0 flex-1 font-sans text-[13.5px] leading-[1.4] text-[#595959]">
                Done with module {current}? Record it to move your progress on.
              </span>
              <Button variant="primary" size="sm" onClick={markDone} disabled={saving}>
                {saving ? 'Saving…' : `Mark module ${current} done`}
              </Button>
            </div>
          ) : null}
        </div>
        <aside className="flex min-w-0 flex-col gap-[16px] lg:w-[clamp(300px,20.83vw,360px)] lg:shrink-0">
          <ModuleList progress={progress} />
          <AskBuddy placeholder={`“Explain module ${current} of ${card.title} simply”`} />
        </aside>
      </div>
    </section>
  );
};

const LessonPlayer = ({ learning }) => {
  const data = useLearningData();
  const [tab, setTab] = useState(LESSON.tabs[0]);

  useEffect(() => {
    log('mount', { quick: learning?.quick });
  }, [learning?.quick]);

  if (data.live && !learning?.quick) return <LiveLesson learning={learning} data={data} />;

  if (learning?.quick) {
    log('branch: quick check', learning.quick);
    return <QuickCheck learning={learning} />;
  }

  const goBack = () => {
    log('back -> course');
    learning.update({ view: 'course', quick: null });
  };
  const takeQuickCheck = () => {
    log('take quick check');
    learning.update({ quick: 'question' });
  };

  return (
    <section
      data-testid="lesson-player"
      className="flex min-w-0 flex-col gap-[clamp(14px,1.39vw,24px)]"
    >
      <BackRow label={LESSON.backLabel} crumb={LESSON.crumb} onClick={goBack} />
      <div className="flex min-w-0 flex-col gap-[16px] lg:flex-row lg:items-start lg:gap-[clamp(16px,1.39vw,24px)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
          <VideoPlayer />
          <h1
            className={classNames(
              HEAD,
              'text-[clamp(20px,1.56vw,27px)] leading-[1.2] text-[#1c2a21]'
            )}
          >
            {LESSON.title}
          </h1>
          <QuickCheckGate onTake={takeQuickCheck} />
          <div role="tablist" className="flex gap-[4px] overflow-x-auto border-b border-[#e1eae2]">
            {LESSON.tabs.map((t) => {
              const on = t === tab;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(t)}
                  className={classNames(
                    '-mb-px shrink-0 cursor-pointer px-[14px] pt-[8px] pb-[10px] text-[14.5px] leading-[17.3px] whitespace-nowrap',
                    FOCUS,
                    on
                      ? 'border-b-2 border-[#1c2a21] font-semibold text-[#1c2a21]'
                      : 'font-medium text-[#737373]'
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {tab === LESSON.tabs[0] ? (
            <div
              role="tabpanel"
              className="flex items-start gap-[10px] rounded-[16px] border border-[#e1eae2] bg-white px-[16px] py-[14px]"
            >
              <CourseNoteIcon className="mt-px size-[16px] shrink-0 text-[#595959]" />
              <p className="min-w-0 text-[14px] leading-[16.7px] text-[#1c2a21]">{LESSON.note}</p>
            </div>
          ) : null}
        </div>
        <aside className="flex min-w-0 flex-col gap-[16px] lg:w-[clamp(300px,20.83vw,360px)] lg:shrink-0">
          <ModuleList />
          <AskBuddy />
        </aside>
      </div>
    </section>
  );
};

export default LessonPlayer;
