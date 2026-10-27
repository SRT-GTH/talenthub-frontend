/*
 * parentCoreData — the signed-in parent's chrome (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 01 Home and dashboard" 10057:530; persona Emma Mensah, mother of Abena (16) and Elliot (15)).
 * Mock: no backend. The sidebar and top bar read `SIDEBAR_STATES`; the home states pick one (see parentHomeState.js).
 *   none      PD-01c  no ward linked yet           Mother · no ward linked yet · 0 of 3 done · stats 0 0 0 0 · no nav badges
 *   linked    PD-01b / PD-01 / PD-07  two wards    Mother · 2 wards linked · 2 of 3 done · stats 2 4 1 1 · badges To review 4, Ward wallets 1, Notifications 4
 *   caughtUp  PD-01d  nothing waits for the parent Mother · 2 wards linked · 2 of 3 done · stats 2 0 0 0 · badge Notifications 4
 */

export const PARENT = {
  firstName: 'Emma',
  name: 'Emma Mensah',
  short: 'Emma M.',
  verified: true,
  talentLine: 'My career · Banking to data analytics',
};

export const NAV_MAIN = [
  { id: 'home', label: 'Home', to: '/parent' },
  { id: 'wards', label: 'My wards', to: '/parent/wards' },
  { id: 'review', label: 'To review', to: '/parent/review' },
  { id: 'evaluate', label: 'Evaluate', to: '/parent/evaluate' },
  { id: 'wallets', label: 'Ward wallets', to: '/parent/wallets' },
  { id: 'notifications', label: 'Notifications', to: '/parent/notifications' },
];

export const NAV_SECONDARY = [
  { id: 'settings', label: 'Settings', to: '/parent/settings' },
  { id: 'help', label: 'Help and guides', to: '/parent/help' },
  { id: 'career', label: 'My career', to: '/home' },
];

export const SIDEBAR_STATES = {
  none: {
    role: 'Mother · no ward linked yet',
    done: 0,
    doneText: '0 of 3 done',
    note: 'Link your child to get started →',
    stats: [
      { value: '0', label: 'Wards' },
      { value: '0', label: 'To review' },
      { value: '0', label: 'Flag open' },
      { value: '0', label: 'Evaluation' },
    ],
    badges: {},
  },
  linked: {
    role: 'Mother · 2 wards linked',
    done: 2,
    doneText: '2 of 3 done',
    note: '1 payment waits for you →',
    stats: [
      { value: '2', label: 'Wards' },
      { value: '4', label: 'To review' },
      { value: '1', label: 'Flag open' },
      { value: '1', label: 'Evaluation' },
    ],
    badges: { review: '4', wallets: '1', notifications: '4' },
  },
  caughtUp: {
    role: 'Mother · 2 wards linked',
    done: 2,
    doneText: '2 of 3 done',
    note: '1 payment waits for you →',
    stats: [
      { value: '2', label: 'Wards' },
      { value: '0', label: 'To review' },
      { value: '0', label: 'Flag open' },
      { value: '0', label: 'Evaluation' },
    ],
    badges: { notifications: '4' },
  },
};
