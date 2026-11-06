import DemandCard from './DemandCard.jsx';
import { formatCount } from '../agencyFormat.js';
import ChartLegend from './ChartLegend.jsx';
import ColumnTrendChart from './ColumnTrendChart.jsx';
import DemandNote from './DemandNote.jsx';
import TrendHeadline from './TrendHeadline.jsx';
import { autoFormat, niceTicks } from './trendModel.js';

/*
 * OpportunitiesPostedCard — "Opportunities posted" (Figma 8704:713, 652 wide): headline (14,630 ▲ +34% "opportunities in 12 months"), paired columns per period —
 * recruiter roles #387440 and government programme places #9fc3a5 (18px each, NOT stacked) — legend and the "Not stacked" note.
 * Props: model (trendSeries()), text (TREND_TEXT[unit]). Cell values go through formatCount (<5 rule).
 */

const OpportunitiesPostedCard = ({ model, text }) => {
  const axis = niceTicks(Math.max(...model.recruiter, ...model.programmes, 1));
  const ticks = axis.ticks;
  return (
    <DemandCard
      id="opportunities-posted"
      title="Opportunities posted"
      hint="Recruiters and government programmes side by side"
      className="flex flex-col"
      bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[24px]"
    >
      <TrendHeadline
        value={formatCount(model.totals.opportunities)}
        change={model.totals.oppChange}
        note={text.oppNote}
      />
      <ColumnTrendChart
        labels={model.labels}
        values={model.recruiter}
        pairs={model.programmes}
        ticks={model.ticks}
        yTicks={ticks}
        yMax={axis.max}
        format={autoFormat}
        caption="Opportunities posted per period, recruiter roles and government programme places"
        headers={['Period', 'Recruiter roles', 'Government programme places']}
        formatCell={formatCount}
      />
      <ChartLegend
        items={[
          { label: 'Recruiter roles', color: '#387440', kind: 'box' },
          { label: 'Government programme places', color: '#9fc3a5', kind: 'box' },
        ]}
      />
      <DemandNote>Not stacked, so each source can be read on its own.</DemandNote>
    </DemandCard>
  );
};

export default OpportunitiesPostedCard;
