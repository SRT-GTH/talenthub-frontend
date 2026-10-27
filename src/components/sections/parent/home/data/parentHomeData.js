/*
 * parentHomeData — copy and numbers for the parent Overview (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 01 Home and dashboard").
 * Mock only, no backend. Two variants share the same wards / rail:
 *   busy      PD-01 10027:1458 (and PD-07 10077:20066 offline = busy + banner): 4 things wait for the parent's OK
 *   caughtUp  PD-01d 10056:158090: nothing waits; the "Waiting for your OK" card is absent
 * Stat tones: plain (white) | amber (#faf4e8) | green (#e8f2ed).
 */
import abena from '../../../../../assets/parent/abena.webp';
import abenaActivity from '../../../../../assets/parent/abena-activity.webp';
import elliot from '../../../../../assets/parent/elliot.webp';
import kwesi from '../../../../../assets/parent/kwesi.webp';
import amaOwusu from '../../../../../assets/parent/ama-owusu.webp';
import abenaAsante from '../../../../../assets/parent/abena-asante.webp';

export const HOME_DATE = 'MONDAY 19 OCTOBER';

export const HOME_VARIANTS = {
  busy: {
    greeting:
      'Abena passed her SQL quick check and asked to pay for a Python course. 4 things wait for your OK this week.',
    stats: [
      { value: '3', label: 'Wards', note: '2 active · 1 pending', tone: 'plain' },
      { value: '4', label: 'To review', note: 'Oldest: 2 days', tone: 'plain' },
      { value: '1', label: 'Flag open', note: 'Abena fixed it · check', tone: 'amber' },
      {
        value: 'GHS 90',
        label: 'Payment to approve',
        note: 'Abena · Python Basics',
        tone: 'green',
      },
    ],
    showWaiting: true,
  },
  caughtUp: {
    greeting:
      'Nothing needs your OK right now. Abena and Elliot had a good week — here’s what they did.',
    stats: [
      { value: '3', label: 'Wards', note: '2 active · 1 pending', tone: 'plain' },
      { value: '0', label: 'To review', note: 'All caught up', tone: 'plain' },
      { value: '0', label: 'Flag open', note: 'Nothing open', tone: 'amber' },
      {
        value: 'GHS 0',
        label: 'Payments to approve',
        note: 'Paid this month: GHS 125',
        tone: 'green',
      },
    ],
    showWaiting: false,
  },
};

export const QUICK_ACTIONS = [
  { id: 'review', label: 'Review now', icon: 'search' },
  { id: 'evaluate', label: 'Evaluate my child', icon: 'evaluate' },
  { id: 'link', label: 'Link a ward', icon: 'link' },
];

export const HOME_TABS = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'abena', label: 'Abena', icon: 'flag', chip: '1 flag' },
  { id: 'elliot', label: 'Elliot', icon: 'eye', chip: '2 to review' },
];

export const WARDS_INTRO =
  'Each ward has their own controls. You can opt any of them out at any time, and nothing changes for the others.';

export const WARDS = [
  {
    id: 'abena',
    name: 'Abena Mensah',
    age: 16,
    photo: abena,
    relation: 'Daughter · SHS 2 · Achimota School',
    chips: [
      { label: 'Discoverable', tone: 'green' },
      { label: '1 fix to check', tone: 'amber' },
    ],
    cta: 'Open Abena',
    primary: true,
  },
  {
    id: 'elliot',
    name: 'Elliot Mensah',
    age: 15,
    photo: elliot,
    relation: 'Son · SHS 1 · General Science',
    chips: [
      { label: 'Building profile', tone: 'green' },
      { label: 'Evaluation waiting', tone: 'grey' },
    ],
    cta: 'Open Elliot',
  },
  {
    id: 'kwesi',
    name: 'Kwesi Mensah',
    age: 15,
    photo: kwesi,
    relation: 'Nephew · waiting for Kwesi',
    chips: [
      { label: 'Pending link', tone: 'green' },
      { label: 'Sent 2 days ago', tone: 'grey' },
    ],
    cta: 'Remind Kwesi',
  },
];

// icon: fintech | agritech | telecom (tile colours from Figma: mint, cream)
export const WAITING_ITEMS = [
  {
    id: 'cert',
    icon: 'fintech',
    title: 'Certificate · Intro to Python · Abena',
    sub: 'Ghana Code Club · hidden until you decide',
    action: 'Review',
    actionLook: 'soft',
  },
  {
    id: 'eval',
    icon: 'agritech',
    title: 'Teacher evaluation · Elliot',
    sub: 'From Mr Owusu · Elliot sees it only if you approve',
    highlight: true,
  },
  {
    id: 'pay',
    icon: 'fintech',
    title: 'Payment GHS 90 · Abena',
    sub: 'Python Basics · expires in 46 h',
    action: 'Decide',
    actionLook: 'white',
  },
  {
    id: 'dob',
    icon: 'telecom',
    title: 'Date of birth corrected · Abena',
    sub: 'You flagged it 14 Oct · check the fix',
    action: 'Check',
    actionLook: 'white',
  },
];

// kind: photo | check | star
export const ACTIVITY = [
  {
    id: 'a1',
    kind: 'photo',
    photo: abenaActivity,
    text: 'Abena passed the SQL quick check (+40 Cycles)',
    when: '2 hours ago',
  },
  {
    id: 'a2',
    kind: 'check',
    text: 'Abena asked you to approve a GHS 90 payment',
    when: 'Today, 9:12',
  },
  {
    id: 'a3',
    kind: 'photo',
    photo: abenaActivity,
    text: 'Abena corrected her date of birth after your flag',
    when: 'Yesterday',
  },
  { id: 'a4', kind: 'star', text: 'Kwesi received your link request', when: 'Yesterday, 8:04' },
];

export const GUIDE = {
  title: 'Parent guide',
  sub: 'Tips for this week',
  eyebrow: 'WHAT TO DO NEXT',
  body: 'Abena has a mock exam on Thursday. A short note of support from you helps more than you think.',
  cta: 'Send Abena a note',
};

export const READINESS = {
  title: 'Abena’s readiness',
  link: 'Open Abena',
  score: 82,
  headline: 'Ready for data internships',
  sub: 'Ahead of 64% of SHS talents',
  eyebrow: 'NEXT STEP FOR HER',
  step: 'Excel · intermediate',
  stepSub: 'Finishing it lifts her score to about 88.',
};

export const VIEWERS = {
  title: 'Who viewed Abena',
  sub: '2 verified partners this week',
  items: [
    {
      id: 'ama',
      photo: amaOwusu,
      name: 'Ama Owusu · Talent Lead · Hubtel',
      line: 'Viewed her profile',
      when: '2 hours ago',
      chip: 'Data internship',
    },
    {
      id: 'asante',
      photo: abenaAsante,
      name: 'Abena Asante · HR · Farmerline',
      line: 'Saved her for a holiday internship',
      lineStrong: true,
      when: 'Yesterday',
      chip: 'Holiday internship',
    },
  ],
  privacy: 'Recruiters can’t message under-18s. You can hide Abena from search at any time.',
};

export const OFFLINE = {
  title: 'You’re offline',
  body: 'Showing what we saved at 08:12. You can read everything, but approvals and flags will send when you’re back online.',
};
