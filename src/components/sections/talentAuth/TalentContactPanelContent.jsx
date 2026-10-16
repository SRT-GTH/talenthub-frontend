import { debug } from '../../../utils/debug.js';
import photo1 from '../../../assets/hero/talent-panel-fig-photo-gold.webp';
import photo2 from '../../../assets/hero/talent-panel-fig-photo-pink.webp';
import photo3 from '../../../assets/hero/talent-panel-fig-photo-green.webp';
import gthIcon from '../../../assets/talent-onboarding/panel-gdpa-icon.svg';
import sparkle26 from '../../../assets/talent-onboarding/panel-sparkle-26.svg';
import arrowDown from '../../../assets/talent-onboarding/panel-arrow-down.svg';
import arrowScribble from '../../../assets/talent-onboarding/panel-arrow-scribble.svg';
import tutorialCircle from '../../../assets/talent-onboarding/watch-tutorial-circle.png';

const log = debug('TalentContactPanelContent');

/*
 * TalentContactPanelContent - photo cards + overlay for the talent Contact,
 * Address and Education steps (they share one panel composition in Figma).
 *
 * Figma: contact 8027:206158 (Frame 141, 739x916; identical on address
 * 8027:209062.. and education 8027:209541..). Rebuilt in the parent-panel
 * contract (ParentLoginPanelContent): every position is a % of the panel,
 * card widths are a % of panel width + aspect-ratio. Because the real panel
 * height varies (short screens), card widths are additionally capped by a
 * height-derived value and overlay chips scale with the LIMITING panel
 * dimension through the `--s` unit (container query on the overlay wrapper),
 * so nothing overlaps or clips when the panel is short or narrow.
 *
 * Usage:
 *   <TalentOnboardingPanel
 *     photoCards={TALENT_CONTACT_PHOTO_CARDS}
 *     overlayContent={<TalentContactOverlay />}
 *     showWatchTutorial={false}
 *   />
 *
 * Geometry (panel-relative, 739x916): card centres are the rotated bbox
 * centres; widths are the unrotated side (bbox / (cos+sin)).
 *   gold  8027:206162  centre (71.6%, 47.07%) side 276.6 rot 5
 *   pink  8027:206168  centre (28.59%, 26.0%) side 283.1 rot -8.51
 *   green 8027:206171  centre (30.34%, 74.58%) side 331.6 rot -18
 * Height cap basis: viewport minus the 149px header + stepper.
 */

const heightCap = (frac) => `calc((100svh - 149px) * ${frac})`;

// eslint-disable-next-line react-refresh/only-export-components
export const TALENT_CONTACT_PHOTO_CARDS = [
  {
    photo: photo1,
    centerX: '71.6%',
    centerY: '47.07%',
    rotate: 'rotate(5deg)',
    width: `min(37.43%, ${heightCap(276.6 / 916)})`,
    aspectRatio: '1',
    borderColor: '#EEDEB8',
  },
  {
    photo: photo2,
    centerX: '28.59%',
    centerY: '26%',
    rotate: 'rotate(-8.51deg)',
    width: `min(38.31%, ${heightCap(283.1 / 916)})`,
    aspectRatio: '1',
    borderColor: '#EBC2BD',
  },
  {
    photo: photo3,
    centerX: '30.34%',
    centerY: '74.58%',
    rotate: 'rotate(-18deg)',
    width: `min(44.87%, ${heightCap(331.6 / 916)})`,
    aspectRatio: '1',
    borderColor: '#C1D4C4',
  },
];

// 1 Figma px at the limiting panel dimension.
const px = (n) => `calc(${n} * var(--s))`;

const Abs = ({ left, top, width, children, style }) => (
  <div aria-hidden="true" className="absolute" style={{ left, top, width, ...style }}>
    {children}
  </div>
);

export const TalentContactOverlay = () => {
  log('render overlay');
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      style={{
        containerType: 'size',
        '--s': 'min(100cqw / 739, 100cqh / 916)',
      }}
    >
      {/* Sparkle 26 - 8027:206193 export (rotation baked), bbox (324,-17) 98.5x97 */}
      <Abs left="43.84%" top="-1.86%" width="13.33%">
        <img src={sparkle26} alt="" className="block w-full" draggable={false} />
      </Abs>

      {/* Arrow down - 8027:206195 export (rotation + 50% opacity baked) */}
      <Abs left="10.24%" top="44.57%" width="16.2%">
        <img src={arrowDown} alt="" className="block w-full" draggable={false} />
      </Abs>

      {/* Amber OTP chip - 8027:206174, (25,334.9) 267.6x64 */}
      <Abs
        left="3.38%"
        top="36.56%"
        width="36.2%"
        style={{
          height: px(64),
          backgroundColor: '#C8951A',
          border: '1px solid #FAF4E8',
          borderRadius: px(13),
          boxShadow: '0px 2px 2px rgba(27,36,44,0.04), 0px 16px 24px rgba(27,36,44,0.16)',
          display: 'flex',
          alignItems: 'center',
          gap: px(9),
          paddingLeft: px(14.7),
        }}
      >
        <span
          className="shrink-0"
          style={{
            width: px(36),
            height: px(36),
            borderRadius: px(9),
            backgroundColor: '#EEDEB8',
          }}
        />
        <span className="flex min-w-0 flex-col" style={{ gap: px(2) }}>
          <span
            className="whitespace-nowrap font-sans font-bold"
            style={{ fontSize: px(12), lineHeight: px(14.3), color: '#FEFEFE' }}
          >
            OTP sent after this step
          </span>
          <span
            className="whitespace-nowrap font-medium"
            style={{
              fontSize: px(10),
              lineHeight: px(12.2),
              color: '#FEFEFE',
              opacity: 0.72,
              fontFamily: "'Instrument Sans', var(--font-sans)",
            }}
          >
            SMS + Email · expires in 10 min
          </span>
        </span>
      </Abs>

      {/* GDPA chip - 8027:206187, (404.9,208.9) 287.6x40 */}
      <Abs
        left="54.8%"
        top="22.8%"
        width="38.9%"
        style={{
          height: px(40),
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(28,42,33,0.06)',
          borderRadius: px(10),
          boxShadow: '0px 2px 0px rgba(0,0,0,0.05), 0px 8px 32px rgba(0,0,0,0.10)',
          display: 'flex',
          alignItems: 'center',
          gap: px(8),
          paddingInline: px(10),
        }}
      >
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: px(13.6), height: px(13.6) }}
        >
          <img
            src={gthIcon}
            alt=""
            style={{ width: px(13.6), height: px(13.6) }}
            draggable={false}
          />
        </span>
        <span
          className="whitespace-nowrap font-sans font-semibold text-[#387440]"
          style={{ fontSize: px(14), lineHeight: px(24), letterSpacing: '0.1px' }}
        >
          Ghana Data Protection Act compliant
        </span>
      </Abs>

      {/* Arrow scribble - 8027:206196, bbox (623,598) 58.5x58.5 */}
      <Abs left="84.3%" top="65.28%" width="7.92%" style={{ aspectRatio: '1' }}>
        <img src={arrowScribble} alt="" className="block size-full" draggable={false} />
      </Abs>

      {/* Phone card - 8027:206197, bbox (447.2,643) 231.5x56.2 rot 2 */}
      <Abs
        left="60.5%"
        top="70.2%"
        width="31.3%"
        style={{
          height: px(56),
          backgroundColor: '#FAF4E8',
          border: '1px solid #EEDEB8',
          borderRadius: px(10),
          boxShadow: '0px 8px 28px rgba(200,149,26,0.14), 0px 3px 0px #967014',
          transform: 'rotate(2deg)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: px(9.8),
          gap: px(15),
        }}
      >
        <span
          className="shrink-0"
          style={{
            width: px(28.5),
            height: px(28.5),
            borderRadius: px(5),
            backgroundColor: '#EEDEB8',
            transform: 'rotate(0.78deg)',
          }}
        />
        <span className="flex min-w-0 flex-col" style={{ gap: px(6) }}>
          <span
            className="font-bold"
            style={{
              fontSize: px(12),
              lineHeight: px(14.6),
              color: '#1C2A21',
              fontFamily: "'Instrument Sans', var(--font-sans)",
            }}
          >
            Phone
          </span>
          <span
            className="whitespace-nowrap font-sans"
            style={{ fontSize: px(11), lineHeight: px(15.4), color: '#70706E' }}
          >
            +233 24 123 4567
          </span>
        </span>
      </Abs>

      {/* Watch tutorial - 8027:206194 circle (Figma PNG export; label hidden in the
          default frame); right edge 682 (7.7%), bottom edge 878 of 916 (4.1%). */}
      <div className="pointer-events-auto absolute" style={{ right: '7.7%', bottom: '4.1%' }}>
        <button
          type="button"
          onClick={() => log('watch tutorial clicked')}
          aria-label="Watch talent onboarding tutorial"
          className="block cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <img
            src={tutorialCircle}
            alt=""
            width="72"
            height="72"
            className="block size-[72px]"
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
};

export default TalentContactOverlay;
