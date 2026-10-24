import { useCallback, useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import {
  getDistrict,
  getRegion,
  listRegions,
} from '../../components/sections/publicData/regions/data/regionsData.js';
import RegionView from '../../components/sections/publicData/regions/RegionView.jsx';
import {
  buildDistrictView,
  buildRegionView,
} from '../../components/sections/publicData/regions/regionsView.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicRegionsPage');

/*
 * PublicRegionsPage — /data/regions/:regionId (Figma 8.3.1a-d, tablet 8.9.1, phone 8.3.1a-m) and
 * /data/regions/:regionId/districts/:districtId (8.3.2a-c, phone 8.9.2). Mock-backed: getRegion / getDistrict return the shapes of
 * GET /public/regions/:id and GET /public/regions/:id/districts/:districtId (data/regionsData.js).
 * URL state: ?state=loading (skeleton) · ?state=low-data (early rollout; a region or district under 50 talents shows it by itself) ·
 * ?modal=region | district (the switcher menu) · ?modal=share | download | digest (PublicDataModals).
 * ⚠️ ASSUMPTION: an unknown region or district id redirects to the 404 page (Figma draws no per-page not-found state).
 */

const PublicRegionsPage = () => {
  const { regionId, districtId } = useParams();
  const data = usePublicDataState();
  const navigate = useNavigate();
  const { update, modal, state } = data;

  const region = useMemo(() => getRegion(regionId), [regionId]);
  const district = useMemo(
    () => (districtId ? getDistrict(regionId, districtId) : null),
    [regionId, districtId]
  );
  const missing = !region || (districtId && !district);

  const view = useMemo(() => {
    if (missing) return null;
    return district ? buildDistrictView(district) : buildRegionView(region);
  }, [missing, district, region]);

  useEffect(() => {
    log('mount', { regionId, districtId, state, found: !missing });
  }, [regionId, districtId, state, missing]);

  const menuName = district ? 'district' : 'region';
  const open = modal === menuName;
  const onOpenChange = useCallback(
    (next) => update({ modal: next ? menuName : null }, { replace: true }),
    [update, menuName]
  );

  if (missing) {
    log('not found → 404', { regionId, districtId });
    return <Navigate to="/data/page-not-found" replace />;
  }

  const lowData = state === 'low-data' || view.isLowCount;
  const pageState = state === 'loading' ? 'loading' : lowData ? 'low-data' : null;

  const regions = listRegions();
  const switcher = district
    ? {
        currentId: district.id,
        items: district.districts.map((d) => ({ id: d.id, name: d.name, count: d.talents })),
        searchLabel: 'Jump to a district',
        caption: `All ${district.districts.length} districts · by talents`,
        listLabel: 'Districts',
        onSelect: (id) => navigate(`/data/regions/${district.regionId}/districts/${id}`),
      }
    : {
        currentId: region.id,
        items: regions.map((r) => ({ id: r.id, name: r.name, count: r.talents })),
        searchLabel: 'Jump to a region',
        caption: `All ${regions.length} regions · by talents`,
        listLabel: 'Regions',
        onSelect: (id) => navigate(`/data/regions/${id}`),
      };

  const allRows = district
    ? district.areas.map((a) => ({ label: a.name, count: a.talents }))
    : region.districts.map((d) => ({ label: d.name, count: d.talents }));

  const compareRegion = district ? district.regionId : region.id;
  const parentRegionId = view.kind === 'district' ? view.regionId : view.id;

  return (
    <PublicDataFrame data={data} title={view.topTitle} active="regions">
      <RegionView
        view={view}
        regionId={parentRegionId}
        allRows={allRows}
        state={pageState}
        switcher={{ ...switcher, title: view.name, open, onOpenChange }}
        onCompare={() => navigate(`/data/compare?regions=${compareRegion}&modal=compare`)}
        onSubscribe={() => update({ modal: 'digest' })}
      />
      <MobileActionBar
        onShare={() => update({ modal: 'share' })}
        onDownload={() => update({ modal: 'download' })}
      />
      <PublicDataModals
        data={data}
        scope={{
          title: view.name,
          reportKind: 'overview',
          sharePath: district
            ? `regions/${district.regionId}/districts/${district.id}`
            : `regions/${region.id}`,
        }}
      />
    </PublicDataFrame>
  );
};

export default PublicRegionsPage;
