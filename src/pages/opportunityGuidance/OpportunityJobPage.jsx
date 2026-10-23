import { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import DashboardShell from '../../components/sections/dashboard/DashboardShell.jsx';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import AskBuddyFab from '../../components/sections/talentHome/AskBuddyFab.jsx';
import JobDetailScreen from '../../components/sections/talentJobs/JobDetailScreen.jsx';
import JobsDialogs from '../../components/sections/talentJobs/JobsDialogs.jsx';
import { useTalentJobsState } from '../../components/sections/talentJobs/talentJobsState.js';
import {
  JOB_DETAILS,
  JOB_INDEX,
  JOB_LIST,
  applyJobsData,
} from '../../components/sections/talentJobs/talentJobsData.js';
import {
  IPMC_JOB,
  IPMC_JOB_DETAIL,
} from '../../components/sections/profileFilling/opportunityGuidance/opportunityGuidanceData.js';

const log = debug('OpportunityJobPage');

/*
 * OpportunityJobPage - `/opportunity-guidance/job?job=ipmc-junior-python-instructor`.
 * Figma 9222:120257 "J-02 . Focused . Posting detail . Accra Tech (public)" - the finished Talent Jobs J-02 detail screen
 * (components/sections/talentJobs) drawn for the IPMC Ghana "Junior Python Instructor" role that Career Buddy's third match
 * card opens. The layout is the existing JobDetailScreen; only the data differs, so this page registers the IPMC role in the
 * Talent Jobs demo bindings while it is mounted (and removes it on unmount) instead of editing the finished Jobs files.
 * Same URL params as /job-postings (`apply=preview`, `state=applied` ...), `rail=collapsed` for the icon rail.
 * Any other job id (or none) goes back to /job-postings.
 *
 * ⚠️ ASSUMPTION: the breadcrumb reads "Opportunities / Junior Python Instructor" (Figma's frame still says "Data Analyst",
 * a leftover from the Accra Tech original); the frame is named "Accra Tech (public)" but draws IPMC Ghana data.
 */
const registerIpmcJob = () => {
  applyJobsData(null); // the demo bindings (this page never shows the live feed)
  if (!JOB_LIST.some((j) => j.id === IPMC_JOB.id)) JOB_LIST.push(IPMC_JOB);
  if (JOB_INDEX !== JOB_LIST && !JOB_INDEX.some((j) => j.id === IPMC_JOB.id))
    JOB_INDEX.push(IPMC_JOB);
  JOB_DETAILS[IPMC_JOB.id] = IPMC_JOB_DETAIL;
};

const unregisterIpmcJob = () => {
  for (const list of [JOB_LIST, JOB_INDEX]) {
    const at = list.findIndex((j) => j.id === IPMC_JOB.id);
    if (at >= 0) list.splice(at, 1);
  }
  delete JOB_DETAILS[IPMC_JOB.id];
};

const OpportunityJobPage = () => {
  const urlState = useTalentJobsState();
  // Registered during render so the first paint already has the role; removed again when the page unmounts.
  useMemo(registerIpmcJob, []);
  const jobs = useMemo(() => ({ ...urlState, data: { status: 'demo', version: 0 } }), [urlState]);
  const known = urlState.job === IPMC_JOB.id;

  useEffect(() => {
    ensurePlayfulFont();
    registerIpmcJob();
    return unregisterIpmcJob;
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', { job: urlState.job, apply: urlState.apply, rail: urlState.rail });
  }, [urlState.job, urlState.apply, urlState.rail]);

  if (!known) {
    log('branch', { unknownJob: urlState.job });
    return <Navigate to="/job-postings" replace />;
  }

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
      <JobDetailScreen jobs={jobs} />
      <JobsDialogs jobs={jobs} />
      <AskBuddyFab home={jobs} />
    </DashboardShell>
  );
};

export default OpportunityJobPage;
