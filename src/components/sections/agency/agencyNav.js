/*
 * agencyNav.js — the ONE list of agency destinations (Theme 11, Figma canvas 8605:395409), shared by the expanded sidebar (303),
 * the icon rail (80) and the phone / tablet drawer. `icon` is a key of NAV_ICONS in AgencyNavItem.jsx. `match` lists the pathname
 * prefixes that mark the item active (longest prefix wins). Sign-up, MoU upload, the A4 report and the public page have no nav item.
 */

export const AGENCY_BASE = '/agency';

export const PRIMARY_NAV = [
  { id: 'home', label: 'Home', to: AGENCY_BASE, icon: 'home' },
  {
    id: 'districts',
    label: 'Districts',
    to: `${AGENCY_BASE}/districts`,
    icon: 'map',
    // Figma 11.4.2b/k-o highlight Districts on the region, district and compare pages
    match: [`${AGENCY_BASE}/districts`, `${AGENCY_BASE}/regions`, `${AGENCY_BASE}/compare`],
  },
  {
    id: 'programmes',
    label: 'Programmes',
    to: `${AGENCY_BASE}/programmes`,
    icon: 'book',
    match: [`${AGENCY_BASE}/programmes`],
  },
  {
    id: 'queries',
    label: 'Queries',
    to: `${AGENCY_BASE}/queries`,
    icon: 'filter',
    match: [`${AGENCY_BASE}/queries`],
  },
  {
    id: 'data-requests',
    label: 'Data requests',
    to: `${AGENCY_BASE}/data-requests`,
    icon: 'lock',
    match: [`${AGENCY_BASE}/data-requests`],
  },
  {
    id: 'applicants',
    label: 'Applicants',
    to: `${AGENCY_BASE}/applicants`,
    icon: 'users',
    match: [`${AGENCY_BASE}/applicants`],
  },
];

export const SECONDARY_NAV = [
  {
    id: 'national',
    label: 'National data',
    to: `${AGENCY_BASE}/national`,
    icon: 'chart',
    // ⚠️ ASSUMPTION: regions, compare, outcomes, trends, methodology and the briefing pack are views of national data (the
    // 11.4.2 / 11.4.4 frames keep the same rail); the frames that were checked highlight "National data".
    match: [
      `${AGENCY_BASE}/national`,
      `${AGENCY_BASE}/outcomes`,
      `${AGENCY_BASE}/trends`,
      `${AGENCY_BASE}/methodology`,
      `${AGENCY_BASE}/briefing`,
    ],
  },
  {
    id: 'demand',
    label: 'Demand & outcomes',
    to: `${AGENCY_BASE}/demand`,
    icon: 'trend',
    match: [`${AGENCY_BASE}/demand`],
  },
];

/** The nav item id that is active for a pathname (longest matching prefix; Home on /agency, welcome, mou/* and settings). */
export const activeNavId = (pathname) => {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === AGENCY_BASE || path === `${AGENCY_BASE}/welcome`) return 'home';
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
  // ⚠️ ASSUMPTION: the MoU status pages and settings keep Home highlighted (the MoU frames do).
  if (
    !best &&
    (path.startsWith(`${AGENCY_BASE}/mou`) || path.startsWith(`${AGENCY_BASE}/settings`))
  ) {
    return 'home';
  }
  return best;
};
