import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import {
  ArrowRightIcon,
  MapIcon,
  PersonIcon,
  ShieldIcon,
  CloseIcon,
} from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentIdentityCapturedModal');

/*
 * ParentIdentityCapturedModal — success confirmation shown after the parent
 * submits the "Parent Identity" form (step 1 of 8 in the parent sign-up wizard).
 *
 * Figma node: 2920:88190. Amber colour scheme, not green.
 *
 * Visual structure:
 *   • Fixed full-screen overlay (bg-black/40)
 *   • Centred white card: max-w-[440px], rounded-3xl, p-8
 *     – Amber check icon box (52×52, #faf4e8, rounded-[10px])
 *     – Caption pill: "Parent Identity  complete" (#999, amber border/dot)
 *     – Headline: "Identity captured." (italic amber "captured.")
 *     – Subtitle (2 lines, #959592)
 *     – Summary card: 5 data rows on amber-tinted bg (#faf4e8/50, border #eedeb8)
 *         Full Name / Relationship / Gender / Nationality / Date of Birth
 *     – CTA: green "Continue To Verification Details →"
 *     – Footer: "Data encrypted · Ghana Data Protection Act compliant"
 *
 * Props:
 *   data    {object}  Submitted form values: firstName, middleName, lastName,
 *                     relationship, gender, nationality, dateOfBirth.
 *   onClose {function} Called when the user dismisses (backdrop click or ESC).
 */

// ── nationality → flag emoji map ──────────────────────────────────────────
const NATIONALITY_FLAGS = {
  Ghanaian: '🇬🇭',
  Nigerian: '🇳🇬',
  Ivorian: '🇨🇮',
  Togolese: '🇹🇬',
  Burkinabé: '🇧🇫',
  Beninese: '🇧🇯',
  Liberian: '🇱🇷',
  'Sierra Leonean': '🇸🇱',
  Senegalese: '🇸🇳',
  Gambian: '🇬🇲',
  Malian: '🇲🇱',
  Guinean: '🇬🇳',
  Cameroonian: '🇨🇲',
  Kenyan: '🇰🇪',
  'South African': '🇿🇦',
  American: '🇺🇸',
  British: '🇬🇧',
  Canadian: '🇨🇦',
  French: '🇫🇷',
  German: '🇩🇪',
  Chinese: '🇨🇳',
  Indian: '🇮🇳',
};

// ── inline icons ──────────────────────────────────────────────────────────

/* 28×28 green checkmark for the top icon box */
const CheckIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className="size-7">
    <path
      d="M5.5 14.75l7 7L22 7"
      stroke="#387440"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Payment/card icon for the Date of Birth row (Figma 2920:89436 — 20-card) */
const CardRowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="12"
    viewBox="0 0 15 12"
    fill="none"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 2.2C0 0.984974 0.984974 0 2.2 0H12.2C13.415 0 14.4 0.984974 14.4 2.2V9C14.4 10.215 13.415 11.2 12.2 11.2H2.2C0.984974 11.2 0 10.215 0 9V2.2ZM2.2 1.2C1.64772 1.2 1.2 1.64772 1.2 2.2V4H13.2V2.2C13.2 1.64772 12.7523 1.2 12.2 1.2H2.2ZM13.2 5.2H1.2V9C1.2 9.55229 1.64772 10 2.2 10H12.2C12.7523 10 13.2 9.55229 13.2 9V5.2ZM2.4 7.8C2.4 7.46863 2.66863 7.2 3 7.2H5.8C6.13137 7.2 6.4 7.46863 6.4 7.8C6.4 8.13137 6.13137 8.4 5.8 8.4H3C2.66863 8.4 2.4 8.13137 2.4 7.8Z"
      fill="currentColor"
    />
  </svg>
);

/* 12×12 amber check-circle used in the DOB value cell (Figma 2920:89439 — 20-check-circle, #a07715) */
const SmallCheckCircle = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="size-3 shrink-0">
    <circle cx="6" cy="6" r="5" stroke="#a07715" strokeWidth="1.2" />
    <path
      d="M3.5 6.3l1.8 1.8 3.2-4"
      stroke="#a07715"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── data row ──────────────────────────────────────────────────────────────
/*
 * Figma: label on the left (12px, #575755, regular, tracking 0.2px),
 * value on the right (12px, #a07715, semibold, tracking 0.2px).
 * Separated by a 1px #e1eae2 bottom border.
 * rightPrefix: optional ReactNode rendered inline-left of the value (used for DOB check circle).
 */
const DataRow = ({ label, value, leftIcon, rightPrefix }) => (
  <div className="flex items-center justify-between border-b border-[#e1eae2] py-[9px] last:border-b-0">
    <span
      className="flex items-center gap-3 font-sans text-[12px] text-[#575755]"
      style={{ letterSpacing: '0.2px', lineHeight: '18px' }}
    >
      {leftIcon && <span className="inline-flex shrink-0 text-[#a07715]">{leftIcon}</span>}
      {label}
    </span>
    <span
      className="flex items-center gap-2 font-sans text-[12px] font-semibold text-[#a07715] text-right"
      style={{ letterSpacing: '0.2px', lineHeight: '20px' }}
      title={value}
    >
      {rightPrefix}
      {value || <span className="font-normal italic text-[#babab7]">—</span>}
    </span>
  </div>
);

// ── main component ────────────────────────────────────────────────────────

const ParentIdentityCapturedModal = ({ data, onClose }) => {
  const fullName = [data?.firstName, data?.middleName, data?.lastName].filter(Boolean).join(' ');
  const flagEmoji = data?.nationality ? (NATIONALITY_FLAGS[data.nationality] ?? '🌍') : null;

  log('mount', { fullName, relationship: data?.relationship });

  const navigate = useNavigate();

  const handleContinue = () => {
    log('continue clicked — navigating to verification step');
    navigate('/onboarding/parent-verification');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      log('backdrop click — closing modal');
      onClose?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      log('escape key — closing modal');
      onClose?.();
    }
  };

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-identity-captured-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-[440px] overflow-y-auto rounded-3xl bg-white p-8"
        style={{
          maxHeight: '90vh',
          boxShadow:
            '0px 24px 64px 0px rgba(0,0,0,0.12), 0px 4px 0px 0px rgba(0,0,0,0.07), 0px 0px 0px 1px rgba(0,0,0,0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close button ── */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            log('close button clicked');
            onClose?.();
          }}
          className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full bg-[#ebf1ec] text-[#387440] transition-colors duration-100 hover:bg-[#d4e4d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
        >
          <CloseIcon />
        </button>

        {/* ── Check icon box (Figma 2920:89409) ── */}
        {/* bg-[#faf4e8], rounded-[10px], drop-shadow */}
        <div
          className="mx-auto mb-5 flex size-[52px] items-center justify-center rounded-[10px]"
          style={{
            backgroundColor: '#faf4e8',
            boxShadow: '0px 1px 1px rgba(27,36,44,0.12)',
          }}
        >
          <CheckIcon />
        </div>

        {/* ── Caption pill (Figma 2920:89412) ── */}
        {/* "Parent Identity  complete" — amber dot + #999 text */}
        <div
          className="mx-auto mb-4 flex w-fit items-center gap-[6px] rounded-[6px] border bg-[rgba(250,244,232,0.5)] px-8 py-2.5"
          style={{ borderColor: '#eedeb8' }}
        >
          <span
            className="shrink-0 rounded-full"
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              backgroundColor: '#eedeb8',
              border: '1.5px solid #b48617',
              boxShadow: '0px 0px 4px 0px #f5c451',
            }}
          />
          <span
            className="font-sans text-[12px] text-[#999]"
            style={{ letterSpacing: '0.2px', lineHeight: '18px' }}
          >
            Parent Identity complete
          </span>
        </div>

        {/* ── Headline (Figma 2920:89415) ── */}
        <h2
          id="parent-identity-captured-title"
          className="mb-2 text-center font-display font-normal text-black"
          style={{ fontSize: 32, lineHeight: 1, letterSpacing: '-1.2px' }}
        >
          Identity{' '}
          <span className="italic" style={{ color: '#b48617' }}>
            captured.
          </span>
        </h2>

        {/* ── Subtitle (Figma 2920:89416) ── */}
        <p
          className="mb-5 text-center font-sans text-[12px]"
          style={{ color: '#959592', letterSpacing: '0.2px', lineHeight: '18px' }}
        >
          Your personal information is saved and encrypted.
          <br />
          Here&apos;s a summary of what we stored.
        </p>

        {/* ── Summary card (Figma 2920:89417) ── */}
        <div
          className="mb-5 rounded-[16px] border p-4"
          style={{ borderColor: '#eedeb8', backgroundColor: 'rgba(250,244,232,0.5)' }}
        >
          {/* Row 1: Full Name */}
          <DataRow leftIcon={<PersonIcon />} label="Full Name" value={fullName} />
          {/* Row 2: Relationship */}
          <DataRow leftIcon={<PersonIcon />} label="Relationship" value={data?.relationship} />
          {/* Row 3: Gender */}
          <DataRow leftIcon={<PersonIcon />} label="Gender" value={data?.gender} />
          {/* Row 4: Nationality — flag emoji as left icon */}
          <DataRow
            leftIcon={
              flagEmoji ? (
                <span
                  className="inline-flex items-center justify-center rounded-[4px] bg-white text-[10px] leading-none"
                  style={{ width: 14, height: 14 }}
                >
                  {flagEmoji}
                </span>
              ) : (
                <MapIcon />
              )
            }
            label="Nationality"
            value={data?.nationality}
          />
          {/* Row 5: Date of Birth — 20-card left icon (Figma 2920:89436), check-circle on value */}
          <DataRow
            leftIcon={<CardRowIcon />}
            label="Date of Birth"
            value={data?.dateOfBirth}
            rightPrefix={data?.dateOfBirth ? <SmallCheckCircle /> : null}
          />
        </div>

        {/* ── CTA (Figma 2920:89451) ── */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleContinue}
          rightIcon={<ArrowRightIcon />}
          className="w-full"
        >
          Continue To Verification Details
        </Button>

        {/* ── Footer ── */}
        <div className="mt-3.5 flex items-center justify-center gap-1">
          <ShieldIcon className="text-brand-green" />
          <span className="text-[10px] text-neutral-dark-hover">
            Data encrypted at rest · Ghana Data Protection Act compliant
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParentIdentityCapturedModal;
