import { CORE_CONTENT, HERO, JOURNEY_COPY } from './talentHomeCoreData.js';

/*
 * talentHomeLive.js - turns the real /home data (services/talentHome.api.js)
 * into the same shapes the section components already render (CORE_CONTENT,
 * HERO, JOURNEY_COPY), so the Figma layout is unchanged.
 *
 * Rule: real numbers or an honest empty state, never the Figma demo numbers.
 * Cards with no backend yet (who's looking, recruiter activity, streak) are
 * returned as null and the layout skips them.
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
export const buildLiveContent = (stateKey, data, now = new Date()) => {
  const j = data.journey || { doneCount: 0, total: 9, percent: 0, stages: [], nextStage: 'avatar' };
  const first = data.firstName || 'there';
  const next = j.nextStage ? LABEL[j.nextStage] : null;
  const nm = j.nextMilestone;
  const toNext = nm ? nm.at - j.doneCount : 0;
  const complete = stateKey === 'complete' || stateKey === 'top';
  const base = CORE_CONTENT[stateKey] || CORE_CONTENT.day1;

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
      body: `${data.matches.total ? `${plural(data.matches.total, 'role')} match your profile` : 'No roles match your profile yet'}${data.applications.total ? ` and you have ${plural(data.applications.total, 'application')} in progress` : ''}. Here’s what matters today.`,
      stats: [
        {
          n: String(data.matches.total),
          label: 'Matches',
          note: data.targetCareer ? `For ${data.targetCareer}` : 'Roles for you',
          tone: 'white',
        },
        {
          n: String(data.applications.total),
          label: 'Applications',
          note: data.applications.total ? 'In progress' : 'None yet',
          tone: 'white',
        },
        {
          n: String(data.notifications.unread),
          label: 'Notifications',
          note: data.notifications.unread ? 'Unread' : 'All caught up',
          tone: 'amber',
        },
        {
          n: String(data.verifiedSkills),
          label: 'Verified skills',
          note: data.verifiedSkills ? 'Proven on GTH' : 'Prove one in Skills Lab',
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
          sub: data.targetCareer
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
    },
    buddy,
    readiness,
    streak: null,
    looking: null,
    recruiters: null,
    exploreChip: data.matches.total
      ? `Explore ${plural(data.matches.total, 'role')} for you`
      : 'Explore roles in Ghana',
  };
};
