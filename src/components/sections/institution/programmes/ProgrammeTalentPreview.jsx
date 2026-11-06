import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../styles/talentA11y.css';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  getProgramme,
  publishProgramme,
} from '../../../../services/institutionPortal.api.js';
import DashboardShell from '../../dashboard/DashboardShell.jsx';
import AskBuddyFab from '../../talentHome/AskBuddyFab.jsx';
import { useTalentJobsState } from '../../talentJobs/talentJobsState.js';
import { upsertProgramme } from './useProgrammesStore.js';
import ProgrammePreviewBody from './ProgrammePreviewBody.jsx';

const log = debug('ProgrammeTalentPreview');

/*
 * ProgrammeTalentPreview — Figma 11.5.2b (8597:394257): "Preview as a student" drawn in the TALENT dashboard chrome, because the preview shows exactly
 * what a student sees. The body is ProgrammePreviewBody filled from GET /api/institution/programmes/:id (preview). "Publish programme" publishes
 * (POST .../publish: the contact-details check and the 5-student minimum run on the server; a refusal is shown here) and opens the published
 * confirmation (/institution/programmes/<id>?state=published); "Back to editing" returns to the form.
 * Props: programmeId.
 */

const ProgrammeTalentPreview = ({ programmeId }) => {
  const jobs = useTalentJobsState();
  const navigate = useNavigate();
  const [programme, setProgramme] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // same marker as /home so talentA11y.css (focus ring, reduced motion) covers the talent chrome
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    let alive = true;
    log('mount', { programmeId });
    if (!programmeId) {
      setError('Pick a programme to preview.');
      return undefined;
    }
    getProgramme(programmeId)
      .then((p) => alive && setProgramme(p))
      .catch((err) => alive && setError(apiMessage(err)));
    return () => {
      alive = false;
    };
  }, [programmeId]);

  const publish = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const card = await publishProgramme(programmeId);
      upsertProgramme(card);
      navigate(`/institution/programmes/${programmeId}?state=published`);
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setBusy(false);
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
      <div className="mx-auto flex w-full max-w-[1433px] flex-col gap-[16px] px-[clamp(12px,3vw,52px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(24px,3vw,56px)]">
        {error ? (
          <p
            role="alert"
            className="m-0 rounded-[12px] border border-solid border-[#f6e1df] bg-[#f9ebea] px-[16px] py-[12px] font-sans text-[14px] leading-[20px] text-[#902b20]"
          >
            {error}
          </p>
        ) : null}
        {programme ? (
          <ProgrammePreviewBody
            preview={programme.preview}
            published={programme.status === 'live'}
            publishing={busy}
            backHref={`/institution/programmes/new?programme=${programmeId}`}
            onPublish={programme.status === 'draft' ? publish : undefined}
          />
        ) : !error ? (
          <p className="m-0 font-sans text-[14px] leading-[20px] text-[#737373]">
            Loading the preview…
          </p>
        ) : null}
      </div>
      <AskBuddyFab home={jobs} />
    </DashboardShell>
  );
};

export default ProgrammeTalentPreview;
