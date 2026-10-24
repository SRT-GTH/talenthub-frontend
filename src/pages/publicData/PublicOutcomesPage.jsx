import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import OutcomesDashboard from '../../components/sections/publicData/outcomes/OutcomesDashboard.jsx';
import OutcomesStoryDetail from '../../components/sections/publicData/outcomes/OutcomesStoryDetail.jsx';
import {
  findStory,
  getOutcomeStories,
  getOutcomes,
} from '../../components/sections/publicData/outcomes/data/outcomesData.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicOutcomesPage');

/*
 * PublicOutcomesPage — Platform outcomes (Figma canvas 8477:209484: 8.5.1a dashboard, 8.5.1b case study, 8.5.1c phone, 8.5.1d loading; 8.5.1e is the print layout,
 * whose stylesheet is owned by the share/download package: ?print=1 renders this same page).
 *   /data/outcomes                       dashboard (?range=90d|1y|all, default 1y; ?state=loading)
 *   /data/outcomes/stories/:storyId      case study (ama-k = "From Tamale to a data internship"); an unknown id shows the dashboard
 */

const PublicOutcomesPage = () => {
  const data = usePublicDataState();
  const { storyId } = useParams();
  const { params, update, state } = data;
  const range = ['90d', '1y', 'all'].includes(params.get('range')) ? params.get('range') : '1y';
  const response = useMemo(() => getOutcomes(), []);
  const stories = useMemo(() => getOutcomeStories(), []);
  const story = storyId ? findStory(storyId) : null;

  useEffect(() => {
    log('mount', { storyId, range, state, found: Boolean(story) });
  }, [storyId, range, state, story]);

  return (
    <PublicDataFrame data={data} title={story ? 'Stories' : 'Outcomes'} active="outcomes">
      {story ? (
        <OutcomesStoryDetail story={story} others={stories.filter((s) => s.id !== story.id)} />
      ) : (
        <OutcomesDashboard
          response={response}
          stories={stories}
          range={range}
          onRange={(next) => {
            log('range', next);
            update({ range: next === '1y' ? null : next }, { replace: true });
          }}
          loading={state === 'loading'}
        />
      )}
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
