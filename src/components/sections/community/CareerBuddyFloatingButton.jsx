import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import CareerBuddyVoiceAvatar from '../../shared/CareerBuddyVoiceAvatar.jsx';

const log = debug('CareerBuddyFloatingButton');

/*
 * CareerBuddyFloatingButton — the always-on-screen Career Buddy launcher.
 * Source: Figma 7025:88604 ("avatar showcase"), found inside the community
 * "Recruiter Home" frames at x=1572/y=1000 on a 1728x1117 canvas — i.e.
 * `right: 1728-1572-100 = 56px`, `bottom: 1117-1000-100 = 17px` — a fixed
 * 100x100 circle pinned to the bottom-right corner, present on every
 * community screen state (Figma's own annotation: shows on the page always,
 * like a chatbot launcher).
 *
 * Reuses `CareerBuddyVoiceAvatar` for the mascot instead of a new asset —
 * Figma's "image 9" here is the white robot-with-orange-headphones mascot
 * (career-buddy-voice-robot.png), the SAME one used on the voice-call /
 * choose-a-voice screens — not `CareerBuddyAvatar`'s green penguin (an
 * earlier pass reused the wrong one; corrected here). It's also a cleaner
 * fit than a fresh asset would be: `CareerBuddyVoiceAvatar` already ships
 * with no background chrome of its own ("IMAGE only, no solid/gradient
 * badge fill" per its own header comment), so it drops straight into this
 * button's own white circle + border + shadow without a second gradient
 * fighting it. `⚠️ ASSUMPTION`: Figma also layers a separate 112px glow
 * ellipse behind the mascot that isn't reproduced here, since neither
 * existing avatar component models that extra ring and it isn't essential
 * to the launcher reading correctly.
 */

const CareerBuddyFloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        log('open Career Buddy from floating launcher');
        navigate('/profile/filling/career-buddy');
      }}
      aria-label="Open Career Buddy"
      className="fixed bottom-[17px] right-[56px] z-30 flex size-[100px] items-center justify-center rounded-full border border-[#e1eae2] bg-white shadow-[0px_3px_12px_0px_rgba(56,115,64,0.12)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <CareerBuddyVoiceAvatar size={90} />
    </button>
  );
};

export default CareerBuddyFloatingButton;
