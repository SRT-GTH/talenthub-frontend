/*
 * billingData - plan catalogue, billing periods and MoMo networks for the
 * recruiter Plan (R05, Figma 7374:6764 / 7012 / 7258) and Payment (R06,
 * 7374:7507..8715) steps. Copy is verbatim from the Figma `characters`.
 *
 * Prices are the Figma numbers: Professional $50/month or $500/year,
 * Enterprise $200/month or $2,000/year, Free $0 forever.
 */

export const BILLING_PERIODS = [
  { key: 'monthly', label: 'Monthly', unit: '/ month', unitShort: 'month', adjective: 'Monthly' },
  {
    key: 'annual',
    label: 'Annual · 2 months free',
    unit: '/ year',
    unitShort: 'year',
    adjective: 'Annual',
  },
];

export const PLANS = [
  {
    tier: 'free',
    name: 'Free',
    eyebrow: 'FREE',
    tagline: 'Try GTH and post your first role.',
    prices: { monthly: 0, annual: 0 },
    badge: null,
    chooseLabel: 'Choose Free',
    features: [
      '1 job post / month',
      'Basic profiles — name, education, skills summary',
      'Limited search filters',
      '5 InMails / month',
    ],
  },
  {
    tier: 'professional',
    name: 'Professional',
    eyebrow: 'PROFESSIONAL',
    tagline: 'For active recruiters hiring every month.',
    prices: { monthly: 50, annual: 500 },
    badge: 'Most popular',
    chooseLabel: 'Choose Professional',
    features: [
      '20 job posts / month',
      'Expanded profiles + assessment summaries',
      'Advanced search filters',
      '50 InMails / month',
      'Basic job performance analytics',
    ],
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    eyebrow: 'ENTERPRISE',
    tagline: 'For HR teams and high-volume hiring.',
    prices: { monthly: 200, annual: 2000 },
    badge: null,
    chooseLabel: 'Choose Enterprise',
    features: [
      'Unlimited job posts',
      'Full profiles (current snapshot)',
      'All filters + saved searches + AI recommendations',
      '150 InMails / month',
      'Full hiring analytics dashboard',
      'Priority support',
    ],
  },
];

export const DEFAULT_TIER = 'free';
export const DEFAULT_BILLING = 'monthly';

export const MOMO_NETWORKS = [
  { key: 'mtn', label: 'MTN MoMo' },
  { key: 'telecel', label: 'Telecel Cash' },
  { key: 'airteltigo', label: 'AirtelTigo Money' },
];

export const getPlan = (tier) => PLANS.find((p) => p.tier === tier) || PLANS[0];
export const getPeriod = (billing) =>
  BILLING_PERIODS.find((p) => p.key === billing) || BILLING_PERIODS[0];
export const getNetwork = (key) => MOMO_NETWORKS.find((n) => n.key === key) || MOMO_NETWORKS[0];

export const normaliseTier = (tier) => (PLANS.some((p) => p.tier === tier) ? tier : DEFAULT_TIER);
export const normaliseBilling = (b) => (b === 'annual' ? 'annual' : DEFAULT_BILLING);

export const planPrice = (tier, billing) => getPlan(tier).prices[normaliseBilling(billing)];

// 2000 -> "2,000"
export const formatAmount = (n) => n.toLocaleString('en-US');
// "$50" / "$2,000"
export const formatUsdShort = (n) => `$${formatAmount(n)}`;
// "$50.00" / "$2,000.00"
export const formatUsdFull = (n) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// "Professional · Monthly"
export const planLabel = (tier, billing) =>
  `${getPlan(tier).name} · ${getPeriod(billing).adjective}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Figma shows "12 Nov 2026" for a monthly plan bought on 12 Oct 2026: the
// renewal is computed from today (+1 month / +1 year), same "d Mon yyyy" format.
export const renewalDate = (billing, from = new Date()) => {
  const d = new Date(from.getTime());
  if (normaliseBilling(billing) === 'annual') d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// DOM ids shared by MethodTabs (tab buttons) and the Payment page (tab panel).
export const tabId = (prefix, key) => `${prefix}-tab-${key}`;
export const panelId = (prefix, key) => `${prefix}-panel-${key}`;
