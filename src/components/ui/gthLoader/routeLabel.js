/*
 * routeLabel — the caption under the page-switch loader (Figma LD-03 / LD-04: "Opening Clubs…"). The loader names the page you are moving to, so the label follows the route.
 * Longest prefix wins; an unlisted route falls back to "Loading…".
 */
const LABELS = [
  ['/profile/filling/career-buddy', 'Opening Career Buddy…'],
  ['/profile/filling/recruiter-buddy', 'Opening Recruiter Buddy…'],
  ['/profile/filling', 'Opening your profile…'],
  ['/profile/engagement', 'Opening your journey…'],
  ['/profile', 'Opening your profile…'],
  ['/home', 'Opening Home…'],
  ['/community', 'Opening Clubs…'],
  ['/clubs', 'Opening Clubs…'],
  ['/my-assessment', 'Opening My Assessment…'],
  ['/opportunity-guidance', 'Opening Opportunities…'],
  ['/opportunities', 'Opening Opportunities…'],
  ['/jobs', 'Opening Opportunities…'],
  ['/wallet', 'Opening Wallet…'],
  ['/messages', 'Opening Messages…'],
  ['/skills-lab', 'Opening Skills Lab…'],
  ['/learning', 'Opening My Learning…'],
  ['/streak', 'Opening your streak…'],
  ['/notifications', 'Opening Notifications…'],
  ['/settings', 'Opening Settings…'],
];

export const routeLabel = (pathname = '') => {
  const hit = LABELS.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return hit ? hit[1] : 'Loading…';
};
