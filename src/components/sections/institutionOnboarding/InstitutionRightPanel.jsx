import WatchTutorial from '../../ui/WatchTutorial.jsx';
import studentsGroupPhoto from '../../../assets/hero/Students using GTH on phone.png';
import institutionSoloStudent from '../../../assets/hero/institution-solo-student.png';
import bgLines from '../../../assets/hero/institution-panel-bg-lines.svg';
import bgGrid from '../../../assets/hero/institution-panel-bg-grid.png';
import ellipseTr from '../../../assets/hero/institution-panel-ellipse-tr.svg';
import ellipseBl from '../../../assets/hero/institution-panel-ellipse-bl.svg';
// 2971:68523 — sparkle stars on green BG (100×102px, 5 vectors)
import panelSparkle0 from '../../../assets/hero/panel-sparkle-0.svg';
import panelSparkle1 from '../../../assets/hero/panel-sparkle-1.svg';
import panelSparkle2 from '../../../assets/hero/panel-sparkle-2.svg';
import panelSparkle3 from '../../../assets/hero/panel-sparkle-3.svg';
import panelSparkle4 from '../../../assets/hero/panel-sparkle-4.svg';
// 2971:68524 — snow/ring dots on green BG (447×359px, 21 vectors)
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

const log = debug('InstitutionRightPanel');

/*
 * InstitutionRightPanel — shared decorative right column for all institution
 * onboarding screens (Guidelines, YourInstitution, and future steps).
 *
 * Figma parent frame: 2971:65353. Right panel node: 2971:68519.
 *
 * Right panel BG layer order (back → front, matching Figma z-order):
 *   1. Ellipse blob TR  (2971:68520)
 *   2. Ellipse blob BL  (2971:68521)
 *   3. Inverted grid    (2971:68522)
 *   4. Sparkle stars    (2971:68523) — 5-vector composite, 100×102px
 *   5. Snow ring dots   (2971:68524) — 21-vector composite, 447×359px
 *   6. BG lines frame   (2971:68526) — opacity-30
 *   7. Photo cards      (2971:68889)
 *   8. WatchTutorial    (2972:70224) — bottom-right; shown on form steps only
 *
 * Card corner ellipses (2971:68895 medium / 2971:68898 small):
 *   Figma exports these as fill="none" (effect-only fill). Recreated in CSS
 *   as a white semi-transparent circle (rgba 255,255,255,0.3) positioned at
 *   left:-86.4px top:-103.42px on the OUTER wrapper (no overflow-hidden there)
 *   so it bleeds visibly past the card border.
 */

// ── sparkle sub-component ─────────────────────────────────────────────────

/*
 * PanelSparkle — node 2971:68523.
 * 5 SVG vectors composited inside a 100×102px container.
 * Positioned at left 78.2% (578/739px), top 2.3% (22/973px).
 */
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

// ── snow dots sub-component ───────────────────────────────────────────────

/*
 * PanelSnowDots — node 2971:68524.
 * 21 SVG ring dots composited inside a 447×359px container.
 * Positioned at left -389px, top -31px — mostly off the left edge;
 * only the rightmost ~58px slice is visible inside the panel.
 */
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
 * PhotoCard — bordered, rotated card positioned by its centre point.
 *
 * IMPORTANT: outer wrapper has NO overflow-hidden so the corner ellipse
 * (which sits at negative coordinates relative to the card) bleeds visibly
 * past the card edge. The inner wrapper carries overflow-hidden to clip the
 * photo to the rounded border.
 *
 * Corner ellipse glow (2971:68895 medium / 2971:68898 small):
 *   Figma exports fill="none" (effect-only). Recreated with CSS:
 *   white rgba(255,255,255,0.3) circle at left:-86.4px top:-103.42px,
 *   sized 223px, rotated -4deg. Position is card-relative accounting for
 *   the inner wrapper offset of left:-10.56px top:-17.98px.
 */
const PhotoCard = ({
  centerX,
  centerY,
  rotate,
  width,
  borderColor,
  photo,
  alt = '',
  showEllipse = false,
}) => (
  <div
    aria-hidden="true"
    className="absolute"
    style={{
      left: centerX,
      top: centerY,
      transform: `translate(-50%, -50%) ${rotate}`,
      width,
      aspectRatio: '1 / 1',
    }}
  >
    {/* Inner card — overflow-hidden clips photo to the rounded border */}
    <div
      className="absolute inset-0 overflow-hidden shadow-bottom-400"
      style={{
        border: `clamp(5px, 0.9vw, 10px) solid ${borderColor}`,
        borderRadius: 'clamp(20px, 3.2vw, 40px)',
      }}
    >
      <img
        src={photo}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
    </div>

    {/* Corner ellipse glow — lives on outer wrapper, bleeds past card edge.
        CSS rgba approach: Figma SVG exports fill="none" (transparent).
        Coordinates: left -86.4px = (-75.84 ellipse offset) - (10.56 inner inset)
                     top -103.42px = (-85.44 ellipse offset) - (17.98 inner inset) */}
    {showEllipse && (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          left: '-86.4px' /* px — Figma 2971:68895/68898 */,
          top: '-103.42px' /* px — Figma 2971:68895/68898 */,
          width: '223px' /* px — Figma SVG viewBox 223×223 */,
          height: '223px',
          transform: 'rotate(-4deg)',
          background: 'rgba(255, 255, 255, 0.3)',
        }}
      />
    )}
  </div>
);

// ── main component ────────────────────────────────────────────────────────

/*
 * Props:
 *   showWatchTutorial {boolean} — renders the WatchTutorial widget at the
 *     bottom-right of the panel. False on the Guidelines screen, true on
 *     all form steps (Figma node 2972:70224).
 */
const InstitutionRightPanel = ({ showWatchTutorial = false }) => {
  log('mount', { showWatchTutorial });

  return (
    <aside
      aria-hidden="true"
      className="relative hidden shrink-0 self-stretch overflow-hidden lg:block"
      style={{
        width: 'clamp(360px, 42vw, 739px)',
        backgroundColor: '#387440',
      }}
    >
      {/* ── Layer 1: Ellipse blob top-right (2971:68520) ── */}
      <div
        className="pointer-events-none absolute overflow-hidden"
        style={{
          left: '83.5%',
          top: '-21.6%',
          width: 'clamp(200px, 64%, 473px)',
          height: 'clamp(200px, 64%, 473px)',
        }}
      >
        <img
          src={ellipseTr}
          alt=""
          aria-hidden="true"
          className="absolute block max-w-none"
          style={{ inset: '-42.28%', width: 'calc(100% + 84.56%)', height: 'calc(100% + 84.56%)' }}
          draggable={false}
        />
      </div>

      {/* ── Layer 2: Ellipse blob bottom-left (2971:68521) ── */}
      <div
        className="pointer-events-none absolute overflow-hidden"
        style={{
          left: '-23.1%',
          bottom: '-22.9%',
          width: 'clamp(200px, 64%, 473px)',
          height: 'clamp(200px, 64%, 473px)',
        }}
      >
        <img
          src={ellipseBl}
          alt=""
          aria-hidden="true"
          className="absolute block max-w-none"
          style={{
            inset: '-63.42%',
            width: 'calc(100% + 126.84%)',
            height: 'calc(100% + 126.84%)',
          }}
          draggable={false}
        />
      </div>

      {/* ── Layer 3: Inverted grid bottom-right (2971:68522) ── */}
      <div
        className="pointer-events-none absolute overflow-hidden"
        style={{ right: '-2px', top: '58.8%', width: '48.4%', height: '41.6%' }}
      >
        <div style={{ transform: 'rotate(180deg) scaleY(-1)', width: '100%', height: '100%' }}>
          <img
            src={bgGrid}
            alt=""
            aria-hidden="true"
            className="absolute max-w-none"
            style={{ top: 0, left: '-90.11%', width: '280.22%', height: '124.47%' }}
            draggable={false}
          />
        </div>
      </div>

      {/* ── Layer 4: Sparkle stars (2971:68523) ── */}
      <PanelSparkle />

      {/* ── Layer 5: Snow ring dots (2971:68524) ── */}
      <PanelSnowDots />

      {/* ── Layer 6: BG lines frame (2971:68526) — opacity 30% ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
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

      {/* ── Layer 7: Photo cards (2971:68889) ── */}

      {/* LARGE card (2971:68890) — group students photo, no corner ellipse */}
      <PhotoCard
        centerX="48.7%"
        centerY="44.4%"
        rotate="rotate(4deg)"
        width="clamp(250px, 76.3%, 564px)"
        borderColor="#eedeb8"
        photo={studentsGroupPhoto}
        alt="Students using Ghana Talent Hub on a laptop"
      />

      {/* SMALL card (2971:68896) — ellipse 2971:68898 */}
      <PhotoCard
        centerX="77.6%"
        centerY="17.8%"
        rotate="rotate(-167deg) scaleY(-1)"
        width="clamp(100px, 26.5%, 196px)"
        borderColor="#c1d4c4"
        photo={institutionSoloStudent}
        showEllipse
      />

      {/* MEDIUM card (2971:68893) — ellipse 2971:68895 */}
      <PhotoCard
        centerX="22.6%"
        centerY="72%"
        rotate="rotate(-13deg)"
        width="clamp(140px, 34.5%, 255px)"
        borderColor="#c1d4c4"
        photo={institutionSoloStudent}
        showEllipse
      />

      {/* ── Layer 8: WatchTutorial (2972:70224) — form steps only ── */}
      {showWatchTutorial && (
        <div className="absolute bottom-8 right-8 z-10">
          <WatchTutorial
            label="Watch Tutorial"
            showLabel
            onClick={() => log('watch tutorial clicked')}
            aria-label="Watch onboarding tutorial"
          />
        </div>
      )}
    </aside>
  );
};

export default InstitutionRightPanel;
