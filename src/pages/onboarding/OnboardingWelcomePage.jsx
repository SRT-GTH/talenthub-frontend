import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import { ArrowRightIcon, LoadingSpinner, PencilEditIcon } from '../../components/shared/assets.jsx';
import { debug } from '../../utils/debug.js';

// Page-level background decorations (same 3-ellipse pattern as InstitutionOnboardingLayout)
import pageEllipseTl from '../../assets/hero/page-ellipse-tl.svg';
import pageEllipseBr from '../../assets/hero/page-ellipse-br.svg';
import pageEllipseCenter from '../../assets/hero/page-ellipse-center.svg';
import backgroundGrid from '../../assets/hero/background grid.svg';

// Right panel assets
import studentsPhoto from '../../assets/hero/Students using GTH on phone.png';
import panelEllipseTr from '../../assets/hero/welcome-panel-ellipse-tr.svg';
import panelEllipseBl from '../../assets/hero/welcome-panel-ellipse-bl.png';
import panelBgGrid from '../../assets/hero/institution-panel-bg-grid.png';
import cardEllipse from '../../assets/hero/card-ellipse.svg';

// Saved pill heart icon (Figma node 2858:23723 — white heart Vector)
import savedHeartIcon from '../../assets/hero/saved-pill-heart.svg';
// Institution card avatars (Figma nodes 2858:23752 / 23753 / 23754 — Unsplash 56×56)
import institutionAvatar1 from '../../assets/hero/institution-card-avatar-1.png';
import institutionAvatar2 from '../../assets/hero/institution-card-avatar-2.png';
import institutionAvatar3 from '../../assets/hero/institution-card-avatar-3.png';

const log = debug('OnboardingWelcomePage');

/*
 * OnboardingWelcomePage — post-role-selection landing.
 * Figma source: node 2858:23640 ("Gth Role Selection – Student Selected
 * flow toast message-3seconds"). Two-column layout:
 *   left  — welcome copy + 3-step preview + "Let's Begin" CTA
 *   right — cream showcase panel with tilted student photo + 5 floating cards
 *
 * Right panel nodes mapped:
 *   2858:23710 — ellipse blob top-right
 *   2858:23711 — ellipse blob bottom-left
 *   2858:23712 — inverted bg grid
 *   2858:23714 — main photo card (533×599, border-10 #eedeb8, rotate-4)
 *   2858:23716 — corner ellipse inside photo
 *   2858:23717 — Jobs Available card
 *   2858:23720 — Saved pill
 *   2858:23725 — Verified profile pill
 *   2858:23731 — My Experience card
 *   2858:23740 — Institution card
 */

// ── Left column primitives ──────────────────────────────────────────────────

const TalentTag = () => (
  // Eyebrow pill — Figma 2858:24046 family.
  <span
    className="inline-flex items-center rounded-[5px] bg-brand-green-light px-3 py-1"
    style={{ outline: '1px solid #387440', outlineOffset: '-1px' }}
  >
    <span
      className="text-[10px] font-medium leading-4 text-brand-green"
      style={{ letterSpacing: '0.2px' }}
    >
      Talent
    </span>
  </span>
);

const StepNumberBadge = ({ n }) => (
  // 32×32 circle — bg #EBF1EC, 1px #C1D4C4 outline, italic serif numeral.
  // Figma text colour is brand-green-darker (#142916) per design token.
  <span
    aria-hidden="true"
    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-green-light font-display italic text-brand-green-darker"
    style={{ fontSize: 16, outline: '1px solid #C1D4C4', outlineOffset: '-1px' }}
  >
    {n}
  </span>
);

const STEPS = [
  {
    title: 'Your Basics',
    description: 'Date of birth, full name, and contact details fast and secure.',
  },
  {
    title: 'Your Location',
    description: 'Region and school so we match you to the right opportunities nearby.',
  },
  {
    title: 'Your Education',
    description: 'Level and subjects — this powers your talent score and your matching engine.',
  },
];

// ── Right panel floating card sub-components ────────────────────────────────

const JobsAvailableCard = () => (
  // "1,580 Jobs Available" — Figma 2858:23717.
  // Inset percentages are relative to the 739×976px panel (Figma frame size).
  // Slight rotation (4.71deg) matches Figma's scattered pattern.
  <div className="absolute" style={{ inset: '28.13% 77.67% 61.85% 4.19%' }}>
    <div
      className="relative size-full rounded-[18px] bg-white"
      style={{
        border: '1px solid #fefcf5',
        transform: 'rotate(4.71deg)',
        boxShadow: '0px 8px 16px rgba(0,0,0,0.10), 0px 2px 0px rgba(0,0,0,0.05)',
      }}
    >
      <p
        className="absolute font-display leading-none text-[#111111]"
        style={{ fontSize: 'clamp(18px, 2.5vw, 36px)', left: 14, top: 12 }}
      >
        1,580
      </p>
      <p
        className="absolute text-[12px] font-medium leading-5 text-neutral-dark-active"
        style={{ letterSpacing: '0.2px', left: 14, top: '52%' }}
      >
        Jobs Available
      </p>
    </div>
  </div>
);

const SavedPill = () => (
  // "Saved" pill — Figma 2858:23720. Green bg, #2a5730 bottom shadow.
  <div
    className="absolute rounded-[10px] bg-brand-green"
    style={{
      inset: '51.07% 80.67% 44.67% 6.5%',
      border: '1px solid #2a5730',
      boxShadow: '0px 4px 0px 0px #2a5730, 0px 8px 28px 0px rgba(56,116,64,0.25)',
    }}
  >
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.75">
      {/* Heart icon — Figma node 2858:23723 (Vector, 14×14, white fill) */}
      <img
        src={savedHeartIcon}
        alt=""
        width="14"
        height="14"
        aria-hidden="true"
        draggable={false}
      />
      <span
        className="whitespace-nowrap text-[16px] font-medium leading-7 text-white"
        style={{ letterSpacing: '0.2px' }}
      >
        Saved
      </span>
    </div>
  </div>
);

const VerifiedProfilePill = () => (
  // "Verified profile" — Figma 2858:23725.
  // Centre point: left calc(50%−279.07px), top calc(50%+182.58px).
  <div
    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md bg-white px-2.5 py-2"
    style={{
      left: 'calc(50% - 279.07px)',
      top: 'calc(50% + 182.58px)',
      width: '133px',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0px 8px 16px rgba(0,0,0,0.10), 0px 2px 0px rgba(0,0,0,0.05)',
    }}
  >
    <div className="flex items-center gap-2">
      {/* Check glyph — hand-crafted 12×12, rotated 8deg per Figma */}
      <span style={{ transform: 'rotate(8deg)', display: 'inline-flex' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="4.5" stroke="#387440" />
          <path
            d="M3.5 6 5 7.5l3.5-3"
            stroke="#387440"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className="whitespace-nowrap text-[14px] font-semibold leading-6 text-brand-green"
        style={{ letterSpacing: '0.1px' }}
      >
        Verified profile
      </span>
    </div>
  </div>
);

const MyExperienceCard = () => (
  // "My Experience" — Figma 2858:23731.
  // Inset percentages relative to the panel; rotation 6.59deg.
  <div className="absolute" style={{ inset: '18.82% 7.12% 65.94% 67.81%' }}>
    <div
      className="relative size-full rounded-[18px] bg-white"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        transform: 'rotate(6.59deg)',
        boxShadow: '0px 8px 16px rgba(0,0,0,0.10), 0px 2px 0px rgba(0,0,0,0.05)',
      }}
    >
      {/* Title + pencil icon */}
      <div
        className="absolute flex items-center gap-1"
        style={{ left: 14, top: '28%', transform: 'translateY(-50%)' }}
      >
        <span className="whitespace-nowrap text-[13px] font-bold leading-none text-black">
          My Experience
        </span>
        <PencilEditIcon />
      </div>
      {/* Skeleton bars — Figma: #f8f8f4 rows 1-2, #ebf1ec row 3 */}
      <div
        className="absolute h-1.5 rounded-full bg-neutral"
        style={{ left: 14, right: 14, top: '47%' }}
      />
      <div
        className="absolute h-1.5 rounded-full bg-neutral"
        style={{ left: 14, right: '24%', top: '57%' }}
      />
      <div
        className="absolute h-1.5 rounded-full bg-brand-green-light"
        style={{ left: 14, right: '44%', top: '67%' }}
      />
      {/* Submit button */}
      <div
        className="absolute flex items-center justify-center rounded-md bg-brand-green"
        style={{
          left: 14,
          right: 14,
          bottom: 14,
          height: 28,
          boxShadow: '0px 2px 0px #2a5730',
        }}
      >
        <span className="text-[12px] font-bold text-white">Submit</span>
      </div>
    </div>
  </div>
);

const InstitutionCard = () => (
  // "Accra Girls Senior High" — Figma 2858:23740.
  // Dark green card, bottom-right panel area.
  <div
    className="absolute overflow-hidden rounded-[20px] h-fit bg-brand-green items-center justify-center"
    style={{
      top: '61.89%',
      bottom: '24.14%',
      right: '57.61px',
      width: '222px',
      border: '1px solid rgba(0,0,0,0.10)',
      boxShadow: '0px 2px 2px -1px rgba(27,35,44,0.04), 0px 8px 16px -2px rgba(27,36,44,0.12)',
    }}
  >
    <div className="p-4.5">
      {/* Verified pill */}
      <span className="inline-flex items-center rounded-full bg-white/40 px-2.25 py-1">
        <span className="text-[9px] font-bold text-white" style={{ letterSpacing: '0.3px' }}>
          ✓ Verified Institution
        </span>
      </span>
      {/* School name */}
      <p
        className="mt-2 font-display font-normal leading-[1.1] text-white"
        style={{ fontSize: 21, letterSpacing: '-0.5px' }}
      >
        Accra Girls Senior High
      </p>
      {/* Region */}
      <p className="mt-1 text-[10px] leading-tight text-white/60">Greater Accra · GES-Accredited</p>
      {/* Avatar photos — Figma nodes 2858:23752 / 23753 / 23754.
          Positions: left 18 / 40.01 / 62px → 22px step → 6px overlap per avatar.
          -space-x-1.5 applies margin-left: -6px on siblings to reproduce that overlap. */}
      <div className="mt-3 flex -space-x-1.5">
        {[institutionAvatar1, institutionAvatar2, institutionAvatar3].map((src, i) => (
          <div
            key={i}
            className="size-7 shrink-0 overflow-hidden rounded-[14px] border-2 border-white/30"
          >
            <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Right showcase panel ────────────────────────────────────────────────────

const WelcomeRightPanel = ({ showToast }) => {
  log('WelcomeRightPanel render', { showToast });

  return (
    /*
     * Figma frame 2858:23709 — 739px wide, bg #fffefc, border-l #e7e7e7.
     * Layer order (back → front):
     *   1. Ellipse blob TR  (2858:23710)
     *   2. Ellipse blob BL  (2858:23711)
     *   3. Inverted bg grid (2858:23712)
     *   4. Photo card       (2858:23714)
     *   5. Floating cards   (2858:23717 / 23720 / 23725 / 23731 / 23740)
     *   6. Toast            (2858:23758)
     */
    <aside
      aria-hidden="true"
      className="relative hidden shrink-0 self-stretch overflow-hidden border-l border-black-light bg-yellow-light lg:block"
      style={{ width: 'clamp(360px, 42vw, 739px)' }}
    >
      {/* ── Layer 1: Ellipse blob top-right (2858:23710) ── */}
      {/* Figma: container 473×473, image bleeds inset -42.28% on all sides */}
      <div
        className="pointer-events-none absolute"
        style={{ left: '83.5%', top: '-21.5%', width: 473, height: 473 }}
      >
        <div className="absolute" style={{ inset: '-42.28%' }}>
          <img
            src={panelEllipseTr}
            alt=""
            aria-hidden="true"
            className="block max-w-none size-full"
            draggable={false}
          />
        </div>
      </div>

      {/* ── Layer 2: Ellipse blob bottom-left (2858:23711) ── */}
      {/* Figma: container 473×473, image 1073×1073 @1x → inset -63.42% */}
      <div
        className="pointer-events-none absolute"
        style={{ left: '-171px', bottom: '-238px', width: 473, height: 473 }}
      >
        <div className="absolute" style={{ inset: '-63.42%' }}>
          <img
            src={panelEllipseBl}
            alt=""
            aria-hidden="true"
            className="block max-w-none size-full"
            draggable={false}
          />
        </div>
      </div>

      {/* ── Layer 3: Inverted bg grid bottom-right (2858:23712) ── */}
      <div
        className="pointer-events-none absolute overflow-hidden"
        style={{ right: '-2px', top: '58.8%', width: '48.4%', height: '41.6%' }}
      >
        <div style={{ transform: 'rotate(180deg) scaleY(-1)', width: '100%', height: '100%' }}>
          <img
            src={panelBgGrid}
            alt=""
            aria-hidden="true"
            className="absolute max-w-none"
            style={{ top: 0, left: '-90.11%', width: '280.22%', height: '124.47%' }}
            draggable={false}
          />
        </div>
      </div>

      {/* ── Layer 4: Main photo card (2858:23714) ── */}
      {/*
       * Centre-point positioning mirrors Figma node 2858:23713 layout:
       *   left: calc(50% − 23.32px), top: calc(50% + 0.39px)
       *   translate(−50%, −50%) centres the card about that point.
       * Inner card: border-10 #eedeb8, rounded-[26px], rotate(4deg),
       *   shadow-bottom-400 (0px 16px 24px -6px rgba(27,36,44,0.16)).
       * Corner ellipse (2858:23716): at left-[−75.84px] top-[−85.44px],
       *   223px circle rotated −4deg, clipped by photo overflow-hidden.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: 'calc(50% - 23.32px)',
          top: 'calc(50% + 0.39px)',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(260px, 72.1%, 533px)',
        }}
      >
        <div style={{ transform: 'rotate(4deg)' }}>
          <div
            className="relative overflow-hidden"
            style={{
              border: 'clamp(5px, 0.9vw, 10px) solid #eedeb8',
              borderRadius: 'clamp(14px, 2vw, 26px)',
              aspectRatio: '533 / 599',
              boxShadow:
                '0px 2px 2px -1px rgba(27,36,44,0.04), 0px 16px 24px -6px rgba(27,36,44,0.16)',
            }}
          >
            <img
              src={studentsPhoto}
              alt="Students using Ghana Talent Hub on a laptop"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            {/* Corner ellipse glow (2858:23716) — top-left corner of photo */}
            <div
              className="pointer-events-none absolute"
              style={{ left: '-75.84px', top: '-85.44px', width: '238px', height: '238px' }}
            >
              <img
                src={cardEllipse}
                alt=""
                className="block"
                style={{ width: '223px', height: '223px', transform: 'rotate(-4deg)' }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Layer 5: Floating UI cards ── */}
      <JobsAvailableCard />
      <SavedPill />
      <VerifiedProfilePill />
      <MyExperienceCard />
      <InstitutionCard />

      {/* ── Layer 6: Welcome toast (2858:23758) — auto-hides after 3s ── */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="absolute left-1/2 top-6 z-10 w-77.25 -translate-x-1/2 rounded-[14px] border border-black/5 bg-white p-3 shadow-[0_16px_24px_-6px_rgba(27,36,44,0.18)]"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" />
                <path
                  d="M4.5 7l1.7 2 3.3-3.2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold leading-tight text-black">
                Welcome to GTH, Student!
              </p>
              <p className="mt-1 text-[12px] leading-4 text-neutral-dark-active">
                Your profile is live. Start exploring opportunities.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

// ── Page ────────────────────────────────────────────────────────────────────

const OnboardingWelcomePage = () => {
  log('mount');
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Auto-dismiss the success toast 3s after entry (Figma title:
    // "toast message-3seconds").
    const id = setTimeout(() => {
      log('toast auto-dismissed');
      setShowToast(false);
    }, 3000);
    return () => clearTimeout(id);
  }, []);

  const handleBegin = () => {
    if (isSubmitting) return;
    log('begin clicked');
    setIsSubmitting(true);
    setTimeout(() => navigate('/onboarding/talent/dob'), 600);
  };

  return (
    /*
     * Full-page section with bg-white base + 3 page-level glow ellipses
     * (same pattern as InstitutionOnboardingLayout) + background grid overlay.
     * Left column and right panel sit inside as flex children.
     */
    <section className="relative flex min-h-[calc(100vh-160px)] overflow-hidden bg-white">
      {/* ── Page background grid (opacity-70, full coverage) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: `url(${backgroundGrid})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ── Page ellipse TL — green gradient glow (2971:65357 pattern) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute overflow-hidden rounded-full "
        style={{ left: '-95px', top: '-178px', width: 571, height: 571, zIndex: 0 }}
      >
        <img
          src={pageEllipseTl}
          alt=""
          className="absolute block max-w-none"
          style={{
            inset: '-35.03%',
            width: 'calc(100% + 70.06%)',
            height: 'calc(100% + 70.06%)',
          }}
          draggable={false}
        />
      </div>

      {/* ── Page ellipse BR — red/pink glow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute overflow-hidden rounded-full "
        style={{ left: 'calc(83.33% - 16px)', top: 610, width: 571, height: 571, zIndex: 0 }}
      >
        <img
          src={pageEllipseBr}
          alt=""
          className="absolute block max-w-none"
          style={{
            inset: '-35.03%',
            width: 'calc(100% + 70.06%)',
            height: 'calc(100% + 70.06%)',
          }}
          draggable={false}
        />
      </div>

      {/* ── Page ellipse center — gold/orange glow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute overflow-hidden rounded-full "
        style={{
          left: 'calc(33.33% + 100px)',
          top: 'calc(50% - 200px)',
          transform: 'translateY(-50%)',
          width: 473,
          height: 473,
          zIndex: 0,
        }}
      >
        <img
          src={pageEllipseCenter}
          alt=""
          className="absolute block max-w-none"
          style={{
            inset: '-42.28%',
            width: 'calc(100% + 84.56%)',
            height: 'calc(100% + 84.56%)',
          }}
          draggable={false}
        />
      </div>

      {/* ── Left content column ── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 md:py-20">
        <div className="flex w-full max-w-138.5 flex-col items-center gap-6 text-center">
          <TalentTag />

          <h1
            className="font-display font-normal text-black"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 4rem)', lineHeight: 1.1 }}
          >
            <span className="block">Welcome. Here&apos;s what</span>
            <span className="block">
              happens <span className="italic text-brand-green">next.</span>
            </span>
          </h1>

          <p
            className="max-w-120.5 text-[16px] leading-6 text-content-helper"
            style={{ letterSpacing: '0.2px' }}
          >
            Just a few questions. We&apos;ll use your answers to build a profile that works hard for
            you.
          </p>

          {/* Wavy Ghana-flag divider — Figma vector 2858:24050 */}
          <WavyDivider />

          {/* "About 4 minutes" meta pill — Figma 2858:23824.
              bg-[#fffefc] per design (cream, not plain white). */}
          <div className="inline-flex items-center gap-2 rounded-md border border-[#E7E7E7] bg-yellow-light px-3 py-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <g filter="url(#about-4-min-dot-glow)">
                <circle cx="8" cy="8" r="4" fill="#E1EAE2" />
                <circle cx="8" cy="8" r="3.25" stroke="#1D7C4D" strokeWidth="1.5" />
              </g>
              <defs>
                <filter
                  id="about-4-min-dot-glow"
                  x="0"
                  y="0"
                  width="16"
                  height="16"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0.419608 0 0 0 0 0.247059 0 0 0 1 0"
                  />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
            <span
              className="text-[12px] leading-[18px] text-neutral-dark-active"
              style={{ letterSpacing: '0.2px' }}
            >
              About 4 minutes to complete
            </span>
          </div>

          {/* 3-step preview list — Figma Frame 145 children.
              Each row: 70px tall, badge left, two-line copy right,
              hairline #E6E6E6 divider between rows. */}
          <ol className="mt-2 flex w-full max-w-[511px] flex-col text-left">
            {STEPS.map((step, idx) => {
              const isLast = idx === STEPS.length - 1;
              return (
                <li
                  key={step.title}
                  className={`relative flex h-[70px] items-start ${isLast ? '' : 'border-b border-[#E6E6E6]'}`}
                >
                  <span aria-hidden="true" className="absolute left-0 top-[19px]">
                    <StepNumberBadge n={idx + 1} />
                  </span>
                  <div className="absolute left-[58px] top-[17px] flex flex-col gap-2">
                    <p className="text-[16px] font-semibold leading-[18px] text-brand-green">
                      {step.title}
                    </p>
                    <p className="text-[14px] leading-[18px] text-[#575755]">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Primary CTA — "Let's Begin" */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleBegin}
            state={isSubmitting ? 'active' : undefined}
            disabled={isSubmitting}
            leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
            rightIcon={<ArrowRightIcon />}
            className="mt-3 w-full max-w-[420px]"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Setting Things Up' : "Let's Begin"}
          </Button>

          {/* Already-have-account link */}
          <div className="flex items-center gap-2 text-[14px] leading-6">
            <span className="text-[#737373]" style={{ letterSpacing: '0.2px' }}>
              Already Have an account?
            </span>
            <Link
              to={'/login'}
              className="font-semibold text-brand-green underline-offset-2 hover:underline"
              style={{ letterSpacing: '0.1px' }}
            >
              Log in Instead
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right showcase panel ── */}
      <WelcomeRightPanel showToast={showToast} />
    </section>
  );
};

export default OnboardingWelcomePage;
