import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../styles/talentA11y.css';
import { debug } from '../../../../utils/debug.js';
import { getProgramme } from '../../../../services/agency.api.js';
import DashboardShell from '../../dashboard/DashboardShell.jsx';
import AskBuddyFab from '../../talentHome/AskBuddyFab.jsx';
import { useTalentJobsState } from '../../talentJobs/talentJobsState.js';
import { publishProgramme } from './useProgrammesStore.js';
import ProgrammePreviewBody from './ProgrammePreviewBody.jsx';

const log = debug('ProgrammeTalentPreview');

/*
 * ProgrammeTalentPreview — Figma 11.5.2b (8597:394257): "Preview as a talent" drawn in the TALENT dashboard chrome, because the preview shows exactly what a
 * talent sees. The body is the saved programme (GET /agency/programmes/:id). "Publish programme" calls POST /agency/programmes/:id/publish (the server runs the
 * contact-details check and the 5+ audience rule; a refusal is shown above the preview) and opens the published confirmation
 * (/agency/programmes/<id>?state=published); "Back to editing" returns to the form.
 * Props: programmeId.
 */

const ProgrammeTalentPreview = ({ programmeId }) => {
  const jobs = useTalentJobsState();
  const navigate = useNavigate();
  const [programme, setProgramme] = useState(null);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  // same marker as /home so talentA11y.css (focus ring, reduced motion) covers the talent chrome
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', { programmeId });
    if (!programmeId) return undefined;
    let live = true;
    getProgramme(programmeId)
      .then((p) => live && setProgramme(p))
      .catch(
        (err) =>
          live &&
          setError(err?.response?.data?.message || err?.message || 'Could not load the programme.')
      );
    return () => {
      live = false;
    };
  }, [programmeId]);

  const onPublish = async () => {
    setPublishing(true);
    setError('');
    try {
      await publishProgramme(programmeId);
      navigate(`/agency/programmes/${programmeId}?state=published`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not publish the programme.');
      setPublishing(false);
    }
  };

  return (
    <DashboardShell
      role="talent"
      activeNav="jobs"
      talentHome={jobs}
      rail={jobs.rail}
      onToggleRail={() => jobs.update({ rail: jobs.rail === 'collapsed' ? null : 'collapsed' })}
      railActiveId="opportunities"
    >
      <div className="mx-auto flex w-full max-w-[1433px] flex-col px-[clamp(12px,3vw,52px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(24px,3vw,56px)]">
        <ProgrammePreviewBody
          programme={programme}
          publishing={publishing}
          error={error}
          backHref={`/agency/programmes/new?programme=${programmeId}`}
          onPublish={programme?.status === 'draft' ? onPublish : undefined}
        />
      </div>
      <AskBuddyFab home={jobs} />
    </DashboardShell>
  );
};

export default ProgrammeTalentPreview;
