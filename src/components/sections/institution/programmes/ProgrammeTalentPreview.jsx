import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../styles/talentA11y.css';
import { debug } from '../../../../utils/debug.js';
import DashboardShell from '../../dashboard/DashboardShell.jsx';
import AskBuddyFab from '../../talentHome/AskBuddyFab.jsx';
import { useTalentJobsState } from '../../talentJobs/talentJobsState.js';
import { publishProgramme } from './useProgrammesStore.js';
import ProgrammePreviewBody from './ProgrammePreviewBody.jsx';

const log = debug('ProgrammeTalentPreview');

/*
 * ProgrammeTalentPreview — Figma 11.5.2b (8597:394257): "Preview as a talent" drawn in the TALENT dashboard chrome (Kofi Agyekum's rail and top bar), because the
 * preview shows exactly what a talent sees. The shell is the same DashboardShell the Talent Jobs / Opportunity Guidance pages mount (role "talent", Opportunities
 * highlighted); the body is ProgrammePreviewBody. The rail collapse toggle uses the shared ?rail=collapsed key. "Publish programme" publishes (mock) and opens the
 * published confirmation (/institution/programmes/<id>?state=published); "Back to editing" returns to the form.
 * Props: programmeId.
 */

const ProgrammeTalentPreview = ({ programmeId }) => {
  const jobs = useTalentJobsState();
  const navigate = useNavigate();

  // same marker as /home so talentA11y.css (focus ring, reduced motion) covers the talent chrome
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', { programmeId });
  }, [programmeId]);

  return (
    <DashboardShell
      role="talent"
      activeNav="jobs"
      talentHome={jobs}
      rail={jobs.rail}
      onToggleRail={() => jobs.update({ rail: jobs.rail === 'collapsed' ? null : 'collapsed' })}
      railActiveId="opportunities"
      railBadges={{ opportunities: '2' }}
    >
      <div className="mx-auto flex w-full max-w-[1433px] flex-col px-[clamp(12px,3vw,52px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(24px,3vw,56px)]">
        <ProgrammePreviewBody
          backHref={`/institution/programmes/new?programme=${programmeId}`}
          onPublish={() => {
            publishProgramme(programmeId);
            navigate(`/institution/programmes/${programmeId}?state=published`);
          }}
        />
      </div>
      <AskBuddyFab home={jobs} />
    </DashboardShell>
  );
};

export default ProgrammeTalentPreview;
