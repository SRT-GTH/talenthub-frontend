import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import DistrictsView from '../../components/sections/agency/districts/DistrictsView.jsx';

/*
 * AgencyDistrictsPage — /agency/districts (Figma 11.4.2s "Agency · Districts · All (list)", 9394:19326; Focused only, no Playful twin, no sibling frames).
 * It used to redirect to the Accra Metro detail page (11.4.2b); that page stays at /agency/regions/:regionId/districts/:districtId and every row links to it.
 * URL: ?q= · ?region=<region id> · ?sort=growth|assessment|placements|name · ?page=<n> · ?view=map (the Table | Map toggle). Nothing here needs the old redirect.
 */

const AgencyDistrictsPage = () => {
  const data = useAgencyState();
  return (
    <AgencyFrame data={data} title="Districts" active="districts">
      <DistrictsView data={data} />
    </AgencyFrame>
  );
};

export default AgencyDistrictsPage;
