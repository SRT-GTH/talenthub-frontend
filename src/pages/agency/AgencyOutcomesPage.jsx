import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { useAgencyResource } from '../../components/sections/agency/useAgencyResource.js';
import OutcomesDashboard from '../../components/sections/publicData/outcomes/OutcomesDashboard.jsx';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import { agencyOutcomes } from '../../services/agency.api.js';
import { debug } from '../../utils/debug.js';
import { GOVERNMENT_PAGE_TEXT, governmentPageText } from '../../copy/portals/governmentCopy.js';

const log = debug('AgencyOutcomesPage');

/*
 * AgencyOutcomesPage — /agency/outcomes (Figma 11.4.2p "Impact and outcomes"). Theme 8's outcomes dashboard, `embedded` + base="/agency".
 * Live: GET /agency/outcomes?range=1y (placements = accepted applications, by type and over time; skills backed by a completed assessment;
 * partner organisations; open scholarships). Stories appear only when talents have consented to share one (none are published yet), so the
 * stories section is hidden and /agency/outcomes/stories/:id says the story isn't available.
 */

const AgencyOutcomesPage = () => {
  const data = useAgencyState();
  const { storyId } = useParams();
  const res = useAgencyResource(() => agencyOutcomes('1y'), []);

  useEffect(() => {
    log('mount', { storyId });
  }, [storyId]);

  if (storyId) {
    return (
      <AgencyFrame data={data} title="Case study">
        <AgencyPageHero
          title={GOVERNMENT_PAGE_TEXT.caseStudy.title}
          subtitle={governmentPageText(
            'caseStudy',
            'subtitle',
            'Stories are shared only with each talent’s written consent.'
          )}
        />
        <div className="flex flex-col items-start gap-[12px] p-[8px] font-sans">
          <p className="m-0 text-[15px] text-[#595959]">
            This story isn’t available. No consented stories are published yet.
          </p>
          <Link to="/agency/outcomes" className="font-semibold text-[#387440]">
            Back to outcomes
          </Link>
        </div>
      </AgencyFrame>
    );
  }

  return (
    <AgencyFrame data={data} title="Outcomes">
      <AgencyPageHero
        title={GOVERNMENT_PAGE_TEXT.outcomes.title}
        subtitle={governmentPageText(
          'outcomes',
          'subtitle',
          'Placements, scholarships and skills gained through GTH, all partners combined. Last 12 months.'
        )}
        actions={<AgencyButton to="/agency/briefing?modal=download">Download PDF</AgencyButton>}
      />
      {res.error && !res.data ? (
        <EmptyState
          title="We couldn’t load the outcomes"
          message="Check your connection and try again."
          actionLabel="Try again"
          onAction={res.reload}
        />
      ) : res.data ? (
        <OutcomesDashboard
          response={res.data}
          stories={res.data.stories}
          range="1y"
          onRange={() => {}}
          loading={false}
          base="/agency"
          embedded
        />
      ) : (
        <p role="status" className="m-0 p-[24px] font-sans text-[15px] text-[#737373]">
          Loading the outcomes…
        </p>
      )}
    </AgencyFrame>
  );
};

export default AgencyOutcomesPage;
