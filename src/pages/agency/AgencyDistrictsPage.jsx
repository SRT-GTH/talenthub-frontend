import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyStub from '../../components/sections/agency/AgencyStub.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';

/* AgencyDistrictsPage — STUB, owned by package C. Replace the body; keep AgencyFrame + useAgencyState. */
const AgencyDistrictsPage = () => {
  const data = useAgencyState();
  return (
    <AgencyFrame data={data} title="Districts">
      <AgencyStub
        name="Districts"
        owner="C"
        frames="Districts (nav item; not drawn as its own frame)"
      />
    </AgencyFrame>
  );
};

export default AgencyDistrictsPage;
