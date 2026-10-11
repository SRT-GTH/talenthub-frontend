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
 *
 * RESPONSIVE: 56px on phones (sits above the 64px bottom tab bar + safe area),
 * 72px on tablets, the Figma 100px / 17px / 56px placement from lg up.
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
      className="fixed bottom-[calc(68px+env(safe-area-inset-bottom))] right-4 z-30 flex size-14 items-center justify-center rounded-full md:bottom-6 md:right-6 md:size-[72px] lg:bottom-[17px] lg:right-[56px] lg:size-[100px] border border-[#e1eae2] bg-white shadow-[0px_3px_12px_0px_rgba(56,115,64,0.12)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <CareerBuddyVoiceAvatar size={null} className="size-11 md:size-14 lg:size-[90px]" />
    </button>
  );
};

export default CareerBuddyFloatingButton;
