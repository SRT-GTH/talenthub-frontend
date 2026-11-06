import DemandCard from './DemandCard.jsx';
import ChartLegend from './ChartLegend.jsx';
import ColumnTrendChart from './ColumnTrendChart.jsx';
import LineTrendChart from './LineTrendChart.jsx';
import TrendHeadline from './TrendHeadline.jsx';
import { formatCount } from '../agencyFormat.js';
import { autoFormat, niceTicks } from './trendModel.js';

/*
 * TalentGrowthCard — "Talent growth" (Figma 8704:617, 652 wide): headline (194,400 ▲ +87% "new talents in 12 months"), column chart of new registrations with the previous
 * period as a faint dashed line and the period still filling drawn darker, legend, then "Cumulative talents" and its line chart ending in a dot and "219.4k".
 * Props: model (trendSeries()), text (TREND_TEXT[unit]). Counts here are aggregates of the whole platform, far above 5 (the <5 rule cannot trigger).
 */

const TalentGrowthCard = ({ model, text }) => {
  const n = model.labels.length;
  const step = model.unit === 'week' ? 3 : model.unit === 'month' ? 2 : Math.ceil(n / 6);
  const cum = niceTicks(Math.max(...model.cumulative, 1));
  const cumMin = 0;
  const cumMax = cum.max;
  const cumTicks = cum.ticks;
  const reg = niceTicks(Math.max(...model.registrations, ...model.previous, 1));
  const regTicks = reg.ticks;
  return (
    <DemandCard
      id="talent-growth"
      title="Talent growth"
      hint={text.regHint}
      className="flex flex-col"
      bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[24px]"
    >
      <TrendHeadline
        value={formatCount(model.totals.registrations)}
        change={model.totals.regChange}
        note={text.regNote}
      />
      <ColumnTrendChart
        labels={model.labels}
        values={model.registrations}
        previous={model.previous}
        ticks={model.ticks}
        yTicks={regTicks}
        yMax={reg.max}
        format={autoFormat}
        caption="New talent registrations"
        headers={['Period', 'New registrations', 'Previous period']}
      />
      <ChartLegend
        items={[
          { label: 'New registrations', color: '#387440', kind: 'box' },
          { label: text.current, color: '#2a5730', kind: 'box' },
          { label: text.previous, color: '#9fc3a5', kind: 'dash' },
        ]}
      />
      <p className="m-0 mt-[4px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
        Cumulative talents
      </p>
      <LineTrendChart
        series={[{ name: 'Cumulative talents', values: model.cumulative, color: '#387440' }]}
        labels={model.labels}
        xTicks={model.labels.map((l, i) => ({ i, label: l })).filter((t) => t.i % step === 0)}
        yTicks={cumTicks}
        yMin={cumMin}
        yMax={cumMax}
        format={autoFormat}
        height={120}
        endLabel={autoFormat(model.cumulative[n - 1] ?? 0)}
        caption="Cumulative registered talents"
      />
    </DemandCard>
  );
};

export default TalentGrowthCard;
