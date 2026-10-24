import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import PublicCard from '../ui/PublicCard.jsx';
import SectionError from '../ui/SectionError.jsx';
import { topRegions } from './data/mapData.js';
import GhanaMap from './GhanaMap.jsx';
import MapKeyboardHint from './MapKeyboardHint.jsx';
import MapLegend from './MapLegend.jsx';
import MapTopRegions from './MapTopRegions.jsx';

/*
 * RegionalMapCard — the "Regional distribution" card (Figma 8487:346039; the four map component frames 8489:346162 / 346231 / 346317 / 346395
 * are this card + one interaction state each; mobile 8507:86; tablet 8508:350969). Header, the Ghana map, the legend, the Top 5 list and
 * the "Compare regions" button.
 *   >= 758px of card body : map 400 | gap 32 | legend + divider + Top 5 + Compare button (326)
 *   narrower              : map (max 240 below 560px) over the legend and the Top 5 sentence ("Top 5 · Greater Accra 42,310 · …"); no Compare button
 *                           (not drawn on the mobile frame)
 * Props
 *   regions        [{ id, count, trendPct, education, topInterests }]   see data/mapData.js
 *   loading        boolean   map regions #f2f2ee (legend and Top 5 stay, as in the loading frame 8488:8); aria-busy
 *   error          boolean   the card body becomes a SectionError (8.2.1c draws it on Career interests; same component)
 *   onRetry        fn()      Retry of the SectionError
 *   filterLabel    string    replaces the hint when a filter narrows the map ("Filtered · Public Service · 30–35", Figma 8489:346399)
 *   topTitle       string    heading of the Top 5 list (default "Top 5 regions"; "Selected region" while a region filter is active)
 *   onOpenRegion   fn(id)    "View … details →" of the expanded card
 *   onCompare      fn()      "Compare regions"
 *   forced         { active, pinnedId, pointerAt }   gallery / frame comparison only: pins the hover / keyboard / pinned state
 *   showKeyboardHint 'auto' | boolean   the strip under the card: auto = while a keyboard user is on a region
 */

const RegionalMapCard = ({
  regions,
  loading = false,
  error = false,
  onRetry,
  filterLabel,
  topTitle,
  onOpenRegion,
  onCompare,
  forced,
  showKeyboardHint = 'auto',
  className,
}) => {
  const [mode, setMode] = useState(null);
  const top = topRegions(regions, 5);
  const keyboard = (forced?.active ?? null)?.mode === 'keyboard' || mode === 'keyboard';
  const hintVisible = showKeyboardHint === 'auto' ? keyboard : showKeyboardHint;
  return (
    <div className={classNames('flex flex-col gap-[16px]', className)}>
      <PublicCard
        title="Regional distribution"
        hint={filterLabel ?? '16 regions · hover or tap a region'}
        hintCompact={filterLabel ? undefined : 'Tap a region'}
        loading={loading}
        bodyClassName="@container px-[16px] pb-[16px] md:px-[24px] md:pb-[24px]"
        id="regional-distribution"
      >
        {error ? (
          <SectionError onRetry={onRetry} />
        ) : (
          <div className="flex min-w-0 flex-col gap-[16px] @min-[758px]:flex-row @min-[758px]:gap-[32px]">
            <GhanaMap
              regions={regions}
              loading={loading}
              onOpenRegion={onOpenRegion}
              onActiveChange={(a) => setMode(a?.mode ?? null)}
              className="mx-auto max-w-[240px] @min-[560px]:max-w-[400px] @min-[758px]:mx-0 @min-[758px]:w-[400px] @min-[758px]:shrink-0"
              {...(forced
                ? {
                    active: forced.active ?? null,
                    pinnedId: forced.pinnedId ?? null,
                    pointerAt: forced.pointerAt,
                  }
                : {})}
            />
            <div className="flex min-w-0 flex-col gap-[12px] @min-[758px]:w-[326px] @min-[758px]:gap-[20px]">
              <MapLegend />
              <hr className="m-0 hidden h-px w-full border-0 bg-[#e7e7e7] @min-[758px]:block" />
              <MapTopRegions regions={top} title={topTitle} className="hidden @min-[758px]:flex" />
              <MapTopRegions regions={top} inline className="@min-[758px]:hidden" />
              <div className="hidden @min-[758px]:block">
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
        )}
      </PublicCard>
      {hintVisible && <MapKeyboardHint />}
    </div>
  );
};

export default RegionalMapCard;
