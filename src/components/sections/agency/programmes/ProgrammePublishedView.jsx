import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { DEFAULT_RULES, computeAudience } from '../data/programmesData.js';
import ProgrammePreviewBody from './ProgrammePreviewBody.jsx';
import ProgrammePublishedDialog from './ProgrammePublishedDialog.jsx';

const log = debug('ProgrammePublishedView');

/*
 * ProgrammePublishedView — Figma 11.5.2c (8597:394759): the preview under the "Programme published!" dialog, in the AGENCY chrome (the page is mounted inside
 * AgencyFrame by the route; Figma draws the talent preview body there, the primary button reads "Published"). URL /agency/programmes/<id>?state=published.
 * "Back to programmes" (and Esc) → /agency/programmes, "View applicants" → /agency/programmes/<id>/applicants. The matching-talents count is the audience of the
 * default rules (9,870), through formatCount().
 * Props: programmeId.
 */

const ProgrammePublishedView = ({ programmeId }) => {
  const navigate = useNavigate();
  const audience = computeAudience(DEFAULT_RULES);

  useEffect(() => {
    log('mount', { programmeId });
  }, [programmeId]);

  return (
    <ProgrammePreviewBody published backHref={`/agency/programmes/new?programme=${programmeId}`}>
      <ProgrammePublishedDialog
        count={audience.match}
        onBack={() => navigate('/agency/programmes')}
        onView={() => navigate(`/agency/programmes/${programmeId}/applicants`)}
      />
    </ProgrammePreviewBody>
  );
};

export default ProgrammePublishedView;
