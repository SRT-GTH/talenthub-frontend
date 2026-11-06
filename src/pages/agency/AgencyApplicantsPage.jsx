import { useState } from 'react';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import ApplicantsBoard from '../../components/sections/agency/programmes/ApplicantsBoard.jsx';
import { useProgrammesStore } from '../../components/sections/agency/programmes/useProgrammesStore.js';

/*
 * AgencyApplicantsPage — /agency/applicants (rail item "Applicants"). Figma 11.5.2d (8597:395315); the same board is also reachable at
 * /agency/programmes/<id>/applicants. Here the programme is chosen in the select; it defaults to the agency's newest live programme
 * (else the newest closed one), from GET /agency/programmes.
 */

const AgencyApplicantsPage = () => {
  const data = useAgencyState();
  const { programmes } = useProgrammesStore();
  const [chosen, setChosen] = useState(null);
  const fallback =
    programmes.find((p) => p.status === 'live')?.id ??
    programmes.find((p) => p.status === 'closed')?.id ??
    null;
  return (
    <AgencyFrame data={data} title="Applicants" active="applicants">
      <ApplicantsBoard programmeId={chosen ?? fallback} onProgramme={setChosen} />
    </AgencyFrame>
  );
};

export default AgencyApplicantsPage;
