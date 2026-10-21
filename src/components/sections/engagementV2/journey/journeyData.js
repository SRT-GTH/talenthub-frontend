/*
 * Journey hub mock data (Figma J-01 … J-07). API-shaped, frontend-only: swap `JOURNEY_PROGRESS` for the API later.
 * Copy is verbatim from the node `characters`; positions are the stage-node circle centres in the 1112x1140 map frame
 * (frame-relative: absolute Figma x - 64, y - 350).
 */
import { ENGAGEMENT_STAGES } from '../../engagementShell/engagementShellData.js';

export const MAP_W = 1112;
export const MAP_H = 1140;

/* Road order: the nine stages with the three milestones in between (Figma J-01 map). */
export const JOURNEY_NODES = [
  { kind: 'stage', id: 'avatar', cx: 170, cy: 190 },
  { kind: 'stage', id: 'interests', cx: 400, cy: 160 },
  { kind: 'stage', id: 'personality', cx: 630, cy: 210 },
  { kind: 'milestone', id: 'm1', n: 1, cx: 860, cy: 300 },
  { kind: 'stage', id: 'skills', cx: 800, cy: 540 },
  { kind: 'stage', id: 'work', cx: 560, cy: 580 },
  { kind: 'stage', id: 'portfolio', cx: 320, cy: 540 },
  { kind: 'milestone', id: 'm2', n: 2, cx: 150, cy: 650 },
  { kind: 'stage', id: 'certs', cx: 330, cy: 900 },
  { kind: 'stage', id: 'goals', cx: 580, cy: 930 },
  { kind: 'stage', id: 'pitch', cx: 820, cy: 900 },
  { kind: 'milestone', id: 'm3', n: 3, cx: 990, cy: 1010 },
];

/* Region pills (top-left, frame-relative) + the stages each one counts. */
export const REGIONS = [
  {
    id: 'tamale',
    name: 'TAMALE',
    tag: 'Your identity',
    x: 24,
    y: 24,
    stages: ['avatar', 'interests', 'personality'],
  },
  {
    id: 'kumasi',
    name: 'KUMASI',
    tag: 'Your skills',
    x: 24,
    y: 422,
    stages: ['skills', 'work', 'portfolio'],
  },
  {
    id: 'accra',
    name: 'ACCRA',
    tag: 'Your story',
    x: 874,
    y: 772,
    stages: ['certs', 'goals', 'pitch'],
  },
];
export const REGION_LINES = [440, 790];

/* Avatar standing spot (frame-relative top-left of the 101x150 avatar) for the states Figma draws. */
export const AVATAR_SPOTS = {
  1: { x: 462, y: 50 },
  3: { x: 862, y: 430 },
  6: { x: 392, y: 790 },
  9: { x: 939, y: 816 },
};

/* Per-stage copy that Figma draws. `eta` = minutes in "Stage n · ~x min". */
export const STAGE_COPY = {
  avatar: {},
  interests: {
    eta: 2,
    upNext:
      'Pick the fields and causes you care about. Recruiters filter by these, and we use them to suggest communities and courses.',
  },
  personality: { eta: 6 },
  skills: {
    eta: 6,
    upNext:
      'Add the tools and skills you use. Verified skills match you to jobs faster, and they count towards Top 20%.',
    tooltip: {
      about: 'about 6 min',
      text: 'Add the tools and skills you use. Verified skills match you to jobs faster.',
      counts: 'Counts towards Top 20%',
      action: 'Start Skills',
    },
  },
  work: { eta: 5 },
  portfolio: { eta: 8 },
  certs: {
    eta: 4,
    upNext:
      'Add certificates and courses. Anything you finished on GTH is added and verified for you.',
  },
  goals: { eta: 3 },
  pitch: { eta: 6 },
};

/* Mock saved progress for a stage that is "in progress" (only Interests is drawn that way). */
export const JOURNEY_PROGRESS = {
  interests: { picked: 3, of: 6, minutesLeft: 2 },
};

export const MILESTONES = [
  {
    n: 1,
    id: 'm1',
    label: 'Discoverable',
    at: 3,
    blurb: 'Recruiters can find and message you',
    bonus: '+50',
    toast: 'Discoverable unlocked · +50 pts · badge added to your card',
    toastPlayful: 'Discoverable unlocked · +50 XP · badge added to your card',
  },
  {
    n: 2,
    id: 'm2',
    label: 'Top 20%',
    at: 6,
    blurb: 'Badge on your card, boosted search, leaderboards',
    bonus: '+100',
  },
  {
    n: 3,
    id: 'm3',
    label: 'Top Talent',
    at: 9,
    blurb: 'Priority outreach, exclusive roles, mentor intros',
    bonus: '+200',
  },
];

export const STAGE_IDS = ENGAGEMENT_STAGES.map((s) => s.id);

/* Celebration modals (J-04 / J-06 / J-07). `lead` = ink part of the title, `accent` = green part. */
export const MILESTONE_MODALS = {
  1: {
    eyebrow: 'MILESTONE 1 OF 3 UNLOCKED',
    lead: 'You’re ',
    accent: 'discoverable.',
    body: 'Your card is now live in recruiter search. Employers looking for your interests can find you, view your avatar and personality, and message you.',
    stats: { done: '3/9', profile: '33%', bonus: '+50', bonusPlayful: '+50 XP' },
    benefits: [
      {
        icon: 'search',
        title: 'You show up in recruiter search',
        text: 'Recruiters filtering by your interests and location will see your card.',
      },
      {
        icon: 'message',
        title: 'Recruiters can message you',
        text: 'You’ll get a notification. Reply only when you want to.',
      },
      {
        icon: 'shield',
        title: 'You stay in control',
        text: 'Hide your card or pause messages any time in Privacy settings.',
      },
    ],
    next: { label: 'Next: Top 20% · 3 more stages', icon: 'trophy', bar: 190 },
    share: 'Share it',
    primary: { label: 'Keep going: Skills', to: '/profile/filling/skills' },
  },
  2: {
    eyebrow: 'MILESTONE 2 OF 3 UNLOCKED',
    lead: '',
    accent: 'Top 20%',
    tail: ' profile.',
    body: 'Only one in five GTH profiles gets here. Your card now carries the Top 20% badge, and you rank higher when recruiters search.',
    stats: { done: '6/9', profile: '67%', bonus: '+100', bonusPlayful: '+100 XP' },
    benefits: [
      {
        icon: 'star',
        title: 'Top 20% badge on your card',
        text: 'Every recruiter who finds you sees it.',
      },
      {
        icon: 'trendUp',
        title: 'Higher in recruiter search',
        text: 'Badge holders are shown before profiles without it.',
      },
      {
        icon: 'chartBar',
        title: 'Leaderboards and portfolio views',
        text: 'See how you rank in Accra and which projects recruiters open.',
      },
    ],
    next: { label: 'Next: Top Talent · 3 more stages', icon: 'diamond', bar: 253 },
    share: 'Share it',
    primary: { label: 'Keep going: Certs', to: '/profile/filling/certs' },
  },
  3: {
    eyebrow: 'MILESTONE 3 OF 3 UNLOCKED',
    lead: 'You’re ',
    accent: 'Top Talent.',
    body: 'All nine stages done. You’re now in the pool recruiters see first, and your full card is ready to share.',
    stats: { done: '9/9', profile: '100%', bonus: '+200', bonusPlayful: '+200 XP' },
    benefits: [
      {
        icon: 'trendUp',
        title: 'Seen first in search',
        text: 'When your skills match, your card shows at the top.',
      },
      {
        icon: 'company',
        title: 'Exclusive roles',
        text: 'Roles that employers only share with Top Talent profiles.',
      },
      {
        icon: 'users',
        title: 'Mentor introductions',
        text: 'Meet professionals in your field who mentor on GTH.',
      },
    ],
    next: null,
    share: 'Share my card',
    primary: { label: 'Go to my dashboard', to: '/home' },
  },
};

/* "How would you like to add your details" (J-03). */
export const MODE_PICKER = {
  chip: 'Information Entry Category',
  title: 'How would you like to add \nyour details',
  lede: 'Three ways to do this — pick whatever feels right today. You can switch anytime, mix-and-match, or come back later. Nothing’s locked in.',
  note: 'Don’t worry you can mix and match. Upload a CV, then add freelance gigs by chat, then edit a date manually.',
  cards: [
    {
      id: 'type',
      badge: '~3 min ',
      title: 'Fill it in myself',
      text: 'Enter each role one at a time. Full control, no surprises.',
      action: 'Start Typing',
      icon: 'pencil',
    },
    {
      id: 'chat',
      badge: '~5 min · feels like a chat',
      title: 'Chat with Career AI ',
      text: 'Career Buddy asks, you answer, she fills the form.',
      action: 'Say Hi to Career Buddy',
      icon: 'ai',
      popular: 'Most popular',
    },
    {
      id: 'cv',
      badge: '~30 sec to confirm',
      title: 'Upload my CV',
      text: 'Drop your CV; we’ll extract roles, dates, education, and skills for your review.',
      action: 'Drop File',
      icon: 'upload',
    },
  ],
};

/* Rail + hero copy. */
export const COPY = {
  eyebrow: 'PROFILE JOURNEY',
  titleLead: 'Your profile, ',
  titleAccent: 'your way.',
  sub: 'Nine stages, any order. Nothing is locked: every stage you finish makes your card stronger. Most people finish in about 45 minutes across a few sittings.',
  subDone:
    'All nine stages done. Your card is complete and you’re in the Top Talent pool. Edit any stage whenever you like.',
  buddyName: 'Career Buddy',
  buddyTag: 'Your AI guide',
  buddyMsg:
    'Rather talk than type? Tell me about yourself and I’ll fill in your stages. You check everything before it goes live.',
  buddyMsgDone:
    'Nice work, Kofi. Want me to polish your pitch or suggest roles that fit your new profile?',
  buddyBtn: 'Chat with Career Buddy',
  otherStage: 'Or pick any other stage on the map',
  milestonesTitle: 'Milestones',
  milestonesSub: 'Unlock them as you go',
  milestonesSubDone: 'All three unlocked',
  checks: ['Auto-saved', 'Nothing is locked', 'Edit any time'],
  finishLater: 'Finish later and go to my dashboard',
  gulf: 'GULF OF GUINEA',
  allDone: {
    tag: 'ALL DONE',
    title: 'Profile complete',
    meta: '9 of 9 stages · 100%',
    text: 'Every stage is done. You can still edit any of them from your profile, and changes go live straight away.',
    action: 'Go to my dashboard',
  },
};
