import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import {
  ArrowRightIcon,
  MapPinIconTwo,
  PersonIcon,
  LocationIcon,
  ShieldIcon,
  CloseIcon,
} from '../../shared/assets.jsx';
import Captions from '../../ui/Captions.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('IdentityCapturedModal');

/*
 * IdentityCapturedModal — success confirmation shown after the institution
 * admin successfully submits the "Your Institution" form (step 1 of 8).
 *
 * Figma nodes: 2972:75943 (main), 2972:75950/75953/75956/75957/75958/75990/75995/75996 (states).
 *
 * Visual structure:
 *   • Fixed full-screen dark overlay (bg-black/50)
 *   • Centred white card: max-w-[600px], rounded-3xl, p-10
 *   • Header row: 62×62 brand-green-light icon box (rounded-2xl) + title + subtitle
 *   • Data table: 5 rows separated by hairline dividers (institution identity)
 *   • Footer: "Continue To Contact Details" primary CTA → /onboarding/institution/contact
 *
 * Props:
 *   data    {object}  Submitted form values: legalName, tradingName,
 *                     institutionType, region, district.
 *   onClose {function} Called when the user dismisses (ESC or backdrop click).
 *                      In the onboarding flow this is rarely used — the primary
 *                      action is the Continue button — but it's provided for
 *                      accessibility and future flexibility.
 */

// ── check icon (24×24, inherits currentColor) ────────────────────────────
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6 text-brand-green">
    <path
      d="M4.5 12.75l6 6 9-13.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── data table row ────────────────────────────────────────────────────────
const DataRow = ({ label, value, leftIcon }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#e6e6e6] last:border-b-0">
    <span
      className="font-sans text-[12px] lg:text-[14px] flex items-center leading-5 text-neutral-darker"
      style={{ letterSpacing: '0.1px' }}
    >
      <span>{leftIcon && <span className="inline-flex mr-2 size-4">{leftIcon}</span>}</span>
      {label}
    </span>
    <span
      className="font-sans  text-[12px] lg:text-[14px] font-semibold leading-5 text-brand-green text-right max-w-[56%] truncate"
      style={{ letterSpacing: '0.1px' }}
      title={value}
    >
      {value || <span className="font-normal text-[#babab7] italic">—</span>}
    </span>
  </div>
);

// ── main component ────────────────────────────────────────────────────────

const IdentityCapturedModal = ({ data, onClose }) => {
  log('mount', { legalName: data?.legalName, region: data?.region });

  const navigate = useNavigate();

  const handleContinue = () => {
    log('continue clicked — navigating to contact step');
    navigate('/onboarding/institution/contact');
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      log('backdrop click — closing modal');
      onClose?.();
    }
  };

  // Close on Escape
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
      aria-labelledby="identity-captured-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-[440px] rounded-3xl bg-white p-10 shadow-xl"
        /* Prevent backdrop click from closing when clicking inside the card */
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close button (✕) — absolutely positioned top-right ── */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            log('close button clicked');
            onClose?.();
          }}
          className="absolute right-5 top-5 inline-flex size-[28px] items-center justify-center rounded-[20px] bg-[#ebf1ec] text-[#387440] transition-colors duration-100 hover:bg-[#d4e4d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
        >
          <CloseIcon />
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-col items-center gap-4">
          {/* Icon box — 62×62, brand-green-light bg, rounded-2xl */}
          <div className="flex size-[62px] shrink-0 items-center justify-center rounded-2xl bg-brand-green-light">
            <CheckIcon />
          </div>

          <div className="flex flex-col items-center gap-1">
            <Captions
              className="w-fit "
              labelClassName="text-[#999999]"
              items={[{ label: 'Institution Setup' }]}
            />

            {/* Title */}
            <h2
              id="identity-captured-title"
              className="font-display font-normal text-center text-black"
              style={{
                fontSize: 'clamp(1.375rem, 2.2vw, 32px)' /* 22–32px */,
                lineHeight: 1.2,
                letterSpacing: '-0.28px',
              }}
            >
              Identity <span className="text-brand-green italic">captured.</span>
            </h2>

            {/* Subtitle */}
            <p
              className="font-sans text-[14px] leading-5 text-center text-[#959592]"
              style={{ letterSpacing: '0.1px' }}
            >
              Your Institutional information is saved and encrypted. Here&apos;s a summary of what
              we stored.
            </p>
          </div>
        </div>

        {/* Data table — 5 rows */}
        <div className="mb-4 rounded-[16px] bg-[#EBF1EC]/30 border border-brand-green-light-hover p-4 ">
          <DataRow
            leftIcon={<PersonIcon className="text-brand-green" />}
            label="Institution Name"
            value={data?.legalName}
          />
          <DataRow
            leftIcon={<PersonIcon className="text-brand-green" />}
            label="Trading Name"
            value={data?.tradingName || null}
          />
          <DataRow
            leftIcon={<PersonIcon className="text-brand-green" />}
            label="Institution Type"
            value={data?.institutionType}
          />
          <DataRow
            leftIcon={<LocationIcon className="text-brand-green" />}
            label="Region"
            value={data?.region}
          />
          <DataRow
            leftIcon={<MapPinIconTwo className="text-brand-green" />}
            label="District"
            value={data?.district}
          />
        </div>

        {/* divider */}
        <div className="w-full h-[3px] mb-4 bg-brand-green-light" />

        {/* CTA */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleContinue}
          rightIcon={<ArrowRightIcon />}
          className="w-full"
        >
          Continue To Contact Details
        </Button>

        <div className="flex items-center justify-center mt-3.5 gap-1">
          <ShieldIcon className="text-brand-green" />
          <span className="text-[10px] text-neutral-dark-hover ">
            Data encrypted at rest · Ghana Data Protection Act compliant
          </span>
        </div>
      </div>
    </div>
  );
};

export default IdentityCapturedModal;
