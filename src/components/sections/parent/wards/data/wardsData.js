/*
 * wardsData — mock wards of the parent "My wards" pages (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 02 My wards and ward page" 10057:560).
 * Sources: PW-01 10033:5115 (list rows), PW-02 10034:3257 (Abena), PW-02b 10041:3643 (Elliot), PW-10 10041:4106 (Abena turns 18 notice).
 * Owned by the Overview/list work; the tab components only read it.
 * Fields: id (route param), name, firstName, relation ('Daughter'), pronoun ('she' | 'he'), possessive ('her' | 'his'), age, grade, school, since ('2 Sep'),
 *   photo, status ('active' | 'pending'), listLine (PW-01 row sub line), action ('Open →' | 'Resend'),
 *   kpis [{ value, label, note }], activity [{ id, icon (star|book|heart|file), title, sub, chip? }],  *   tabCounts { flags?, evaluations? } (chips on the tab bar), turning18 { title, intro, points, cta } | null.
 * ⚠️ ASSUMPTION: Kwesi has no ward page in Figma (pending link), so only the list fields are filled.
 */
import abena from '../../../../../assets/parent/abena.webp';
import elliot from '../../../../../assets/parent/elliot.webp';
import kwesi from '../../../../../assets/parent/kwesi.webp';

export const WARDS = {
  abena: {
    id: 'abena',
    name: 'Abena Mensah',
    firstName: 'Abena',
    relation: 'Daughter',
    pronoun: 'she',
    possessive: 'her',
    age: 16,
    grade: 'SHS 2 General Science',
    school: 'Achimota School',
    since: '2 Sep',
    photo: abena,
    status: 'active',
    listLine: '16 · SHS 2 · Achimota School · linked automatically 2 Sep',
    action: 'Open →',
    tabCounts: { flags: 2, evaluations: 1 },
    kpis: [
      { value: '72%', label: 'Profile complete', note: '8 of 9 stages' },
      { value: '2 of 4', label: 'Assessments', note: 'Personality, Skills Lab' },
      { value: '3', label: 'Verified skills', note: 'Python, Excel, Typing' },
      { value: 'GHS 85', label: 'Starter wallet', note: '180 Cycles' },
    ],
    activity: [
      {
        id: 'badge',
        icon: 'star',
        title: 'Earned the Python Coding badge',
        sub: 'Today · Skills Lab · 6 of 6 correct',
      },
      {
        id: 'module',
        icon: 'book',
        title: 'Finished Module 3 · SQL for Data Analysis',
        sub: 'Yesterday · GTH Academy',
      },
      {
        id: 'volunteer',
        icon: 'heart',
        title: 'Applied to volunteer: Accra Library coding club',
        sub: '15 Oct · volunteer role',
      },
      {
        id: 'cert',
        icon: 'file',
        title: 'Added a certificate · waiting for you',
        sub: '14 Oct · hidden from recruiters until you review',
        chip: 'Your review',
      },
    ],
    turning18: {
      title: 'Abena turns 18 on 12 March',
      intro: 'In 30 days her account becomes a full talent account. Here’s what changes for you.',
      points: [
        { icon: 'user', text: 'She manages her own profile, wallet and settings.' },
        {
          icon: 'shield',
          text: 'Opt-out and flags end. Your past evaluations stay on her profile.',
        },
        {
          icon: 'users',
          text: 'She can keep you as a trusted contact, so you still get milestone news.',
        },
        { icon: 'wallet', text: 'Her Starter wallet upgrades after a quick ID check.' },
      ],
      cta: 'Send Abena a note',
    },
  },
  elliot: {
    id: 'elliot',
    name: 'Elliot Mensah',
    firstName: 'Elliot',
    relation: 'Son',
    pronoun: 'he',
    possessive: 'his',
    age: 15,
    grade: 'SHS 1 General Science',
    school: 'Achimota School',
    since: '9 Sep',
    photo: elliot,
    status: 'active',
    listLine: '15 · SHS 1 · General Science · linked automatically 9 Sep',
    action: 'Open →',
    tabCounts: { evaluations: 1 },
    kpis: [
      { value: '44%', label: 'Profile complete', note: '4 of 9 stages' },
      { value: '1 of 4', label: 'Assessments', note: 'Personality' },
      { value: '1', label: 'Verified skills', note: 'Typing · 52 wpm' },
      { value: 'No wallet yet', label: 'Starter wallet', note: '60 Cycles waiting' },
    ],
    activity: [
      {
        id: 'personality',
        icon: 'star',
        title: 'Finished his personality profile',
        sub: 'Today · 15 minutes',
      },
      { id: 'club', icon: 'book', title: 'Joined Achimota Science Club', sub: 'Yesterday · club' },
      {
        id: 'eval',
        icon: 'heart',
        title: 'Mr Owusu sent an evaluation',
        sub: '16 Oct · waiting for your OK',
      },
      {
        id: 'typing',
        icon: 'file',
        title: 'Typing speed verified',
        sub: '12 Oct · Skills Lab',
        chip: 'Verified',
      },
    ],
    turning18: null,
  },
  kwesi: {
    id: 'kwesi',
    name: 'Kwesi Mensah',
    firstName: 'Kwesi',
    relation: 'Nephew',
    pronoun: 'he',
    possessive: 'his',
    age: 15,
    photo: kwesi,
    status: 'pending',
    listLine: 'Request sent 17 Oct · waiting for Kwesi to accept',
    action: 'Resend',
    tabCounts: {},
    kpis: [],
    activity: [],
    turning18: null,
  },
};

export const WARD_LIST = [WARDS.abena, WARDS.elliot, WARDS.kwesi];

export const WARDS_TITLE = 'My wards';
export const WARDS_SUBTITLE =
  'Each ward has their own controls. Changes for one don’t affect the other.';

export const STATUS_LEGEND = [
  { id: 'active', chip: 'Active', text: 'Using GTH. You’re informed and can flag or opt out.' },
  { id: 'opted', chip: 'Opted out', text: 'Access paused by you. Data kept; reverse any time.' },
  { id: 'pending', chip: 'Pending link', text: 'Waiting for your ward to accept your request.' },
];

// Tab bar (PW-02): id matches ?tab=; `routed` false = Figma draws the tab but no page is designed for it yet.
// Profile and Flags are designed by the Flags and corrections canvas (parent/flags/).
export const WARD_TABS = [
  { id: 'overview', label: 'Overview', routed: true },
  { id: 'profile', label: 'Profile', routed: true },
  { id: 'flags', label: 'Flags', routed: true, count: 'flags' },
  { id: 'evaluations', label: 'Evaluations', routed: true, count: 'evaluations' },
  { id: 'wallet', label: 'Wallet', routed: true },
  { id: 'crew', label: 'Crew', routed: true },
  { id: 'activity', label: 'Activity', routed: true },
];
