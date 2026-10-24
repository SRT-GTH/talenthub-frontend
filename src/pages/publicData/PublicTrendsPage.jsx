import { useEffect, useMemo } from 'react';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import TrendsView from '../../components/sections/publicData/outcomes/TrendsView.jsx';
import { getTrends } from '../../components/sections/publicData/outcomes/data/outcomesData.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicTrendsPage');

/*
 * PublicTrendsPage — Growth over time (Figma canvas 8477:209484: 8.5.2a 90 days, 8.5.2b 1 year (hover on assessments), 8.5.2c all time, phone 8.5.2d, tablet).
 * /data/outcomes/trends?range=90d|1y|all — default 1y (the phone and tablet frames draw it selected). ⚠️ ASSUMPTION: frames 8.5.2a/b pin the Assessments tooltip,
 * so on 90d / 1y that chart opens with it shown (W10 / Jul); the first pointer or keyboard interaction replaces it.
 */

const PublicTrendsPage = () => {
  const data = usePublicDataState();
  const { params, update } = data;
  const range = ['90d', '1y', 'all'].includes(params.get('range')) ? params.get('range') : '1y';
  const trends = useMemo(() => getTrends(range), [range]);

  useEffect(() => {
    log('mount', { range });
  }, [range]);

  return (
    <PublicDataFrame data={data} title="Growth trends" active="outcomes">
      <TrendsView
        trends={trends}
        range={range}
        onRange={(next) => {
          log('range', next);
          update({ range: next }, { replace: true });
        }}
      />
      <MobileActionBar
        onShare={() => update({ modal: 'share' })}
        onDownload={() => update({ modal: 'download' })}
      />
      <PublicDataModals
        data={data}
        scope={{ title: 'Growth trends', reportKind: 'outcomes', sharePath: 'outcomes/trends' }}
      />
    </PublicDataFrame>
  );
};

export default PublicTrendsPage;
