import { classNames } from '../../../../utils/classNames.js';
import PublicCard from '../ui/PublicCard.jsx';
import TrendChart from './TrendChart.jsx';

/*
 * TrendCard — one chart card of Growth trends (Figma "Total talents" 8496:347827 etc., 668x347): header (title 18/21 600 · aside "Cumulative" / "Per week" /
 * "Per month" / "Per quarter" 12/14 500 #595959), headline row (value 30/36 700 #2a5730 + delta 14/17 600 #387440, gap 10, px24), chart (px24 pb24 pt8).
 * Phone card (8508:225, 358x263): head 16/19, value 22/26 700, chart 160 high; the Assessments card is not drawn on the phone (hidden there by the page).
 * Props: chart (one entry of the trends response), loading-free, className
 */

const TrendCard = ({ chart, className }) => {
  const xLabelEvery = chart.series.length === 13 ? 2 : 1;
  return (
    <PublicCard
      id={`trend-${chart.id}`}
      title={chart.title}
      hint={chart.aside}
      bodyClassName="flex flex-col gap-[8px] pb-[16px] md:pb-[24px]"
      className={classNames('overflow-hidden', className)}
    >
      <p className="m-0 flex flex-wrap items-baseline gap-x-[10px] px-[16px] md:px-[24px]">
        <span className="text-[22px] leading-[26px] font-bold text-[#2a5730] md:text-[30px] md:leading-[36px]">
          {chart.headlineShort ? (
            <>
              <span className="md:hidden">{chart.headlineShort}</span>
              <span className="max-md:hidden">{chart.headline}</span>
            </>
          ) : (
            chart.headline
          )}
        </span>
        <span className="text-[14px] leading-[17px] font-semibold text-[#387440] max-md:hidden">
          {chart.delta}
        </span>
      </p>
      <div className="px-[16px] md:px-[24px] md:pt-[0px]">
        <TrendChart
          id={chart.id}
          title={chart.title}
          unit={chart.title}
          kind={chart.kind}
          series={chart.series}
          yMax={chart.yMax}
          yStep={chart.yStep}
          area={chart.id === 'total'}
          current={chart.current}
          events={chart.events}
          xLabelEvery={xLabelEvery}
          labelIndexes={chart.labelIndexes}
          shortLabels
          initialActive={chart.hoverIndex ?? null}
          showEndLabel={chart.showEndLabel ?? chart.kind === 'line'}
        />
      </div>
    </PublicCard>
  );
};

export default TrendCard;
