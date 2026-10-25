import { useSearchParams } from 'react-router-dom';
import CareerBuddySection from '../../components/sections/profileFilling/CareerBuddySection.jsx';
import { useCareerBuddyRole } from '../../hooks/useCareerBuddyRole.js';
import { isLoggedIn } from '../../services/auth.api.js';
import { LIVE_AVAILABLE } from '../../components/sections/profileFilling/useCareerBuddyLive.jsx';
import RecruiterBuddyLive from '../../components/sections/recruiterBuddy/RecruiterBuddyLive.jsx';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';

/** The signed-in account's own type (not the demo role switch). */
const signedInType = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null')?.entityType || null;
  } catch {
    return null;
  }
};

/**
 * Career Buddy page.
 *
 * 2026-10-18: a logged-in TALENT gets the real Career Buddy (V2 agent) in the
 * newest Focused / Playful screen (CareerBuddySection `live`). `?live=0`
 * forces the scripted demo; `?live=1` forces live. Recruiter, parent and
 * logged-out visitors (DemoNavigator) stay on the scripted demo - the agent
 * only serves talents today. Live is the default only where the agent can be
 * reached (LIVE_AVAILABLE: local dev, or VITE_AGENT_BASE_URL set on the build).
 *
 * 2026-10-25: a logged-in RECRUITER gets the live recruiter Career Buddy (RecruiterBuddyLive); the
 * agent takes the role from the login. `?live=0` still forces the scripted recruiter demo.
 *
 * Remount the shell when the role or mode flips so chat + panel state never
 * briefly renders the previous role's stages (undefined stage.Icon crashes
 * TalentProfilePanel).
 */
export default function CareerBuddyPage() {
  const { role } = useCareerBuddyRole();
  const [params] = useSearchParams();
  const flag = params.get('live');
  const canLive = flag === '1' || (flag !== '0' && LIVE_AVAILABLE && isLoggedIn());
  if (canLive && signedInType() === 'recruiter') return <RecruiterBuddyLive />;
  const live = role === 'talent' && canLive;
  return <CareerBuddySection key={`${role}-${live ? 'live' : 'demo'}`} live={live} />;
}
