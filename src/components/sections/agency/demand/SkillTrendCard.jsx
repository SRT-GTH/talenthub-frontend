import PublicCard from '../../publicData/ui/PublicCard.jsx';
import ChartLegend from './ChartLegend.jsx';
import LineTrendChart from './LineTrendChart.jsx';
import TrendHeadline from './TrendHeadline.jsx';

/*
 * SkillTrendCard — "Skill trend" (Figma 8704:782, 652 wide): headline = the fastest riser of the top 5 ("Data analysis ▲ +77% fastest rise of the top 5"), five 2px
 * lines (#142916 · #2a5730 · #387440 · #6f9d76 · #a9c7ae) with a 9px end dot each, legend of the five names. Props: model (trendSeries()), text (TREND_TEXT[unit]).
 */

const COLORS = ['#142916', '#2a5730', '#387440', '#6f9d76', '#a9c7ae'];

const SkillTrendCard = ({ model, text }) => {
  const names = Object.keys(model.skills);
  const n = model.labels.length;
  const step = model.unit === 'week' ? 3 : model.unit === 'month' ? 2 : Math.ceil(n / 6);
  const all = Object.values(model.skills).flat();
  const unitMonth = model.unit === 'month';
  const yMin = unitMonth ? 100 : Math.floor(Math.min(...all) / 5) * 5;
  const yMax = unitMonth ? 220 : Math.ceil(Math.max(...all) / 5) * 5;
  const stepY = unitMonth ? 40 : 5;
  const ticks = Array.from(
    { length: Math.round((yMax - yMin) / stepY) + 1 },
    (_, i) => yMin + i * stepY
  );
  return (
    <PublicCard
      id="skill-trend"
      title="Skill trend"
      hint={text.skillHint}
      className="flex flex-col"
      bodyClassName="flex flex-col gap-[12px] px-[16px] pb-[24px] md:px-[24px]"
    >
      <TrendHeadline
        value={names[0]}
        change={model.totals.skillChange}
        note="fastest rise of the top 5"
      />
      <LineTrendChart
        series={names.map((name, i) => ({ name, values: model.skills[name], color: COLORS[i] }))}
        labels={model.labels}
        xTicks={model.labels.map((l, i) => ({ i, label: l })).filter((t) => t.i % step === 0)}
        yTicks={ticks}
        yMin={yMin}
        yMax={yMax}
        format={String}
        height={280}
        caption="Opportunities per period for the top 5 skills"
      />
      <ChartLegend
        items={names.map((name, i) => ({ label: name, color: COLORS[i], kind: 'line' }))}
      />
    </PublicCard>
  );
};

export default SkillTrendCard;
