import { useEffect } from 'react';
import Button from '../../ui/Button.jsx';
import { ArrowRightIcon, CloseIcon, ShieldCheckIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('TermsAcceptedModal');

/*
 * TermsAcceptedModal — shown after the user checks all 3 required agreements
 * and clicks the Activate CTA on the Activate Account step (step 3 of 8).
 *
 * Figma frames: 2977:84878 (base), variants 84882 / 84886 / 84892 / 84893 /
 * 84894 / 84920 / 84924.
 *
 * Structure:
 *   • Fixed overlay (z-50, bg-black/50)
 *   • Close ✕ button — absolutely positioned top-right (user requirement)
 *   • Icon badge (64×64 bg-[#e1eae2] rounded-[10px] with 28×28 checkmark)
 *   • Title "Terms Accepted" (Instrument Serif)
 *   • Subtitle
 *   • Consent record table (3 rows)
 *   • Progress divider (green pill, 4px)
 *   • "I'm Ready →" CTA
 *   • Trust badge
 *
 * Props:
 *   onClose    {function}  Called when ✕ or backdrop is clicked (ESC also fires it).
 *   onConfirm  {function}  Called when "I'm Ready →" is clicked.
 */

// ── local icons ────────────────────────────────────────────────────────────

// 28×28 checkmark used inside the modal icon badge (heavier than SuccessCheckIcon).
const ModalCheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path
      d="M7 14.5L11.5 19L21 9.5"
      stroke="#387440"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 14×14 checkbox tick used in each consent row.
const RowCheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect width="14" height="14" rx="4" fill="#387440" />
    <path
      d="M3.5 7.25L6 9.75L10.5 5"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── consent rows data ──────────────────────────────────────────────────────

const CONSENT_ROWS = [
  { label: 'Terms & Conditions' },
  { label: 'Privacy Policy' },
  { label: 'Data Consent & Use Policy' },
];

// ── main component ─────────────────────────────────────────────────────────

const TermsAcceptedModal = ({ onClose, onConfirm }) => {
  log('mount');

  // ── keyboard dismiss ──────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        log('escape key — closing modal');
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      log('backdrop click — closing modal');
      onClose?.();
    }
  };

  const handleConfirm = () => {
    log("I'm Ready clicked — calling onConfirm");
    onConfirm?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-accepted-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-[440px] rounded-[24px] border-[3px] border-[#c1d4c4] bg-white p-10 shadow-xl"
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

        {/* ── Header ── */}
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          {/* Icon badge */}
          <div
            className="flex size-[64px] shrink-0 items-center justify-center rounded-[10px]"
            style={{
              background: '#e1eae2',
              boxShadow: '0 2px 8px rgba(56,116,64,0.14)',
            }}
          >
            <ModalCheckIcon />
          </div>

          <div className="flex flex-col gap-1">
            <h2
              id="terms-accepted-title"
              className="font-display font-normal text-black"
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                lineHeight: 1.15,
                letterSpacing: '-1.2px',
              }}
            >
              Terms <span className="italic text-brand-green">Accepted</span>
            </h2>
            <p
              className="font-sans font-normal text-[#959592]"
              style={{ fontSize: '12px', lineHeight: 1.5 }}
            >
              You've agreed to all 3 required documents and reviewed your summary form. Here&apos;s
              your consent record.
            </p>
          </div>
        </div>

        {/* ── Consent record table ── */}
        <div
          className="mb-5 overflow-hidden rounded-[16px] border"
          style={{
            background: 'rgba(235,241,236,0.3)',
            borderColor: 'rgba(0,0,0,0.07)',
          }}
        >
          {CONSENT_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={[
                'flex items-center justify-between px-4 py-3',
                i < CONSENT_ROWS.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : '',
              ].join(' ')}
            >
              <span className="inline-flex items-center gap-2">
                <RowCheckIcon />
                <span
                  className="font-sans font-semibold text-brand-green"
                  style={{ fontSize: '10px', letterSpacing: '0.4px' }}
                >
                  {row.label}
                </span>
              </span>
              <span className="font-sans text-[10px] text-[#babab7]" aria-label="Confirmed">
                —
              </span>
            </div>
          ))}
        </div>

        {/* ── Progress divider ── */}
        <div className="mb-5 h-[4px] w-full rounded-[4px] bg-[#ebf1ec]" />

        {/* ── CTA ── */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleConfirm}
          rightIcon={<ArrowRightIcon />}
          className="w-full"
        >
          I&apos;m Ready
        </Button>

        {/* ── Trust badge ── */}
        <div className="mt-3.5 flex items-center justify-center gap-1.5">
          <ShieldCheckIcon className="text-brand-green" />
          <span className="font-sans text-[10px] text-[#959592]">
            Data encrypted at rest · Ghana Data Protection Act compliant
          </span>
        </div>
      </div>
    </div>
  );
};

export default TermsAcceptedModal;
