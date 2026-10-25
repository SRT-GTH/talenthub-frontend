import { isSuppressed } from '../agencyFormat.js';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import SuppressedValue from '../../publicData/ui/SuppressedValue.jsx';
import DemandNote from './DemandNote.jsx';
import DemandViewByMenu from './DemandViewByMenu.jsx';
import { SUCCESS_VIEW_BY } from './data/demandData.js';

/*
 * ProfileGroupCard — "Success by profile group" (Figma 8706:… 497 wide): rows label 14/500 | track (#efefea r4 14 high, #387440) | "31.2%" 14/600, a group with fewer than 5
 * placed reads the "<5" chip and no bar, and the "View by <Education level>" menu in the header. The note "Same View by options as the Breakdown card on National data." is drawn
 * as copy. Props: rows [{ label, rate, count }], view, onView(id), menuOpen, onMenuOpen(bool). Counts go through isSuppressed / SuppressedValue.
 */

const ProfileGroupCard = ({ rows, view, onView, menuOpen, onMenuOpen }) => {
  const max = Math.max(1, ...rows.map((r) => r.rate ?? 0));
  return (
    <PublicCard
      id="success-profile-group"
      title="Success by profile group"
      className="flex flex-col"
      bodyClassName="flex flex-1 flex-col gap-[12px] px-[16px] pb-[24px] md:px-[24px]"
      headerExtra={
        <DemandViewByMenu
          options={SUCCESS_VIEW_BY}
          value={view}
          open={menuOpen}
          onOpenChange={onMenuOpen}
          onSelect={onView}
        />
      }
    >
      <ul
        aria-label="Success rate by profile group"
        className="m-0 flex list-none flex-col gap-[15px] p-0"
      >
        {rows.map((r) => {
          const low = isSuppressed(r.count) || r.rate === null;
          return (
            <li
              key={r.label}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,90px)_56px] items-center gap-[12px] font-sans sm:grid-cols-[minmax(0,150px)_minmax(0,1fr)_56px]"
            >
              <span className="truncate text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                {r.label}
              </span>
              <span aria-hidden="true" className="h-[14px] rounded-[4px] bg-[#efefea]">
                {low ? null : (
                  <span
                    className="block h-full rounded-[4px] bg-[#387440]"
                    style={{ width: `${(r.rate / max) * 100}%` }}
                  />
                )}
              </span>
              <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                {low ? <SuppressedValue value={r.count} /> : `${r.rate}%`}
              </span>
            </li>
          );
        })}
      </ul>
      <DemandNote className="mt-auto">
        Same View by options as the Breakdown card on National data.
      </DemandNote>
    </PublicCard>
  );
};

export default ProfileGroupCard;
