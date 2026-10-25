/*
 * pipelineLive.js — backend applications → the board's COLUMNS shape (applicationPipelineData.js).
 * Pure, so the mapping is testable and the section stays a renderer.
 *
 * Column ↔ backend stage (Recruiter Buddy design, Iteration 4 §0):
 *   Applied        submitted
 *   Screening      under_review
 *   Shortlisted    shortlisted
 *   Interview      interview_scheduled + interviewed
 *   Offer Extended offer_pending + offer_extended
 *   Accepted       accepted
 *   Rejected       rejected
 * Withdrawn applications are left off the board.
 *
 * Card actions are ids, not labels, so the section can map them to API calls:
 *   screen · shortlist · schedule · reschedule · complete · cancel-interview · reject
 */

const TZ = 'Africa/Accra';

export const STAGE_COLUMN = {
  submitted: 'applied',
  under_review: 'screening',
  shortlisted: 'shortlisted',
  interview_scheduled: 'interview',
  interviewed: 'interview',
  offer_pending: 'offer-extended',
  offer_extended: 'offer-extended',
  accepted: 'accepted',
  rejected: 'rejected',
};

// The stage an action moves an application to.
export const ACTION_STAGE = {
  screen: 'under_review',
  shortlist: 'shortlisted',
  complete: 'interviewed',
  reject: 'rejected',
};

export const ACTION_LABELS = {
  screen: 'Start screening',
  shortlist: 'Shortlist',
  schedule: 'Schedule Interview',
  reschedule: 'Reschedule',
  complete: 'Mark as Completed',
  'cancel-interview': 'Cancel interview',
  reject: 'Reject',
};

const OPEN = ['awaiting_pick', 'proposed', 'confirmed', 'change_requested', 'scheduled'];

export const openInterview = (app) => {
  const list = app?.interviews || [];
  for (let i = list.length - 1; i >= 0; i--) if (OPEN.includes(list[i]?.status)) return list[i];
  return null;
};

const pad2 = (n) => String(n).padStart(2, '0');

export const fmtWhen = (d) => {
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return '';
  const day = x.toLocaleDateString('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const time = x.toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
  return `${day} · ${time} GMT`;
};

export const ago = (d, now = Date.now()) => {
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return '';
  const mins = Math.max(0, Math.round((now - t) / 60000));
  if (mins < 60) return `${mins || 1}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

// The snapshot is either a profile or a profiles lookup ({ profiles: [...] }); take the
// first profile that has a name.
export const snapshotOf = (app) => {
  const raw = app?.profileApplication?.profileSnapshot || {};
  if (Array.isArray(raw.profiles))
    return raw.profiles.find((p) => p?.firstName) || raw.profiles[0] || {};
  return raw;
};

const nameOf = (app) => {
  const s = snapshotOf(app);
  const full = [s.firstName, s.lastName].filter(Boolean).join(' ').trim();
  return full || s.displayName || s.name || 'Candidate';
};

const skillsOf = (app) => {
  const s = snapshotOf(app);
  return [...(s.technicalSkills || []), ...(s.skills || []), ...(s.softSkills || [])]
    .map((x) => (typeof x === 'string' ? x : x?.name))
    .filter(Boolean)
    .slice(0, 2);
};

const PLATFORM = {
  video: 'Video call',
  phone: 'Phone call',
  'in-person': 'In person',
  assessment: 'Assessment',
};

const platformOf = (iv) => {
  if (iv?.interviewType === 'in-person' && iv.location) return `In person · ${iv.location}`;
  if (iv?.interviewType === 'video' && iv.meetingUrl) {
    try {
      const host = new URL(iv.meetingUrl).hostname.replace(/^www\./, '');
      if (host.includes('meet.google')) return 'Google Meet';
      if (host.includes('zoom')) return 'Zoom';
      if (host.includes('teams')) return 'Microsoft Teams';
      return host;
    } catch {
      return 'Video call';
    }
  }
  return PLATFORM[iv?.interviewType] || 'Interview';
};

const meetingCard = (app, iv, now) => {
  const base = {
    id: String(app._id),
    applicationId: String(app._id),
    kind: 'meeting',
    name: nameOf(app),
    platform: platformOf(iv),
  };
  if (app.currentStage === 'interview_scheduled' && !iv) {
    const last = [...(app.interviews || [])].reverse().find((i) => i?.status === 'cancelled');
    return {
      ...base,
      tone: 'past',
      badge: 'alert',
      meta: last?.scheduledAt ? fmtWhen(last.scheduledAt) : 'No interview booked',
      statusLabel: last ? 'Interview cancelled' : 'No interview booked',
      platform: last ? platformOf(last) : '—',
      primaryAction: 'schedule',
      secondaryAction: 'reject',
    };
  }
  if (app.currentStage === 'interviewed' || !iv) {
    return {
      ...base,
      tone: 'completed',
      badge: 'check',
      meta: iv?.scheduledAt ? fmtWhen(iv.scheduledAt) : 'Interview done',
      statusLabel: 'Interview Completed',
      platform: iv ? platformOf(iv) : '—',
    };
  }
  const at = new Date(iv.scheduledAt).getTime();
  if (iv.status === 'awaiting_pick') {
    const n = (iv.offeredSlots || []).length;
    return {
      ...base,
      tone: 'upcoming',
      badge: 'hourglass',
      meta: `${n} times offered`,
      statusLabel: 'Waiting for the candidate to pick',
      secondaryAction: 'cancel-interview',
    };
  }
  if (iv.status === 'change_requested') {
    const wants = (iv.proposedSlots || []).map(fmtWhen).join('; ');
    return {
      ...base,
      tone: 'past',
      badge: 'alert',
      meta: wants ? `Suggested: ${wants}` : fmtWhen(iv.scheduledAt),
      statusLabel: 'Candidate asked for another time',
      primaryAction: 'reschedule',
      secondaryAction: 'cancel-interview',
    };
  }
  if (iv.status === 'proposed') {
    return {
      ...base,
      tone: 'upcoming',
      badge: 'hourglass',
      meta: fmtWhen(iv.scheduledAt),
      statusLabel: 'Waiting for the candidate to accept',
      secondaryAction: 'reschedule',
    };
  }
  // confirmed / legacy scheduled
  if (at + (iv.duration || 60) * 60000 < now) {
    return {
      ...base,
      tone: 'past',
      badge: 'alert',
      wide: true,
      meta: fmtWhen(iv.scheduledAt),
      statusLabel: 'Past Meeting',
      primaryAction: 'complete',
      secondaryAction: 'reschedule',
    };
  }
  return {
    ...base,
    tone: 'upcoming',
    badge: 'hourglass',
    meta: fmtWhen(iv.scheduledAt),
    statusLabel: 'Upcoming Meeting',
    secondaryAction: 'reschedule',
  };
};

const profileCard = (app, column, now) => {
  const s = snapshotOf(app);
  const match = app?.metadata?.matchScore;
  const edu = s.educationLevel || s.highestQualification || null;
  const meta =
    column === 'rejected'
      ? 'Not this time'
      : column === 'accepted'
        ? 'Offer accepted'
        : column === 'offer-extended'
          ? 'Awaiting response'
          : [match ? `Match ${Math.round(match)}%` : null, edu].filter(Boolean).join(' • ') ||
            'Applied with GTH profile';
  const actions = {
    applied: { primaryAction: 'screen', secondaryAction: 'reject' },
    screening: { primaryAction: 'shortlist', secondaryAction: 'reject' },
    shortlisted: { primaryAction: 'schedule', secondaryAction: 'reject' },
  }[column];
  return {
    id: String(app._id),
    applicationId: String(app._id),
    kind: 'profile',
    name: nameOf(app),
    meta,
    tags:
      column === 'applied' || column === 'screening' || column === 'shortlisted'
        ? skillsOf(app)
        : undefined,
    time: column === 'applied' ? ago(app.appliedAt || app.createdAt, now) : undefined,
    ...(actions || {}),
  };
};

/**
 * @param {Array} columnsTemplate  COLUMNS from applicationPipelineData.js (labels / order)
 * @param {Array} applications     GET /applications/received items
 * @param {String} jobId           the selected posting (resourceId)
 */
export const buildPipelineColumns = (columnsTemplate, applications, jobId, now = Date.now()) => {
  const byColumn = Object.fromEntries(columnsTemplate.map((c) => [c.id, []]));
  for (const app of applications || []) {
    if (jobId && String(app.resourceId) !== String(jobId)) continue;
    const col = STAGE_COLUMN[app.currentStage];
    if (!col || !byColumn[col]) continue;
    const card =
      col === 'interview' ? meetingCard(app, openInterview(app), now) : profileCard(app, col, now);
    byColumn[col].push({
      ...card,
      sortAt: new Date(app.lastUpdatedAt || app.appliedAt || 0).getTime(),
    });
  }
  return columnsTemplate.map((c) => {
    const cards = byColumn[c.id].sort((a, b) => b.sortAt - a.sortAt);
    return { ...c, cards, count: cards.length ? pad2(cards.length) : '--' };
  });
};

/** The candidate summary the Schedule Interview modal shows. */
export const candidateFor = (app, jobTitle) => {
  const s = snapshotOf(app);
  const match = app?.metadata?.matchScore;
  return {
    name: nameOf(app),
    meta: [jobTitle, s.district || s.locality || s.region].filter(Boolean).join(' • '),
    chips: match ? [{ id: 'match', label: `${Math.round(match)}% Match`, tone: 'green' }] : [],
  };
};
