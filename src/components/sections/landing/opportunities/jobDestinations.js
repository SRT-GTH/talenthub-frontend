import { isLoggedIn } from '../../../../services/auth.api.js';
import { loginThen } from '../../../../utils/authNext.js';

/*
 * Where the card goes (product owner, 2026-11-13). Signed in: the role in the talent jobs page; the heart saves it there and opens Saved.
 * Signed out: log in first, then the same place (`/login?next=`, utils/authNext.js).
 * ⚠️ The sample roles' ids do not exist in the backend, so until a public jobs endpoint feeds this page the jobs page cannot find
 * them: an unknown `job` falls back to the Browse list and an unknown `save` is dropped (wiki/backend-integration-gaps.md).
 */
export const jobDestinations = (job) => {
  const id = encodeURIComponent(job.id);
  const openPath = `/job-postings?tab=browse&job=${id}`;
  const savePath = `/job-postings?tab=saved&save=${id}`;
  const signedIn = isLoggedIn();
  return {
    open: signedIn ? openPath : loginThen(openPath),
    save: signedIn ? savePath : loginThen(savePath),
  };
};

export default jobDestinations;
