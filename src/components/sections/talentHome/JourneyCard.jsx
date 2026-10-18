import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import {
  TalentHomeArrowRightGreenIcon,
  TalentHomeCheckWhiteIcon,
  TalentHomeChevronIcon,
  TalentHomeEyeOffIcon,
  TalentHomeJourneyCompleteTrophyIcon,
  TalentHomeMilestoneEyeIcon,
  TalentHomeMilestoneEyeReachedIcon,
  TalentHomeMilestoneTrendUpIcon,
  TalentHomeMilestoneTrophyIcon,
} from '../../shared/assets.jsx';
import { CARD_INK, CARD_SOFT, CtaButton, HEAD, MetaPill, Sticker } from './coreUi.jsx';
import { HomeTabs } from './TabsParts.jsx';
import { JOURNEY_COPY } from './talentHomeCoreData.js';

const log = debug('JourneyCard');

const CAREER_BUDDY_ROUTE = '/profile/filling/career-buddy';

const NODE_SHADOW =
  'shadow-[0_1px_1px_rgba(28,42,33,0.04),0_2px_5.5px_rgba(28,42,33,0.03)] playful:shadow-[0_1px_1px_rgba(28,42,33,0.04),0_4px_8px_rgba(28,42,33,0.06)]';

const MILESTONE_ICON = {
  Discoverable: [
    TalentHomeMilestoneEyeIcon,
    TalentHomeMilestoneEyeReachedIcon,
    'h-[11.4px] w-[12px]',
  ],
  'Top 20%': [TalentHomeMilestoneTrendUpIcon, TalentHomeMilestoneTrendUpIcon, 'size-[12px]'],
  'Top Talent': [TalentHomeMilestoneTrophyIcon, TalentHomeMilestoneTrophyIcon, 'size-[12px]'],
};

const Milestone = ({ label, reached }) => {
  const [Pending, Reached, size] = MILESTONE_ICON[label];
  const Icon = reached ? Reached : Pending;
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-[4px] rounded-full border py-[3px] pr-[8px] pl-[6px] text-[12px] leading-[normal] font-bold whitespace-nowrap',
        reached
          ? 'border-[rgba(28,42,33,0.12)] bg-[#ffd86b] text-[#1c2a21] playful:border-[#1c2a21]'
          : 'border-dashed border-[#c1d4c4] bg-white text-[#387440]'
      )}
    >
      <Icon className={size} />
      {label}
    </span>
  );
};

const Stage = ({ stage, index, doneCount, currentIndex }) => {
  // Real data carries a per-stage flag (stages can be done out of order); demo data does not.
  const done = typeof stage.done === 'boolean' ? stage.done : index < doneCount;
  const current = index === currentIndex && !done;
  return (
    <li
      aria-current={current ? 'step' : undefined}
      className="flex w-[56px] shrink-0 flex-col items-center gap-[8px] lg:w-[72px]"
    >
      <span
        className={classNames(
          'flex size-[44px] items-center justify-center rounded-full leading-[normal]',
          done && classNames('border border-[rgba(28,42,33,0.1)] bg-[#387440]', NODE_SHADOW),
          current &&
            classNames(
              'border border-[rgba(28,42,33,0.1)] bg-white text-[15px] font-bold text-[#1c2a21]',
              NODE_SHADOW
            ),
          !done &&
            !current &&
            'border border-[#e7e7e7] bg-[#f7f8f4] text-[14px] font-semibold text-[#595959]'
        )}
      >
        {done ? <TalentHomeCheckWhiteIcon className="size-[18px]" /> : index + 1}
      </span>
      <span
        className={classNames(
          'text-[12px] leading-[normal] whitespace-nowrap',
          done && 'font-medium text-[#1c2a21]',
          current && 'font-bold text-[#1c2a21]',
          !done && !current && 'font-medium text-[#595959]'
        )}
      >
        {stage.label}
      </span>
      {stage.badge ? <Milestone label={stage.badge} reached={done} /> : null}
    </li>
  );
};

const Expanded = ({ home, copy }) => {
  const { snapshot } = home;
  const { stages, doneCount, currentStageIndex } = snapshot;
  const day1 = home.stateKey === 'day1';
  return (
    <section
      id="talent-home-journey"
      data-tour-target="journey"
      aria-label="Your profile journey"
      className={classNames(
        'flex flex-col gap-[clamp(14px,1.4vw,20px)] rounded-[24px] bg-white px-[clamp(12px,1.6vw,28px)] pt-[clamp(14px,1.4vw,24px)] pb-[clamp(14px,1.6vw,28px)]',
        day1 ? CARD_INK : CARD_SOFT
      )}
    >
      <div className="flex items-center gap-[10px]">
        <h2
          className={classNames(
            HEAD,
            'text-[clamp(18px,1.3vw,22px)] leading-[1.25] whitespace-nowrap'
          )}
        >
          <span className="text-[#1c2a21]">Your profile </span>
          <span className="text-[#387440]">journey</span>
        </h2>
        <span className="flex-1" />
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-[4px] text-[14px] font-semibold whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <span className="max-[400px]:sr-only">Journey map</span>
          <TalentHomeArrowRightGreenIcon className="size-[15px]" />
        </button>
        <button
          type="button"
          aria-label="Minimize"
          aria-expanded="true"
          onClick={() => {
            log('minimise');
            home.update({ journey: 'min' });
          }}
          className={classNames(
            'flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(28,42,33,0.1)] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            NODE_SHADOW
          )}
        >
          <TalentHomeChevronIcon className="size-[16px] rotate-180" />
        </button>
      </div>
      <div className="flex flex-wrap gap-[8px]">
        <MetaPill tone="green">{copy.metaDone}</MetaPill>
        <MetaPill tone="amber">{copy.metaNext}</MetaPill>
        {copy.metaSaved ? <MetaPill tone="grey">{copy.metaSaved}</MetaPill> : null}
      </div>
      <div className="-mx-[clamp(12px,1.6vw,28px)] overflow-x-auto px-[clamp(12px,1.6vw,28px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ol className="m-0 flex min-w-[568px] list-none items-start p-0">
          {stages.map((stage, i) => (
            <Fragment key={stage.id}>
              <Stage
                stage={stage}
                index={i}
                doneCount={doneCount}
                currentIndex={currentStageIndex}
              />
              {i < stages.length - 1 ? (
                <li aria-hidden="true" className="flex min-w-[8px] flex-1 flex-col pt-[21px]">
                  <span
                    className={classNames(
                      'h-[3px] w-full rounded-[2px]',
                      i < doneCount ? 'bg-[#387440]' : 'bg-[#dcdfd6]'
                    )}
                  />
                </li>
              ) : null}
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
};

const SEG = { done: 'bg-[#387440]', now: 'bg-[#c8951a]', todo: 'bg-[#dcdfd6]' };

const Minimized = ({ home }) => {
  const navigate = useNavigate();
  const { snapshot } = home;
  const { stages, doneCount } = snapshot;
  const copy = (home.content?.journeyCopy ?? JOURNEY_COPY).min;
  const r = 21.36; // 48px ring, 5.28 stroke
  const c = 2 * Math.PI * r;
  const pct = (doneCount / stages.length) * 100;
  return (
    <section
      id="talent-home-journey"
      data-tour-target="journey"
      aria-label="Your profile journey"
      className={classNames(
        'flex flex-wrap items-center gap-x-[clamp(12px,1.3vw,18px)] gap-y-[10px] rounded-[22px] bg-white py-[16px] pr-[16px] pl-[clamp(14px,1.2vw,20px)]',
        CARD_INK
      )}
    >
      <span className="relative size-[48px] shrink-0">
        <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r={r} fill="none" stroke="#d6e5d9" strokeWidth="5.28" />
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke="#387440"
            strokeWidth="5.28"
            strokeLinecap="round"
            strokeDasharray={`${(c * pct) / 100} ${c}`}
            transform="rotate(-90 24 24)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[16px] font-bold text-[#1c2a21]">
          {copy.count}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[4px] sm:flex-none">
        <span className="text-[16px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
          {copy.title}
        </span>
        <span className="text-[13px] leading-[normal] text-[#595959] max-sm:truncate sm:whitespace-nowrap">
          {copy.sub}
        </span>
      </span>
      <span aria-hidden="true" className="hidden items-center gap-[4px] md:flex">
        {stages.map((s, i) => (
          <span
            key={s.id}
            className={classNames(
              'h-[6px] w-[26px] rounded-[3px]',
              SEG[i < doneCount ? 'done' : i === doneCount ? 'now' : 'todo']
            )}
          />
        ))}
      </span>
      <span className="hidden flex-1 md:block" />
      <CtaButton size="sm" onClick={() => navigate(CAREER_BUDDY_ROUTE)} className="max-md:hidden">
        {copy.cta}
      </CtaButton>
      <button
        type="button"
        aria-label="Expand"
        aria-expanded="false"
        onClick={() => {
          log('expand');
          home.update({ journey: null });
        }}
        className={classNames(
          'flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(28,42,33,0.1)] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          NODE_SHADOW
        )}
      >
        <TalentHomeChevronIcon className="size-[16px]" />
      </button>
    </section>
  );
};

const Complete = () => {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const copy = JOURNEY_COPY.complete;
  if (hidden) return null;
  return (
    <section
      id="talent-home-journey"
      data-tour-target="journey"
      aria-label="Profile complete"
      className={classNames(
        'relative flex flex-wrap items-center gap-x-[20px] gap-y-[12px] rounded-[22px] bg-gradient-to-r from-[#2a5730] to-[#387440] py-[18px] pr-[18px] pl-[clamp(14px,1.3vw,22px)]',
        CARD_INK
      )}
    >
      <span
        className={classNames(
          'flex size-[56px] shrink-0 items-center justify-center rounded-full border border-[rgba(28,42,33,0.1)] bg-[#ffd86b]',
          NODE_SHADOW
        )}
      >
        <TalentHomeJourneyCompleteTrophyIcon className="size-[28px]" />
      </span>
      <span className="flex min-w-0 flex-col gap-[4px] text-white">
        <span className={classNames(HEAD, 'text-[clamp(20px,1.45vw,25px)] leading-[1.2]')}>
          {copy.title.map(([text, accent], i) => (
            <span key={i} className={accent ? 'text-[#ffd86b]' : undefined}>
              {text}
            </span>
          ))}
        </span>
        <span className="text-[13px] leading-[normal] font-medium">{copy.sub}</span>
      </span>
      <span aria-hidden="true" className="hidden items-center gap-[4px] xl:flex">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="h-[6px] w-[26px] rounded-[3px] bg-[#387440] playful:bg-[#84cc16]"
          />
        ))}
      </span>
      <span className="flex-1" />
      <CtaButton size="lg" onClick={() => navigate('/profile')}>
        {copy.cta}
      </CtaButton>
      <button
        type="button"
        onClick={() => {
          log('hide complete card');
          setHidden(true);
        }}
        className="inline-flex cursor-pointer items-center gap-[6px] rounded-full border border-[rgba(255,255,255,0.6)] px-[10px] py-[8px] text-[13px] leading-[normal] font-semibold whitespace-nowrap text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <TalentHomeEyeOffIcon className="size-[16px]" />
        {copy.hide}
      </button>
      <Sticker className="top-[-13.5px] left-[65px]" color="bg-[#84cc16]" rotate="rotate-[6deg]">
        {copy.sticker}
      </Sticker>
    </section>
  );
};

const JourneyCard = ({ home }) => {
  const key = home.stateKey;
  log('render', { key, min: home.journeyMin });

  const tabs = (
    <HomeTabs
      active="home"
      tabs={home.tabs}
      onSelect={(id) => home.update({ tab: id === 'home' ? null : id })}
    />
  );

  // HM-05 Edit home: tab bar dimmed, no "Profile complete" banner.
  if (home.editOpen && (key === 'top' || key === 'complete'))
    return (
      <div className="pointer-events-none opacity-50" aria-hidden="true">
        {tabs}
      </div>
    );
  if (key === 'top') return tabs;
  if (key === 'complete')
    return (
      <>
        <Complete />
        {tabs}
      </>
    );
  if (home.journeyMin) return <Minimized home={home} />;
  const J = home.content?.journeyCopy ?? JOURNEY_COPY;
  return <Expanded home={home} copy={J[key] ?? J.day1} />;
};

export default JourneyCard;
