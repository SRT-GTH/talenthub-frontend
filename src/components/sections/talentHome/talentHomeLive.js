import { CORE_CONTENT, HERO, JOURNEY_COPY } from './talentHomeCoreData.js';

/*
 * talentHomeLive.js - turns the real /home data (services/talentHome.api.js)
 * into the same shapes the section components already render (CORE_CONTENT,
 * HERO, JOURNEY_COPY), so the Figma layout is unchanged.
 *
 * Rule: real numbers or an honest empty state, never the Figma demo numbers.
 * Cards with no backend yet (streak) are returned as null and the layout
 * skips them. Who's looking and recruiter activity come from /activity/me.
 */

// Same ids/labels as JOURNEY_STAGES in talentHomeState.js (kept here to avoid an import cycle).
const LABEL = {
  avatar: 'Avatar',
  interests: 'Interests',
  personality: 'Personality',
  skills: 'Skills',
  work: 'Work',
  portfolio: 'Portfolio',
  certs: 'Certs',
  goals: 'Goals',
  pitch: 'Pitch',
};
const MILESTONE_LABEL = {
  discoverable: 'Discoverable',
  top_20: 'Top 20%',
  top_talent: 'Top Talent',
};
const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

export const relativeTime = (iso, now = new Date()) => {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return '';
  const mins = Math.round((now - t) / 60000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
};

const greeting = (now) =>
  now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
const initials = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'GT';
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Which Figma home state fits the real journey. */
export const stateKeyFor = (data) => {
  const done = data?.journey?.doneCount ?? 0;
  if (done >= 9) return data?.applications?.total > 0 ? 'top' : 'complete';
  if (done >= 3) return 'discoverable';
  return 'day1';
};

const matchCards = (items, complete) =>
  items.slice(0, 3).map((m, i) => ({
    id: m.opportunityId || m.id || String(i),
    initials: initials(m.organization),
    title: m.title,
    meta: [m.organization, m.location?.city, m.location?.type].filter(Boolean).join(' · '),
    salary: m.type ? String(m.type).replace(/-/g, ' ') : 'Role',
    ...(complete && Number.isFinite(m.matchScore)
      ? { score: `${Math.round(m.matchScore)}%`, scoreLabel: 'match' }
      : {}),
    ...(m.deadline
      ? {
          extra: {
            text: `Closes ${new Date(m.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
            focused: 'grey',
            playful: 'white',
          },
        }
      : {}),
    ...(i === 0 ? { featured: true, sticker: complete ? 'BEST FIT' : 'NEW FOR YOU' } : {}),
  }));

const APP_STEPS = ['applied', 'screening', 'interview', 'offer'];
const appItems = (items) =>
  items.slice(0, 4).map((a, i) => {
    const stage = String(a.stage || a.status || 'applied').toLowerCase();
    const at = Math.max(
      0,
      APP_STEPS.findIndex((s) => stage.includes(s))
    );
    const title = a.opportunity?.title || a.resourceTitle || a.title || 'Application';
    const org = a.opportunity?.organization || a.organizationName || '';
    return {
      id: a._id || a.id || String(i),
      initials: initials(org || title),
      title: org ? `${title} · ${org}` : title,
      meta: `Applied ${relativeTime(a.createdAt || a.submittedAt).toLowerCase()}`,
      steps: APP_STEPS.map((_, k) => (k < at ? 'done' : k === at ? 'now' : 'todo')),
      chip: {
        text: stage.charAt(0).toUpperCase() + stage.slice(1).replace(/_/g, ' '),
        tone: at >= 2 ? 'green' : 'white',
      },
    };
  });

const activityRows = (items) =>
  items
    .slice(0, 7)
    .map((n) => ({ kind: 'check', text: n.title || n.message, when: relativeTime(n.createdAt) }));

/** Content in the CORE_CONTENT shape for the given state, from real data. */
/* ---------------- Who's looking / recruiter activity (Phase 3, 2026-10-18) ---------------- */
// From GET /activity/me (backend #156). Free tier is company level: never a viewer's name.

const PRIVATE_NOTE =
  'You browse in private mode, so who viewed you is hidden. Switch to company mode to see it.';

const viewTrend = (v) => {
  if (!v) return 'This week';
  const cur = v.uniqueViewers || 0;
  const prev = v.previousPeriod || 0;
  if (!prev) return cur ? 'New this week' : 'None yet';
  const pct = Math.round(((cur - prev) / prev) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}% vs last week`;
};

// "2 recruiters from Kumasi Steel Works", "1 independent recruiter", "3 talents"
const viewerGroup = (g) => {
  if (g.entityType === 'recruiter') {
    return g.orgName === 'Independent recruiters'
      ? plural(g.count, 'independent recruiter')
      : `${plural(g.count, 'recruiter')} from ${g.orgName}`;
  }
  const word = String(g.orgName || 'members').toLowerCase();
  return `${g.count} ${g.count === 1 ? word.replace(/s$/, '') : word}`;
};

const lookingCard = (v) => {
  const n = v?.uniqueViewers || 0;
  if (!n) {
    return {
      title: 'Who’s looking',
      headline: 'No profile views yet this week',
      sub: 'When recruiters open your profile, their company shows here.',
      photos: [],
    };
  }
  const groups = v.privateMode ? [] : v.byCompany || [];
  const single = groups.length === 1 && !v.anonymous;
  const parts = single ? [] : groups.slice(0, 2).map(viewerGroup);
  if (v.anonymous) parts.push(plural(v.anonymous, 'private viewer'));
  if (v.privateMode) parts.splice(0, parts.length, PRIVATE_NOTE);
  if (!parts.length) parts.push(v.previousPeriod ? `This week · ${viewTrend(v)}` : 'This week');
  return {
    title: 'Who’s looking',
    headline: single
      ? `${viewerGroup(groups[0])} viewed your profile`
      : `${plural(n, 'person', 'people')} viewed your profile`,
    sub: parts.join(' · '),
    photos: groups.slice(0, 2).map((g) => ({ initials: initials(g.orgName) })),
  };
};

const recruitersCard = (v, now) => {
  const n = v?.uniqueViewers || 0;
  return {
    title: 'Recruiter activity',
    link: 'See all',
    sub: n
      ? `${plural(n, 'viewer')} this week${v.searchAppearances ? ` · ${plural(v.searchAppearances, 'search appearance')}` : ''}`
      : 'No profile views this week yet.',
    rows: (v?.items || []).slice(0, 3).map((it) => ({
      photo: null,
      initials: initials(it.label),
      name: [it.label, it.title].filter(Boolean).join(' · '),
      what: 'Viewed your profile',
      when: relativeTime(it.when, now),
      role: it.roleTitle || 'Profile',
    })),
    privacy: v?.privateMode
      ? PRIVATE_NOTE
      : 'You see companies, not names. Viewers who browse privately show as “A recruiter”.',
  };
};

/** Recruiter activity tab (?tab=recruiter) from the same /activity/me summary. */
export const buildRecruiterActivity = (views, now = new Date()) => {
  const v = views || {
    uniqueViewers: 0,
    previousPeriod: 0,
    byCompany: [],
    anonymous: 0,
    searchAppearances: 0,
    items: [],
    locked: [],
    privateMode: false,
  };
  const known = (it) =>
    it.entityType === 'recruiter' && !['A recruiter', 'Independent recruiters'].includes(it.label);
  const items = (v.items || []).map((it, i) => ({
    id: `view-${i}`,
    name: it.label,
    role: it.title || '',
    text: it.roleTitle ? `Viewed your profile for a ${it.roleTitle} role` : 'Viewed your profile',
    when: relativeTime(it.when, now),
    tag: it.roleTitle || null,
    kind: 'eye',
    filter: 'viewed',
    photo: null,
    initials: initials(it.label),
    verified: known(it),
  }));
  const companies = (v.byCompany || []).filter(
    (g) => g.entityType === 'recruiter' && g.orgName !== 'Independent recruiters'
  );
  const premiumLocked = (v.locked || []).includes('names');
  return {
    demo: false,
    feed: {
      title: 'Who viewed your profile',
      range: 'Last 7 days',
      filters: [
        { id: 'all', label: 'All', count: items.length },
        { id: 'viewed', label: 'Viewed', count: items.length },
      ],
      items,
      empty: v.privateMode
        ? PRIVATE_NOTE
        : 'No one has viewed your profile this week yet. Each stage you finish puts you in more recruiter searches.',
      note:
        premiumLocked && items.length
          ? 'Free accounts see the latest 5 visits by company. Names and repeat visits come with Premium, coming soon.'
          : null,
    },
    thisWeek: {
      title: 'This week',
      stats: [
        {
          value: String(v.uniqueViewers || 0),
          label: 'Profile viewers',
          note: viewTrend(v),
          tone: 'white',
        },
        {
          value: String(v.searchAppearances || 0),
          label: 'Search appearances',
          note: v.searchAppearances ? 'You showed in results' : 'None yet',
          tone: 'white',
        },
        {
          value: String(companies.length),
          label: companies.length === 1 ? 'Company' : 'Companies',
          note: companies[0]?.orgName || 'None yet',
          tone: 'gold',
        },
        {
          value: String(v.anonymous || 0),
          label: 'Private viewers',
          note: 'Browsing privately',
          tone: 'mint',
        },
      ],
      footer: '',
    },
    tip: v.uniqueViewers
      ? `${companies[0] ? `${companies[0].orgName} is looking. ` : ''}Keep your skills and pitch up to date so the next visit counts.`
      : 'Recruiters find talents through search. Finish your profile stages to show up more often.',
  };
};

export const buildLiveContent = (stateKey, data, now = new Date()) => {
  const j = data.journey || { doneCount: 0, total: 9, percent: 0, stages: [], nextStage: 'avatar' };
  const first = data.firstName || 'there';
  const next = j.nextStage ? LABEL[j.nextStage] : null;
  const nm = j.nextMilestone;
  const toNext = nm ? nm.at - j.doneCount : 0;
  const complete = stateKey === 'complete' || stateKey === 'top';
  const base = CORE_CONTENT[stateKey] || CORE_CONTENT.day1;
  // Sections whose call has not returned yet (see loadTalentHome). They show a
  // skeleton or a neutral line, never a zero the data has not confirmed.
  const pending = data.pending || {};

  const journeyCopy = {
    ...JOURNEY_COPY,
    day1: {
      metaDone: `${j.doneCount} of 9 done · ${j.percent}%`,
      metaNext: nm ? `Next milestone: ${MILESTONE_LABEL[nm.id]} at ${nm.at} of 9` : '',
      metaSaved: 'Auto-saved',
    },
    discoverable: {
      metaDone: `${j.doneCount} of 9 done · ${j.percent}%`,
      metaNext: nm
        ? `Next milestone: ${MILESTONE_LABEL[nm.id]} at ${nm.at} of 9${toNext === 1 ? ' · one stage away' : ''}`
        : '',
      metaSaved: null,
    },
    min: {
      ...JOURNEY_COPY.min,
      title: `Profile journey · ${j.doneCount} of 9`,
      sub: next
        ? `Next: ${next}${nm ? ` · unlocks ${MILESTONE_LABEL[nm.id]} at ${nm.at}` : ''}`
        : 'All stages done',
      cta: next ? `Continue: ${next}` : 'View my profile',
      count: String(j.doneCount),
    },
  };

  let hero;
  if (stateKey === 'day1') {
    hero = {
      ...HERO.day1,
      headline: [[`Akwaaba, ${first}. Let’s `], ['get you seen.', true]],
      body: `${j.doneCount} of 9 stages done. ${plural(9 - j.doneCount, 'quick stage')} to go. Most people finish in about 20 minutes, and everything saves as you go.`,
      cta: next ? `Continue: ${next}` : HERO.day1.cta,
      xp: { big: `${j.doneCount}/9`, caption: 'Stages done' },
    };
  } else if (stateKey === 'discoverable') {
    const top20 = j.milestone === 'top_20';
    hero = {
      ...HERO.discoverable,
      eyebrow: top20 ? 'MILESTONE 2 OF 3 UNLOCKED' : 'MILESTONE 1 OF 3 UNLOCKED',
      headline: top20
        ? [['You’re in the '], ['Top 20%,', true], [` ${first}.`]]
        : [['You’re '], ['Discoverable,', true], [` ${first}.`]],
      body: top20
        ? `Recruiters see your fit score on every role.${next ? ` Add your ${next.toLowerCase()} next to keep going.` : ''}`
        : `Recruiters can now find you in search.${next && nm ? ` ${plural(toNext, 'stage')} to ${MILESTONE_LABEL[nm.id]}: ${next.toLowerCase()} is next.` : ''}`,
      cta: next ? `Continue: ${next}` : HERO.discoverable.cta,
      ring: { pct: j.percent, label: `${j.doneCount} of 9 stages`, xp: null, xpTail: null },
    };
  } else {
    hero = {
      ...HERO.complete,
      eyebrow: `${WEEKDAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`,
      headline: [[`${greeting(now)}, `], [`${first}.`, true]],
      body: pending.matches
        ? `${data.applications.total ? `You have ${plural(data.applications.total, 'application')} in progress. ` : ''}Here’s what matters today.`
        : `${data.matches.total ? `${plural(data.matches.total, 'role')} match your profile` : 'No roles match your profile yet'}${data.applications.total ? ` and you have ${plural(data.applications.total, 'application')} in progress` : ''}. Here’s what matters today.`,
      stats: [
        {
          n: pending.views ? '…' : String(data.views?.uniqueViewers ?? 0),
          label: 'Profile views',
          note: pending.views ? 'Loading' : viewTrend(data.views),
          tone: 'white',
        },
        {
          n: pending.matches ? '…' : String(data.matches.total),
          label: 'Matches',
          note: data.targetCareer ? `For ${data.targetCareer}` : 'Roles for you',
          tone: 'white',
        },

        {
          n: pending.notifications ? '…' : String(data.notifications.unread),
          label: 'Notifications',
          note: pending.notifications
            ? 'Loading'
            : data.notifications.unread
              ? 'Unread'
              : 'All caught up',
          tone: 'amber',
        },
        {
          n: pending.verifiedSkills ? '…' : String(data.verifiedSkills),
          label: 'Verified skills',
          note: pending.verifiedSkills
            ? 'Loading'
            : data.verifiedSkills
              ? 'Proven on GTH'
              : 'Prove one in Skills Lab',
          tone: 'mint',
        },
      ],
    };
  }

  const matches = {
    ...base.matches,
    link: data.matches.total ? `See all ${data.matches.total}` : null,
    ...(complete
      ? {
          sub: !data.matches.total
            ? `No open roles fit ${data.targetCareer ? `your goal (${data.targetCareer})` : 'your profile'} yet. New roles show here as soon as recruiters post them.`
            : data.targetCareer
              ? `Based on your profile and your goal: ${data.targetCareer}.`
              : 'Based on your profile.',
        }
      : {
          note: data.matches.total
            ? j.milestone === 'top_20'
              ? `${plural(data.matches.total, 'role')} match so far. Your fit score shows on each role.`
              : `${plural(data.matches.total, 'role')} match so far. Reach Top 20% and we’ll show your fit score for each.`
            : 'No matching roles yet. Add skills and goals and we’ll find some.',
        }),
    cards: matchCards(data.matches.items, complete),
    pending: Boolean(pending.matches),
  };

  const applications = data.applications.total
    ? {
        ...CORE_CONTENT.complete.applications,
        link: `Full tracker (${data.applications.total})`,
        items: appItems(data.applications.items),
      }
    : {
        ...CORE_CONTENT.discoverable.applications,
        items: [],
        cta: data.matches.total
          ? `Browse ${plural(data.matches.total, 'match', 'matches')}`
          : 'Browse roles',
      };

  const r = data.readiness;
  const readiness =
    r && Number.isFinite(r.totalScore)
      ? {
          ...CORE_CONTENT.complete.readiness,
          score: String(Math.round(r.totalScore)),
          pct: Math.round(r.totalScore),
          headline: data.targetCareer ? `Readiness for ${data.targetCareer}` : 'Your job readiness',
          sub:
            r.totalScore >= 70 ? 'Job-ready' : r.totalScore >= 45 ? 'Getting there' : 'Early days',
          gapLabel: 'NEXT BEST STEP',
          gapPts: r.improvementActions?.[0] ? `+${r.improvementActions[0].impactPoints}` : '',
          gapTitle: r.improvementActions?.[0]?.action || 'Keep building your profile',
          gapBody: r.improvementActions?.[0] ? 'Do this next to raise your score the most.' : '',
        }
      : {
          ...CORE_CONTENT.discoverable.readiness,
          chip:
            j.doneCount >= 6
              ? 'Set a target career'
              : `${plural(Math.max(0, 6 - j.doneCount), 'stage')} away`,
          pct: Math.min(100, (j.doneCount / 6) * 100),
          caption: `${Math.min(j.doneCount, 6)} of 6 stages${j.doneCount < 6 && next ? ` · add your ${next.toLowerCase()} next` : ''}`,
        };

  const buddy = {
    ...base.buddy,
    message: next
      ? `Your next stage is ${next}. I can walk you through it in a few minutes.`
      : data.applications.total
        ? 'Want to practise for your interviews? I can run a mock interview with you.'
        : `Your profile is complete. Want me to find roles for ${data.targetCareer || 'you'} or run a practice interview?`,
    cta: next ? `Continue: ${next}` : 'Start mock interview',
    sticker: null,
  };

  return {
    ...base,
    hero,
    journeyCopy,
    matches,
    applications,
    activity: {
      ...CORE_CONTENT.complete.activity,
      link: null,
      rows: activityRows(data.notifications.items),
      pending: Boolean(pending.notifications),
    },
    buddy,
    readiness: pending.readiness ? { ...readiness, pending: true } : readiness,
    streak: null,
    looking: pending.views ? { pending: true } : lookingCard(data.views),
    recruiters: pending.views ? { pending: true } : recruitersCard(data.views, now),
    exploreChip:
      !pending.matches && data.matches.total
        ? `Explore ${plural(data.matches.total, 'role')} for you`
        : 'Explore roles in Ghana',
  };
};

/* ---------------- MyAssessment tab (Phase 2, 2026-10-18) ---------------- */

// Short, plain descriptions of the six RIASEC (Holland) interest types.
const RIASEC_TEXT = {
  R: 'You like hands-on, practical work with tools, materials and things you can see and touch.',
  I: 'You like to understand how things work: research, analysis and solving puzzles.',
  A: 'You like to create: designing, making and expressing ideas in your own way.',
  S: 'You like to help, teach and work closely with people.',
  E: 'You like to lead, persuade and get things moving.',
  C: 'You like order: clear processes, careful detail and getting things exactly right.',
};
const TRAIT_NAME = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  stability: 'Emotional stability',
};
const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};
const titleCase = (t) => String(t || '').replace(/\b\w/g, (c) => c.toUpperCase());
const shortDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

const evidenceOf = (v) => {
  if (!v) return 'self';
  const type = String(v.evidenceType || '').toLowerCase();
  const status = String(v.validationStatus || '').toLowerCase();
  if (type.includes('game') || v.gameSessionId) return 'game';
  if (type.includes('assessment') || type.includes('certificate')) return 'assessment';
  if (status.includes('conversation') || type.includes('conversation')) return 'ai';
  if (status === 'verified') return 'assessment';
  return 'self';
};

/** Content for MyAssessmentTab (same shapes as talentHomeTabsData.js). */
export const buildAssessmentContent = (data) => {
  const a = data.assessment || {};
  const results = a.results || [];
  const byType = Object.fromEntries(results.map((r) => [r.assessmentType, r]));
  const bigFive = byType.big_five?.bigFiveScores || null;
  const riasec = byType.riasec?.riasecScores || a.summary?.careerInterestProfile || null;
  const required = a.required || ['big_five', 'riasec'];
  const skills = [];
  const seen = new Set();
  for (const s of [...(a.technicalSkills || []), ...(a.softSkills || [])]) {
    const name = typeof s === 'string' ? s : s?.name;
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    skills.push(name);
  }
  const verifByKey = Object.fromEntries(
    (a.verifications || []).map((v) => [String(v.skillKey || '').toLowerCase(), v])
  );
  const games = a.games || [];

  // 4 parts, as designed: Personality, Skills, Skills Lab games, Full assessment.
  const parts = [
    { label: 'Personality', done: Boolean(bigFive) },
    { label: 'Skills', done: skills.length > 0 },
    { label: 'Skills Lab games', done: games.length > 0 },
    { label: 'Full assessment', done: required.every((t) => byType[t]) },
  ];
  const doneCount = parts.filter((p) => p.done).length;
  const pending = parts.filter((p) => !p.done).map((p) => p.label);

  const summary = {
    done: String(doneCount),
    doneLabel: 'OF 4 DONE',
    title:
      doneCount === 4
        ? 'Assessment profile: complete'
        : doneCount >= 3
          ? 'Assessment profile: strong foundation'
          : doneCount >= 1
            ? 'Assessment profile: getting started'
            : 'Assessment profile: not started',
    body: pending.length
      ? `${
          parts
            .filter((p) => p.done)
            .map((p) => p.label)
            .join(', ') || 'Nothing'
        } ${doneCount === 1 ? 'is' : 'are'} done. Next: ${pending[0].toLowerCase()}.`
      : 'Everything is done. Recruiters see the full picture.',
    chips: parts.filter((p) => p.done).map((p) => p.label),
    pending: pending[0] || null,
    cta: 'Preview recruiter view',
  };

  let personality = null;
  if (bigFive || riasec) {
    const pct = bigFive?.percentiles || {};
    const traits = bigFive
      ? [
          ['openness', pct.openness],
          ['conscientiousness', pct.conscientiousness],
          ['extraversion', pct.extraversion],
          ['agreeableness', pct.agreeableness],
          ['stability', Number.isFinite(pct.neuroticism) ? 100 - pct.neuroticism : undefined],
        ]
          .filter(([, v]) => Number.isFinite(v))
          .sort((x, y) => y[1] - x[1])
          .map(([k, v], i) => ({
            name: TRAIT_NAME[k],
            label: `${ordinal(Math.round(v))} percentile`,
            pct: v,
            strong: v >= 70,
            gradient: i < 4,
          }))
      : [];
    const primary = riasec?.primary;
    const labels = [riasec?.primary, riasec?.secondary, riasec?.tertiary]
      .filter(Boolean)
      .map((x) => x.label);
    const careers = (a.desiredCareers || [])
      .map((c) => (typeof c === 'string' ? c : c?.careerName || c?.title))
      .filter(Boolean)
      .slice(0, 5)
      .map(titleCase);
    personality = {
      title: 'Personality',
      status: 'Completed',
      lead: primary ? 'You’re ' : 'Your strongest trait: ',
      type: primary ? `${primary.label}.` : `${traits[0]?.name || 'Personality'}.`,
      sub: riasec?.code
        ? `Holland code ${riasec.code} · ${labels.join(', ')}`
        : 'Big Five personality profile',
      body: primary ? RIASEC_TEXT[primary.key] || '' : '',
      affinityLabel: careers.length ? 'Careers you’re aiming for' : 'Career affinity',
      affinity: careers.length ? careers : labels,
      traits,
      lock: `System-generated from your answers${a.lastAssessedAt ? ` on ${shortDate(a.lastAssessedAt)}` : ''}. Results can’t be edited.`,
    };
  }

  const skillRows = skills.map((name) => {
    const v = verifByKey[name.toLowerCase()];
    return {
      name,
      level: v?.claimedLevel ? titleCase(v.claimedLevel) : '',
      evidence: evidenceOf(v),
    };
  });
  const verified = skillRows.filter((s) => s.evidence !== 'self').length;
  const skillsEvidence = {
    title: 'Skills evidence',
    count: `${plural(skillRows.length, 'skill')} · ${verified} verified`,
    intro: skillRows.length
      ? 'How each skill was proven. Recruiters see the same labels.'
      : 'No skills on your profile yet.',
    skills: skillRows.slice(0, 6),
    more: skillRows.length > 6 ? `${plural(skillRows.length - 6, 'more skill')}` : null,
    manage: 'Manage skills',
  };

  const firstSelf = skillRows.find((s) => s.evidence === 'self');
  const next = firstSelf
    ? {
        title: `Prove your ${firstSelf.name} skill`,
        meta: () => 'About 5 minutes with Career Buddy',
        body: `Tell Career Buddy how you use ${firstSelf.name}. A short conversation moves it from Self-reported to AI-validated, which recruiters trust more.`,
        cta: 'Validate with Career Buddy',
        sticker: 'BIGGEST BOOST',
        to: '/profile/filling/career-buddy',
      }
    : !bigFive
      ? {
          title: 'Take the personality quiz',
          meta: () => 'About 8 minutes',
          body: 'See your strongest traits and the careers that suit them. Recruiters see your result too.',
          cta: 'Start quiz',
          sticker: 'BIGGEST BOOST',
          to: '/profile/filling/career-buddy',
        }
      : null;

  const lab = {
    title: 'Skills Lab',
    more: 'Play more',
    games: games.slice(0, 4).map((g, i) => {
      const score = Math.round(g.score ?? g.normalizedScore ?? g.result?.score ?? 0);
      const pctl = g.percentile ?? g.result?.percentile;
      return {
        name: g.gameName || g.title || g.gameKey || `Game ${i + 1}`,
        when: shortDate(g.completedAt || g.createdAt),
        score,
        top: Number.isFinite(pctl) ? `Top ${Math.max(1, 100 - Math.round(pctl))}%` : '',
        strong: score >= 85,
      };
    }),
    empty: games.length
      ? null
      : 'No Skills Lab games yet. A short game proves a skill and earns the Game-evidenced label.',
  };

  return { summary, personality, skillsEvidence, next, lab, chip: `${doneCount} of 4` };
};
