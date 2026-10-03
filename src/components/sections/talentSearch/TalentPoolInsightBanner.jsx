import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { InsightTrendWatermark } from './talentSearchIcons.jsx';
import { AVERAGE_MATCH, TALENT_POOL_INSIGHT } from './talentSearchData.js';

const log = debug('TalentPoolInsightBanner');

/*
 * TalentPoolInsightBanner — the bento row that splits the two result grids.
 * Figma 7249:74582: an 878px green insight panel on the LEFT (x=2526) and a
 * 427px white analytics tile on the RIGHT (x=3428), 24px apart
 * (878 + 24 + 427 = 1329). Figma's child ORDER lists the tile first, but the
 * x coordinates are what place them — hence green-then-white here.
 *
 * FONT NOTE — Figma sets the banner heading in Playfair Display 18/28
 * (7249:74595). Playfair is not loaded anywhere in this project and appears on
 * this one node only; every other serif in the file (including the "78%" stat
 * right next to it) is Instrument Serif, which IS the documented display face.
 * Treated as designer drift and rendered in `font-display` rather than pulling
 * in a second serif family for a single string. Flagged in
 * wiki/figma-node-map.md — swap to Playfair if it was deliberate.
 */
const TalentPoolInsightBanner = ({ onViewReport, className }) => {
  log('render', { averageMatch: AVERAGE_MATCH.value });

  return (
    <div
      className={classNames('flex w-full flex-col items-stretch gap-[24px] lg:flex-row', className)}
    >
      {/* Insight panel — Figma 7249:74588, flood #387440, r12, padding 24 */}
      <div className="relative flex min-w-0 flex-1 items-center overflow-hidden rounded-[12px] bg-brand-green p-[24px]">
        {/* Figma 7249:74593: 100x60 at left 794 / top 144 inside the 878x188
            panel, so it bleeds off the bottom-right corner and gets clipped. */}
        <InsightTrendWatermark className="pointer-events-none absolute left-[90.43%] top-[76.6%] h-[60px] w-[100px] text-white opacity-[0.10]" />

        <div className="relative flex max-w-[433px] flex-col gap-[8px]">
          <h3 className="font-display not-italic text-[18px] leading-7 text-white">
            {TALENT_POOL_INSIGHT.heading}
          </h3>
          {/* Figma node opacity 0.90 on the body block; whitespace-pre-line
              preserves its three hard line breaks. */}
          <p className="whitespace-pre-line pb-[8px] font-sans text-[16px] leading-6 tracking-[0.2px] text-white opacity-90">
            {TALENT_POOL_INSIGHT.body}
          </p>
          <button
            type="button"
            onClick={() => {
              log('branch', { action: 'view-market-report', wired: false });
              onViewReport?.();
            }}
            className="inline-flex h-[28px] w-fit items-center justify-center rounded-full bg-white px-[16px] font-sans text-[12px] font-bold leading-4 text-brand-green transition-colors hover:bg-neutral"
          >
            {TALENT_POOL_INSIGHT.action}
          </button>
        </div>
      </div>
      {/* Analytics tile — Figma 7249:74583, 427x188, centred column */}
      <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-[12px] border border-border-card bg-white px-[24px] py-[48.5px] lg:w-[427px]">
        <p className="font-sans text-[11px] font-semibold leading-[15.4px] tracking-[0.44px] text-content-muted">
          {AVERAGE_MATCH.label}
        </p>
        <p className="font-display not-italic text-[36px] leading-10 text-brand-green">
          {AVERAGE_MATCH.value}
        </p>
        <p className="pt-[7px] font-sans text-[11px] leading-[17.6px] text-[#6b6a63]">
          {AVERAGE_MATCH.caption}
        </p>
      </div>
    </div>
  );
};

export default TalentPoolInsightBanner;
