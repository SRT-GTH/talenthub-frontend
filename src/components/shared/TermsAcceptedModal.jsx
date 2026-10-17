import { useEffect, useRef } from 'react';
import { ArrowRightIcon } from './assets.jsx';
import Button from '../ui/Button.jsx';
import { debug } from '../../utils/debug.js';
import closeIcon from '../../assets/legal/accepted-close.svg';
import checkIcon from '../../assets/legal/accepted-check.svg';
import rowCheckIcon from '../../assets/legal/accepted-row-check.svg';
import shieldIcon from '../../assets/legal/accepted-shield.svg';

const log = debug('TermsAcceptedModal');

/*
 * TermsAcceptedModal - centred success card shown after the talent account is
 * activated. Figma 8027:213119 (card 8027:213480, 440x473):
 *   3px #C1D4C4 border, r24, 40px padding; 28px close (#EBF1EC, green X);
 *   64px #E1EAE2 check tile; Bricolage 32 headline "Terms" dark + "Accepted"
 *   (29px) green, NO full stop; 12/18 #959592 subcopy; consent-record card
 *   (green check chip + 10/16 600 green label + dash placeholder on the right);
 *   4px light progress track; green CTA; shield + 10/16 footer note.
 *
 * Figma copy/behaviour notes:
 *   - CTA reads "Im Ready " in Figma (with a static loader glyph). The e2e
 *     spec (tests/e2e/onboarding-adult.spec.js) clicks /continue/i here, so the
 *     label stays "Continue" until that regex is updated (REQUEST in notes).
 *   - The dash at the right of each row is the Figma value (the app holds no
 *     timestamp data). It is decorative; the green check chip carries meaning.
 *   - The progress track in Figma has no visible fill (fill colour == track).
 *
 * Props unchanged: onClose, onContinue. Focus moves in, Tab is trapped, Esc
 * closes, focus is restored on unmount.
 */

const RECORD_ROWS = [
  { key: 'terms', label: 'Terms & Conditions' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'consent', label: 'Data Processing Consent' },
];

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

const TermsAcceptedModal = ({ onClose, onContinue }) => {
  log('mount');
  const cardRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    cardRef.current?.focus({ preventScroll: true });
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        log('escape pressed, closing');
        onClose?.();
        return;
      }
      if (event.key !== 'Tab' || !cardRef.current) return;
      const nodes = Array.from(cardRef.current.querySelectorAll(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === cardRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (previous && typeof previous.focus === 'function') previous.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-accepted-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 max-sm:items-end max-sm:px-0"
      style={{ background: 'rgba(28,42,33,0.7)' }}
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        className="relative w-full max-w-[440px] rounded-[24px] bg-white px-[37px] py-[37px] outline-none max-sm:max-h-[92dvh] max-sm:overflow-y-auto max-sm:overscroll-contain max-sm:rounded-b-none max-sm:px-4 max-sm:pt-4 max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-sm:[&_button.w-full]:h-11 max-sm:[&_button.w-full]:min-h-11 max-sm:[&_button.w-full]:rounded-[10px] max-sm:[&_button.w-full]:py-0 max-sm:[&_button.w-full]:text-[14px]! max-sm:[&_button.w-full]:whitespace-nowrap max-sm:[&_button.w-full]:drop-shadow-none! max-sm:[&_button.w-full]:shadow-none!"
        style={{
          border: '3px solid #C1D4C4',
          boxShadow:
            '0 8px 16px -2px rgba(27,36,44,0.12), 0 2px 2px -1px rgba(27,35,44,0.04), 0 0 0 1px rgba(0,0,0,0.04), 0 4px 0 rgba(0,0,0,0.07), 0 24px 64px rgba(0,0,0,0.12)',
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex size-7 items-center justify-center rounded-[20px] bg-[#EBF1EC] transition-colors hover:bg-brand-green-light-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <img src={closeIcon} alt="" aria-hidden="true" width={16} height={16} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span
              className="flex size-16 items-center justify-center rounded-[10px] bg-[#E1EAE2]"
              style={{ boxShadow: '0 1px 2px rgba(27,36,44,0.12)' }}
              aria-hidden="true"
            >
              <img src={checkIcon} alt="" width={28} height={28} />
            </span>

            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col items-center gap-1 text-center">
                <h2
                  id="terms-accepted-title"
                  className="font-heading font-semibold text-[#1C2A21] max-sm:text-[24px]!"
                  style={{ fontSize: 29, lineHeight: '34.8px', letterSpacing: '-0.58px' }}
                >
                  Terms <span className="text-[#387440]">Accepted</span>
                </h2>
                <p
                  className="text-[12px] leading-[18px] text-[#959592]"
                  style={{ letterSpacing: '0.2px' }}
                >
                  You&apos;ve agreed to all 3 required documents. Here&apos;s your consent record.
                </p>
              </div>

              {/* Consent record card (Figma 8027:213496, 324x92). */}
              <ul
                className="mx-[18px] flex flex-col gap-[3px] rounded-[16px] px-3 py-2 max-sm:mx-0"
                style={{
                  background: 'rgba(235,241,236,0.3)',
                  border: '1px solid rgba(28,42,33,0.07)',
                }}
              >
                {RECORD_ROWS.map((row, idx) => (
                  <li
                    key={row.key}
                    className="flex items-center justify-between pt-1 pb-[5px]"
                    style={
                      idx < RECORD_ROWS.length - 1
                        ? { borderBottom: '1px solid rgba(28,42,33,0.06)' }
                        : { paddingBottom: 0, paddingTop: 0, marginTop: 6 }
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <img src={rowCheckIcon} alt="" aria-hidden="true" width={15} height={15} />
                      <span
                        className="text-[10px] font-semibold leading-4 text-[#387440]"
                        style={{ letterSpacing: '0.2px' }}
                      >
                        {row.label}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-ui text-[9.3px] leading-[11px] text-[#BABAB7]"
                    >
                      &mdash;
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div aria-hidden="true" className="h-1 w-full rounded-[4px] bg-[#EBF1EC]" />
            <div className="flex flex-col gap-[14px]">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={onContinue}
                rightIcon={<ArrowRightIcon />}
                className="w-full"
              >
                I'm Ready
              </Button>
              <p
                className="flex items-center justify-center gap-1 text-[10px] leading-4 text-[#959592] max-lg:text-[12px]"
                style={{ letterSpacing: '0.2px' }}
              >
                <img src={shieldIcon} alt="" aria-hidden="true" width={12} height={12} />
                Data encrypted at rest &middot; Ghana Data Protection Act compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAcceptedModal;
