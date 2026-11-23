import { HERO, PIPELINE } from './recruiterDashboardData.js';
import { jobBucket } from '../../../services/recruiterShell.api.js';

/*
 * liveDashboard - the recruiter home's widgets built from the signed-in recruiter's own data
 * (useRecruiterShell + GET /applications/received). Nothing here invents a number: a value the
 * backend doesn't give yet is a dash (profile views) and its note is left empty.
 */

const dash = (n) => (n === null || n === undefined ? '—' : String(n));
const DAY = 864e5;

const greeting = (now) => {
  const h = now.getHours();
  if (h < 12) return 'Good morning, ';
  if (h < 17) return 'Good afternoon, ';
  return 'Good evening, ';
};

export const liveHero = (shell, apps = [], now = new Date()) => {
  const byStage = shell.applicantsByStage || {};
  const awaiting = (byStage.submitted || 0) + (byStage.under_review || 0);
  const fresh = apps.filter((a) => now - new Date(a.appliedAt || a.createdAt) < DAY).length;
  const s = Object.fromEntries(HERO.stats.map((x) => [x.id, x]));
  return {
    ...HERO,
    date: now
      .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
      .toUpperCase(),
    greeting: greeting(now),
    name: shell.firstName || '',
    summary: shell.orgName
      ? `Here's what's happening at ${shell.orgName} today — ${fresh} new applicant${fresh === 1 ? '' : 's'} in the last 24 hours.`
      : HERO.noOrg,
    stats: [
      // Recruiters have no profile page of their own yet: the tile counts views of their postings (viewCount).
      (() => {
        const list = Array.isArray(shell.jobList) ? shell.jobList : [];
        const views = list.reduce((n, j) => n + (Number(j.viewCount) || 0), 0);
        return {
          ...s.views,
          label: 'Posting views',
          value: list.length ? String(views) : '—',
          note: list.length ? `Across ${list.length} posting${list.length === 1 ? '' : 's'}` : '',
        };
      })(),
      {
        ...s.applicants,
        value: dash(shell.applicants),
        note:
          shell.applicants === null || shell.applicants === undefined
            ? ''
            : `${awaiting} awaiting review`,
      },
      {
        ...s.messages,
        value: dash(shell.conversations),
        note: shell.unreadMessages ? `${shell.unreadMessages} unread` : 'All read',
      },
      {
        ...s.jobs,
        value: dash(shell.jobs?.active),
        note: shell.jobs ? `${shell.jobs.draft} draft${shell.jobs.draft === 1 ? '' : 's'}` : '',
      },
    ],
  };
};

const TYPE = {
  'full-time-job': 'Full-time',
  internship: 'Internship',
  'training-program': 'Training programme',
};
const IN_PIPELINE = new Set([
  'shortlisted',
  'interview_scheduled',
  'interviewed',
  'offer_extended',
]);

export const liveJobs = (jobList = [], apps = [], now = new Date()) => {
  const active = jobList.filter((j) => jobBucket(j) === 'active');
  const max = Math.max(
    1,
    ...active.map((j) => apps.filter((a) => String(a.resourceId) === String(j._id || j.id)).length)
  );
  return active.map((j) => {
    const id = String(j._id || j.id);
    const mine = apps.filter((a) => String(a.resourceId) === id && a.currentStage !== 'withdrawn');
    const fresh = mine.filter((a) => now - new Date(a.appliedAt || a.createdAt) < 7 * DAY).length;
    const inPipe = mine.filter((a) => IN_PIPELINE.has(a.currentStage)).length;
    const deadline = j.deadlineDate ? new Date(j.deadlineDate) : null;
    const daysLeft = deadline ? Math.ceil((deadline - now) / DAY) : null;
    return {
      id,
      title: j.title || 'Untitled',
      type: TYPE[j.type] || 'Job',
      place:
        j.location?.type === 'remote'
          ? 'Remote'
          : j.location?.city || j.location?.region || 'Ghana',
      ...(daysLeft !== null && daysLeft <= 7 && daysLeft >= 0
        ? {
            urgent:
              daysLeft === 0
                ? 'Closes today'
                : `Closes in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
          }
        : {}),
      posted: new Date(j.publishDate || j.createdAt).toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
      }),
      applicants: String(mine.length),
      fresh: fresh ? `+${fresh}` : '0',
      pipeline: String(inPipe),
      pipelineFill: Math.round((mine.length / max) * 40),
      status: 'Active',
      deadline: daysLeft,
    };
  });
};

/* Funnel: how many applications reached each stage (or went past it). Rejected / withdrawn are the outflow. */
const ORDER = [
  'submitted',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'interviewed',
  'offer_extended',
  'accepted',
];
const COLUMN_OF = { applied: 0, screening: 1, shortlisted: 2, interview: 3, offer: 5, accepted: 6 };

export const livePipeline = (byStage) => {
  if (!byStage) return null;
  const rank = (stage) => ORDER.indexOf(stage);
  const reached = (from) =>
    Object.entries(byStage).reduce((n, [stage, count]) => (rank(stage) >= from ? n + count : n), 0);
  const counts = PIPELINE.stages.map((s) => reached(COLUMN_OF[s.id] ?? 0));
  const top = Math.max(1, counts[0]);
  const stages = PIPELINE.stages.map((s, i) => {
    const prev = counts[i - 1];
    const drop = i > 0 && prev > 0 ? Math.round(((counts[i] - prev) / prev) * 100) : null;
    return {
      ...s,
      count: String(counts[i]),
      drop: drop === null || drop === 0 ? undefined : `−${Math.abs(drop)}%`,
      bar: Math.max(10, Math.round((counts[i] / top) * 140)),
    };
  });
  const total = counts[0] + (byStage.rejected || 0) + (byStage.withdrawn || 0);
  return {
    stages,
    subtitle: `${total} candidate${total === 1 ? '' : 's'} across all your opportunities`,
    rejected: `Rejected · ${byStage.rejected || 0}`,
    withdrawn: `Withdrawn · ${byStage.withdrawn || 0}`,
    insight: null,
    empty: total === 0,
  };
};
