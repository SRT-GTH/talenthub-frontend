import { useParams } from 'react-router-dom';
import DirectoryDetailView from '../../components/sections/publicData/directory/DirectoryDetailView.jsx';
import OpportunitiesDirectory from '../../components/sections/publicData/directory/OpportunitiesDirectory.jsx';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicOpportunitiesPage');

/*
 * PublicOpportunitiesPage — Figma canvas 8477:209484, 8.6.2a Opportunities directory · 8.6.2c filtered · 8.6.2b public preview detail
 * (+ phone 8508:428 / 8516:330 and tablet 8516:355894).
 *   /data/opportunities[?type&region&closing&eligibility&q&page]   the directory
 *   /data/opportunities/:opportunityId                              the public preview (what a visitor sees before signing in)
 * Package "directory": components/sections/publicData/directory/ (mock data in data/directoryData.js).
 */
const PublicOpportunitiesPage = () => {
  const data = usePublicDataState();
  const { opportunityId } = useParams();
  log('mount', { opportunityId, state: data.state });
  return (
    <PublicDataFrame data={data} title="Opportunities" active="directory">
      {opportunityId ? (
        <DirectoryDetailView kind="opportunity" id={opportunityId} data={data} />
      ) : (
        <OpportunitiesDirectory data={data} />
      )}
      <PublicDataModals
        data={data}
        scope={{ title: 'Opportunities', reportKind: 'overview', sharePath: 'opportunities' }}
      />
    </PublicDataFrame>
  );
};

export default PublicOpportunitiesPage;
