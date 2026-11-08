import { ago, fmtWhen, openInterview, snapshotOf } from './pipelineLive.js';

/*
 * livePipelineBoard - GET /applications/received items for one posting -> the NEW board's shape
 * (pipelineBoardData BASE_BOARD: { jobId, jobTitle, totalCandidates, qualifiedCount, stages[{ id, label, icon, count, cards }] }).
 * Card ids are application ids, so moves and actions map straight to the applications API.
 *
 *   Board stage      backend stage(s)
 *   applied          submitted
 *   screening        under_review
 *   shortlisted      shortlisted
 *   interview        interview_scheduled, interviewed          (meeting cards, from the open interview)
 *   offer-extended   offer_pending, offer_extended
 *   hired            accepted
 *   not-progressed   rejected, withdrawn
 *
 * Meeting-card actions are the board's own labels (MEETING_LABELS falls back to the text):
 * 'Mark as Completed' | 'Reschedule' | 'Schedule interview' | 'Cancel interview'.
 */

export const BOARD_STAGE = {
  submitted: 'applied',
  under_review: 'screening',
  shortlisted: 'shortlisted',
  interview_scheduled: 'interview',
  interviewed: 'interview',
  offer_pending: 'offer-extended',
  offer_extended: 'offer-extended',
  accepted: 'hired',
  rejected: 'not-progressed',
  withdrawn: 'not-progressed',
};

/* Where a drag / "Move to" lands in the backend. Interview, offer and hired go through their own flows. */
export const MOVE_STAGE = {
  applied: 'submitted',
  screening: 'under_review',
  shortlisted: 'shortlisted',
  'not-progressed': 'rejected',
};

const TEMPLATE = [
  { id: 'applied', label: 'Applied', icon: 'inbox' },
  { id: 'screening', label: 'Screening', icon: 'pipeline' },
  { id: 'shortlisted', label: 'Shortlisted', icon: 'check' },
  { id: 'interview', label: 'Interview', icon: 'calendar' },
  { id: 'offer-extended', label: 'Offer extended', icon: 'offer' },
  { id: 'hired', label: 'Hired', icon: 'hired' },
  { id: 'not-progressed', label: 'Not progressed', icon: 'not-progressed' },
];

const EMPTY = {
  applied: { title: 'No applicants yet', text: 'New applications for this posting land here.' },
  hired: { title: 'No hires yet', text: 'Accepted offers land here.' },
};

const initialsOf = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?';

const nameOf = (app) => {
  const s = snapshotOf(app);
  return (
    [s.firstName, s.lastName].filter(Boolean).join(' ').trim() ||
    s.displayName ||
    s.name ||
    'Candidate'
  );
};

const skillsOf = (app) => {
  const s = snapshotOf(app);
  return [...(s.technicalSkills || []), ...(s.skills || [])]
    .map((x) => (typeof x === 'string' ? x : x?.name))
    .filter(Boolean)
    .slice(0, 2);
};

const TONES = ['green', 'violet', 'taupe', 'blue'];
const toneFor = (id) =>
  TONES[[...String(id)].reduce((n, c) => n + c.charCodeAt(0), 0) % TONES.length];

const day = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        timeZone: 'Africa/Accra',
        day: 'numeric',
        month: 'short',
      })
    : '';

const candidateCard = (app, stage, now) => {
  const id = String(app._id);
  const s = snapshotOf(app);
  const name = nameOf(app);
  const match = app?.metadata?.matchScore;
  const lastMove = app.lastUpdatedAt || app.appliedAt || app.createdAt;
  const footer =
    stage === 'applied'
      ? `Applied ${ago(app.appliedAt || app.createdAt, now)}`
      : stage === 'not-progressed'
        ? app.currentStage === 'withdrawn'
          ? `Withdrew ${day(lastMove)}`
          : `Not progressed ${day(lastMove)}`
        : stage === 'hired'
          ? `Accepted ${day(lastMove)}`
          : `${ago(lastMove, now).replace(' ago', '')} in stage`;
  const badges = [];
  if (app.currentStage === 'withdrawn')
    badges.push({ id: 'withdrawn', label: 'Withdrawn', tone: 'neutral', icon: 'undo' });
  if (stage === 'offer-extended')
    badges.push({ id: 'awaiting', label: 'Awaiting response', tone: 'amber', icon: 'clock' });
  return {
    id,
    applicationId: id,
    kind: 'candidate',
    name,
    initials: initialsOf(name),
    avatar: null,
    avatarTone: toneFor(id),
    role:
      s.headline || s.currentRole || s.educationLevel || s.highestQualification || 'GTH profile',
    years: typeof s.yearsOfExperience === 'number' ? s.yearsOfExperience : null,
    matchPercent: typeof match === 'number' ? Math.round(match) : null,
    tags: ['applied', 'screening', 'shortlisted'].includes(stage) ? skillsOf(app) : [],
    criteria: null,
    badges,
    primaryAction: stage === 'shortlisted' ? 'schedule-interview' : null,
    qualified: true,
    footer,
  };
};

const PLATFORM = {
  video: 'Video call',
  phone: 'Phone call',
  'in-person': 'In person',
  assessment: 'Assessment',
};

const meetingCard = (app, now) => {
  const id = String(app._id);
  const iv = openInterview(app);
  const base = { id, applicationId: id, kind: 'meeting', qualified: true, name: nameOf(app) };
  const platform = (x) => PLATFORM[x?.interviewType] || 'Interview';
  if (app.currentStage === 'interviewed') {
    const last = [...(app.interviews || [])].reverse().find((i) => i?.scheduledAt) || null;
    return {
      ...base,
      tone: 'completed',
      badge: 'check',
      meta: last ? fmtWhen(last.scheduledAt) : 'Interview done',
      statusLabel: 'Interview Completed',
      platform: last ? platform(last) : '—',
    };
  }
  if (!iv) {
    return {
      ...base,
      tone: 'past',
      badge: 'alert',
      meta: 'No interview booked',
      statusLabel: 'No interview booked',
      platform: '—',
      primaryAction: 'Schedule interview',
    };
  }
  if (iv.status === 'awaiting_pick') {
    return {
      ...base,
      tone: 'upcoming',
      badge: 'hourglass',
      meta: `${(iv.offeredSlots || []).length} times offered`,
      statusLabel: 'Waiting for the candidate to pick',
      platform: platform(iv),
      secondaryAction: 'Cancel interview',
    };
  }
  if (iv.status === 'change_requested') {
    return {
      ...base,
      tone: 'past',
      badge: 'alert',
      meta: fmtWhen(iv.scheduledAt),
      statusLabel: 'Candidate asked for another time',
      platform: platform(iv),
      primaryAction: 'Reschedule',
      secondaryAction: 'Cancel interview',
    };
  }
  const past = new Date(iv.scheduledAt).getTime() + (iv.duration || 60) * 60000 < now;
  return past
    ? {
        ...base,
        tone: 'past',
        badge: 'alert',
        wide: true,
        meta: fmtWhen(iv.scheduledAt),
        statusLabel: 'Past Meeting',
        platform: platform(iv),
        primaryAction: 'Mark as Completed',
        secondaryAction: 'Reschedule',
      }
    : {
        ...base,
        tone: 'upcoming',
        badge: 'hourglass',
        meta: fmtWhen(iv.scheduledAt),
        statusLabel:
          iv.status === 'proposed' ? 'Waiting for the candidate to accept' : 'Upcoming Meeting',
        platform: platform(iv),
        secondaryAction: 'Reschedule',
      };
};

export const liveBoard = (applications, job, now = Date.now()) => {
  const jobId = job ? String(job._id || job.id) : null;
  const mine = (applications || []).filter((a) => jobId && String(a.resourceId) === jobId);
  const stages = TEMPLATE.map((t) => {
    const cards = mine
      .filter((a) => BOARD_STAGE[a.currentStage] === t.id)
      .sort(
        (a, b) =>
          new Date(b.lastUpdatedAt || b.appliedAt || 0) -
          new Date(a.lastUpdatedAt || a.appliedAt || 0)
      )
      .map((a) => (t.id === 'interview' ? meetingCard(a, now) : candidateCard(a, t.id, now)));
    return {
      ...t,
      count: cards.length,
      cards,
      ...(cards.length ? {} : EMPTY[t.id] ? { empty: EMPTY[t.id] } : {}),
    };
  });
  const active = mine.filter((a) => !['rejected', 'withdrawn'].includes(a.currentStage)).length;
  return {
    jobId,
    jobTitle: job?.title || '',
    totalCandidates: mine.length,
    qualifiedCount: active,
    stages,
  };
};
