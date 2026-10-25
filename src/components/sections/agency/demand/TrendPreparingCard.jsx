import DemandCard from './DemandCard.jsx';

/*
 * TrendPreparingCard — a skeleton chart card of the long-range state (Figma 8705:419086, 652 x 385): header title + "Preparing…", a 180x20 #efefea r6 title block,
 * twelve #efefea r4 bars (26 wide, gap 14, heights 90 120 80 150 130 170 160 190 140 200 180 210) and a 260x12 #f4f4f0 r6 axis block. Static, aria-busy.
 * Props: title.
 */

const BARS = [90, 120, 80, 150, 130, 170, 160, 190, 140, 200, 180, 210];

const TrendPreparingCard = ({ title }) => (
  <DemandCard
    id={`preparing-${title.toLowerCase().replace(/\s+/g, '-')}`}
    title={title}
    hint="Preparing…"
    loading
    bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[24px]"
  >
    <span aria-hidden="true" className="block h-[20px] w-[180px] rounded-[6px] bg-[#efefea]" />
    <div
      aria-hidden="true"
      className="flex h-[230px] items-end gap-[14px] overflow-hidden pt-[20px]"
    >
      {BARS.map((h, i) => (
        <span
          key={`${h}-${i}`}
          className="w-[26px] shrink-0 rounded-[4px] bg-[#efefea]"
          style={{ height: h }}
        />
      ))}
    </div>
    <span aria-hidden="true" className="block h-[12px] w-[260px] rounded-[6px] bg-[#f4f4f0]" />
  </DemandCard>
);

export default TrendPreparingCard;
