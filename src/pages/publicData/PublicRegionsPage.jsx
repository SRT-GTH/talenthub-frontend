import { useCallback, useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import RegionView from '../../components/sections/publicData/regions/RegionView.jsx';
import { buildPublicRegionView } from '../../components/sections/publicData/regions/publicRegionView.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import { useAgencyResource } from '../../components/sections/agency/useAgencyResource.js';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { publicRegion, publicRegions } from '../../services/publicData.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('PublicRegionsPage');

/*
 * PublicRegionsPage — /data/regions/:regionId (Figma 8.3.1a-d, tablet 8.9.1, phone 8.3.1a-m). Live: GET /api/public-data/regions/:id and the
 * switcher from GET /api/public-data/regions. Regions under 50 talents show the low-data panel (template rule); under 5 print "<5".
 * District pages are not public (district figures stay with partner agencies): /data/regions/:regionId/districts/:id goes to the region.
 * URL state: ?state=loading|low-data (development frames) · ?modal=region (the switcher menu) · ?modal=share | download | digest.
 * An unknown region id redirects to the 404 page.
 */

const PublicRegionsPage = () => {
  const { regionId, districtId } = useParams();
  const data = usePublicDataState();
  const navigate = useNavigate();
  const { update, modal, state } = data;

  const region = useAgencyResource(() => publicRegion(regionId), [regionId]);
  const regions = useAgencyResource(() => publicRegions(), []);
  const view = useMemo(
    () => (region.data ? buildPublicRegionView(region.data) : null),
    [region.data]
  );
  const missing = region.status === 404;

  useEffect(() => {
    log('state', { regionId, loading: region.loading, missing, failed: Boolean(region.error) });
  }, [regionId, region.loading, missing, region.error]);

  const open = modal === 'region';
  const onOpenChange = useCallback(
    (next) => update({ modal: next ? 'region' : null }, { replace: true }),
    [update]
  );

  if (districtId) return <Navigate to={`/data/regions/${regionId}`} replace />;
  if (missing) {
    log('not found → 404', { regionId });
    return <Navigate to="/data/page-not-found" replace />;
  }

  if (!view) {
    return (
      <PublicDataFrame data={data} title="Regions" active="regions">
        {region.error ? (
          <div className="p-[16px] md:p-[28px] xl:p-[40px]">
            <EmptyState
              title="We couldn’t load this region"
              message="Check your connection and try again."
              actionLabel="Try again"
              onAction={region.reload}
            />
          </div>
        ) : (
          <PageLoader look="focused" />
        )}
      </PublicDataFrame>
    );
  }

  const devState = import.meta.env.DEV ? state : null;
  const lowData = devState === 'low-data' || view.isLowCount;
  const pageState =
    devState === 'loading' || region.loading ? 'loading' : lowData ? 'low-data' : null;
  const list = regions.data || [];
  const switcher = {
    title: view.name,
    currentId: regionId,
    items: list.map((r) => ({ id: r.id, name: r.name, count: r.talents })),
    searchLabel: 'Jump to a region',
    caption: `All ${list.length || 16} regions · by talents`,
    listLabel: 'Regions',
    open,
    onOpenChange,
    onSelect: (id) => navigate(`/data/regions/${id}`),
  };

  return (
    <PublicDataFrame data={data} title={view.topTitle} active="regions">
      <RegionView
        view={view}
        regionId={view.id}
        allRows={[]}
        state={pageState}
        switcher={switcher}
        onCompare={() => navigate(`/data/compare?regions=${view.id}&modal=compare`)}
        onSubscribe={() => update({ modal: 'digest' })}
      />
      <MobileActionBar
        onShare={() => update({ modal: 'share' })}
        onDownload={() => update({ modal: 'download' })}
      />
      <PublicDataModals
        data={data}
        scope={{ title: view.name, reportKind: 'overview', sharePath: `regions/${view.id}` }}
      />
    </PublicDataFrame>
  );
};

export default PublicRegionsPage;
