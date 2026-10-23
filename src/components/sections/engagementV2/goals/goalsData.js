/*
 * Goals (stage 8) copy, demo seed data (signed-out design frames only) and the live profile mappers at the bottom. Copy is verbatim from the Figma frames GO-01..GO-06 (Focused 8285:19018.. /
 * Playful 7715:8..). The three seed goals are the ones drawn in GO-02. The select option lists are NOT drawn in Figma (only the
 * closed fields are), so they hold exactly the values the frames show elsewhere (cards, edit modal, delete preview).
 */
export const GOAL_TYPES = ['Full-time job', 'Contract', 'Postgraduate study'];
export const GOAL_INDUSTRIES = ['Fintech'];
export const GOAL_TIMELINES = ['Within 6 months', 'Within 1 year', 'From Sep 2027'];
export const GOAL_PLACES = [
  'Accra only',
  'Anywhere in Ghana',
  'Remote-first',
  'Accra or remote',
  'Open to relocating',
];

/* goal: { id, title, industry, type, where, when, notes, min, max (GH₵ per month, private) } - first in the list = primary */
export const SEED_GOALS = [
  {
    id: 'goal-se-fintech',
    title: 'Software Engineer',
    industry: 'Fintech',
    type: 'Full-time job',
    where: 'Accra or remote',
    when: 'Within 6 months',
    notes: 'Preferably an early-stage startup working on payments.',
    min: 3000,
    max: 6000,
  },
  {
    id: 'goal-product-designer',
    title: 'Product Designer',
    industry: '',
    type: 'Contract',
    where: 'Hybrid, Accra',
    when: 'Within 1 year',
    notes: '',
    min: 4000,
    max: null,
  },
  {
    id: 'goal-msc-data-science',
    title: 'MSc Data Science',
    industry: '',
    type: 'Postgraduate study',
    where: 'Ghana or UK',
    when: 'From Sep 2027',
    notes: '',
    min: null,
    max: null,
  },
];

export const EMPTY_GOAL = {
  id: '',
  title: '',
  industry: '',
  type: '',
  where: '',
  when: '',
  notes: '',
  min: null,
  max: null,
};

export const NOTES_MAX = 200;
export const STAGE_DONE_IDS = [
  'avatar',
  'interests',
  'personality',
  'skills',
  'work',
  'portfolio',
  'certs',
];
export const COMPLETE_DONE_IDS = [...STAGE_DONE_IDS, 'goals'];

export const HERO_CARD_ROWS = [
  {
    icon: 'Target',
    title: 'A specific role',
    text: '“Product designer, fintech” beats “open to anything”',
  },
  { icon: 'MarkerPin', title: 'Place and timing', text: 'Accra, remote, within 6 months' },
  { icon: 'Lock', title: 'A pay range', text: 'Private. Only used for matching' },
];

export const HOW_IT_WORKS = [
  { icon: 'Target', title: '1. Name the role', text: 'Use a title a recruiter would recognise.' },
  {
    icon: 'MarkerPin',
    title: '2. Set place and timing',
    text: 'Where and when you want to start.',
  },
  { icon: 'Lock', title: '3. Add a pay range', text: 'Private. Only used for matching.' },
];

export const WHY_ROWS = [
  {
    icon: 'Target',
    title: 'Matches you want',
    text: 'Recruiters match you to roles you want, not just roles you can do.',
  },
  {
    icon: 'Lock',
    title: 'Pay stays private',
    text: 'We use your range to filter out bad fits. Recruiters never see the number.',
  },
];

export const ALMOST_ROWS = [
  {
    icon: 'Diamond',
    title: 'One stage left',
    text: 'Finish Goals, then Pitch to reach Top Talent.',
  },
];

export const EXAMPLE_GOAL = {
  title: 'Software Engineer · Fintech',
  meta: [
    { icon: 'Suitcase', text: 'Full-time' },
    { icon: 'MarkerPin', text: 'Accra or remote' },
    { icon: 'Calendar', text: 'Within 6 months' },
  ],
  notes: 'Preferably an early-stage startup working on payments.',
  pay: 'GH₵ 3,000 – 6,000 / month',
};

export const STAGE_COMPLETE_STATS = { done: '8/9', profile: '89%', earned: 40 };
export const UNLOCKS = [
  {
    icon: 'Search',
    title: 'Goal-matched search',
    text: 'Recruiters looking for a fintech engineer in Accra see you first.',
  },
  {
    icon: 'Diamond',
    title: 'Top Talent is next',
    text: 'Record your pitch to finish your profile.',
  },
];

/* Confetti of the stage-complete art: [x from centre, y from top of the 560x176 art, rotation deg, colour, opacity] (6x10 chips). */
export const CONFETTI = [
  [149, 34, 46, '#c0392b', 0.9],
  [129, 23, -68, '#c0392b', 0.9],
  [-161, 53, -51, '#ffd86b', 0.9],
  [-223, 87, 48, '#ffd86b', 0.9],
  [-176, 96, 2, '#387440', 1],
  [-228, 142, -85, '#c8951a', 0.9],
  [-152, 151, 56, '#387440', 1],
  [145, 112, 39, '#c0392b', 0.9],
  [250, 80, 48, '#c8951a', 0.9],
  [-202, 35, -49, '#ffd86b', 0.9],
  [-192, 22, -77, '#c0392b', 0.9],
  [197, 83, 48, '#c8951a', 0.9],
  [-166, 122, -28, '#ffd86b', 0.9],
  [-148, 79, 74, '#387440', 1],
  [-161, 111, -26, '#387440', 1],
  [-209, 79, 1, '#3062d4', 0.9],
  [177, 81, 11, '#c0392b', 0.9],
  [-141, 121, 66, '#c8951a', 0.9],
  [144, 130, -84, '#c8951a', 0.9],
  [192, 121, -25, '#3062d4', 0.9],
];

const money = (n) => Number(n).toLocaleString('en-US');
export const payLabel = (g) =>
  g.min && g.max
    ? `GH₵ ${money(g.min)} – ${money(g.max)} / month`
    : g.min
      ? `GH₵ ${money(g.min)}+ / month`
      : '';
export const goalHeading = (g) => (g.industry ? `${g.title} · ${g.industry}` : g.title);
/* Meta row of a goal card: the suitcase "Full-time" item only for full-time goals; globe for "Ghana or UK". */
export const goalMeta = (g) => [
  ...(g.type === 'Full-time job' ? [{ icon: 'Suitcase', text: 'Full-time' }] : []),
  ...(g.where ? [{ icon: g.where === 'Ghana or UK' ? 'Globe' : 'MarkerPin', text: g.where }] : []),
  ...(g.when ? [{ icon: 'Calendar', text: g.when }] : []),
];
export const goalTypeChip = (g) => (g.type && g.type !== 'Full-time job' ? g.type : null);
export const goalTileIcon = (g) =>
  g.type === 'Contract' ? 'Image' : g.type === 'Postgraduate study' ? 'Mortar' : 'Target';
export const goalPreviewLine = (g, primary) =>
  [
    primary ? 'Primary goal' : null,
    g.type === 'Full-time job' ? 'Full-time' : g.type,
    g.where,
    g.when ? g.when.replace(/^Within/, 'within') : null,
  ]
    .filter(Boolean)
    .join(' · ');

/*
 * Live profile mappers (signed-in talent). A goal is stored as a `desiredCareers` item:
 *   { careerName: title (or type), type: 'desired', source: 'user',
 *     metadata: { goalId, title, industry, type, where, when, notes, min, max } }
 * This screen owns only the user-sourced, non-'potential' items; system / guidance_tool / potential careers (Career Buddy,
 * onboarding) are written back untouched and in place. `careerGoals` is merged, so the Goals stage counts as done without
 * losing what other surfaces stored: shortTerm becomes a one-line summary of the primary goal only when it is empty or still
 * the summary this screen wrote last time; longTerm is kept; preferredIndustries is the union of the stored ones and the
 * goals' industries. With no goals left careerGoals is not written at all.
 */
const isOwnCareer = (c) =>
  Boolean(c) && c.type !== 'potential' && (!c.source || c.source === 'user');
const withoutVirtualId = (item) => {
  const { id: _virtual, ...rest } = item;
  return rest;
};
const careerKey = (c) => c?.metadata?.goalId || (c?._id ? String(c._id) : null);

export const goalsFromProfile = (profile) =>
  (Array.isArray(profile?.desiredCareers) ? profile.desiredCareers : [])
    .filter(isOwnCareer)
    .map((c, i) => {
      const m = c.metadata || {};
      return {
        ...EMPTY_GOAL,
        id: careerKey(c) || `goal-${i}`,
        title: m.title ?? c.careerName ?? '',
        industry: m.industry || '',
        type: m.type || '',
        where: m.where || '',
        when: m.when || '',
        notes: m.notes || '',
        min: m.min ?? null,
        max: m.max ?? null,
      };
    });

const goalSummary = (g) =>
  g
    ? [goalHeading(g), g.type, g.where, g.when].filter((s) => s && String(s).trim()).join(' · ')
    : '';

/* Whole-field write for PATCH /profiles/fields: { desiredCareers, careerGoals? }. `profile` = the last loaded profile. */
export const goalsToProfile = (goals, profile) => {
  const original = Array.isArray(profile?.desiredCareers) ? profile.desiredCareers : [];
  const byKey = new Map(original.filter(isOwnCareer).map((c) => [careerKey(c), c]));
  const own = goals.map((g) => {
    const prev = byKey.get(g.id);
    const base = prev ? withoutVirtualId(prev) : {};
    const title = (g.title || '').trim();
    return {
      ...base,
      careerName: title || g.type,
      type: 'desired',
      source: 'user',
      metadata: {
        ...(base.metadata || {}),
        goalId: g.id,
        title,
        industry: g.industry || '',
        type: g.type || '',
        where: g.where || '',
        when: g.when || '',
        notes: g.notes || '',
        min: g.min ?? null,
        max: g.max ?? null,
      },
    };
  });
  /* Goals fill the slots the user's careers held (in priority order); extra goals follow the last slot, spare slots go. */
  const desiredCareers = [];
  const ownSlots = original.filter(isOwnCareer).length;
  let used = 0;
  original.forEach((c) => {
    if (!isOwnCareer(c)) desiredCareers.push(withoutVirtualId(c));
    else {
      used += 1;
      if (used < ownSlots) {
        if (used <= own.length) desiredCareers.push(own[used - 1]);
      } else desiredCareers.push(...own.slice(used - 1));
    }
  });
  if (!ownSlots) desiredCareers.push(...own);
  if (!goals.length) return { desiredCareers };
  const stored = profile?.careerGoals || {};
  const lastSummary = goalSummary(goalsFromProfile(profile)[0]);
  const storedShort = typeof stored.shortTerm === 'string' ? stored.shortTerm.trim() : '';
  const careerGoals = {
    ...stored,
    shortTerm:
      !storedShort || storedShort === lastSummary ? goalSummary(goals[0]) : stored.shortTerm,
    preferredIndustries: [
      ...new Set(
        [
          ...(Array.isArray(stored.preferredIndustries) ? stored.preferredIndustries : []),
          ...goals.map((g) => g.industry),
        ]
          .map((i) => (typeof i === 'string' ? i.trim() : ''))
          .filter(Boolean)
      ),
    ],
  };
  return { desiredCareers, careerGoals };
};
