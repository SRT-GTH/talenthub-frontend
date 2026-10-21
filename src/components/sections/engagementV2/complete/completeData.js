/*
 * Profile complete (stage 9 of 9 done) mock data, API-shaped. Copy verbatim from Figma CO-01 / CO-02 (Focused 8285:22218 /
 * 8285:22420, Playful 7723:179 / 7723:444). Playful says "XP" where Focused says "pts".
 */
export const PROFILE = {
  firstName: 'Kofi',
  fullName: 'Kofi Agyekum',
  headline: 'Frontend developer · Accra',
  badges: ['Top Talent', 'The Architect', 'Pitch 0:54'],
};

export const TONES = ['Professional', 'Friendly', 'Ambitious'];
export const DEFAULT_TONE = 'Professional';

export const BIO = {
  text: 'Frontend developer from Accra with two years of production React. I built Accra Bus Tracker, a real-time transport app used by 200+ commuters in the KNUST pilot, and I care about fast, accessible interfaces. Certified in Google Data Analytics and AWS Cloud Practitioner. Looking for a fintech engineering role in Accra within six months.',
  words: 54,
  shownAt: 'Shown at the top of your profile',
};

/* Writing steps of the bio card (done / done / in progress while writing). */
export const BIO_STEPS = [
  'Reading your 9 stages',
  'Picking your strongest proof',
  'Writing in your tone',
];

export const HERO_CARD_ROWS = [
  { icon: 'CheckCircle', title: '9 of 9 stages', text: 'Avatar to Pitch' },
  { icon: 'Folder', title: '14 entries', text: 'Skills, roles, projects, certificates' },
  { icon: 'Eye', title: 'Live', text: 'Visible to verified recruiters' },
];

export const STATS = [
  { label: 'STAGES DONE', value: '9/9', bg: 'bg-[#f7f8f4]', fg: 'text-[#1c2a21]' },
  { label: 'PROFILE', value: '100%', bg: 'bg-[#e8f2ed]', fg: 'text-[#165d3a]' },
  { label: 'ENTRIES', value: '14', bg: 'bg-[#f7f8f4]', fg: 'text-[#1c2a21]' },
  { label: 'TOTAL EARNED', value: 1240, bg: 'bg-[#faf4e8]', fg: 'text-[#c8951a]' },
];

export const NEXT_CARDS = [
  { icon: 'ChartLine', title: 'Track your views', text: 'See which recruiters looked and when' },
  {
    icon: 'Chat',
    title: 'Answer recruiter messages',
    text: 'Quick replies keep you near the top of search',
  },
  { icon: 'Target', title: 'Get matched to roles', text: 'New fintech roles in Accra, every week' },
];

export const FRESH_ROWS = (xpWord) => [
  { icon: 'Refresh', title: 'Update every 3 months', text: 'Fresh profiles rank higher' },
  { icon: 'Bolt', title: 'Keep your streak', text: `Daily learning adds ${xpWord}` },
];

export const WRITING_MS = 4000;
