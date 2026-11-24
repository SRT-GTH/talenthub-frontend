/*
 * Protected pages (ADR-15): the pages that only make sense for a signed-in account. A signed-out visitor is sent to sign in
 * (components/shared/SignInGate.jsx) instead of seeing the Figma sample person or organisation.
 *
 * Talent, recruiter and parent pages all sign in at /login (the parent page /onboarding/parent-login is not wired to the API
 * yet), with `?next=` so the login page brings them back here; utils/authNext.js resolveNext only follows it inside the
 * account's own area.
 *
 * Not listed (public, or with their own session handling): the landing site, /login and the password pages, sign-up flows
 * (/onboarding/*, /get-started), /logged-out, /security/2-step, invite and consent links, /institutions/:slug,
 * /school-links, and the /admin, /agency, /institution and /data portals.
 *
 * Pure (no browser APIs), so it can be checked with plain node.
 */
export const PROTECTED_PREFIXES = [
  '/home',
  '/profile',
  '/learning',
  '/settings',
  '/my-assessment',
  '/skills-lab',
  '/streak',
  '/job-postings',
  '/opportunity-guidance',
  '/notifications',
  '/wallet',
  '/community',
  '/messages',
  '/career-content',
  '/recruiter',
  '/parent',
];

const under = (pathname, prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`);

export const isProtectedPath = (pathname = '') =>
  PROTECTED_PREFIXES.some((p) => under(pathname, p));

/** Where a signed-out visitor of `pathname` signs in, or null for a public page. */
export const signInPathFor = (pathname = '', search = '') =>
  isProtectedPath(pathname) ? `/login?next=${encodeURIComponent(`${pathname}${search}`)}` : null;

/**
 * True when a signed-in account of `entityType` is on a portal that belongs to another account type, so it would only see
 * that portal's sample data: the recruiter pages are for recruiter accounts. Unknown types are let through.
 */
export const portalAccountMismatch = (pathname = '', entityType = '') => {
  const type = String(entityType || '').toLowerCase();
  if (!type) return false;
  if (under(pathname, '/recruiter')) return type !== 'recruiter';
  return false;
};
