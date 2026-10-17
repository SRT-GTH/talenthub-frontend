/*
 * talentHomeTabsData.js — mock content for the Talent home tab bodies (Tabs agent).
 * Frames (Playful / Focused): HM-06 MyAssessment 7741:3318 / 8097:8194, HM-07 Recruiter
 * activity 7742:3439 / 8097:8716, HM-08 Global search 7748:2357 / 8097:9162, HM-05 Edit home
 * 7747:206563 / 8097:9899. Every string is copied from Figma `characters`.
 * Shaped so an API can replace each export (same keys); `xp` strings differ per style
 * (Focused "pts", Playful "XP") — see `pts`.
 */

import photo0 from '../../../assets/talent-home/tabs/recruiter-ama-owusu-photo.png';
import photo1 from '../../../assets/talent-home/tabs/recruiter-abena-asante-photo.png';
import photo2 from '../../../assets/talent-home/tabs/recruiter-kwame-boateng-photo.png';
import photo3 from '../../../assets/talent-home/tabs/recruiter-efua-acheampong-photo.png';
import photo4 from '../../../assets/talent-home/tabs/recruiter-yaw-darko-photo.png';
import photo5 from '../../../assets/talent-home/tabs/recruiter-kojo-owusu-ansah-photo.png';
import person from '../../../assets/talent-home/tabs/search-person-kwesi-mensah-photo.png';

/* ---------------- Home tabs (Overview | MyAssessment | Recruiter activity) ---------------- */

export const HOME_TABS = [
  { id: 'home', label: 'Overview', chip: null },
  { id: 'assessment', label: 'MyAssessment', chip: '3 of 4' },
  { id: 'recruiter', label: 'Recruiter activity', chip: '5 new' },
];

/* ---------------- MyAssessment (HM-06) ---------------- */

export const ASSESSMENT_SUMMARY = {
  done: '3',
  doneLabel: 'OF 4 DONE',
  title: 'Assessment profile: strong foundation',
  body: 'Personality, skills and Skills Lab games are done. Finish the full assessment to reach 4 of 4.',
  chips: ['Personality', 'Skills', 'Skills Lab games'],
  pending: 'Full assessment',
  cta: 'Preview recruiter view',
};

export const PERSONALITY = {
  title: 'Personality',
  status: 'Completed',
  lead: 'You’re ',
  type: 'The Architect.',
  sub: '1 of 9 archetypes · strategic and systematic',
  body: 'You plan before you build, spot risks early and like clear structure. Teams lean on you when things get complicated.',
  affinityLabel: 'Career affinity',
  affinity: ['Technology', 'Fintech', 'Product', 'Systems design', 'Research'],
  // pct = bar fill (Figma widths 369.6/420 etc.); `strong` = green percentile text (Focused);
  // `gradient` = Playful gradient bar (first four traits only, as drawn).
  traits: [
    { name: 'Conscientiousness', label: '88th percentile', pct: 88, strong: true, gradient: true },
    { name: 'Decisiveness', label: '79th percentile', pct: 79, strong: true, gradient: true },
    { name: 'Openness', label: '72th percentile', pct: 72, strong: true, gradient: true },
    {
      name: 'Emotional stability',
      label: '70th percentile',
      pct: 70,
      strong: true,
      gradient: true,
    },
    { name: 'Agreeableness', label: '64th percentile', pct: 64, strong: false, gradient: false },
    { name: 'Extraversion', label: '41th percentile', pct: 41, strong: false, gradient: false },
  ],
  lock: 'Results are system-generated and can’t be edited. You can retake the quiz in 72 days.',
};

export const EVIDENCE_KINDS = {
  assessment: { id: 'assessment', label: 'Assessment-evidenced' },
  game: { id: 'game', label: 'Game-evidenced' },
  ai: { id: 'ai', label: 'AI-validated in chat' },
  self: { id: 'self', label: 'Self-reported' },
};

export const SKILLS_EVIDENCE = {
  title: 'Skills evidence',
  count: '9 skills · 7 verified',
  intro: 'How each skill was proven. Recruiters see the same labels.',
  skills: [
    { name: 'React', level: 'Advanced · 2+ years', evidence: 'game' },
    { name: 'Data Analytics', level: 'Intermediate · Google certificate', evidence: 'assessment' },
    { name: 'Python', level: 'Intermediate · 1 year', evidence: 'game' },
    { name: 'Figma and UI design', level: 'Intermediate', evidence: 'ai' },
    { name: 'TypeScript', level: 'Intermediate', evidence: 'self' },
    { name: 'Firebase', level: 'Intermediate', evidence: 'game' },
  ],
  more: '3 more skills',
  manage: 'Manage skills',
};

// `pts` is the points unit: Focused frames say "pts", Playful frames say "XP".
export const NEXT_ASSESSMENT = {
  title: 'Take the TypeScript assessment',
  meta: (unit) => `About 20 minutes · +40 ${unit}`,
  body: 'Moves TypeScript from Self-reported to Assessment-evidenced, the strongest label on GTH. It also closes your top readiness gap.',
  cta: 'Start assessment',
  sticker: 'BIGGEST BOOST',
};

export const EVIDENCE_LEGEND = {
  title: 'What the labels mean',
  items: [
    { kind: 'assessment', note: 'Passed a GTH assessment. Strongest.' },
    { kind: 'game', note: 'Proven in a Skills Lab challenge.' },
    { kind: 'ai', note: 'Checked by Career Buddy in conversation.' },
    { kind: 'self', note: 'Added by you. Not yet proven.' },
  ],
};

export const SKILLS_LAB = {
  title: 'Skills Lab',
  more: 'Play more',
  games: [
    { name: 'React Speedrun', when: '8 May · 22 min', score: 91, top: 'Top 11%', strong: true },
    {
      name: 'Design Thinking Sprint',
      when: '28 Apr · 15 min',
      score: 88,
      top: 'Top 18%',
      strong: true,
    },
    { name: 'Python Lab', when: '12 May · 18 min', score: 84, top: 'Top 23%', strong: false },
    { name: 'Leadership Chess', when: '3 May · 12 min', score: 76, top: 'Top 38%', strong: false },
  ],
};

/* ---------------- Recruiter activity (HM-07) ---------------- */

export const RECRUITER_FEED = {
  title: 'All recruiter activity',
  range: 'Last 7 days',
  filters: [
    { id: 'all', label: 'All', count: 6 },
    { id: 'viewed', label: 'Viewed', count: 3 },
    { id: 'messaged', label: 'Messaged', count: 1 },
    { id: 'shortlisted', label: 'Shortlisted', count: 1 },
    { id: 'applied', label: 'Applied roles', count: 1 },
  ],
  // kind: eye (viewed) | chat (messaged) | heart (shortlisted) | suitcase (applied)
  items: [
    {
      id: 'ama',
      name: 'Ama Owusu',
      role: 'Talent Lead · Hubtel',
      text: 'Viewed your full profile and spent 4 min on Accra Bus Tracker',
      when: '2 hours ago · Accra',
      tag: 'Frontend Engineer',
      kind: 'eye',
      filter: 'viewed',
      photo: photo0,
    },
    {
      id: 'abena',
      name: 'Abena Asante',
      role: 'HR · Farmerline',
      text: 'Sent you a message: “Hi Kofi, I came across your profile and think you’d be a great fit…”',
      when: 'Yesterday · Remote-first',
      tag: 'Frontend Developer',
      kind: 'chat',
      filter: 'messaged',
      photo: photo1,
      highlight: true,
      action: 'Reply',
      sticker: 'NEW MESSAGE',
    },
    {
      id: 'kwame',
      name: 'Kwame Boateng',
      role: 'Recruiter · MTN Ghana',
      text: 'Saved you to their React Developer shortlist',
      when: '3 days ago · Accra',
      tag: 'React Developer',
      kind: 'heart',
      filter: 'shortlisted',
      photo: photo2,
      action: 'View role',
      secondary: true,
    },
    {
      id: 'efua',
      name: 'Efua Acheampong',
      role: 'HR Lead · Telecel Ghana',
      text: 'Viewed your MyAssessment, mostly your personality result',
      when: '5 days ago · Accra',
      tag: 'UI Engineer',
      kind: 'eye',
      filter: 'viewed',
      photo: photo3,
    },
    {
      id: 'yaw',
      name: 'Yaw Darko',
      role: 'Engineering Manager · Zeepay',
      text: 'Opened your application and watched your pitch',
      when: '5 days ago · Accra',
      tag: 'Frontend Engineer',
      kind: 'suitcase',
      filter: 'applied',
      photo: photo4,
      action: 'View application',
      secondary: true,
    },
    {
      id: 'kojo',
      name: 'Kojo Owusu-Ansah',
      role: 'Recruiter · Melcom Group',
      text: 'Viewed your profile',
      when: '6 days ago · Accra',
      tag: 'Frontend Developer',
      kind: 'eye',
      filter: 'viewed',
      photo: photo5,
    },
  ],
};

export const THIS_WEEK = {
  title: 'This week',
  stats: [
    { value: '47', label: 'Profile views', note: '+38% vs last week', tone: 'white' },
    { value: '5', label: 'Recruiters', note: '2 from fintech', tone: 'white' },
    { value: '1', label: 'Shortlist', note: 'MTN Ghana', tone: 'gold' },
    { value: '3', label: 'Messages', note: '2 unread', tone: 'mint' },
  ],
  footer: 'Most viewed: Accra Bus Tracker, your pitch, React skill',
};

export const VISIBILITY = {
  title: 'Who can see you',
  settings: [
    {
      id: 'open',
      title: 'Open to opportunities',
      hint: 'Recruiters see a green badge on your profile',
      on: true,
    },
    {
      id: 'verified-only',
      title: 'Messages from verified recruiters only',
      hint: 'Unverified accounts can’t contact you',
      on: true,
    },
    {
      id: 'hide-employer',
      title: 'Hide me from my current employer',
      hint: 'Hubtel recruiters won’t see your profile',
      on: false,
    },
  ],
};

export const BUDDY_TIP =
  'Replies within 24 hours get far more interviews. Abena from Farmerline is waiting.';

/* ---------------- Global search (HM-08) ---------------- */

export const SEARCH_CATEGORIES = [
  { id: 'all', label: 'All', count: 38 },
  { id: 'roles', label: 'Roles', count: 24 },
  { id: 'skills', label: 'Skills', count: 3 },
  { id: 'people', label: 'People', count: 5 },
  { id: 'communities', label: 'Communities', count: 2 },
  { id: 'learning', label: 'Learning', count: 4 },
];

export const SEARCH_ASK = {
  title: 'Ask Career Buddy: “react roles in Accra that fit me”',
  sub: 'Get a ranked answer with reasons',
  key: 'Tab',
};

export const SEARCH_GROUPS = [
  {
    id: 'roles',
    heading: 'ROLES · 24',
    rows: [
      {
        id: 'zeepay',
        parts: [{ text: 'React', hl: true }, { text: ' Developer · Zeepay' }],
        sub: 'Accra · On-site · GHS 8–11k',
        chip: '93% match',
        icon: 'wallet',
        hint: 'Enter to open',
      },
      {
        id: 'hubtel',
        parts: [
          { text: 'Frontend Engineer (' },
          { text: 'React', hl: true },
          { text: ') · Hubtel' },
        ],
        sub: 'Accra · Hybrid · GHS 9–13k',
        chip: '96% match',
        icon: 'wallet',
      },
    ],
  },
  {
    id: 'skills',
    heading: 'SKILLS · 3',
    rows: [
      {
        id: 'react',
        parts: [{ text: 'React', hl: true }],
        sub: 'Verified · Game-evidenced',
        chip: 'Your skill',
        icon: 'function',
      },
    ],
  },
  {
    id: 'people',
    heading: 'PEOPLE · 5',
    rows: [
      {
        id: 'kwesi',
        parts: [{ text: 'Kwesi Mensah' }],
        sub: 'Team lead · endorsed your React skill',
        photo: person,
      },
    ],
  },
];

export const SEARCH_HINTS = [
  { key: '↑ ↓', label: 'to move' },
  { key: 'Enter', label: 'to open' },
  { key: 'Esc', label: 'to close' },
];

export const SEARCH_SEE_ALL = 'See all 38 results';

/* ---------------- Edit home (HM-05) ---------------- */

export const EDIT_BANNER = {
  title: 'Editing your home',
  body: 'Drag cards to reorder. Hide what you don’t use. Only you see this layout.',
  reset: 'Reset to default',
  done: 'Done',
};

/*
 * Home cards that can be reordered / hidden. `state`: shown | hidden (ghost in place, "Show")
 * | available (lives only in the "Add a card" tray). Order = on-page order. `section` splits
 * the main grid from "More for you". Labels are the Figma card titles.
 */
export const DEFAULT_HOME_CARDS = [
  { id: 'matched', label: 'Matched to you', section: 'main', state: 'shown' },
  { id: 'applications', label: 'My applications', section: 'main', state: 'shown' },
  { id: 'recent-activity', label: 'Recent activity', section: 'main', state: 'shown' },
  { id: 'career-buddy', label: 'Career Buddy', section: 'main', state: 'shown' },
  { id: 'streak', label: '12-day streak', section: 'main', state: 'shown' },
  { id: 'job-readiness', label: 'Job readiness', section: 'main', state: 'shown' },
  { id: 'recruiter-activity', label: 'Recruiter activity', section: 'main', state: 'shown' },
  { id: 'my-learning', label: 'My learning', section: 'more', state: 'shown' },
  { id: 'saved-roles', label: 'Saved roles', section: 'more', state: 'shown' },
  { id: 'evaluations', label: 'Evaluations', section: 'more', state: 'shown' },
  { id: 'community', label: 'Community', section: 'more', state: 'shown' },
  { id: 'badges', label: 'Badges', section: 'more', state: 'shown' },
  { id: 'verified-skills', label: 'Verified skills', section: 'more', state: 'available' },
  { id: 'personality', label: 'Personality', section: 'more', state: 'available' },
  {
    id: 'profile-completeness',
    label: 'Profile completeness',
    section: 'more',
    state: 'available',
  },
];

export const ADD_CARD_TRAY = {
  title: 'Add a card',
  note: (n) => `${n} available · hidden cards also appear here`,
  items: {
    'verified-skills': { sub: '7 verified', icon: 'shield' },
    personality: { sub: 'The Architect', icon: 'bulb' },
    'profile-completeness': { sub: 'Keep it at 100%', icon: 'chart' },
  },
};

export const EDIT_CHROME = {
  hiddenChip: 'Hidden from your home',
  drag: 'Drag',
  hide: 'Hide',
  show: 'Show',
  moving: 'Moving…',
};
