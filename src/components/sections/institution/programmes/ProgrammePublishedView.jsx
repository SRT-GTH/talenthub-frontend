import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { apiMessage, getProgramme } from '../../../../services/institutionPortal.api.js';
import ProgrammePreviewBody from './ProgrammePreviewBody.jsx';
import ProgrammePublishedDialog from './ProgrammePublishedDialog.jsx';

const log = debug('ProgrammePublishedView');

/*
 * ProgrammePublishedView — Figma 11.5.2c (8597:394759): the programme's student page under the "Programme published!" dialog, inside the school's
 * chrome. URL /institution/programmes/<id>?state=published (the dialog shows while state=published; without it the page is the programme as students
 * see it). Live: GET /api/institution/programmes/:id; the dialog's count is the number of matching students when it was published.
 * "Back to programmes" (and Esc) → /institution/programmes, "View applicants" → /institution/programmes/<id>/applicants.
 * Props: programmeId, dialog (show the published dialog).
 */

const ProgrammePublishedView = ({ programmeId, dialog = true }) => {
  const navigate = useNavigate();
  const [programme, setProgramme] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    log('mount', { programmeId });
    getProgramme(programmeId)
      .then((p) => alive && setProgramme(p))
      .catch((err) => alive && setError(apiMessage(err)));
    return () => {
      alive = false;
    };
  }, [programmeId]);

  if (error) {
    return (
      <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-[#902b20]">
        {error}
      </p>
    );
  }
  if (!programme) {
    return <p className="m-0 font-sans text-[14px] leading-[20px] text-[#737373]">Loading…</p>;
  }

  return (
    <ProgrammePreviewBody
      preview={programme.preview}
      published={programme.status === 'live'}
      backHref={`/institution/programmes/new?programme=${programmeId}`}
    >
      {dialog && programme.status === 'live' ? (
        <ProgrammePublishedDialog
          count={programme.audienceAtPublish ?? 0}
          visible={programme.audienceVisible ?? 0}
          title={programme.title}
          onBack={() => navigate('/institution/programmes')}
          onView={() => navigate(`/institution/programmes/${programmeId}/applicants`)}
        />
      ) : null}
    </ProgrammePreviewBody>
  );
};

export default ProgrammePublishedView;
