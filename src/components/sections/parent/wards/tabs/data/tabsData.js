/*
 * tabsData — copy and numbers of the ward tabs (Figma canvas "Parent · 02 My wards and ward page" 10057:560):
 * PW-11 Evaluations 10049:769, PW-12 Wallet 10049:1231, PW-13 Activity 10049:1713, PW-16 Crew 10105:2989.
 * Every builder takes the ward (see ../../data/wardsData.js) so names and pronouns follow the ward; the figures are Abena's mock numbers.
 * Row icons: key of ICONS (an asset url). Chip tones: WardChip tones ('active' | 'pending') or 'dark'.
 * ⚠️ ASSUMPTION: Elliot and Kwesi show the same mock rows as Abena (Figma draws these tabs for Abena only).
 */
import clipboard from '../../../../../../assets/parent/wards-clipboard.svg';
import userCheck from '../../../../../../assets/parent/wards-user-check.svg';
import users from '../../../../../../assets/parent/wards-users.svg';
import wallet from '../../../../../../assets/parent/wards-wallet.svg';
import refresh from '../../../../../../assets/parent/wards-refresh.svg';
import checkCircle from '../../../../../../assets/parent/wards-check-circle.svg';
import user from '../../../../../../assets/parent/wards-user.svg';
import star from '../../../../../../assets/parent/wards-star.svg';
import fileCheck from '../../../../../../assets/parent/wards-file-check.svg';
import amaOwusu from '../../../../../../assets/parent/crew-ama-owusu.webp';
import kofiAgyekum from '../../../../../../assets/parent/crew-kofi-agyekum.webp';
import efuaAsante from '../../../../../../assets/parent/crew-efua-asante.webp';
import yawDarko from '../../../../../../assets/parent/crew-yaw-darko.webp';
import adjoaBoateng from '../../../../../../assets/parent/crew-adjoa-boateng.webp';
import kwameBoateng from '../../../../../../assets/parent/crew-kwame-boateng.webp';
import akuaAsare from '../../../../../../assets/parent/crew-akua-asare.webp';

export const ICONS = {
  clipboard,
  userCheck,
  users,
  wallet,
  refresh,
  checkCircle,
  user,
  star,
  fileCheck,
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* PW-11 */
export const evaluationsData = (ward) => ({
  title: `Evaluations on ${ward.firstName}’s profile`,
  rows: [
    {
      id: 'parent',
      icon: 'clipboard',
      title: 'Parent evaluation · you',
      sub: 'General · 3 published, 2 under review · 18 Oct',
      chip: { tone: 'active', label: 'Partly published' },
    },
    {
      id: 'teacher',
      icon: 'userCheck',
      title: 'Mrs Boateng · Maths teacher',
      sub: `Academic strengths · approved by you 2 Oct · ${ward.firstName} accepted`,
      chip: { tone: 'active', label: 'On profile' },
    },
    {
      id: 'club',
      icon: 'users',
      title: 'Accra Library coding club',
      sub: `Volunteer reference · waiting for ${ward.firstName} to review`,
      chip: { tone: 'pending', label: `With ${ward.firstName}` },
    },
  ],
  add: {
    title: `Add another view of ${ward.firstName}`,
    body: 'Your evaluation adds a parent’s view. Teachers and coaches can add theirs too — they come to you first.',
    primary: `Evaluate ${ward.firstName}`,
    secondary: 'Invite a teacher',
  },
});

/* PW-12 */
export const walletData = (ward) => ({
  stats: [
    { value: 'GHS 85.00', label: 'Balance', note: 'Starter wallet' },
    { value: '180', label: 'Cycles', note: '≈ GHS 18' },
    { value: 'GHS 40', label: 'Laptop fund', note: 'of GHS 1,200 goal' },
    { value: 'GHS 35', label: 'Spent this month', note: 'of GHS 200 limit' },
  ],
  paymentsTitle: 'Recent payments',
  payments: [
    {
      id: 'python',
      icon: 'wallet',
      title: 'Python Basics · GTH Academy',
      sub: 'Waiting for your OK · GHS 90.00',
      chip: { tone: 'dark', label: 'Decide' },
    },
    {
      id: 'cycles',
      icon: 'refresh',
      title: 'Cycles redeemed',
      sub: '12 Oct · 200 Cycles → + GHS 20.00',
      chip: { tone: 'active', label: '+ GHS 20' },
    },
    {
      id: 'excel',
      icon: 'checkCircle',
      title: 'Course · Excel basics',
      sub: '5 Oct · under your limit · − GHS 35.00',
      chip: { tone: 'pending', label: '− GHS 35' },
    },
    {
      id: 'topup',
      icon: 'user',
      title: 'Top up from Mum',
      sub: '1 Oct · MTN MoMo · + GHS 100.00',
      chip: { tone: 'active', label: '+ GHS 100' },
    },
  ],
  info: {
    title: 'You can see',
    body: `Balance, Cycles, savings and payments. You can’t see who ${ward.pronoun} messages or move ${ward.possessive} money.`,
    topUp: `Top up ${ward.firstName}`,
    limits: 'Change limits',
  },
});

/* PW-13 */
export const activityData = () => ({
  filters: ['All', 'Learning', 'Skills', 'Clubs', 'Volunteering'],
  groups: [
    {
      id: 'week',
      label: 'This week',
      rows: [
        {
          id: 'badge',
          icon: 'star',
          title: 'Earned the Python Coding badge',
          sub: 'Today · Skills Lab · 6 of 6 correct',
        },
        {
          id: 'sql',
          icon: 'checkCircle',
          title: 'Passed the SQL quick check',
          sub: 'Today · +40 Cycles',
        },
        {
          id: 'club',
          icon: 'users',
          title: 'Joined “Girls Who Code Accra”',
          sub: 'Wed · club · posts are private to members',
        },
      ],
    },
    {
      id: 'earlier',
      label: 'Earlier',
      rows: [
        {
          id: 'module',
          icon: 'checkCircle',
          title: 'Finished Module 3 · SQL for Data Analysis',
          sub: '12 Oct · GTH Academy',
        },
        {
          id: 'volunteer',
          icon: 'users',
          title: 'Applied to volunteer: Accra Library coding club',
          sub: '10 Oct · unpaid volunteer role',
        },
        {
          id: 'cert',
          icon: 'fileCheck',
          title: 'Uploaded a certificate · Intro to Python',
          sub: '30 Sep · waiting for your review',
        },
      ],
    },
  ],
});

/* PW-16 */
export const crewData = (ward) => ({
  filters: ['All · 6', 'Classmates · 4', 'Verified mentors · 2'],
  crewLabel: `In ${ward.firstName}’s crew`,
  crew: [
    {
      id: 'ama',
      photo: amaOwusu,
      name: 'Ama Owusu',
      sub: 'Classmate · SHS 2 · Achimota School · linked 12 Oct',
      tag: 'Peer',
    },
    {
      id: 'kofi',
      photo: kofiAgyekum,
      name: 'Kofi Agyekum',
      sub: 'Girls Who Code Accra · linked 9 Oct',
      tag: 'Peer',
    },
    {
      id: 'efua',
      photo: efuaAsante,
      name: 'Efua Asante',
      sub: 'Classmate · Achimota School · linked 3 Oct',
      tag: 'Peer',
    },
    {
      id: 'yaw',
      photo: yawDarko,
      name: 'Yaw Darko',
      sub: 'SQL study group · linked 28 Sep',
      tag: 'Peer',
    },
    {
      id: 'adjoa',
      photo: adjoaBoateng,
      name: 'Ms. Adjoa Boateng',
      sub: 'Computing teacher · Achimota School · learning from since 20 Sep',
      tag: 'Verified mentor',
    },
    {
      id: 'kwame',
      photo: kwameBoateng,
      name: 'Kwame Boateng',
      sub: 'Product manager · Hubtel · learning from since 14 Sep',
      tag: 'Verified mentor',
    },
  ],
  waitingLabel: `Waiting for ${ward.firstName} · 1`,
  waiting: [
    {
      id: 'akua',
      photo: akuaAsare,
      name: `Akua Asare wants to link up with ${ward.firstName}`,
      sub: `Classmate · SHS 2 · Achimota School · sent yesterday · only ${ward.firstName} can accept`,
      tag: `${ward.firstName} decides`,
    },
  ],
  rulesTitle: `Who can link up with ${ward.firstName}`,
  rules: [
    {
      id: 'classmates-mentors',
      title: 'Classmates and verified mentors',
      body: 'Recommended for 13–17. Adults who aren’t verified mentors can’t send requests.',
    },
    {
      id: 'mentors-only',
      title: 'Verified mentors only',
      body: `${ward.firstName} can still link up with classmates ${ward.pronoun} invites ${ward.pronoun === 'she' ? 'herself' : 'himself'}.`,
    },
    {
      id: 'pause',
      title: 'Pause new link-ups',
      body: `No one can send new requests. ${cap(ward.possessive)} current crew stays.`,
    },
  ],
  seeTitle: 'What you can see',
  see: [
    `· You see who is in ${ward.firstName}’s crew and who asked to join it.`,
    `· You don’t see their messages or notes. ${ward.firstName} knows you can see ${ward.possessive} crew.`,
    '· Worried about someone? Use Report a concern. GTH safety reviews it within 24 hours.',
  ],
});
