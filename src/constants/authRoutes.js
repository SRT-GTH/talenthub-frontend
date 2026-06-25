/*
 * authRoutes — single source of truth for the auth entry points per role, plus
 * helpers to derive the active role + mode from the current pathname.
 *
 * Used by OnboardingNavbar so its CTA is context-aware:
 *   - On a SIGN-IN surface  → "Create Account" → that role's sign-up entry
 *   - On a SIGN-UP surface  → "Log In"         → that role's sign-in entry
 *
 * To add a dedicated sign-in/up page for a role, just point the entry here —
 * the navbar picks it up automatically.
 */

export const AUTH_ROUTES = {
  talent: {
    signIn: '/login',
    signUp: '/onboarding/talent/welcome',
  },
  institution: {
    // No dedicated institution sign-in page exists yet — falls back to the
    // shared /login. Point this at an institution login route once it's built.
    signIn: '/login',
    signUp: '/onboarding/institution/guidelines',
  },
  parent: {
    signIn: '/onboarding/parent-login',
    signUp: '/onboarding/parent-welcome',
  },
};

// Generic (role-agnostic) auth surfaces — the shared login and the role-select
// page. Here "Create Account" goes to role selection, not a specific role's
// sign-up flow.
const GENERIC_ROUTES = {
  signIn: '/login',
  signUp: '/get-started',
};

// Pathnames (prefixes) that are SIGN-IN surfaces. Everything else under an
// onboarding role is treated as a SIGN-UP surface.
const SIGN_IN_PREFIXES = ['/login', '/onboarding/parent-login'];

/**
 * Derive the active auth role from a pathname, or `null` for generic surfaces
 * (`/login`, `/get-started`) where no role has been chosen yet.
 */
export const getAuthRole = (pathname) => {
  if (pathname.startsWith('/onboarding/institution')) return 'institution';
  if (pathname.startsWith('/onboarding/parent')) return 'parent';
  if (pathname.startsWith('/onboarding/talent')) return 'talent';
  return null;
};

/** 'signin' if the pathname is a sign-in surface, else 'signup'. */
export const getAuthMode = (pathname) =>
  SIGN_IN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    ? 'signin'
    : 'signup';

/**
 * Resolve the navbar CTA for a pathname.
 * Returns { label, to, mode }:
 *   - on a sign-in page → offer sign-up ("Create Account")
 *   - on a sign-up page → offer sign-in ("Log In")
 * Role-agnostic surfaces (e.g. /login) send "Create Account" to /get-started
 * (role selection) rather than any single role's sign-up flow.
 */
export const getNavAuthCta = (pathname) => {
  const role = getAuthRole(pathname);
  const mode = getAuthMode(pathname);
  const routes = role ? AUTH_ROUTES[role] : GENERIC_ROUTES;

  return mode === 'signin'
    ? { label: 'Create Account', to: routes.signUp, mode }
    : { label: 'Log In', to: routes.signIn, mode };
};
