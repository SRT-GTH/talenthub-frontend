import { formatCount } from '../agencyFormat.js';
import { AgencyArrowRightIcon } from '../agencyIcons.jsx';
import DemandCard from './DemandCard.jsx';
import { regionById } from '../../publicData/regionsList.js';
import DemandNote from './DemandNote.jsx';

/*
 * DemandRegionList — "Demand by region" on phone and tablet (Figma 11.4.5o 8707:426318 / 11.4.5p 8707:427363): no map below lg, a ranked list instead,
 * "1  Greater Accra  1486  →" (rank 13/500 #575755, name 14/500, count 14/600, 16px arrow), each row opens the region's districts. The sentence under the list reads
 * "The map is on tablet and desktop." on phones and "Tap a region for its districts. Turn the tablet sideways for the map." on tablets.
 * Props: rows [{ id, count }], onOpenRegion(id). Counts via formatCount (<5 rule).
 */

const DemandRegionList = ({ rows, onOpenRegion }) => (
  <DemandCard
    id="demand-by-region-list"
    className="h-full"
    title="Demand by region"
    hint="Opportunities · tap for districts"
    bodyClassName="flex flex-col gap-[12px] px-[24px] pt-[9px] pb-[14px] lg:pt-0 lg:pb-[24px]"
  >
    <ol className="m-0 flex list-none flex-col p-0">
      {rows.map((r, i) => {
        const name = regionById(r.id)?.name ?? r.id;
        return (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onOpenRegion(r.id)}
              aria-label={`${name}, ${formatCount(r.count)} opportunities, open districts`}
              className="flex min-h-[45px] w-full cursor-pointer items-center gap-[12px] bg-transparent p-0 text-left font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <span className="w-[16px] text-[13px] leading-[16px] font-medium text-[#575755]">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                {name}
              </span>
              <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                {formatCount(r.count)}
              </span>
              <AgencyArrowRightIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
            </button>
          </li>
        );
      })}
    </ol>
    <DemandNote>
      <span className="md:hidden">The map is on tablet and desktop.</span>
      <span className="max-md:hidden">
        Tap a region for its districts. Turn the tablet sideways for the map.
      </span>
    </DemandNote>
  </DemandCard>
);

export default DemandRegionList;
