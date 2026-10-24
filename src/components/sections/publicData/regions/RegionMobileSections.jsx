import { useState } from 'react';
import GhanaMap from '../map/GhanaMap.jsx';
import BarList from '../ui/BarList.jsx';
import BarRow from '../ui/BarRow.jsx';
import PublicCard from '../ui/PublicCard.jsx';
import StackedBar from '../ui/StackedBar.jsx';
import FindTalentCard from './FindTalentCard.jsx';

/*
 * RegionMobileSections — the body of the phone frames (Figma 8507:260 region 390x1706, 8516:8 district 390x1269); the hero and the 2x2 tiles come from
 * RegionHeroRow. The phone drops the rank chips, the district map, education / age / capability and partner footprint, and instead draws:
 *   region   : "Top districts" card (5 bars, aside "of 29", link "View all 29 districts →") · "Where in Greater Accra" card (the 240x350 national map
 *              with the region highlighted, aside "Bubble = talents") · the green "Find talent in …" card
 *   district : "Top areas" card (5 bars, aside "of 13") · "Education vs Greater Accra" card (20px bar for the district, 10px for the region)
 * ⚠️ ASSUMPTION: "View all 29 districts →" expands the card in place (Figma draws no destination), to every district the mock lists.
 * Props: view (regionsView), regionId, allRows (every row the mock lists, for the expanded list), onFindTalent().
 */

const TopList = ({ view, allRows }) => {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? allRows : view.mobile.rows;
  const max = Math.max(1, ...allRows.map((r) => r.count));
  return (
    <PublicCard id="top-list" title={view.mobile.listTitle} hint={view.mobile.listAside}>
      <BarList label={view.mobile.listAria} gap={12}>
        {rows.map((r) => (
          <BarRow
            key={r.label}
            label={r.label}
            count={r.count}
            ratio={r.count / max}
            layout="stacked"
          />
        ))}
      </BarList>
      {view.mobile.viewAll && allRows.length > view.mobile.rows.length && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mt-[12px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {expanded ? 'Show top 5' : view.mobile.viewAll}
        </button>
      )}
    </PublicCard>
  );
};

const RegionMobileSections = ({ view, regionId, allRows, onFindTalent }) => (
  <div className="flex flex-col gap-[16px] md:hidden">
    <TopList view={view} allRows={allRows} />
    {view.kind === 'region' ? (
      <>
        <PublicCard id="where" title={view.mobile.mapTitle} hint={view.mobile.mapAside}>
          <GhanaMap
            variant="mini"
            highlightId={regionId}
            ariaLabel={`Map of Ghana with ${view.name} highlighted`}
            className="mx-auto w-[240px] max-w-full"
          />
        </PublicCard>
        <FindTalentCard cta={view.cta} onAction={onFindTalent} />
      </>
    ) : (
      <PublicCard id="education-m" title={view.mobile.educationTitle}>
        <div className="flex flex-col gap-[12px]">
          <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold text-[#1c2a21]">
            {view.name}
          </p>
          <StackedBar
            segments={view.education.segments}
            height={20}
            radius={4}
            gap={0}
            showShare={false}
            legend="none"
            ariaLabel={`Education level in ${view.name}`}
          />
          <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
            {view.education.compareLabel}
          </p>
          <StackedBar
            segments={view.education.compareSegments}
            height={10}
            radius={4}
            gap={0}
            showShare={false}
            legend="none"
            ariaLabel={`Education level in ${view.education.compareLabel}`}
          />
        </div>
      </PublicCard>
    )}
  </div>
);

export default RegionMobileSections;
