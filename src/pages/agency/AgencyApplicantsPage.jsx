import { useState } from 'react';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import ApplicantsBoard from '../../components/sections/agency/programmes/ApplicantsBoard.jsx';

/*
 * AgencyApplicantsPage — /agency/applicants (rail item "Applicants"). Figma 11.5.2d (8597:395315) draws exactly this screen (title "Applicants", the Programme select,
 * the seven-column pipeline, "Applicants" highlighted in the rail); the same board is also reachable at /agency/programmes/<id>/applicants (the manifest URL of the frame).
 * Here the programme is chosen in the select (default YouthStart Digital Grant).
 */

const AgencyApplicantsPage = () => {
  const data = useAgencyState();
  const [programmeId, setProgrammeId] = useState('ysd-2026');
  return (
    <AgencyFrame data={data} title="Applicants" active="applicants">
      <ApplicantsBoard programmeId={programmeId} onProgramme={setProgrammeId} />
    </AgencyFrame>
  );
};

export default AgencyApplicantsPage;
