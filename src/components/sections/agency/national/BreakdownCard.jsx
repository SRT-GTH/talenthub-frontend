import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import BarList from '../../publicData/ui/BarList.jsx';
import BarRow from '../../publicData/ui/BarRow.jsx';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import SectionError from '../../publicData/ui/SectionError.jsx';
import SkeletonBarRows from '../../publicData/ui/SkeletonBarRows.jsx';
import { BREAKDOWN_VIEWS } from './data/nationalData.js';
import ViewByMenu from './ViewByMenu.jsx';

/*
 * BreakdownCard — "Breakdown · Top 10 · talents · View by <Career interest>" (Figma 8596:389798, 497 wide, stretches to the map card's height; the view-by
 * list is frame 11.4.6d, "By personality type" 11.4.6e). Replaces Theme 8's Career interests card on the agency overview.
 * Props: rows [{key,label,count}], view, onView(id), menuOpen, onMenuOpen(bool), loading, error, onRetry.
 * Counts go through BarRow -> formatCount (<5 rule).
 */

const BreakdownCard = ({
  rows,
  view,
  onView,
  menuOpen,
  onMenuOpen,
  note,
  loading,
  error,
  onRetry,
}) => {
  const [expanded, setExpanded] = useState(false);
  const max = Math.max(1, ...rows.map((r) => r.count ?? 0));
  const label = BREAKDOWN_VIEWS.find((v) => v.id === view)?.label ?? 'Career interest';
  const canToggle = rows.length > 5;
  return (
    <PublicCard
      id="breakdown"
      loading={loading}
      className="flex flex-col"
      bodyClassName="flex flex-1 flex-col px-[16px] pb-[16px] md:px-[24px] md:pb-[24px]"
    >
      <div className="-mx-[16px] mb-[2px] flex min-h-[57px] items-center justify-between gap-[12px] px-[16px] py-[12px] md:-mx-[24px] md:px-[24px]">
        <div className="flex min-w-0 items-baseline gap-[10px]">
          <h2
            id="breakdown-title"
            className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21] md:text-[18px] md:leading-[21px]"
          >
            Breakdown
          </h2>
          {view === 'personality' ? null : (
            <span className="font-sans text-[12px] leading-[14px] font-medium whitespace-nowrap text-[#595959]">
              Top 10 · talents
            </span>
          )}
        </div>
        <ViewByMenu
          options={BREAKDOWN_VIEWS}
          value={view}
          open={menuOpen}
          onOpenChange={onMenuOpen}
          onSelect={onView}
        />
      </div>
      {error ? (
        <div className="flex flex-1 items-center">
          <SectionError onRetry={onRetry} />
        </div>
      ) : loading ? (
        <SkeletonBarRows rows={9} />
      ) : (
        <>
          <BarList
            label={`${label.toLowerCase()} by talents`}
            gap={12}
            className="flex-1 md:justify-between md:gap-[10px]"
          >
            {rows.map((r, i) => (
              <BarRow
                key={r.key}
                label={r.label}
                count={r.count}
                ratio={(r.count ?? 0) / max}
                className={classNames(i >= 5 && !expanded && canToggle && 'max-md:hidden')}
              />
            ))}
          </BarList>
          {note ? (
            <p className="m-0 pt-[12px] font-sans text-[13px] leading-[16px] text-[#595959]">
              {note}
            </p>
          ) : null}
          {canToggle && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className="mt-[12px] min-h-[24px] w-fit cursor-pointer bg-transparent p-0 text-left font-sans text-[13px] leading-[16px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] md:hidden"
            >
              {expanded ? 'Show fewer ▴' : `Show all ${rows.length} ▾`}
            </button>
          )}
        </>
      )}
    </PublicCard>
  );
};

export default BreakdownCard;
