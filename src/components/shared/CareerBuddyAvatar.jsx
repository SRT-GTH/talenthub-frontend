import careerBuddyPenguin from '../../assets/engagement/career-buddy-penguin.png';

/*
 * CareerBuddyAvatar — the Career Buddy mascot circle, shared between the
 * chat message avatar (48px, Figma 5132:43392) and the first-time-welcome
 * intro card (80px, Figma 5132:45008). Both are the exact same treatment
 * at two sizes: radial brand-green gradient fading to transparent, with a
 * cropped/zoomed close-up of career-buddy-penguin.png centred on its face
 * (Figma's own "image 9" crop). Extracted here so the two screens (chat
 * bubble in ChatThread.jsx, hero card in CareerBuddySection.jsx) share one
 * definition instead of duplicating the gradient + crop maths.
 *
 * Figma documents the inner image at a fixed ratio of the circle
 * (37/48 = 62/80 = 0.775), not a formula — so sizes are looked up, not
 * computed, to stay exact at the two documented scales.
 */
const IMAGE_SIZE = { 48: 37, 80: 62 };

const CareerBuddyAvatar = ({ size = 48, className = '' }) => (
  <span
    aria-hidden="true"
    className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
    style={{
      width: size,
      height: size,
      background:
        'radial-gradient(circle, rgba(56,116,64,1) 0%, rgba(106,151,112,0.75) 45%, rgba(255,255,255,0) 80%)',
    }}
  >
    <img
      src={careerBuddyPenguin}
      alt=""
      draggable="false"
      className="absolute object-cover"
      style={{
        width: IMAGE_SIZE[size] ?? Math.round(size * 0.775),
        height: IMAGE_SIZE[size] ?? Math.round(size * 0.775),
      }}
    />
  </span>
);

export default CareerBuddyAvatar;
