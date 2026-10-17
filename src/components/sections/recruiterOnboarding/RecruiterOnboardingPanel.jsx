import OnboardingPanel from '../../shared/OnboardingPanel.jsx';
import photoGold from '../../../assets/recruiter-onboarding/recruiter-panel-photo-gold.webp';
import photoPink from '../../../assets/recruiter-onboarding/recruiter-panel-photo-pink.webp';
import photoGreen from '../../../assets/recruiter-onboarding/recruiter-panel-photo-green.webp';
// Straight Figma exports (export_assets.py, svg @1x) of the R01 panel nodes.
// They are exported at their rotated bounding box, so NO extra rotation is applied.
import gthIcon from '../../../assets/recruiter-onboarding/panel/gdpr-shield.svg'; // 7991:60636
import sparkle26 from '../../../assets/recruiter-onboarding/panel/sparkle-26.svg'; // 7991:60640
import arrowUp from '../../../assets/recruiter-onboarding/panel/arrow-up.svg'; // 7991:60642
import arrowScribble from '../../../assets/recruiter-onboarding/panel/arrow-scribble.svg'; // 7991:60643
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterOnboardingPanel');

/*
 * RecruiterOnboardingPanel - green right panel for every recruiter step.
 *
 * Figma: R01 profile frames, panel "Frame 151" 7991:60605 (739 x 916; the
 * later frames name it "Frame 141", same geometry). Built on the shared
 * OnboardingPanel (parent-flow contract): photo cards = % of panel width +
 * aspect-ratio, overlays = % of the panel on both axes. The <aside> is a size
 * container, so overlay sizes use `cqw` (1% of PANEL width; 739px reference):
 * cq(px) = px / 739 * 100 cqw. Nothing is sized in vw or viewport px.
 *
 * Figma node map (panel-relative, 739 x 916):
 *   bg #1F4A2B                           7991:60605
 *   ellipse TR #F7EFDD 50% blur 200      7991:60606   BL #F9EBEA 50% blur 300  60607
 *   grid (rot 180deg) 383,572 358x405    7991:60608
 *   gold card  (71.6%, 47.1%) +5deg      7991:60609  border #EEDEB8
 *   pink card  (28.6%, 26.0%) -8.5deg    7991:60615  border #EBC2BD
 *   green card (30.3%, 74.6%) -18deg     7991:60618  border #C1D4C4
 *   sparkle stars (shared panel layer)   7991:60612
 *   sparkle-26 (45.3%, -0.6%) +21.55deg  7991:60640
 *   snow dots (shared panel layer)       7991:60613
 *   "OTP sent after this step" chip      7991:60621   (3.38%, 36.56%)
 *   "Verified profile" chip              7991:60628   (hidden behind green card
 *                                        in every frame - not rendered, see notes)
 *   GDPR chip                            7991:60634   (55.5%, 22.8%)
 *   "Recruiter profile" card (rot 2deg)  7991:60644   (60.5%, 70.2%)
 *   arrow up (hand drawn)                7991:60642   arrow scribble 7991:60643
 *   Watch tutorial (button-only: the label pill is opacity 0 in Figma)
 *
 * Photos are NEW Figma photos (not the talent/parent ones): exported from the
 * image frames 7991:60610 / 60616 / 60619 at 3x and de-rotated into
 * src/assets/recruiter-onboarding/. The Figma "Ellipse 5" dot pattern is baked
 * into them, so no corner-ellipse overlay is added (it would double the dots).
 *
 * `variant` - only the COPY differs between recruiter steps (geometry is
 * identical in all 38 frames that have a panel):
 *   'profile'      (default) R01 profile, R02 verify, R03 type, R04 search +
 *                  results + fuzzy + selected + not found, R04b default / filled
 *                  / error, R06 card / MoMo (filled, declined), R07 prefs
 *                  chip "OTP sent after this step" / "SMS + Email . expires in
 *                  10 min", card "Individual . LinkedIn-style"
 *   'affiliation'  R04 "Affiliation request" frame 7374:5519: chip "Fuzzy match
 *                  on", card "Kwame Asante . Dedicated"
 *   'orgCreated'   R04b "Created" frame 7374:6478: chip "You become Primary
 *                  Admin", card "Kwame Asante . Dedicated"
 *   'paystack'     R06 "MoMo awaiting approval" 7374:8437 + "Successful"
 *                  7374:8715: chip "Secured by Paystack", card "Professional .
 *                  $50 / month"
 * R05 plan, R08 review and R09 done have no 739px panel in Figma (full width) -
 * pass `panel={false}` to the shell for those.
 */

const REF_W = 739;
// px at the 739px reference -> container-width units (1cqw = 1% of the panel).
const cq = (px) => `${((px / REF_W) * 100).toFixed(4)}cqw`;
// Text keeps a legibility floor; the chip hugs its text above the design width.
const fs = (px, floor) => `max(${floor}px, ${cq(px)})`;

const RECRUITER_PANEL_COPY = {
  profile: {
    chipTitle: 'OTP sent after this step',
    chipSub: 'SMS + Email · expires in 10 min',
    cardSub: 'Individual · LinkedIn-style',
    wideGdpr: false,
  },
  affiliation: {
    chipTitle: 'Fuzzy match on',
    chipSub: 'Prevents duplicate organisations',
    cardSub: 'Kwame Asante · Dedicated',
    wideGdpr: true,
  },
  orgCreated: {
    chipTitle: 'You become Primary Admin',
    chipSub: 'Approve recruiters · manage billing',
    cardSub: 'Kwame Asante · Dedicated',
    wideGdpr: true,
  },
  paystack: {
    chipTitle: 'Secured by Paystack',
    chipSub: 'Card · MTN · Telecel · AirtelTigo',
    cardSub: 'Professional · $50 / month',
    wideGdpr: true,
  },
};

// Figma card shadow: 0 16 24 -6 rgba(27,36,44,.16), 0 2 2 -1 rgba(27,36,44,.04)
const CARD_SHADOW = `0 ${cq(16)} ${cq(24)} ${cq(-6)} rgba(27,36,44,0.16), 0 ${cq(2)} ${cq(2)} ${cq(-1)} rgba(27,36,44,0.04)`;
const CARD_BORDER = `max(4px, ${cq(10)})`;
const CARD_RADIUS = cq(40);

// Cards: width = % of panel width (outer size incl. 10px stroke), centres in %.
// 277 / 284 / 332 px of 739; centres from the rotated bounding boxes / 739x916.
const PHOTO_CARDS = [
  {
    photo: photoGold,
    centerX: '71.61%',
    centerY: '47.07%',
    rotate: 'rotate(5deg)',
    width: '37.48%',
    aspectRatio: '1',
    borderColor: '#EEDEB8',
    borderWidth: CARD_BORDER,
    borderRadius: CARD_RADIUS,
    boxShadow: CARD_SHADOW,
    borderOverlay: true,
  },
  {
    photo: photoPink,
    centerX: '28.59%',
    centerY: '26%',
    rotate: 'rotate(-8.51deg)',
    width: '38.43%',
    aspectRatio: '1',
    borderColor: '#EBC2BD',
    borderWidth: CARD_BORDER,
    borderRadius: CARD_RADIUS,
    boxShadow: CARD_SHADOW,
    borderOverlay: true,
  },
  {
    photo: photoGreen,
    centerX: '30.34%',
    centerY: '74.58%',
    rotate: 'rotate(-18deg)',
    width: '44.93%',
    aspectRatio: '1',
    borderColor: '#C1D4C4',
    borderWidth: CARD_BORDER,
    borderRadius: CARD_RADIUS,
    boxShadow: CARD_SHADOW,
    borderOverlay: true,
  },
];

// ── "OTP sent after this step" amber chip (7991:60621) ─────────────────────
const AmberChip = ({ title, sub }) => (
  <div
    aria-hidden="true"
    className="absolute z-10 flex items-center font-sans"
    style={{
      left: '3.38%',
      top: '36.56%',
      width: 'max-content',
      minWidth: cq(267.6),
      boxSizing: 'border-box',
      gap: cq(9),
      padding: `${cq(13)} ${cq(14)}`,
      backgroundColor: '#C8951A',
      border: '1px solid #FAF4E8',
      borderRadius: cq(13),
      boxShadow: CARD_SHADOW,
    }}
  >
    <span
      className="shrink-0"
      style={{
        width: cq(36),
        height: cq(36),
        borderRadius: cq(9),
        backgroundColor: '#EEDEB8',
      }}
    />
    <span className="flex min-w-0 flex-col" style={{ gap: cq(1) }}>
      <span
        className="whitespace-nowrap font-bold text-[#FEFEFE]"
        style={{ fontSize: fs(12, 9), lineHeight: 1.19 }}
      >
        {title}
      </span>
      <span
        className="font-ui whitespace-nowrap font-medium text-[#FEFEFE]"
        style={{ fontSize: fs(10, 8), lineHeight: 1.22, opacity: 0.72 }}
      >
        {sub}
      </span>
    </span>
  </div>
);

// ── "Ghana Data Protection Act compliant" white chip (7991:60634) ──────────
const GdprChip = ({ wide }) => (
  <div
    aria-hidden="true"
    className="absolute z-10 flex items-center font-sans"
    style={{
      // anchored by its right edge so a text-floor-wider chip grows leftwards
      right: wide ? '6.3%' : '7.03%',
      top: '22.8%',
      width: 'max-content',
      boxSizing: 'border-box',
      gap: cq(wide ? 8 : 6),
      padding: `${cq(7)} ${cq(9)}`,
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(28,42,33,0.06)',
      borderRadius: cq(10),
      boxShadow: `0 ${cq(2)} 0 rgba(0,0,0,0.05), 0 ${cq(8)} ${cq(32)} rgba(0,0,0,0.1)`,
    }}
  >
    <span className="flex shrink-0" style={{ width: cq(wide ? 13.6 : 15.8), aspectRatio: '1' }}>
      <img
        src={gthIcon}
        alt=""
        draggable={false}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </span>
    <span
      className="whitespace-nowrap font-semibold text-[#387440]"
      style={{ fontSize: fs(14, 10), lineHeight: cq(24), letterSpacing: '0.1px' }}
    >
      Ghana Data Protection Act compliant
    </span>
  </div>
);

// ── "Recruiter profile" cream card (7991:60644) ─────────────────────────────
const ProfileCard = ({ sub }) => (
  <div
    aria-hidden="true"
    className="absolute z-10 font-sans"
    style={{
      right: '8.2%',
      top: '70.2%',
      width: 'max-content',
      minWidth: cq(231.5),
      height: cq(56.2),
      boxSizing: 'border-box',
      transform: 'rotate(2deg)',
      backgroundColor: '#FAF4E8',
      border: '1px solid #EEDEB8',
      borderRadius: cq(10),
      boxShadow: `0 ${cq(3)} 0 #967014, 0 ${cq(8)} ${cq(28)} rgba(200,149,26,0.14)`,
    }}
  >
    <span
      className="absolute"
      style={{
        left: cq(8.6),
        top: cq(10),
        width: cq(26.4),
        height: cq(26.4),
        borderRadius: cq(5),
        backgroundColor: '#EEDEB8',
        transform: 'rotate(2.78deg)',
      }}
    />
    <span
      className="flex flex-col"
      style={{ marginLeft: cq(52.5), paddingTop: cq(7), paddingRight: cq(10), gap: cq(1.5) }}
    >
      <span
        className="font-ui whitespace-nowrap font-bold text-[#1C2A21]"
        style={{ fontSize: fs(12, 9), lineHeight: 1.22 }}
      >
        Recruiter profile
      </span>
      <span
        className="whitespace-nowrap text-[#70706E]"
        style={{ fontSize: fs(11, 9), lineHeight: 1.4, letterSpacing: '0.1px' }}
      >
        {sub}
      </span>
    </span>
  </div>
);

const Decor = ({ src, left, top, width, aspect, rotate }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    draggable={false}
    className="pointer-events-none absolute block max-w-none"
    style={{
      left,
      top,
      width,
      aspectRatio: aspect,
      transform: rotate ? `rotate(${rotate})` : undefined,
    }}
  />
);

const RecruiterOverlay = ({ copy }) => (
  <>
    {/* sparkle-26 export 99x97 = rotated bbox 98.5x97 at (324, -17) of 739x916 */}
    <Decor src={sparkle26} left="43.84%" top="-1.86%" width={cq(98.5)} aspect="99 / 97" />
    <GdprChip wide={copy.wideGdpr} />
    <AmberChip title={copy.chipTitle} sub={copy.chipSub} />
    {/* arrow up export 7991:60642: 120x120, bbox 119.7 at (75.7, 408.3) */}
    <Decor src={arrowUp} left="10.24%" top="44.57%" width={cq(119.7)} aspect="1" />
    {/* arrow scribble (7991:60643) 58.5px at (623, 598) */}
    <Decor src={arrowScribble} left="84.3%" top="65.28%" width={cq(58.5)} aspect="1" />
    <ProfileCard sub={copy.cardSub} />
  </>
);

const RecruiterOnboardingPanel = ({ variant = 'profile', copy: copyOverride, ...rest }) => {
  const base = RECRUITER_PANEL_COPY[variant] ?? RECRUITER_PANEL_COPY.profile;
  // `copy` may override any of chipTitle / chipSub / cardSub / wideGdpr.
  const copy = { ...base, ...copyOverride };
  log('mount', { variant, resolved: base === RECRUITER_PANEL_COPY[variant] });
  return (
    <OnboardingPanel
      refAspect={916 / 739}
      bgColor="#1F4A2B"
      ellipseTopRightColor="#F7EFDD"
      ellipseBottomLeftColor="#F9EBEA"
      ellipseAlpha={50}
      // Figma layer blur 200 / 300 -> CSS blur radius = half (100 / 150 px at 739)
      ellipseBlurTopRight={cq(100)}
      ellipseBlurBottomLeft={cq(150)}
      showBgLines={false}
      showBlElement={false}
      gridStyle={{
        left: '51.83%',
        top: '62.45%',
        width: '48.44%',
        height: '44.2%',
        rotate: '180deg',
      }}
      photoCards={PHOTO_CARDS}
      overlayContent={<RecruiterOverlay copy={copy} />}
      tutorialShowLabel={false}
      // Figma: 72px circle, right edge 57px / bottom edge 40px from the panel
      tutorialPlacement={{ right: cq(57), bottom: cq(40) }}
      tutorialAriaLabel="Watch recruiter onboarding tutorial"
      {...rest}
    />
  );
};

export default RecruiterOnboardingPanel;
