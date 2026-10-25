import { useCallback, useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { buildAgencyView } from '../../components/sections/agency/national/agencyRegionView.js';
import AgencyRegionView from '../../components/sections/agency/national/AgencyRegionView.jsx';
import {
  getDistrict,
  getRegion,
  listRegions,
} from '../../components/sections/publicData/regions/data/regionsData.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyRegionsPage');

/*
 * AgencyRegionsPage — /agency/regions/:regionId (Figma 11.4.2k, 2l switcher open, 2m low-data) and
 * /agency/regions/:regionId/districts/:districtId (11.4.2b). Theme 8 mock data (getRegion / getDistrict) inside the agency chrome.
 * URL: ?state=loading|low-data · ?modal=region (the switcher menu). ⚠️ ASSUMPTION: an unknown id redirects to the agency 404 (Figma draws none).
 */

const AgencyRegionsPage = () => {
  const { regionId, districtId } = useParams();
  const data = useAgencyState();
  const navigate = useNavigate();
  const { update, modal, state } = data;

  const region = useMemo(() => getRegion(regionId), [regionId]);
  const district = useMemo(
    () => (districtId ? getDistrict(regionId, districtId) : null),
    [regionId, districtId]
  );
  const missing = !region || (districtId && !district);
  const view = useMemo(
    () => (missing ? null : buildAgencyView(region, district)),
    [missing, region, district]
  );

  useEffect(() => {
    log('mount', { regionId, districtId, state, found: !missing });
  }, [regionId, districtId, state, missing]);

  const open = modal === 'region';
  const onOpenChange = useCallback(
    (next) => update({ modal: next ? 'region' : null }, { replace: true }),
    [update]
  );

  if (missing) return <Navigate to="/agency/not-found" replace />;

  const lowData = state === 'low-data' || view.isLowCount;
  const pageState = state === 'loading' ? 'loading' : lowData ? 'low-data' : null;
  const regions = listRegions();
  const parentRegionId = view.kind === 'district' ? view.regionId : view.id;
  const switcher = {
    title: view.name,
    currentId: region.id,
    items: regions.map((r) => ({ id: r.id, name: r.name, count: r.talents })),
    searchLabel: 'Jump to a region',
    caption: `All ${regions.length} regions · by talents`,
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
        onCompare={() => navigate(`/agency/compare?regions=${region.id}&modal=compare`)}
      />
    </AgencyFrame>
  );
};

export default AgencyRegionsPage;
