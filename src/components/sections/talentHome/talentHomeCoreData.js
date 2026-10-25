import whoLookingPhoto1 from '../../../assets/talent-home/home/who-looking-photo-1.png';
import whoLookingPhoto2 from '../../../assets/talent-home/home/who-looking-photo-2.png';
import activityAmaPhoto from '../../../assets/talent-home/home/activity-ama-photo.png';
import activityGenericPhoto from '../../../assets/talent-home/home/activity-generic-photo.png';
import recruiterAbenaPhoto from '../../../assets/talent-home/home/recruiter-abena-photo.png';
import recruiterKwamePhoto from '../../../assets/talent-home/home/recruiter-kwame-photo.png';
import communityPhoto1 from '../../../assets/talent-home/home/community-photo-1.png';
import communityPhoto2 from '../../../assets/talent-home/home/community-photo-2.png';
import communityPhoto3 from '../../../assets/talent-home/home/community-photo-3.png';

/*
 * Per-state copy / numbers for the talent home content column (Core agent).
 * Strings are verbatim from the Figma frames (Playful + Focused share copy; the only wording
 * difference is XP vs pts, handled by <Points/>). Frames: HM-01 7731:530 / 8097:4669,
 * HM-02 7732:530 / 8097:6075, HM-02b 7756:182221, HM-03a 7756:182819, HM-03 7730:5351.
 * Exports other agents may reuse: HOME_TAB_ITEMS, CORE_CONTENT, STAGE_NODE_COPY.
 */

// ---- Journey ----------------------------------------------------------------------------
export const JOURNEY_COPY = {
  day1: {
    metaDone: '1 of 9 done · 11%',
    metaNext: 'Next milestone: Discoverable at 3 of 9',
    metaSaved: 'Auto-saved',
  },
  discoverable: {
    metaDone: '5 of 9 done · 56%',
    metaNext: 'Next milestone: Top 20% at 6 of 9 · one stage away',
    metaSaved: null,
  },
  min: {
    title: 'Profile journey · 5 of 9',
    sub: 'Next: Portfolio · unlocks Top 20%',
    cta: 'Continue: Portfolio',
    count: '5',
  },
  complete: {
    title: [['Profile complete. '], ['9 of 9.', true]],
    sub: 'You’re a Top Talent. This card hides itself in 7 days, or now.',
    cta: 'View my profile',
    hide: 'Hide this card',
    sticker: '100%',
  },
};

// ---- Hero -------------------------------------------------------------------------------
export const HERO = {
  day1: {
    kind: 'welcome',
    eyebrow: 'WELCOME TO GHANA TALENT HUB',
    headline: [['Akwaaba, Kofi. Let’s '], ['get you seen.', true]],
    body: 'Your avatar is done. Eight quick stages to go. Most people finish in about 20 minutes, and everything saves as you go.',
    cta: 'Continue: Interests',
    link: 'See the journey map',
    xp: { n: '+50', caption: 'Avatar unlocked' },
    sticker: 'DAY 1',
  },
  discoverable: {
    kind: 'ring',
    eyebrow: 'MILESTONE 1 OF 3 UNLOCKED',
    headline: [['You’re '], ['Discoverable,', true], [' Kofi.']],
    body: 'Recruiters can now find you in search. Add one project next and you’re in the Top 20%.',
    cta: 'Continue: Portfolio',
    secondaryCta: 'Preview my profile',
    ring: { pct: 56, label: '5 of 9 stages', xp: '+420', xpTail: 'so far' },
    sticker: 'DISCOVERABLE',
  },
  complete: {
    kind: 'stats',
    eyebrow: 'TUESDAY 14 OCTOBER',
    headline: [['Good evening, '], ['Kofi.', true]],
    body: 'Zeepay moved you to interview and 12 new roles matched this week. Here’s what matters today.',
    quick: ['Browse roles', 'Practise a skill', 'Edit profile'],
    stats: [
      { n: '47', label: 'Profile views', note: '+38% this week', tone: 'white' },
      { n: '142', label: 'Matches', note: '+12 new', tone: 'white' },
      { n: '3', label: 'Messages', note: '2 unread', tone: 'amber' },
      { n: '7', label: 'Verified skills', note: 'Top 10% in React', tone: 'mint' },
    ],
    sticker: 'TOP TALENT',
    customize: 'Customize',
  },
};
HERO.top = HERO.complete;

// ---- Day 1 cards ------------------------------------------------------------------------
export const BUDDY_INTRO = {
  title: 'Meet Career Buddy',
  sub: 'Here from day one. Ask anything about jobs, skills or setup.',
  message:
    '“Tell me what you’re into and I’ll line up roles that fit. Interests take about 2 minutes.”',
  chips: ['What’s Discoverable?', 'Which roles pay well in Accra?', 'Help me pick interests'],
  cta: 'Start chat',
};

export const FIRST_QUESTS = {
  title: 'Start a streak today',
  sub: 'Do one thing a day. Small wins stack.',
  quests: [
    // `stage`: the journey stage that marks the quest done (live data); `route`: where a tap goes.
    // `done` is the Figma demo value only - the live home works it out (FirstQuestsCard).
    {
      id: 'avatar',
      icon: 'heart',
      title: 'Create your avatar',
      meta: 'About 1 min',
      pts: '+50',
      done: true,
      stage: 'avatar',
      route: '/profile/engagement/avatar',
    },
    {
      id: 'interests',
      icon: 'heart',
      title: 'Pick your interests',
      meta: 'About 2 min',
      pts: '+50',
      stage: 'interests',
      route: '/profile/filling/interests',
    },
    {
      id: 'quiz',
      icon: 'bulb',
      title: 'Take the personality quiz',
      meta: 'About 8 min',
      pts: '+100',
      stage: 'personality',
      route: '/profile/filling/personality',
    },
    {
      id: 'reminders',
      icon: 'bell',
      title: 'Turn on streak reminders',
      meta: 'One tap',
      metaOn: 'On · daily nudge',
      pts: '+10',
      route: '/streak',
    },
  ],
};

export const UNLOCKS = {
  title: [['What you unlock '], ['as you go', true]],
  sub: 'Each milestone opens something new. No pressure, it’ll be here when you’re ready.',
  chipLocked: 'Locked',
  cards: [
    {
      id: 'roles',
      icon: 'search',
      title: 'Roles matched to you',
      body: 'See jobs picked for your skills and goals.',
      progress: { of: 3 },
      at: 'Unlocks at Discoverable · 3 of 9',
    },
    {
      id: 'readiness',
      icon: 'target',
      title: 'Job readiness score',
      body: 'Know how ready you are and the one gap to close.',
      progress: { of: 6 },
      at: 'Unlocks at Top 20% · 6 of 9',
    },
    {
      id: 'recruiters',
      icon: 'chat',
      title: 'Recruiter messages',
      body: 'Verified recruiters can reach you directly.',
      progress: { of: 9 },
      at: 'Unlocks at Top Talent · 9 of 9',
    },
  ],
};

export const EXPLORE = {
  text: 'Just want to look around first?',
  chip: 'Explore 142 roles in Ghana',
};

// ---- Companies (tile colours + industry icon key) --------------------------------------
export const COMPANIES = {
  hubtel: { bg: 'bg-[#387440]', icon: 'fintechWhite' },
  zeepay: { bg: 'bg-[#ebf1ec]', icon: 'fintechGreen' },
  farmerline: { bg: 'bg-[#e8f2ed]', icon: 'agritech' },
  mpharma: { bg: 'bg-[#f9ebea]', icon: 'health' },
  mtn: { bg: 'bg-[#faf4e8]', icon: 'telecom' },
  zeepayApp: { bg: 'bg-[#ebf1ec]', icon: 'fintechSmall' },
  farmerlineApp: { bg: 'bg-[#e8f2ed]', icon: 'agritechSmall' },
  expresspay: { bg: 'bg-[#ebf1ec]', icon: 'fintechSmall' },
};

// ---- Discoverable (HM-02) ---------------------------------------------------------------
export const DISCOVERABLE = {
  matches: {
    title: [['Your '], ['first matches', true]],
    link: 'See all 18',
    note: '18 roles match so far. Reach Top 20% and we’ll widen your matches and show your fit score for each.',
    fitChip: 'Fit score at Top 20%',
    viewRole: 'View role',
    cards: [
      {
        id: 'jfe',
        company: 'hubtel',
        title: 'Junior Frontend Developer',
        meta: 'Hubtel · Accra · Hybrid',
        salary: 'GHS 6–9k',
        sticker: 'NEW FOR YOU',
        featured: true,
      },
      {
        id: 'react',
        company: 'zeepay',
        title: 'React Developer',
        meta: 'Zeepay · Accra · On-site',
        salary: 'GHS 8–11k',
      },
      {
        id: 'intern',
        company: 'farmerline',
        title: 'Web Developer Intern',
        meta: 'Farmerline · Kumasi · Hybrid',
        salary: 'GHS 3–4k',
      },
    ],
  },
  applications: {
    title: 'My applications',
    emptyTitle: 'No applications yet. That’s fine.',
    emptyBody:
      'Most talents apply after they hit Top 20%, when recruiters can see their projects. When you apply, you’ll track every stage right here.',
    cta: 'Browse 18 matches',
  },
  buddy: {
    title: 'Career Buddy',
    sub: 'Your AI guide',
    label: 'WHAT TO DO NEXT',
    message:
      'Recruiters filter by projects. Add Accra Bus Tracker with a screenshot and you’re Top 20%. Takes about 4 minutes.',
    cta: 'Add my project',
    sticker: null,
  },
  streak: {
    title: '3-day streak',
    sub: 'Do one stage today to make it 4.',
    freeze: '1 streak freeze left this week',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    // 'done' | 'open' | 'today'
    status: ['open', 'open', 'open', 'done', 'done', 'done', 'today'],
    quests: null,
  },
  readiness: {
    kind: 'locked',
    title: 'Job readiness',
    chip: '1 stage away',
    preview: 'Your score and the one skill gap to close appear at Top 20%.',
    pct: 83.33,
    caption: '5 of 6 stages · add a project to unlock',
  },
  looking: {
    title: 'Who’s looking',
    headline: '2 recruiters found you',
    sub: 'Since you became Discoverable yesterday',
    photos: [whoLookingPhoto1, whoLookingPhoto2],
  },
};

// ---- Complete / Top Talent (HM-03a / HM-03) --------------------------------------------
const COMPLETE_BASE = {
  matches: {
    title: [['Matched '], ['to you', true]],
    link: 'See all 142',
    sub: 'Based on your verified React and TypeScript skills, your goals (fintech, Accra) and your pitch.',
    cards: [
      {
        id: 'fe',
        company: 'hubtel',
        title: 'Frontend Engineer',
        meta: 'Hubtel · Accra · Hybrid',
        score: '96%',
        scoreLabel: 'match',
        salary: 'GHS 9–13k',
        extra: { text: 'Closes in 3 days', focused: 'amber', playful: 'white' },
        cta: 'Quick apply',
        sticker: 'BEST FIT',
        featured: true,
      },
      {
        id: 'react',
        company: 'zeepay',
        title: 'React Developer',
        meta: 'Zeepay · Accra · On-site',
        score: '93%',
        scoreLabel: 'match',
        salary: 'GHS 8–11k',
        extra: { text: 'Posted 2d ago', focused: 'grey', playful: 'white' },
        cta: 'View role',
      },
      {
        id: 'ui',
        company: 'mpharma',
        title: 'UI Engineer',
        meta: 'mPharma · Remote · Ghana',
        score: '89%',
        scoreLabel: 'match',
        salary: 'GHS 10–14k',
        extra: { text: 'Posted 2d ago', focused: 'grey', playful: 'white' },
        cta: 'View role',
      },
    ],
  },
  applications: {
    title: 'My applications',
    link: 'Full tracker (4)',
    items: [
      {
        id: 'zeepay',
        company: 'zeepayApp',
        title: 'Frontend Engineer · Zeepay',
        meta: 'Applied 6 days ago · Accra',
        steps: ['done', 'done', 'now', 'todo'],
        chip: { text: 'Interview Thu 16 Oct, 10:00', tone: 'green' },
      },
      {
        id: 'farmerline',
        company: 'farmerlineApp',
        title: 'Frontend Developer · Farmerline',
        meta: 'Applied 2 weeks ago · Accra',
        steps: ['done', 'done', 'done', 'done'],
        chip: { text: 'Offer received · reply by Fri', tone: 'ink' },
        sticker: 'OFFER',
        featured: true,
      },
      {
        id: 'expresspay',
        company: 'expresspay',
        title: 'Software Engineer · ExpressPay',
        meta: 'Applied 4 days ago · Accra',
        steps: ['done', 'now', 'todo', 'todo'],
        chip: { text: 'Under review', tone: 'white' },
      },
      {
        id: 'mtn',
        company: 'mtn',
        title: 'React Developer · MTN Ghana',
        meta: 'Applied yesterday · Accra',
        steps: ['now', 'todo', 'todo', 'todo'],
        chip: { text: 'Applied', tone: 'white' },
      },
    ],
  },
  activity: {
    title: 'Recent activity',
    link: 'See all',
    // kind: 'photo' | 'check' | 'star'
    rows: [
      {
        kind: 'photo',
        photo: activityAmaPhoto,
        text: 'Ama Owusu from Hubtel viewed your profile',
        when: '2 hours ago',
      },
      { kind: 'check', text: 'Zeepay moved you to the interview stage', when: 'Today, 9:12' },
      {
        kind: 'photo',
        photo: activityGenericPhoto,
        text: 'Kwesi Mensah endorsed your React skill',
        when: 'Yesterday',
      },
      {
        kind: 'photo',
        photo: activityGenericPhoto,
        text: 'Amina Zahra praised your design project',
        when: '2 days ago',
      },
      {
        kind: 'photo',
        photo: activityGenericPhoto,
        text: 'Jamal Nwosu shared your GitHub profile',
        when: '5 days ago',
      },
      {
        kind: 'photo',
        photo: activityGenericPhoto,
        text: 'Fatima Khan commented on your UX research',
        when: '1 week ago',
      },
      { kind: 'star', text: '12 new roles matched your goals', when: 'Yesterday, 8:04' },
    ],
  },
  buddy: {
    title: 'Career Buddy',
    sub: 'Your AI guide',
    label: 'WHAT TO DO NEXT',
    message:
      'Your Zeepay interview is on Thursday. Want a 10-minute mock with the React questions they usually ask?',
    cta: 'Start mock interview',
    prompt: 'Start a mock interview with me.',
    chipAction: {
      label: 'Start a mock interview with me.',
      intent: 'interview',
      slots: [{ name: 'practice_interview', value: JSON.stringify({ mode: 'mock' }) }],
    },
    sticker: 'NEW',
  },
  streak: {
    title: '12-day streak',
    sub: 'Your best yet. Keep it going tonight.',
    freeze: '1 streak freeze left this week',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    status: ['done', 'done', 'done', 'done', 'done', 'done', 'today'],
    week: { label: 'This week', done: '3 of 6 steps done', pct: 50 },
    questsTitle: 'THIS WEEK’S QUESTS',
    questsPts: '+90',
    quests: [
      { text: 'Apply to 3 roles', count: '2/3', pts: '+30', pct: 66.6667 },
      { text: 'Finish the TypeScript module', count: '1/2', pts: '+40', pct: 50 },
      { text: 'Reply to a recruiter', count: '0/1', pts: '+20', pct: 0 },
    ],
  },
  readiness: {
    kind: 'score',
    title: 'Job readiness',
    link: 'Details',
    score: '82',
    headline: 'Job-ready for frontend roles',
    sub: 'Ahead of 71% of similar talents',
    pct: 82,
    gapLabel: 'TOP SKILL GAP',
    gapPts: '+40',
    gapTitle: 'TypeScript · intermediate',
    gapBody: 'Closing it lifts your score to about 88.',
  },
  recruiters: {
    title: 'Recruiter activity',
    link: 'See all',
    sub: '5 recruiters this week · 1 shortlisted you',
    rows: [
      {
        photo: activityAmaPhoto,
        name: 'Ama Owusu · Talent Lead · Hubtel',
        what: 'Spent 4 min on your portfolio',
        when: '2 hours ago',
        role: 'Frontend Engineer',
      },
      {
        photo: recruiterAbenaPhoto,
        name: 'Abena Asante · HR · Farmerline',
        what: 'Sent you a message',
        whatAccent: true,
        when: 'Yesterday',
        role: 'Frontend Developer',
      },
      {
        photo: recruiterKwamePhoto,
        name: 'Kwame Boateng · Recruiter · MTN Ghana',
        what: 'Saved you to a shortlist',
        when: '3 days ago',
        role: 'React Developer',
      },
    ],
    privacy: 'Only verified recruiters show here. You control who can message you.',
  },
  more: {
    title: [['More '], ['for you', true]],
    hint: 'Hide any of these in Customize',
    learning: {
      title: 'My learning',
      pct: 45,
      row: ['TypeScript for React devs', 'Module 1 of 2 · 45%'],
      link: 'Resume',
    },
    saved: {
      title: 'Saved roles',
      chip: 'Closes tomorrow',
      row: ['4 saved', '1 closes tomorrow: UI Engineer · mPharma'],
      link: 'View saved',
    },
    evaluations: {
      title: 'Evaluations',
      rows: [
        ['1 ready to review', 'From Kwesi Mensah, your team lead'],
        ['1 sent', 'Waiting on Ama Owusu'],
      ],
      link: 'Review',
    },
    community: {
      title: 'Community',
      photos: [communityPhoto1, communityPhoto2, communityPhoto3],
      row: ['Accra Frontend Devs', '3 new posts · 1 mentions you'],
      link: 'Open community',
    },
    badges: {
      title: 'Badges',
      rows: [
        ['Top Talent', 'Earned today'],
        ['React · Top 10%', 'Skills Lab'],
      ],
      link: 'All badges',
    },
  },
  customize: { text: 'Add cards or rearrange your home', link: 'Customize' },
};

// Top Talent (HM-03) differs from 03a only by copy volume: 4 activity rows, 3 recruiter rows of
// 2-line wrap, and no Journey card (the profile is already complete).
const TOP_ACTIVITY = [
  COMPLETE_BASE.activity.rows[0],
  COMPLETE_BASE.activity.rows[1],
  COMPLETE_BASE.activity.rows[2],
  COMPLETE_BASE.activity.rows[6],
];

export const CORE_CONTENT = {
  day1: { hero: HERO.day1 },
  discoverable: { hero: HERO.discoverable, ...DISCOVERABLE },
  complete: { hero: HERO.complete, ...COMPLETE_BASE },
  top: {
    hero: HERO.top,
    ...COMPLETE_BASE,
    activity: { ...COMPLETE_BASE.activity, rows: TOP_ACTIVITY },
  },
};

// ---- Home tabs (HM-03 / 03a) ------------------------------------------------------------
export const HOME_TAB_ITEMS = [
  { id: 'home', label: 'Overview', chip: null },
  { id: 'assessment', label: 'MyAssessment', chip: '3 of 4' },
  { id: 'recruiter', label: 'Recruiter activity', chip: '5 new' },
];

export const STAGE_NODE_COPY = { milestoneReached: 'Discoverable' };
