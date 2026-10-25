import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import AskBuddyFabButton from '../../ui/AskBuddyFabButton.jsx';

const log = debug('AgencyBuddyFab');

/*
 * AgencyBuddyFab — the Ask Buddy launcher of the agency, institution and admin chrome. 2026-10-25: an icon, not a pill (Figma "GTH · Ask Buddy FAB" 9412:550912): the 72 round Buddy head with
 * the charge ring and the wake-up nudge (ui/AskBuddyFabButton.jsx), 24px from the right and 16px from the bottom (56 on phones). It replaces the 163 x 72 pill (8795:435377) and the 64 round
 * sparkles button (8613:430 / 8707:427539).
 * ⚠️ ASSUMPTION: Figma draws no Ask Buddy panel for agencies; the launcher opens the existing Career Buddy page. The portals are Focused-only in Figma, so the FAB follows the user's UI style
 * (the Playful nudge only shows if a staff member has Playful on).
 */

const AgencyBuddyFab = () => {
  const navigate = useNavigate();
  const open = () => {
    log('open Career Buddy');
    navigate('/profile/filling/career-buddy');
  };
  return (
    <AskBuddyFabButton
      onClick={open}
      className="fixed right-[24px] bottom-[16px] z-40 max-lg:right-[16px]"
    />
  );
};

export default AgencyBuddyFab;
