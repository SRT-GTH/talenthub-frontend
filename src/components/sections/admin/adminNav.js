/*
 * adminNav.js — the ONE list of Platform Admin destinations (Theme 7, Figma canvas 8520:12), shared by the expanded sidebar (303),
 * the icon rail (80) and the phone / tablet drawer. `icon` is a key of NAV_ICONS in AdminNavItem.jsx. `match` lists the pathname
 * prefixes that mark the item active (longest prefix wins). All five staff roles draw the same nine items (7.0.2a-e).
 */

export const ADMIN_BASE = '/admin';

export const PRIMARY_NAV = [
  { id: 'home', label: 'Home', to: ADMIN_BASE, icon: 'home' },
  {
    id: 'accounts',
    label: 'Accounts',
    to: `${ADMIN_BASE}/accounts`,
    icon: 'users',
    match: [`${ADMIN_BASE}/accounts`],
  },
  {
    id: 'moderation',
    label: 'Moderation',
    to: `${ADMIN_BASE}/moderation`,
    icon: 'warning',
    match: [`${ADMIN_BASE}/moderation`],
  },
  {
    id: 'comms',
    label: 'Comms',
    to: `${ADMIN_BASE}/comms`,
    icon: 'message',
    match: [`${ADMIN_BASE}/comms`, `${ADMIN_BASE}/support`],
  },
  {
    id: 'verification',
    label: 'Verification',
    to: `${ADMIN_BASE}/verification`,
    icon: 'user-check',
    match: [`${ADMIN_BASE}/verification`],
  },
  {
    id: 'reports',
    label: 'Reports',
    to: `${ADMIN_BASE}/reports`,
    // Figma draws the Home glyph on the Reports item (all frames) — kept as drawn.
    icon: 'home',
    match: [`${ADMIN_BASE}/reports`],
  },
];

export const SECONDARY_NAV = [
  {
    id: 'live-ops',
    label: 'Live ops',
    to: `${ADMIN_BASE}/live-ops`,
    icon: 'speedmeter',
    match: [`${ADMIN_BASE}/live-ops`],
  },
  {
    id: 'observability',
    label: 'Observability',
    to: `${ADMIN_BASE}/observability`,
    icon: 'speedmeter',
    match: [`${ADMIN_BASE}/observability`],
  },
  {
    id: 'audit-log',
    label: 'Audit log',
    to: `${ADMIN_BASE}/audit-log`,
    icon: 'file-check',
    match: [`${ADMIN_BASE}/audit-log`],
  },
  {
    id: 'settings',
    label: 'Settings',
    to: `${ADMIN_BASE}/settings`,
    icon: 'settings',
    match: [`${ADMIN_BASE}/settings`, `${ADMIN_BASE}/staff`],
  },
];

/** The nav item id that is active for a pathname (longest matching prefix; Home on /admin). */
export const activeNavId = (pathname) => {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === ADMIN_BASE) return 'home';
  let best = null;
  let bestLen = 0;
  for (const item of [...PRIMARY_NAV, ...SECONDARY_NAV]) {
    for (const prefix of item.match ?? []) {
      if ((path === prefix || path.startsWith(`${prefix}/`)) && prefix.length > bestLen) {
        best = item.id;
        bestLen = prefix.length;
      }
    }
  }
  return best;
};
