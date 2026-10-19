/*
 * Pixel Perfect mock data — Figma SL-GS06 "Screen 2" (Playful 7943:7681 / Focused 8110:496131). Shaped like
 * `GET /skills-lab/games/pixel-perfect` (screens with their hidden issues) + `POST …/screens/:n/submit`.
 *
 * DRAWN: screen 2 (the MoMo transfer phone, issue 1 "Title is too faint", issue 2 "Send button is too small", the "???" card
 * "One more to go. Look at the hierarchy.", header copy, "1 hint left", "Screen 1: 3 of 3 found").
 * ⚠️ ASSUMPTION: the third drawn issue is the oversized "Schedule for later" button (hierarchy) and its revealed copy; screens
 * 1, 3, 4, 5, 6 reuse the same phone template with other defects (their titles, copy and recipients), one hint per run,
 * "Submit screen" unlocks at 3 of 3 (or after 5 stray taps), +15 XP per screen / +20 pass bonus.
 *
 * Defect kinds → issue copy (title + body). `area` = the phone element that carries the defect.
 */
export const PIXEL_PERFECT = {
  gameId: 'pixel-perfect',
  title: 'Skills Lab · Pixel Perfect',
  label: 'Pixel Perfect',
  subtitle: 'UI/UX design · 6 screens · Find 14 of 18 to earn Verified',
  skill: 'UI/UX design',
  total: 6,
  perScreen: 3,
  passMark: 14,
  baseXp: 240,
  streakDays: 7,
  hintCost: 5,
  hints: 1,
  screenXp: 15,
  passBonusXp: 20,
  strayLimit: 5,
  checks: ['Contrast', 'Tap targets', 'Hierarchy'],
};

export const DEFECTS = {
  title: {
    group: 'Contrast',
    title: 'Title is too faint',
    body: 'Contrast is about 1.6:1. It needs 4.5:1 for body text.',
  },
  send: {
    group: 'Tap targets',
    title: 'Send button is too small',
    body: 'Tap target is 24px. Make it at least 44px.',
  },
  schedule: {
    group: 'Hierarchy',
    // ⚠️ ASSUMPTION copy (Figma only draws "???" / "One more to go. Look at the hierarchy.")
    title: 'Two buttons shout at once',
    body: 'Schedule for later is as loud as Send. Make one clear main action.',
  },
  amount: {
    group: 'Hierarchy',
    title: 'Amount is too small',
    body: 'The amount is the point of this screen. Make it the biggest thing on it.',
  },
  chips: {
    group: 'Tap targets',
    title: 'Recipient chips are too tight',
    body: 'Chips are 22px tall. Make them at least 44px to tap.',
  },
  note: {
    group: 'Contrast',
    title: 'Placeholder is too faint',
    body: 'Contrast is about 1.6:1. Hint text still needs 4.5:1.',
  },
};

// ⚠️ ASSUMPTION for every screen but #2 (drawn).
export const SCREENS = [
  {
    topic: 'Pay a bill',
    blurb: 'A bill payment screen for a first-time user in Kumasi. Tap anything that looks off.',
    heading: 'Pay ECG',
    amount: 'GH₵ 120.00',
    recipients: ['Home', 'Shop', 'Mum'],
    note: 'Meter number',
    defects: ['amount', 'chips', 'note'],
  },
  {
    // DRAWN
    topic: 'Send money',
    blurb: 'A MoMo transfer screen for first-time users in Tamale. Tap anything that looks off.',
    heading: 'Send money',
    amount: 'GH₵ 250.00',
    recipients: ['Ama', 'Kojo', 'Esi'],
    note: 'Reference (optional)',
    defects: ['title', 'send', 'schedule'],
  },
  {
    topic: 'Buy airtime',
    blurb: 'An airtime top-up screen for a trader in Takoradi. Tap anything that looks off.',
    heading: 'Buy airtime',
    amount: 'GH₵ 20.00',
    recipients: ['Mine', 'Kojo', 'Esi'],
    note: 'Network (optional)',
    defects: ['title', 'chips', 'schedule'],
  },
  {
    topic: 'Cash out',
    blurb: 'A cash-out screen for an agent in Ho. Tap anything that looks off.',
    heading: 'Cash out',
    amount: 'GH₵ 500.00',
    recipients: ['Agent 1', 'Agent 2', 'Agent 3'],
    note: 'Reference (optional)',
    defects: ['amount', 'note', 'send'],
  },
  {
    topic: 'Save money',
    blurb: 'A savings goal screen for a student in Cape Coast. Tap anything that looks off.',
    heading: 'Save for fees',
    amount: 'GH₵ 80.00',
    recipients: ['Weekly', 'Monthly', 'Once'],
    note: 'Goal name',
    defects: ['title', 'amount', 'chips'],
  },
  {
    topic: 'Pay school fees',
    blurb: 'A school fees screen for a parent in Sunyani. Tap anything that looks off.',
    heading: 'Pay fees',
    amount: 'GH₵ 900.00',
    recipients: ['Term 1', 'Term 2', 'Term 3'],
    note: 'Student ID',
    defects: ['note', 'send', 'schedule'],
  },
];

export const PIXEL_FRAMES = {
  GS06: { screen: 1, scores: [3], found: ['title', 'send'], hints: 1, hintArea: null },
};
