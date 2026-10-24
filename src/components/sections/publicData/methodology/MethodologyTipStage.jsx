import { FreshnessPill } from '../PublicTopBar.jsx';
import SuppressedValue from '../ui/SuppressedValue.jsx';
import { TIP_FRAMES } from './data/methodologyData.js';
import FreshnessTooltip from './FreshnessTooltip.jsx';
import SuppressionPopover from './SuppressionPopover.jsx';

/*
 * MethodologyTipStage — the two component frames of Figma 8.7.2a (8499:170) and 8.7.2b (8499:188), 900x576, rendered at
 * /data/methodology?tip=freshness and ?tip=suppression with the popover open at first (it stays interactive) (⚠️ ASSUMPTION: the frames are documentation boards,
 * not screens; they have no chrome, so the page renders only this board for those two URLs). Title 20/24 600, hint 14/20 #595959, a 820x420
 * stage with the real components (FreshnessTooltip around the Live pill, SuppressionPopover around a "<5" chip in a bar row) on #f8f8f4.
 * Props: tip ('freshness' | 'suppression').
 */

const StatePill = ({ label, dot }) => (
  <span className="inline-flex h-[30px] items-center gap-[8px] rounded-full bg-[#f2f2ee] py-[7px] pr-[14px] pl-[12px] font-sans text-[13px] leading-[16px] font-medium whitespace-nowrap text-[#1c2a21]">
    <span aria-hidden="true" className="size-[8px] rounded-full" style={{ backgroundColor: dot }} />
    {label}
  </span>
);

const MethodologyTipStage = ({ tip }) => {
  const f = TIP_FRAMES[tip];
  return (
    <main className="flex min-h-screen flex-col gap-[16px] bg-[#f8f8f4] p-[40px] font-sans">
      <h1 className="m-0 text-[20px] leading-[24px] font-semibold text-[#1c2a21]">{f.title}</h1>
      <p className="m-0 max-w-[820px] text-[14px] leading-[20px] text-[#595959]">{f.hint}</p>
      {tip === 'freshness' ? (
        <div className="relative h-[420px] max-w-[820px]">
          <div className="absolute top-[20px] right-[220px]">
            <FreshnessTooltip defaultOpen>
              <FreshnessPill label={f.pillLabel} />
            </FreshnessTooltip>
          </div>
          <p className="absolute top-[270px] left-[20px] m-0 text-[13px] leading-[16px] font-medium text-[#595959]">
            {f.otherStates}
          </p>
          <div className="absolute top-[300px] left-[20px]">
            <StatePill {...f.stale} />
          </div>
          <div className="absolute top-[350px] left-[20px]">
            <StatePill {...f.offline} />
          </div>
        </div>
      ) : (
        <div className="relative h-[420px] max-w-[820px]">
          <div className="absolute top-[20px] left-[20px] flex w-[560px] max-w-full items-center gap-[12px] py-[5px]">
            <span className="w-[190px] shrink-0 text-[14px] leading-[17px] font-medium text-[#1c2a21]">
              {f.rowLabel}
            </span>
            <span
              aria-hidden="true"
              className="h-[14px] w-[290px] min-w-0 flex-1 rounded-[4px] bg-[#efefea]"
            />
            <SuppressionPopover defaultOpen>
              <SuppressedValue />
            </SuppressionPopover>
          </div>
        </div>
      )}
    </main>
  );
};

export default MethodologyTipStage;
