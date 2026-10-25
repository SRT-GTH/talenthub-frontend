import { classNames } from '../../../../utils/classNames.js';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import CardHint from './CardHint.jsx';
import DemandNote from './DemandNote.jsx';
import { SUPPLY_MAX } from './data/demandData.js';

/*
 * SupplyDemandCard — "Supply vs demand" (Figma 8702:960, 1329 wide): rows 14/17, label 220 | track (#efefea r4, 14 high, fill = value / 24 of the track) | "2.4 per opportunity"
 * 14/17 600 | pill (Shortage #faf4e8 #967014 · Tight / Surplus #efefea #575755 · Balanced #ebf1ec #387440). Phone / tablet (11.4.5o/p) stack the sentence under the bar
 * and put the pill beside the label. Props: rows [{ id, name, ratio, tag }], selectedId (others fade, 11.4.5b), hint, hintCompact, note, className; rows with `compact` are the four the phone / tablet frames draw.
 */

const PILL = {
  Shortage: 'bg-[#faf4e8] text-[#967014]',
  Tight: 'bg-[#efefea] text-[#575755]',
  Balanced: 'bg-[#ebf1ec] text-[#387440]',
  Surplus: 'bg-[#efefea] text-[#575755]',
};

const Pill = ({ tag }) => (
  <span
    className={classNames(
      'inline-flex w-fit shrink-0 rounded-full px-[8px] py-[3px] text-[12px] leading-[14px] font-semibold',
      PILL[tag]
    )}
  >
    {tag}
  </span>
);

const SupplyDemandCard = ({ rows, selectedId, hint, hintCompact, note, className }) => (
  <PublicCard
    id="supply-vs-demand"
    title="Supply vs demand"
    headerExtra={<CardHint full={hint} compact={hintCompact} />}
    className={className}
    bodyClassName="flex flex-col gap-[12px] px-[16px] pb-[24px] md:px-[24px]"
  >
    <ul
      aria-label="Talents per open opportunity by skill"
      className="m-0 flex list-none flex-col gap-[16px] p-0 lg:gap-[10px]"
    >
      {rows.map((r) => {
        const dim = selectedId && r.id !== selectedId;
        return (
          <li
            key={r.id}
            className={classNames(
              'flex flex-col gap-[6px] lg:grid lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)_150px_66px] lg:items-center lg:gap-[12px]',
              dim && 'opacity-50',
              !r.compact && 'max-lg:hidden'
            )}
          >
            <span className="flex items-center justify-between gap-[8px]">
              <span
                className={classNames(
                  'truncate text-[14px] leading-[17px] text-[#1c2a21]',
                  r.id === selectedId ? 'font-bold' : 'font-medium'
                )}
              >
                {r.name}
              </span>
              <span className="lg:hidden">
                <Pill tag={r.tag} />
              </span>
            </span>
            <span aria-hidden="true" className="h-[14px] rounded-[4px] bg-[#efefea]">
              <span
                className="block h-full rounded-[4px] bg-[#387440]"
                style={{ width: `${(r.ratio / SUPPLY_MAX) * 100}%` }}
              />
            </span>
            <span className="text-[12px] leading-[14px] text-[#575755] lg:text-[14px] lg:leading-[17px] lg:font-semibold lg:text-[#1c2a21]">
              {`${r.ratio} per opportunity`}
            </span>
            <span className="max-lg:hidden">
              <Pill tag={r.tag} />
            </span>
          </li>
        );
      })}
    </ul>
    {note ? <DemandNote className="max-lg:hidden">{note}</DemandNote> : null}
  </PublicCard>
);

export default SupplyDemandCard;
