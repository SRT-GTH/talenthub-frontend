import { useEffect, useMemo } from 'react';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import TrendsView from '../../components/sections/publicData/outcomes/TrendsView.jsx';
import { AGENCY_TRENDS_24M } from '../../components/sections/agency/national/data/trendsData.js';
import { getTrends } from '../../components/sections/publicData/outcomes/data/outcomesData.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyTrendsPage');

/*
 * AgencyTrendsPage — /agency/trends (Figma 11.4.2c "Trends, 24 months"). Theme 8's trend charts, `embedded` + base="/agency", range = 24 months (the 24-month
 * history the MoU includes; the frame draws no range control). ⚠️ ASSUMPTION: ?range=90d|1y|all still works as a deep link, default the 24-month series.
 */

const AgencyTrendsPage = () => {
  const data = useAgencyState();
  const raw = data.params.get('range');
  const range = ['90d', '1y', 'all'].includes(raw) ? raw : '24m';
  const trends = useMemo(() => (range === '24m' ? AGENCY_TRENDS_24M : getTrends(range)), [range]);

  useEffect(() => {
    log('mount', { range });
  }, [range]);

  return (
    <AgencyFrame data={data} title="Trends">
      <AgencyPageHero
        title="Trends"
        subtitle="Sign-ups, assessments and placements over 24 months. Your MoU includes the full history."
        actions={<AgencyButton to="/agency/briefing?modal=download">Download PDF</AgencyButton>}
      />
      <TrendsView
        trends={trends}
        range={range}
        onRange={(next) => data.update({ range: next }, { replace: true })}
        base="/agency"
        embedded
      />
    </AgencyFrame>
  );
};

export default AgencyTrendsPage;
