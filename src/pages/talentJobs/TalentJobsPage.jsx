import { useEffect, useMemo } from 'react';
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
import { useLiveJobs } from '../../components/sections/talentJobs/useLiveJobs.js';
import { JOB_LIST } from '../../components/sections/talentJobs/talentJobsData.js';

const log = debug('TalentJobsPage');

/*
 * TalentJobsPage — `/job-postings`, Figma "Talent Job Postings" (J-01 … J-21; Playful 75xx:*, Focused 8110:*).
 * The sidebar opens expanded (Figma default) with a collapse toggle; `?rail=collapsed` shows the icon rail
 * ("c" frames). Every frame is a URL — see talentJobsState.js.
 *
 * Live data (2026-10-18): a logged-in talent sees their real feed (useLiveJobs + talentJobsLive.js map
 * GET /guidance/jobs onto the Figma shapes); `?demo=1` or a logged-out visit keeps the demo data. While
 * the feed loads the page shows the J-13 loading frame, and no matches shows J-07 empty matches.
 */
const TalentJobsPage = () => {
  const urlState = useTalentJobsState();
  const data = useLiveJobs();
  // The URL `state` (empty|loading|offline) still forces a frame; otherwise live status decides.
  const jobs = useMemo(() => {
    let state = urlState.state;
    if (!state && data.status === 'loading') state = 'loading';
    if (!state && data.status === 'live' && JOB_LIST.length === 0) state = 'empty';
    return { ...urlState, state, data };
    // data.version: the data bindings were swapped
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState, data, data.version]);
  const newMatches = data.status === 'live' ? JOB_LIST.filter((j) => j.isNew).length : 2;

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
      railBadges={newMatches ? { opportunities: String(newMatches) } : {}}
    >
      <UiStyleScope enabled />
      {data.status === 'error' ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-[12px] px-[16px] py-[64px] text-center"
        >
          <p className="m-0 font-sans text-[15px] text-[#1c2a21]">We couldn’t load job postings.</p>
          <button
            type="button"
            onClick={data.retry}
            className="cursor-pointer rounded-full border border-solid border-[#1c2a21] bg-white px-[16px] py-[8px] font-sans text-[14px] font-semibold"
          >
            Try again
          </button>
        </div>
      ) : jobs.job && data.status === 'loading' ? (
        <p
          role="status"
          className="m-0 px-[16px] py-[64px] text-center font-sans text-[15px] text-[#737373]"
        >
          Loading this role…
        </p>
      ) : jobs.job ? (
        <JobDetailScreen key={`d-${data.version}`} jobs={jobs} />
      ) : (
        <JobsScreen key={`l-${data.version}`} jobs={jobs} />
      )}
      <JobsDialogs jobs={jobs} />
      <AskBuddyFab home={jobs} />
    </DashboardShell>
  );
};

export default TalentJobsPage;
