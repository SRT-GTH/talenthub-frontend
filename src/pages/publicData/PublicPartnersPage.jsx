import { useParams } from 'react-router-dom';
import DirectoryDetailView from '../../components/sections/publicData/directory/DirectoryDetailView.jsx';
import PartnersDirectory from '../../components/sections/publicData/directory/PartnersDirectory.jsx';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicPartnersPage');

/*
 * PublicPartnersPage — Figma canvas 8477:209484, 8.6.1a Partners directory · 8.6.1c filtered · 8.6.1b partner detail
 * (+ phone 8508:346 / 8516:250 and tablet 8516:355494).
 *   /data/partners[?type&region&focus&q&page]     the directory      /data/partners/:partnerId   the partner page
 * Package "directory": components/sections/publicData/directory/ (mock data in data/directoryData.js).
 */
const PublicPartnersPage = () => {
  const data = usePublicDataState();
  const { partnerId } = useParams();
  log('mount', { partnerId, state: data.state });
  return (
    <PublicDataFrame data={data} title="Directory" active="directory">
      {partnerId ? (
        <DirectoryDetailView kind="partner" id={partnerId} data={data} />
      ) : (
        <PartnersDirectory data={data} />
      )}
      <PublicDataModals
        data={data}
        scope={{ title: 'Partners', reportKind: 'overview', sharePath: 'partners' }}
      />
    </PublicDataFrame>
  );
};

export default PublicPartnersPage;
