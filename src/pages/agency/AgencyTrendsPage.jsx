import { useEffect } from 'react';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { useAgencyResource } from '../../components/sections/agency/useAgencyResource.js';
import TrendsView from '../../components/sections/publicData/outcomes/TrendsView.jsx';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import { agencyTrends } from '../../services/agency.api.js';
import { debug } from '../../utils/debug.js';
import { GOVERNMENT_PAGE_TEXT, governmentPageText } from '../../copy/portals/governmentCopy.js';

const log = debug('AgencyTrendsPage');

/*
 * AgencyTrendsPage — /agency/trends (Figma 11.4.2c "Trends, 24 months"). Theme 8's trend charts, `embedded` + base="/agency".
 * Live: GET /agency/trends?range= (total talents, new sign-ups, assessments completed, placements; values of 1-4 are sent as 0 + suppressed).
 * Default range = 24 months (the history the MoU includes); ?range=90d|1y|all also work.
 */

const AgencyTrendsPage = () => {
  const data = useAgencyState();
  const raw = data.params.get('range');
  const range = ['90d', '1y', 'all'].includes(raw) ? raw : '24m';
  const res = useAgencyResource(() => agencyTrends(range), [range]);

  useEffect(() => {
    log('mount', { range });
  }, [range]);

  return (
    <AgencyFrame data={data} title="Trends">
      <AgencyPageHero
        title={GOVERNMENT_PAGE_TEXT.trends.title}
        subtitle={governmentPageText(
          'trends',
          'subtitle',
          range === '24m'
            ? 'Sign-ups, assessments and placements over 24 months. Your MoU includes the full history.'
            : res.data?.subtitle || 'Sign-ups, assessments and placements over time.'
        )}
        actions={<AgencyButton to="/agency/briefing?modal=download">Download PDF</AgencyButton>}
      />
      {res.error && !res.data ? (
        <EmptyState
          title="We couldn’t load the trends"
          message="Check your connection and try again."
          actionLabel="Try again"
          onAction={res.reload}
        />
      ) : res.data ? (
        <TrendsView
          trends={res.data}
          range={range}
          onRange={(next) => data.update({ range: next }, { replace: true })}
          base="/agency"
          embedded
        />
      ) : (
        <p role="status" className="m-0 p-[24px] font-sans text-[15px] text-[#737373]">
          Loading the trends…
        </p>
      )}
    </AgencyFrame>
  );
};

export default AgencyTrendsPage;
