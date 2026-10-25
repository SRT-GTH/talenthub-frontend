import PublicCard from '../../publicData/ui/PublicCard.jsx';
import TrendChart from '../../publicData/outcomes/TrendChart.jsx';

/*
 * ProgressPlacementsCard — "Placements over time" of the class outcomes (Figma 8745:47, same card as Theme 8 8496:126 with a 0-50 axis): 12 columns
 * Nov-Oct, the current month darker. The chart carries its own table equivalent (TrendChart). Props: series [{key,label,value}].
 */

const ProgressPlacementsCard = ({ series }) => (
  <PublicCard
    id="class-placements"
    title="Placements over time"
    hint="Per month · last 12 months"
    hintCompact="Last 12"
    bodyClassName="px-[16px] pb-[16px] md:px-[24px] md:pb-[24px]"
  >
    <TrendChart
      id="class-placements-per-month"
      title="Placements per month"
      unit="placements"
      kind="column"
      series={series}
      yMax={50}
      yStep={10}
      compactStep={25}
      height={260}
      top={18}
      current
      shortLabels
      showEndLabel={false}
    />
  </PublicCard>
);

export default ProgressPlacementsCard;
