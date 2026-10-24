import { useState } from 'react';
import { debug } from '../../utils/debug.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import { FreshnessPill } from '../../components/sections/publicData/PublicTopBar.jsx';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import GhanaMap from '../../components/sections/publicData/map/GhanaMap.jsx';
import MapKeyboardHint from '../../components/sections/publicData/map/MapKeyboardHint.jsx';
import MapLegend from '../../components/sections/publicData/map/MapLegend.jsx';
import RegionalMapCard from '../../components/sections/publicData/map/RegionalMapCard.jsx';
import {
  MAP_REGIONS_LOW_DATA,
  MAP_REGIONS_SAMPLE,
} from '../../components/sections/publicData/map/data/mapData.js';
import BarList from '../../components/sections/publicData/ui/BarList.jsx';
import BarRow from '../../components/sections/publicData/ui/BarRow.jsx';
import CardHeader from '../../components/sections/publicData/ui/CardHeader.jsx';
import CardSubhead from '../../components/sections/publicData/ui/CardSubhead.jsx';
import ChangeBadge from '../../components/sections/publicData/ui/ChangeBadge.jsx';
import ColumnBars from '../../components/sections/publicData/ui/ColumnBars.jsx';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import FilterBar from '../../components/sections/publicData/ui/FilterBar.jsx';
import FilterChip from '../../components/sections/publicData/ui/FilterChip.jsx';
import FilterSheet from '../../components/sections/publicData/ui/FilterSheet.jsx';
import HeroMetric from '../../components/sections/publicData/ui/HeroMetric.jsx';
import KpiStrip from '../../components/sections/publicData/ui/KpiStrip.jsx';
import KpiTile from '../../components/sections/publicData/ui/KpiTile.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import PublicCard from '../../components/sections/publicData/ui/PublicCard.jsx';
import SectionError from '../../components/sections/publicData/ui/SectionError.jsx';
import SegmentedControl from '../../components/sections/publicData/ui/SegmentedControl.jsx';
import Skeleton from '../../components/sections/publicData/ui/Skeleton.jsx';
import SkeletonBarRows from '../../components/sections/publicData/ui/SkeletonBarRows.jsx';
import Sparkline from '../../components/sections/publicData/ui/Sparkline.jsx';
import StackedBar from '../../components/sections/publicData/ui/StackedBar.jsx';
import SuppressedValue from '../../components/sections/publicData/ui/SuppressedValue.jsx';
import TodayStrip from '../../components/sections/publicData/ui/TodayStrip.jsx';
import GallerySection from '../../components/sections/publicData/ui/gallery/GallerySection.jsx';
import MapFrameShell from '../../components/sections/publicData/ui/gallery/MapFrameShell.jsx';
import { SAMPLE_SPARKLINE } from '../../components/sections/publicData/ui/data/uiData.js';
import {
  GALLERY_AGES,
  GALLERY_CAPABILITIES,
  GALLERY_EDUCATION,
  GALLERY_GENDER,
  GALLERY_HERO,
  GALLERY_INTERESTS,
  GALLERY_KPIS,
  GALLERY_RANGE_OPTIONS,
  GALLERY_TODAY,
} from '../../components/sections/publicData/ui/data/uiGalleryData.js';

const log = debug('PublicUiGalleryPage');

/*
 * PublicUiGalleryPage — DEV-ONLY gallery of the Theme 8 shared primitives (/data/_ui, registered only when import.meta.env.DEV).
 * Owned by the "P0 ui primitives + map" work package. Every primitive and every map state is rendered in a wrapper of the exact Figma node
 * width beside the 0.5x Figma export of that node (src/assets/public-data/ui-gallery/<name>.png) so they can be compared and audited before the
 * section pages use them. data-gallery-built="<section>/<variant>" marks each built wrapper (the audit script screenshots these).
 */

/** Figma exports of a node with the card shadow (0 5 17 / 4%) are 17px wider each side, 12px taller on top, 22px at the bottom. */
const CARD_BLEED = { t: 12, r: 17, b: 22, l: 17 };

const FILTERS_MULTI = { region: 'volta', interest: 'technology', age: '18-24' };

const INDEX = [
  ['freshness-and-badges', 'Pills + badges'],
  ['card', 'Card + header'],
  ['kpi', 'Hero · KPI'],
  ['bars', 'Bars'],
  ['filters', 'Filters'],
  ['states', 'States'],
  ['strips', 'Today · Action bar'],
  ['map', 'Ghana map'],
];

const PublicUiGalleryPage = () => {
  const data = usePublicDataState();
  const [filters, setFilters] = useState({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [range, setRange] = useState('12m');
  const [chipOpen, setChipOpen] = useState(false);
  log('render');

  const max = GALLERY_INTERESTS[0].count;
  const interestRows = GALLERY_INTERESTS.map((r) => ({ ...r, ratio: r.count / max }));
  const capRows = GALLERY_CAPABILITIES.map((r) => ({
    label: r.label,
    valueText: `${r.pct}%`,
    ratio: r.pct / 41,
  }));

  const countFor = (draft) => {
    const n = Object.values(draft ?? {}).filter(Boolean).length;
    return n === 0 ? 219428 : n === 1 ? 38540 : 237;
  };

  return (
    <PublicDataFrame data={data} title="UI gallery (dev)">
      <div className="flex flex-col gap-[56px] px-[24px] py-[28px] font-sans md:px-[40px]">
        <header className="flex flex-col gap-[8px]">
          <h1 className="m-0 text-[34px] leading-[41px] font-semibold tracking-[-0.34px] text-[#1c2a21]">
            Public data · UI gallery
          </h1>
          <p className="m-0 max-w-[900px] text-[15px] leading-[22px] text-[#595959]">
            Dev only. Every Theme 8 primitive and every Ghana-map state, built (left) next to the
            0.5x Figma export of its component node (right, shown at 2x). Sample content only. The
            map outlines are placeholder geometry until the official GSS boundaries arrive.
          </p>
          <nav aria-label="Gallery sections" className="flex flex-wrap gap-[8px] pt-[8px]">
            {INDEX.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-solid border-[#e7e7e7] bg-white px-[12px] py-[6px] text-[13px] leading-[16px] font-medium text-[#1c2a21] hover:bg-[#ebf1ec]"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        <GallerySection
          id="freshness-and-badges"
          title="Freshness pill · Change badge · Suppressed value"
          nodes="Freshness pill 8486:34 (exists in PublicTopBar.jsx, imported, not duplicated) · Change badge 8485:34 / 8482:22 · Suppressed value 8488:955"
          notes="Change badge down / flat and the chip's open / disabled states are not drawn in Figma (assumptions, see component headers)."
          variants={[
            {
              key: 'freshness',
              label: 'Freshness pill (imported)',
              width: 180,
              bg: '#ffffff',
              figma: 'freshness-pill',
              children: <FreshnessPill />,
            },
            {
              key: 'change-badge',
              label: 'Change badge · up',
              width: 152,
              bg: '#ebf1ec',
              figma: 'change-badge',
              children: <ChangeBadge pct={42} suffix="vs last quarter" />,
            },
            {
              key: 'change-badge-others',
              label: 'Change badge · down · flat · white surface (mobile hero) · sm',
              width: 520,
              bg: '#ffffff',
              children: (
                <div className="flex flex-wrap items-center gap-[10px] p-[12px]">
                  <ChangeBadge pct={-3} suffix="vs last quarter" />
                  <ChangeBadge pct={0} suffix="vs last quarter" />
                  <span className="rounded-[8px] bg-[#ebf1ec] p-[8px]">
                    <ChangeBadge pct={42} suffix="vs last quarter" surface="white" size="sm" />
                  </span>
                </div>
              ),
            },
            {
              key: 'suppressed-value',
              label: 'Suppressed value · chip',
              width: 56,
              bg: '#ffffff',
              figma: 'suppressed-value',
              children: <SuppressedValue />,
            },
            {
              key: 'suppressed-others',
              label:
                'Suppressed value · from a raw count (3 -> "<5", 12 -> "12") · legend sentence',
              width: 420,
              bg: '#ffffff',
              children: (
                <div className="flex flex-wrap items-center gap-[12px] p-[12px]">
                  <SuppressedValue value={3} />
                  <SuppressedValue value={12} />
                  <SuppressedValue variant="text" />
                </div>
              ),
            },
          ]}
        />

        <GallerySection
          id="card"
          title="Card + Card header"
          nodes="Card header 8482:61 (8487:346040, mobile 8507:87) · card chrome 8487:346039"
          variants={[
            {
              key: 'card-header',
              label: 'Card header · desktop',
              width: 806,
              bg: '#ffffff',
              figma: 'card-header',
              children: (
                <CardHeader
                  title="Regional distribution"
                  hint="16 regions · hover or tap a region"
                />
              ),
            },
            {
              key: 'card-header-mobile',
              label:
                'Card header · mobile (viewport < 768 switches the sizes; here with the Figma 16px inset)',
              width: 324,
              bg: '#ffffff',
              figma: 'mobile-card-header',
              children: (
                <CardHeader
                  title="Regional distribution"
                  hint="16 regions · hover or tap a region"
                  hintCompact="Tap a region"
                  className="!px-0 !pt-0"
                />
              ),
            },
          ]}
        />

        <GallerySection
          id="kpi"
          title="Hero metric · KPI tile · Sparkline · KPI strip"
          nodes="Hero metric 8487:346011 · KPI tile 8487:346024 (loading 8488:127) · Sparkline 8485:37 · KPI row 8487:346010 · mobile hero 8507:62 / tiles 8507:69"
          notes="Hero loading is not drawn in Figma (the loading frame keeps the real hero): the skeleton variant is an assumption."
          variants={[
            {
              key: 'hero',
              label: 'Hero metric · desktop 440',
              width: 440,
              figma: 'hero-metric',
              children: (
                <HeroMetric
                  {...GALLERY_HERO}
                  series={SAMPLE_SPARKLINE}
                  seriesLabel="Registrations over the last 90 days, rising"
                />
              ),
            },
            {
              key: 'hero-loading',
              label: 'Hero metric · loading (assumption)',
              width: 440,
              children: <HeroMetric {...GALLERY_HERO} loading />,
            },
            {
              key: 'hero-mobile',
              label: 'Hero metric · mobile 358 (viewport < 768)',
              width: 358,
              figma: 'mobile-hero',
              children: <HeroMetric {...GALLERY_HERO} />,
            },
            {
              key: 'kpi-tile',
              label: 'KPI tile · 305',
              width: 305,
              bg: '#ffffff',
              figma: 'kpi-tile',
              children: <KpiTile {...GALLERY_KPIS[0]} />,
            },
            {
              key: 'kpi-tile-loading',
              label: 'KPI tile · loading (146 high)',
              width: 305,
              bg: '#ffffff',
              figma: 'kpi-tile-loading',
              children: <KpiTile {...GALLERY_KPIS[0]} loading />,
            },
            {
              key: 'kpi-tile-mobile',
              label: 'KPI tiles · mobile 2x2 (358, viewport < 768)',
              width: 358,
              figma: 'mobile-kpis',
              children: (
                <div className="grid grid-cols-2 gap-[10px]">
                  {GALLERY_KPIS.map((k) => (
                    <KpiTile key={k.id} {...k} />
                  ))}
                  <KpiTile eyebrow="Today" value="+328" sub="New sign-ups" />
                </div>
              ),
            },
            {
              key: 'sparkline',
              label: 'Sparkline · 376x48',
              width: 376,
              bg: '#ebf1ec',
              figma: 'sparkline',
              children: <Sparkline values={SAMPLE_SPARKLINE} label="Registrations, rising" />,
            },
            {
              key: 'kpi-row',
              label: 'KPI strip · hero + 3 tiles (1360)',
              width: 1360,
              figma: 'kpi-row',
              bleed: CARD_BLEED,
              children: (
                <KpiStrip
                  hero={
                    <HeroMetric
                      {...GALLERY_HERO}
                      series={SAMPLE_SPARKLINE}
                      seriesLabel="Registrations over the last 90 days, rising"
                    />
                  }
                >
                  {GALLERY_KPIS.map((k) => (
                    <KpiTile key={k.id} {...k} />
                  ))}
                </KpiStrip>
              ),
            },
          ]}
        />

        <GallerySection
          id="bars"
          title="Bar row · Stacked / split bars · Column bars"
          nodes="Bar row 8500:350646 (detached in the frames) · Career interests 8487:346125 · Who they are 8487:346182 · Talent profile 8487:346231 · mobile rows 8507:150"
          variants={[
            {
              key: 'career-interests',
              label: 'Bar rows in "Career interests" (528 x 667, rows spaced to the card)',
              width: 528,
              figma: 'card-career-interests',
              bleed: CARD_BLEED,
              children: (
                <PublicCard
                  title="Career interests"
                  hint="Top 10 clusters · talents"
                  className="flex h-[667px] flex-col"
                  bodyClassName="flex-1 px-[24px] pb-[24px]"
                >
                  <BarList
                    label="Top 10 career interest clusters"
                    className="h-full justify-between"
                  >
                    {interestRows.map((r) => (
                      <BarRow
                        key={r.label}
                        label={r.label}
                        count={r.count}
                        ratio={r.ratio}
                        layout="inline"
                      />
                    ))}
                  </BarList>
                </PublicCard>
              ),
            },
            {
              key: 'career-interests-loading',
              label: 'Skeleton rows (loading, 8488:233)',
              width: 528,
              figma: 'card-career-interests-loading',
              bleed: CARD_BLEED,
              children: (
                <PublicCard
                  title="Career interests"
                  hint="Top 10 clusters · talents"
                  loading
                  className="h-[667px]"
                  bodyClassName="px-[24px] pb-[24px]"
                >
                  <SkeletonBarRows rows={9} />
                </PublicCard>
              ),
            },
            {
              key: 'who-they-are',
              label: 'Stacked bar + column bars in "Who they are" (668 x 395)',
              width: 668,
              figma: 'card-who-they-are',
              bleed: CARD_BLEED,
              children: (
                <PublicCard
                  title="Who they are"
                  hint="Education & age"
                  bodyClassName="flex flex-col gap-[24px] px-[24px] pb-[28px]"
                >
                  <div className="flex flex-col gap-[14px]">
                    <CardSubhead label="Education level" aside="219,428 total" />
                    <StackedBar
                      segments={GALLERY_EDUCATION.segments}
                      total={GALLERY_EDUCATION.total}
                      ariaLabel="Education level of 219,428 talents"
                    />
                  </div>
                  <div className="flex flex-col gap-[24px]">
                    <CardSubhead label="Age distribution" aside="Median age 21" />
                    <ColumnBars
                      items={GALLERY_AGES}
                      total={219428}
                      ariaLabel="Age distribution of 219,428 talents"
                    />
                  </div>
                </PublicCard>
              ),
            },
            {
              key: 'talent-profile',
              label: 'Bar rows + split bar in "Talent profile" (668 x 386)',
              width: 668,
              figma: 'card-talent-profile',
              bleed: CARD_BLEED,
              children: (
                <PublicCard
                  title="Talent profile"
                  hint="Capabilities & gender"
                  bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[28px]"
                >
                  <CardSubhead label="Strongest capability" aside="Self-reported + assessed" />
                  <BarList label="Strongest capability" gap={12}>
                    {capRows.map((r) => (
                      <BarRow
                        key={r.label}
                        label={r.label}
                        valueText={r.valueText}
                        ratio={r.ratio}
                        layout="inline"
                      />
                    ))}
                  </BarList>
                  <CardSubhead label="Gender" aside="Self-identified" className="pt-[12px]" />
                  <StackedBar
                    segments={GALLERY_GENDER.segments}
                    total={GALLERY_GENDER.total}
                    height={12}
                    radius={4}
                    showShare={false}
                    legend="shares"
                    ariaLabel="Gender of 219,428 talents"
                  />
                </PublicCard>
              ),
            },
            {
              key: 'bars-mobile',
              label: 'Bar rows · stacked layout (mobile 324, label + value over a 10px track)',
              width: 324,
              figma: 'mobile-career-interests',
              bg: '#ffffff',
              children: (
                <BarList label="Top career interests" gap={12} className="p-[16px]">
                  {interestRows.slice(0, 5).map((r) => (
                    <BarRow
                      key={r.label}
                      label={r.label}
                      count={r.count}
                      ratio={r.ratio}
                      layout="stacked"
                    />
                  ))}
                </BarList>
              ),
            },
            {
              key: 'bars-suppressed',
              label: 'Privacy: a bar with 3 people reads "<5" and draws no bar',
              width: 478,
              bg: '#ffffff',
              children: (
                <BarList label="Privacy example" className="p-[12px]">
                  <BarRow label="Aviation" count={3} ratio={0.2} layout="inline" />
                  <BarRow label="Technology" count={48320} ratio={1} layout="inline" />
                </BarList>
              ),
            },
          ]}
        />

        <GallerySection
          id="filters"
          title="Filter chip · Filter menu · Filter bar · Filter sheet"
          nodes="Filter chip 8482:43 (8487:345991, active 8489:90, mobile 8507:47) · filter bar 8487:345985 / 8489:83 / 8488:802 / 8488:906 · mobile sheet 8515:498"
          notes="Not drawn in Figma (assumptions): the open desktop menu (listbox popover), chip open + disabled states, hover. Gender is missing from the drawn sheet and is omitted there."
          variants={[
            {
              key: 'chip-default',
              label: 'Chip · default',
              width: 82,
              bg: '#ffffff',
              figma: 'filter-chip',
              children: <FilterChip label="Region" />,
            },
            {
              key: 'chip-active',
              label: 'Chip · active (✕ clears)',
              width: 139,
              bg: '#ffffff',
              figma: 'filter-chip-active',
              children: <FilterChip label="Region: Ashanti" active onClear={() => log('clear')} />,
            },
            {
              key: 'chip-other',
              label: 'Chip · open (click toggles) · disabled',
              width: 360,
              bg: '#ffffff',
              children: (
                <div className="flex items-center gap-[12px] p-[12px]">
                  <FilterChip
                    label="Interest"
                    open={chipOpen}
                    onClick={() => setChipOpen((o) => !o)}
                  />
                  <FilterChip label="Gender" disabled />
                </div>
              ),
            },
            {
              key: 'bar-default',
              label:
                'Filter bar · interactive (pick a filter: menu, active chip, counts, Clear all)',
              width: 1360,
              figma: 'filter-bar',
              children: (
                <FilterBar
                  filters={filters}
                  onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
                  onClearAll={() => setFilters({})}
                  onSaveLink={() => log('save as link')}
                  onOpenSheet={() => setSheetOpen(true)}
                  result={{ count: countFor(filters) }}
                />
              ),
            },
            {
              key: 'bar-active',
              label: 'Filter bar · one filter (Region: Ashanti, 38,540 talents match)',
              width: 1360,
              figma: 'filter-bar-active',
              children: <FilterBar filters={{ region: 'ashanti' }} result={{ count: 38540 }} />,
            },
            {
              key: 'bar-multi',
              label: 'Filter bar · several filters (237 talents match these filters)',
              width: 1360,
              children: <FilterBar filters={FILTERS_MULTI} result={{ count: 237 }} />,
            },
            {
              key: 'bar-zero',
              label: 'Filter bar · zero matches',
              width: 1360,
              figma: 'filter-bar-zero',
              children: (
                <FilterBar
                  filters={{ region: 'upper-west', interest: 'technology', age: '30-35' }}
                  result={{ count: 0 }}
                />
              ),
            },
            {
              key: 'bar-suppressed',
              label: 'Filter bar · fewer than 5 (suppressed chip)',
              width: 1360,
              figma: 'filter-bar-suppressed',
              children: (
                <FilterBar
                  filters={{ region: 'upper-west', interest: 'technology', age: '18-24' }}
                  result={{ count: 3 }}
                />
              ),
            },
            {
              key: 'bar-loading',
              label: 'Filter bar · loading ("Counting talents…", Clear all / Save as link greyed)',
              width: 1360,
              children: <FilterBar filters={{}} result={{ state: 'loading' }} />,
            },
            {
              key: 'sheet',
              label:
                'Filter sheet · mobile bottom sheet (a dialog: Esc / ✕ closes, focus returns to this button)',
              width: 390,
              figma: 'filter-sheet',
              children: (
                <>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[22px] py-[12px] text-[16px] font-bold text-[#1c2a21]"
                  >
                    Open the filter sheet
                  </button>
                  <FilterSheet
                    isOpen={sheetOpen}
                    onClose={() => setSheetOpen(false)}
                    filters={filters}
                    countFor={countFor}
                    onApply={(draft) => {
                      setFilters(draft);
                      setSheetOpen(false);
                    }}
                  />
                </>
              ),
            },
          ]}
        />

        <GallerySection
          id="states"
          title="Section error · Empty state · Skeleton blocks"
          nodes="Section error 8488:601 · Empty state 8488:828 (zero) / 8488:932 (fewer than 5) · skeleton blocks 8488:127 / 8488:239 / map 8488:145"
          variants={[
            {
              key: 'section-error',
              label: 'Section error (420 x 230)',
              width: 420,
              bg: '#ffffff',
              figma: 'section-error',
              children: <SectionError onRetry={() => log('retry')} />,
            },
            {
              key: 'empty-zero',
              label: 'Empty state · zero matches (no card wrapper)',
              width: 420,
              bg: '#ffffff',
              figma: 'empty-state-zero',
              children: <EmptyState variant="zero" card={false} onAction={() => log('clear')} />,
            },
            {
              key: 'empty-suppressed',
              label: 'Empty state · fewer than 5',
              width: 420,
              bg: '#ffffff',
              figma: 'empty-state-suppressed',
              children: (
                <EmptyState variant="suppressed" card={false} onAction={() => log('remove')} />
              ),
            },
            {
              key: 'skeleton',
              label: 'Skeleton block (140x36, 220x12, 180x12, r6)',
              width: 305,
              bg: '#ffffff',
              children: (
                <div className="flex flex-col gap-[8px] p-[24px]">
                  <Skeleton width={140} height={36} />
                  <Skeleton width={220} height={12} />
                  <Skeleton width={180} height={12} />
                </div>
              ),
            },
          ]}
        />

        <GallerySection
          id="strips"
          title="Today strip · Mobile action bar · Segmented control"
          nodes="Today strip 8487:346285 (mobile block 8507:217) · Mobile action bar 8507:241 · segmented 8496:98"
          variants={[
            {
              key: 'today',
              label: 'Today strip · desktop (1360)',
              width: 1360,
              figma: 'today-strip',
              children: <TodayStrip stats={GALLERY_TODAY} />,
            },
            {
              key: 'today-mobile',
              label: 'Today strip · mobile (358, viewport < 768)',
              width: 358,
              figma: 'mobile-today',
              children: <TodayStrip stats={GALLERY_TODAY} />,
            },
            {
              key: 'action-bar',
              label: 'Mobile action bar (in flow here; fixed + md:hidden on pages)',
              width: 390,
              figma: 'mobile-action-bar',
              bleed: { t: 20, r: 16, b: 12, l: 16 },
              children: (
                <MobileActionBar
                  fixed={false}
                  onShare={() => log('share')}
                  onDownload={() => log('download')}
                />
              ),
            },
            {
              key: 'segmented',
              label: 'Segmented control',
              width: 315,
              figma: 'segmented-control',
              children: (
                <SegmentedControl
                  options={GALLERY_RANGE_OPTIONS}
                  value={range}
                  onChange={setRange}
                  ariaLabel="Time range"
                />
              ),
            },
          ]}
        />

        <GallerySection
          id="map"
          title="Ghana map · 16 regions"
          nodes="Map 8487:346045 · legend 8487:346081 · hover 8489:346162 · expanded card 8489:346231 · keyboard focus 8489:346317 · low-data 8489:346395 · loading 8488:145 · mini 8493:1807 · mobile card 8507:86"
          notes="⚠️ PLACEHOLDER geometry (Figma vector export) until the official GSS boundaries arrive. Hover, keyboard and pinned states below are pinned with forced props; the interactive one at the end is live."
          variants={[
            {
              key: 'default',
              label: 'Regional distribution card · default (808 x 667)',
              width: 808,
              figma: 'map-default',
              bleed: CARD_BLEED,
              children: <RegionalMapCard regions={MAP_REGIONS_SAMPLE} />,
            },
            {
              key: 'hover',
              label:
                '8.2.2a · Hover: 2px ink outline, compact card follows the cursor (whole 888x843 frame)',
              width: 888,
              figma: 'map-hover',
              children: (
                <MapFrameShell
                  title="8.2.2a · Map · Hover"
                  note="Pointer over a region: within 200 ms the region lifts (2px ink outline) and a compact card follows the cursor. Leaving the region hides it after 150 ms."
                >
                  <RegionalMapCard
                    regions={MAP_REGIONS_SAMPLE}
                    forced={{ active: { id: 'ashanti', mode: 'hover' } }}
                  />
                </MapFrameShell>
              ),
            },
            {
              key: 'pinned',
              label: '8.2.2b · Expanded card (click / tap / Enter)',
              width: 888,
              figma: 'map-pinned',
              children: (
                <MapFrameShell
                  title="8.2.2b · Map · Expanded card (click / tap)"
                  note="Click or tap pins an expanded card with education split and top 3 interests. “View … details” opens /regions/greater-accra (8.3.1a). Click outside or Esc to unpin."
                >
                  <RegionalMapCard
                    regions={MAP_REGIONS_SAMPLE}
                    forced={{ pinnedId: 'greater-accra' }}
                  />
                </MapFrameShell>
              ),
            },
            {
              key: 'keyboard',
              label: '8.2.2c · Keyboard focus: 3px blue ring + compact card + hint strip (888x891)',
              width: 888,
              figma: 'map-keyboard',
              children: (
                <MapFrameShell
                  title="8.2.2c · Map · Keyboard focus"
                  note="Keyboard users tab into the map; arrow keys move region to region in reading order. Focus ring is a 3px blue outline (Chart/Cat-3) so it reads on every green step. The same compact card is announced to screen readers."
                >
                  <RegionalMapCard
                    regions={MAP_REGIONS_SAMPLE}
                    forced={{ active: { id: 'eastern', mode: 'keyboard' } }}
                  />
                </MapFrameShell>
              ),
            },
            {
              key: 'low-data',
              label: '8.2.2d · Low-data region: neutral fill, "<5 talents", "Not enough data yet"',
              width: 888,
              figma: 'map-low-data',
              children: (
                <MapFrameShell
                  title="8.2.2d · Map · Low-data region"
                  note="When a region has fewer than 5 matching talents (here under a narrow filter) it is drawn in the neutral no-data fill, its count reads “<5”, and clicking opens the region page in its low-data state (8.3.1c)."
                >
                  <RegionalMapCard
                    regions={MAP_REGIONS_LOW_DATA}
                    filterLabel="Filtered · Public Service · 30–35"
                    forced={{ active: { id: 'upper-west', mode: 'hover' } }}
                  />
                </MapFrameShell>
              ),
            },
            {
              key: 'loading',
              label: 'Loading: regions #f2f2ee, legend + Top 5 stay',
              width: 808,
              figma: 'map-loading-card',
              bleed: CARD_BLEED,
              children: <RegionalMapCard regions={MAP_REGIONS_SAMPLE} loading />,
            },
            {
              key: 'error',
              label: 'Section error inside the card',
              width: 808,
              children: (
                <RegionalMapCard regions={MAP_REGIONS_SAMPLE} error onRetry={() => log('retry')} />
              ),
            },
            {
              key: 'legend',
              label: 'Legend',
              width: 151,
              bg: '#ffffff',
              figma: 'map-legend',
              children: <MapLegend />,
            },
            {
              key: 'mini',
              label: 'Mini map · region page (84 x 123, region highlighted)',
              width: 84,
              figma: 'mini-map',
              children: (
                <GhanaMap
                  variant="mini"
                  highlightId="greater-accra"
                  regions={MAP_REGIONS_SAMPLE}
                  className="w-[84px]"
                />
              ),
            },
            {
              key: 'mobile',
              label:
                'Mobile card (358): 240px map, no labels, Top 5 sentence (built in a 358px container)',
              width: 358,
              figma: 'mobile-map-card',
              bleed: CARD_BLEED,
              children: <RegionalMapCard regions={MAP_REGIONS_SAMPLE} />,
            },
            {
              key: 'hint',
              label: 'Keyboard hint strip',
              width: 436,
              figma: 'map-keyboard-hint',
              children: <MapKeyboardHint />,
            },
            {
              key: 'interactive',
              label: 'Interactive (uncontrolled): hover, click to pin, Tab / arrows / Enter / Esc',
              width: 808,
              children: (
                <RegionalMapCard
                  regions={MAP_REGIONS_SAMPLE}
                  onOpenRegion={(id) => log('open region', id)}
                  onCompare={() => log('compare')}
                />
              ),
            },
          ]}
        />
      </div>
    </PublicDataFrame>
  );
};

export default PublicUiGalleryPage;
