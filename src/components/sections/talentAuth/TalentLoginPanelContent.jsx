import { debug } from '../../../utils/debug.js';
import photo1 from '../../../assets/hero/talent-panel-photo-1.webp';
import photo2 from '../../../assets/hero/talent-panel-photo-2.webp';
import photo3 from '../../../assets/hero/talent-panel-photo-3.webp';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import ellipseCard23 from '../../../assets/hero/talent-panel-card-ellipse-23.svg';
import gthIcon from '../../../assets/entry/panel-shield-check.svg'; // Figma 8027:214229
import sparkle26 from '../../../assets/hero/talent-panel-sparkle-26.svg';

const log = debug('TalentLoginPanelContent');

/*
 * TalentLoginPanelContent - right-panel composition for the talent Login screen.
 * Figma: 8027:214133 (default) / 214479 / 214691 / 214903 -> panel 'Frame 150'
 * 8027:214198, 739 x 973. Rebuilt for the shared OnboardingPanel contract
 * (see TalentOnboardingPanel): nothing is sized in vw or viewport px.
 *
 *  - Photo cards = LOGIN_PHOTO_CARDS (centre point + width as % of the PANEL,
 *    aspect-ratio 1). Centres/sizes derived from the rotated bounding boxes in
 *    Figma (side = bbox / (cos t + sin t)):
 *      8027:214202  top-right  rot +5   side 288 -> 39.0%  centre (72.2%, 47.1%) border #eedeb8
 *      8027:214208  top-left   rot +7   side 331 -> 44.8%  centre (30.3%, 25.1%) border #ebc2bd
 *      8027:214211  bottom-left rot -13 side 332 -> 44.9%  centre (27.3%, 71.4%) border #c1d4c4
 *  - LoginOverlayCards = chips + stats card, positioned in % of the panel on both
 *    axes. All inner text uses container-query units (cqw) of the overlay
 *    container (= panel width), so type scales with the panel, never the viewport.
 *  - 'Verified profile' chip (8027:214221) is visible=false in Figma: not rendered.
 */

// Overlay container: 1cqw = 1% of the panel width. px/739*100 = cqw.
const cq = (px) => `${((px / 739) * 100).toFixed(3)}cqw`;
const fs = (px, floor = 6) => `max(${floor}px, ${cq(px)})`;

// eslint-disable-next-line react-refresh/only-export-components
export const LOGIN_PHOTO_CARDS = [
  {
    photo: photo1,
    centerX: '72.2%',
    centerY: '47.1%',
    rotate: 'rotate(5deg)',
    width: '39%',
    aspectRatio: '1',
    borderColor: '#eedeb8',
    cornerEllipseSrc: ellipseCard1,
  },
  {
    photo: photo2,
    centerX: '30.3%',
    centerY: '25.1%',
    rotate: 'rotate(7deg)',
    width: '44.8%',
    aspectRatio: '1',
    borderColor: '#ebc2bd',
    cornerEllipseSrc: ellipseCard23,
  },
  {
    photo: photo3,
    centerX: '27.3%',
    centerY: '71.4%',
    rotate: 'rotate(-13deg)',
    width: '44.9%',
    aspectRatio: '1',
    borderColor: '#c1d4c4',
    cornerEllipseSrc: ellipseCard23,
  },
];

export const LoginOverlayCards = () => {
  log('render overlays');
  return (
    // aria-hidden + container so cqw = panel width.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ containerType: 'inline-size' }}
    >
      {/* sparkle-26 (8027:214233): 104px, rot 32, at (36.1%, 45.2%) */}
      <img
        src={sparkle26}
        alt=""
        draggable={false}
        className="absolute block max-w-none"
        style={{
          left: '36.1%',
          top: '45.2%',
          width: '14%',
          aspectRatio: '1',
          transform: 'rotate(32deg)',
        }}
      />

      {/* Data Protected chip (8027:214214): 268x68 at (3.4%, 36.6%) */}
      <div
        className="absolute flex items-center border border-[#fffefc] bg-[#ebf1ec] drop-shadow-[0px_2px_1px_rgba(27,36,44,0.04)] drop-shadow-[0px_16px_12px_rgba(27,36,44,0.16)]"
        style={{
          left: '3.4%',
          top: '36.6%',
          width: '36.3%',
          borderRadius: cq(13),
          gap: cq(9),
          padding: `${cq(14)} ${cq(16)}`,
        }}
      >
        <div
          className="shrink-0 bg-[#387440]"
          style={{ width: cq(36), height: cq(36), borderRadius: cq(9) }}
        />
        <div className="flex min-w-0 flex-col text-[#595959]" style={{ gap: cq(2) }}>
          <p className="font-bold leading-none" style={{ fontSize: fs(12) }}>
            Data Protected
          </p>
          <p className="leading-tight" style={{ fontSize: fs(10) }}>
            Encrypted · Never shared without consent
          </p>
        </div>
      </div>

      {/* GDPA badge (8027:214227): 288x40 at (54.8%, 22.9%) */}
      <div
        className="absolute flex items-center border border-[rgba(28,42,33,0.06)] bg-white drop-shadow-[0px_8px_16px_rgba(0,0,0,0.1)]"
        style={{
          left: '54.8%',
          top: '22.9%',
          width: '39%',
          borderRadius: cq(10),
          gap: cq(8),
          padding: `${cq(8)} ${cq(10)}`,
        }}
      >
        <img
          src={gthIcon}
          alt=""
          draggable={false}
          className="shrink-0"
          style={{ width: cq(14), height: cq(14) }}
        />
        <p
          className="truncate font-semibold tracking-[0.1px] text-[#387440]"
          style={{ fontSize: fs(14) }}
        >
          Ghana Data Protection Act compliant
        </p>
      </div>

      {/* Welcome back card (8027:214234): inner 248x223 (bbox 270x248 at rot 6),
          centre (74.6%, 83.1%). Internal positions as % of the 248x223 card. */}
      <div
        className="absolute"
        style={{
          left: '74.6%',
          top: '83.1%',
          width: '33.6%',
          aspectRatio: '248 / 223',
          transform: 'translate(-50%, -50%) rotate(6deg)',
        }}
      >
        <div style={{ width: '100%', height: '100%' }}>
          <div
            className="relative overflow-hidden bg-white"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: cq(24),
              boxShadow:
                '0px 2px 2px -1px rgba(27,35,44,0.04), 0px 8px 16px -2px rgba(27,36,44,0.12)',
            }}
          >
            {/* Top gradient bar — h = 4/223 = 1.79% */}
            <div
              className="absolute left-0 right-0 top-0 bg-gradient-to-r from-[#387440] to-[#c1d4c4]"
              style={{ height: '1.79%' }}
            />

            {/* Score + name row — h=24.22% top=9.87% left=right=6.45% */}
            <div
              className="absolute"
              style={{ left: '6.45%', right: '6.45%', top: '9.87%', height: '24.22%' }}
            >
              {/* Score circle */}
              <div
                className="absolute left-0 top-0 bg-[#f8f8f4] border-2 border-[#c1d4c4] rounded-full"
                style={{ height: '100%', aspectRatio: '1' }}
              >
                <p
                  className="absolute font-heading font-semibold text-[#387440] tracking-[-0.02em]"
                  style={{
                    fontSize: 'max(8px, 2.71cqw)',
                    lineHeight: 1,
                    top: 'calc(50% - 8.33%)',
                    left: 'calc(50% - 11.67%)',
                  }}
                >
                  74
                </p>
                <p
                  className="absolute font-bold text-[#babab7] tracking-[0.5px] uppercase"
                  style={{
                    fontSize: 'max(4px, 0.95cqw)',
                    lineHeight: 1,
                    top: 'calc(50% + 18.52%)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Score
                </p>
              </div>

              {/* Welcome back + name */}
              <div
                className="absolute flex flex-col"
                style={{ left: '30.56%', top: '1.85%', right: 0, gap: '6%' }}
              >
                <p
                  className="font-medium text-[#babab7]"
                  style={{ fontSize: 'max(5px, 1.36cqw)', lineHeight: 1 }}
                >
                  Welcome back,
                </p>
                <p
                  className="font-bold text-[#111] truncate"
                  style={{ fontSize: 'max(6px, 1.90cqw)', lineHeight: 1 }}
                >
                  Abena Mensah
                </p>
              </div>

              {/* Silver Tier badge */}
              <div
                className="absolute bg-[#f8f8f4] border border-[#c6c6c3] flex items-center"
                style={{
                  left: '30.56%',
                  right: '34.96%',
                  top: 'calc(50% + 32.41%)',
                  height: '31.48%',
                  borderRadius: 'max(2px, 0.55cqw)',
                  transform: 'translateY(-50%)',
                  paddingLeft: '8%',
                }}
              >
                <p
                  className="font-bold text-[#575755] tracking-[0.4px] uppercase"
                  style={{
                    fontSize: 'max(4px, 1.07cqw)',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Silver Tier
                </p>
              </div>
            </div>

            {/* Talent Score bar — top=90/223=40.36% h=20/223=8.97% */}
            <div
              className="absolute"
              style={{ left: '6.45%', right: '6.45%', top: '40.36%', height: '8.97%' }}
            >
              <p
                className="absolute font-bold text-[#babab7] uppercase tracking-[0.6px]"
                style={{
                  fontSize: 'max(4px, 1.21cqw)',
                  lineHeight: 1,
                  top: '27.5%',
                  left: 0,
                  transform: 'translateY(-50%)',
                }}
              >
                Talent Score
              </p>
              <p
                className="absolute font-bold text-[#387440]"
                style={{
                  fontSize: 'max(4px, 1.21cqw)',
                  lineHeight: 1,
                  top: '27.5%',
                  left: '92.27%',
                  transform: 'translateY(-50%)',
                }}
              >
                74%
              </p>
              <div
                className="absolute left-0 right-0 bg-[#f8f8f4] overflow-hidden"
                style={{ top: '75%', height: '25%', borderRadius: 'max(1px, 0.40cqw)' }}
              >
                <div
                  className="absolute bg-gradient-to-r from-[#387440] to-[#5caf6a] inset-[0_26%_0_0]"
                  style={{ borderRadius: 'max(1px, 0.40cqw)' }}
                />
              </div>
            </div>

            {/* Skills / Badges / Match stats — top=122/223=54.71% h=39/223=17.49% */}
            <div
              className="absolute"
              style={{ left: '6.45%', right: '6.45%', top: '54.71%', height: '17.49%' }}
            >
              {[
                { label: 'Skills', value: '12', left: 0, right: '68.52%' },
                { label: 'Badges', value: '3', left: '34.26%', right: '34.26%' },
                { label: 'Match', value: '94%', left: '68.52%', right: 0 },
              ].map(({ label, value, left, right }) => (
                <div
                  key={label}
                  className="absolute inset-y-0 bg-[#f8f8f4] flex flex-col items-center justify-center"
                  style={{ left, right, gap: '8%', borderRadius: 'max(3px, 0.81cqw)' }}
                >
                  <p
                    className="font-heading font-semibold text-[#1c2a21] tracking-[-0.035em]"
                    style={{ fontSize: 'max(6px, 2.02cqw)', lineHeight: 1 }}
                  >
                    {value}
                  </p>
                  <p
                    className="font-bold text-[#babab7] tracking-[0.5px] uppercase"
                    style={{ fontSize: 'max(3px, 1.10cqw)', lineHeight: 1 }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Opportunities bar — top=173/223=77.58% h=34/223=15.25% */}
            <div
              className="absolute bg-[#ebf1ec] border border-[#c1d4c4] flex items-center"
              style={{
                left: '6.45%',
                right: '6.45%',
                top: '77.58%',
                height: '15.25%',
                borderRadius: 'max(4px, 1.36cqw)',
                paddingLeft: '5.09%',
                gap: '3%',
              }}
            >
              <div
                className="bg-[#387440] shrink-0 rounded-[3px]"
                style={{
                  width: 'max(3px, 0.81cqw)',
                  height: 'max(3px, 0.81cqw)',
                }}
              />
              <p style={{ fontSize: 'max(5px, 1.38cqw)', lineHeight: 1 }}>
                <span className="font-bold text-[#387440]">47</span>
                <span className="font-semibold text-[#2a5730]"> new opportunities matched</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export kept so the page can import the content as a unit.
export default function TalentLoginPanelContent() {
  return <LoginOverlayCards />;
}
