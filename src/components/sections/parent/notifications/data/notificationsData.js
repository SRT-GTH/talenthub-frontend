/*
 * notificationsData — mock notifications of the parent screens (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 09 Notifications and milestones" 10057:67396).
 * Sources: PN-01 10035:530 (bell panel), PN-04 10043:1351 (page, All), PN-03 10043:913 / PN-03b 10056:156668 (milestone shared with you), PN-05b 10079:1025 (Abena created a GTH account).
 * Every string is verbatim from the frames' `characters`. Shaped like the future API payload (id, kind, icon, title, sub, chip, to).
 * ⚠️ ASSUMPTION: where a row goes (`to`) is not drawn in Figma; each row opens the screen that already exists for it (Certificate / Payment → To review, Elliot rows → Elliot's ward page).
 * ⚠️ ASSUMPTION: the "Milestones" (3), "Ward activity" (5) tab counts are as drawn, but PN-04 only draws one Milestone row and three Ward-activity rows, so those tabs list the drawn rows only.
 */
import iconHeart from '../../../../../assets/parent/notif-heart.svg';
import iconFile from '../../../../../assets/parent/notif-file.svg';
import iconFileCheck from '../../../../../assets/parent/notif-file-check.svg';
import iconWallet from '../../../../../assets/parent/notif-wallet.svg';
import iconUserCheck from '../../../../../assets/parent/notif-user-check.svg';
import iconUserPlus from '../../../../../assets/parent/notif-user-plus.svg';
import iconStar from '../../../../../assets/parent/notif-star.svg';
import iconRefresh from '../../../../../assets/parent/notif-refresh.svg';
import iconUser from '../../../../../assets/parent/notif-user.svg';
import iconBell from '../../../../../assets/parent/notif-bell.svg';
import spotTrophy from '../../../../../assets/parent/notif-spot-trophy.svg';
import spotWardJoined from '../../../../../assets/parent/notif-spot-ward-joined.svg';
import abenaPhoto from '../../../../../assets/parent/abena.webp';

export const MILESTONE_PATH = '/parent/notifications/milestone';

/* ---- PN-01: the bell panel (5 rows, no chips) ---- */
export const PANEL = {
  title: 'Notifications',
  markAllRead: 'Mark all read',
  items: [
    {
      id: 'milestone',
      icon: iconHeart,
      title: 'Abena wanted you to see this',
      sub: 'She earned a Python Coding badge · 2 min',
      to: MILESTONE_PATH,
    },
    {
      id: 'certificate',
      icon: iconFile,
      title: 'Certificate waiting for you',
      sub: 'Abena · Intro to Python · 1 h',
      to: '/parent/review?tab=certificates',
    },
    {
      id: 'payment',
      icon: iconWallet,
      title: 'Payment request GHS 90.00',
      sub: 'Abena · expires in 46 h · 2 h',
      to: '/parent/review?tab=payments',
    },
    {
      id: 'evaluation',
      icon: iconUserCheck,
      title: 'Elliot reviewed your evaluation',
      sub: 'All 5 items accepted · yesterday',
      to: '/parent/wards/elliot?tab=evaluations',
    },
    {
      id: 'linked',
      icon: iconUserPlus,
      title: 'Elliot linked to your account',
      sub: 'He signed up with your number · 9 Sep',
      to: '/parent/wards/elliot',
    },
  ],
};

/* ---- PN-04: the Notifications page ---- */
export const PAGE = {
  title: 'Notifications',
  newSticker: '4 new',
  tabsLabel: 'Notification types',
  // `kind` is the tab that lists the row (All lists every row).
  tabs: [
    { id: 'all', label: 'All', count: 11 },
    { id: 'approvals', label: 'Approvals', count: 2 },
    { id: 'milestones', label: 'Milestones', count: 3 },
    { id: 'ward-activity', label: 'Ward activity', count: 5 },
    { id: 'from-gth', label: 'From GTH', count: 1 },
  ],
  groups: [
    {
      id: 'today',
      label: 'Today',
      rows: [
        {
          id: 'milestone',
          kind: 'milestones',
          icon: iconStar,
          title: 'Abena wanted you to see this',
          sub: 'She earned the Python Coding badge · 2 min',
          chip: 'Milestone',
          chipTone: 'active',
          to: MILESTONE_PATH,
        },
        {
          id: 'certificate',
          kind: 'approvals',
          icon: iconFileCheck,
          title: 'Certificate waiting for you',
          sub: 'Abena · Intro to Python · 1 h',
          chip: 'Needs you',
          chipTone: 'ink',
          to: '/parent/review?tab=certificates',
        },
        {
          id: 'payment',
          kind: 'approvals',
          icon: iconWallet,
          title: 'Payment request GHS 90.00',
          sub: 'Abena · expires in 46 h · 2 h',
          chip: 'Needs you',
          chipTone: 'ink',
          to: '/parent/review?tab=payments',
        },
      ],
    },
    {
      id: 'this-week',
      label: 'This week',
      rows: [
        {
          id: 'evaluation',
          kind: 'ward-activity',
          icon: iconUserCheck,
          title: 'Elliot reviewed your evaluation',
          sub: 'All 5 items accepted · yesterday',
          chip: 'Ward activity',
          chipTone: 'pending',
          to: '/parent/wards/elliot?tab=evaluations',
        },
        {
          id: 'corrected',
          kind: 'ward-activity',
          icon: iconRefresh,
          title: 'Abena corrected her date of birth',
          sub: 'After your flag · Wed',
          chip: 'Ward activity',
          chipTone: 'pending',
          to: '/parent/wards/abena?tab=flags',
        },
        {
          id: 'linked',
          kind: 'ward-activity',
          icon: iconUser,
          title: 'Elliot linked to your account',
          sub: 'He signed up with your number · 9 Sep',
          chip: 'Ward activity',
          chipTone: 'pending',
          to: '/parent/wards/elliot',
        },
        {
          id: 'weekly-summary',
          kind: 'from-gth',
          icon: iconBell,
          title: 'Your weekly summary is ready',
          sub: 'Sent to WhatsApp every Sunday · Sun',
          chip: 'From GTH',
          chipTone: 'pending',
          to: null,
        },
      ],
    },
  ],
  where: {
    title: 'Where you get these',
    body: 'Approvals also come by WhatsApp and SMS, so you never miss one. Everything else waits here.',
    settings: 'Notification settings',
  },
};

/* ---- PN-03 / PN-03b: a milestone shared with you ---- */
export const MILESTONE = {
  title: 'Abena’s milestone',
  sticker: 'Shared with you',
  eyebrow: 'Abena wanted you to see this',
  headline: 'She earned the Python Coding badge',
  meta: 'Skills Lab · 6 of 6 correct · today, 16:40',
  quote: '“Mummy, I got all six right! Next is SQL.” – Abena',
  spot: spotTrophy,
  photo: abenaPhoto,
  reactionsLabel: 'Send her a quick reaction',
  reactions: [
    { id: 'well-done', label: 'Well done!' },
    { id: 'so-proud', label: 'So proud of you' },
    { id: 'keep-going', label: 'Keep going' },
    { id: 'write-my-own', label: 'Write my own' },
  ],
  view: 'View Abena',
  viewTo: '/parent/wards/abena',
  send: 'Send reaction',
  toastTitle: 'Sent to Abena',
  // ⚠️ ASSUMPTION: PN-03b draws only the "Well done!" toast; the other reactions reuse the same sentence with their own label.
  toastDetail: (label) => `“${label}” — she’ll see it on her home.`,
};

/* ---- PN-05b: in-app notice "Abena created a GTH account" ---- */
export const JOINED_NOTICE = {
  title: 'Abena created a GTH account',
  spot: spotWardJoined,
  body: 'She signed up on 2 Sep and listed you as her mother. Her account is already active. You don’t need to approve it, and you can opt her out at any time.',
  can: {
    title: 'She can',
    items: [
      'Short courses and assessments',
      'Volunteer roles and unpaid internships',
      'Career Buddy, with a tone for her age',
    ],
  },
  cannot: {
    title: 'She can’t',
    items: ['Full-time, part-time or paid jobs', 'Paid gigs', 'Message recruiters directly'],
  },
  note: 'You can flag anything on her profile that looks wrong. Only certificates, teacher evaluations and payments over GHS 50 wait for you.',
  optOut: 'Opt Abena out',
  optOutTo: '/parent/wards/abena?modal=opt-out',
  fine: 'That’s fine',
};
