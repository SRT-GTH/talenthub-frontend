import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import DigestUnsubscribedCard from '../../components/sections/publicData/share/DigestUnsubscribedCard.jsx';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicDigestUnsubscribedPage');

/*
 * PublicDigestUnsubscribedPage — Figma 8.8.3f "Digest · Unsubscribed confirmation" (8505:187), route /data/digest/unsubscribed.
 * Public chrome (sidebar, top bar "National snapshot", footer) around one confirmation card; the body has 120px of vertical air as drawn.
 * ⚠️ ASSUMPTION: the active sidebar item is "National overview" (the top bar says "National snapshot"; Figma shows no other context).
 */
const PublicDigestUnsubscribedPage = () => {
  const data = usePublicDataState();
  log('mount');
  return (
    <PublicDataFrame data={data} title="National snapshot" active="overview">
      <div className="px-[16px] py-[48px] md:px-[32px] md:py-[80px] xl:px-[40px] xl:py-[120px]">
        <DigestUnsubscribedCard />
      </div>
      <PublicDataModals
        data={data}
        scope={{ title: 'National snapshot', reportKind: 'overview' }}
      />
    </PublicDataFrame>
  );
};

export default PublicDigestUnsubscribedPage;
