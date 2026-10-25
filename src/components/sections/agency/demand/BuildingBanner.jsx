import Button from '../../../ui/Button.jsx';
import { AgencyArrowRightIcon } from '../agencyIcons.jsx';
import { DemandHourglassIcon } from './demandIcons.jsx';
import { TREND_BUILDING } from './data/demandData.js';

/*
 * BuildingBanner — "Banner · Generating in background" (Figma 8705:419059, 1329x144: #ebf1ec r20, p 20/24, gap 16): hourglass tile 42 (white r12), title 17/20 600, body 13/16 #575755,
 * progress (track 420x8 white r4, fill #387440, "40% · about 1 minute left" 12/14 500 #387440) and two actions: "Notify me when ready →" (primary) and "Use last 90 days".
 * Props: progress (0-100), notified (boolean), onNotify(), onFallback(). The progress text is a polite live region; the bar is a role="progressbar".
 * ⚠️ ASSUMPTION: the job is mocked (starts at 40%, +10% every 2 s); "Notify me" only confirms in the live line (no real notification exists).
 */

const BuildingBanner = ({ progress, notified, onNotify, onFallback }) => (
  <section
    aria-label={TREND_BUILDING.title}
    className="flex min-w-0 flex-col gap-[16px] rounded-[20px] bg-[#ebf1ec] px-[16px] py-[20px] font-sans md:px-[24px] lg:flex-row lg:items-center"
  >
    <span
      aria-hidden="true"
      className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px] bg-white text-[#387440]"
    >
      <DemandHourglassIcon className="size-[22px]" />
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <h2 className="m-0 text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
        {TREND_BUILDING.title}
      </h2>
      <p className="m-0 max-w-[720px] text-[13px] leading-[16px] text-[#575755]">
        {TREND_BUILDING.body}
      </p>
      <div className="flex items-center gap-[10px]">
        <div
          role="progressbar"
          aria-label="Building the 22-month view"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-[8px] w-full max-w-[420px] rounded-[4px] bg-white"
        >
          <div
            className="h-full rounded-[4px] bg-[#387440] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span
          role="status"
          aria-live="polite"
          className="text-[12px] leading-[14px] font-medium whitespace-nowrap text-[#387440]"
        >
          {`${progress}% · ${progress < 70 ? 'about 1 minute left' : 'less than a minute left'}`}
        </span>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="m-0 text-[12px] leading-[14px] font-medium text-[#387440]"
      >
        {notified ? TREND_BUILDING.notified : ''}
      </p>
    </div>
    <div className="flex shrink-0 flex-col gap-[8px] max-lg:items-start">
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={onNotify}
        className="!rounded-[10px] !px-[18px] !py-[10px] !text-[14px]"
      >
        <span className="inline-flex items-center gap-[8px]">
          {TREND_BUILDING.notify}
          <AgencyArrowRightIcon className="size-[20px]" />
        </span>
      </Button>
      <Button
        type="button"
        variant="tertiary-subtle"
        size="md"
        onClick={onFallback}
        className="!w-fit !rounded-[14px] !px-[34px] !py-[14px]"
      >
        {TREND_BUILDING.fallback}
      </Button>
    </div>
  </section>
);

export default BuildingBanner;
