/**
 * Centralized localStorage / sessionStorage keys.
 * Prefix with `th:` (talenthub) to avoid collisions when sharing a host.
 */
export const STORAGE_KEYS = {
  authToken: 'th:auth-token',
  refreshToken: 'th:refresh-token',
  userProfile: 'th:user-profile',
};
