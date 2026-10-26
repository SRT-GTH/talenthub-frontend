import DemandCard from './DemandCard.jsx';
import { formatCount } from '../agencyFormat.js';
import ColumnTrendChart from './ColumnTrendChart.jsx';
import LineTrendChart from './LineTrendChart.jsx';
import TrendHeadline from './TrendHeadline.jsx';
import { autoFormat, niceTicks } from './trendModel.js';

/*
 * AssessmentTrendCard — "Assessment trend" (Figma 8704:947, 1329 wide): two charts, two scales. Left: assessments taken (71,240 ▲ +46%, columns #387440, last period darker);
 * right: average score (68 / 100 ▲ +7 pts, one 2px line ending in a dot and its value). Props: model (trendSeries()), text (TREND_TEXT[unit]).
 */

const AssessmentTrendCard = ({ model, text }) => {
  const n = model.labels.length;
  const step = model.unit === 'week' ? 3 : model.unit === 'month' ? 2 : Math.ceil(n / 6);
  const axis = niceTicks(Math.max(...model.assessments, 1));
  const aTicks = axis.ticks;
  const last = model.score[n - 1];
  const hasScore = model.score.some((v) => v > 0);
  return (
    <DemandCard
      id="assessment-trend"
      title="Assessment trend"
      hint="Assessments taken and average score · two charts, two scales"
      bodyClassName="px-[24px] pb-[24px]"
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
            yMax={axis.max}
            format={autoFormat}
            caption="Assessments taken per period"
            headers={['Period', 'Assessments taken']}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-[8px]">
          <TrendHeadline
            value={hasScore ? `${last} / 100` : '—'}
            changeText={
              typeof model.totals.scoreChange === 'number'
                ? `${model.totals.scoreChange >= 0 ? '▲ +' : '▼ −'}${Math.abs(model.totals.scoreChange)} pts`
                : undefined
            }
            note={
              hasScore
                ? 'average score'
                : 'average score · shown once a period has 5 or more results'
            }
          />
          <LineTrendChart
            series={[{ name: 'Average score (out of 100)', values: model.score, color: '#387440' }]}
            labels={model.labels}
            xTicks={model.labels.map((l, i) => ({ i, label: l })).filter((t) => t.i % step === 0)}
            yTicks={[0, 25, 50, 75, 100]}
            yMin={0}
            yMax={100}
            format={String}
            height={220}
            endLabel={hasScore ? String(last) : undefined}
            caption="Average assessment score per period, out of 100"
          />
        </div>
      </div>
    </DemandCard>
  );
};

export default AssessmentTrendCard;
