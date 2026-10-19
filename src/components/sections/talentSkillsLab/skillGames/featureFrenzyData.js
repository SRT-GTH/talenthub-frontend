/*
 * Feature Frenzy mock data — Figma SL-GS08 "Card 6" (Playful 7943:8072 / Focused 8110:496325). Shaped like
 * `GET /skills-lab/games/feature-frenzy` (cards) + `POST …/runs/:id/swipes`.
 *
 * DRAWN: card 6 "Offline mode" (62% users asking, 5 coins, chips High impact in Tamale / Low data areas / Takes 3 sprints,
 * the AgroLink prompt), the five earlier decisions (Kept: MoMo checkout, Price alerts by SMS, Twi and Ewe language; Killed: AR
 * crop scanner, Crypto payouts), "7 of 12 coins left", "3 kept · 2 killed", header copy, "Swipe, or press ← →".
 * ⚠️ ASSUMPTION: every card's description / users % / coins / chips (only card 6 is drawn) — chosen so the five drawn decisions
 * cost 5 coins (12 − 5 = the drawn 7 left), the "right call" of each card (`keep`), the scoring (10 points per right call, pass 70+,
 * +10 XP per right call), the tile letter on cards without a Figma icon, the empty arena copy and the "Not enough coins" nudge.
 */
export const FEATURE_FRENZY = {
  gameId: 'feature-frenzy',
  title: 'Skills Lab · Feature Frenzy',
  label: 'Feature Frenzy',
  subtitle: 'Product management · 10 cards · Score 70+ to earn Verified',
  skill: 'Product management',
  total: 10,
  coins: 12,
  passScore: 70,
  pointsPerCall: 10,
  baseXp: 240,
  streakDays: 7,
  callXp: 10,
  checks: ['Prioritisation', 'Trade-offs', 'User data'],
  prompt:
    'AgroLink connects cassava and tomato farmers to traders in Accra. Launch is in 6 weeks and you have {coins} build coins left.',
};

const card = (id, title, desc, users, cost, chips, keep, topic, extra = {}) => ({
  id,
  title,
  desc,
  users,
  cost,
  chips,
  keep,
  topic,
  ...extra,
});

export const CARDS = [
  card(
    'momo',
    'MoMo checkout',
    'Traders pay farmers straight from their MoMo wallet.',
    88,
    2,
    ['High impact in Tamale', 'Proven API', 'Takes 1 sprint'],
    true,
    'Prioritisation'
  ),
  card(
    'sms',
    'Price alerts by SMS',
    'Farmers get today’s market price as a text message.',
    71,
    1,
    ['Works on any phone', 'Low data areas', 'Takes 1 sprint'],
    true,
    'User data'
  ),
  card(
    'twi',
    'Twi and Ewe language',
    'The whole app in the language farmers speak at home.',
    64,
    2,
    ['Reaches new farmers', 'Needs translators', 'Takes 2 sprints'],
    true,
    'Trade-offs'
  ),
  card(
    'ar',
    'AR crop scanner',
    'Point the camera at a leaf and see the disease in 3D.',
    9,
    6,
    ['Needs a new phone', 'Heavy on data', 'Takes 6 sprints'],
    false,
    'Prioritisation'
  ),
  card(
    'crypto',
    'Crypto payouts',
    'Pay farmers in stablecoins instead of cedis.',
    4,
    5,
    ['Few users asking', 'Regulatory risk', 'Takes 4 sprints'],
    false,
    'User data'
  ),
  // DRAWN (card 6, Figma SL-GS08)
  card(
    'offline',
    'Offline mode',
    'Farmers can list produce with no signal. It syncs when they are back online.',
    62,
    5,
    ['High impact in Tamale', 'Low data areas', 'Takes 3 sprints'],
    true,
    'Trade-offs',
    { icon: 'wifi-off' }
  ),
  card(
    'weather',
    'Weather alerts',
    'A text when rain is coming, so farmers can harvest early.',
    58,
    1,
    ['Cheap to build', 'Low data areas', 'Takes 1 sprint'],
    true,
    'User data'
  ),
  card(
    'video',
    'In-app video calls',
    'Farmers and traders talk face to face before they trade.',
    12,
    6,
    ['Heavy on data', 'Few users asking', 'Takes 5 sprints'],
    false,
    'Prioritisation'
  ),
  card(
    'export',
    'Order history export',
    'Download last season’s orders as a spreadsheet.',
    41,
    1,
    ['Cheap to build', 'Traders asked for it', 'Takes 1 sprint'],
    true,
    'Trade-offs'
  ),
  card(
    'dark',
    'Dark mode',
    'A darker theme for night-time browsing.',
    15,
    3,
    ['Nice to have', 'Not a launch blocker', 'Takes 2 sprints'],
    false,
    'Prioritisation'
  ),
];

/* Figma seed (?f=GS08): cards 1–5 decided exactly as drawn, card 6 on top. */
export const FRENZY_FRAMES = {
  GS08: { decisions: ['keep', 'keep', 'keep', 'kill', 'kill'] },
};
