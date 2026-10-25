/*
 * institutionNav.js — the ONE list of institution destinations (Theme 11, Figma canvas 8520:10), shared by the expanded sidebar (303),
 * the icon rail (80) and the phone drawer. `icon` is a key of NAV_ICONS in InstitutionNavItem.jsx. `match` lists the pathname
 * prefixes that mark the item active (longest prefix wins). Frame 11.2.1a: Home, Students, Programmes, Messages, Records, Credentials
 * | divider | Progress. Sign-up, accreditation, the A4 report, the public pages and settings have no nav item.
 */

export const INSTITUTION_BASE = '/institution';

export const PRIMARY_NAV = [
  { id: 'home', label: 'Home', to: INSTITUTION_BASE, icon: 'home' },
  {
    id: 'students',
    label: 'Students',
    to: `${INSTITUTION_BASE}/students`,
    icon: 'students',
    match: [`${INSTITUTION_BASE}/students`],
  },
  {
    id: 'programmes',
    label: 'Programmes',
    to: `${INSTITUTION_BASE}/programmes`,
    icon: 'programmes',
    match: [`${INSTITUTION_BASE}/programmes`],
  },
  {
    id: 'messages',
    label: 'Messages',
    to: `${INSTITUTION_BASE}/messages`,
    icon: 'messages',
    match: [`${INSTITUTION_BASE}/messages`],
  },
  {
    id: 'records',
    label: 'Records',
    to: `${INSTITUTION_BASE}/records`,
    icon: 'records',
    match: [`${INSTITUTION_BASE}/records`],
  },
  {
    id: 'credentials',
    label: 'Credentials',
    to: `${INSTITUTION_BASE}/credentials`,
    icon: 'credentials',
    match: [`${INSTITUTION_BASE}/credentials`],
  },
];

export const SECONDARY_NAV = [
  {
    id: 'progress',
    label: 'Progress',
    to: `${INSTITUTION_BASE}/progress`,
    icon: 'progress',
    match: [`${INSTITUTION_BASE}/progress`],
  },
];

/** The nav item id that is active for a pathname (longest matching prefix; Home on /institution, accreditation, settings, public page). */
export const activeNavId = (pathname) => {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === INSTITUTION_BASE) return 'home';
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
  // 11.1.2b-e (verification status) highlight Home in the frames; ⚠️ ASSUMPTION: settings and the public page keep Home highlighted too.
  if (
    !best &&
    (path.startsWith(`${INSTITUTION_BASE}/accreditation`) ||
      path.startsWith(`${INSTITUTION_BASE}/settings`) ||
      path.startsWith(`${INSTITUTION_BASE}/public-page`))
  ) {
    return 'home';
  }
  return best;
};
