import { WALLET_COPY } from './walletData.js';

/*
 * Page header + tab strip per Wallet screen (Figma title row, subtitle, "GTH · Messages header art" copy, tabs).
 * Every string is verbatim from the Figma node `characters`. `icon` names are resolved to components in WalletHeader.
 */

const ART = {
  active: WALLET_COPY.art,
  setup: { linked: '3 quick steps', sticker: 'Takes about 3 minutes', week: 'Bank-level security' },
  cycles: { linked: '340 Cycles saved', sticker: 'Learn to earn Cycles', week: '+60 Cycles today' },
  financing: { linked: 'Pay as you earn', sticker: 'No hidden fees', week: 'Rate fixed upfront' },
  credit: { linked: 'Score 712 · Good', sticker: 'Verified skills help', week: '+18 this month' },
};

const SUBTITLE_SETUP = 'Takes about 5 minutes. You need your Ghana Card and your phone.';

export const KYC_STEPS = ['card', 'address', 'selfie'];

// The wallet screen a URL resolves to (see talentWalletState.js for the URL contract).
export const resolveScreen = (w) => {
  if (w.state === 'new') return 'new';
  if (w.state === 'checking') return 'checking';
  if (w.state === 'retake') return 'retake';
  if (w.view === 'kyc') return 'kyc';
  if (w.state === 'under18') return 'under18';
  if (w.view === 'savings') return 'savings';
  if (w.view === 'salary') return 'salary';
  if (w.view === 'escrow') return 'escrow';
  if (w.tab === 'cycles') return 'cycles';
  if (w.tab === 'financing') return 'financing';
  if (w.tab === 'credit') return 'credit';
  if (w.tab === 'transactions') return 'transactions';
  if (w.state === 'activated') return 'empty';
  return 'home';
};

export const getHeader = (w) => {
  const screen = resolveScreen(w);
  // Focused W-06 / W-12 draw a 26px title row (every other Focused frame draws 41px); Playful is 41px everywhere.
  const shortTitleRow = (screen === 'home' && w.toast !== 'salary') || screen === 'transactions';
  const base = { title: WALLET_COPY.title, subtitle: WALLET_COPY.subtitle, shortTitleRow };
  const verified = { icon: 'shield', label: WALLET_COPY.kycSticker };
  switch (screen) {
    case 'new':
      return { ...base, sticker: { icon: 'star', label: 'New' }, art: ART.setup };
    case 'kyc': {
      const n = KYC_STEPS.indexOf(w.step) + 1 || 1;
      return {
        title: 'Set up your wallet',
        subtitle: SUBTITLE_SETUP,
        sticker: { icon: 'list', label: `Step ${n} of 3` },
        art: ART.setup,
      };
    }
    case 'checking':
      return { ...base, sticker: { icon: 'hourglass', label: 'Checking' }, art: ART.setup };
    case 'retake':
      return { ...base, sticker: { icon: 'warning', label: 'Action needed' }, art: ART.setup };
    case 'empty':
      return { ...base, sticker: verified, art: ART.setup };
    case 'under18':
      return {
        ...base,
        subtitle: 'A Starter wallet for under-18s. Your parent or guardian helps you manage it.',
        sticker: { icon: 'starter', label: 'Starter · linked to parent' },
        art: ART.cycles,
      };
    case 'cycles':
    case 'savings':
      return { ...base, sticker: verified, art: ART.cycles };
    case 'financing':
      return { ...base, sticker: verified, art: ART.financing };
    case 'credit':
    case 'escrow':
    case 'salary':
      return { ...base, sticker: verified, art: ART.credit };
    default:
      // Figma W-27b (payday Home) draws the credit-score header art.
      return { ...base, sticker: verified, art: w.toast === 'salary' ? ART.credit : ART.active };
  }
};

const TAB_BASE = [
  { id: 'overview', label: 'Overview', count: null },
  { id: 'transactions', label: 'Transactions', count: '24' },
  { id: 'cycles', label: 'Cycles', count: '340' },
  { id: 'financing', label: 'Financing', count: null },
  { id: 'credit', label: 'Credit score', count: null },
];

// Tab strip of a screen, or null when the screen draws none (set-up screens).
export const getTabs = (w) => {
  const screen = resolveScreen(w);
  if (['new', 'kyc', 'checking', 'retake'].includes(screen)) return null;
  if (screen === 'under18') {
    return [
      { id: 'overview', label: 'Overview', count: null },
      { id: 'cycles', label: 'Cycles', count: '180' },
      { id: 'savings', label: 'Savings', count: null },
    ];
  }
  // A financing application in progress shows the amber "1" on the Financing tab (W-22 … W-24).
  if (w.tab === 'financing' && ['received', 'offer', 'declined', 'loan'].includes(w.stage)) {
    return TAB_BASE.map((t) => (t.id === 'financing' ? { ...t, count: '1' } : t));
  }
  return TAB_BASE;
};

// Which tab is drawn selected for a screen.
export const getActiveTab = (w) => {
  const screen = resolveScreen(w);
  if (screen === 'savings') return w.state === 'under18' ? 'savings' : 'overview';
  if (screen === 'salary' || screen === 'home' || screen === 'empty') return 'overview';
  if (screen === 'escrow') return 'transactions';
  return w.tab;
};
