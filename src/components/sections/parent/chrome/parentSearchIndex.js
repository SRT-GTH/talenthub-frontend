/*
 * parentSearchIndex — what the parent top-bar search (⌘K) can open. The Parents file draws the search field but no
 * results, so this is ⚠️ ASSUMPTION: the parent's wards (demo: Abena, Elliot, Kwesi; live: GET /parent/me wards) and the
 * parent portal's own pages and main actions, all existing routes. Searched in the browser (no search endpoint for parents).
 */

export const SEARCH_COPY = {
  label: 'Search the parent dashboard',
  placeholder: 'Search your wards, reviews, wallets, help…',
  wards: 'WARDS',
  pages: 'PAGES AND ACTIONS',
  empty: (q) => `Nothing matches “${q}”. Try a ward’s name or a word like “wallet” or “opt out”.`,
  keys: '↑ ↓ to move · Enter to open · Esc to close',
};

// `words` widen the match beyond the title (what a parent might type).
export const SEARCH_PAGES = [
  { id: 'home', title: 'Home', sub: 'Your week at a glance', to: '/parent', icon: 'home' },
  {
    id: 'wards',
    title: 'My wards',
    sub: 'Every linked child',
    to: '/parent/wards',
    icon: 'wards',
    words: 'children kids',
  },
  {
    id: 'link',
    title: 'Link a ward',
    sub: 'Search by name or use a link code',
    to: '/parent/link-ward',
    icon: 'wards',
    words: 'add child code invite',
  },
  {
    id: 'review',
    title: 'To review',
    sub: 'Certificates, evaluations, corrections, payments',
    to: '/parent/review',
    icon: 'review',
    words: 'approve approvals',
  },
  {
    id: 'certificates',
    title: 'Certificates to check',
    sub: 'To review · Certificates',
    to: '/parent/review?tab=certificates',
    icon: 'review',
  },
  {
    id: 'corrections',
    title: 'Corrections and flags',
    sub: 'To review · Corrections',
    to: '/parent/review?tab=corrections',
    icon: 'review',
    words: 'flag fix profile',
  },
  {
    id: 'payments',
    title: 'Payments to approve',
    sub: 'To review · Payments',
    to: '/parent/review?tab=payments',
    icon: 'wallets',
    words: 'pay money',
  },
  {
    id: 'evaluate',
    title: 'Evaluate my child',
    sub: 'Start or continue an evaluation',
    to: '/parent/evaluate',
    icon: 'evaluate',
    words: 'evaluation questions',
  },
  {
    id: 'wallets',
    title: 'Ward wallets',
    sub: 'Balances, limits and top-ups',
    to: '/parent/wallets',
    icon: 'wallets',
    words: 'wallet money cycles limit top up',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    sub: 'Approvals, milestones, ward activity',
    to: '/parent/notifications',
    icon: 'notifications',
    words: 'alerts milestones',
  },
  {
    id: 'settings',
    title: 'Settings',
    sub: 'Account, roles, security',
    to: '/parent/settings',
    icon: 'settings',
    words: 'account password profile',
  },
  {
    id: 'notif-settings',
    title: 'Notification settings',
    sub: 'Settings · Notifications',
    to: '/parent/settings?tab=notifications',
    icon: 'settings',
    words: 'whatsapp sms email',
  },
  {
    id: 'help',
    title: 'Help and guides',
    sub: 'How GTH works for parents',
    to: '/parent/help',
    icon: 'help',
    words: 'support faq',
  },
  {
    id: 'opt-out',
    title: 'Opting out and privacy',
    sub: 'Help · Your controls',
    to: '/parent/help/opting-out',
    icon: 'help',
    words: 'opt out privacy restore pause',
  },
  {
    id: 'report',
    title: 'Report a safety concern',
    sub: 'Help · Safety',
    to: '/parent/help?modal=report',
    icon: 'help',
    words: 'safety concern report worried',
  },
];

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/** Rows for a query: wards first, then pages; every word typed must match (title, sub line or keywords). */
export const searchParent = (query, wards) => {
  const words = norm(query).split(/\s+/).filter(Boolean);
  const hit = (text) => words.every((w) => text.includes(w));
  const wardRows = (wards || [])
    .map((w) => ({
      id: `ward-${w.id}`,
      kind: 'ward',
      title: w.name,
      sub: [w.relation, w.status === 'pending' ? 'Pending link' : w.optedOut ? 'Opted out' : null]
        .filter(Boolean)
        .join(' · '),
      photo: w.photo,
      to: w.status === 'pending' ? '/parent/link-ward?step=sent' : `/parent/wards/${w.id}`,
      text: norm(`${w.name} ${w.relation} ward child`),
    }))
    .filter((r) => !words.length || hit(r.text));
  const pageRows = SEARCH_PAGES.map((p) => ({
    ...p,
    kind: 'page',
    text: norm(`${p.title} ${p.sub} ${p.words || ''}`),
  })).filter((r) => !words.length || hit(r.text));
  return { wards: wardRows, pages: words.length ? pageRows : pageRows.slice(0, 6) };
};
