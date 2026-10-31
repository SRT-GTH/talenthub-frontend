import { useEffect } from 'react';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import TrendsView from '../../components/sections/publicData/outcomes/TrendsView.jsx';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { useAgencyResource } from '../../components/sections/agency/useAgencyResource.js';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { publicTrends } from '../../services/publicData.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('PublicTrendsPage');

/*
 * PublicTrendsPage — Growth over time (Figma canvas 8477:209484: 8.5.2a 90 days, 8.5.2b 1 year, 8.5.2c all time, phone 8.5.2d, tablet).
 * /data/outcomes/trends?range=90d|1y|all — default 1y. Live: GET /api/public-data/trends?range= (total talents, new sign-ups,
 * assessments completed, placements; values of 1-4 arrive as 0 + suppressed and print "<5").
 */

const PublicTrendsPage = () => {
  const data = usePublicDataState();
  const { params, update } = data;
  const range = ['90d', '1y', 'all'].includes(params.get('range')) ? params.get('range') : '1y';
  const res = useAgencyResource(() => publicTrends(range), [range]);

  useEffect(() => {
    log('mount', { range });
  }, [range]);

  return (
    <PublicDataFrame data={data} title="Growth trends" active="outcomes">
      {res.error && !res.data ? (
        <div className="p-[16px] md:p-[28px] xl:p-[40px]">
          <EmptyState
            title="We couldn’t load the trends"
            message="Check your connection and try again."
            actionLabel="Try again"
            onAction={res.reload}
          />
        </div>
      ) : res.data ? (
        <TrendsView
          trends={res.data}
          range={range}
          onRange={(next) => {
            log('range', next);
            update({ range: next }, { replace: true });
          }}
        />
      ) : (
        <PageLoader look="focused" />
      )}
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
