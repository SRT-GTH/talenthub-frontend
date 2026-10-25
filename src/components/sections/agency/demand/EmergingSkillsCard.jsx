import { AgencyTrendUpIcon } from '../agencyIcons.jsx';
import DemandCard from './DemandCard.jsx';
import DemandNote from './DemandNote.jsx';

/*
 * EmergingSkillsCard — "Emerging skills · New this quarter" (Figma 8702:894, 497 wide): rows p10/0, icon tile 34 (#ebf1ec r10, trend-up 18 #387440), name 14/17 600,
 * "Category · N opportunities" 12/14 #575755, pill "New" (#ebf1ec r999 12/14 600 #387440). Props: rows [{ name, category, count }], note. Below lg only the first three rows show (11.4.5o/p).
 */

const EmergingSkillsCard = ({ rows, note }) => (
  <DemandCard
    id="emerging-skills"
    title="Emerging skills"
    hint="New this quarter"
    bodyClassName="flex flex-col px-[24px] pt-[16px] pb-[12px] lg:pt-0 lg:pb-[24px]"
    className="flex h-full flex-col"
  >
    <ul className="m-0 flex list-none flex-col p-0">
      {rows.map((r, i) => (
        <li
          key={r.name}
          className={`flex items-center gap-[12px] py-[14px] lg:py-[10px]${i >= 3 ? ' max-lg:hidden' : ''}`}
        >
          <span
            aria-hidden="true"
            className="flex size-[34px] max-lg:hidden shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]"
          >
            <AgencyTrendUpIcon className="size-[18px] text-[#387440]" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span className="truncate text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              {r.name}
            </span>
            <span className="text-[12px] leading-[14px] text-[#575755]">
              <>
                <span className="lg:hidden">{`${r.count} opportunities`}</span>
                <span className="max-lg:hidden">{`${r.category} · ${r.count} opportunities`}</span>
              </>
            </span>
          </span>
          <span className="rounded-full bg-[#ebf1ec] px-[8px] py-[3px] text-[12px] leading-[14px] font-semibold text-[#387440]">
            New
          </span>
        </li>
      ))}
    </ul>
    {note ? <DemandNote className="mt-[4px]">{note}</DemandNote> : null}
  </DemandCard>
);

export default EmergingSkillsCard;
