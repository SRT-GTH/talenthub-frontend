/*
 * Skills stage data (Engagement revamp, Figma canvas 3125:10352). Copy is VERBATIM from the SK-01..SK-04 nodes
 * (Focused 8285:22614 / 22787 / 23118 / 23511, Playful 7664:19446 / 19658 / 7665:2 / 7665:483). MOCK_SKILLS / DRAFT_DRAWN
 * are the signed-out demo seeds only; signed-in talents load and save their real skills through the mappers at the
 * bottom (skillsFromProfile / skillsToProfile). The Skills Lab hub copy (LAB_*) is still static.
 */

import endorserJavascript1 from '../../../../assets/engagement-v2/skills/endorser-javascript-1.png';
import endorserJavascript2 from '../../../../assets/engagement-v2/skills/endorser-javascript-2.png';
import endorserJavascript3 from '../../../../assets/engagement-v2/skills/endorser-javascript-3.png';
import endorserSql1 from '../../../../assets/engagement-v2/skills/endorser-sql-1.png';
import endorserSql2 from '../../../../assets/engagement-v2/skills/endorser-sql-2.png';
import endorserSql3 from '../../../../assets/engagement-v2/skills/endorser-sql-3.png';
import endorserPython1 from '../../../../assets/engagement-v2/skills/endorser-python-1.png';
import endorserPython2 from '../../../../assets/engagement-v2/skills/endorser-python-2.png';
import endorserPython3 from '../../../../assets/engagement-v2/skills/endorser-python-3.png';
import endorserExcel1 from '../../../../assets/engagement-v2/skills/endorser-excel-1.png';
import endorserExcel2 from '../../../../assets/engagement-v2/skills/endorser-excel-2.png';
import endorserExcel3 from '../../../../assets/engagement-v2/skills/endorser-excel-3.png';
import endorserFigma1 from '../../../../assets/engagement-v2/skills/endorser-figma-1.png';
import endorserFigma2 from '../../../../assets/engagement-v2/skills/endorser-figma-2.png';
import endorserFigma3 from '../../../../assets/engagement-v2/skills/endorser-figma-3.png';
import endorserTeam1 from '../../../../assets/engagement-v2/skills/endorser-team-1.png';
import endorserTeam2 from '../../../../assets/engagement-v2/skills/endorser-team-2.png';

/* Level scale (the proficiency guide + the add dialog's segmented control). `dots` = filled dots out of 4. */
export const SKILL_LEVELS = [
  { id: 'Beginner', dots: 1, hint: 'Learning the basics' },
  { id: 'Intermediate', dots: 2, hint: 'Use it regularly with some help' },
  { id: 'Advanced', dots: 3, hint: 'Work on your own, solve hard problems' },
  { id: 'Expert', dots: 4, hint: 'Can teach it and set standards' },
];
export const LEVEL_DOTS = Object.fromEntries(SKILL_LEVELS.map((l) => [l.id, l.dots]));

export const SKILL_CATEGORIES = [
  'Data & analytics',
  'Design & creative',
  'Engineering',
  'Leadership',
  'Marketing',
  'Product',
  'Research',
  'Communication',
];

/*
 * The talent's skills (SK-02). `icon` = tile glyph key (see skillsIcons.jsx), `verified` + `verifiedOn` for lab-verified ones,
 * `labId` = the Skills Lab lab that verifies it (/skills-lab/lab/<labId>/play), `endorsers` = face images (only the faces
 * exported from Figma are present; the count text always comes from `endorsements`), `highlight` = the one whose
 * "Verify in Lab" button is the filled primary (Python, the lab named in the nudge).
 */
export const MOCK_SKILLS = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'function',
    level: 'Intermediate',
    category: 'Engineering',
    verified: true,
    verifiedOn: '2 Oct',
    labId: 'javascript',
    endorsements: 12,
    endorsers: [endorserJavascript1, endorserJavascript2, endorserJavascript3],
  },
  {
    id: 'sql',
    name: 'SQL',
    icon: 'dns',
    level: 'Advanced',
    category: 'Data & analytics',
    verified: true,
    verifiedOn: '2 Oct',
    labId: 'sql',
    endorsements: 9,
    endorsers: [endorserSql1, endorserSql2, endorserSql3],
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'function',
    level: 'Advanced',
    category: 'Engineering',
    verified: false,
    labId: 'python',
    highlight: true,
    endorsements: 7,
    endorsers: [endorserPython1, endorserPython2, endorserPython3],
  },
  {
    id: 'excel',
    name: 'Excel / Google Sheets',
    icon: 'view-table',
    level: 'Advanced',
    category: 'Data & analytics',
    verified: false,
    labId: 'excel-and-google-sheets',
    endorsements: 5,
    endorsers: [endorserExcel1, endorserExcel2, endorserExcel3],
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: 'image',
    level: 'Intermediate',
    category: 'Design & creative',
    verified: false,
    labId: 'ui-ux-design',
    endorsements: 3,
    endorsers: [endorserFigma1, endorserFigma2, endorserFigma3],
  },
  {
    id: 'team-leadership',
    name: 'Team leadership',
    icon: 'users',
    level: 'Intermediate',
    category: 'Leadership',
    verified: false,
    labId: 'team-leadership',
    endorsements: 2,
    endorsers: [endorserTeam1, endorserTeam2],
  },
];

/* Frame values of the filled "Add a skill" dialog (SK-03). */
export const DRAFT_DRAWN = {
  name: 'Tableau',
  level: 'Intermediate',
  category: 'Data & analytics',
  usedIn: '',
};
export const DRAFT_BLANK = {
  name: '',
  level: 'Intermediate',
  category: 'Data & analytics',
  usedIn: '',
};

/* Skills Lab hub as seen inside the engagement flow (SK-04). `status`: ready | verified | explore. */
export const LAB_HERO = {
  eyebrow: 'SKILLS LAB',
  title: 'Prove it. Earn the badge.',
  body: 'Short, practical challenges. Pass one and the Verified badge goes on that skill. Retake any time; your best score counts.',
  stats: ['2 verified', '4 ready from your skills', '240 XP', '7-day streak'],
  sticker: 'NEW: STRATEGIC THINKING',
};

export const LAB_ROWS = [
  {
    heading: 'FROM YOUR SKILLS',
    labs: [
      {
        id: 'python',
        icon: 'function',
        status: 'ready',
        title: 'Python',
        meta: '8 challenges · ~10 min · pass 6 of 8',
        text: 'Read code and predict the output: sets, loops, comprehensions, errors.',
      },
      {
        id: 'excel-and-google-sheets',
        icon: 'view-table',
        status: 'ready',
        title: 'Excel / Google Sheets',
        meta: '6 challenges · ~8 min · pass 5 of 6',
        text: 'Formulas, lookups and pivot tables on a real sales sheet.',
      },
      {
        id: 'ui-ux-design',
        icon: 'image',
        status: 'ready',
        title: 'UI/UX design',
        meta: '6 challenges · ~8 min · pass 5 of 6',
        text: 'Colour, hierarchy and layout choices for real product screens.',
      },
      {
        id: 'team-leadership',
        icon: 'users',
        status: 'ready',
        title: 'Team leadership',
        meta: '5 challenges · ~6 min · pass 4 of 5',
        text: 'What would you do? Workplace scenarios from Ghanaian teams.',
      },
      {
        id: 'javascript',
        icon: 'function',
        status: 'verified',
        score: '7/8',
        title: 'JavaScript',
        meta: '8 challenges · ~10 min · pass 6 of 8',
        text: 'Verified on 2 Oct. Retake to improve your score.',
      },
      {
        id: 'sql',
        icon: 'dns',
        status: 'verified',
        score: '8/8',
        title: 'SQL',
        meta: '8 challenges · ~10 min · pass 6 of 8',
        text: 'Verified on 2 Oct. Perfect score.',
      },
    ],
  },
  {
    heading: 'EXPLORE MORE LABS',
    labs: [
      {
        id: 'data-analysis',
        icon: 'chart-bar',
        status: 'explore',
        title: 'Data analysis',
        meta: '6 challenges · ~8 min · pass 5 of 6',
        text: 'Read charts, spot anomalies and pick the right conclusion.',
      },
      {
        id: 'engineering-planning',
        icon: 'calendar',
        status: 'explore',
        title: 'Engineering planning',
        meta: '6 challenges · ~8 min · pass 5 of 6',
        text: 'Order tasks, spot dependencies and plan a release.',
      },
      {
        id: 'product-management',
        icon: 'target',
        status: 'explore',
        title: 'Product management',
        meta: '6 challenges · ~8 min · pass 5 of 6',
        text: 'Prioritise features with real numbers and trade-offs.',
      },
      {
        id: 'public-speaking',
        icon: 'mic',
        status: 'explore',
        title: 'Public speaking',
        meta: '6 challenges · ~8 min · pass 5 of 6',
        text: 'Build openings and structure a persuasive message.',
      },
      {
        id: 'strategic-thinking',
        icon: 'compass',
        status: 'explore',
        title: 'Strategic thinking',
        meta: '5 challenges · ~6 min · pass 4 of 5',
        text: 'Chess puzzles: spot the weak point and commit to the move.',
      },
    ],
  },
];

export const LAB_STATUS_LABEL = { ready: 'Ready to verify', explore: 'Not in your skills yet' };

export const GAMES_HEAD = {
  heading: 'PLAY IT INSTEAD',
  chip: 'NEW · 10 GAMES',
  text: 'Same Verified badge, earned by playing. Pick a game for one of your skills.',
};

/* Game ids shown (order as drawn); the card data (copy, cover art, statuses) comes from the Skills Lab games catalogue. */
export const LAB_GAME_IDS = [
  'bug-hunt',
  'sql-heist',
  'formula-rush',
  'chart-detective',
  'pixel-perfect',
  'sprint-stack',
  'feature-frenzy',
  'pitch-in-60',
  'crisis-room',
  'chess-blitz',
];

export const LAB_FOOTER = {
  back: 'Back to my skills',
  note: 'Failing a lab never shows on your card. Only passes do.',
};

/* Empty state + legend copy (SK-01..03). */
export const SKILLS_COPY = {
  eyebrow: 'SKILLS',
  body: 'Add the skills you use and set your level honestly. Verify your top ones in Skills Lab to earn the Verified badge recruiters look for.',
  legendTitle: 'Two kinds of skills on your card',
  legendVerified: 'Passed in Skills Lab. Shown first.',
  legendSelf: 'Added by you. Still counts.',
  guideTitle: 'Pick your level honestly',
  emptyBody:
    'Start with the tools you use most. You can add as many as you like and verify the important ones later.',
  steps: [
    {
      icon: 'plus',
      title: '1. Add a skill',
      text: 'Name it, pick your level and where you used it.',
    },
    {
      icon: 'game',
      title: '2. Verify in Skills Lab',
      text: 'Pass a short challenge to earn the Verified badge.',
    },
    {
      icon: 'thumb-up',
      title: '3. Get endorsed',
      text: 'People you’ve worked with on GTH can vouch for you.',
    },
  ],
  nudgeTitle: 'Python is ready to verify',
  nudgeText:
    '8 challenges · about 10 min · pass 6 of 8 to earn the Verified badge. Retake any time.',
  endorseTitle: 'Get more endorsements',
  endorseText:
    'People you’ve worked with on GTH can endorse a skill. Their faces show next to it on your card.',
};

/* Playful-only stickers (genz:sticker nodes). */
export const STICKERS = {
  stage: 'STAGE 4 · LET’S GO',
  progress: '2 VERIFIED · 4 TO GO',
  xp: '+80 XP',
};

/*
 * Live profile <-> skill rows (signed-in talents). The profile keeps two lists, technicalSkills and softSkills, each
 * [{ name, proficiency: Beginner|Intermediate|Advanced|Expert, yearsOfExperience }]. Rows loaded from the profile keep
 * their original item in `source`, so `_id` and fields this screen does not edit (yearsOfExperience, anything Skills Lab
 * or Career Buddy wrote) are written back unchanged. Skills added here go to softSkills when their category is a people
 * skill (SOFT_CATEGORIES), else technicalSkills. Category / "where you used it" have no profile slot and are not saved;
 * rows loaded from the profile show "Technical skill" / "Soft skill" instead. Verified badges and endorsements are not
 * in the profile yet, so live rows are always self-reported with no endorsers.
 */
export const SOFT_CATEGORIES = ['Leadership', 'Communication'];
const KIND_LABEL = { technical: 'Technical skill', soft: 'Soft skill' };
const LEVEL_IDS = SKILL_LEVELS.map((l) => l.id);
const LAB_BY_KEY = Object.fromEntries(
  LAB_ROWS.flatMap((row) => row.labs).flatMap((lab) => [
    [lab.id, lab.id],
    [lab.title.toLowerCase(), lab.id],
  ])
);
const slug = (name) =>
  String(name || '')
    .toLowerCase()
    .replace(/\W+/g, '-')
    .replace(/^-|-$/g, '');
const labFor = (name) =>
  LAB_BY_KEY[String(name || '').toLowerCase()] || LAB_BY_KEY[slug(name)] || null;

export const kindForCategory = (category) =>
  SOFT_CATEGORIES.includes(category) ? 'soft' : 'technical';

/* A new row from the "Add a skill" dialog (same shape the demo always built, plus `kind` / `labId`). */
export const skillFromDraft = (draft, index) => ({
  id: `${slug(draft.name)}-${index}`,
  name: draft.name,
  icon: 'function',
  level: draft.level,
  category: draft.category,
  usedIn: draft.usedIn,
  kind: kindForCategory(draft.category),
  labId: labFor(draft.name),
  verified: false,
  endorsements: 0,
  endorsers: [],
});

const rowFromItem = (item, kind, i) => ({
  id: String(item?._id ?? item?.id ?? `${kind}-${i}`),
  name: item?.name || '',
  icon: kind === 'soft' ? 'users' : 'function',
  level: LEVEL_IDS.includes(item?.proficiency) ? item.proficiency : null,
  category: KIND_LABEL[kind],
  kind,
  labId: labFor(item?.name),
  verified: false,
  endorsements: 0,
  endorsers: [],
  source: item,
});

export const skillsFromProfile = (profile) => [
  ...(Array.isArray(profile?.technicalSkills) ? profile.technicalSkills : []).map((it, i) =>
    rowFromItem(it, 'technical', i)
  ),
  ...(Array.isArray(profile?.softSkills) ? profile.softSkills : []).map((it, i) =>
    rowFromItem(it, 'soft', i)
  ),
];

/* Original item (minus the `id` virtual the API echoes) with the edited name / level on top. */
const itemFromRow = (row) => {
  const out = { ...(row.source && typeof row.source === 'object' ? row.source : {}) };
  delete out.id;
  out.name = row.name;
  if (row.level) out.proficiency = row.level;
  return out;
};

export const skillsToProfile = (rows) => ({
  technicalSkills: rows.filter((r) => r.kind !== 'soft').map(itemFromRow),
  softSkills: rows.filter((r) => r.kind === 'soft').map(itemFromRow),
});

/*
 * After a save, give the local rows the server's items (new ones get their `_id` via `source`; the local `id` never
 * changes) without losing the category / where
 * used picked this session: each list was written whole and in order, so the n-th row of a kind <-> the n-th item of
 * that list. Falls back to a fresh mapping when the counts differ (another surface changed the lists meanwhile).
 */
export const mergeSavedSkills = (rows, profile) => {
  const fresh = skillsFromProfile(profile);
  const byKind = (list, kind) => list.filter((r) => (r.kind === 'soft') === (kind === 'soft'));
  if (
    byKind(fresh, 'soft').length !== byKind(rows, 'soft').length ||
    byKind(fresh, 'technical').length !== byKind(rows, 'technical').length
  ) {
    return fresh;
  }
  const queues = { soft: byKind(fresh, 'soft'), technical: byKind(fresh, 'technical') };
  return rows.map((r) => {
    const match = queues[r.kind === 'soft' ? 'soft' : 'technical'].shift();
    return { ...r, source: match.source };
  });
};
