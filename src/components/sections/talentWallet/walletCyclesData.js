/*
 * Talent Wallet · Cycles, savings and under-18s — mock data (Figma W-14 … W-18, canvas 8822:98). Mock only.
 * Verbatim copy from the Figma nodes.
 *   GET /wallet/cycles | GET /wallet/cycles/ledger | POST /wallet/cycles/redeem | GET /wallet/savings | GET /wallet/under18
 */
export const CYCLES_HERO = {
  label: 'Your Cycles',
  note: 'Cycles are real rewards for verified learning. XP still counts for your level and streak — Cycles are what you can spend.',
  redeem: 'Redeem Cycles',
  how: 'How Cycles work',
  rate: {
    label: 'This week’s rate',
    value: '10 Cycles = GHS 1',
    note: 'Rates can change, like airline miles. We give 14 days’ notice.',
  },
  // W-14 / W-14b show 340 Cycles; W-15 (Redeem Cycles) is drawn with 620.
  default: {
    value: '340',
    worth: '≈ GHS 34.00',
    progress: 0.68,
    line: '160 more Cycles to unlock redeeming (minimum 500)',
  },
  ready: {
    value: '620',
    worth: '≈ GHS 62.00',
    progress: 1,
    line: 'Ready to redeem · minimum 500 Cycles',
  },
};

export const CYCLES_LEDGER = {
  title: 'Earned and spent',
  sticker: 'worth GHS 34',
  link: 'Export →',
  rows: [
    {
      id: 'sql4',
      kind: 'star',
      title: 'SQL Module 4 · quick check passed',
      meta: 'Today · verified by GTH Academy',
      amount: '+ 40',
      money: 'in',
      chip: 'Course',
      tone: 'ok',
    },
    {
      id: 'personality',
      kind: 'star',
      title: 'Personality profile completed',
      meta: '12 Oct · assessment',
      amount: '+ 100',
      money: 'in',
      chip: 'Assessment',
      tone: 'ok',
    },
    {
      id: 'excel',
      kind: 'star',
      title: 'Skills Lab · Excel verified',
      meta: '9 Oct · 6 of 6 correct',
      amount: '+ 80',
      money: 'in',
      chip: 'Skills Lab',
      tone: 'ok',
    },
    {
      id: 'discoverable',
      kind: 'star',
      title: 'Profile reached Discoverable',
      meta: '2 Oct · milestone',
      amount: '+ 50',
      money: 'in',
      chip: 'Profile',
      tone: 'ok',
    },
    {
      id: 'redeemed',
      kind: 'out',
      title: 'Redeemed to cash',
      meta: '28 Sep · GHS 20.00 to wallet',
      amount: '− 200',
      money: 'out',
      chip: 'Redeemed',
      tone: 'grey',
    },
  ],
};

export const WAYS_TO_EARN = {
  label: 'Ways to earn',
  rows: [
    ['Finish a course', '+150'],
    ['Pass a module quick check', '+40'],
    ['Verify a skill in Skills Lab', '+80'],
    ['Complete your profile', '+50'],
    ['Apply to a matched role', '+10'],
  ],
  note: 'Only verified activity earns Cycles. Self-reported skills don’t.',
};

export const SPEND_CYCLES = {
  title: 'Spend Cycles on',
  rows: [
    { id: 'cash', icon: 'wallet', title: 'Cash', note: 'Into your wallet balance' },
    { id: 'tuition', icon: 'book', title: 'Tuition', note: 'Pay part of a course or loan' },
    { id: 'boost', icon: 'chart', title: 'Savings boost', note: 'Top up a savings pot +10% extra' },
  ],
};

export const CYCLES_TOAST = {
  title: '+40 Cycles · SQL Module 4 passed',
  text: 'Verified by GTH Academy · you now have 340 Cycles',
  action: 'View',
};

/* ---- W-15 Redeem Cycles (dialog) ---- */
export const REDEEM = {
  title: 'Redeem Cycles',
  subtitle: 'You have 620 Cycles · worth GHS 62.00 this week.',
  field: 'Cycles to redeem',
  hint: 'Redeem in steps of 100. Minimum 500.',
  use: 'Use them for',
  defaultCycles: '600',
  min: 500,
  step: 100,
  held: 620,
  perGhs: 10,
  cancel: 'Cancel',
  confirm: (n) => `Redeem ${n} Cycles`,
  options: [
    { id: 'cash', title: 'Cash to my wallet', note: (g, f) => `GHS ${f(g)} · instant` },
    {
      id: 'tuition',
      title: 'Tuition · Power BI Basics',
      note: (g, f) => `Covers GHS ${f(Math.min(g, 120))} of GHS 120.00`,
    },
    {
      id: 'boost',
      title: 'Boost my Laptop fund',
      note: (g, f) => `GHS ${f(g * 1.1)} · includes +10% boost`,
    },
  ],
};

/* ---- W-15b "Almost there" (dialog) ---- */
export const ALMOST = {
  title: 'Almost there',
  subtitle: 'Redeeming starts at 500 Cycles. You have 340.',
  progress: 340 / 500,
  fastest: 'Fastest ways to earn 160 more',
  ways: [
    { id: 'sql', text: 'Finish SQL for Data Analysis (3 modules left)', chip: '+150' },
    { id: 'pbi', text: 'Verify Power BI in Skills Lab', chip: '+80' },
  ],
  close: 'Close',
  resume: 'Resume SQL module 5',
};

/* ---- W-16 Savings pot · Laptop fund ---- */
export const SAVINGS_POT = {
  label: 'Savings pot',
  name: 'Laptop fund',
  saved: 'GHS 420.00',
  goal: 'of GHS 2,500 · by March 2027',
  progress: 147.84 / 880,
  stats: [
    { id: 'auto', label: 'Auto-save', value: 'GHS 50 every Friday' },
    { id: 'boosts', label: 'Boosts earned', value: 'GHS 21.00' },
    { id: 'track', label: 'On track for', value: 'Feb 2027' },
  ],
  actions: { add: 'Add money', edit: 'Edit goal', move: 'Move to balance' },
  boosts: {
    title: 'Savings boosts',
    sticker: 'worth GHS 34',
    link: 'How boosts work →',
    rows: [
      {
        id: 'excel',
        kind: 'star',
        title: 'Course finished · Excel for Business',
        meta: '5 Oct · +5% of your pot',
        amount: '+ GHS 18.00',
        money: 'in',
        status: 'Boost',
        tone: 'warn',
      },
      {
        id: 'cycles',
        kind: 'star',
        title: 'Cycles boost · 30 Cycles',
        meta: '1 Oct · +10% bonus',
        amount: '+ GHS 3.00',
        money: 'in',
        status: 'Boost',
        tone: 'warn',
      },
      {
        id: 'auto',
        kind: 'out',
        title: 'Auto-save',
        meta: 'Every Friday · from balance',
        amount: '+ GHS 50.00',
        money: 'out',
        status: 'Scheduled',
        tone: 'ok',
      },
    ],
  },
  next: {
    label: 'Next boost',
    title: '+5% when you finish SQL',
    text: '3 modules left · about GHS 21.00 into this pot.',
  },
  another: {
    title: 'Start another pot',
    text: 'School fees, a phone, rent. Each pot can have its own goal and auto-save.',
    action: 'New savings pot',
  },
};

/* ---- W-17 / W-18 Under 18 · Starter wallet ---- */
export const UNDER18 = {
  balanceLabel: 'Available balance',
  balance: 'GHS 85.00',
  limit: 'Spending limit GHS 200 a month · anything over GHS 50 needs Mrs Agyekum to approve.',
  actions: { topUp: 'Ask for a top up', redeem: 'Redeem Cycles' },
  can: {
    title: 'What you can do',
    items: [
      {
        id: 'cycles',
        icon: 'star',
        title: 'Earn Cycles',
        text: 'From courses and assessments',
        locked: false,
      },
      {
        id: 'pots',
        icon: 'chart',
        title: 'Save in pots',
        text: 'Your parent can add boosts',
        locked: false,
      },
      {
        id: 'pay',
        icon: 'book',
        title: 'Pay for courses',
        text: 'Under GHS 50 without approval',
        locked: false,
      },
      { id: 'cash', icon: 'out', title: 'Withdraw cash', text: 'Unlocks at 18', locked: true },
      {
        id: 'loans',
        icon: 'card',
        title: 'Loans and credit score',
        text: 'Unlocks at 18',
        locked: true,
      },
    ],
  },
  parent: {
    label: 'Linked parent',
    name: 'Mrs Abena Agyekum',
    text: 'Mother · approves payments over GHS 50 · sees your balance, not your messages.',
    link: 'Manage in Settings → Parent or guardian →',
  },
  at18: {
    label: 'On your 18th birthday',
    text: 'Your Starter wallet upgrades to a full wallet after a quick ID check. Your Cycles and savings come with you.',
  },
};

export const PARENT_REQUEST = {
  title: 'Sent to Mrs Agyekum',
  // text node named "cert line" in the file; characters read from the node (REST).
  subtitle: 'Payments over GHS 50 need a parent’s OK.',
  rows: [
    { label: 'Course', value: 'Python Basics · GTH Academy', tone: 'green' },
    { label: 'Amount', value: 'GHS 90.00', tone: 'green' },
    { label: 'Status', value: 'Waiting · sent 2 min ago', tone: 'amber' },
  ],
  text: 'She got an SMS and a GTH notification. If she approves, you’re enrolled straight away. Requests expire after 48 hours.',
  cancel: 'Cancel request',
  ok: 'OK',
};
