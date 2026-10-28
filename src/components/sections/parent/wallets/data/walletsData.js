/*
 * walletsData — the copy and the money helpers of the Ward wallets flow (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 08 Ward wallets" 10057:66889; URL table in wallets/WalletsLayer.jsx).
 * Every string is as drawn. ⚠️ ASSUMPTION marks the few that the frames do not draw (field errors).
 */

// "GHS 85.00" (two decimals, thousands separated), and the short form "GHS 50" the toasts and titles draw for whole amounts.
export const ghs = (n) =>
  `GHS ${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const ghsShort = (n) => `GHS ${Number(n).toLocaleString('en-GB')}`;

// Cycles to cedis, as the Wallet tab draws it ("180 Cycles ≈ GHS 18").
export const CYCLES_PER_GHS = 10;

export const PAGE = {
  title: 'Ward wallets',
  subtitle: 'Under-18s have a Starter wallet. You approve payments over your limit.',
};

export const TOP_UP_AMOUNTS = [20, 50, 100];
export const DEFAULT_TOP_UP = 50;
export const DEFAULT_TOP_UP_NOTE = 'For your Python course. Well done!';
export const PAY_FROM = 'MTN MoMo · 024 ••• 0192';
export const DEFAULT_DECLINE_NOTE = 'Let’s talk about it at dinner tonight.';

export const DECLINE_REASONS = [
  { id: 'talk', label: 'Let’s talk first' },
  { id: 'expensive', label: 'Too expensive' },
  { id: 'later', label: 'Not right now' },
  { id: 'other', label: 'Other' },
];

// The wallet card's one-line summary: "Balance GHS 85.00 · 180 Cycles · Laptop fund GHS 40".
export const walletLine = (w) =>
  `Balance ${ghs(w.balance)} · ${w.cycles} Cycles · Laptop fund ${ghsShort(w.laptop)}`;

// What the request row says in each state (PWa-01, PWa-03, PWa-04b, PWa-07).
export const requestRow = (ward, r) => {
  const what = `${r.what} · ${r.who}`;
  switch (r.status) {
    case 'approved':
      return {
        title: `You approved ${ghs(r.amount)} · ${r.what}`,
        sub: `${r.who} · paid just now · ${ward.firstName} is enrolled`,
        chip: 'Approved',
        tone: 'active',
        bg: 'bg-[#ebf1ec]',
      };
    case 'declined':
      return {
        title: `You declined ${ghs(r.amount)} · ${r.what}`,
        sub: `Nothing was charged · your note was sent to ${ward.firstName}`,
        chip: 'Declined',
        tone: 'pending',
        bg: 'bg-[#f8f8f4]',
      };
    case 'expired':
      return {
        title: `Request expired · ${ghs(r.amount)} ${r.what}`,
        sub: `No answer within 48 hours, so nothing was charged. ${ward.firstName} can ask again.`,
        chip: 'Expired',
        tone: 'pending',
        bg: 'bg-[#f8f8f4]',
      };
    default:
      return {
        title: `${ward.firstName} wants to pay ${ghs(r.amount)}`,
        sub: `${what} · asked ${r.askedAgo} · expires in ${r.expiresIn}`,
        bg: 'bg-[#faf4e8]',
      };
  }
};

export const HISTORY = [
  {
    id: 'cycles',
    icon: 'in',
    title: 'Cycles redeemed',
    sub: '12 Oct · 200 Cycles → GHS 20.00',
    chip: '+ GHS 20',
    tone: 'active',
  },
  {
    id: 'excel',
    icon: 'out',
    title: 'Course · Excel basics',
    sub: '5 Oct · under your limit, no approval needed',
    chip: '− GHS 35',
    tone: 'pending',
  },
];

export const LIMITS_COPY = {
  title: 'Your limits',
  askAbove: 'Ask me above',
  monthly: 'Monthly limit',
  withdrawals: 'Withdrawals',
  withdrawalsValue: 'Not until 18',
  change: 'Change limits',
};

export const ELLIOT_ASKS = {
  title: 'Elliot hasn’t opened a wallet',
  sub: 'He has 60 Cycles waiting. It opens when he asks and you’re told.',
};

// Dialog copy.
export const APPROVE_COPY = {
  title: (r, ward) => `Approve ${ghs(r.amount)} for ${ward.firstName}?`,
  sub: (r) => `${r.what} on ${r.who} · 6 weeks · certificate`,
  paidTo: 'Paid to',
  paidToValue: (r) => `${r.who} (verified)`,
  from: 'From',
  left: 'Left after',
  month: 'This month',
  told: (ward) => `${ward.firstName} is told straight away. If you decline, you can add a note.`,
  decline: 'Decline',
  approve: 'Approve payment',
  retry: 'Try again',
  error: {
    title: 'Your approval didn’t go through',
    body: 'We couldn’t reach GTH, so nothing was paid. Try again, or reply YES to the WhatsApp message we sent.',
  },
};

export const DECLINE_COPY = {
  title: (r, ward) => `Decline ${ward.firstName}’s ${ghsShort(r.amount)} payment?`,
  intro: (ward) =>
    `Nothing is charged. ${ward.firstName} is told straight away, with your note if you add one.`,
  reasons: 'Reason',
  noteLabel: (ward) => `Note to ${ward.firstName}`,
  noteHelper: 'Optional · up to 200 characters.',
  cancel: 'Cancel',
  confirm: 'Decline payment',
};

export const LIMITS_DIALOG = {
  title: (ward) => `${ward.firstName}’s limits`,
  intro: (ward) =>
    `Payments above your limit wait for your OK. ${ward.firstName} is told when limits change.`,
  askAbove: 'Ask me above (GHS)',
  askAboveHelper: 'Most parents use GHS 50',
  monthly: 'Monthly limit (GHS)',
  monthlyHelper: 'Resets on the 1st',
  info: 'Withdrawals to mobile money unlock at 18. This is set by GTH, not by you.',
  cancel: 'Cancel',
  save: 'Save limits',
  // ⚠️ ASSUMPTION: the frames draw no field errors; these keep a bad amount from being saved.
  errorAmount: 'Enter an amount above 0',
  errorOrder: 'The monthly limit can’t be below the amount you ask above',
};

export const TOP_UP_COPY = {
  title: (ward) => `Top up ${ward.firstName}’s wallet`,
  intro: 'Money goes to her Starter wallet straight away. She’ll see who sent it.',
  other: 'Other',
  amount: 'Amount (GHS)',
  amountHelper: (balance) => `Her balance will be ${ghs(balance)}`,
  // ⚠️ ASSUMPTION: no error is drawn for a bad amount.
  amountError: 'Enter an amount above 0',
  payFrom: 'Pay from',
  payFromHelper: 'You’ll approve on your phone',
  note: (ward) => `Note to ${ward.firstName}`,
  noteHelper: 'Optional',
  cancel: 'Cancel',
  send: (amount) => `Send ${ghs(amount)}`,
  phone: {
    title: 'Approve on your phone',
    body: (amount) =>
      `We sent a ${ghs(amount)} request to MTN MoMo 024 ••• 0192. Enter your MoMo PIN on your phone to finish.`,
    waiting: 'Waiting for MoMo… this usually takes under a minute',
    cancel: 'Cancel top up',
    done: 'I’ve approved it',
  },
  failed: {
    title: 'Top up didn’t go through',
    body: (amount) => `MTN MoMo declined the ${ghs(amount)} request. No money left your account.`,
    calloutTitle: 'Common reasons',
    calloutBody: 'Wrong PIN, not enough balance, or the request timed out after 2 minutes.',
    cancel: 'Cancel',
    retry: 'Try again',
  },
};

export const OPEN_WALLET_COPY = {
  title: (ward) => `${ward.firstName} wants a Starter wallet`,
  body: (cycles) =>
    `He has ${cycles} Cycles from learning. A wallet lets him turn them into cash for courses. You’re told about every payment over your limit.`,
  points: [
    'Ask me above GHS 50 · up to GHS 200 a month',
    'No withdrawals until he turns 18',
    'You can close it any time',
  ],
  later: 'Not now',
  open: (ward) => `Open ${ward.firstName}’s wallet`,
};

// Toasts (PWa-03, 04b, 05b, 06c, 08b). `action` shows the amber link.
export const TOASTS = {
  approved: (ward) => ({
    message: 'Payment approved',
    // Figma draws "GHS 65 from her balances and 50 Cycles" (the balance it shows is GHS 85); kept as drawn.
    detail: `${ward.firstName} paid GHS 65 from her balances and 50 Cycles. She’s been told.`,
    actionLabel: 'View receipt',
  }),
  declined: (ward, note) => ({
    message: 'Payment declined',
    detail: note
      ? `${ward.firstName} has your note: “${note}”`
      : `${ward.firstName} has been told. Nothing was charged.`,
    actionLabel: 'Undo',
  }),
  limits: (ward, l) => ({
    message: `${ward.firstName}’s limits are saved`,
    detail: `Ask me above ${ghsShort(l.askAbove)} · ${ghsShort(l.monthly)} a month. She’s been told.`,
  }),
  topUp: (ward, amount, balance) => ({
    message: `${ghs(amount)} sent to ${ward.firstName}`,
    detail: `Her balance is now ${ghs(balance)}. She can see your note.`,
    actionLabel: 'View receipt',
  }),
  openWallet: (ward) => ({
    message: `${ward.firstName}’s wallet is open`,
    detail: `He’s been told. He can turn his 60 Cycles into GHS 6 for a course.`,
  }),
};
