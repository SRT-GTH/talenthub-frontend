import { Link } from 'react-router-dom';
import { DATA_BASE } from '../publicDataNav.js';
import { PublicIconInfo } from '../publicDataIcons.jsx';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import { TRENDS_COPY } from './data/outcomesData.js';
import TrendCard from './TrendCard.jsx';

/*
 * TrendsView — Figma 8.5.2a/b/c (8496:347768 / 347982 / 348215) + phone 8508:186 + tablet 8516:356410.
 * breadcrumb "Outcomes › Growth trends" (14/17) · page header (h1 "Growth over time" 34/41 600 -0.34 + the range sentence 16/19 #595959; range control
 * "90 days · 1 year · All time" on the right) · 2x2 chart cards (gap 24) · note "Each chart has its own scale. …" (13/16 #595959, info icon 16 #70706e).
 * Phone: no breadcrumb, h1 26/31 (the subtitle line is an empty text layer in Figma, so it is not rendered), the range control full width (358x40, 13/16),
 * three cards (Total talents · New sign-ups · Placements; Assessments completed is not drawn on the phone frame), 16 apart.
 * Range = ?range=90d|1y|all (default 1y, as the phone/tablet frames draw it). Props: trends (response), range, onRange, base (route prefix, default /data), embedded (agency portal: no header, no own padding; opt-in)
 */

const TrendsView = ({ trends, range, onRange, base = DATA_BASE, embedded = false }) => (
  <div
    className={
      embedded
        ? 'flex flex-col gap-[16px] md:gap-[24px]'
        : 'flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px] md:gap-[24px] md:px-[28px] md:pt-[24px] md:pb-[48px] xl:px-[40px]'
    }
  >
    <nav
      aria-label="Breadcrumb"
      className="hidden items-center gap-[8px] font-sans text-[14px] leading-[17px] md:flex"
    >
      <Link
        to={`${base}/outcomes`}
        className="inline-flex min-h-[24px] items-center font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        {TRENDS_COPY.breadcrumbRoot}
      </Link>
      <span aria-hidden="true" className="text-[#595959]">
        ›
      </span>
      <span aria-current="page" className="font-medium text-[#1c2a21]">
        {TRENDS_COPY.breadcrumbCurrent}
      </span>
    </nav>
    <header
      hidden={embedded}
      className="flex flex-wrap items-end justify-between gap-x-[16px] gap-y-[12px]"
    >
      <div className="flex min-w-0 flex-col gap-[4px] font-sans md:gap-[6px]">
        <h1 className="m-0 text-[26px] leading-[31px] font-semibold tracking-[-0.13px] text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.34px]">
          {TRENDS_COPY.title}
        </h1>
        <p
          className="m-0 hidden text-[16px] leading-[19px] text-[#595959] md:block"
          aria-live="polite"
        >
          {trends.subtitle}
        </p>
      </div>
      <SegmentedControl
        options={TRENDS_COPY.ranges}
        value={range}
        onChange={onRange}
        ariaLabel="Time range"
        className="max-md:w-full max-md:[&>button]:flex-1"
      />
    </header>
    <div className="grid gap-[16px] md:grid-cols-2 md:gap-[24px]">
      {trends.charts.map((chart) => (
        <TrendCard
          key={`${trends.range}-${chart.id}`}
          chart={chart}
          className={chart.id === 'assessments' ? 'max-md:hidden' : undefined}
        />
      ))}
    </div>
    <p className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-[16px] text-[#595959]">
      <PublicIconInfo className="size-[16px] shrink-0 text-[#70706e]" />
      {TRENDS_COPY.footnote}
    </p>
  </div>
);

export default TrendsView;
