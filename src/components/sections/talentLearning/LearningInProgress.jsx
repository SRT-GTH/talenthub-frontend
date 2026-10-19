import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  LearningAwardIcon,
  LearningStreakFlameIcon,
  LearningZapIcon,
} from '../../shared/assets.jsx';
import {
  HEAD,
  HubSticker,
  LearningCover,
  LIFT,
  PLAIN,
  ProgressBar,
  RecCard,
  Unit,
} from './LearningHubParts.jsx';
import { LEVEL, SKILL_GAPS, WEEKLY, ALSO_IN_PROGRESS } from './talentLearningHubData.js';
import { useLearningData } from './useLearningData.js';

const log = debug('LearningInProgress');

/*
 * LearningInProgress — ML-01 "My Learning · In progress" body (Playful 7522:104 / Focused 8110:10737).
 * Left column: continue card, "Also in progress", "Close your skill gaps"; right column (340px from xl):
 * weekly goal, level, certificates. Buttons open the other views via `learning.update({view})`.
 */

// Playful chip treatment of the three gap cards (Figma: first plain, the other two ink-outlined).
const GAP_CHIP = { powerBi: 'default', figma: 'ink', statistics: 'ink' };

const MINI_LINK =
  'm-0 cursor-pointer border-0 bg-transparent p-0 font-sans font-semibold whitespace-nowrap text-[#2d5d33] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const Pct = ({ children, size = 14 }) => (
  <span
    className={classNames(
      'shrink-0 font-sans font-bold text-[#2d5d33]',
      size === 14 ? 'text-[14px] leading-[16.7px]' : 'text-[12.5px] leading-[14.9px]'
    )}
  >
    {children}
  </span>
);

const ContinueCard = ({ item: CONTINUE, data }) => (
  <section
    aria-label={CONTINUE.label}
    className={classNames(
      'flex flex-col gap-[16px] rounded-[26px] bg-white p-[14px] sm:flex-row sm:items-center sm:gap-[22px] sm:py-[18px] sm:pr-[22px] sm:pl-[18px]',
      LIFT
    )}
  >
    <div className="h-[clamp(120px,32vw,170px)] w-full shrink-0 overflow-hidden rounded-[18px] sm:h-[170px] sm:w-[clamp(180px,15vw,260px)]">
      <LearningCover kind={CONTINUE.cover} />
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <span className="font-sans text-[11.5px] max-lg:text-[12px] leading-[13.7px] font-bold whitespace-nowrap text-[#2d5d33]">
          {CONTINUE.label}
        </span>
        <HubSticker tone="gold" rotate={4}>
          {CONTINUE.left}
        </HubSticker>
      </div>
      <h2
        className={classNames(
          'm-0 text-[clamp(23px,1.8vw,31px)] leading-[1.2] text-[#1c2a21]',
          HEAD
        )}
      >
        {CONTINUE.title}
      </h2>
      <p className="m-0 font-sans text-[14px] leading-[16.7px] text-[#595959]">{CONTINUE.meta}</p>
      <div className="flex items-center gap-[10px]">
        <ProgressBar pct={CONTINUE.pct} label={CONTINUE.title} />
        <Pct>{CONTINUE.pct}%</Pct>
      </div>
      <div className="flex flex-wrap items-center gap-[10px] pt-[6px]">
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            log('click', 'resume module');
            data.resume(CONTINUE.courseId);
          }}
        >
          {CONTINUE.resume}
        </Button>
        <Button
          variant="tertiary"
          size="sm"
          className="!text-[#1c2a21]"
          onClick={() => {
            log('click', 'course overview');
            data.openCourse(CONTINUE.courseId);
          }}
        >
          {CONTINUE.overview}
        </Button>
      </div>
    </div>
  </section>
);

const AlsoInProgress = ({ items, data }) => (
  <section className="flex min-w-0 flex-col gap-[18px]">
    <h2 className={classNames('m-0 text-[22px] leading-[27.5px] text-[#1c2a21]', HEAD)}>
      {ALSO_IN_PROGRESS.heading}
    </h2>
    <div className="grid grid-cols-[minmax(0,1fr)] gap-[16px] md:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.id}
          className={classNames(
            'flex flex-wrap items-center gap-x-[14px] gap-y-[10px] rounded-[20px] py-[14px] pr-[16px] pl-[14px]',
            PLAIN
          )}
        >
          <div className="size-[64px] shrink-0 overflow-hidden rounded-[14px] sm:size-[84px]">
            <LearningCover kind={item.cover} />
          </div>
          <div className="flex min-w-[150px] flex-1 flex-col gap-[6px]">
            <h3
              className={classNames(
                'm-0 line-clamp-2 text-[19px] leading-[23.8px] text-[#1c2a21]',
                HEAD
              )}
            >
              {item.title}
            </h3>
            <p className="m-0 truncate font-sans text-[12.5px] leading-[14.9px] text-[#737373]">
              {item.meta}
            </p>
            <div className="flex items-center gap-[8px]">
              <ProgressBar pct={item.pct} label={item.title} />
              <Pct size={12.5}>{item.pct}%</Pct>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="max-sm:w-full"
            onClick={() => {
              log('click', 'resume', item.id);
              data.resume(item.courseId);
            }}
          >
            {ALSO_IN_PROGRESS.resume}
          </Button>
        </article>
      ))}
    </div>
  </section>
);

const SkillGaps = ({ learning, data }) => (
  <section className="flex min-w-0 flex-col gap-[18px]">
    <div className="flex items-center gap-[8px]">
      <h2
        className={classNames(
          'm-0 text-[20px] leading-[27.5px] whitespace-nowrap text-[#1c2a21] sm:text-[22px]',
          HEAD
        )}
      >
        {SKILL_GAPS.heading}
      </h2>
      <HubSticker tone="white" rotate={3} className="max-sm:hidden">
        {SKILL_GAPS.sticker}
      </HubSticker>
      <span className="flex-1" />
      <button
        type="button"
        className={classNames(MINI_LINK, 'text-[13.5px] leading-[16.1px]')}
        onClick={() => {
          log('click', 'see all');
          learning.update({ view: 'recommended' });
        }}
      >
        {data.live ? `See all ${data.gapsTotal} →` : SKILL_GAPS.seeAll}
      </button>
    </div>
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] items-start gap-[16px]">
      {data.gaps.map((key, i) => (
        <RecCard
          key={key}
          course={data.courses[key]}
          meta={data.courses[key].metaShort}
          playfulChip={GAP_CHIP[key] ?? (i === 0 ? 'default' : 'ink')}
          buttonLabel={SKILL_GAPS.start}
          onStart={() => {
            log('click', 'start course', key);
            data.openCourse(key);
          }}
        />
      ))}
    </div>
  </section>
);

const GoalRing = () => {
  // r=43.2 stroke 9.6 == Figma's 96px ring with innerRadius 0.8; arc starts at 12 o'clock.
  const r = 43.2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-[96px] shrink-0">
      <svg viewBox="0 0 96 96" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="9.6"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="#ffd86b"
          strokeWidth="9.6"
          strokeDasharray={`${c * WEEKLY.progress} ${c}`}
        />
      </svg>
      <span
        className={classNames(
          'absolute inset-0 flex items-center justify-center text-[22px] leading-[27.5px] text-white',
          HEAD
        )}
      >
        {WEEKLY.ring}
      </span>
    </div>
  );
};

const WeeklyGoal = () => (
  <section
    aria-label={WEEKLY.label}
    className={classNames('flex flex-col gap-[14px] rounded-[24px] bg-[#387440] p-[20px]', LIFT)}
  >
    <span className="font-sans text-[11.5px] max-lg:text-[12px] leading-[13.7px] font-bold text-[#c1d4c4]">
      {WEEKLY.label}
    </span>
    <div className="flex items-center gap-[16px]">
      <GoalRing />
      <div className="flex min-w-0 flex-col gap-[4px] playful:max-w-[170px]">
        <span className="font-sans text-[13px] leading-[15.5px] font-medium text-[#e1eae2]">
          {WEEKLY.done}
        </span>
        <span className={classNames('text-[17px] leading-[21.3px] text-white', HEAD)}>
          {WEEKLY.more}
        </span>
      </div>
    </div>
    <ul className="m-0 flex list-none justify-between gap-[6px] p-0">
      {WEEKLY.days.map((day, i) => (
        <li key={i} className="flex flex-col items-center gap-[4px]">
          <span
            className={classNames(
              'flex size-[30px] items-center justify-center rounded-full',
              day.on ? 'bg-[#ffd86b]' : 'bg-white/15',
              day.today && 'ring-2 ring-white ring-inset'
            )}
          >
            {day.on && <LearningStreakFlameIcon className="size-[15px]" />}
          </span>
          <span className="font-sans text-[11px] max-lg:text-[12px] leading-[13.1px] font-semibold text-[#c1d4c4]">
            {day.d}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

const LevelCard = () => (
  <section className={classNames('flex flex-col gap-[14px] rounded-[22px] p-[18px]', PLAIN)}>
    <div className="flex items-center gap-[10px]">
      <span className="flex size-[48.4px] shrink-0 items-center justify-center rounded-[14px] border border-[rgba(28,42,33,0.1)] bg-[#ffd86b] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]">
        <LearningZapIcon className="size-[22px]" />
      </span>
      <div className="flex min-w-0 flex-col gap-[2px]">
        <span className="font-sans text-[15px] leading-[17.9px] font-semibold text-[#1c2a21]">
          {LEVEL.title}
        </span>
        <span className="font-sans text-[12.5px] leading-[14.9px] text-[#737373]">
          {LEVEL.have} <Unit /> {LEVEL.next}
        </span>
      </div>
    </div>
    <div
      role="progressbar"
      aria-label={LEVEL.title}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(LEVEL.pct)}
      className="h-[8px] overflow-hidden rounded-full bg-[#e1eae2]"
    >
      <div className="h-full rounded-full bg-[#c8951a]" style={{ width: `${LEVEL.pct}%` }} />
    </div>
  </section>
);

// Focused: 22px pale chip; Playful: 32px GTH chip with a border.
const SkillChip = ({ children }) => (
  <>
    <span className="inline-flex rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[11.5px] max-lg:text-[12px] leading-[13.7px] font-semibold whitespace-nowrap text-[#2d5d33] playful:hidden">
      {children}
    </span>
    <span className="hidden h-[32px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] leading-[15.5px] font-semibold whitespace-nowrap text-[#387440] playful:inline-flex">
      {children}
    </span>
  </>
);

const CertificatesMini = ({ learning, certs: CERTS }) => (
  <section className={classNames('flex flex-col gap-[16px] rounded-[22px] p-[18px]', PLAIN)}>
    <div className="flex items-center gap-[8px]">
      <LearningAwardIcon className="size-[18px] shrink-0" />
      <h2 className="m-0 min-w-0 flex-1 truncate font-sans text-[15px] leading-[17.9px] font-semibold text-[#1c2a21]">
        {CERTS.title}
      </h2>
      <button
        type="button"
        className={classNames(MINI_LINK, 'text-[13px] leading-[15.5px]')}
        onClick={() => {
          log('click', 'view all certificates');
          learning.update({ view: 'certificates' });
        }}
      >
        {CERTS.viewAll}
      </button>
    </div>
    <p className="m-0 font-sans text-[12.5px] leading-[14.9px] text-[#737373]">{CERTS.latest}</p>
    <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
      {CERTS.skills.map((skill) => (
        <li key={skill} className="flex">
          <SkillChip>{skill}</SkillChip>
        </li>
      ))}
    </ul>
  </section>
);

const LearningInProgress = ({ learning }) => {
  const data = useLearningData();
  useEffect(() => {
    log('mount', { view: learning.view, tab: learning.tab, live: data.live });
  }, [learning.view, learning.tab, data.live]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-[24px] xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-[18px]">
        {data.continueItem && <ContinueCard item={data.continueItem} data={data} />}
        {data.also.length > 0 && <AlsoInProgress items={data.also} data={data} />}
        {data.gaps.length > 0 && <SkillGaps learning={learning} data={data} />}
      </div>
      <aside className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[16px] xl:grid-cols-1">
        {/* No backend for weekly lessons or levels yet: Figma copy in demo mode only. */}
        {!data.live && <WeeklyGoal />}
        {!data.live && <LevelCard />}
        <CertificatesMini learning={learning} certs={data.certs} />
      </aside>
    </div>
  );
};

export default LearningInProgress;
