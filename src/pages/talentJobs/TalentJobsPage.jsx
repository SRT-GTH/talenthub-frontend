import { useEffect } from 'react';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import DashboardShell from '../../components/sections/dashboard/DashboardShell.jsx';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import AskBuddyFab from '../../components/sections/talentHome/AskBuddyFab.jsx';
import JobDetailScreen from '../../components/sections/talentJobs/JobDetailScreen.jsx';
import JobsDialogs from '../../components/sections/talentJobs/JobsDialogs.jsx';
import JobsScreen from '../../components/sections/talentJobs/JobsScreen.jsx';
import { useTalentJobsState } from '../../components/sections/talentJobs/talentJobsState.js';

const log = debug('TalentJobsPage');

/*
 * TalentJobsPage — `/job-postings`, Figma "Talent Job Postings" (J-01 … J-21; Playful 75xx:*, Focused 8110:*).
 * The sidebar opens expanded (Figma default) with a collapse toggle; `?rail=collapsed` shows the icon rail
 * ("c" frames). Every frame is a URL — see talentJobsState.js. Mock data only, shaped for an API swap.
 */
const TalentJobsPage = () => {
  const jobs = useTalentJobsState();

  useEffect(() => {
    ensurePlayfulFont();
  }, []);

  // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', { tab: jobs.tab, view: jobs.view, state: jobs.state, rail: jobs.rail });
  }, [jobs.tab, jobs.view, jobs.state, jobs.rail]);

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
      <UiStyleScope enabled />
      {jobs.job ? <JobDetailScreen jobs={jobs} /> : <JobsScreen jobs={jobs} />}
      <JobsDialogs jobs={jobs} />
      <AskBuddyFab home={jobs} />
    </DashboardShell>
  );
};

export default TalentJobsPage;
