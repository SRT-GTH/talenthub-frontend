import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { STORAGE_KEYS } from '../../../../constants/storageKeys.js';
import { isLoggedIn } from '../../../../services/auth.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('schoolSignUpPath');

/*
 * Where "Bring GTH to my school" goes (For parents & schools › Schools + home For everyone › Schools; product owner, 2026-11-13).
 *   default                    -> institution sign-up, Figma 11.1.1a (/institution/sign-up)
 *   signed-in school staff     -> their portal (/institution), which handles accreditation / approval itself
 * Staff are recognised the way auth.api resolveHomePath does, using only the strong signals stored at login
 * (metadata.isPrimaryContact / institutionRole). organizationId alone is not used: a school's students carry it too.
 */
export const schoolSignUpPath = () => {
  if (!isLoggedIn()) return LANDING_ROUTES.institutionSignUp;
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
  } catch {
    user = null;
  }
  const m = user?.metadata || {};
  const staff = Boolean(m.isPrimaryContact || m.institutionRole);
  log('signed in', { staff });
  return staff ? LANDING_ROUTES.institutionPortal : LANDING_ROUTES.institutionSignUp;
};

export default schoolSignUpPath;
