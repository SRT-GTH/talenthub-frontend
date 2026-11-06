import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { getProgramme } from '../../../../services/agency.api.js';
import ProgrammePreviewBody from './ProgrammePreviewBody.jsx';
import ProgrammePublishedDialog from './ProgrammePublishedDialog.jsx';

const log = debug('ProgrammePublishedView');

/*
 * ProgrammePublishedView — Figma 11.5.2c (8597:394759): the preview under the "Programme published!" dialog, in the AGENCY chrome.
 * URL /agency/programmes/<id>?state=published. The programme and the matched-talents count (the audience saved at publish) come from
 * GET /agency/programmes/:id. "Back to programmes" (and Esc) → /agency/programmes, "View applicants" → /agency/programmes/<id>/applicants.
 * Props: programmeId.
 */

const ProgrammePublishedView = ({ programmeId }) => {
  const navigate = useNavigate();
  const [programme, setProgramme] = useState(null);

  useEffect(() => {
    log('mount', { programmeId });
    let live = true;
    getProgramme(programmeId)
      .then((p) => live && setProgramme(p))
      .catch((err) => log('load failed', err?.message));
    return () => {
      live = false;
    };
  }, [programmeId]);

  return (
    <ProgrammePreviewBody
      published
      programme={programme}
      backHref={`/agency/programmes/new?programme=${programmeId}`}
    >
      {programme ? (
        <ProgrammePublishedDialog
          count={programme.audienceAtPublish ?? 0}
          title={programme.title}
          onBack={() => navigate('/agency/programmes')}
          onView={() => navigate(`/agency/programmes/${programmeId}/applicants`)}
        />
      ) : null}
    </ProgrammePreviewBody>
  );
};

export default ProgrammePublishedView;
