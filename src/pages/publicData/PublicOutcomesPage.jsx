import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import OutcomesDashboard from '../../components/sections/publicData/outcomes/OutcomesDashboard.jsx';
import OutcomesStoryDetail from '../../components/sections/publicData/outcomes/OutcomesStoryDetail.jsx';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { useAgencyResource } from '../../components/sections/agency/useAgencyResource.js';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { publicOutcomes } from '../../services/publicData.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('PublicOutcomesPage');

/*
 * PublicOutcomesPage — Platform outcomes (Figma canvas 8477:209484: 8.5.1a dashboard, 8.5.1b case study, 8.5.1c phone, 8.5.1d loading; ?print=1
 * renders the print layout of the share/download package).
 *   /data/outcomes                       dashboard (?range=90d|1y|all, default 1y)
 *   /data/outcomes/stories/:storyId      a case study — only stories talents consented to share (the server sends `stories`); none are
 *                                        published yet, so an id shows "This story isn't available"
 * Live: GET /api/public-data/outcomes?range= (placements, by type and over time; skills with assessment evidence; partners; scholarships).
 */

const PublicOutcomesPage = () => {
  const data = usePublicDataState();
  const { storyId } = useParams();
  const { params, update, state } = data;
  const range = ['90d', '1y', 'all'].includes(params.get('range')) ? params.get('range') : '1y';
  const res = useAgencyResource(() => publicOutcomes(range), [range]);
  const stories = res.data?.stories || [];
  const story = storyId ? stories.find((s) => s.id === storyId) || null : null;

  useEffect(() => {
    log('mount', { storyId, range, state, found: Boolean(story) });
  }, [storyId, range, state, story]);

  let body;
  if (storyId && story) {
    body = <OutcomesStoryDetail story={story} others={stories.filter((s) => s.id !== story.id)} />;
  } else if (storyId && !res.loading) {
    body = (
      <div className="flex flex-col items-start gap-[12px] p-[16px] font-sans md:p-[28px] xl:p-[40px]">
        <p className="m-0 text-[15px] text-[#595959]">
          This story isn’t available. Stories are shared only with each talent’s written consent.
        </p>
        <Link to="/data/outcomes" className="font-semibold text-[#387440]">
          Back to outcomes
        </Link>
      </div>
    );
  } else if (res.error && !res.data) {
    body = (
      <div className="p-[16px] md:p-[28px] xl:p-[40px]">
        <EmptyState
          title="We couldn’t load the outcomes"
          message="Check your connection and try again."
          actionLabel="Try again"
          onAction={res.reload}
        />
      </div>
    );
  } else if (!res.data) {
    body = <PageLoader look="focused" />;
  } else {
    body = (
      <OutcomesDashboard
        response={res.data}
        stories={stories}
        range={range}
        onRange={(next) => {
          log('range', next);
          update({ range: next === '1y' ? null : next }, { replace: true });
        }}
        loading={state === 'loading'}
      />
    );
  }

  return (
    <PublicDataFrame data={data} title={storyId ? 'Stories' : 'Outcomes'} active="outcomes">
      {body}
      <MobileActionBar
        onShare={() => update({ modal: 'share' })}
        onDownload={() => update({ modal: 'download' })}
      />
      <PublicDataModals
        data={data}
        scope={{ title: 'Outcomes', reportKind: 'outcomes', sharePath: 'outcomes' }}
      />
    </PublicDataFrame>
  );
};

export default PublicOutcomesPage;
