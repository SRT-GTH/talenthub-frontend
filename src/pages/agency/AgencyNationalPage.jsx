import { Navigate } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import AgencyNationalView from '../../components/sections/agency/national/AgencyNationalView.jsx';

/*
 * AgencyNationalPage — /agency/national (Figma 11.4.2a, d-j, 11.4.6a-g). Package B.
 * Own query keys: map=hover|pinned|keyboard + at=<region id> (map frames), breakdown=<view id>, by=daily|weekly|monthly; modal=filters|breakdown;
 * state=loading|error|zero|suppressed|too-few.
 */
const AgencyNationalPage = () => {
  const data = useAgencyState();
  // 11.4.2b: ?view=districts is the Accra Metro district page (manifest URL of the frame)
  if (data.view === 'districts') {
    return <Navigate to="/agency/regions/greater-accra/districts/accra-metro" replace />;
  }
  return (
    <AgencyFrame data={data} title="National data">
      <AgencyNationalView data={data} />
    </AgencyFrame>
  );
};

export default AgencyNationalPage;
