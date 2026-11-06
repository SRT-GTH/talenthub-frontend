import PublicCard from '../../publicData/ui/PublicCard.jsx';
import TrendChart from '../../publicData/outcomes/TrendChart.jsx';

/*
 * ProgressPlacementsCard — the monthly column chart of the class outcomes (Figma 8745:47 "Placements over time", same card as Theme 8 8496:126): 12 columns,
 * the current month darker. Live it counts applications per month (placements are too few to chart); the axis follows the data (yMax).
 * The chart carries its own table equivalent (TrendChart). Props: series [{key,label,value}], yMax.
 */

const ProgressPlacementsCard = ({ series, yMax = 50 }) => (
  <PublicCard
    id="class-placements"
    title="Applications over time"
    hint="Per month · last 12 months"
    hintCompact="Last 12"
    bodyClassName="px-[16px] pb-[16px] md:px-[24px] md:pb-[24px]"
  >
    <TrendChart
      id="class-placements-per-month"
      title="Applications per month"
      unit="applications"
      kind="column"
      series={series}
      yMax={yMax}
      yStep={yMax / 5}
      compactStep={yMax / 2}
      height={260}
      top={18}
      current
      shortLabels
      showEndLabel={false}
    />
  </PublicCard>
);

export default ProgressPlacementsCard;
