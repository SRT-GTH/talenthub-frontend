import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('recruiterHomeState');

/*
 * recruiterHomeState — URL state of /recruiter/home. Every Figma frame of the "RECRUITER - HOME" section is reachable by URL:
 *
 *   ?user=new                                   (default) "Recruiter Home-New user"            Figma 7249:73882
 *   ?user=existing&actionsMenu=elena-sterling&hoveredAction=mark-as-accepted
 *                                               "Recruiter Home-Existing user", Interview menu, "Mark as Accepted" row hovered   Figma 8063:45341
 *   ?user=existing&actionsMenu=marcus-jensen    existing user, Screening menu (Shortlist / Reshedule interview / Reject)       Figma 8193:78567
 *   ?user=existing&actionsMenu=leila-wong       existing user, Accepted menu (Message candidate / Undo)                         Figma 8193:79434
 *   ?user=existing&actionsMenu=arthur-blair     existing user, Rejected menu (Reconsider)                                       Figma 8193:80078
 *   ?user=existing                              existing user with every row menu closed (not a separate Figma frame)
 *
 * Keys: user = 'new' | 'existing'; actionsMenu = applicant id whose row-action menu is open; hoveredAction = menu action id pinned in its hover
 * look (the real :hover also works). Clicking the "..." button of a row writes actionsMenu; outside click / Escape / choosing an action clears it.
 */
export const USER_KINDS = ['new', 'existing'];

export const useRecruiterHomeState = () => {
  const [params, setParams] = useSearchParams();
  const userKind = params.get('user') === 'existing' ? 'existing' : 'new';
  const actionsMenuApplicantId = userKind === 'existing' ? params.get('actionsMenu') : null;
  const hoveredActionId = actionsMenuApplicantId ? params.get('hoveredAction') : null;

  const setActionsMenuApplicantId = useCallback(
    (applicantId) => {
      log('actionsMenu ->', applicantId);
      const next = new URLSearchParams(params);
      next.delete('hoveredAction');
      if (applicantId) next.set('actionsMenu', applicantId);
      else next.delete('actionsMenu');
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  return { userKind, actionsMenuApplicantId, hoveredActionId, setActionsMenuApplicantId };
};
