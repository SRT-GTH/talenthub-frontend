import { createPortal } from 'react-dom';
import { GenzDoodleStar } from '../../shared/assets.jsx';

/*
 * Shared pieces for the sign-up step pop-ups (Identity captured, Address confirmed, Education recorded,
 * Not quite yet). The look follows the sign-up style switch:
 *   Focused: the pop-up's own edge and soft shadow (unchanged).
 *   Playful: ink edge @55% + hard 4px ink shadow, a tilted gold sticker on the top-left corner, three doodle
 *            stars around the illustration, and the sticker-style spot illustration in place of the icon tile.
 */

// Card classes added on top of each pop-up's own: `!` beats the inline border / shadow the Focused look sets.
export const PLAYFUL_STEP_DIALOG =
  'playful:border-[1.5px]! playful:border-[rgba(28,42,33,0.55)]! playful:shadow-[0_16px_20px_rgba(28,42,33,0.1),4px_4px_0_rgba(28,42,33,0.45)]!';

// Pop-ups render into <body> so a step's layout (scroll column, transforms) can never offset or clip them.
export const DialogPortal = ({ children }) => createPortal(children, document.body);

export const DialogSticker = ({ children }) => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute left-6 top-[-17px] z-10 hidden rotate-[5deg] whitespace-nowrap rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.5px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:block max-sm:top-2 max-sm:left-4"
  >
    {children}
  </span>
);

/*
 * Playful spot illustration with its three doodle stars. In the design the 96px spot is centred in the 440px card
 * and the stars sit at fixed card positions (gold 18px and 11px to the right, green 12px to the left). They are
 * placed relative to the spot here, so they stay around it on phones too.
 *   spotTop: the spot's top edge in the designed card (px from the card's outer edge).
 *   padTop:  the card's own top padding in code; the 1.5px Playful border is added on top of it.
 */
const SPOT = 96;
const SPOT_LEFT = (440 - SPOT) / 2;
const PLAYFUL_BORDER = 1.5;
const STARS = [
  { size: 18, color: '#C8951A', left: 370, top: 118 },
  { size: 11, color: '#C8951A', left: 346, top: 150 },
  { size: 12, color: '#387440', left: 40, top: 124 },
];

const PlayfulSpot = ({ spot, spotTop, padTop }) => {
  const marginTop = Math.max(0, Math.round(spotTop - padTop - PLAYFUL_BORDER));
  return (
    <span
      aria-hidden="true"
      className="relative hidden size-24 playful:mt-(--spot-mt) playful:mb-2 playful:block max-sm:size-20 playful:max-sm:mt-2"
      style={{ '--spot-mt': `${marginTop}px` }}
    >
      <img src={spot} alt="" draggable={false} className="size-full" />
      {STARS.map((s) => (
        <GenzDoodleStar
          key={`${s.left}-${s.top}`}
          size={s.size}
          color={s.color}
          className="absolute"
          style={{ left: s.left - SPOT_LEFT, top: s.top - spotTop }}
        />
      ))}
    </span>
  );
};

// Focused icon tile (children) / Playful spot illustration (spot). Without a spot the tile shows in both looks.
export const DialogHero = ({ spot, spotTop = 60, padTop = 32, children }) => (
  <>
    <span className={spot ? 'playful:hidden' : undefined}>{children}</span>
    {spot ? <PlayfulSpot spot={spot} spotTop={spotTop} padTop={padTop} /> : null}
  </>
);

// Button label: Focused / Playful wording.
export const LookLabel = ({ focused, playful }) => (
  <>
    <span className="playful:hidden">{focused}</span>
    <span className="hidden playful:inline">{playful}</span>
  </>
);
