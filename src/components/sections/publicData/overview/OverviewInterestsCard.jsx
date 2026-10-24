import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import BarList from '../ui/BarList.jsx';
import BarRow from '../ui/BarRow.jsx';
import PublicCard from '../ui/PublicCard.jsx';
import SectionError from '../ui/SectionError.jsx';
import SkeletonBarRows from '../ui/SkeletonBarRows.jsx';

const log = debug('OverviewInterestsCard');

/*
 * OverviewInterestsCard — "Career interests" (Figma 8487:346125, 528 wide, stretches to the map card's height; mobile 8507:146).
 *   desktop: all rows, spread over the card's height (8.2.1d draws 5 sub-cluster rows spaced out the same way)
 *   mobile : the first 5 rows + "Show all 10 ▾" (8507:180). ⚠️ ASSUMPTION: the toggle then reads "Show fewer ▴" (not drawn).
 * States: loading (8488:239 skeleton rows), error (8.2.1c: SectionError with Retry, the rest of the page stays live).
 * Props: interests { aside, rows: [{ key, label, count }] }, loading, error, onRetry
 */

const MOBILE_ROWS = 5;

const OverviewInterestsCard = ({ interests, loading = false, error = false, onRetry }) => {
  const [expanded, setExpanded] = useState(false);
  const rows = interests?.rows ?? [];
  const max = Math.max(1, ...rows.map((r) => r.count ?? 0));
  const canToggle = rows.length > MOBILE_ROWS;
  const hint = interests?.aside ?? 'Top 10 clusters · talents';
  return (
    <PublicCard
      id="career-interests"
      title="Career interests"
      hint={hint}
      hintCompact={hint.startsWith('Top 10') ? 'Top 10' : hint}
      loading={loading}
      className="flex flex-col"
      bodyClassName="flex flex-1 flex-col px-[16px] pb-[16px] md:px-[24px] md:pb-[24px]"
    >
      {error ? (
        <div className="flex flex-1 items-center">
          <SectionError onRetry={onRetry} />
        </div>
      ) : loading ? (
        <SkeletonBarRows rows={9} />
      ) : (
        <>
          <BarList
            label={`${interests.aside}`}
            gap={12}
            className="flex-1 md:justify-between md:gap-[10px]"
          >
            {rows.map((r, i) => (
              <BarRow
                key={r.key}
                label={r.label}
                count={r.count}
                ratio={(r.count ?? 0) / max}
                className={classNames(
                  i >= MOBILE_ROWS && !expanded && canToggle && 'max-md:hidden'
                )}
              />
            ))}
          </BarList>
          {canToggle && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => {
                log('toggle', !expanded);
                setExpanded((v) => !v);
              }}
              className="mt-[12px] w-fit cursor-pointer bg-transparent p-0 text-left font-sans text-[13px] leading-[16px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] md:hidden"
            >
              {expanded ? `Show fewer ▴` : `Show all ${rows.length} ▾`}
            </button>
          )}
        </>
      )}
    </PublicCard>
  );
};

export default OverviewInterestsCard;
