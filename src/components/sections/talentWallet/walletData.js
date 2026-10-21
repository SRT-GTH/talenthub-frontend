/*
 * Talent Wallet — mock data, shaped like the future API payloads (frontend-only, nothing is stored or sent).
 * Every string is verbatim from the Figma node `characters` (canvas 8817:693, Playful + Focused read identical copy).
 *
 *   GET /wallet                      -> WALLET (summary, balance, linked method, status)
 *   GET /wallet/payouts              -> COMING_IN
 *   GET /wallet/transactions         -> TRANSACTIONS (grouped by month here), TRANSACTION_FILTERS, TRANSACTION_TOTAL
 *   GET /wallet/statements           -> STATEMENTS
 *   GET /wallet/summary?month=…      -> MONTH_SUMMARY
 *   GET /wallet/cycles | /savings | /credit-score -> CYCLES_CARD, SAVINGS_CARD, CREDIT_CARD (Home cards)
 *   POST /wallet/topups | /wallet/withdrawals     -> TOPUP, WITHDRAW (dialogs, no request is made)
 */

/* ---- page chrome (W-06 … W-13) ---- */
export const WALLET_COPY = {
  title: 'Wallet',
  kycSticker: 'KYC verified',
  subtitle: 'Get paid for internships and gigs, earn Cycles for learning, and pay for training.',
  // Playful-only header art (component "GTH · Messages header art", copy changed per page)
  art: { linked: 'MTN MoMo linked', sticker: 'Get paid in minutes', week: '+200 Cycles this week' },
};

export const WALLET_TAB_LIST = [
  { id: 'overview', label: 'Overview', count: null },
  { id: 'transactions', label: 'Transactions', count: '24' },
  { id: 'cycles', label: 'Cycles', count: '340' },
  { id: 'financing', label: 'Financing', count: null },
  { id: 'credit', label: 'Credit score', count: null },
];

/* ---- W-06 Home ---- */
export const WALLET = {
  id: 'GTH-W-4F2A-9C11',
  balanceLabel: 'Available balance',
  balance: 'GHS 1,240.50',
  hold: 'GHS 150.00 on hold · Hubtel gig in escrow, released when the work is approved',
  actions: { topUp: 'Top up', withdraw: 'Withdraw', redeem: 'Redeem Cycles' },
  meta: [
    { id: 'wallet', label: 'Wallet ID', value: 'GTH-W-4F2A-9C11' },
    { id: 'withdraw', label: 'Withdraw to', value: 'MTN MoMo · 024 ••• 3456' },
    { id: 'status', label: 'Status', value: 'Active · verified 12 Oct' },
  ],
};

export const COMING_IN = {
  title: 'Coming in',
  sticker: 'paid straight to MoMo',
  link: 'See payouts →',
  items: [
    {
      id: 'stipend-oct',
      title: 'Internship stipend · Accra Tech',
      note: 'October · paid to your wallet on 31 Oct',
      amount: 'GHS 1,200.00',
      status: 'Scheduled',
      tone: 'ok',
    },
    {
      id: 'gig-hubtel',
      title: 'Gig · Hubtel UX test',
      note: 'Held safely until Hubtel approves your work',
      amount: 'GHS 150.00',
      status: 'In escrow',
      tone: 'warn',
    },
  ],
};

export const RECENT_ACTIVITY = {
  title: 'Recent activity',
  link: 'All transactions →',
  // ids of TRANSACTIONS shown on Home, in the order drawn
  ids: ['cycles-redeemed', 'withdraw-momo', 'stipend-sep', 'course-powerbi', 'topup-momo-failed'],
};

export const CYCLES_CARD = {
  label: 'Cycles',
  value: '340',
  worth: '≈ GHS 34.00',
  note: '10 Cycles = GHS 1. Redeem from 500 Cycles.',
  progress: 340 / 500,
  more: '160 more to redeem',
};

export const SAVINGS_CARD = {
  label: 'Savings pot',
  name: 'Laptop fund',
  saved: 'GHS 420',
  goal: 'of GHS 2,500',
  progress: 420 / 2500,
  boost: '+5% boost when you finish a course',
};

export const CREDIT_CARD = {
  label: 'Talent credit score',
  score: '712',
  band: 'Good',
  note: 'Up 18 this month. Verified skills helped most.',
  link: 'View your score →',
};

/* ---- W-12 Transactions ---- */
export const TRANSACTION_FILTERS = ['All', 'Money in', 'Money out', 'Cycles', 'Pending'];

// kind -> icon tile; tone -> amount colour; status chip tone: ok | warn | bad
export const TRANSACTIONS = [
  {
    id: 'cycles-redeemed',
    group: 'October 2026',
    kind: 'in',
    title: 'Cycles redeemed to cash',
    meta: 'Today, 09:12 · 200 Cycles',
    amount: '+ GHS 20.00',
    money: 'in',
    status: 'Completed',
    tone: 'ok',
  },
  {
    id: 'withdraw-momo',
    group: 'October 2026',
    kind: 'out',
    title: 'Withdrawal to MTN MoMo',
    meta: 'Yesterday, 18:40 · 024 ••• 3456',
    amount: '− GHS 300.00',
    money: 'out',
    status: 'Completed',
    tone: 'ok',
  },
  {
    id: 'stipend-sep',
    group: 'September 2026',
    kind: 'in',
    title: 'Internship stipend · Accra Tech',
    meta: '30 Sep · September stipend',
    amount: '+ GHS 1,200.00',
    money: 'in',
    status: 'Completed',
    tone: 'ok',
    hasReceipt: true,
  },
  {
    id: 'course-powerbi',
    group: 'September 2026',
    kind: 'card',
    title: 'Course · Power BI Basics',
    meta: '28 Sep · paid to GTH Academy',
    amount: '− GHS 120.00',
    money: 'out',
    status: 'Completed',
    tone: 'ok',
  },
  {
    id: 'topup-momo-failed',
    group: 'September 2026',
    kind: 'in',
    title: 'Top up from MTN MoMo',
    meta: '27 Sep · 024 ••• 3456',
    amount: '+ GHS 100.00',
    money: 'in',
    status: 'Failed · retry',
    tone: 'bad',
  },
  {
    id: 'cycles-sql',
    group: 'September 2026',
    kind: 'star',
    title: 'Cycles earned · SQL Module 4',
    meta: '26 Sep · quick check passed',
    amount: '+ 40 Cycles',
    money: 'in',
    status: 'Cycles',
    tone: 'warn',
  },
  {
    id: 'gig-farmerline',
    group: 'September 2026',
    kind: 'in',
    title: 'Gig payment · Farmerline survey',
    meta: '22 Sep · released from escrow',
    amount: '+ GHS 200.00',
    money: 'in',
    status: 'Completed',
    tone: 'ok',
  },
  {
    id: 'savings-laptop',
    group: 'September 2026',
    kind: 'out',
    title: 'Savings pot · Laptop fund',
    meta: '20 Sep · automatic, every Friday',
    amount: '− GHS 50.00',
    money: 'out',
    status: 'Saved',
    tone: 'ok',
  },
];

export const STATEMENTS = {
  title: 'Statements',
  note: 'Monthly PDF statements, accepted by banks and schools as proof of income.',
  rows: [
    { id: 'sep-2026', label: 'September 2026', action: 'Download' },
    { id: 'aug-2026', label: 'August 2026', action: 'Download' },
  ],
};

export const MONTH_SUMMARY = {
  title: 'October so far',
  rows: [
    { id: 'in', label: 'Money in', value: 'GHS 1,420.00', tone: 'in' },
    { id: 'out', label: 'Money out', value: 'GHS 470.00', tone: 'out' },
    { id: 'cycles', label: 'Cycles earned', value: '180', tone: 'out' },
  ],
};

/* ---- W-07 / W-08 / W-09 Top up ---- */
export const TOPUP = {
  title: 'Top up your wallet',
  subtitle: 'Add money to pay for training or save towards a goal.',
  hint: 'Minimum GHS 5. No fee from mobile money.',
  minimum: 5,
  defaultAmount: '200.00',
  payFrom: 'Pay from',
  quick: [
    { id: '20', label: 'GHS 20', value: '20.00' },
    { id: '50', label: 'GHS 50', value: '50.00' },
    { id: '100', label: 'GHS 100', value: '100.00' },
    { id: '200', label: 'GHS 200', value: '200.00' },
  ],
  methods: [
    { id: 'momo', title: 'MTN MoMo', note: '024 ••• 3456 · linked', glyph: 'phone' },
    { id: 'telecel', title: 'Telecel Cash', note: 'Add a number', glyph: 'phone' },
    { id: 'at', title: 'AT Money', note: 'Add a number', glyph: 'phone' },
    {
      id: 'bank',
      title: 'Bank card or transfer',
      note: 'Visa, Mastercard or GhIPSS',
      glyph: 'card',
    },
  ],
  cancel: 'Cancel',
  confirm: (amount) => `Top up GHS ${amount}`,
  approve: {
    title: 'Approve on your phone',
    subtitle: 'We sent a prompt to MTN MoMo 024 ••• 3456.',
    prompt: 'Enter your MoMo PIN',
    ref: (amount) => `GTH WALLET · GHS ${amount} · Ref GTH-TU-88210`,
    waiting: 'Waiting for approval · 1:42 left',
    noPrompt: 'No prompt? Dial *170# → My Wallet → My Approvals.',
    cancel: 'Cancel top up',
    done: 'I have approved it',
  },
  success: {
    title: (amount) => `GHS ${amount} added`,
    subtitle: (balance) => `Your new balance is GHS ${balance}.`,
    from: 'From MTN MoMo 024 ••• 3456 · Ref GTH-TU-88210',
    tip: 'Tip: set up an automatic Friday save to your Laptop fund',
    receipt: 'View receipt',
    done: 'Done',
  },
};

/* ---- W-10 / W-11 Withdraw ---- */
export const WITHDRAW = {
  title: 'Withdraw money',
  subtitle: 'Available GHS 1,240.50 · GHS 150.00 on hold can’t be withdrawn yet.',
  available: 1240.5,
  hint: 'Fee GHS 0.00 to mobile money · GHS 2.00 to bank.',
  defaultAmount: '300.00',
  sendTo: 'Send to',
  quick: [
    { id: '50', label: 'GHS 50', value: '50.00' },
    { id: '100', label: 'GHS 100', value: '100.00' },
    { id: '300', label: 'GHS 300', value: '300.00' },
    { id: 'all', label: 'All', value: '1,240.50' },
  ],
  destinations: [
    {
      id: 'momo',
      title: 'MTN MoMo · Kofi Agyekum',
      note: '024 ••• 3456 · arrives in minutes',
      glyph: 'phone',
      fee: 0,
      to: 'MTN MoMo 024 ••• 3456',
      arrives: 'In a few minutes',
    },
    {
      id: 'bank',
      title: 'GCB Bank · ••• 7781',
      note: '1 working day · GHS 2.00 fee',
      glyph: 'card',
      fee: 2,
      to: 'GCB Bank ••• 7781',
      // taken from this option's own drawn text ("1 working day · GHS 2.00 fee"); the PIN frame itself draws the MoMo path.
      arrives: '1 working day',
    },
  ],
  addAccount: '+ Add a new account',
  cancel: 'Cancel',
  next: 'Continue',
  pin: {
    title: 'Confirm withdrawal',
    subtitle: (amount, to) => `GHS ${amount} to ${to}`,
    summary: ['Amount', 'Fee', 'They receive', 'Arrives'],
    label: 'Enter your 4-digit wallet PIN',
    forgot: 'Forgot your PIN? Reset it with your selfie.',
    back: 'Back',
    confirm: (amount) => `Withdraw GHS ${amount}`,
  },
};

/* ---- W-13 Receipt drawer (GET /wallet/transactions/:id/receipt) ---- */
export const RECEIPT_COPY = {
  title: 'Receipt',
  brand: 'Ghana Talent Hub',
  brandSub: 'Wallet receipt',
  amountLabel: 'Amount received',
  rows: ['Description', 'Paid by', 'Paid to', 'Wallet', 'Method', 'Fee'],
  total: 'Total to wallet',
  check: 'Check it’s real at gth.com/r/1182',
  legal:
    'Ghana Talent Hub Ltd · Accra · wallets held with our licensed partner bank. This receipt is valid proof of payment.',
  actions: { download: 'Download PDF', share: 'Share' },
  report: 'Something wrong with this payment? Report a problem',
};

// Only the September stipend row has a receipt in the Figma prototype (rows 8817:3186 / 8820:7742 → drawer W-13); no other row is wired.
export const RECEIPTS = {
  'stipend-sep': {
    no: 'No. 0001182',
    date: '30 Sep 2026 · 14:05',
    amount: 'GHS 1,200.00',
    stamp: 'Paid · completed',
    values: [
      'Internship stipend · September',
      'Accra Tech Ltd · payroll',
      'Kofi Agyekum',
      'GTH-W-4F2A-9C11',
      'GTH Payroll transfer',
      'GHS 0.00',
    ],
    reference: 'GTH-PAY-20260930-1182',
  },
};

// Barcode bars (Figma `barcode` 8849:463139): bar widths in px, 40px tall, 2px apart.
export const BARCODE_WIDTHS = [
  4.5, 1.5, 3, 1.5, 4.5, 3, 1.5, 1.5, 4.5, 1.5, 3, 3, 1.5, 4.5, 1.5, 1.5, 3, 4.5, 1.5, 3, 1.5, 1.5,
  4.5, 3, 1.5, 3, 1.5, 4.5, 1.5, 1.5, 3, 1.5, 4.5, 1.5, 3, 1.5, 1.5, 3, 4.5, 1.5, 3, 1.5,
];
