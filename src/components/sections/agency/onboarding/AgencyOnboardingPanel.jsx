import OnboardingPanel from '../../../shared/OnboardingPanel.jsx';
import photoGold from '../../../../assets/agency/onboarding/agency-panel-photo-gold.png';
import photoGreen from '../../../../assets/agency/onboarding/agency-panel-photo-green.png';
import photoPink from '../../../../assets/agency/onboarding/agency-panel-photo-pink.png';
import { AgShield } from './agencyOnboardingIcons.jsx';

/*
 * AgencyOnboardingPanel — the green right panel of the agency sign-up (Figma 11.4.1a "Frame 141" 8596:82, 739 x 916; same geometry as the recruiter R01 panel).
 * Built on the shared OnboardingPanel (photo cards = % of the panel width, overlays = % of the panel, `cqw` = 1 % of the panel width, 739 px reference):
 *   bg #387440 · ellipses #f7efdd (top right) / #f9ebea (bottom left) at 50 % · three photo cards (gold +5deg, pink -8.5deg, green -18deg, 10px strokes)
 *   · white chip (top right) · "MoU checked" mint card (left) · "Government agency" white card (bottom right).
 * variant 'details' (step 03, the agency form) | 'verify' (step 04, the email code): only the overlay copy differs.
 * Props: variant, className-less (the panel fills its column).
 */

const REF_W = 739;
const cq = (px) => `${((px / REF_W) * 100).toFixed(4)}cqw`;
const fs = (px, floor) => `max(${floor}px, ${cq(px)})`;
const CARD_SHADOW = `0 ${cq(16)} ${cq(24)} ${cq(-6)} rgba(27,36,44,0.16), 0 ${cq(2)} ${cq(2)} ${cq(-1)} rgba(27,36,44,0.04)`;
const CARD_BORDER = `max(4px, ${cq(10)})`;
const CARD_RADIUS = cq(40);

const card = (photo, centerX, centerY, rotate, width, borderColor) => ({
  photo,
  centerX,
  centerY,
  rotate,
  width,
  aspectRatio: '1',
  borderColor,
  borderWidth: CARD_BORDER,
  borderRadius: CARD_RADIUS,
  boxShadow: CARD_SHADOW,
  borderOverlay: true,
});

const PHOTO_CARDS = [
  card(photoGold, '71.61%', '47.07%', 'rotate(5deg)', '37.48%', '#EEDEB8'),
  card(photoPink, '28.59%', '26%', 'rotate(-8.51deg)', '38.43%', '#EBC2BD'),
  card(photoGreen, '30.34%', '74.58%', 'rotate(-18deg)', '44.93%', '#C1D4C4'),
];

const COPY = {
  details: {
    chip: 'No names, no minors’ details',
    cardTitle: 'MoU checked',
    cardSub: 'Every agency signs an MoU first',
    foot: { title: 'Government agency', sub: 'Aggregate data · access logged' },
  },
  registered: {
    chip: 'Names masked until they accept',
    cardTitle: 'MoU checked',
    cardSub: 'Every agency signs an MoU first',
    foot: { title: 'Government agency', sub: 'Aggregate data · access logged' },
  },
  verify: {
    chip: 'Ghana Data Protection Act compliant',
    cardTitle: 'Code sent to your work email',
    cardSub: 'Email · expires in 10 min',
    foot: { title: 'National Youth Authority', sub: 'Agency' },
  },
};

const Overlay = ({ copy }) => (
  <>
    <div
      aria-hidden="true"
      className="absolute z-10 flex items-center font-sans"
      style={{
        right: '6.3%',
        top: '22.8%',
        width: 'max-content',
        gap: cq(8),
        padding: `${cq(7)} ${cq(9)}`,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(28,42,33,0.06)',
        borderRadius: cq(10),
        boxShadow: `0 ${cq(2)} 0 rgba(0,0,0,0.05), 0 ${cq(8)} ${cq(32)} rgba(0,0,0,0.1)`,
      }}
    >
      <AgShield className="shrink-0 text-[#387440]" style={{ width: cq(14), height: cq(14) }} />
      <span
        className="font-semibold whitespace-nowrap text-[#387440]"
        style={{ fontSize: fs(14, 10), lineHeight: cq(24), letterSpacing: '0.1px' }}
      >
        {copy.chip}
      </span>
    </div>
    <div
      aria-hidden="true"
      className="absolute z-10 flex items-center font-sans"
      style={{
        left: '3.38%',
        top: '36.56%',
        width: 'max-content',
        minWidth: cq(268),
        gap: cq(15),
        padding: `${cq(13)} ${cq(15)}`,
        backgroundColor: '#EBF1EC',
        border: '1px solid #FFFEFC',
        borderRadius: cq(13),
        boxShadow: CARD_SHADOW,
      }}
    >
      <span
        className="grid shrink-0 place-items-center bg-[#387440] text-white"
        style={{ width: cq(36), height: cq(36), borderRadius: cq(9) }}
      >
        <AgShield style={{ width: cq(16), height: cq(16) }} />
      </span>
      <span className="flex flex-col" style={{ gap: cq(2) }}>
        <span
          className="font-bold whitespace-nowrap text-[#595959]"
          style={{ fontSize: fs(12, 9), lineHeight: 1.3 }}
        >
          {copy.cardTitle}
        </span>
        <span
          className="whitespace-nowrap text-[#595959]"
          style={{ fontSize: fs(10, 8), lineHeight: 1.3 }}
        >
          {copy.cardSub}
        </span>
      </span>
    </div>
    <div
      aria-hidden="true"
      className="absolute z-10 flex flex-col font-sans"
      style={{
        right: '6.1%',
        top: '70.2%',
        width: cq(235),
        gap: cq(10),
        padding: `${cq(16)} ${cq(21)}`,
        backgroundColor: 'rgba(255,255,255,0.92)',
        border: '1px solid #E6E6E6',
        borderRadius: cq(16),
        boxShadow: `0 ${cq(2)} ${cq(8)} rgba(0,0,0,0.08)`,
      }}
    >
      <span
        className="flex items-center rounded-[6px] bg-[#e1eae2]"
        style={{ gap: cq(9), padding: cq(8) }}
      >
        <span
          className="shrink-0 rounded-full bg-[#387440]"
          style={{ width: cq(6), height: cq(6) }}
        />
        <span
          className="font-semibold whitespace-nowrap text-[#387440]"
          style={{ fontSize: fs(12, 9) }}
        >
          {copy.foot.title}
        </span>
      </span>
      <span
        className="flex items-center rounded-[6px] bg-[#e7e7e7]"
        style={{ gap: cq(9), padding: `${cq(6)} ${cq(8)}` }}
      >
        <span
          className="shrink-0 rounded-full bg-[#575755]"
          style={{ width: cq(6), height: cq(6) }}
        />
        <span className="whitespace-nowrap text-[#959592]" style={{ fontSize: fs(12, 9) }}>
          {copy.foot.sub}
        </span>
      </span>
    </div>
  </>
);

const AgencyOnboardingPanel = ({ variant = 'details' }) => (
  <OnboardingPanel
    refAspect={916 / 739}
    bgColor="#387440"
    ellipseTopRightColor="#F7EFDD"
    ellipseBottomLeftColor="#F9EBEA"
    ellipseAlpha={50}
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
    overlayContent={<Overlay copy={COPY[variant] ?? COPY.details} />}
    tutorialShowLabel={false}
    tutorialPlacement={{ right: cq(57), bottom: cq(40) }}
    tutorialAriaLabel="Watch the agency sign-up tutorial"
  />
);

export default AgencyOnboardingPanel;
