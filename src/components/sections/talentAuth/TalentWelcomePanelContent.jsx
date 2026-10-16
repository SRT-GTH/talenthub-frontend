import studentPhoto from '../../../assets/hero/talent-welcome-panel-main.webp';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import verifiedCheck from '../../../assets/talent-onboarding/panel-verified-check.svg';
import savedHeart from '../../../assets/talent-onboarding/panel-saved-heart.svg';
import pencil from '../../../assets/talent-onboarding/panel-pencil.svg';
import modalClose from '../../../assets/talent-onboarding/modal-close.svg';
import bgGrid from '../../../assets/hero/talent-panel-bg-grid.png';
import avatar1 from '../../../assets/hero/talent-panel-institution-avatar-1.jpg';
import avatar2 from '../../../assets/hero/talent-panel-institution-avatar-2.jpg';
import avatar3 from '../../../assets/hero/talent-panel-institution-avatar-3.jpg';
import { PanelStage, StageCard, cq, fs, cardShadow } from './TalentPanelParts.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('TalentWelcomePanelContent');

/*
 * TalentWelcomePanelContent - right-panel art for the talent Welcome step
 * ("Welcome. Here's what happens next.").
 *
 * Figma: panel 'Frame 141' 8027:202190 (739 x 976, fill #fffefc, stroke
 * #e7e7e7) in 8027:202121 (toast frame) / 202348 / 202575 (identical art).
 * Rendered through the shared panel's `simple` variant (plain #fffefc fill) so
 * the ellipse glows, grid and cards below are exact Figma values; everything is
 * % of an aspect-locked stage + container units (see TalentPanelParts), so it
 * stays composed on short and narrow screens.
 *
 * Geometry (centre of rotated bbox, % of 739 x 976; true size solved from the
 * bbox: w = (W cos t - H sin t)/cos 2t):
 *   8027:202195 main photo  rot +4    533.1 x 599.1 -> 72.14%  ctr (46.84, 50.04)  stroke 10 #eedeb8, r26
 *   8027:202198 jobs card   rot +4.71 126.4 x 87.1  -> 17.1%   ctr (13.26, 33.14)
 *   8027:202201 Saved pill            94.8 x 41.5            left 6.50 top 51.07
 *   8027:202206 Verified profile      132.6 x 40             left 3.27 top 66.66
 *   8027:202212 My Experience rot +6.59 171.5 x 129.9 -> 23.2% ctr (80.35, 26.44)
 *   8027:202221 institution card      222.4 x 136.4          left 62.11 top 61.89
 *   8027:202239 toast (visible=false in Figma; the frame name says 3 seconds)
 *     309 x 66.4 at (374, 24.3)
 * Glows: Ellipse 3 8027:202191 (gradient #e8a832 -> #c8951a, a .5, blur 200) and
 * Ellipse 4 8027:202192 (#c0392b a .5 blur 300); Figma blur R = CSS blur R/2.
 * Deviations (Figma text-box bugs): '1,580' stays on one line and the
 * institution title wraps to two lines without overlapping its subtitle.
 */

export const WELCOME_REF_H = 976;

// eslint-disable-next-line react-refresh/only-export-components
export const WELCOME_PHOTO_CARDS = [
  {
    photo: studentPhoto,
    cx: 46.84,
    cy: 50.04,
    size: 72.14,
    aspect: '533.1 / 599.1',
    rotate: 4,
    borderColor: '#eedeb8',
    radius: 26,
    ellipse: ellipseCard1,
  },
];

const FLOAT_SHADOW = () => `0 ${cq(8)} ${cq(32)} rgba(0,0,0,0.1), 0 ${cq(2)} 0 rgba(0,0,0,0.05)`;

const Glows = () => (
  <>
    {/* Ellipse 3 - top-right amber */}
    <div
      className="pointer-events-none absolute rounded-full"
      style={{
        left: '83.63%',
        top: '-21.41%',
        width: '64%',
        aspectRatio: '1',
        opacity: 0.5,
        background: 'linear-gradient(180deg, #e8a832 0%, #c8951a 100%)',
        filter: `blur(${cq(100)})`,
      }}
    />
    {/* Ellipse 4 - bottom-left coral */}
    <div
      className="pointer-events-none absolute rounded-full"
      style={{
        left: '-23%',
        top: '75.92%',
        width: '64%',
        aspectRatio: '1',
        opacity: 0.5,
        backgroundColor: '#c0392b',
        filter: `blur(${cq(150)})`,
      }}
    />
    {/* grid 8027:202193 - bottom-right texture (same crop as the talent panel shell) */}
    <div
      className="pointer-events-none absolute"
      style={{ right: 0, top: '58.71%', height: '41.5%', width: '48.4%' }}
    >
      <div className="relative size-full -scale-y-100 rotate-180">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={bgGrid}
            alt=""
            draggable={false}
            className="absolute top-0 max-w-none"
            style={{ height: '124.47%', left: '-90.11%', width: '280.22%' }}
          />
        </div>
      </div>
    </div>
  </>
);

const JobsCard = () => (
  <div
    className="absolute flex flex-col border border-[#fefcf5] bg-white"
    style={{
      left: '13.26%',
      top: '33.14%',
      width: cq(126.4),
      minHeight: cq(87.1),
      borderRadius: cq(18),
      padding: `${cq(14)} ${cq(24)}`,
      transform: 'translate(-50%, -50%) rotate(4.71deg)',
      boxShadow: FLOAT_SHADOW(),
    }}
  >
    <p
      className="font-heading whitespace-nowrap font-semibold text-[#1c2a21]"
      style={{ fontSize: fs(32, 12), lineHeight: 1.2, letterSpacing: '-0.02em' }}
    >
      1,580
    </p>
    <p
      className="whitespace-nowrap font-medium text-[#70706e]"
      style={{ fontSize: fs(12, 6), lineHeight: 1.67, letterSpacing: '0.2px' }}
    >
      Jobs Available
    </p>
  </div>
);

const SavedPill = () => (
  <div
    className="absolute flex items-center border border-[#2a5730] bg-[#387440]"
    style={{
      left: '6.5%',
      top: '51.07%',
      gap: cq(7),
      padding: `${cq(6.75)} ${cq(14)}`,
      borderRadius: cq(10),
      boxShadow: `0 ${cq(4)} 0 #2a5730, 0 ${cq(8)} ${cq(28)} rgba(56,116,64,0.25)`,
    }}
  >
    <img
      src={savedHeart}
      alt=""
      draggable={false}
      className="shrink-0"
      style={{ width: cq(14), height: cq(14) }}
    />
    <span
      className="font-medium text-white"
      style={{ fontSize: fs(16, 7), lineHeight: cq(28), letterSpacing: '0.2px' }}
    >
      Saved
    </span>
  </div>
);

const VerifiedPill = () => (
  <div
    className="absolute flex items-center border border-[rgba(28,42,33,0.06)] bg-white"
    style={{
      left: '3.27%',
      top: '66.66%',
      gap: cq(8),
      padding: `${cq(8)} ${cq(10)}`,
      borderRadius: cq(10),
      boxShadow: FLOAT_SHADOW(),
    }}
  >
    <img
      src={verifiedCheck}
      alt=""
      draggable={false}
      className="shrink-0"
      style={{ width: cq(13.6), height: cq(13.6), transform: 'rotate(8deg)' }}
    />
    <span
      className="whitespace-nowrap font-semibold text-[#387440]"
      style={{ fontSize: fs(14), lineHeight: cq(24), letterSpacing: '0.1px' }}
    >
      Verified profile
    </span>
  </div>
);

const ExperienceCard = () => (
  <div
    className="absolute border border-[rgba(28,42,33,0.06)] bg-white"
    style={{
      left: '80.35%',
      top: '26.44%',
      width: cq(171.5),
      height: cq(129.9),
      borderRadius: cq(18),
      transform: 'translate(-50%, -50%) rotate(6.59deg)',
      boxShadow: FLOAT_SHADOW(),
    }}
  >
    <p
      className="absolute font-bold text-[#1c2a21]"
      style={{ left: cq(16), top: cq(12), fontSize: fs(14), lineHeight: cq(16.7) }}
    >
      My Experience
    </p>
    <img
      src={pencil}
      alt=""
      draggable={false}
      className="absolute"
      style={{ right: cq(14), top: cq(11), width: cq(15.7), height: cq(15.5) }}
    />
    {[
      { w: 132, top: 40, bg: '#f8f8f4' },
      { w: 111.7, top: 52.9, bg: '#f8f8f4' },
      { w: 79, top: 65.8, bg: '#ebf1ec' },
    ].map((bar) => (
      <span
        key={bar.top}
        className="absolute block rounded-full"
        style={{
          left: cq(16),
          top: cq(bar.top),
          width: cq(bar.w),
          height: cq(6),
          backgroundColor: bar.bg,
        }}
      />
    ))}
    <span
      className="absolute flex items-center justify-center border-2 border-[#2a5730] bg-[#387440] font-bold text-white"
      style={{
        left: cq(18.2),
        top: cq(80),
        width: cq(135),
        height: cq(44.9),
        borderRadius: cq(10),
        fontSize: fs(12, 6),
        letterSpacing: '0.1px',
        boxShadow: `0 ${cq(4)} 0 #2a5730`,
      }}
    >
      Submit
    </span>
  </div>
);

const InstitutionCard = () => (
  <div
    className="absolute flex flex-col border border-[rgba(28,42,33,0.1)] bg-[#387440]"
    style={{
      left: '62.11%',
      top: '61.89%',
      width: cq(222.4),
      minHeight: cq(136.4),
      borderRadius: cq(20),
      padding: cq(18),
      boxShadow: `0 ${cq(8)} ${cq(16)} ${cq(-2)} rgba(27,36,44,0.12), 0 ${cq(2)} ${cq(2)} ${cq(-1)} rgba(27,35,44,0.04)`,
    }}
  >
    <span
      className="inline-flex items-center self-start rounded-full bg-white/40 font-bold text-white"
      style={{ height: cq(17), padding: `0 ${cq(9)}`, fontSize: fs(9, 5), letterSpacing: '0.1px' }}
    >
      ✓ Verified Institution
    </span>
    <p
      className="font-heading font-semibold text-white"
      style={{
        marginTop: cq(5),
        fontSize: fs(20, 8),
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      }}
    >
      Accra Girls Senior High
    </p>
    <p className="text-white/60" style={{ marginTop: cq(3), fontSize: fs(10, 5), lineHeight: 1.2 }}>
      Greater Accra · GES-Accredited
    </p>
    <div className="flex" style={{ marginTop: cq(10) }}>
      {[avatar1, avatar2, avatar3].map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className="block shrink-0 rounded-full border-2 border-white/30 object-cover"
          style={{ width: cq(28), height: cq(28), marginLeft: i === 0 ? 0 : cq(-6) }}
        />
      ))}
    </div>
  </div>
);

export const WelcomeToast = ({ onClose }) => (
  <div
    role="status"
    aria-live="polite"
    className="pointer-events-auto absolute z-10 flex items-start border border-[#e1eae2] bg-[#f8f8f4]"
    style={{
      left: '50.6%',
      top: '2.49%',
      width: cq(309),
      gap: cq(8),
      padding: `${cq(10)} ${cq(16)}`,
      borderRadius: cq(14),
      boxShadow: cardShadow(),
    }}
  >
    <img
      src={verifiedCheck}
      alt=""
      draggable={false}
      className="shrink-0"
      style={{ width: cq(22.6), height: cq(22.6), marginTop: cq(11) }}
    />
    <div className="min-w-0 flex-1" style={{ padding: `0 ${cq(10)}` }}>
      <p
        className="font-semibold text-[#387440]"
        style={{ fontSize: fs(14, 9), lineHeight: cq(24), letterSpacing: '0.2px' }}
      >
        Welcome to GTH, Student!
      </p>
      <p
        className="text-[#575755]"
        style={{ fontSize: fs(12, 8), lineHeight: cq(18), letterSpacing: '0.2px' }}
      >
        Taking you to your personalized setup
      </p>
    </div>
    <button
      type="button"
      onClick={() => {
        log('toast closed');
        onClose?.();
      }}
      aria-label="Dismiss notification"
      className="flex shrink-0 items-center justify-center text-[#387440]"
      style={{ width: cq(20), height: cq(20), marginTop: cq(13) }}
    >
      <img src={modalClose} alt="" draggable={false} className="block size-full" />
    </button>
  </div>
);

/*
 * WelcomePanelArt - centre content of the shared panel's `simple` variant.
 * Fills the panel (absolute inset-0); glows are full-bleed, the cards live in
 * the stage.
 */
export const WelcomePanelArt = ({ showToast = false, onCloseToast }) => {
  log('render', { showToast });
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ containerType: 'size' }}>
      <div aria-hidden="true" className="absolute inset-0" style={{ containerType: 'inline-size' }}>
        <Glows />
      </div>
      <PanelStage refH={WELCOME_REF_H}>
        {WELCOME_PHOTO_CARDS.map((card) => (
          <StageCard key={card.borderColor} {...card} />
        ))}
        <JobsCard />
        <SavedPill />
        <VerifiedPill />
        <ExperienceCard />
        <InstitutionCard />
      </PanelStage>
      {showToast && (
        <PanelStage refH={WELCOME_REF_H} decorative={false}>
          <WelcomeToast onClose={onCloseToast} />
        </PanelStage>
      )}
    </div>
  );
};

export default function TalentWelcomePanelContent(props) {
  return <WelcomePanelArt {...props} />;
}
