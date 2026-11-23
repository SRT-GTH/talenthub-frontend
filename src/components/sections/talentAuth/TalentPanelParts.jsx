import gdpaCheck from '../../../assets/talent-onboarding/panel-gdpa-check.svg';
import watchTutorialCircle from '../../../assets/talent-onboarding/watch-tutorial-circle.png';
import { debug } from '../../../utils/debug.js';
import ghanaFlag from '../../../assets/entry/login-ghana-flag.svg';
import { GenzDoodleStar } from '../../shared/assets.jsx';
import { useOpenTalentTutorial } from './talentTutorialContext.js';

const log = debug('TalentPanelParts');

/*
 * TalentPanelParts - shared building blocks for the talent right-panel
 * compositions of the Welcome, DOB and Personal-info steps.
 *
 * Figma: 8027:203076 (DOB panel 739x916), 8027:204534 (Personal panel 739x916),
 * 8027:202190 (Welcome panel 739x976).
 *
 * Responsive contract (same idea as the parent flow's approved panel, see
 * ParentLoginPanelContent): NOTHING is sized in vw or fixed px against the
 * viewport. Every element is positioned as a % of the "stage" on both axes and
 * every size/type metric is a container-query unit of the stage width
 * (1cqw = 1% of the stage = 7.39 Figma px). The stage is the Figma panel's aspect
 * ratio (739 x refH) letter-boxed and centred inside the panel
 * (width = min(panelW, panelH * 739/refH)), so on short or narrow panels
 * (1280x560, 1024x600, 1920x700) the whole composition scales down together
 * instead of cards clipping each other or the chips overlapping the photos.
 * At the Figma panel size the stage equals the panel, so pixels match.
 */

const REF_W = 739;

// Figma px -> cqw of the stage (1cqw = REF_W/100 px at the Figma size).
// eslint-disable-next-line react-refresh/only-export-components
export const cq = (px) => `${((px / REF_W) * 100).toFixed(3)}cqw`;
// Font size with a legibility floor; the panel is decorative (aria-hidden).
// eslint-disable-next-line react-refresh/only-export-components
export const fs = (px, floor = 6) => `max(${floor}px, ${cq(px)})`;

// Figma card shadow (effects of the photo-card frames, panel scale).
// eslint-disable-next-line react-refresh/only-export-components
export const cardShadow = () =>
  `0 ${cq(16)} ${cq(24)} ${cq(-6)} rgba(27,36,44,0.16), 0 ${cq(2)} ${cq(2)} ${cq(-1)} rgba(27,36,44,0.04)`;

/*
 * PanelStage - letter-boxed, aspect-locked coordinate space for the panel art.
 * refH = Figma panel height (916 for DOB/Personal, 976 for Welcome).
 */
export const PanelStage = ({ refH, decorative = true, children }) => {
  log('render stage', { refH });
  return (
    <div
      aria-hidden={decorative ? 'true' : undefined}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ containerType: 'size' }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: `min(100cqw, calc(100cqh * ${(REF_W / refH).toFixed(5)}))`,
          aspectRatio: `${REF_W} / ${refH}`,
          transform: 'translate(-50%, -50%)',
          containerType: 'inline-size',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/*
 * StageCard - rotated bordered photo card, centred on (cx, cy) % of the stage.
 *   size   card side as % of stage width (square cards: aspect 1)
 *   aspect CSS aspect-ratio (default '1')
 *   inset  [top,right,bottom,left] Figma px the photo layer bleeds past the
 *          card's padding box (Figma image frame is offset from the card frame)
 *   radius / border  Figma px (default 40 / 10)
 *   ellipse  corner-glow SVG (Figma 'Ellipse 5' pattern) at the photo's top-left
 */
export const StageCard = ({
  photo,
  cx,
  cy,
  size,
  aspect = '1',
  rotate,
  borderColor,
  radius = 40,
  border = 10,
  inset = [0, 0, 0, 0],
  ellipse,
  ellipseBox = 238,
  ellipseImg = 223,
  ellipseLeft = -75.84,
  ellipseTop = -85.44,
  // Focused look ("Focused ·" frames): its own centre / size, drawn flat unless focused.rotate is given.
  focused,
  children,
}) => (
  <div
    // Position + tilt come from CSS variables so the focused: variant can swap them (inline styles can't be overridden).
    className="gth-mode-move absolute [--sc-r:var(--sc-r-p)] [--sc-w:var(--sc-w-p)] [--sc-x:var(--sc-x-p)] [--sc-y:var(--sc-y-p)] focused:[--sc-r:var(--sc-r-f)] focused:[--sc-w:var(--sc-w-f)] focused:[--sc-x:var(--sc-x-f)] focused:[--sc-y:var(--sc-y-f)]"
    style={{
      '--sc-x-p': `${cx}%`,
      '--sc-y-p': `${cy}%`,
      '--sc-w-p': `${size}%`,
      '--sc-r-p': `${rotate}deg`,
      '--sc-x-f': `${focused?.cx ?? cx}%`,
      '--sc-y-f': `${focused?.cy ?? cy}%`,
      '--sc-w-f': `${focused?.size ?? size}%`,
      '--sc-r-f': `${focused?.rotate ?? 0}deg`,
      left: 'var(--sc-x)',
      top: 'var(--sc-y)',
      width: 'var(--sc-w)',
      aspectRatio: aspect,
      transform: 'translate(-50%, -50%) rotate(var(--sc-r))',
    }}
  >
    <div
      className="gth-mode-move absolute inset-0 overflow-hidden focused:shadow-[0_2px_2px_-1px_rgba(27,36,44,0.04),0_10px_17px_-6px_rgba(27,36,44,0.08)]!"
      style={{
        border: `${cq(border)} solid ${borderColor}`,
        borderRadius: cq(radius),
        boxShadow: cardShadow(),
        backgroundColor: '#fff',
      }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          top: cq(inset[0]),
          right: cq(inset[1]),
          bottom: cq(inset[2]),
          left: cq(inset[3]),
        }}
      >
        <img
          src={photo}
          alt=""
          draggable={false}
          className="absolute inset-0 block size-full object-cover"
        />
        {ellipse && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: cq(ellipseLeft),
              top: cq(ellipseTop),
              width: cq(ellipseBox),
              aspectRatio: '1',
            }}
          >
            <img
              src={ellipse}
              alt=""
              draggable={false}
              className="block shrink-0"
              style={{ width: cq(ellipseImg), aspectRatio: '1', transform: 'rotate(-4deg)' }}
            />
          </div>
        )}
      </div>
    </div>
    {children}
  </div>
);

/* Data Protected chip - Figma 8027:203092 (267.6 x 64). left/top = % of stage. */
export const DataProtectedChip = ({ left, top }) => (
  <div
    className="gth-mode-move absolute flex items-center border border-[#fffefc] bg-[#ebf1ec] playful:rotate-[3deg] playful:border-[1.2px]! playful:border-[#1c2a21]! playful:shadow-[3px_3px_0_#1c2a21]!"
    style={{
      left: `${left}%`,
      top: `${top}%`,
      width: cq(267.6),
      borderRadius: cq(13),
      gap: cq(9),
      padding: `${cq(13.4)} ${cq(14.7)}`,
      boxShadow: cardShadow(),
    }}
  >
    <div
      className="shrink-0 bg-[#387440]"
      style={{ width: cq(36), height: cq(36), borderRadius: cq(9) }}
    />
    <div className="flex min-w-0 flex-col text-[#595959]" style={{ gap: cq(2) }}>
      <p className="whitespace-nowrap font-bold" style={{ fontSize: fs(12), lineHeight: 1.19 }}>
        Data Protected
      </p>
      <p
        className="whitespace-nowrap opacity-[0.72]"
        style={{ fontSize: fs(10, 5), lineHeight: 1.22 }}
      >
        Encrypted · Never shared without consent
      </p>
    </div>
  </div>
);

/* Ghana Data Protection Act badge - Figma 8027:203105 (287.6 x 40). */
export const GdpaBadge = ({ left, top }) => (
  <div
    className="gth-mode-move absolute flex items-center border border-[rgba(28,42,33,0.06)] bg-white playful:-rotate-[3deg] playful:border-[1.2px]! playful:border-[#1c2a21]! playful:bg-[#ffd86b]! playful:shadow-[3px_3px_0_#1c2a21]!"
    style={{
      left: `${left}%`,
      top: `${top}%`,
      width: cq(287.6),
      borderRadius: cq(10),
      gap: cq(8),
      padding: `${cq(8)} ${cq(10)}`,
      boxShadow: `0 ${cq(8)} ${cq(32)} rgba(0,0,0,0.1), 0 ${cq(2)} 0 rgba(0,0,0,0.05)`,
    }}
  >
    <img
      src={gdpaCheck}
      alt=""
      draggable={false}
      className="shrink-0"
      style={{ width: cq(13.6), height: cq(13.6), transform: 'rotate(8deg)' }}
    />
    <p
      className="whitespace-nowrap font-semibold text-[#387440] playful:text-[#525252]"
      style={{ fontSize: fs(14), lineHeight: cq(24), letterSpacing: '0.1px' }}
    >
      Ghana Data Protection Act compliant
    </p>
  </div>
);

/* Adult / Youth experience card - Figma 8027:203112 (235.1 x 102). */
export const AdultYouthCard = ({ left, top }) => (
  <div
    className="gth-mode-move absolute flex flex-col border border-[#e6e6e6] playful:rotate-[3deg] playful:border-[1.2px]! playful:border-[#1c2a21]! playful:bg-[rgba(255,255,255,0.92)]! playful:shadow-[3px_3px_0_#1c2a21]!"
    style={{
      left: `${left}%`,
      top: `${top}%`,
      width: cq(235.1),
      borderRadius: cq(16),
      gap: cq(10),
      padding: `${cq(16)} ${cq(21)}`,
      backgroundColor: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      boxShadow: `0 ${cq(12)} ${cq(44)} rgba(0,0,0,0.1), 0 ${cq(2)} 0 rgba(0,0,0,0.05)`,
    }}
  >
    <div
      className="flex items-center bg-[#e1eae2]"
      style={{ gap: cq(9), padding: cq(8), borderRadius: cq(6) }}
    >
      <span
        className="shrink-0 rounded-full bg-[#387440]"
        style={{ width: cq(6), height: cq(6) }}
      />
      <span
        className="whitespace-nowrap font-semibold text-[#387440]"
        style={{ fontSize: fs(12), lineHeight: 1.3 }}
      >
        Adult experience
      </span>
    </div>
    <div
      className="flex items-center"
      style={{ gap: cq(9), padding: `${cq(6)} ${cq(8)}`, borderRadius: cq(6) }}
    >
      <span
        className="shrink-0 rounded-full bg-[#575755]"
        style={{ width: cq(6), height: cq(6) }}
      />
      <span
        className="whitespace-nowrap text-[#959592]"
        style={{ fontSize: fs(12), lineHeight: 1.3 }}
      >
        Youth experience
      </span>
    </div>
  </div>
);

/*
 * StageWatchTutorial (Figma node export, not the shared WatchTutorial) - Figma "Watch tutorial component": the button-only 72px
 * circle (label pill is opacity 0 in the frames) at left 610 / top 804 of the
 * 739-wide panel. Scaled with the stage via container units.
 */
export const StageWatchTutorial = ({ label = 'Watch onboarding tutorial', refH, onClick }) => {
  const openTutorial = useOpenTalentTutorial();
  return (
    <div
      className="pointer-events-auto absolute z-10"
      style={{
        left: `${((610 / REF_W) * 100).toFixed(2)}%`,
        top: `${((804 / refH) * 100).toFixed(2)}%`,
      }}
    >
      <button
        type="button"
        aria-label={label}
        onClick={() => {
          log('watch tutorial clicked');
          (onClick ?? openTutorial)?.();
        }}
        className="block cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        style={{ width: 'max(36px, 9.74cqw)', aspectRatio: '1' }}
      >
        {/* Figma 8027:203121 'Frame 145' (glass 72px circle) exported as PNG @3x */}
        <img src={watchTutorialCircle} alt="" draggable={false} className="block size-full" />
      </button>
    </div>
  );
};

/* Sparkle-26 doodle (Figma 'spark, sparkle, 26' 76.7 x 73.9 before rotation). */
export const StageSparkle = ({ src, cx, cy, rotate }) => (
  <img
    src={src}
    alt=""
    draggable={false}
    className="absolute block max-w-none focused:hidden"
    style={{
      left: `${cx}%`,
      top: `${cy}%`,
      width: cq(76.735),
      aspectRatio: '76.735 / 73.945',
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
    }}
  />
);

/*
 * Playful-only stage touches: doodle stars and the "Built for Ghana's next gen" brand sticker (the washi-tape strips drawn in Figma
 * are left out, product owner 2026-11-15). Hidden in the Focused look (the "Focused ·" frames have none).
 * Positions are % of the aspect-locked stage; sizes are container units of it.
 */
export const StageStar = ({ x, y, size }) => (
  <GenzDoodleStar
    className="absolute hidden playful:block"
    style={{ left: `${x}%`, top: `${y}%`, width: cq(size), height: cq(size) }}
  />
);

export const StageBrandSticker = ({ x, y, rotate = -4 }) => (
  <div
    aria-hidden="true"
    className="absolute hidden items-center whitespace-nowrap border-[1.2px] border-[#1c2a21] bg-[#fbf6ea] playful:flex"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      gap: cq(8),
      padding: `${cq(8)} ${cq(14)}`,
      borderRadius: cq(10),
      boxShadow: `${cq(3)} ${cq(3)} 0 #1c2a21`,
    }}
  >
    <img src={ghanaFlag} alt="" draggable={false} style={{ width: cq(18), height: cq(18) }} />
    <p className="font-bold leading-none text-[#1c2a21]" style={{ fontSize: fs(15) }}>
      Built for Ghana&apos;s next gen
    </p>
  </div>
);
