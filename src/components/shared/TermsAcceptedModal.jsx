import { CloseIcon, SuccessCheckIcon, ArrowRightIcon, ShieldCheckIcon } from './assets.jsx';
import Button from '../ui/Button.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('TermsAcceptedModal');

/*
 * TermsAcceptedModal — centered success card that mounts after the
 * user accepts all three legal modals and clicks the page's primary
 * CTA. Source: Figma node 2837:27365.
 *
 * Mirrors the IdentityCapturedModal / AddressConfirmedModal pattern
 * with a 64×64 green check badge, dual-font headline ("Terms"
 * regular + "Accepted" italic green), a 3-row consent record card,
 * and a "Continue" CTA that drops back to the onboarding flow.
 */

const RECORD_ROWS = [
  { key: 'terms', label: 'Terms & Conditions' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'consent', label: 'Data Processing Consent' },
];

const TermsAcceptedModal = ({ onClose, onContinue }) => {
  log('mount');
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-accepted-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(17,17,17,0.7)' }}
    >
      <div
        className="relative w-full max-w-[440px] rounded-[24px] bg-white px-10 py-10"
        style={{
          border: '3px solid #C1D4C4',
          boxShadow:
            '0 24px 64px rgba(0,0,0,0.12), 0 4px 0 rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full bg-brand-green-light text-[#575755] transition-colors hover:bg-brand-green-light-active"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="flex size-16 items-center justify-center rounded-[10px] bg-brand-green-light-active"
            style={{ boxShadow: '0px 1px 1px rgba(27,36,44,0.12)' }}
          >
            <SuccessCheckIcon />
          </span>

          <h2
            id="terms-accepted-title"
            className="font-display font-normal text-[#111111]"
            style={{ fontSize: 32, lineHeight: '32px', letterSpacing: '-1.2px' }}
          >
            Terms <span className="italic text-brand-green">Accepted.</span>
          </h2>

          <p
            className="text-[12px] leading-[18px] text-[#959592]"
            style={{ letterSpacing: '0.2px' }}
          >
            You&apos;ve agreed to all 3 required documents. Here&apos;s your consent record.
          </p>
        </div>

        {/* Consent record — three rows with green check pills */}
        <ul
          className="mt-5 flex flex-col rounded-[16px] border p-3"
          style={{
            background: 'rgba(235,241,236,0.3)',
            borderColor: '#E1EAE2',
          }}
        >
          {RECORD_ROWS.map((row, idx) => (
            <li
              key={row.key}
              className="flex items-center justify-between py-2 text-[12px]"
              style={
                idx < RECORD_ROWS.length - 1 ? { borderBottom: '1px solid #E1EAE2' } : undefined
              }
            >
              <span className="text-[#575755]">{row.label}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-brand-green">
                <svg
                  width="14.88"
                  height="14.88"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect width="16" height="16" rx="4" fill="#387440" />
                  <path
                    d="M4.5 8.4 7 10.8l4.5-5"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Accepted
              </span>
            </li>
          ))}
        </ul>

        {/* Progress bar — 100% (all three accepted) */}
        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-brand-green-light">
          <div className="h-full rounded-full bg-brand-green" style={{ width: '100%' }} />
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onContinue}
          rightIcon={<ArrowRightIcon />}
          className="mt-5 w-full"
        >
          Continue
        </Button>

        <p
          className="mt-3 flex items-center justify-center gap-1.5 text-[10px] leading-4 text-[#959592]"
          style={{ letterSpacing: '0.2px' }}
        >
          <ShieldCheckIcon className="text-[#959592]" />
          Data encrypted at rest · Ghana Data Protection Act compliant
        </p>
      </div>
    </div>
  );
};

export default TermsAcceptedModal;
