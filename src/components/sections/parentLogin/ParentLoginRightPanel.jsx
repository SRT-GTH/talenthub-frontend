import WatchTutorial from '../../ui/WatchTutorial.jsx';
import bgLines from '../../../assets/hero/institution-panel-bg-lines.svg';
import bgGrid from '../../../assets/hero/institution-panel-bg-grid.png';
import blElement from '../../../assets/svg/PATENT_ONBOARDING _PANEL_BL_ELEMENT.svg';
// Sparkle star composite — 2884:64833 (5 vectors, 100×102px, same coords as institution)
import panelSparkle0 from '../../../assets/hero/panel-sparkle-0.svg';
import panelSparkle1 from '../../../assets/hero/panel-sparkle-1.svg';
import panelSparkle2 from '../../../assets/hero/panel-sparkle-2.svg';
import panelSparkle3 from '../../../assets/hero/panel-sparkle-3.svg';
import panelSparkle4 from '../../../assets/hero/panel-sparkle-4.svg';
// Snow ring dots composite — 2884:64834 (21 vectors, 447×359px, same coords as institution)
import panelSnow0 from '../../../assets/hero/panel-snow-0.svg';
import panelSnow1 from '../../../assets/hero/panel-snow-1.svg';
import panelSnow2 from '../../../assets/hero/panel-snow-2.svg';
import panelSnow3 from '../../../assets/hero/panel-snow-3.svg';
import panelSnow4 from '../../../assets/hero/panel-snow-4.svg';
import panelSnow5 from '../../../assets/hero/panel-snow-5.svg';
import panelSnow6 from '../../../assets/hero/panel-snow-6.svg';
import panelSnow7 from '../../../assets/hero/panel-snow-7.svg';
import panelSnow8 from '../../../assets/hero/panel-snow-8.svg';
import panelSnow9 from '../../../assets/hero/panel-snow-9.svg';
import panelSnow10 from '../../../assets/hero/panel-snow-10.svg';
import panelSnow11 from '../../../assets/hero/panel-snow-11.svg';
import panelSnow12 from '../../../assets/hero/panel-snow-12.svg';
import panelSnow13 from '../../../assets/hero/panel-snow-13.svg';
import panelSnow14 from '../../../assets/hero/panel-snow-14.svg';
import panelSnow15 from '../../../assets/hero/panel-snow-15.svg';
import panelSnow16 from '../../../assets/hero/panel-snow-16.svg';
import panelSnow17 from '../../../assets/hero/panel-snow-17.svg';
import panelSnow18 from '../../../assets/hero/panel-snow-18.svg';
import panelSnow19 from '../../../assets/hero/panel-snow-19.svg';
import panelSnow20 from '../../../assets/hero/panel-snow-20.svg';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentLoginRightPanel');

/*
 * ParentLoginRightPanel — shared gold (#967014) decorative right panel for
 * all parent onboarding screens.
 *
 * Background layers 1–6 are always identical across every parent screen.
 * Foreground photo cards and overlay cards are supplied by the caller via
 * props — defined in screen-specific content files:
 *   ParentLoginPanelContent.jsx   → LOGIN_PHOTO_CARDS, LoginOverlayCards
 *   ParentWelcomePanelContent.jsx → WELCOME_PHOTO_CARDS, WelcomeOverlayCards
 *
 * Props:
 *   variant           {'default'|'simple'} — 'simple' (Figma 2952:96846) drops
 *                       the photo cards / overlay / grid / snow / watch-tutorial
 *                       and renders `centerContent` centered over the gold bg.
 *                       Used by the success/done screen; reusable elsewhere.
 *   photoCards        {PhotoCardConfig[]} — spread onto <PhotoCard> per entry.
 *   overlayContent    {ReactNode}         — pre-positioned overlay cards.
 *   centerContent     {ReactNode}         — centered content for the simple variant.
 *   showWatchTutorial {boolean}           — renders WatchTutorial bottom-right.
 *
 * PhotoCardConfig shape:
 *   { photo, centerX, centerY, rotate, width, aspectRatio, borderColor,
 *     cornerEllipseSrc? }
 */

// ── sparkle star sub-component ─────────────────────────────────────────────
// 2884:64833 — same position as institution panel (left 78.2%, top 2.3%)
const SPARKLE_VECTORS = [
  { src: panelSparkle0, inset: '6.72% 59.73% 52.05% 10.01%' },
  { src: panelSparkle1, inset: '26.1% 24.63% 29% 50.94%' },
  { src: panelSparkle2, inset: '62% 55.16% 15.65% 28.8%' },
  { src: panelSparkle3, inset: '12.99% 10.36% 66.25% 77.15%' },
  { src: panelSparkle4, inset: '73.36% 14.31% 5.62% 72.77%' },
];

const PanelSparkle = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute overflow-hidden"
    style={{ left: '78.2%', top: '2.3%', width: 100, height: 102 }}
  >
    {SPARKLE_VECTORS.map(({ src, inset }, i) => (
      <div key={i} className="absolute" style={{ inset }}>
        <img
          src={src}
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          draggable={false}
        />
      </div>
    ))}
  </div>
);

// ── snow ring dots sub-component ──────────────────────────────────────────
// 2884:64834 — same position as institution panel (left -389px, top -31px)
const SNOW_VECTORS = [
  { src: panelSnow0, inset: '10.41% 29.45% 83.64% 65.21%' },
  { src: panelSnow1, inset: '24.04% 33.24% 70.89% 61.87%' },
  { src: panelSnow2, inset: '19.83% 22.12% 76.67% 74.53%' },
  { src: panelSnow3, inset: '6.37% 15.26% 89.83% 81.19%' },
  { src: panelSnow4, inset: '20.36% 7.48% 73.25% 86.77%' },
  { src: panelSnow5, inset: '33.44% 14.96% 62.56% 81.36%' },
  { src: panelSnow6, inset: '39.15% 24.7% 55.15% 69.39%' },
  { src: panelSnow7, inset: '45.37% 3.13% 50.27% 92.39%' },
  { src: panelSnow8, inset: '35.55% 2.95% 61.58% 94.3%' },
  { src: panelSnow9, inset: '47.85% 17.58% 48.86% 79.5%' },
  { src: panelSnow10, inset: '37.16% 35.77% 59.07% 60.95%' },
  { src: panelSnow11, inset: '10.83% 2.86% 85.76% 94.01%' },
  { src: panelSnow12, inset: '3.32% 36.9% 93.11% 60.24%' },
  { src: panelSnow13, inset: '4.94% 25.21% 93.16% 73.62%' },
  { src: panelSnow14, inset: '30.19% 26.15% 67.52% 72.39%' },
  { src: panelSnow15, inset: '14.54% 12.88% 83.74% 85.59%' },
  { src: panelSnow16, inset: '4.8% 5.12% 93.82% 93.2%' },
  { src: panelSnow17, inset: '31.78% 7.98% 66.13% 90.8%' },
  { src: panelSnow18, inset: '46.54% 12.27% 50.66% 86.28%' },
  { src: panelSnow19, inset: '47.98% 35.49% 49.83% 63.21%' },
  { src: panelSnow20, inset: '14.98% 39.58% 82.43% 59.14%' },
];

const PanelSnowDots = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute overflow-hidden"
    style={{ left: '-389px', top: '-31px', width: 447, height: 359 }}
  >
    {SNOW_VECTORS.map(({ src, inset }, i) => (
      <div key={i} className="absolute" style={{ inset }}>
        <img
          src={src}
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          draggable={false}
        />
      </div>
    ))}
  </div>
);

// ── photo card ────────────────────────────────────────────────────────────
/*
 * PhotoCard — portrait card positioned by its center point.
 * centerX/centerY are percentages of the panel; rotate is a full CSS
 * transform string (e.g. "rotate(7deg)") combined with translate(-50%,-50%).
 * cornerEllipseSrc — optional SVG that bleeds off the top-left corner.
 * Outer wrapper has NO overflow-hidden so the corner asset bleeds past the
 * card edge. Inner wrapper clips the photo.
 */
const PhotoCard = ({
  centerX,
  centerY,
  rotate,
  width,
  aspectRatio,
  borderColor,
  photo,
  cornerEllipseSrc,
}) => (
  <div
    aria-hidden="true"
    className="absolute"
    style={{
      left: centerX,
      top: centerY,
      transform: `translate(-50%, -50%) ${rotate}`,
      width,
      aspectRatio,
    }}
  >
    {cornerEllipseSrc && (
      /*
       * Corner ellipse bleed — Figma 2894:72735.
       * Card at full size (574×677): left=-86.4px (-15%), top=-103.42px (-15.3%),
       * size=223px (38.85% of card width), rotate-4deg.
       * clamp() keeps the visual proportional at all card sizes.
       */
      <img
        src={cornerEllipseSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute block max-w-none z-10"
        style={{
          top: 'clamp(-104px, -15.3%, -52px)',
          left: 'clamp(-86px, -15%, -43px)',
          width: 'clamp(109px, 38.85%, 223px)',
          aspectRatio: '1',
          transform: 'rotate(-4deg)',
        }}
        draggable={false}
      />
    )}

    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        border: `clamp(5px, 0.9vw, 10px) solid ${borderColor}`,
        borderRadius: 'clamp(20px, 3.2vw, 40px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}
    >
      <img
        src={photo}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
    </div>
  </div>
);

// ── main component ────────────────────────────────────────────────────────

const ParentLoginRightPanel = ({
  variant = 'default',
  photoCards = [],
  overlayContent = null,
  centerContent = null,
  showWatchTutorial = true,
}) => {
  const isSimple = variant === 'simple';
  log('mount', { variant, photoCardsCount: photoCards.length });

  return (
    <aside
      aria-hidden={isSimple ? undefined : 'true'}
      className="relative hidden shrink-0 self-stretch overflow-hidden lg:block"
      style={{
        width: 'clamp(360px, 42vw, 739px)',
        backgroundColor: '#967014',
      }}
    >
      {/* ── Layer 1: Cream ellipse top-right (2884:64827) — default only ── */}
      {!isSimple && (
        <div
          className="pointer-events-none bg-[#F9EBEA]/15 blur-sm absolute rounded-full overflow-hidden"
          style={{
            left: '83.5%',
            top: '-21.6%',
            width: 'clamp(200px, 64%, 473px)',
            height: 'clamp(200px, 64%, 473px)',
          }}
        />
      )}

      {/* ── Layer 2: Pink ellipse bottom-left (2884:64828) — default only ── */}
      {!isSimple && (
        <div
          className="pointer-events-none bg-[#F9EBEA]/15 blur-sm rounded-full absolute overflow-hidden"
          style={{
            left: '-23.1%',
            bottom: '-22.9%',
            width: 'clamp(200px, 64%, 473px)',
            height: 'clamp(200px, 64%, 473px)',
          }}
        />
      )}

      {/* ── Layer 3: BG grid rectangle (2884:64829) — default only ── */}
      {!isSimple && (
        <div
          className="pointer-events-none absolute overflow-hidden"
          style={{ left: '44.2%', top: '51.8%', width: '56%', height: '48.6%' }}
        >
          <img
            src={bgGrid}
            alt=""
            aria-hidden="true"
            className="absolute block max-w-none"
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'rotate(3.1deg)',
            }}
            draggable={false}
          />
        </div>
      )}

      {/* ── Layer 4: Sparkle stars (2884:64833) — default only ── */}
      {!isSimple && <PanelSparkle />}

      {/* ── Layer 5: Snow ring dots (2884:64834) — default only ── */}
      {!isSimple && <PanelSnowDots />}

      {/* ── Layer 6: BG lines overlay (2884:67315) — 10% opacity, default only ── */}
      {!isSimple && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ opacity: 0.1 }}
        >
          <img
            src={bgLines}
            alt=""
            aria-hidden="true"
            className="absolute block max-w-none"
            style={{
              inset: '0.05% -43.79% -9.64% 0.03%',
              width: 'calc(100% + 43.82%)',
              height: 'calc(100% + 9.69%)',
            }}
            draggable={false}
          />
        </div>
      )}

      {/* ── Layer 7: Photo cards from caller — default only ── */}
      {!isSimple && photoCards.map((card, i) => <PhotoCard key={i} {...card} />)}

      {/* ── Layer 8: BL abstract element (2884:67308) — default only ── */}
      {!isSimple && (
        <img
          src={blElement}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute block max-w-none"
          style={{ left: '-8.5%', top: '85.1%', width: 201, height: 144 }}
          draggable={false}
        />
      )}

      {/* ── Layer 9: Overlay content (text/info cards) from caller — default only ── */}
      {!isSimple && overlayContent}

      {/* ── Layer 10: WatchTutorial (2884:64892) — default only, bottom-right ── */}
      {!isSimple && showWatchTutorial && (
        <div className="absolute bottom-8 right-8 z-10">
          <WatchTutorial
            label="Watch Tutorial"
            showLabel
            onClick={() => log('watch tutorial clicked')}
            aria-label="Watch parent onboarding tutorial"
          />
        </div>
      )}

      {/* ── Simple variant: plain gold bg + centered content (2952:96846) ── */}
      {isSimple && (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-10">
          {centerContent}
        </div>
      )}
    </aside>
  );
};

export default ParentLoginRightPanel;
