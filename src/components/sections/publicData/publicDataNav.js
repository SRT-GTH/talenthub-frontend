/*
 * publicDataNav.js — the ONE list of public-data destinations (Theme 8, Figma canvas 8477:209484), shared by the expanded sidebar (288),
 * the icon rail (80, tablet / collapsed), the mobile drawer (300) and the mobile section tabs (Overview · Regions · Showcase · Outcomes · Directory).
 * `icon` is a key of PUBLIC_ICONS in PublicSidebar.jsx. `match` lists the pathname prefixes that mark the item active.
 */

export const DATA_BASE = '/data';

export const PRIMARY_NAV = [
  { id: 'home', label: 'Home', to: DATA_BASE, icon: 'home', exact: true },
  {
    id: 'overview',
    label: 'National overview',
    tabLabel: 'Overview',
    to: `${DATA_BASE}/overview`,
    icon: 'overview',
    match: [`${DATA_BASE}/overview`],
  },
  {
    id: 'regions',
    label: 'Regions',
    tabLabel: 'Regions',
    to: `${DATA_BASE}/regions`,
    icon: 'map',
    match: [`${DATA_BASE}/regions`, `${DATA_BASE}/compare`],
  },
  {
    id: 'showcase',
    label: 'Talent showcase',
    tabLabel: 'Showcase',
    to: `${DATA_BASE}/showcase`,
    icon: 'users',
    match: [`${DATA_BASE}/showcase`],
  },
  {
    id: 'outcomes',
    label: 'Outcomes',
    tabLabel: 'Outcomes',
    to: `${DATA_BASE}/outcomes`,
    icon: 'chart',
    match: [`${DATA_BASE}/outcomes`],
  },
  {
    id: 'directory',
    label: 'Directory',
    tabLabel: 'Directory',
    to: `${DATA_BASE}/partners`,
    icon: 'company',
    match: [`${DATA_BASE}/partners`, `${DATA_BASE}/opportunities`],
  },
];

export const SECONDARY_NAV = [
  {
    id: 'methodology',
    label: 'Methodology',
    to: `${DATA_BASE}/methodology`,
    icon: 'info',
    match: [`${DATA_BASE}/methodology`],
  },
  // The monthly digest is a modal (8.8.3a), not a page: the item opens it through ?modal=digest.
  { id: 'digest', label: 'Monthly digest', modal: 'digest', icon: 'mail' },
];

export const FOOTER_LINKS = [
  { label: 'Methodology', to: `${DATA_BASE}/methodology` },
  { label: 'Partner directory', to: `${DATA_BASE}/partners` },
  { label: 'Opportunity directory', to: `${DATA_BASE}/opportunities` },
  { label: 'Monthly digest', modal: 'digest' },
  // ⚠️ ASSUMPTION: Figma draws "Contact" with no destination; it is inert until a contact page exists.
  { label: 'Contact', to: null },
];

/** The nav item id that is active for a pathname (longest matching prefix; Home only on the exact /data). */
export const activeNavId = (pathname) => {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === DATA_BASE) return 'home';
  const all = [...PRIMARY_NAV, ...SECONDARY_NAV];
  let best = null;
  let bestLen = 0;
  for (const item of all) {
    for (const prefix of item.match ?? []) {
      if ((path === prefix || path.startsWith(`${prefix}/`)) && prefix.length > bestLen) {
        best = item.id;
        bestLen = prefix.length;
      }
    }
  }
  return best;
};

/** Where "Partner sign-in →" and "For partners / For recruiters" lead. ⚠️ ASSUMPTION: the existing sign-in page (Figma draws no destination). */
export const PARTNER_SIGN_IN_ROUTE = '/login';
