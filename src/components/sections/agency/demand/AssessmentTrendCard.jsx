import PublicCard from '../../publicData/ui/PublicCard.jsx';
import { formatCount } from '../agencyFormat.js';
import ColumnTrendChart from './ColumnTrendChart.jsx';
import LineTrendChart from './LineTrendChart.jsx';
import TrendHeadline from './TrendHeadline.jsx';

/*
 * AssessmentTrendCard — "Assessment trend" (Figma 8704:947, 1329 wide): two charts, two scales. Left: assessments taken (71,240 ▲ +46%, columns #387440, last period darker);
 * right: average score (68 / 100 ▲ +7 pts, one 2px line ending in a dot and its value). Props: model (trendSeries()), text (TREND_TEXT[unit]).
 */

const fmt = (v) => (v === 0 ? '0k' : `${v}k`);

const AssessmentTrendCard = ({ model, text }) => {
  const n = model.labels.length;
  const step = model.unit === 'week' ? 3 : model.unit === 'month' ? 2 : Math.ceil(n / 6);
  const aStep = model.unit === 'month' ? 2.5 : 0.5;
  const aTicks = Array.from({ length: Math.round(model.asYMax / aStep) + 1 }, (_, i) => i * aStep);
  const last = model.score[n - 1];
  return (
    <PublicCard
      id="assessment-trend"
      title="Assessment trend"
      hint="Assessments taken and average score · two charts, two scales"
      bodyClassName="px-[16px] pb-[24px] md:px-[24px]"
    >
      <div className="grid min-w-0 grid-cols-1 gap-[24px] lg:grid-cols-2 lg:gap-[32px]">
        <div className="flex min-w-0 flex-col gap-[8px]">
          <TrendHeadline
            value={formatCount(model.totals.assessments)}
            change={model.totals.assessChange}
            note={
              text.regNote.includes('quarter') ? 'assessments this quarter' : 'assessments taken'
            }
          />
          <ColumnTrendChart
            labels={model.labels}
            values={model.assessments}
            ticks={model.ticks}
            yTicks={aTicks}
            yMax={model.asYMax}
            format={fmt}
            caption="Assessments taken per period, thousands"
            headers={['Period', 'Assessments taken (thousands)']}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-[8px]">
          <TrendHeadline
            value={`${last} / 100`}
            changeText={`▲ +${model.totals.scoreChange} pts`}
            note="average score"
          />
          <LineTrendChart
            series={[{ name: 'Average score (out of 100)', values: model.score, color: '#387440' }]}
            labels={model.labels}
            xTicks={model.labels.map((l, i) => ({ i, label: l })).filter((t) => t.i % step === 0)}
            yTicks={[50, 60, 70, 80]}
            yMin={50}
            yMax={80}
            format={String}
            height={220}
            endLabel={String(last)}
            caption="Average assessment score per period, out of 100"
          />
        </div>
      </div>
    </PublicCard>
  );
};

export default AssessmentTrendCard;
