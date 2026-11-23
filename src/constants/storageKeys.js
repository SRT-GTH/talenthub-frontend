/**
 * Centralized localStorage / sessionStorage keys.
 * Prefix with `th:` (talenthub) to avoid collisions when sharing a host.
 */
export const STORAGE_KEYS = {
  authToken: 'th:auth-token',
  refreshToken: 'th:refresh-token',
  userProfile: 'th:user-profile',
  // 2-step verification set-up hint from the sign-in (services/mfa.api.js; the reminder banner reads it)
  mfaSetup: 'th:mfa-setup',
  // Talent onboarding session token (sessionStorage, backend session lives 48 h)
  onboardingSession: 'th:onboarding-session',
};
