/*
 * Recruiter / public preview data — all strings verbatim from Figma (file Bin8roWL8sloyc36IgFMuT).
 *   P-07  recruiter preview     Playful 7573:602  / Focused 8110:371211
 *   PR-02 public link preview   Playful 7584:1691 / Focused 8110:387366
 *   PR-04 recruiter preview, pitch hidden ("updated")  Playful 7584:3137 / Focused 8110:388716
 *   PR-03 "Who sees what" drawer                       Playful 7584:2347 / Focused 8110:387950
 * Demo copy below; a signed-in talent's preview swaps in their own name / numbers through applyPreviewData()
 * (called from applyProfileData with talentProfileLive.js `PREVIEW`). ES module bindings are live, so importers see it.
 */

const DEMO_PREVIEW_BANNER = {
  recruiter: {
    title: 'You’re seeing your profile the way recruiters do',
    sub: 'Edit buttons, your goals, pay hope, streak and who viewed you are hidden.',
  },
  public: {
    title: 'This is what anyone with gth.com/kofi-agyekum sees',
    sub: 'Logged-out visitors: no match score, no CV download, no endorser names. Messaging needs a GTH account.',
  },
  exit: 'Exit preview',
  segments: [
    { id: 'recruiter', label: 'Recruiter' },
    { id: 'public', label: 'Public link' },
  ],
};

/* Hero variants (the owner hero lives in talentProfileTabsData.js `PROFILE_HERO`). */
const DEMO_PREVIEW_HERO = {
  recruiter: {
    sticker: 'Recruiters see these buttons',
    actions: [
      { key: 'shortlist', label: 'Shortlist', tone: 'tertiary' },
      { key: 'cv', label: 'Download CV', tone: 'tertiary' },
      { key: 'message', label: 'Message Kofi', tone: 'primary' },
    ],
    stats: [
      { value: '5', label: 'verified skills' },
      { value: '24', label: 'endorsements' },
      { value: '~1 day', label: 'usually replies' },
    ],
  },
  public: {
    sticker: 'Visitors see these buttons',
    actions: [
      { key: 'copy', label: 'Copy link', tone: 'tertiary' },
      { key: 'join', label: 'Join GTH to message Kofi', tone: 'primary' },
    ],
    stats: [
      { value: '5', label: 'verified skills' },
      { value: '24', label: 'endorsements' },
      { value: 'Oct 2026', label: 'last active' },
    ],
  },
  /* PR-04: the cover chip that replaces the pitch chip once the pitch is hidden. */
  pitchHidden: 'Pitch hidden from recruiters',
};

/* Right rail — recruiter preview (P-07 / PR-04). */
const DEMO_RECRUITER_RAIL = {
  match: {
    eyebrow: 'For your Data Analyst role',
    pct: '82%',
    word: 'match',
    why: ['SQL (verified)', 'Excel', 'Lives in Accra', 'Available Jul 2026'],
    note: 'Recruiters only see this box when they open you from one of their postings.',
  },
  hidden: {
    title: 'Only you see',
    rows: [
      { icon: 'wallet', label: 'Pay hope (GHS 4,000+)' },
      { icon: 'target', label: 'Your goals & milestones' },
      { icon: 'eye', label: 'Who viewed you · 47 views' },
      // Focused frames word XP as "pts" (diff of 7573:602 vs 8110:371211)
      { icon: 'streak', label: 'Streak, XP and level', labelFocused: 'Streak, pts and level' },
      { icon: 'hourglass', label: 'In-progress certs' },
    ],
    link: 'Manage what’s visible →',
  },
  /* PR-04 adds a leading "Pitch video · Just now" row (tinted #faf4e8). */
  pitchRow: { icon: 'video', label: 'Pitch video', chip: 'Just now' },
};

/* Right rail — public link preview (PR-02). */
const DEMO_PUBLIC_RAIL = {
  join: {
    sticker: 'Hiring in Ghana?',
    title: 'Find talent like Kofi',
    body: 'Free recruiter account. Search verified skills, message talent, and post roles.',
    cta: 'Create recruiter account',
  },
  hidden: {
    title: 'Also hidden on the public link',
    rows: [
      { icon: 'video', label: 'Pitch video (recruiters only)' },
      { icon: 'target', label: 'Match score for a role' },
      { icon: 'file', label: 'Download CV' },
      { icon: 'voice', label: 'Endorser names (count only)' },
      { icon: 'phone', label: 'Phone & email' },
      { icon: 'wallet', label: 'Pay hope, goals, views, streak' },
    ],
    link: 'Manage what’s visible →',
  },
};

/* PR-04 overlays: info bar + saved toast (bottom centre of the content column). */
export const PITCH_HIDDEN = {
  info: 'Profiles with a pitch get ~3× more recruiter replies. Turn it back on anytime.',
  toast: 'Saved. Recruiters no longer see your pitch video.',
  undo: 'Undo',
};

/*
 * PR-03 "Who sees what" drawer (Figma 7584:2961). `value` = the audience shown in the frame; `was` = the
 * original value when the frame shows a pending edit (Pitch video "Changed: was Recruiters").
 * audience ids: anyone (globe, green) | recruiters (work, green) | me (lock, ink).
 */
export const VISIBILITY = {
  title: 'Who sees what',
  sub: 'You’re in control. The preview behind updates as you change things.',
  pause: {
    title: 'Pause discovery',
    sub: 'Hide from recruiter search for 30 days. Applications and chats keep going.',
  },
  rows: [
    { key: 'photo', icon: 'image', title: 'Profile photo', value: 'anyone' },
    { key: 'pitch', icon: 'video', title: 'Pitch video', value: 'me', was: 'recruiters' },
    { key: 'location', icon: 'pin', title: 'Location', sub: 'City only (Accra)', value: 'anyone' },
    {
      key: 'endorsers',
      icon: 'voice',
      title: 'Endorser names',
      sub: 'The count is always shown',
      value: 'recruiters',
    },
    { key: 'cv', icon: 'file', title: 'CV download', value: 'recruiters' },
    {
      key: 'phone',
      icon: 'phone',
      title: 'Phone & email',
      sub: 'Shared when you accept a message',
      value: 'me',
    },
    { key: 'pay', icon: 'wallet', title: 'Pay hope', value: 'me' },
    { key: 'goals', icon: 'target', title: 'Goals & milestones', value: 'me' },
    { key: 'badges', icon: 'trophy', title: 'Badges', value: 'anyone' },
    // Focused: "Streak, pts & level" (7584:2961 vs 8110:387950)
    {
      key: 'streak',
      icon: 'streak',
      title: 'Streak, XP & level',
      titleFocused: 'Streak, pts & level',
      value: 'me',
    },
    {
      key: 'views',
      icon: 'eye',
      title: 'Who viewed you',
      sub: 'Always private',
      value: 'me',
      locked: true,
    },
  ],
  note: 'Under 18? Photo, location and messaging stay recruiter-only until a parent approves.',
  // Figma shows "1 unsaved change"; the plural is the same sentence with a count (⚠️ ASSUMPTION — one frame only).
  unsaved: (n) => (n === 1 ? '1 unsaved change' : `${n} unsaved changes`),
  changed: (was) => `Changed: was ${was}`,
  cancel: 'Cancel',
  save: 'Save changes',
};

/* ---- live swap ---- */
export let PREVIEW_BANNER = DEMO_PREVIEW_BANNER;
export let PREVIEW_HERO = DEMO_PREVIEW_HERO;
export let RECRUITER_RAIL = DEMO_RECRUITER_RAIL;
export let PUBLIC_RAIL = DEMO_PUBLIC_RAIL;

/* d = talentProfileLive.js `PREVIEW` ({ banner, hero, recruiterRail, publicRail }), or null for the demo. */
export const applyPreviewData = (d) => {
  PREVIEW_BANNER = d?.banner ? { ...DEMO_PREVIEW_BANNER, ...d.banner } : DEMO_PREVIEW_BANNER;
  PREVIEW_HERO = d?.hero ? { ...DEMO_PREVIEW_HERO, ...d.hero } : DEMO_PREVIEW_HERO;
  RECRUITER_RAIL = d?.recruiterRail ? { ...DEMO_RECRUITER_RAIL, ...d.recruiterRail } : DEMO_RECRUITER_RAIL;
  PUBLIC_RAIL = d?.publicRail ? { ...DEMO_PUBLIC_RAIL, ...d.publicRail } : DEMO_PUBLIC_RAIL;
};
