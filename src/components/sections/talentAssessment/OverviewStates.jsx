import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HEADING, HubButton } from '../talentSkillsLab/HubParts.jsx';
import { HubArrowRightIcon, HubRefreshIcon, HubWifiOffIcon } from '../talentSkillsLab/HubIcons.jsx';
import { useLabText } from '../talentSkillsLab/labFormat.js';
import { AssessInfoIcon, AssessClockIcon } from './AssessmentIcons.jsx';
import { LabelsLegendCard } from './OverviewCards.jsx';
import { OvChip, OvSkeleton } from './OverviewParts.jsx';
import { OV_CARD_A, OV_ICONS, resolveRoute } from './overviewShared.js';
import {
  ASSESSMENT_OVERVIEW,
  FIRST_VISIT,
  OVERVIEW_ERROR,
  OVERVIEW_LOADING,
  OVERVIEW_ROUTES,
} from './assessmentData.js';

const log = debug('OverviewStates');

/*
 * OverviewStates — the non-default My Assessment overview bodies.
 *   FirstVisitBody  MA-01b (Playful 7965:9519 / Focused 8110:29133): hero, three steps, "What recruiters see right now", labels.
 *   LoadingBody     MA-01c (7965:10264 / 8110:29465): skeleton layout of the overview.
 *   ErrorBody       MA-01d (7987:11150 / 8110:35457): "We couldn't load your results"; props onRetry.
 */

const LockGlyph = OV_ICONS.lock;

const COLUMNS = 'grid items-start gap-[16px] lg:grid-cols-[minmax(0,1fr)_clamp(300px,31.6%,420px)]';

/* Art tiles of the hero: Focused flat tiles, Playful rotated about their top-left corner (Figma rotates that way). */
const TILE =
  'absolute flex size-[84px] items-center justify-center rounded-[25px] border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:origin-top-left playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

const HeroArt = () => {
  const Compass = OV_ICONS.compass;
  const Check = OV_ICONS.check;
  const Clip = OV_ICONS.clipboard;
  return (
    <div aria-hidden="true" className="relative h-[170px] w-[220px] shrink-0 max-sm:hidden">
      <span
        className={classNames(
          TILE,
          'left-0 top-[20px] bg-[#ffd86b] text-[#1c2a21] playful:rotate-[6deg]'
        )}
      >
        <Compass className="size-[42px]" />
      </span>
      <span
        className={classNames(
          TILE,
          'left-[90px] top-0 bg-white text-[#387440] playful:-rotate-[4deg]'
        )}
      >
        <Check className="size-[42px]" />
      </span>
      <span
        className={classNames(
          TILE,
          'left-[40px] top-[86px] bg-[#387440] text-white playful:rotate-[2deg]'
        )}
      >
        <Clip className="h-[43px] w-[38px]" />
      </span>
    </div>
  );
};

const FirstStep = ({ step }) => {
  const Glyph = OV_ICONS[step.icon];
  return (
    <section
      aria-labelledby={`ma-first-${step.id}`}
      className={classNames(OV_CARD_A, 'flex min-w-0 flex-col gap-[12px] p-[22px] max-sm:p-[16px]')}
    >
      <div className="flex items-center gap-[10px]">
        <span
          aria-hidden="true"
          className={classNames(
            'flex size-[30px] shrink-0 items-center justify-center rounded-full font-sans text-[14px] font-bold leading-[17px]',
            step.active ? 'bg-[#387440] text-white' : 'bg-[#f8f8f4] text-[#595959]'
          )}
        >
          {step.n}
        </span>
        <span
          aria-hidden="true"
          className="flex size-[36px] shrink-0 items-center justify-center rounded-[11px] bg-[#ebf1ec] text-[#387440]"
        >
          <Glyph className="size-[18px]" />
        </span>
      </div>
      <h2
        id={`ma-first-${step.id}`}
        className="m-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]"
      >
        {step.title}
      </h2>
      <p className="m-0 font-sans text-[13.5px] leading-[20px] text-[#595959]">{step.text}</p>
      <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
        <AssessClockIcon className="size-[14px] shrink-0" />
        {step.time}
      </p>
      {step.locked ? (
        <p className="m-0 flex items-center gap-[8px] rounded-[10px] bg-[#f8f8f4] px-[14px] py-[12px] font-sans text-[14px] font-semibold leading-[17px] text-[#595959]">
          <span aria-hidden="true" className="inline-flex shrink-0">
            <LockGlyph className="size-[16px]" />
          </span>
          {step.locked}
        </p>
      ) : (
        <HubButton
          tone={step.active ? 'primary' : 'secondary'}
          size="lg"
          to={resolveRoute(step.to)}
          rightIcon={step.active ? <HubArrowRightIcon className="size-full" /> : undefined}
          className="w-full"
        >
          {step.cta}
        </HubButton>
      )}
    </section>
  );
};

export const FirstVisitBody = ({ data = FIRST_VISIT }) => {
  const { t } = useLabText();
  useEffect(() => {
    log('first visit mount');
  }, []);
  return (
    <div className="flex flex-col gap-[24px]">
      <section
        aria-labelledby="ma-first-hero"
        className="flex items-center gap-[32px] rounded-[20px] bg-[#ebf1ec] p-[32px] max-lg:flex-col max-lg:items-start max-sm:p-[20px]"
      >
        <HeroArt />
        <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
          <p className="m-0 font-sans text-[11.5px] font-bold leading-[14px] tracking-[0.06em] text-[#387440] max-lg:text-[12px]">
            {data.hero.caption}
          </p>
          <h2
            id="ma-first-hero"
            className={classNames(
              HEADING,
              'text-[clamp(26px,1.85vw,32px)] leading-[1.19] tracking-[-0.01em]'
            )}
          >
            {data.hero.lead}
            <span className="text-[#387440]">{data.hero.accent}</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {data.hero.body}
          </p>
          <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[10px]">
            <HubButton
              tone="primary"
              size="lg"
              to={resolveRoute('personalityQuiz')}
              rightIcon={<HubArrowRightIcon className="size-full" />}
            >
              {data.hero.cta}
            </HubButton>
            <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#595959]">
              {t(data.hero.meta)}
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 items-start gap-[16px] max-lg:grid-cols-1">
        {data.steps.map((step) => (
          <FirstStep key={step.id} step={step} />
        ))}
      </div>

      <div className={COLUMNS}>
        <section
          aria-labelledby="ma-first-seen"
          className={classNames(OV_CARD_A, 'flex flex-col gap-[12px] p-[24px] max-sm:p-[16px]')}
        >
          <h2
            id="ma-first-seen"
            className="m-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]"
          >
            {data.seen.title}
          </h2>
          <div>
            {data.seen.rows.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between gap-[12px] border-0 border-t border-solid border-[rgba(28,42,33,0.08)] py-[10px]"
              >
                <span className="font-sans text-[14.5px] font-semibold leading-[17px] text-[#1c2a21]">
                  {row.label}
                </span>
                <OvChip tone="quiet">{row.value}</OvChip>
              </div>
            ))}
          </div>
        </section>
        <LabelsLegendCard data={ASSESSMENT_OVERVIEW.labelsLegend} compact />
      </div>
    </div>
  );
};

const SkeletonCard = ({ lines }) => (
  <div className={classNames(OV_CARD_A, 'flex flex-col gap-[12px] p-[24px] max-sm:p-[16px]')}>
    <OvSkeleton className="h-[18px] w-[200px] max-w-full" />
    {Array.from({ length: lines }, (_, i) => (
      <OvSkeleton key={i} className="h-[12px] w-full" />
    ))}
  </div>
);

export const LoadingBody = ({ copy = OVERVIEW_LOADING }) => {
  useEffect(() => {
    log('loading mount');
  }, []);
  return (
    <div aria-busy="true" className="flex flex-col gap-[24px]">
      <p
        role="status"
        className="m-0 flex items-center gap-[8px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]"
      >
        <HubRefreshIcon className="size-[16px] shrink-0" />
        {copy.note}
      </p>
      <div className={classNames(OV_CARD_A, 'flex flex-col gap-[16px] p-[24px] max-sm:p-[16px]')}>
        <OvSkeleton className="h-[20px] w-[420px] max-w-full" />
        <OvSkeleton className="h-[12px] w-[600px] max-w-full" />
        <div className="grid grid-cols-4 gap-[14px] max-lg:grid-cols-2 max-sm:grid-cols-1">
          {[0, 1, 2, 3].map((i) => (
            <OvSkeleton key={i} className="h-[120px] rounded-[16px]" />
          ))}
        </div>
      </div>
      <div className={COLUMNS}>
        <div className="flex min-w-0 flex-col gap-[16px]">
          <SkeletonCard lines={6} />
          <SkeletonCard lines={7} />
        </div>
        <div className="flex min-w-0 flex-col gap-[16px]">
          <SkeletonCard lines={3} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={5} />
        </div>
      </div>
    </div>
  );
};

export const ErrorBody = ({ onRetry, copy = OVERVIEW_ERROR }) => {
  useEffect(() => {
    log('error mount', copy.code);
  }, [copy.code]);
  return (
    <section
      aria-labelledby="ma-error-title"
      className={classNames(
        OV_CARD_A,
        'flex flex-col items-center gap-[14px] p-[48px] text-center max-sm:px-[16px] max-sm:py-[32px]'
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-[72px] shrink-0 items-center justify-center rounded-[22px] bg-[#f9ebea] text-[#902b20]"
      >
        <HubWifiOffIcon className="size-[36px]" />
      </span>
      <h2
        id="ma-error-title"
        className={classNames(
          HEADING,
          'text-[clamp(22px,1.5vw,26px)] leading-[1.2] tracking-[-0.01em]'
        )}
      >
        {copy.title}
      </h2>
      <p className="m-0 font-sans text-[15px] leading-[18px] text-[#595959] max-sm:leading-[22px]">
        {copy.body}
      </p>
      <div className="flex flex-wrap items-start justify-center gap-[12px]">
        <HubButton tone="secondary" size="lg" to={OVERVIEW_ROUTES.home}>
          {copy.home}
        </HubButton>
        <HubButton tone="primary" size="sm" onClick={onRetry}>
          {copy.retry}
        </HubButton>
      </div>
      <p className="m-0 flex items-center gap-[6px] font-sans text-[12.5px] leading-[15px] text-[#595959]">
        <AssessInfoIcon className="size-[14px] shrink-0" />
        {copy.code}
      </p>
    </section>
  );
};
