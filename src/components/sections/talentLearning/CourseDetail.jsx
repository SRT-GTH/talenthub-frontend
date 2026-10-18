import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import {
  CheckIcon,
  ClockIcon,
  CourseAwardIcon,
  CourseBannerChartArt,
  CourseGiftIcon,
  CourseHammerIcon,
  CourseLayersIcon,
  CoursePlayOutlineIcon,
  CourseQuizHelpIcon,
  CourseRoleMarkChatIcon,
  CourseRoleMarkHexIcon,
  CourseSignalBarsIcon,
  CourseZapIcon,
} from '../../shared/assets.jsx';
import face1 from '../../../assets/talent-learning/course/social-proof-face-1.png';
import face2 from '../../../assets/talent-learning/course/social-proof-face-2.png';
import face3 from '../../../assets/talent-learning/course/social-proof-face-3.png';
import face4 from '../../../assets/talent-learning/course/social-proof-face-4.png';
import { BackRow, CARD_INK, CARD_SOFT, CourseSticker, DualText, FOCUS, HEAD } from './CourseUi.jsx';
import { COURSE as MOCK_COURSE } from './talentLearningCourseData.js';
import { useLearningData } from './useLearningData.js';
import { toCourseView } from './learningMappers.js';
import LearningLoading from './LearningLoading.jsx';

const log = debug('CourseDetail');

const META_ICONS = {
  clock: ClockIcon,
  layers: CourseLayersIcon,
  signal: CourseSignalBarsIcon,
  gift: CourseGiftIcon,
  award: CourseAwardIcon,
};
const ROW_ICONS = {
  play: CoursePlayOutlineIcon,
  quiz: CourseQuizHelpIcon,
  hammer: CourseHammerIcon,
};
const EARN_ICONS = {
  check: <CheckIcon className="size-[17px] text-[#2d5d33]" />,
  award: <CourseAwardIcon className="size-[17px] text-[#967014]" />,
  zap: <CourseZapIcon className="size-[17px] text-[#1c2a21]" />,
};
const FACES = [face1, face2, face3, face4];
const ROLE_MARKS = { hex: CourseRoleMarkHexIcon, chat: CourseRoleMarkChatIcon };

// Sticker rotation per Figma (Playful): "Start here" 4deg, "Earns verified skill" -3deg.
const TAG_TONE = {
  start: { tone: 'green', rotate: 'playful:rotate-[4deg]' },
  project: { tone: 'white', rotate: 'playful:-rotate-[3deg]' },
};

const ModuleRow = ({ module: m, onStart }) => {
  const Icon = ROW_ICONS[m.icon];
  const tag = m.tag ? TAG_TONE[m.project ? 'project' : 'start'] : null;
  return (
    <li
      className={classNames(
        'flex flex-wrap items-center gap-[clamp(10px,0.81vw,14px)] rounded-[16px] sm:flex-nowrap py-[12px] pr-[clamp(10px,0.81vw,14px)] pl-[12px]',
        m.current && 'bg-[#ebf1ec]',
        m.project && 'bg-[#faf4e8]'
      )}
    >
      <span
        className={classNames(
          'flex size-[34px] shrink-0 items-center justify-center rounded-full text-[14px] leading-[16.7px] font-bold',
          m.current
            ? 'border border-[rgba(28,42,33,0.12)] bg-[#387440] text-white playful:border-[1.2px] playful:border-[#1c2a21]'
            : 'border-[1.2px] border-[#c1d4c4] bg-white text-[#2d5d33]'
        )}
      >
        {m.n}
      </span>
      <span className="flex min-w-0 flex-1 basis-[calc(100%-56px)] flex-col gap-[2px] sm:basis-0">
        <span className="text-[15px] leading-[17.9px] font-semibold text-[#1c2a21] sm:truncate">
          {m.title}
        </span>
        <span className="flex items-center gap-[6px] text-[12.5px] leading-[14.9px] text-[#737373]">
          <Icon className="size-[13px] shrink-0" />
          <span className="truncate">{m.meta}</span>
        </span>
      </span>
      {tag ? (
        <button
          type="button"
          onClick={m.current ? onStart : undefined}
          tabIndex={m.current ? 0 : -1}
          className="cursor-pointer max-sm:ml-[48px]"
        >
          <CourseSticker
            tone={tag.tone}
            rotate={tag.rotate}
            textClass="text-[11px] max-lg:text-[12px]"
          >
            {m.tag}
          </CourseSticker>
        </button>
      ) : null}
    </li>
  );
};

/*
 * CourseDetail — ML-02 "Course detail · Power BI Basics" (`?view=course`).
 * Focused 8110:11212 / Playful 7523:227. Content column only (the shell is the Shell agent's).
 */
const CourseDetail = ({ learning }) => {
  const data = useLearningData();
  const card = data.live ? data.selectedCourse : null;
  const enrolment = card ? data.enrolmentFor(card.id) : null;
  const COURSE = card ? toCourseView(card, enrolment, MOCK_COURSE) : MOCK_COURSE;
  useEffect(() => {
    log('mount', { view: learning?.view, live: data.live, course: card?.id, modules: COURSE.modules.length });
  }, [learning?.view, data.live, card?.id, COURSE.modules.length]);

  // Saved state: follows the click AND `?toast=saved`. A toast that closes early (Undo) un-saves;
  // the toast's own 10s auto-dismiss keeps the course saved.
  const [savedLocal, setSavedLocal] = useState(false);
  const toastSince = useRef(null);
  const toastOn = learning?.toast === 'saved';
  useEffect(() => {
    if (toastOn) {
      toastSince.current = Date.now();
      return;
    }
    if (toastSince.current && Date.now() - toastSince.current < 9000) {
      log('toast closed early -> undo save');
      setSavedLocal(false);
    }
    toastSince.current = null;
  }, [toastOn]);
  const saved = data.live ? data.isSaved(card?.id) : savedLocal || toastOn;

  const startCourse = () => {
    if (data.live) {
      if (!card || COURSE.finished) return;
      log(enrolment ? 'resume -> lesson' : 'enrol -> lesson', card.id);
      if (enrolment) data.resume(card.id);
      else data.startCourse(card.id);
      return;
    }
    log('start course -> lesson');
    learning.update({ view: 'lesson', quick: null });
  };
  const saveForLater = () => {
    if (data.live) {
      if (!card) return;
      if (saved) data.unsave(card.id);
      else data.save(card.id);
      return;
    }
    if (saved) {
      log('unsave');
      setSavedLocal(false);
      learning.update({ toast: null });
      return;
    }
    log('save for later -> toast');
    setSavedLocal(true);
    learning.update({ toast: 'saved' });
  };
  const goBack = () => {
    log('back to My Learning');
    learning.update({ view: null, quick: null });
  };

  if (data.live && data.loading) return <LearningLoading learning={learning} />;
  if (data.live && !card) {
    return (
      <section className="flex flex-col gap-[16px]">
        <BackRow label={MOCK_COURSE.backLabel} crumb="" onClick={goBack} />
        <p className="m-0 font-sans text-[15px] text-[#595959]">
          We couldn’t find that course. It may have been retired.
        </p>
      </section>
    );
  }

  return (
    <section
      data-testid="course-detail"
      className="flex min-w-0 flex-col gap-[clamp(14px,1.39vw,24px)]"
    >
      <BackRow label={COURSE.backLabel} crumb={COURSE.crumb} onClick={goBack} />

      <div className="flex min-w-0 flex-col gap-[16px] lg:flex-row lg:items-start lg:gap-[clamp(16px,1.39vw,24px)]">
        {/* left column */}
        <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
          <article className={classNames('overflow-hidden rounded-[26px] bg-white', CARD_INK)}>
            <div className="relative h-[clamp(112px,9.84vw,170px)] overflow-hidden bg-[#ffcb05]">
              <CourseBannerChartArt className="absolute top-0 right-[3%] h-full w-auto sm:right-auto sm:left-[44.8%]" />
            </div>
            <div className="flex flex-col gap-[14px] px-[clamp(16px,1.5vw,26px)] pt-[clamp(16px,1.27vw,22px)] pb-[clamp(16px,1.39vw,24px)]">
              <div className="flex flex-wrap items-center gap-[8px]">
                <span className="text-[11.5px] max-lg:text-[12px] leading-[13.7px] font-bold whitespace-nowrap text-[#2d5d33]">
                  {COURSE.provider}
                </span>
                {COURSE.sticker && <CourseSticker>{COURSE.sticker}</CourseSticker>}
              </div>
              <h1
                className={classNames(
                  HEAD,
                  'text-[clamp(28px,2.31vw,40px)] leading-[1.1] text-[#1c2a21]'
                )}
              >
                {COURSE.title}
              </h1>
              <p className="text-[clamp(14px,0.9vw,15.5px)] leading-[1.45] text-[#595959]">
                {COURSE.blurb}
              </p>
              <ul className="flex flex-wrap gap-[8px]">
                {COURSE.meta.map((m) => {
                  const Icon = META_ICONS[m.icon];
                  return (
                    <li
                      key={m.id}
                      className="inline-flex h-[30px] items-center gap-[6px] rounded-full border border-[#e1eae2] bg-[#f8f8f4] py-[6px] pr-[12px] pl-[10px] text-[13.5px] leading-[16.1px] font-medium whitespace-nowrap text-[#1c2a21]"
                    >
                      <Icon className="size-[15px] text-[#595959]" />
                      {m.label}
                    </li>
                  );
                })}
              </ul>
              <div className="flex flex-wrap items-center gap-[10px]">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={startCourse}
                  disabled={Boolean(COURSE.finished) || (data.live && data.busy === card?.id)}
                >
                  {COURSE.start}
                </Button>
                {saved ? (
                  <button
                    type="button"
                    aria-pressed="true"
                    onClick={saveForLater}
                    className={classNames(
                      'inline-flex h-[56px] cursor-pointer items-center justify-center rounded-[14px] border-2 border-[#c1d4c4] bg-[#e1eae2] px-[clamp(20px,1.97vw,34px)] text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(27,36,44,0.12)]',
                      FOCUS
                    )}
                  >
                    {COURSE.saved}
                  </button>
                ) : (
                  <Button variant="tertiary" size="lg" onClick={saveForLater}>
                    {COURSE.save}
                  </Button>
                )}
                <p className="min-w-0 basis-full text-[13px] leading-[15.5px] text-[#737373] sm:basis-auto">
                  {COURSE.pace}
                </p>
              </div>
            </div>
          </article>

          <section
            className={classNames(
              'flex flex-col gap-[12px] rounded-[22px] p-[clamp(14px,1.27vw,22px)]',
              CARD_SOFT
            )}
          >
            <div className="flex items-center gap-[8px]">
              <h2
                className={classNames(
                  HEAD,
                  'min-w-0 flex-1 text-[clamp(18px,1.27vw,22px)] leading-[1.25] text-[#1c2a21]'
                )}
              >
                {COURSE.insideTitle}
              </h2>
              <span className="shrink-0 text-[13.5px] leading-[16.1px] font-semibold whitespace-nowrap text-[#2d5d33]">
                {COURSE.insideMeta}
              </span>
            </div>
            <ol className="flex flex-col gap-0">
              {COURSE.modules.map((m) => (
                <ModuleRow key={m.n} module={m} onStart={startCourse} />
              ))}
            </ol>
          </section>
        </div>

        {/* right column */}
        <aside className="flex min-w-0 flex-col gap-[16px] lg:w-[clamp(300px,20.83vw,360px)] lg:shrink-0">
          {COURSE.why && (
          <section
            className={classNames(
              'flex flex-col gap-[12px] rounded-[26px] bg-[#387440] p-[clamp(16px,1.27vw,22px)]',
              CARD_INK
            )}
          >
            <p className="text-[12px] leading-[14.3px] font-bold text-[#c1d4c4]">
              {COURSE.why.eyebrow}
            </p>
            <h2
              className={classNames(
                HEAD,
                'text-[clamp(20px,1.33vw,23px)] leading-[1.25] text-white'
              )}
            >
              {COURSE.why.title}
            </h2>
            <ul className="flex flex-col rounded-[16px] bg-white/10 px-[14px] py-[4px]">
              {COURSE.why.roles.map((r, i) => {
                const Mark = ROLE_MARKS[r.mark];
                return (
                  <li
                    key={r.title}
                    className={classNames(
                      'flex items-center gap-[10px] py-[10px]',
                      i === 0 && 'border-b border-white/[0.18]'
                    )}
                  >
                    <Mark className="size-[30px] shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-[13.5px] leading-[16.1px] font-medium text-white">
                      {r.title}
                    </span>
                    <span className="shrink-0 text-[13px] leading-[15.5px] font-bold whitespace-nowrap text-[#ffd86b]">
                      {r.delta}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
          )}

          <section
            className={classNames('flex flex-col gap-[24px] rounded-[22px] p-[20px]', CARD_SOFT)}
          >
            <h2 className={classNames(HEAD, 'text-[19px] leading-[1.25] text-[#1c2a21]')}>
              {COURSE.earn.title}
            </h2>
            {COURSE.earn.items.map((it) => (
              <div key={it.id} className="flex items-center gap-[12px]">
                <span
                  className={classNames(
                    'flex size-[36px] shrink-0 items-center justify-center rounded-[12px] border border-[rgba(28,42,33,0.12)] playful:border-[1.2px] playful:border-[#1c2a21]',
                    it.tint
                  )}
                >
                  {EARN_ICONS[it.icon]}
                </span>
                <span className="flex min-w-0 flex-col gap-px">
                  <span className="text-[14.5px] leading-[17.3px] font-semibold text-[#1c2a21]">
                    {typeof it.title === 'string' ? (
                      it.title
                    ) : (
                      <DualText focused={it.title.focused} playful={it.title.playful} />
                    )}
                  </span>
                  <span className="text-[12.5px] leading-[14.9px] text-[#737373]">{it.sub}</span>
                </span>
              </div>
            ))}
          </section>

          {COURSE.proof && (
          <section
            className={classNames('flex flex-col gap-[10px] rounded-[22px] p-[18px]', CARD_SOFT)}
          >
            <div className="flex -space-x-[8px]">
              {FACES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  width={30}
                  height={30}
                  draggable="false"
                  className="size-[30px] rounded-full object-cover"
                  style={{ zIndex: FACES.length - i }}
                />
              ))}
            </div>
            <p className="text-[13.5px] leading-[16.1px] font-semibold text-[#1c2a21]">
              {COURSE.proof}
            </p>
          </section>
          )}
        </aside>
      </div>
    </section>
  );
};

export default CourseDetail;
