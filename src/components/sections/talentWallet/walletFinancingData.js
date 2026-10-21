/*
 * Talent Wallet · tuition financing — mock data (Figma W-20 … W-24, canvas 8824:98). Mock only: nothing is applied for, approved or paid.
 * Copy is read from the Figma node tree (text layer names = their characters); the three amount-field hints are read off the export.
 *   GET /wallet/financing/eligibility | POST /wallet/financing/applications | GET /wallet/financing/offer | GET /wallet/financing/loan
 */
export const FIN_LANDING = {
  chip: 'You could borrow up to GHS 3,000',
  title: 'Learn now, pay later : and pay less as you learn.',
  titleFocused: 'Learn now, pay later — and pay less as you learn.',
  text: 'Skills loans go straight to the training provider. Every module you pass earns credits that cut what you owe. Repay monthly, after you start work, or as a share of income.',
  terms: [
    { id: 'from', label: 'From', value: '12% a year' },
    { id: 'decision', label: 'Decision', value: 'Within 48 hours' },
    { id: 'first', label: 'First repayment', value: 'After you start work' },
    { id: 'learn', label: 'Earn-as-you-learn', value: 'Up to 20% off' },
  ],
  apply: 'Apply for funding',
  how: 'How it works',
  courses: {
    title: 'Courses you could fund',
    sticker: 'for verified courses',
    link: 'From your matches →',
    rows: [
      {
        id: 'da',
        title: 'Data Analytics Bootcamp · AmaliTech',
        meta: '12 weeks · verified provider · +12% match to Data Analyst',
        price: 'GHS 2,400',
      },
      {
        id: 'pbi',
        title: 'Power BI Professional · GTH Academy',
        meta: '6 weeks · certificate · +6% match',
        price: 'GHS 600',
      },
      {
        id: 'cloud',
        title: 'Cloud Practitioner · Ghana Tech Lab',
        meta: '8 weeks · exam voucher included',
        price: 'GHS 1,850',
      },
    ],
    chip: 'Fundable',
  },
};

export const FIN_APPLY = {
  title: 'Apply for a skills loan',
  text: 'Takes about 4 minutes. Checking your eligibility doesn’t affect your score.',
  course: {
    label: 'Course',
    value: 'Data Analytics Bootcamp',
    hint: 'AmaliTech · starts 3 Nov · 12 weeks',
  },
  fee: { label: 'Course fee (GHS)', value: '2,400.00', hint: 'Paid straight to AmaliTech' },
  purposeLabel: 'What is it for?',
  purposes: ['Tuition', 'Materials and laptop', 'Transport and living'],
  repayLabel: 'How would you like to repay?',
  repay: [
    { id: 'monthly', title: 'Monthly from now', note: 'GHS 215 × 12 months' },
    { id: 'after', title: 'After I start work', note: 'Nothing for 6 months, then GHS 238 × 12' },
    { id: 'share', title: 'Share of income', note: '8% of salary for 24 months, capped' },
  ],
  income: {
    label: 'Monthly income (optional)',
    value: 'GHS 1,200 · internship stipend',
    hint: 'Helps us offer a better rate. We can read it from your wallet.',
  },
  agree: 'By applying you agree to a soft credit check.',
  save: 'Save for later',
  submit: 'Submit application',
  estimate: {
    label: 'Your estimate',
    value: 'GHS 238 / month',
    text: 'From May 2027 for 12 months · about 14% a year with your score of 712.',
    note: 'Pass all 12 modules to cut up to GHS 480.',
  },
};

export const FIN_RECEIVED = {
  chip: 'Decision within 48 hours · by Wed 21 Oct',
  title: 'We’re reviewing your application',
  text: 'GHS 2,400 for Data Analytics Bootcamp at AmaliTech. We’ll notify you by SMS and on GTH as soon as there’s a decision.',
  timeline: [
    { id: 'received', dot: '#387455', label: 'Application received', note: 'Today, 11:05' },
    { id: 'check', dot: '#387455', label: 'Talent credit check', note: 'Done · 712 Good' },
    { id: 'provider', dot: '#f5c344', label: 'Provider confirmed', note: 'AmaliTech · waiting' },
    { id: 'decision', dot: '#d9dcd3', label: 'Decision', note: 'By Wed 21 Oct' },
  ],
  withdraw: 'Withdraw application',
};

export const FIN_OFFER = {
  chip: 'Approved · offer valid until 28 Oct',
  title: 'You’re approved for GHS 2,400',
  text: 'Paid straight to AmaliTech when you accept. You don’t repay anything until May 2027.',
  terms: [
    { id: 'amount', label: 'Amount', value: 'GHS 2,400.00' },
    { id: 'rate', label: 'Rate', value: '14% a year (fixed)' },
    { id: 'monthly', label: 'Monthly', value: 'GHS 238 × 12' },
    { id: 'total', label: 'Total to repay', value: 'GHS 2,856.00' },
  ],
  learn:
    'Earn-as-you-learn: every module you pass takes GHS 40 off. Pass all 12 and you repay GHS 2,376.',
  agreement: 'Read the full loan agreement (PDF)',
  decline: 'Decline',
  accept: 'Accept and pay AmaliTech',
  plan: {
    title: 'Repayment plan',
    rows: [
      ['Nov 2026 – Apr 2027', 'GHS 0 · grace'],
      ['May 2027 – Apr 2028', 'GHS 238 / month'],
      ['Early repayment', 'Free, any time'],
    ],
    note: 'Lost your job? Pause up to 3 months, no penalty.',
  },
};

export const FIN_DECLINED = {
  chip: 'Not approved this time',
  title: 'Not yet — here’s how to get there',
  titleFocused: 'Not yet : here’s how to get there',
  text: 'Your score of 512 is below the 550 we need for a GHS 2,400 loan. This doesn’t affect your score. You can apply again in 30 days.',
  fastest: 'Fastest ways to reach 550',
  ways: [
    { id: 'skills', text: 'Verify 2 skills in Skills Lab', chip: '+20 to +30' },
    { id: 'course', text: 'Finish a short course (Power BI Basics)', chip: '+15' },
    { id: 'profile', text: 'Reach Discoverable on your profile', chip: '+10' },
  ],
  score: 'See my score',
  smaller: 'Fund a smaller course',
  other: {
    label: 'Other options',
    text: 'Scholarships matched to you: 3 open now, including the MTN Data Skills award (GHS 2,000).',
    link: 'See scholarships →',
  },
};

export const FIN_LOAN = {
  label: 'Skills loan · Data Analytics Bootcamp',
  left: 'GHS 2,160.00',
  of: 'left of GHS 2,400 · on track',
  progress: 88 / 880,
  stats: [
    { id: 'credits', label: 'Learning credits', value: '− GHS 240 (6 of 12 modules)' },
    { id: 'next', label: 'Next payment', value: 'GHS 238 · 1 May 2027' },
    { id: 'status', label: 'Status', value: 'Grace period · course in progress' },
  ],
  actions: { early: 'Pay early', change: 'Change repayment plan', pause: 'Pause payments' },
  activity: {
    title: 'Loan activity',
    sticker: 'for verified courses',
    link: 'Statement →',
    rows: [
      {
        id: 'm6',
        kind: 'star',
        title: 'Learning credit · Module 6 passed',
        meta: '2 Dec',
        metaFocused: 'Today · 14 Jan 2027',
        amount: '− GHS 40.00',
        money: 'in',
        status: 'Credit',
        tone: 'warn',
      },
      {
        id: 'm5',
        kind: 'star',
        title: 'Learning credit · Module 5 passed',
        meta: '25 Nov',
        metaFocused: '7 Jan 2027',
        amount: '− GHS 40.00',
        money: 'in',
        status: 'Credit',
        tone: 'warn',
      },
      {
        id: 'paid',
        kind: 'out',
        title: 'Paid to AmaliTech',
        meta: '29 Oct 2026 · tuition, before the 3 Nov start',
        amount: 'GHS 2,400.00',
        money: 'out',
        status: 'Disbursed',
        tone: 'ok',
      },
    ],
  },
  upcoming: {
    title: 'Upcoming payments',
    rows: [
      ['1 May 2027', 'GHS 238.00'],
      ['1 Jun 2027', 'GHS 238.00'],
      ['1 Jul 2027', 'GHS 238.00'],
    ],
    note: 'Auto-pay from your wallet is on.',
  },
};
