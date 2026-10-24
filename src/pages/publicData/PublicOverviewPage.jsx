import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import {
  DATA_AS_OF,
  mapStateFor,
} from '../../components/sections/publicData/overview/data/overviewData.js';
import OverviewInterestsCard from '../../components/sections/publicData/overview/OverviewInterestsCard.jsx';
import OverviewKpis from '../../components/sections/publicData/overview/OverviewKpis.jsx';
import OverviewPageHeader from '../../components/sections/publicData/overview/OverviewPageHeader.jsx';
import OverviewProfileCard from '../../components/sections/publicData/overview/OverviewProfileCard.jsx';
import OverviewWhoCard from '../../components/sections/publicData/overview/OverviewWhoCard.jsx';
import { useOverviewData } from '../../components/sections/publicData/overview/useOverviewData.js';
import { useOverviewFilters } from '../../components/sections/publicData/overview/useOverviewFilters.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import FilterBar from '../../components/sections/publicData/ui/FilterBar.jsx';
import FilterSheet from '../../components/sections/publicData/ui/FilterSheet.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import TodayStrip from '../../components/sections/publicData/ui/TodayStrip.jsx';
import RegionalMapCard from '../../components/sections/publicData/map/RegionalMapCard.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicOverviewPage');

/*
 * PublicOverviewPage — Figma canvas 8477:209484: 8.2.1a-f National overview (default · loading · section error · filtered · mobile · tablet),
 * 8.2.2a-d the map states (the shared RegionalMapCard), 8.2.3a-d filters (one · many · zero matches · fewer than 5), 8.2.1h print (?print=1).
 * URL: region= edu= interest= age= gender= (publicDataState.js), state=loading|error|zero|suppressed, modal=filters|share|download|digest.
 * Every number comes from getOverview(filters) (overview/data/overviewData.js, the mock of GET /public/overview).
 */

/* RegionalMapCard shows its Compare button below md too (its `hidden` loses to the Button's own display); the phone frame 8507:86 has none. */
const HIDE_PHONE_COMPARE = "max-md:[&_button[class*='!w-fit']]:hidden";

const FRESHNESS = { loading: { label: 'Updated 3 h ago · Refreshing', tone: 'refreshing' } };

const PublicOverviewPage = () => {
  const data = usePublicDataState();
  const navigate = useNavigate();
  const { status, overview, retry } = useOverviewData(data.filters, data.state, data.update);
  const filterActions = useOverviewFilters(data);

  useEffect(() => {
    log('mount', { status });
  }, [status]);

  // ?map=hover|pinned|keyboard|low-data (&at=<region id>): the four map frames 8.2.2a-d, pinned through RegionalMapCard's `forced` prop
  const mapState = useMemo(
    () => mapStateFor(data.params.get('map'), data.params.get('at'), overview.regions),
    [data.params, overview.regions]
  );

  const resultCount = status === 'zero' ? 0 : status === 'suppressed' ? 3 : overview.count;
  const result = status === 'loading' ? { state: 'loading' } : { count: resultCount };
  const empty = status === 'zero' || status === 'suppressed';

  return (
    <PublicDataFrame
      data={data}
      title="National snapshot"
      active="overview"
      freshness={FRESHNESS[status]}
    >
      <div className="flex flex-col gap-[16px] overflow-x-clip px-[16px] pt-[16px] pb-[24px] md:gap-[24px] md:px-[28px] md:pt-[32px] md:pb-[48px] xl:px-[40px]">
        <OverviewPageHeader asOf={DATA_AS_OF} />
        <FilterBar
          filters={data.filters}
          onChange={filterActions.onChange}
          onClearAll={filterActions.onClearAll}
          onSaveLink={filterActions.onSaveLink}
          onOpenSheet={filterActions.sheet.open}
          result={result}
        />
        <p role="status" aria-live="polite" className="sr-only">
          {filterActions.announce}
        </p>
        {empty ? (
          <EmptyState
            variant={status}
            onAction={status === 'zero' ? filterActions.onClearAll : filterActions.onRemoveLast}
          />
        ) : (
          <>
            <OverviewKpis overview={overview} loading={status === 'loading'} />
            <div className="grid min-w-0 grid-cols-1 gap-[16px] md:gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,528fr)]">
              <RegionalMapCard
                regions={mapState.regions}
                forced={mapState.forced}
                filterLabel={mapState.filterLabel}
                loading={status === 'loading'}
                onOpenRegion={(id) => navigate(`/data/regions/${id}`)}
                onCompare={() => navigate('/data/compare')}
                className={HIDE_PHONE_COMPARE}
              />
              <OverviewInterestsCard
                interests={overview.interests}
                loading={status === 'loading'}
                error={status === 'error'}
                onRetry={retry}
              />
            </div>
            <div className="grid min-w-0 grid-cols-1 items-start gap-[16px] md:grid-cols-2 md:gap-[24px]">
              <OverviewWhoCard
                education={overview.education}
                ages={overview.ages}
                count={overview.count}
                medianAge={overview.medianAge}
              />
              <OverviewProfileCard
                capabilities={overview.capabilities}
                gender={overview.gender}
                count={overview.count}
              />
            </div>
            <TodayStrip stats={overview.today} />
          </>
        )}
      </div>
      <FilterSheet
        isOpen={filterActions.sheet.isOpen}
        onClose={filterActions.sheet.close}
        filters={data.filters}
        onApply={filterActions.sheet.apply}
        countFor={filterActions.sheet.countFor}
      />
      <MobileActionBar
        onShare={() => data.update({ modal: 'share' })}
        onDownload={() => data.update({ modal: 'download' })}
      />
      <PublicDataModals
        data={data}
        scope={{ title: 'National snapshot', reportKind: 'overview' }}
      />
    </PublicDataFrame>
  );
};

export default PublicOverviewPage;
