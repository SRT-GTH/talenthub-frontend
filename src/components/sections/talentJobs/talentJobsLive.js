/*
 * Talent Job Postings live data (2026-10-18): maps the GET /guidance/jobs feed (opportunityMatch
 * talentJobs.mixin) onto the exact shapes talentJobsData.js exports for the Figma demo, so the
 * screens render either source unchanged. Nothing here invents numbers: anything the backend does
 * not know yet (recruiter view counts, match boosts) is left out and its card hides.
 */

import { educationTitle, readEducationEntry } from '../../../utils/education.js';

const DAY = 24 * 60 * 60 * 1000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STEPS = ['Sent', 'Seen', 'Shortlisted', 'Interview', 'Offer'];

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const dayMonth = (d) => {
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? '' : `${x.getDate()} ${MONTHS[x.getMonth()]}`;
};
const weekdayDay = (d) => {
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return '';
  return `${x.toLocaleDateString('en-GB', { weekday: 'short' })} ${dayMonth(x)}`;
};

/** "Today" / "2d" / "3w" — the short age the rows show. */
export const ageOf = (date, now = Date.now()) => {
  if (!date) return '';
  const days = Math.floor((now - new Date(date).getTime()) / DAY);
  if (days <= 0) return 'Today';
  if (days < 7) return `${days}d`;
  if (days < 60) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
};
const postedOf = (date, now) => {
  const a = ageOf(date, now);
  if (!a) return '';
  return a === 'Today' ? 'Posted Today' : `Posted ${a} ago`;
};
const appliedOf = (date, now) => {
  if (!date) return 'Applied';
  const days = Math.floor((now - new Date(date).getTime()) / DAY);
  if (days <= 0) return 'Applied today';
  if (days === 1) return 'Applied yesterday';
  if (days < 7) return `Applied ${days} days ago`;
  return `Applied ${dayMonth(date)}`;
};

const initials = (name) =>
  String(name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/** Application stage -> tracker step (index in STEPS), list group and tone. */
export const stageView = (app) => {
  const stage = app?.stage || 'submitted';
  if (stage === 'withdrawn') return { step: -1, group: 'closed', tone: 'withdrawn' };
  if (stage === 'rejected') return { step: 0, group: 'closed', tone: 'closed' };
  if (stage === 'interview_scheduled' || stage === 'interviewed')
    return { step: 3, group: 'interviews', tone: 'good' };
  if (stage === 'offer_pending' || stage === 'offer_extended' || stage === 'accepted')
    return { step: 4, group: 'active', tone: 'good' };
  if (stage === 'shortlisted') return { step: 2, group: 'active', tone: 'good' };
  if (stage === 'under_review' || app?.viewed) return { step: 1, group: 'active', tone: 'plain' };
  return { step: 0, group: 'active', tone: 'plain' };
};

const statusText = (app, recruiterFirst) => {
  const stage = app?.stage || 'submitted';
  const who = recruiterFirst || 'the recruiter';
  switch (stage) {
    case 'withdrawn':
      return 'Withdrawn by you';
    case 'rejected':
      return 'Not this time';
    case 'interview_scheduled':
      return app.interview?.at
        ? `Interview ${weekdayDay(app.interview.at)}`
        : 'Interview being arranged';
    case 'interviewed':
      return 'Interview done · waiting to hear back';
    case 'offer_pending':
    case 'offer_extended':
      return 'Offer on the table';
    case 'accepted':
      return 'Offer accepted';
    case 'shortlisted':
      return 'Shortlisted';
    case 'under_review':
      return `Seen by ${who}`;
    default:
      return app?.viewed ? `Seen by ${who}` : 'Sent · waiting for reply';
  }
};

const actionText = (view) => {
  if (view.tone === 'withdrawn') return 'Apply again';
  if (view.tone === 'closed') return 'See what to boost';
  if (view.group === 'interviews') return 'Prep with Buddy';
  return 'View posting';
};

/** One feed job -> the card/row shape JOB_LIST uses. */
export const toCard = (j, now = Date.now()) => {
  const sector = [j.company?.industry].filter(Boolean).join(' · ') || null;
  const viewed = j.application?.viewed;
  return {
    id: j.id,
    company: {
      name: j.company?.name || 'Company',
      logo: j.company?.logo || null,
      initials: initials(j.company?.name),
      confidential: false,
      sector,
    },
    signal: viewed ? 'Recruiter viewed you' : j.matched && j.isNew ? 'New match' : null,
    isNew: Boolean(j.isNew),
    title: j.title,
    location: j.location || '',
    type: j.typeLabel || '',
    pay: j.pay || 'Pay not listed',
    match: j.match || 0,
    why: (j.why || []).slice(0, 3),
    posted: postedOf(j.posted, now),
    age: ageOf(j.posted, now),
    // live-only fields
    live: true,
    eligible: j.eligible !== false,
    ineligibleReason: j.ineligibleReason || null,
    closed: Boolean(j.closed),
    closesInDays: j.closesInDays ?? null,
    deadline: j.deadline || null,
    bookmarkId: j.saved || null,
    application: j.application || null,
    have: j.have || [],
    missing: j.missing || [],
    reason: j.reason || null,
    matchLevel: j.matchLevel || null,
  };
};

const metaOf = (j) =>
  [
    j.company?.name,
    j.location,
    j.typeLabel,
    j.eligible === false && j.ineligibleReason === 'adults_only' ? 'Adults only' : null,
  ]
    .filter(Boolean)
    .join(' · ');

/** Detail payload (feed job or GET /jobs/:id) -> the JOB_DETAILS[id] entry the detail screen reads. */
export const toDetail = (j, all = [], now = Date.now()) => {
  const app = j.application || null;
  const recruiterFirst = j.recruiter?.first || null;
  const companyLine = [j.company?.industry, j.city].filter(Boolean).join(' · ') || null;
  const closes = j.deadline ? `Closes ${dayMonth(j.deadline)}` : null;
  const level = j.matchLevel || null;
  const matchLabel = !j.match
    ? null
    : j.match >= 80
      ? 'Strong match'
      : j.match >= 65
        ? 'Good match'
        : 'Some fit';
  const view = app ? stageView(app) : null;
  const when = {};
  for (const h of app?.history || []) {
    const idx = stageView({ stage: h.stage }).step;
    if (idx >= 0 && h.at)
      when[STEPS[idx]] = new Date(h.at).toLocaleDateString('en-GB', { weekday: 'short' });
  }
  if (app?.appliedAt && !when.Sent)
    when.Sent = new Date(app.appliedAt).toLocaleDateString('en-GB', { weekday: 'short' });
  const similar = all
    .filter((x) => x.id !== j.id && !x.closed && x.eligible !== false && x.match)
    .slice(0, 3)
    .map((x) => x.id);
  const have = (j.have || []).length;
  const total = have + (j.missing || []).length;
  const skillPct = total ? Math.round((have / total) * 100) : 0;
  const eduOk = j.ineligibleReason !== 'education_level';
  const factors = [
    {
      id: 'skills',
      icon: 'spark',
      label: 'Skills',
      tag: !total
        ? 'Not listed'
        : skillPct >= 70
          ? 'Strong'
          : skillPct >= 40
            ? 'Partial'
            : 'Room to grow',
      pct: skillPct,
      note: total ? `${have} of ${total} skills they want` : 'They didn’t list specific skills',
      ...(total && skillPct < 40 ? { tone: 'amber' } : {}),
    },
    j.careerHit
      ? {
          id: 'goal',
          icon: 'user',
          label: 'Your career goal',
          tag: 'Match',
          pct: 100,
          note: `Fits your goal: ${j.careerHit}`,
        }
      : null,
    {
      id: 'education',
      icon: 'grad',
      label: 'Education',
      tag: eduOk ? 'Match' : 'Not yet',
      pct: eduOk ? 100 : 30,
      note: eduOk
        ? 'Your education level fits what they asked for'
        : 'They want a higher education level',
      ...(eduOk ? {} : { tone: 'amber' }),
    },
    {
      id: 'location',
      icon: 'pin',
      label: 'Location',
      tag: j.locationMode === 'remote' ? 'Remote' : 'On the map',
      pct: 100,
      note: j.location
        ? `The role is ${j.locationMode === 'remote' ? 'remote' : `in ${j.location}`}`
        : 'Location not listed',
    },
  ].filter(Boolean);
  const detail = {
    matchBreakdown: {
      company: j.company?.name || 'this company',
      intro: 'We compare your profile with what {company} asked for. More green = closer fit.',
      factors,
      footnote: 'Change your profile and your score updates the next time you open Job Postings.',
    },
    company: { short: j.company?.name || 'Company', line: companyLine, verified: false },
    sticker: j.closed ? null : j.urgent ? 'Hiring urgently' : j.isNew ? 'New' : null,
    closes,
    closedOn: j.deadline ? `Closed ${dayMonth(j.deadline)}` : null,
    closedNote: j.deadline
      ? `This role stopped taking applications on ${dayMonth(j.deadline)}.`
      : null,
    closedBanner: `${j.company?.name || 'This company'} isn’t taking applications any more.${
      j.match ? ` Your ${j.match}% match still counts.` : ''
    } Here are similar roles that are open.`,
    matchLabel,
    matchNote: j.reason || null,
    level,
    breakdown: j.match
      ? {
          education: j.ineligibleReason === 'education_level' ? 'Not yet' : 'Meets it',
          location: j.city || (j.locationMode === 'remote' ? 'Remote' : j.location || '—'),
        }
      : null,
    about: j.about && (j.about.intro || j.about.bullets?.length) ? j.about : null,
    skills: {
      have: (j.have || []).map((s) => ({ name: s.name })),
      missing: (j.missing || []).map((s) => s.name),
    },
    recruiter: j.recruiter
      ? {
          name: j.recruiter.name,
          first: recruiterFirst,
          role: `Hiring · ${j.company?.name || ''}`.trim(),
          reply: null,
          photo: null,
          initials: initials(j.recruiter.name),
        }
      : null,
    application: app
      ? {
          applied: appliedOf(app.appliedAt, now),
          note: app.viewed
            ? `${recruiterFirst || 'The recruiter'} has seen your application.`
            : null,
          status: statusText(app, recruiterFirst),
          step: view.step,
          when,
        }
      : null,
    similar: similar.length ? similar : null,
    eligible: j.eligible !== false,
    ineligibleReason: j.ineligibleReason || null,
  };
  return detail;
};

/** Whole feed -> every export the Job Postings screens read. */
export const buildJobsData = (feed, now = Date.now()) => {
  const jobs = feed?.jobs || [];
  const counts = feed?.counts || {};
  const cards = jobs.map((j) => toCard(j, now));
  const matched = cards.filter((c, i) => jobs[i].matched);
  const open = jobs.filter((j) => !j.closed);
  const saved = jobs.filter((j) => j.saved);
  const applied = jobs.filter((j) => j.application);
  const appliedRows = applied
    .map((j) => {
      const v = stageView(j.application);
      return {
        id: j.id,
        title: j.title,
        meta: `${j.company?.name || 'Company'} · ${appliedOf(j.application.appliedAt, now)}`,
        step: v.step,
        status: statusText(j.application, null),
        tone: v.tone,
        action: actionText(v),
        group: v.group,
        appliedAt: j.application.appliedAt,
        applicationId: j.application.id,
      };
    })
    .sort((a, b) => String(b.appliedAt).localeCompare(String(a.appliedAt)));
  const interviews = appliedRows.filter((r) => r.group === 'interviews').length;
  const activeApps = appliedRows.filter((r) => r.group !== 'closed').length;
  const closedApps = appliedRows.filter((r) => r.group === 'closed').length;
  const savedOpen = saved.filter((j) => !j.closed).length;
  const closing = saved.filter((j) => !j.closed && j.closesInDays !== null && j.closesInDays <= 2);
  const newMatches = counts.newMatches ?? matched.filter((c) => c.isNew).length;
  const matchSticker = newMatches
    ? `${newMatches} new ${newMatches === 1 ? 'match' : 'matches'}`
    : `${plural(matched.length, 'match')}`;

  const details = {};
  for (const j of jobs) details[j.id] = toDetail(j, jobs, now);

  return {
    JOBS_HEADER: {
      title: 'Job Postings',
      subtitle: 'Roles where recruiters are already seeing you, plus everything else that’s open.',
      stickers: {
        matched: matchSticker,
        browse: `${open.length} open`,
        saved: `${saved.length} saved`,
        applied: interviews ? plural(interviews, 'interview') : `${applied.length} applied`,
        empty: 'new here?',
      },
      decor: {
        viewed: null,
        daily: 'Matches update daily',
        week: newMatches ? `${newMatches} new this week` : null,
      },
    },
    JOB_TAB_LIST: [
      { id: 'matched', label: 'Matched to you', count: String(matched.length), amber: true },
      { id: 'browse', label: 'Browse all', count: String(open.length) },
      { id: 'saved', label: 'Saved', count: String(saved.length) },
      { id: 'applied', label: 'Applied', count: String(applied.length) },
    ],
    DISCOVERY: {
      faces: [],
      title: `Recruiters can already see you for ${plural(matched.length, 'role')}`,
      body: 'You don’t need to apply to be discovered. Applying puts you at the top of their list.',
      sticker: 'no CV needed',
    },
    JOB_LIST: matched,
    JOB_INDEX: cards,
    BROWSE_COPY: {
      search: 'Search roles, companies or skills…',
      filters: ['Location', 'Job type', 'Pay', 'Industry'],
      count: `${plural(open.length, 'open role')} in Ghana`,
      onlyMine: 'Only show my matches',
      unmatched: 'Not matched yet',
    },
    // Browse all sorts "Newest" (SORTS.browse): newest posting first.
    BROWSE_ROWS: [...open]
      .sort((a, b) => String(b.posted || '').localeCompare(String(a.posted || '')))
      .map((j) => ({
        id: j.id,
        title: j.title,
        meta: metaOf(j),
        match: j.eligible !== false && j.match ? j.match : null,
        age: ageOf(j.posted, now),
      })),
    SAVED_COPY: {
      filters: [
        { id: 'all', label: 'All', count: String(saved.length) },
        { id: 'open', label: 'Open', count: String(savedOpen) },
        { id: 'closed', label: 'Closed', count: String(saved.length - savedOpen) },
      ],
      notice: closing.length
        ? `${plural(closing.length, 'saved role')} ${closing.length === 1 ? 'closes' : 'close'} in the next 2 days. Saved roles are removed 7 days after they close.`
        : 'Saved roles are removed 7 days after they close.',
      closesIn: 'Closes soon',
      closed: 'Closed',
      remove: 'Remove',
      view: 'View opportunity',
    },
    SAVED_JOBS: saved.map((j) => ({
      id: j.id,
      status: j.closed
        ? 'closed'
        : j.closesInDays !== null && j.closesInDays <= 2
          ? 'closing'
          : 'open',
      bookmarkId: j.saved,
    })),
    APPLIED_COPY: {
      filters: [
        { id: 'all', label: 'All', count: String(appliedRows.length) },
        { id: 'active', label: 'Active', count: String(activeApps) },
        { id: 'interviews', label: 'Interviews', count: String(interviews) },
        { id: 'closed', label: 'Closed', count: String(closedApps) },
      ],
      steps: STEPS,
      withdrawnStatus: 'Withdrawn by you',
      withdrawnAction: 'Apply again',
      tip: 'Tip: recruiters reply faster to talents with a verified skill. Prove one in Skills Lab.',
    },
    APPLIED_ROWS: appliedRows,
    EMPTY_COPY: {
      title: 'No matches… yet',
      body: 'Recruiters find talent by skills and location. Give them more to go on and matches start rolling in, usually within a day.',
      steps: [
        { title: 'Add 3 more skills', sub: '+ more matches' },
        { title: 'Verify a skill in Skills Lab', sub: 'Recruiters filter for this' },
        { title: 'Finish your profile', sub: 'Every section helps' },
      ],
      primary: 'Boost my profile',
      secondary: `Browse all ${plural(open.length, 'posting')}`,
    },
    MATCH_FOOTER: {
      done: matched.length ? `That's all ${matched.length} for today.` : '',
      sub: 'New matches land every morning.',
      link: `Browse all ${plural(open.length, 'role')} →`,
    },
    JOB_DETAILS: details,
  };
};

/** Merge a GET /jobs/:id payload into an existing data set (about, recruiter). */
export const mergeJobDetail = (data, job, feedJobs = [], now = Date.now()) => {
  if (!data || !job) return data;
  const detail = toDetail(job, feedJobs, now);
  return { ...data, JOB_DETAILS: { ...data.JOB_DETAILS, [job.id]: detail } };
};

const nameOf = (x) => (typeof x === 'string' ? x : x?.name || '');

/** The talent's own profile -> PROFILE_PREVIEW ("This is what {company} will see", J-04). */
export const buildProfilePreview = (p) => {
  if (!p) return null;
  const edu = (Array.isArray(p.education) ? p.education : [])
    .filter((e) => e?.institution && e.institution !== 'Not provided')
    .map(readEducationEntry);
  const current = edu.find((e) => e.isCurrent) || edu[0] || null;
  const eduText = current ? educationTitle(current) : null;
  const place = p.locality || p.district || p.region || null;
  const school = current?.institution || null;
  const skills = [...(p.technicalSkills || []), ...(p.softSkills || [])]
    .map(nameOf)
    .filter(Boolean);
  const projects = Array.isArray(p.portfolio) ? p.portfolio.length : 0;
  return {
    name: [p.firstName, p.lastName].filter(Boolean).join(' ') || 'You',
    line: [[eduText, school].filter(Boolean).join(', '), place].filter(Boolean).join(' · '),
    status: 'Visible to recruiters',
    rows: [
      {
        id: 'about',
        label: p.professionalBio || p.bio ? 'About me' : 'About me · not written yet',
        status: 'Visible',
      },
      {
        id: 'skills',
        label: skills.length
          ? `Skills · ${skills.slice(0, 4).join(', ')}`
          : 'Skills · none added yet',
        status: 'Visible',
      },
      { id: 'education', label: `Education · ${eduText || 'not added yet'}`, status: 'Visible' },
      {
        id: 'projects',
        label: `Projects · ${projects ? plural(projects, 'project') : 'none yet'}`,
        status: 'Visible',
        hiddenStatus: 'Hidden',
      },
      { id: 'contact', label: 'Email and phone', status: 'Shared only if you accept a chat' },
    ],
  };
};
