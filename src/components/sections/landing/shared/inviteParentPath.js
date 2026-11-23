import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { isLoggedIn, logoHomePath } from '../../../../services/auth.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('inviteParentPath');

/*
 * Where "Invite my parent" goes (landing For parents & schools + home For everyone › Parents; product owner, 2026-11-13).
 * The button speaks as the child: the child invites the parent, and the parent then joins from the emailed link (flow B).
 *   signed out      -> talent sign-up (role picker, Talent selected). Under-18s give a parent's contact at step 06
 *                      /onboarding/talent/parent-info, which sends the invite.
 *   signed-in talent -> Settings › Parent or guardian, invite form (/settings/guardian?state=invite)
 *                      ⚠️ that form's "send" is not wired to the backend yet (wiki/backend-integration-gaps.md).
 *   anyone else signed in (parent, recruiter, …) -> their own home
 * Read at click / render time, so it follows the current session.
 */
export const inviteParentPath = () => {
  if (!isLoggedIn()) return LANDING_ROUTES.getStartedTalent;
  const home = logoHomePath();
  const dest = home === '/home' ? LANDING_ROUTES.talentInviteParent : home;
  log('signed in, home', home, '->', dest);
  return dest;
};

export default inviteParentPath;
