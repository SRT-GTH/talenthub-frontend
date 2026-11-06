import PublicCard from '../ui/PublicCard.jsx';
import Skeleton from '../ui/Skeleton.jsx';
import TrendChart from './TrendChart.jsx';

/*
 * OutcomesPlacementsCard — Figma "Placements over time" 8496:126 (860x343; chart wrap 812x260) + phone card "Placements per month" 8507:468 (358x245).
 * Header: "Placements over time" · "Per month · last 12 months" (phone: "Placements per month" · "Last 12"). 12 columns Nov–Oct, the current month darker.
 * Loading (8.5.1d, 8496:379): the chart area is one #f2f2ee r12 block of 812x260. Props: series, loading
 */

/** The axis top from the live series: a round number just above the largest month (at least 4), in 4 steps. */
const scaleOf = (series) => {
  const max = Math.max(0, ...(series || []).map((s) => Number(s?.value) || 0));
  if (max <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(max));
  const m = [1, 2, 2.5, 4, 5, 8, 10].find((x) => x * p >= max * 1.05) || 10;
  return m * p;
};

const OutcomesPlacementsCard = ({ series, loading = false, className }) => {
  const yMax = scaleOf(series);
  return (
    <PublicCard
      id="outcomes-placements"
      loading={loading}
      className={className}
      bodyClassName="px-[16px] pb-[16px] md:px-[24px] md:pb-[24px]"
      title={
        <>
          <span className="md:hidden">Placements per month</span>
          <span className="max-md:hidden">Placements over time</span>
        </>
      }
      hint="Per month · last 12 months"
      hintCompact="Last 12"
    >
      {loading ? (
        <div role="status">
          <span className="sr-only">Loading</span>
          <Skeleton height={260} radius={12} className="w-full max-md:!h-[160px]" />
        </div>
      ) : (
        <TrendChart
          id="placements-per-month"
          title="Placements per month"
          unit="placements"
          kind="column"
          series={series}
          yMax={yMax}
          yStep={yMax / 4}
          compactStep={yMax / 4}
          height={260}
          top={18}
          current
          shortLabels
          showEndLabel={false}
        />
      )}
    </PublicCard>
  );
};

export default OutcomesPlacementsCard;
