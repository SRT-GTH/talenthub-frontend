import { useCallback, useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { buildAgencyView } from '../../components/sections/agency/national/agencyRegionView.js';
import AgencyRegionView from '../../components/sections/agency/national/AgencyRegionView.jsx';
import { useAgencyResource } from '../../components/sections/agency/useAgencyResource.js';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { agencyDistrict, agencyRegion, agencyRegions } from '../../services/agency.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyRegionsPage');

/*
 * AgencyRegionsPage — /agency/regions/:regionId (Figma 11.4.2k, 2l switcher open, 2m low-data) and
 * /agency/regions/:regionId/districts/:districtId (11.4.2b). Live: GET /api/agency/regions/:id and .../districts/:id, the switcher
 * from GET /api/agency/regions. Regions / districts under 50 talents show the low-data panel (template rule); under 5 print "<5".
 * URL: ?state=loading|low-data (development frames) · ?modal=region (the switcher menu). An unknown id goes to the agency 404.
 */

const AgencyRegionsPage = () => {
  const { regionId, districtId } = useParams();
  const data = useAgencyState();
  const navigate = useNavigate();
  const { update, modal, state } = data;

  const region = useAgencyResource(() => agencyRegion(regionId), [regionId]);
  const district = useAgencyResource(
    () => (districtId ? agencyDistrict(regionId, districtId) : Promise.resolve(null)),
    [regionId, districtId]
  );
  const regions = useAgencyResource(() => agencyRegions(), []);

  const loading = region.loading || district.loading;
  const missing = region.status === 404 || (districtId && district.status === 404);
  const failed = !missing && (region.error || district.error);
  const view = useMemo(
    () =>
      region.data && (!districtId || district.data)
        ? buildAgencyView(region.data, district.data)
        : null,
    [region.data, district.data, districtId]
  );

  useEffect(() => {
    log('state', { regionId, districtId, loading, missing, failed: Boolean(failed) });
  }, [regionId, districtId, loading, missing, failed]);

  const open = modal === 'region';
  const onOpenChange = useCallback(
    (next) => update({ modal: next ? 'region' : null }, { replace: true }),
    [update]
  );

  if (missing) return <Navigate to="/agency/not-found" replace />;
  if (!view) {
    return (
      <AgencyFrame data={data} title="Regions" active="districts">
        {failed ? (
          <div className="flex flex-col items-start gap-[12px] rounded-[20px] bg-white p-[24px] font-sans">
            <p className="m-0 text-[16px] font-semibold text-[#1c2a21]">
              We couldn’t load this region.
            </p>
            <button
              type="button"
              onClick={() => {
                region.reload();
                district.reload();
              }}
              className="cursor-pointer rounded-[10px] border border-solid border-[#387440] bg-white px-[16px] py-[8px] font-semibold text-[#387440]"
            >
              Try again
            </button>
          </div>
        ) : (
          <PageLoader look="focused" />
        )}
      </AgencyFrame>
    );
  }

  const devState = import.meta.env.DEV ? state : null;
  const lowData = devState === 'low-data' || view.isLowCount;
  const pageState = devState === 'loading' || loading ? 'loading' : lowData ? 'low-data' : null;
  const list = regions.data || [];
  const parentRegionId = view.kind === 'district' ? view.regionId : view.id;
  const switcher = {
    title: view.name,
    currentId: regionId,
    items: list.map((r) => ({ id: r.id, name: r.name, count: r.talents })),
    searchLabel: 'Jump to a region',
    caption: `All ${list.length || 16} regions · by talents`,
    listLabel: 'Regions',
    open,
    onOpenChange,
    onSelect: (id) => navigate(`/agency/regions/${id}`),
  };

  return (
    <AgencyFrame data={data} title={view.topTitle} active="districts">
      <AgencyRegionView
        view={view}
        regionId={parentRegionId}
        state={pageState}
        switcher={switcher}
        onCompare={() => navigate(`/agency/compare?regions=${regionId}&modal=compare`)}
      />
    </AgencyFrame>
  );
};

export default AgencyRegionsPage;
