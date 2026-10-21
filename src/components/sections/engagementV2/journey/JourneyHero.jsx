import { classNames } from '../../../../utils/classNames.js';
import { COPY } from './journeyData.js';
import { DiamondIcon, EyeIcon, MapIcon, TrophyIcon } from './JourneyIcons.jsx';

const MS_ICON = { 1: EyeIcon, 2: TrophyIcon, 3: DiamondIcon };
/* Offsets (px of the 400px segments row) of the three milestone captions, from Figma. */
const MS_LEFT = [50, 182, 334];

const Ring = ({ pct, gold }) => {
  const r = 32.4;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative flex size-[72px] shrink-0 items-center justify-center">
      <svg
        className="absolute inset-0"
        width="72"
        height="72"
        viewBox="0 0 72 72"
        aria-hidden="true"
      >
        <circle cx="36" cy="36" r={r} fill="none" stroke="#ebf1ec" strokeWidth="7.2" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={gold ? '#c8951a' : '#387440'}
          strokeWidth="7.2"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform="rotate(-90 36 36)"
        />
      </svg>
      <span className="relative font-sans text-[18px] font-bold leading-[21px] text-[#1c2a21]">
        {pct}%
      </span>
    </span>
  );
};

/* Progress card of the hero: ring, "n of 9 stages done", next milestone line, 9 segments + milestone captions. */
const ProgressCard = ({ model }) => {
  const { done, pct, next, progress, unlocked } = model;
  const allDone = !next;
  const NextIcon = allDone ? DiamondIcon : MS_ICON[next.n];
  const segs = Array.from({ length: 9 }, (_, i) => i);
  return (
    <div
      className={classNames(
        'flex w-full max-w-[538px] items-center gap-[20px] rounded-[20px] border border-[rgba(28,42,33,0.1)] bg-white pb-[20px] pl-[20px] pr-[24px] pt-[20px]',
        'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] max-sm:gap-[12px] max-sm:p-[14px]'
      )}
    >
      <Ring pct={pct} gold={allDone} />
      <div className="flex min-w-0 flex-1 flex-col gap-[8px] font-sans">
        <span className="text-[16px] font-semibold leading-[19px] text-[#1c2a21]">
          {done} of {model.total} stages done{progress ? ' · 1 in progress' : ''}
        </span>
        <span className="flex items-center gap-[6px] text-[13px] font-medium leading-[16px] text-[#785910]">
          <NextIcon className="size-[15px] shrink-0" />
          {allDone
            ? 'All 3 milestones unlocked'
            : `Next milestone: ${next.label} · ${next.at - done} stages to go`}
        </span>
        <div className="relative h-[34px] w-full max-w-[400px]">
          <div className="flex w-full gap-[5px]">
            {segs.map((i) => (
              <span
                key={i}
                className={classNames(
                  'relative h-[8px] flex-1 rounded-[4px]',
                  i < done ? (allDone ? 'bg-[#c8951a]' : 'bg-[#387440]') : 'bg-[#e7e7e7]'
                )}
              >
                {i === done && progress ? (
                  <span className="absolute inset-y-0 left-0 w-1/2 rounded-[4px] bg-[#387440]" />
                ) : null}
              </span>
            ))}
          </div>
          {[1, 2, 3].map((n) => {
            const Glyph = MS_ICON[n];
            const on = unlocked.includes(n);
            return (
              <span
                key={n}
                className={classNames(
                  'absolute top-[16px] flex items-center gap-[4px] whitespace-nowrap text-[11px] font-semibold leading-[13px] max-sm:hidden',
                  on ? 'text-[#785910]' : 'text-[#737373]'
                )}
                style={{ left: `${(MS_LEFT[n - 1] / 400) * 100}%` }}
              >
                <Glyph className="size-[12px]" />
                {['Discoverable', 'Top 20%', 'Top Talent'][n - 1]}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const JourneyHero = ({ model }) => (
  <section
    className="border-0 bg-[linear-gradient(90deg,#ebf1ec_0%,#fffefc_55%,#faf4e8_100%)] px-[clamp(16px,3.7vw,64px)] pb-[clamp(12px,1.04vw,18px)] pt-[clamp(16px,1.39vw,24px)]"
    aria-label="Profile journey"
  >
    <div className="mx-auto flex max-w-[1728px] flex-wrap items-start justify-between gap-x-[24px] gap-y-[20px]">
      <div className="mt-[4px] flex max-w-[620px] flex-col gap-[10px]">
        <span className="flex items-center gap-[6px] font-sans text-[12px] font-semibold leading-[14px] tracking-[1.2px] text-[#387440]">
          <MapIcon className="size-[14px]" />
          {COPY.eyebrow}
        </span>
        <h1 className="m-0 font-sans text-[clamp(30px,2.55vw,44px)] font-semibold leading-[1.096] text-[#111111] playful:font-heading">
          <span className="text-[#1c2a21]">{COPY.titleLead}</span>
          <span className="text-[#387440]">{COPY.titleAccent}</span>
        </h1>
        <p className="m-0 font-sans text-[16px] font-normal leading-[24px] text-[#595959]">
          {model.current ? COPY.sub : COPY.subDone}
        </p>
      </div>
      <ProgressCard model={model} />
    </div>
  </section>
);

export default JourneyHero;
