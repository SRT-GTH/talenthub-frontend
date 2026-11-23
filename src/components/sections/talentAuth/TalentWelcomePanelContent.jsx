import studentPhoto from '../../../assets/hero/talent-welcome-panel-main.webp';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import verifiedCheck from '../../../assets/talent-onboarding/panel-verified-check.svg';
import savedHeart from '../../../assets/talent-onboarding/panel-saved-heart.svg';
import pencil from '../../../assets/talent-onboarding/panel-pencil.svg';
import bgGrid from '../../../assets/hero/talent-panel-bg-grid.png';
import avatar1 from '../../../assets/hero/talent-panel-institution-avatar-1.jpg';
import avatar2 from '../../../assets/hero/talent-panel-institution-avatar-2.jpg';
import avatar3 from '../../../assets/hero/talent-panel-institution-avatar-3.jpg';
import { PanelStage, StageCard, cq, fs } from './TalentPanelParts.jsx';
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
 * The welcome toast is not part of the art: the page shows it through ui/Toast (variant "welcome-card").
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
    focused: { cx: 49.76, cy: 48.21 }, // Focused frame: flat, centred a touch higher
    radius: 26,
    ellipse: ellipseCard1,
  },
];

// Card shadows per look, from the frames: Playful = soft lift + hard 4px ink offset on the white cards, none on the
// pills; Focused = a faint soft shadow. Passed as CSS variables so the focused: variant can swap them (inline
// box-shadow can't be overridden by a class).
const SOFT_SHADOW = () =>
  `0 ${cq(2)} ${cq(4)} rgba(28,42,33,0.04), 0 ${cq(1)} ${cq(1)} rgba(28,42,33,0.04)`;
const HARD_SHADOW = () =>
  `0 ${cq(10)} ${cq(12)} rgba(28,42,33,0.06), ${cq(4)} ${cq(4)} 0 rgba(28,42,33,0.45)`;
const MODE_SHADOW = '[box-shadow:var(--sh-p)] focused:[box-shadow:var(--sh-f)]';
const modeShadow = (playful, focused) => ({ '--sh-p': playful, '--sh-f': focused });

// Floating cards that sit tilted in Playful and flat (slightly elsewhere) in Focused; they glide between the two.
const MODE_PLACE =
  'gth-mode-move [left:var(--cp-x-p)] [top:var(--cp-y-p)] [transform:translate(-50%,-50%)_rotate(var(--cp-r-p))] focused:[left:var(--cp-x-f)] focused:[top:var(--cp-y-f)] focused:[transform:translate(-50%,-50%)]';
const modePlace = (playful, focused) => ({
  '--cp-x-p': `${playful.x}%`,
  '--cp-y-p': `${playful.y}%`,
  '--cp-r-p': `${playful.r}deg`,
  '--cp-x-f': `${focused.x}%`,
  '--cp-y-f': `${focused.y}%`,
});

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
    className={`absolute flex flex-col border border-[#fefcf5] bg-white ${MODE_SHADOW} ${MODE_PLACE}`}
    style={{
      ...modePlace({ x: 13.26, y: 33.14, r: 4.71 }, { x: 13.78, y: 32.63 }),
      width: cq(126.4),
      minHeight: cq(87.1),
      borderRadius: cq(18),
      padding: `${cq(14)} ${cq(24)}`,
      ...modeShadow(HARD_SHADOW(), SOFT_SHADOW()),
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
    className={`absolute flex items-center border border-[#2a5730] bg-[#387440] ${MODE_SHADOW}`}
    style={{
      left: '6.5%',
      top: '51.07%',
      gap: cq(7),
      padding: `${cq(6.75)} ${cq(14)}`,
      borderRadius: cq(10),
      ...modeShadow('none', SOFT_SHADOW()),
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
    className={`absolute border border-[rgba(28,42,33,0.06)] bg-white ${MODE_SHADOW} ${MODE_PLACE}`}
    style={{
      ...modePlace({ x: 80.35, y: 26.44, r: 6.59 }, { x: 81.43, y: 25.5 }),
      width: cq(171.5),
      height: cq(129.9),
      borderRadius: cq(18),
      ...modeShadow(HARD_SHADOW(), SOFT_SHADOW()),
    }}
  >
    <p
      className="absolute -translate-y-1/2 whitespace-nowrap font-bold text-[#1c2a21]"
      style={{ left: cq(18), top: cq(21.3), fontSize: fs(14), lineHeight: 'normal' }}
    >
      My Experience
    </p>
    <img
      src={pencil}
      alt=""
      draggable={false}
      className="absolute"
      style={{ left: cq(137.4), top: cq(15.8), width: cq(14), height: cq(14) }}
    />
    {[
      { left: 18, w: 136, top: 44, bg: '#f8f8f4' },
      { left: 16.5, w: 113.5, top: 57, bg: '#f8f8f4' },
      { left: 16.5, w: 80.3, top: 70, bg: '#ebf1ec' },
    ].map((bar) => (
      <span
        key={bar.top}
        className="absolute block rounded-full"
        style={{
          left: cq(bar.left),
          top: cq(bar.top),
          width: cq(bar.w),
          height: cq(6),
          backgroundColor: bar.bg,
        }}
      />
    ))}
    <span
      className="absolute flex items-center justify-center border-x-2 border-t border-b-2 border-[#2a5730] bg-[#387440] font-bold text-[#fef1e7]"
      style={{
        left: cq(18),
        top: cq(90.4),
        width: cq(136),
        height: cq(30),
        borderRadius: cq(10),
        fontSize: fs(12, 6),
        letterSpacing: '0.1px',
        boxShadow: `0 ${cq(4)} 0 #224626`,
      }}
    >
      Submit
    </span>
  </div>
);

const InstitutionCard = () => (
  <div
    className={`absolute flex flex-col border border-[rgba(28,42,33,0.1)] bg-[#387440] ${MODE_SHADOW}`}
    style={{
      left: '62.11%',
      top: '61.89%',
      width: cq(222.4),
      minHeight: cq(136.4),
      borderRadius: cq(20),
      padding: cq(18),
      ...modeShadow(
        `0 ${cq(8)} ${cq(16)} ${cq(-2)} rgba(27,36,44,0.12), 0 ${cq(2)} ${cq(2)} ${cq(-1)} rgba(27,35,44,0.04)`,
        `0 ${cq(5)} ${cq(11)} ${cq(-2)} rgba(27,36,44,0.06), 0 ${cq(2)} ${cq(2)} ${cq(-1)} rgba(27,35,44,0.04)`
      ),
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

/*
 * WelcomePanelArt - centre content of the shared panel's `simple` variant.
 * Fills the panel (absolute inset-0); glows are full-bleed, the cards live in
 * the stage.
 */
export const WelcomePanelArt = () => {
  log('render');
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
    </div>
  );
};

export default function TalentWelcomePanelContent(props) {
  return <WelcomePanelArt {...props} />;
}
