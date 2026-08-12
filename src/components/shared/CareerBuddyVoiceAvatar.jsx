import careerBuddyVoiceRobot from '../../assets/engagement/career-buddy-voice-robot.png';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('CareerBuddyVoiceAvatar');

/*
 * CareerBuddyVoiceAvatar — white robot-with-orange-headphones mascot used
 * on voice call + Choose-a-voice screens (Figma 5146:75913 / 76230,
 * Frame 14220). Distinct from CareerBuddyAvatar (penguin) used in chat
 * bubbles / first-time hero.
 *
 * Asset: src/assets/engagement/career-buddy-voice-robot.png
 */
const CareerBuddyVoiceAvatar = ({ size = 100, className = '', speaking = false }) => {
  log('render', { size, speaking });

  return (
    <span
      className={classNames(
        // Figma 5146:76042 — IMAGE only, no solid/gradient badge fill behind the robot.
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent',
        className
      )}
      style={size == null ? undefined : { width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src={careerBuddyVoiceRobot}
        alt=""
        draggable="false"
        className="size-full object-cover"
      />
      {speaking && (
        <span
          className="pointer-events-none absolute inset-[-6px] rounded-full border-2 border-brand-green/40 animate-pulse"
          aria-hidden="true"
        />
      )}
    </span>
  );
};

export default CareerBuddyVoiceAvatar;
