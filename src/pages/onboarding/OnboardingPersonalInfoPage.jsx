import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import WatchTutorial from '../../components/ui/WatchTutorial.jsx';
import { TextInput, Select } from '../../components/ui/form';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import {
  ArrowRightIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  IdCardIcon,
  LoadingSpinner,
  LockIcon,
  PencilEditIcon,
  ProfilePlaceholderIcon,
  SuccessCheckIcon,
  SummaryFlagIcon,
  SummaryIdIcon,
  SummaryPhotoIcon,
  SummaryUserIcon,
  UserIcon,
} from '../../components/shared/assets.jsx';
import { debug } from '../../utils/debug.js';

// ── right panel photo assets
import loginPhoto1 from '../../assets/login/login aside img1.jpg';
import loginPhoto2 from '../../assets/login/login aside img2.jpg';
import loginPhoto3 from '../../assets/login/login aside img3.jpg';

// ── right panel background grid
import bgGrid from '../../assets/hero/institution-panel-bg-grid.png';

// ── right panel sparkle stars (Figma node 2329:3893 via 'shape, abstract...' instance)
import panelSparkle0 from '../../assets/hero/panel-sparkle-0.svg';
import panelSparkle1 from '../../assets/hero/panel-sparkle-1.svg';
import panelSparkle2 from '../../assets/hero/panel-sparkle-2.svg';
import panelSparkle3 from '../../assets/hero/panel-sparkle-3.svg';
import panelSparkle4 from '../../assets/hero/panel-sparkle-4.svg';

// ── right panel snow-ring dots (Figma node 'snow, rain, drops...' instance)
import panelSnow0 from '../../assets/hero/panel-snow-0.svg';
import panelSnow1 from '../../assets/hero/panel-snow-1.svg';
import panelSnow2 from '../../assets/hero/panel-snow-2.svg';
import panelSnow3 from '../../assets/hero/panel-snow-3.svg';
import panelSnow4 from '../../assets/hero/panel-snow-4.svg';
import panelSnow5 from '../../assets/hero/panel-snow-5.svg';
import panelSnow6 from '../../assets/hero/panel-snow-6.svg';
import panelSnow7 from '../../assets/hero/panel-snow-7.svg';
import panelSnow8 from '../../assets/hero/panel-snow-8.svg';
import panelSnow9 from '../../assets/hero/panel-snow-9.svg';
import panelSnow10 from '../../assets/hero/panel-snow-10.svg';
import panelSnow11 from '../../assets/hero/panel-snow-11.svg';
import panelSnow12 from '../../assets/hero/panel-snow-12.svg';
import panelSnow13 from '../../assets/hero/panel-snow-13.svg';
import panelSnow14 from '../../assets/hero/panel-snow-14.svg';
import panelSnow15 from '../../assets/hero/panel-snow-15.svg';
import panelSnow16 from '../../assets/hero/panel-snow-16.svg';
import panelSnow17 from '../../assets/hero/panel-snow-17.svg';
import panelSnow18 from '../../assets/hero/panel-snow-18.svg';
import panelSnow19 from '../../assets/hero/panel-snow-19.svg';
import panelSnow20 from '../../assets/hero/panel-snow-20.svg';

const log = debug('OnboardingPersonalInfoPage');

/*
 * OnboardingPersonalInfoPage — Step 2 of the talent onboarding flow.
 * Maps to user story US-1.1.1-02 ("Capture Talent Personal Information").
 * Breadcrumb label is "Build Your Profile" per Figma; the URL and
 * component name follow the user-story terminology for clarity.
 * Route: /onboarding/talent/personal-info.
 *
 * Figma source: frame 2329:3893 "Personal Infomation".
 *   Right panel: Frame 141 (739×916, fill=#387440).
 *
 * Left column collects 9 fields in a 2-column grid:
 *   Profile Photo (full-width upload row)
 *   First Name*  | Middle Name (opt.)
 *   Last Name*   | Gender
 *   Nationality  | Ghana Card / Student ID*
 *   Password*    | Retype Password*
 */

// ---- profile photo upload --------------------------------------------

const ProfilePhotoField = ({ file, previewUrl, onChange }) => {
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current?.click();
  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onChange(selected);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="onboarding-profile-photo"
        className="inline-flex items-baseline gap-px text-[14px] font-medium leading-6 text-[#111111]"
        style={{ letterSpacing: '0.2px' }}
      >
        Profile Photo
        <span aria-hidden="true" className="text-[14px] font-semibold text-brand-green">
          *
        </span>
      </label>

      <div className="flex items-center gap-4">
        {/* Round preview slot — 60×60 circle, cream-grey placeholder; flips to photo on upload */}
        <span
          className="flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E6E6E6] bg-[#F2F2EE]"
          aria-hidden="true"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="" className="size-full object-cover" />
          ) : (
            <ProfilePlaceholderIcon />
          )}
        </span>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex h-[34px] items-center gap-1.5 self-start rounded-[8px] border border-[#E6E6E6] bg-white px-3 text-[11px] font-semibold text-[#575755] shadow-[0_2px_0_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FAFAF8]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M6 8.5V2M6 2 3.5 4.5M6 2l2.5 2.5M2 9.5V10a.5.5 0 0 0 .5.5h7A.5.5 0 0 0 10 10v-.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upload photo
          </button>
          {file ? (
            <span className="text-[10px] leading-tight text-brand-green">
              {file.name} ({Math.round(file.size / 1024)}KB)
            </span>
          ) : (
            <span className="text-[10px] leading-tight text-[#BABAB7]">JPG or PNG · Max 5MB</span>
          )}
        </div>
      </div>

      <input
        id="onboarding-profile-photo"
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  );
};

// ---- success modal ----------------------------------------------------

const IdentityCapturedModal = ({ summary, onClose, onContinue }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="identity-captured-title"
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: 'rgba(17, 17, 17, 0.70)' }}
  >
    <div className="relative w-full max-w-[440px] rounded-[24px] border-[3px] border-brand-green-light-active bg-white px-8 py-8 shadow-[0_24px_40px_-6px_rgba(27,36,44,0.30),0_4px_4px_-2px_rgba(27,36,44,0.06)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full border border-[#E6E6E6] bg-white text-[#575755] transition-colors hover:bg-[#FAFAF8]"
      >
        <CloseIcon />
      </button>

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-md bg-brand-green-light-hover">
          <SuccessCheckIcon />
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-sm border border-brand-green-light-active bg-brand-green-light px-3 py-1"
          style={{ outline: '1px solid #387440', outlineOffset: '-1px' }}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-green" />
          <span
            className="text-[11px] font-medium leading-4 text-brand-green"
            style={{ letterSpacing: '0.2px' }}
          >
            Profile section complete
          </span>
        </span>
        <h2
          id="identity-captured-title"
          className="font-display font-normal text-[#111111]"
          style={{ fontSize: 32, lineHeight: '34px' }}
        >
          Identity <span className="italic text-brand-green">captured.</span>
        </h2>
        <p
          className="text-[12px] leading-4.5 text-neutral-dark-hover"
          style={{ letterSpacing: '0.2px' }}
        >
          Your personal information is saved and encrypted. Here&apos;s a summary of what we stored.
        </p>
      </div>

      <ul className="mt-5 flex flex-col gap-2 rounded-[14px] border border-brand-green-light-active bg-[#FBFDFB] p-3">
        {summary.map((row) => (
          <li key={row.label} className="flex items-center justify-between text-[12px] leading-5">
            <span className="flex items-center gap-2 text-[#575755]">
              {row.icon}
              {row.label}
            </span>
            {row.value === '__uploaded__' ? (
              <span className="inline-flex items-center gap-1 text-brand-green">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
                  <path
                    d="m3.2 5.2 1.4 1.4 2.2-2.6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Uploaded
              </span>
            ) : (
              <span className="font-semibold text-[#111111]">{row.value}</span>
            )}
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={onContinue}
        rightIcon={<ArrowRightIcon />}
        className="mt-5 w-full"
      >
        Continue To Contact Details
      </Button>

      <p
        className="mt-3 text-center text-[10px] leading-4 text-neutral-dark-hover"
        style={{ letterSpacing: '0.2px' }}
      >
        <span aria-hidden="true">·</span> Data encrypted at rest <span aria-hidden="true">·</span>{' '}
        Ghana Data Protection Act compliant
      </p>
    </div>
  </div>
);

// ---- right panel sub-components ---------------------------------------

/*
 * PanelSparkle — 5 SVG vectors composited inside a 100×102px container.
 * Figma: 'shape, abstract, blob, stars, spark, sparks' instance.
 * Panel position: left=579px, top=22px (same inset values as institution panel).
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
    style={{
      left: 579 /* px — Figma panel-relative x */,
      top: 22 /* px */,
      width: 100,
      height: 102,
    }}
  >
    {SPARKLE_VECTORS.map(({ src, inset }, i) => (
      <div key={i} className="absolute" style={{ inset }}>
        <img
          src={src}
          alt=""
          className="absolute inset-0 block max-w-none size-full"
          draggable={false}
        />
      </div>
    ))}
  </div>
);

/*
 * PanelSnowDots — 21 SVG ring dots composited inside a 447×359px container.
 * Figma: 'snow, rain, drops, weather, sparkle, pattern' instance.
 * Panel position: left=-388px, top=-31px — mostly off the left edge;
 * only the rightmost ~59px slice is visible inside the panel.
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
    style={{ left: -388 /* px */, top: -31 /* px */, width: 447, height: 359 }}
  >
    {SNOW_VECTORS.map(({ src, inset }, i) => (
      <div key={i} className="absolute" style={{ inset }}>
        <img
          src={src}
          alt=""
          className="absolute inset-0 block max-w-none size-full"
          draggable={false}
        />
      </div>
    ))}
  </div>
);

/*
 * ProfilePhotoCard — bordered, rotated photo card for the right panel.
 * Rotation is very subtle (~0.1°) — the Figma name says "slightly tilted".
 * The 10px border is positioned INSIDE the element's box (box-sizing border-box).
 */
const ProfilePhotoCard = ({ photo, borderColor, width, left, top, rotation }) => (
  <div
    aria-hidden="true"
    className="absolute overflow-hidden"
    style={{
      left,
      top,
      width,
      height: width,
      borderRadius: 40 /* px — Figma r=40 */,
      border: `10px solid ${borderColor}` /* Figma strokeWeight=10 */,
      transform: `rotate(${rotation}deg)`,
      boxShadow:
        '0 24px 40px -8px rgba(27,36,44,0.30), 0 2px 2px -1px rgba(27,36,44,0.04)' /* DROP_SHADOW r=24 + r=2 */,
    }}
  >
    <img src={photo} alt="" className="size-full object-cover" draggable={false} />
  </div>
);

// ---- right panel -------------------------------------------------------

/*
 * ProfileRightPanel — decorative right column for the "Build Your Profile" step.
 * Figma: Frame 141 (739×916) inside "Personal Infomation" frame (2329:3893).
 *
 * Layer order (back → front):
 *   1. Background orbs (gold top-right, pink bottom-left) — LAYER_BLUR
 *   2. Background grid overlay (institution-panel-bg-grid.png, rot=3.1°)
 *   3. Sparkle stars (100×102 at panel-left=579, top=22)
 *   4. Snow ring dots (447×359 at panel-left=-388, top=-31)
 *   5. Additional sparkle star (98×97 at panel-left=305, top=-28)
 *   6. Photo card 2 — standalone, gold border #eedeb8, 338×338 at (344, 271)
 *   7. Photo card 1 — large, pink border #ebc2bd, 374×374 at (36, 27) [Group 2]
 *   8. Data Protected card at (25, 335) [Group 2]
 *   9. Compliance pill at (410, 209) [Group 2]
 *  10. Verified profile card at (24, 586) [Group 2]
 *  11. Photo card 3 — bottom-left, green border #c1d4c4, 357×357 at (45, 504) [Group 2]
 *  12. Decorative hand-drawn arrows
 *  13. Adult/Youth experience card (235×102 at panel-left=446, top=643)
 *  14. Watch Tutorial component (211×76 at panel-left=471, top=802)
 */
const ProfileRightPanel = () => {
  log('ProfileRightPanel mount');

  return (
    <aside
      aria-hidden="true"
      className="relative hidden shrink-0 self-stretch overflow-hidden border-l border-[#E7E7E7] bg-brand-green lg:block"
      style={{ width: 'clamp(360px, 42vw, 739px)' }}
    >
      {/* ── 1. Background orb top-right (Ellipse 3) — gold, blur=200, opacity=0.5 ── */}
      {/* Figma: fill=#f7efdd, node_op=0.50, LAYER_BLUR r=200. Panel pos: left=618, top=-210 */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: 618 /* px */,
          top: -210 /* px — mostly above panel */,
          width: 473,
          height: 473,
          background: '#f7efdd',
          opacity: 0.5,
          filter: 'blur(200px)',
        }}
      />

      {/* ── 2. Background orb bottom-left (Ellipse 4) — pink, blur=300, opacity=0.5 ── */}
      {/* Figma: fill=#f9ebea, node_op=0.50, LAYER_BLUR r=300. Panel pos: left=-170, top=666 */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: -170 /* px — bleeds off left */,
          top: 666 /* px */,
          width: 473,
          height: 473,
          background: '#f9ebea',
          opacity: 0.5,
          filter: 'blur(300px)',
        }}
      />

      {/* ── 3. Background grid overlay (rot=3.1°) ── */}
      {/* Figma: Rectangle 'grid' 358×405, IMAGE fill, opacity=1, rot=3.1°. Panel pos: (383, 572) */}
      <div
        className="pointer-events-none absolute overflow-hidden"
        style={{ left: 383, top: 572, width: 358, height: 405 }}
      >
        <div style={{ transform: 'rotate(3.1deg) scaleY(-1)', width: '100%', height: '100%' }}>
          <img
            src={bgGrid}
            alt=""
            aria-hidden="true"
            className="absolute max-w-none"
            style={{ top: 0, left: '-90%', width: '280%', height: '125%' }}
            draggable={false}
          />
        </div>
      </div>

      {/* ── 4. Sparkle stars (100×102 at panel 579, 22) ── */}
      <PanelSparkle />

      {/* ── 5. Snow ring dots (447×359 at panel -388, -31) ── */}
      <PanelSnowDots />

      {/* ── 6. Sparkle at panel (305, -28), 98.5×97, rot=0.4°, instance opacity=1 ── */}
      {/*
       * Figma 2329:3998: 'spark, sparkle, 26' — 5 vectors, all fill=#ffffff fillOpacity=0.50.
       * Container: 98.5×97. All 5 rays originate from a common point at (25,80) —
       * the card-corner area — and radiate outward toward each vector's centre.
       * Each ray is a thin 3px-wide quadrilateral computed from the direction vector
       * and its perpendicular. Centres derived from absoluteBoundingBox:
       *   V5 (12×9.8   at 13.7,46.0) → ctr (19.7,50.9) — ~12 o'clock
       *   V1 (17.4×24.8 at 27.4,27.8) → ctr (36.1,40.2) — ~11 o'clock
       *   V2 (10×20.4   at 51.2,34.2) → ctr (56.2,44.4) — ~1  o'clock
       *   V3 (16.6×18.1 at 60.5,48.6) → ctr (68.8,57.7) — ~2  o'clock
       *   V4 (10.5×8    at 63.9,68.4) → ctr (69.2,72.4) — ~3  o'clock
       */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: 305 /* px */,
          top: -28 /* px */,
          width: 98,
          height: 97,
          transform: 'rotate(0.4deg)',
        }}
      >
        <svg width="98" height="97" viewBox="0 0 98 97" aria-hidden="true">
          <g fill="white" fillOpacity="0.5">
            {/* V5 → (19.7,50.9): nearly straight up (~12 o'clock) */}
            <path d="M23.5,80 L26.5,80 L21.2,51 L18.2,51Z" />
            {/* V1 → (36.1,40.2): upper, slightly right (~11-12 o'clock) */}
            <path d="M23.7,79.4 L26.3,80.6 L37.4,40.7 L34.6,39.3Z" />
            {/* V2 → (56.2,44.4): upper-right (~1 o'clock) */}
            <path d="M23.9,79 L26.1,81 L57.2,44.9 L54.8,43.1Z" />
            {/* V3 → (68.8,57.7): rightward, slightly up (~2 o'clock) */}
            <path d="M24.2,78.8 L25.8,81.2 L69.4,58.9 L68.6,56.1Z" />
            {/* V4 → (69.2,72.4): nearly horizontal right (~3 o'clock) */}
            <path d="M24.8,78.5 L25.2,81.5 L69.2,73.7 L68.8,70.7Z" />
          </g>
        </svg>
      </div>

      {/* ── 7. Photo card 2 — standalone, gold border, middle-right ── */}
      {/* Figma: 338.1×338.1, stroke=#eedeb8@10, rot=0.1°. Panel pos: (344, 271). */}
      <ProfilePhotoCard
        photo={loginPhoto2}
        borderColor="#eedeb8"
        width={338}
        left={344}
        top={271}
        rotation={0.1}
      />

      {/* ── 8. Photo card 1 — large, pink border, top-left [Group 2] ── */}
      {/* Figma: 374.5×374.5, stroke=#ebc2bd@10, rot=-0.1°. Panel pos: (36, 27). */}
      <ProfilePhotoCard
        photo={loginPhoto1}
        borderColor="#ebc2bd"
        width={374}
        left={36}
        top={27}
        rotation={-0.1}
      />

      {/* ── 9. Data Protected card — panel (25, 335) [Group 2] ── */}
      {/*
       * Figma 2329:3979: 267.6×64, fill=#ebf1ec, stroke=#fffefc@1, r=13.
       * Inner: MTN box (36×36, #387440, r=9) + text column.
       * "Data Protected": fs=12, fw=700, fill=#595959.
       * "Encrypted · Never shared without consent": fs=10, fw=400, fill=#595959, opacity=0.72.
       */}
      <div
        className="absolute rounded-[13px] bg-[#EBF1EC]"
        style={{
          left: 25 /* px — Figma panel-relative x */,
          top: 335 /* px — Figma: 334.9px */,
          width: 268,
          outline: '1px solid #FFFEFC',
          outlineOffset: '-1px',
          padding: '14px 13px' /* px — derived from container 267.6×64, content 240.5×36 */,
          boxShadow: '0 16px 24px -6px rgba(27,36,44,0.16), 0 2px 2px -1px rgba(27,36,44,0.04)',
        }}
      >
        <div className="flex items-center gap-2.25">
          {/* MTN icon box — 36×36, fill=#387440, r=9 */}
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-green text-white">
            {/* Shield + check — hand-crafted 18×18 */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M9 1.5l6.5 2.5v4c0 4-2.5 6.5-6.5 8-4-1.5-6.5-4-6.5-8V4L9 1.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 9l1.7 1.7L11.5 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-[12px] font-bold leading-3.75 text-[#595959]">Data Protected</p>
            <p className="text-[10px] leading-3.5 text-[#595959]" style={{ opacity: 0.72 }}>
              Encrypted · Never shared without consent
            </p>
          </div>
        </div>
      </div>

      {/* ── 10. Compliance pill — panel (410, 209) [Group 2] ── */}
      {/*
       * Figma: 276.6×40, fill=#ffffff, stroke=#000000@1 op=0.06, r=10,
       *   pad=L10R10T8B8, gap=10, VERTICAL layout.
       * Panel pos: left=410, top=209. right = 739-410-276.6 = 52.4px.
       * Content: check-circle icon (14×14) + "Ghana Data Protection Act compliant"
       *   (fs=14, fw=600, fill=#387440).
       */}
      <div
        className="absolute inline-flex items-center gap-2 rounded-md bg-white"
        style={{
          left: 410 /* px */,
          top: 209 /* px — Figma 208.9px */,
          padding: '8px 10px' /* Figma pad L10R10T8B8 */,
          border: '1px solid rgba(0,0,0,0.06)' /* stroke=#000000@1 op=0.06 */,
          boxShadow: '0 2px 2px -1px rgba(27,36,44,0.04), 0 8px 32px 0 rgba(0,0,0,0.10)',
        }}
      >
        {/* Check-circle 14×14 — hand-crafted */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="#387440" />
          <path
            d="M4.5 7l1.7 2 3.3-3.2"
            stroke="#387440"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="whitespace-nowrap text-[14px] font-semibold leading-6 text-brand-green"
          style={{ letterSpacing: '0.1px' }}
        >
          Ghana Data Protection Act compliant
        </span>
      </div>

      {/* ── 11. Verified profile card — panel (24, 586) [Group 2] ── */}
      {/*
       * Figma 2329:3986: 132.6×40, fill=#ffffff, r=10, pad=L10R10T8B8.
       * Frame 77 (112.6×24, gap=8, HORIZONTAL):
       *   SVG check (13.6×13.6) + "Verified profile" (fs=14, fw=600, fill=#387440).
       */}

      {/* ── 12. Photo card 3 — bottom-left, green border [Group 2] ── */}
      {/* Figma: 357.8×357.8, stroke=#c1d4c4@10, rot=0.1°. Panel pos: (45, 504). */}
      <ProfilePhotoCard
        photo={loginPhoto3}
        borderColor="#c1d4c4"
        width={358}
        left={45}
        top={504}
        rotation={0.1}
      />

      {/* ── 13a. Arrow "down, 33" — panel (88, 420), 95.1×96, opacity=0.5, rot=1.7° ── */}
      {/*
       * Figma 2353:13941: 3 vectors, all fill=#fffefc.
       * V1 59.3×47.9 at rel(25.2,14.9): large upper shape.
       * V2 36.8×36.5 at rel(10.6,42.3): medium lower-left.
       * V3 39.0×38.5 at rel(9.5,41.4): overlaps V2.
       * All are FILLED organic shapes (not stroke paths).
       */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: 88 /* px */,
          top: 420 /* px */,
          width: 95,
          height: 96,
          opacity: 0.5,
          transform: 'rotate(1.7deg)',
        }}
        aria-hidden="true"
      >
        <svg width="95" height="96" viewBox="0 0 95 96" aria-hidden="true">
          {/* V1 (59.3×47.9 at 25.2,14.9): large filled shape, upper portion */}
          <path
            d="M54,15 C76,17 85,35 84,62 C66,59 45,49 25,43 C27,28 38,15 54,15Z"
            fill="#fffefc"
          />
          {/* V2 (36.8×36.5 at 10.6,42.3): lower-left filled shape */}
          <path
            d="M28,42 C40,44 47,58 47,79 C36,79 16,68 11,56 C14,48 20,42 28,42Z"
            fill="#fffefc"
          />
          {/* V3 (39.0×38.5 at 9.5,41.4): overlapping V2 */}
          <path
            d="M25,41 C38,44 48,60 48,80 C37,80 14,68 9,55 C12,47 18,41 25,41Z"
            fill="#fffefc"
          />
        </svg>
      </div>

      {/* ── 13b. Arrow "arrows, 7" — panel (623, 598), 58.5×58.5, opacity=1, rot=-1.5° ── */}
      {/*
       * Figma 2353:13937: 3 vectors, all fill=#fbf4e0. Filled organic arrow shapes —
       * each is a calligraphic curved arrow: wide at the tail, tapering to a pointed tip.
       * Bounding boxes (relative to 58.5×58.5 container):
       *   V3 18.8×29.3 at (5.7,14.5)  — left, tall, points upward
       *   V2 23.0×24.3 at (26.1,6.0)  — upper-right, points upper-right
       *   V1 25.8×23.5 at (25.7,29.5) — lower-right, points upper-right
       */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: 623 /* px */,
          top: 598 /* px */,
          width: 58,
          height: 58,
          transform: 'rotate(-1.5deg)',
        }}
        aria-hidden="true"
      >
        <svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
          {/* V3 (18.8×29.3 at 5.7,14.5): curved arrow, wide tail at bottom, tip at top */}
          <path
            d="M6 44 C7 35 10 25 15 14 C17 12 20 12 20 14 C19 17 16 20 14 23 C10 31 8 38 7 43 Z"
            fill="#fbf4e0"
          />
          {/* V2 (23.0×24.3 at 26.1,6.0): curved arrow, tail at bottom-left, tip upper-right */}
          <path
            d="M26 30 C29 24 35 14 46 6 C48 5 49 6 49 8 C48 10 46 12 44 13 C37 17 32 24 29 29 Z"
            fill="#fbf4e0"
          />
          {/* V1 (25.8×23.5 at 25.7,29.5): curved arrow, tail at lower-left, tip upper-right */}
          <path
            d="M26 53 C30 47 36 39 49 31 C51 30 52 30 52 32 C51 34 49 36 47 37 C40 42 34 48 30 52 Z"
            fill="#fbf4e0"
          />
        </svg>
      </div>

      {/* ── 14. Adult/Youth experience card — panel (446, 643) ── */}
      {/*
       * Figma: Background+Border+Shadow+OverlayBlur, 235.1×102, fill=#ffffff/0.92,
       *   stroke=#e6e6e6@1, r=16, pad=L21R21T16B16, BACKGROUND_BLUR(r=16).
       * right = 739-446.3-235.1 = 57.6px. top = 643px.
       * Row 1 (active): Frame 35 (193.1×32, fill=#e1eae2, r=6, gap=9, pad L8R8T8B8)
       *   → green dot (6×6, #387440) + "Adult experience" (fs=12, fw=600?, fill=#387440)
       * Row 2 (inactive): Frame 36 (193.1×28, fill=#e7e7e7, r=6, gap=9, pad L8R8T6B6)
       *   → grey dot (6×6, #575755) + "Youth experience" (fs=12, fw=400, fill=#959592)
       */}
      <div
        className="absolute flex flex-col gap-2.5 rounded-[16px]"
        style={{
          left: 446 /* px — Figma 446.3px */,
          top: 643 /* px */,
          width: 235,
          padding: '16px 21px' /* Figma pad L21R21T16B16 */,
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid #e6e6e6',
          boxShadow: '0 2px 2px -1px rgba(27,36,44,0.04), 0 16px 44px 0 rgba(0,0,0,0.12)',
          backdropFilter: 'blur(16px)' /* BACKGROUND_BLUR r=16 */,
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Active row — fill=#e1eae2 pill */}
        <div
          className="flex items-center gap-2.25 rounded-sm"
          style={{ background: '#e1eae2', padding: '8px' }}
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: '#387440' }}
          />
          <span className="text-[12px] font-semibold leading-tight text-brand-green">
            Adult experience
          </span>
        </div>
        {/* Inactive row — fill=#e7e7e7 pill */}
        <div
          className="flex items-center gap-2.25 rounded-sm"
          style={{ background: '#e7e7e7', padding: '6px 8px' }}
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: '#575755' }}
          />
          <span className="text-[12px] font-normal leading-tight text-neutral-dark-hover">
            Youth experience
          </span>
        </div>
      </div>

      {/* ── 15. Watch Tutorial — panel (471, 802), size=211×76 ── */}
      {/*
       * Figma 2329:4008: 'Watch tutorial component', 211×76.
       * right = 739-471-211 = 57px. bottom = 916-802-76 = 38px.
       */}
      {/*
       * Figma 2329:4008: 'Background+Border+Shadow' label frame has opacity=0.00
       * → label is invisible. Only 'Frame 145' circular button (72×72) is shown.
       * Use showLabel={false} to match Figma exactly.
       */}
      <div className="absolute" style={{ right: 57 /* px */, bottom: 38 /* px */ }}>
        <WatchTutorial
          showLabel={false}
          onClick={() => log('watch tutorial clicked')}
          aria-label="Watch onboarding tutorial"
        />
      </div>
    </aside>
  );
};

// ---- options ----------------------------------------------------------

const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

const NATIONALITY_OPTIONS = [
  { value: 'ghanaian', label: 'Ghanaian' },
  { value: 'nigerian', label: 'Nigerian' },
  { value: 'ivorian', label: 'Ivorian' },
  { value: 'togolese', label: 'Togolese' },
  { value: 'beninese', label: 'Beninese' },
  { value: 'burkinabe', label: 'Burkinabé' },
  { value: 'other', label: 'Other' },
];

// ---- page -------------------------------------------------------------

const OnboardingPersonalInfoPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [ghanaCardId, setGhanaCardId] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);

  const handlePhotoSelect = (file) => {
    log('photo selected:', file.name, file.size);
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const passwordsMatch = password.length > 0 && password === retypePassword;
  const passwordMismatch =
    hasSubmittedOnce && retypePassword.length > 0 && password !== retypePassword;
  const passwordMatchHint =
    retypePassword.length > 0 && passwordsMatch ? 'Passwords match' : undefined;

  const isValid = useMemo(
    () =>
      Boolean(profilePhoto) &&
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      gender !== '' &&
      nationality !== '' &&
      ghanaCardId.trim().length > 0 &&
      password.length >= 8 &&
      passwordsMatch,
    [profilePhoto, firstName, lastName, gender, nationality, ghanaCardId, password, passwordsMatch]
  );

  log('state', { isValid, isSubmitting, hasSubmittedOnce });

  /*
   * CTA label: "Fill In Your Details" while the form is incomplete;
   * flips to "Save & Continue" once all fields are valid (or submitting).
   */
  const ctaLabel = isValid || isSubmitting ? 'Save & Continue' : 'Fill In Your Details';

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmittedOnce(true);
    if (!isValid || isSubmitting) {
      log('submit blocked — invalid or submitting');
      return;
    }
    log('submit', { firstName, lastName, gender, nationality });
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 900);
  };

  const handleContinue = () => {
    setShowSuccess(false);
    log('continue → /onboarding/talent/contact');
    navigate('/onboarding/talent/contact');
  };

  const getGenderLabel = (v) => GENDER_OPTIONS.find((o) => o.value === v)?.label || '—';
  const getNationalityLabel = (v) => NATIONALITY_OPTIONS.find((o) => o.value === v)?.label || '—';
  const maskedId = ghanaCardId
    ? `${ghanaCardId.slice(0, 4)}-${'•'.repeat(Math.max(0, ghanaCardId.length - 4))}`
    : '—';

  const summary = [
    { label: 'Full Name', value: `${firstName} ${lastName}`.trim(), icon: <SummaryUserIcon /> },
    { label: 'Gender', value: getGenderLabel(gender), icon: <SummaryUserIcon /> },
    { label: 'Nationality', value: getNationalityLabel(nationality), icon: <SummaryFlagIcon /> },
    { label: 'Id Document', value: maskedId, icon: <SummaryIdIcon /> },
    { label: 'Profile Picture', value: '__uploaded__', icon: <SummaryPhotoIcon /> },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] flex-col bg-white">
      <OnboardingHeader currentKey="profile" percent={78} />

      <section className="flex flex-1">
        {/* Left form column */}
        <div className="relative flex flex-1 items-start justify-center px-6 pt-12 pb-12 md:pt-14">
          {/*
           * Ellipse 2 — Figma 2329:3899.
           * 571×571, border-radius=571px, opacity=0.6, filter=blur(100px).
           * Background: linear-gradient(180deg, #387440 0%, rgba(56,116,64,0.27) 50.96%, #69DA78 100%).
           * top=0 keeps the orb within the page section — does not extend into the nav bar.
           * left=-110px bleeds off-screen left so the visible glow is centred on the upper-left column.
           */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: -110 /* px */,
              top: -178 /* px — section top; orb stays within the page, not the nav */,
              width: 571,
              height: 571,
              borderRadius: '571px',
              background:
                'linear-gradient(180deg, #387440 0%, rgba(56, 116, 64, 0.27) 50.96%, #69DA78 100%)',
              opacity: 0.6,
              filter: 'blur(200px)',
            }}
          />
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-174.5 flex-col items-center gap-6 text-center"
            noValidate
          >
            {/* Eyebrow — pencil glyph + "Build Your Profile" label */}
            <span
              className="inline-flex items-center gap-1.5 rounded-sm border border-brand-green-light-active bg-brand-green-light px-3 py-1.5"
              style={{ outline: '1px solid #387440', outlineOffset: '-1px' }}
            >
              <PencilEditIcon />
              <span
                className="text-[12px] leading-4.5 text-brand-green"
                style={{ letterSpacing: '0.2px' }}
              >
                Build Your Profile
              </span>
            </span>

            <h1
              className="font-display font-normal text-black"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              Tell us about <span className="italic text-brand-green">yourself.</span>
            </h1>

            <p
              className="max-w-120.5 text-[16px] leading-6 text-content-helper"
              style={{ letterSpacing: '0.2px' }}
            >
              This builds your trusted identity on GTH seen by schools, companies, and opportunities
              matched to you. All fields marked with * are required.
            </p>

            <WavyDivider />

            {/* Form grid — Profile Photo spans both columns */}
            <div className="grid w-full grid-cols-1 gap-x-5 gap-y-5 text-left md:grid-cols-2">
              <div className="md:col-span-2">
                <ProfilePhotoField
                  file={profilePhoto}
                  previewUrl={photoPreview}
                  onChange={handlePhotoSelect}
                />
              </div>

              <TextInput
                label="First Name"
                required
                placeholder="Enter your first name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                leftIcon={<UserIcon />}
              />
              <TextInput
                label="Middle Name"
                optional
                placeholder="Enter your middle name"
                autoComplete="additional-name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                leftIcon={<UserIcon />}
              />
              <TextInput
                label="Last Name"
                required
                placeholder="Enter your last name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                leftIcon={<UserIcon />}
              />
              <Select
                label="Gender"
                placeholder="Select your gender"
                options={GENDER_OPTIONS}
                value={gender}
                onChange={setGender}
              />
              <Select
                label="Nationality"
                placeholder="Select your Nationality"
                options={NATIONALITY_OPTIONS}
                value={nationality}
                onChange={setNationality}
                leftIcon={<GlobeIcon />}
                searchable
              />
              <TextInput
                label="Ghana Card / Student ID"
                required
                placeholder="GHA- 0000-000-000"
                value={ghanaCardId}
                onChange={(e) => setGhanaCardId(e.target.value)}
                leftIcon={<IdCardIcon />}
              />
              <TextInput
                label="Password"
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<LockIcon />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="text-content-tertiary"
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                }
              />
              <TextInput
                label="Retype Password"
                required
                type={showRetypePassword ? 'text' : 'password'}
                placeholder="Create a password"
                autoComplete="new-password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                error={passwordMismatch ? "Passwords don't match" : undefined}
                successText={passwordMatchHint}
                leftIcon={<LockIcon />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowRetypePassword((s) => !s)}
                    aria-label={showRetypePassword ? 'Hide password' : 'Show password'}
                    className="text-content-tertiary"
                  >
                    {showRetypePassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isValid || isSubmitting}
              state={isSubmitting ? 'active' : undefined}
              leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
              rightIcon={<ArrowRightIcon />}
              className="mt-2 w-full max-w-[420px]"
              aria-busy={isSubmitting}
            >
              {ctaLabel}
            </Button>

            <div className="flex items-center gap-2 text-[14px] leading-6">
              <span className="text-content-helper" style={{ letterSpacing: '0.2px' }}>
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
          </form>
        </div>

        <ProfileRightPanel />
      </section>

      {showSuccess && (
        <IdentityCapturedModal
          summary={summary}
          onClose={() => setShowSuccess(false)}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default OnboardingPersonalInfoPage;
