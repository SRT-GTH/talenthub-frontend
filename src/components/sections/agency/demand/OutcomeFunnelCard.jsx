import { classNames } from '../../../../utils/classNames.js';
import { isSuppressed } from '../agencyFormat.js';
import { AgencyArrowRightIcon } from '../agencyIcons.jsx';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import SuppressedValue from '../../publicData/ui/SuppressedValue.jsx';
import DemandNote from './DemandNote.jsx';
import { FUNNEL_NOTE } from './data/demandData.js';

/*
 * OutcomeFunnelCard — "Outcome funnel" (Figma 8706:633, 1329 wide): one funnel per source side by side (gap 40), each a 14/17 600 title and stage rows: label 14/500 (the last
 * stage 600) | track 360 (#efefea r4, 14 high; fill = count / first stage, #387440, the last stage #2a5730) | the raw count 14/600, and between rows "→ −71% drop-off"
 * (arrow-right turned down, 14px #575755, 12/14 500). The count prints as drawn ("41860"), and a stage under 5 reads the "<5" chip with no bar; when the drop-off into it would
 * identify the group the line reads "Drop-off hidden, group under 5" (11.4.5n). Props: funnels [{ title, stages: [{ label, count, drop?, dropHidden? }] }].
 * a11y: each funnel is a list; the drop-off lines are real text between the items.
 */

const Funnel = ({ funnel }) => {
  const first = funnel.stages[0].count;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
      <h3 className="m-0 text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
        {funnel.title}
      </h3>
      <ol
        aria-label={`${funnel.title} stages`}
        className="m-0 flex list-none flex-col gap-[10px] p-0"
      >
        {funnel.stages.map((s, i) => {
          const last = i === funnel.stages.length - 1;
          const low = isSuppressed(s.count);
          return (
            <li key={s.label} className="flex flex-col gap-[10px]">
              {i > 0 ? (
                <p className="m-0 flex items-center gap-[6px] pl-0 text-[12px] leading-[14px] font-medium text-[#575755] sm:pl-[152px]">
                  {s.dropHidden || low ? null : (
                    <AgencyArrowRightIcon className="size-[14px] shrink-0 rotate-90 text-[#575755]" />
                  )}
                  {s.dropHidden ? 'Drop-off hidden, group under 5' : `−${s.drop}% drop-off`}
                </p>
              ) : null}
              <div className="grid grid-cols-[minmax(0,92px)_minmax(0,1fr)_64px] items-center gap-[12px] sm:grid-cols-[minmax(0,140px)_minmax(0,360px)_minmax(0,1fr)]">
                <span
                  className={classNames(
                    'text-[14px] leading-[17px] text-[#1c2a21]',
                    last ? 'font-semibold' : 'font-medium'
                  )}
                >
                  {s.label}
                </span>
                <span aria-hidden="true" className="h-[14px] rounded-[4px] bg-[#efefea]">
                  {low ? null : (
                    <span
                      className={classNames(
                        'block h-full rounded-[4px]',
                        last ? 'bg-[#2a5730]' : 'bg-[#387440]'
                      )}
                      style={{ width: `${(s.count / first) * 100}%` }}
                    />
                  )}
                </span>
                <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {low ? <SuppressedValue value={s.count} /> : String(s.count)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const OutcomeFunnelCard = ({ funnels }) => (
  <PublicCard
    id="outcome-funnel"
    title="Outcome funnel"
    hint="Counts at each stage and the drop-off between them"
    bodyClassName="flex flex-col gap-[12px] px-[16px] pb-[24px] md:px-[24px]"
  >
    <div className="flex min-w-0 flex-col gap-[24px] xl:flex-row xl:gap-[40px]">
      {funnels.map((f) => (
        <Funnel key={f.title} funnel={f} />
      ))}
    </div>
    <DemandNote>{FUNNEL_NOTE}</DemandNote>
  </PublicCard>
);

export default OutcomeFunnelCard;
