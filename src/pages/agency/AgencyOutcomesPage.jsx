import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import OutcomesDashboard from '../../components/sections/publicData/outcomes/OutcomesDashboard.jsx';
import OutcomesStoryDetail from '../../components/sections/publicData/outcomes/OutcomesStoryDetail.jsx';
import {
  findStory,
  getOutcomeStories,
  getOutcomes,
} from '../../components/sections/publicData/outcomes/data/outcomesData.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyOutcomesPage');

/*
 * AgencyOutcomesPage — /agency/outcomes (Figma 11.4.2p "Impact and outcomes") and /agency/outcomes/stories/:storyId (11.4.2q "Case study").
 * Theme 8's outcomes dashboard / story detail, `embedded` + base="/agency". The dashboard shows the 12-month sample (the agency frame draws no range control).
 * "Share" on the case study copies the page link and says so (⚠️ ASSUMPTION: Figma draws no destination).
 */

const AgencyOutcomesPage = () => {
  const data = useAgencyState();
  const { storyId } = useParams();
  const response = useMemo(() => {
    const base = getOutcomes();
    // agency copy of the placements tile (Figma 11.4.2p)
    const sub =
      '23.4% success rate · ▲ +2.1 pts. Talents matched into jobs, internships and training.';
    return {
      ...base,
      kpis: { ...base.kpis, placements: { ...base.kpis.placements, sub, subShort: sub } },
    };
  }, []);
  const stories = useMemo(() => getOutcomeStories(), []);
  const story = storyId ? findStory(storyId) : null;
  const [copied, setCopied] = useState('');

  useEffect(() => {
    log('mount', { storyId, found: Boolean(story) });
  }, [storyId, story]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied('Link copied');
    } catch (error) {
      log('clipboard refused', error);
      setCopied('Copy the link from the address bar');
    }
  };

  return (
    <AgencyFrame data={data} title={story ? 'Case study' : 'Outcomes'}>
      {story ? (
        <>
          <AgencyPageHero
            title="Case study"
            subtitle="How one partner programme moved talents forward."
            actions={
              <AgencyButton size="xs" onClick={share}>
                Share
              </AgencyButton>
            }
          />
          <p role="status" aria-live="polite" className="sr-only">
            {copied}
          </p>
          <OutcomesStoryDetail
            story={story}
            others={stories.filter((s) => s.id !== story.id)}
            base="/agency"
            embedded
          />
        </>
      ) : (
        <>
          <AgencyPageHero
            title="Impact and outcomes"
            subtitle="Placements, scholarships and skills gained through GTH, all partners combined."
            actions={<AgencyButton to="/agency/briefing?modal=download">Download PDF</AgencyButton>}
          />
          <OutcomesDashboard
            response={response}
            stories={stories}
            range="1y"
            onRange={() => {}}
            loading={data.state === 'loading'}
            base="/agency"
            embedded
          />
        </>
      )}
    </AgencyFrame>
  );
};

export default AgencyOutcomesPage;
