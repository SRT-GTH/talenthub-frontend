/*
 * P-04 For parents & schools — copy verbatim from Figma 7797:28950 (desktop) / 7815:296546 (tablet) / 7815:297710 (mobile).
 */

export const HERO = {
  crumb: 'For parents & schools',
  chip: 'Parents, guardians and schools',
  title: 'Their future, with you \nin the loop.',
  subtitle:
    'Parents are kept informed and can opt out at any time. Schools see progress across classes. Talents stay in control of their own story.',
};

export const PARENTS = {
  chip: 'For parents and guardians',
  title: 'Peace of mind, not paperwork.',
  subtitle:
    'You see what recruiters see, flag anything that’s wrong, approve certificates and payments, and can opt out at any time.',
  benefits: [
    {
      id: 'notifications',
      icon: 'bell',
      title: 'Instant notifications',
      body: 'A message the moment a recruiter is interested in your child.',
    },
    {
      id: 'opt-out',
      icon: 'check',
      title: 'Opt out any time',
      body: 'Under-18s can’t apply for paid work or message recruiters directly.',
    },
    {
      id: 'recruiters',
      icon: 'eye',
      title: 'See what recruiters see',
      body: 'The same profile, scores and labels, no surprises.',
    },
    {
      id: 'network',
      icon: 'globe',
      title: 'Any phone, any network',
      body: 'Works on basic smartphones and 3G, in your language.',
    },
  ],
  phone: {
    time: '9:41',
    app: 'Ghana Talent Hub',
    when: 'Parent notification · now',
    message: 'Abena added a certificate: Intro to Python. Check it before it shows on her profile?',
    approve: 'Approve',
    review: 'Review first',
    weeklyTitle: 'This week for Abena',
    weekly: [
      '· Profile 78% · Discoverable',
      '· Personality quiz finished',
      '· 2 recruiters viewed her profile',
    ],
    sticker: 'UNDER-18 SAFE',
  },
  steps: [
    {
      n: '1',
      title: 'Your child invites you',
      body: 'From their profile, by phone number or email.',
    },
    { n: '2', title: 'You confirm in one tap', body: 'No new password needed. SMS works too.' },
    { n: '3', title: 'You’re in the loop', body: 'See progress, flag fixes and opt out any time.' },
  ],
  cta: 'Invite my parent',
};

export const SCHOOLS = {
  chip: 'For schools and institutions',
  title: 'See every student grow.',
  subtitle:
    'Guidance teams track readiness, skills and placements across classes, with student consent. Free onboarding for GES schools.',
  dashboard: {
    title: 'Accra Girls SHS · Form 3',
    badge: 'GES accredited',
    stats: [
      { value: '847', label: 'active student profiles', bg: '#ffd86b' },
      { value: '68%', label: 'Discoverable or above', bg: '#84cc16' },
      { value: '31', label: 'placements this term', bg: '#f9c9b6' },
    ],
    classesTitle: 'READINESS BY CLASS',
    /* pct = bar fill (Figma bar widths 459/414/341/386/308 of 560, matching the labels) */
    classes: [
      { name: '3 Science A', pct: 82 },
      { name: '3 Science B', pct: 74 },
      { name: '3 General Arts', pct: 61 },
      { name: '3 Business', pct: 69 },
      { name: '3 Visual Arts', pct: 55 },
    ],
  },
  benefits: [
    'Class and cohort dashboards',
    'Readiness and skills trends over time',
    'Placement and scholarship tracking',
    'Students choose what the school can see',
    'Free onboarding and training for GES schools',
  ],
  cta: 'Bring GTH to my school',
};

export const SAFETY = {
  chip: 'Safety and privacy',
  title: 'Built for young people, from day one.',
  cards: [
    {
      id: 'verified',
      icon: 'shield',
      tile: '#ffd86b',
      title: 'Verified recruiters only',
      body: 'Every company is checked before it can see or contact talents.',
    },
    {
      id: 'data',
      icon: 'lock',
      tile: '#84cc16',
      title: 'Data stays yours',
      body: 'Talents choose what’s visible and can download or delete it.',
    },
    {
      id: 'report',
      icon: 'flag',
      tile: '#f9c9b6',
      title: 'Report in one tap',
      body: 'Anything that feels off goes straight to our safety team.',
    },
    {
      id: 'policy',
      icon: 'user-check',
      tile: '#ffd86b',
      title: 'Child safety policy',
      body: 'Clear rules for under-18s, reviewed with schools and parents.',
    },
  ],
};
