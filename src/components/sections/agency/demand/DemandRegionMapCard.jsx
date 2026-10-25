import { useMemo, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { formatCount, isSuppressed } from '../agencyFormat.js';
import GhanaMap from '../../publicData/map/GhanaMap.jsx';
import { REGION_LABELS } from '../../publicData/map/ghanaMapGeometry.js';
import MapLegend from '../../publicData/map/MapLegend.jsx';
import MapTopRegions from '../../publicData/map/MapTopRegions.jsx';
import { MAP_REGIONS_SAMPLE } from '../../publicData/map/data/mapData.js';
import DemandCard from './DemandCard.jsx';
import { regionById } from '../../publicData/regionsList.js';

/*
 * DemandRegionMapCard — "Demand by region" (Figma 8702:77, 808 wide: header 'Demand by region' + hint, map 400 | gap 32 | legend + divider + "Top 5 regions by opportunities"
 * + "Compare regions"). Theme 8's GhanaMap / MapLegend / MapTopRegions, shaded by TALENTS per region exactly as the frame draws it (legend "Talents per region"),
 * while the list and the hover card speak about OPPORTUNITIES (the demand screen's unit).
 * Theme 8's own hover card says "talents", so it is hidden here and replaced by the opportunity card of 11.4.5m (name · "Too few opportunities to show" /
 * "Fewer than 5 opportunities, hidden to protect privacy"); a REQUEST to the lead asks for an opt-in unit prop on GhanaMap instead.
 * Props: title, hint, opps { [regionId]: number } (opportunities per region), top [{id,count}], forcedHover (region id), onOpenRegion(id), onCompare().
 * Click / Enter on a region opens its district drill-down (?region=). Counts only through formatCount (<5 rule).
 */

const HIDE_THEME8_CARD = "[&_[role='tooltip']]:invisible [&_[role='dialog']]:invisible";

const DemandRegionMapCard = ({
  title = 'Demand by region',
  hint,
  opps,
  top,
  forcedHover,
  onOpenRegion,
  onCompare,
}) => {
  const [hover, setHover] = useState(null);
  const regions = MAP_REGIONS_SAMPLE;
  const topRows = useMemo(
    () =>
      top.map((t, i) => ({
        id: t.id,
        name: regionById(t.id)?.name ?? t.id,
        count: t.count,
        rank: i + 1,
      })),
    [top]
  );
  const forcedActive = useMemo(
    () => (forcedHover ? { id: forcedHover, mode: 'hover' } : null),
    [forcedHover]
  );
  const activeId = forcedHover ?? hover?.id ?? null;
  const label = activeId ? REGION_LABELS[activeId] : null;
  const count = activeId ? (opps?.[activeId] ?? 0) : 0;
  const low = isSuppressed(count);

  return (
    <DemandCard
      id="demand-by-region"
      title={title}
      hint={hint}
      className="min-w-0"
      bodyClassName="@container px-[24px] pb-[24px]"
    >
      <div className="flex min-w-0 flex-col gap-[16px] @min-[758px]:flex-row @min-[758px]:gap-[32px]">
        <div
          className={classNames(
            'relative mx-auto w-full max-w-[240px] @min-[560px]:max-w-[400px] @min-[758px]:mx-0 @min-[758px]:w-[400px] @min-[758px]:shrink-0',
            HIDE_THEME8_CARD
          )}
        >
          <GhanaMap
            regions={regions}
            ariaLabel="Map of Ghana’s 16 regions, shaded by number of talents. Select a region for its districts."
            onActiveChange={setHover}
            onPinnedChange={(id) => id && onOpenRegion?.(id)}
            {...(forcedActive ? { active: forcedActive } : {})}
          />
          {label ? (
            <div
              role="status"
              className="pointer-events-none absolute z-20 flex w-[240px] flex-col gap-[8px] rounded-[14px] border border-solid border-[#e7e7e7] bg-white px-[16px] py-[14px] font-sans shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              style={{
                left: `min(${label.x + 18}px, calc(100% - 240px))`,
                top: Math.max(label.y - 50, 0),
              }}
            >
              <p className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
                {regionById(activeId)?.name}
              </p>
              <p className="m-0 text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                {low ? 'Too few opportunities to show' : `${formatCount(count)} opportunities`}
              </p>
              {low ? (
                <p className="m-0 text-[13px] leading-[16px] font-semibold text-[#387440]">
                  Fewer than 5 opportunities, hidden to protect privacy
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-[12px] @min-[758px]:w-[326px] @min-[758px]:gap-[20px]">
          <MapLegend />
          <hr className="m-0 hidden h-px w-full border-0 bg-[#e7e7e7] @min-[758px]:block" />
          <MapTopRegions regions={topRows} title="Top 5 regions by opportunities" />
          <div>
            <Button
              type="button"
              variant="tertiary-subtle"
              size="md"
              onClick={onCompare}
              className="!w-fit !rounded-[14px] !px-[22px] !py-[12px]"
            >
              Compare regions
            </Button>
          </div>
        </div>
      </div>
    </DemandCard>
  );
};

export default DemandRegionMapCard;
