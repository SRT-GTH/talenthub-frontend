/*
 * Talent Wallet · credit score and payouts — mock data (Figma W-25 … W-27b, canvas 8825:98). Mock only.
 * Verbatim copy from the Figma nodes.
 *   GET /wallet/credit-score | GET /wallet/payouts/:id | GET /wallet/payout-details | notification `salary.received`
 */
export const SALARY_TOAST = {
  title: '+ GHS 1,200.00 from Accra Tech',
  text: 'October stipend · GHS 120 moved to Laptop fund',
  action: 'View',
};

/* ---- W-25 Credit score · Overview ---- */
export const CREDIT = {
  gauge: { score: 712, max: 1000, label: 'out of 1000' },
  chip: 'Good · Low risk',
  title: 'Your talent credit score is 712',
  text: 'Built from your skills and how you use GTH, not just bank history. Lenders on GTH see this score only when you apply.',
  trend: '▲ 18 this month',
  updated: 'Updated 18 Oct · next update 1 Nov',
  factorsHead: {
    title: 'What makes up your score',
    sticker: 'only you can see this',
    link: 'How we calculate it →',
  },
  // fill = Figma bar width / track width (440); colours and chip tones exactly as drawn (the two "Good" chips differ in the file)
  // Focused only (Figma draws it between the first two factor rows; Playful draws the "only you can see this" sticker instead)
  privacyNote: 'Only you, and lenders you apply to. Recruiters never see your score.',
  factors: [
    {
      id: 'assessment',
      label: 'Assessment performance',
      fill: 361 / 440,
      color: '#387455',
      chip: 'Strong',
      tone: 'ok',
    },
    {
      id: 'course',
      label: 'Course completion',
      fill: 308 / 440,
      color: '#7faf8c',
      chip: 'Good',
      tone: 'grey',
    },
    {
      id: 'profile',
      label: 'Profile completeness',
      fill: 343 / 440,
      color: '#387455',
      chip: 'Good',
      tone: 'ok',
    },
    {
      id: 'engagement',
      label: 'Engagement on GTH',
      fill: 396 / 440,
      color: '#387455',
      chip: 'Strong',
      tone: 'ok',
    },
    {
      id: 'job',
      label: 'Job placement',
      fill: 154 / 440,
      color: '#f5c344',
      chip: 'Building',
      tone: 'warn',
    },
    {
      id: 'payment',
      label: 'Payment history',
      fill: 264 / 440,
      color: '#7faf8c',
      chip: 'Fair',
      tone: 'grey',
    },
  ],
  improve: {
    label: 'Raise your score',
    rows: [
      ['Verify Power BI in Skills Lab', '+12'],
      ['Finish SQL for Data Analysis', '+15'],
      ['Keep auto-save going 3 months', '+8'],
    ],
  },
  history: {
    title: 'Last 6 months',
    // h = bar height in px as drawn (the Nov and Dec bars repeat the May and Jun heights in the file — kept as drawn)
    bars: [
      { id: 'may', month: 'May', value: '620', h: 36 },
      { id: 'jun', month: 'Jun', value: '641', h: 49 },
      { id: 'jul', month: 'Jul', value: '655', h: 57 },
      { id: 'aug', month: 'Aug', value: '668', h: 65 },
      { id: 'sep', month: 'Sep', value: '694', h: 80 },
      { id: 'oct', month: 'Oct', value: '712', h: 91, now: true },
      { id: 'nov', month: 'Nov', value: '725', valueFocused: '730', h: 36 },
      { id: 'dec', month: 'Dec', value: '740', valueFocused: '748', h: 49 },
    ],
  },
};

export const SCORE_MODAL = {
  title: 'How your score works',
  // text node named "cert line" in the file; characters read from the node (REST).
  subtitle: 'A fair score for people building their first credit history.',
  weights: [
    ['Assessments and verified skills', '30%'],
    ['Courses finished', '20%'],
    ['Payment history in your wallet', '20%'],
    ['Profile completeness', '10%'],
    ['Engagement on GTH', '10%'],
    ['Jobs and internships', '10%'],
  ],
  text: 'Scores run from 300 to 1000: Building (under 550), Fair (550–649), Good (650–749), Strong (750+). With your permission we can also add bank data through open banking.',
  bank: 'Connect my bank',
  ok: 'Got it',
};

/* ---- W-26 Payout · Gig in escrow ---- */
export const ESCROW = {
  chip: 'In escrow · held safely by GTH',
  title: 'Hubtel UX test · GHS 150.00',
  text: 'Hubtel paid this into escrow before you started. It’s released to your wallet as soon as they approve your work — or automatically 7 days after you submit if they don’t respond.',
  steps: [
    { id: 'funded', label: 'Funded', note: '12 Oct', state: 'done' },
    { id: 'submitted', label: 'Work submitted', note: '16 Oct', state: 'done' },
    { id: 'reviewing', label: 'Hubtel reviewing', note: 'Auto-release 23 Oct', state: 'now' },
    { id: 'paid', label: 'Paid to wallet', note: '—', state: 'todo' },
  ],
  message: 'Message Hubtel',
  dispute: 'Raise a dispute',
  other: 'Other payouts',
  rows: [
    {
      id: 'stipend',
      kind: 'in',
      title: 'Internship stipend · Accra Tech',
      meta: '31 Oct · monthly payroll',
      amount: 'GHS 1,200.00',
      money: 'out',
      status: 'Scheduled',
      tone: 'ok',
    },
    {
      id: 'gig',
      kind: 'in',
      title: 'Gig · Farmerline survey',
      meta: '22 Sep · released from escrow',
      amount: '+ GHS 200.00',
      money: 'in',
      status: 'Paid',
      tone: 'ok',
    },
  ],
  guarantee: {
    label: 'Payment guarantee',
    text: 'Every gig on GTH is paid into escrow first. If you deliver what was agreed, you get paid.',
  },
};

/* ---- W-27 Get paid to your wallet (employer details) ---- */
export const SALARY = {
  title: 'Get your salary paid here',
  text: 'Share these details with your employer’s payroll team. Employers on GTH can also pay you directly from their dashboard.',
  rows: [
    ['Account name', 'Kofi Agyekum'],
    ['Wallet ID', 'GTH-W-4F2A-9C11'],
    ['Account number', '1440 2290 7781'],
    ['Bank', 'GTH Wallet · held with Fidelity Bank Ghana'],
    ['Branch / sort code', 'Accra Central · 240101'],
  ],
  copy: 'Copy all details',
  letter: 'Download letter (PDF)',
  share: 'Share by WhatsApp',
  paying: {
    title: 'Paying you on GTH',
    rows: [
      { id: 'accra', name: 'Accra Tech Ltd', note: 'Internship · monthly, last working day' },
      { id: 'hubtel', name: 'Hubtel', note: 'Gigs · escrow' },
    ],
  },
  split: {
    label: 'Payday split',
    text: 'Send 10% of every salary to your Laptop fund automatically.',
    action: 'Turn on →',
  },
};

// W-27b: the Home page after the October stipend landed (balance, payout tile, recent activity, savings differ from W-06).
export const PAYDAY_HOME = {
  balance: 'GHS 2,320.50',
  sticker: 'only you can see this',
  payout: {
    id: 'stipend-nov',
    title: 'November stipend · Accra Tech',
    note: 'November · paid to your wallet on 30 Nov',
    amount: 'GHS 1,200.00',
    status: 'Scheduled',
    tone: 'ok',
  },
  activity: [
    {
      id: 'p-stipend',
      kind: 'in',
      title: 'Internship stipend · Accra Tech',
      meta: 'Today, 08:02 · October stipend',
      amount: '+ GHS 1,200.00',
      money: 'in',
      status: 'Completed',
      tone: 'ok',
    },
    {
      id: 'p-split',
      kind: 'out',
      title: 'Payday split · Laptop fund',
      meta: 'Today, 08:02 · 10% of your stipend',
      amount: '− GHS 120.00',
      money: 'out',
      status: 'Saved',
      tone: 'ok',
    },
  ],
  savedPot: 'GHS 540',
  savedProgress: 540 / 2500,
};
