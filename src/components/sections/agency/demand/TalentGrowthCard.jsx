import DemandCard from './DemandCard.jsx';
import ChartLegend from './ChartLegend.jsx';
import ColumnTrendChart from './ColumnTrendChart.jsx';
import LineTrendChart from './LineTrendChart.jsx';
import TrendHeadline from './TrendHeadline.jsx';

/*
 * TalentGrowthCard — "Talent growth" (Figma 8704:617, 652 wide): headline (194,400 ▲ +87% "new talents in 12 months"), column chart of new registrations with the previous
 * period as a faint dashed line and the period still filling drawn darker, legend, then "Cumulative talents" and its line chart ending in a dot and "219.4k".
 * Props: model (trendSeries()), text (TREND_TEXT[unit]). Counts here are aggregates of the whole platform, far above 5 (the <5 rule cannot trigger).
 */

const k = (v) => `${v}k`;

const TalentGrowthCard = ({ model, text }) => {
  const n = model.labels.length;
  const step = model.unit === 'week' ? 3 : model.unit === 'month' ? 2 : Math.ceil(n / 6);
  const cumMin = model.unit === 'month' ? 0 : Math.floor(Math.min(...model.cumulative) / 25) * 25;
  const cumMax = model.unit === 'month' ? 240 : Math.ceil(Math.max(...model.cumulative) / 25) * 25;
  const cumTicks =
    model.unit === 'month'
      ? [0, 80, 160, 240]
      : Array.from({ length: Math.round((cumMax - cumMin) / 25) + 1 }, (_, i) => cumMin + i * 25);
  const regStep = model.unit === 'month' ? 5 : 2;
  const regTicks = Array.from({ length: model.regYMax / regStep + 1 }, (_, i) => i * regStep);
  return (
    <DemandCard
      id="talent-growth"
      title="Talent growth"
      hint={text.regHint}
      className="flex flex-col"
      bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[24px]"
    >
      <TrendHeadline
        value={model.totals.registrations.toLocaleString('en-GB')}
        change={model.totals.regChange}
        note={text.regNote}
      />
      <ColumnTrendChart
        labels={model.labels}
        values={model.registrations}
        previous={model.previous}
        ticks={model.ticks}
        yTicks={regTicks}
        yMax={model.regYMax}
        format={k}
        caption="New talent registrations, thousands"
        headers={['Period', 'New registrations (thousands)', 'Previous period (thousands)']}
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
        series={[
          { name: 'Cumulative talents (thousands)', values: model.cumulative, color: '#387440' },
        ]}
        labels={model.labels}
        xTicks={model.labels.map((l, i) => ({ i, label: l })).filter((t) => t.i % step === 0)}
        yTicks={cumTicks}
        yMin={cumMin}
        yMax={cumMax}
        format={k}
        height={120}
        endLabel={`${model.cumulative[n - 1]}k`}
        caption="Cumulative registered talents, thousands"
      />
    </DemandCard>
  );
};

export default TalentGrowthCard;
