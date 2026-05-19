import { useEffect } from 'react';
import { CloseIcon } from './assets.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('LegalModalShell');

/*
 * LegalModalShell — bottom-sheet style overlay used for Terms & Conditions,
 * Privacy Policy, and Data Processing Consent during onboarding Step 07.
 *
 * Figma sources:
 *   2837:28954 — Terms & Conditions modal
 *   2846:29512 — Privacy Policy modal
 *   2846:30205 — Data Processing Consent modal
 *
 * All three share the same chrome — top-rounded card, drag-handle pip,
 * "Summary" pill + title + ✕ close, green intro banner, scrollable
 * numbered body, optional bottom callouts, and a green
 * "I understand and Accept" CTA. Wrapper components in the same folder
 * pass `title`, `introTitle`, `introSubtitle`, `points`, and `callouts`.
 *
 * The dim scrim is full-viewport `rgba(17,17,17,0.7)` and traps focus
 * inside the dialog via aria attributes + the close-on-Escape listener.
 * No Decline button exists in any of the three modals — the ✕ close
 * button is the implicit decline path, matching the Figma spec.
 */

const POINT_VARIANT_STYLES = {
  // Highlighted (active/important) row — light-green bubble + green digit
  // + green title. Used for the "core" points in each modal (1-2 in
  // consent, 3 in terms, etc.).
  highlight: {
    bubble: { background: '#EBF1EC', borderColor: '#C1D4C4' },
    digit: '#2A5730',
    title: '#387440',
  },
  // Default row — neutral grey bubble + black title.
  default: {
    bubble: { background: '#F8F8F4', borderColor: '#C6C6C3' },
    digit: '#70706E',
    title: '#111111',
  },
};

const CALLOUT_VARIANT_STYLES = {
  // "Under 18?" amber callout used in Terms + DPC.
  amber: {
    container: { background: '#FFF8F0', borderColor: '#EEDEB8' },
    iconBox: { background: '#C8951A' },
    titleColor: '#967014',
    bodyColor: '#A07715',
    iconPath: (
      <>
        <path
          d="M5.5 1.5L10 9.5H1L5.5 1.5Z"
          stroke="white"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path d="M5.5 5V7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="5.5" cy="8.2" r="0.55" fill="white" />
      </>
    ),
  },
  // "Protected by Ghanaian law" / "Withdrawing consent" blue callout used
  // in Privacy + DPC.
  blue: {
    container: { background: '#EAEFFB', borderColor: '#BFCEF2' },
    iconBox: { background: '#3062D4' },
    titleColor: '#244A9F',
    bodyColor: '#3062D4',
    iconPath: (
      <>
        <circle cx="5.5" cy="5.5" r="5" stroke="white" strokeWidth="1.1" />
        <path d="M5.5 4V6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="5.5" cy="8" r="0.55" fill="white" />
      </>
    ),
  },
};

// 11×11 inline glyph rendered inside the small coloured icon box on each
// callout. Each variant supplies its own paths via `iconPath`.
const CalloutIcon = ({ variant }) => {
  const { iconPath } = CALLOUT_VARIANT_STYLES[variant];
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      {iconPath}
    </svg>
  );
};

const LegalModalShell = ({
  title,
  introTitle,
  introSubtitle,
  points = [],
  callouts = [],
  footerHelper,
  readFullHref,
  ctaLabel = 'I understand and Accept',
  onAccept,
  onClose,
}) => {
  log('mount', { title, points: points.length, callouts: callouts.length });

  // Close on Escape — same affordance as the personal-info modal.
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        log('escape pressed, closing');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(17,17,17,0.7)' }}
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[680px] flex-col bg-white"
        style={{
          maxHeight: 'min(90vh, 1126px)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: '0 -16px 48px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Drag handle — visual affordance for mobile bottom-sheet feel. */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-4 h-1 w-9 -translate-x-1/2 rounded-full bg-[#C6C6C3]"
        />

        {/* Header */}
        <div
          className="flex items-start justify-between px-6 pb-4 pt-9"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex flex-col gap-2">
            <span
              className="inline-flex h-[21px] w-fit items-center gap-1.5 rounded-[4px] px-2"
              style={{
                background: 'rgba(248,248,244,0.5)',
                border: '1px solid #C6C6C3',
              }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                <rect
                  x="1"
                  y="1"
                  width="7"
                  height="7"
                  rx="1.5"
                  stroke="#70706E"
                  strokeWidth="1.1"
                />
                <path d="M3 3h3M3 4.5h3M3 6h2" stroke="#70706E" strokeLinecap="round" />
              </svg>
              <span
                className="font-bold uppercase text-[#70706E]"
                style={{ fontSize: 10, letterSpacing: '0.6px' }}
              >
                Summary
              </span>
            </span>
            <h2
              id="legal-modal-title"
              className="font-display font-normal"
              style={{ fontSize: 24, lineHeight: '23.1px', color: '#111111' }}
            >
              {title.before}
              <span className="italic text-brand-green">{title.after}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-[27px] shrink-0 items-center justify-center rounded-full bg-[#F8F8F4] text-[#111111] transition-colors hover:bg-brand-green-light"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Intro banner — green-tinted with a shield/book glyph */}
        <div
          className="flex items-center gap-4 px-6 py-4"
          style={{
            background: 'rgba(235,241,236,0.6)',
            borderBottom: '1px solid #C1D4C4',
          }}
        >
          <span
            className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-brand-green"
            style={{ boxShadow: '0 3px 0 #2A5730' }}
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 1.54 16.92 5.4v5.38c0 3.85-3.08 6.92-6.92 7.7C3.85 17.7.77 14.62.77 10.77V5.4L10 1.54Z"
                stroke="white"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-[#2A5730]" style={{ fontSize: 14, lineHeight: '20px' }}>
              {introTitle}
            </p>
            <p
              className="text-[#2A5730]"
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: '17px',
                opacity: 0.8,
              }}
            >
              {introSubtitle}
            </p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ol className="flex flex-col">
            {points.map((point, index) => {
              const variant = point.highlight ? 'highlight' : 'default';
              const styles = POINT_VARIANT_STYLES[variant];
              const isLast = index === points.length - 1 && callouts.length === 0;
              return (
                <li
                  key={point.n}
                  className="flex gap-3 py-4"
                  style={isLast ? undefined : { borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <span
                    className="flex size-[26px] shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: styles.bubble.background,
                      border: `1px solid ${styles.bubble.borderColor}`,
                    }}
                  >
                    <span className="font-bold" style={{ fontSize: 11, color: styles.digit }}>
                      {point.n}
                    </span>
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3
                      className="font-bold"
                      style={{
                        fontSize: 13,
                        lineHeight: '16px',
                        color: styles.title,
                      }}
                    >
                      {point.title}
                    </h3>
                    <p
                      className="text-[#737373]"
                      style={{
                        fontSize: 12,
                        lineHeight: '19.8px',
                      }}
                    >
                      {point.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {callouts.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              {callouts.map((callout) => {
                const styles = CALLOUT_VARIANT_STYLES[callout.variant];
                return (
                  <div
                    key={callout.title}
                    className="relative flex items-start gap-3 rounded-[12px] px-4 py-3"
                    style={{
                      background: styles.container.background,
                      border: `1px solid ${styles.container.borderColor}`,
                    }}
                  >
                    <span
                      className="flex size-[22px] shrink-0 items-center justify-center rounded-[6px]"
                      style={{
                        background: styles.iconBox.background,
                        boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
                      }}
                      aria-hidden="true"
                    >
                      <CalloutIcon variant={callout.variant} />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <p
                        className="font-semibold"
                        style={{
                          fontSize: 14,
                          lineHeight: '24px',
                          letterSpacing: '0.2px',
                          color: styles.titleColor,
                        }}
                      >
                        {callout.title}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          lineHeight: '18px',
                          letterSpacing: '0.2px',
                          color: styles.bodyColor,
                          opacity: 0.85,
                        }}
                      >
                        {callout.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex flex-col gap-4 px-6 pb-6 pt-3"
          style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-center justify-between gap-4">
            <p
              className="max-w-[401px] text-[#BABAB7]"
              style={{ fontSize: 11, lineHeight: '15.4px' }}
            >
              {footerHelper}
            </p>
            {readFullHref && (
              <a
                href={readFullHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[35px] items-center gap-2 rounded-[4px] border px-4 transition-colors hover:bg-brand-green-light"
                style={{ borderColor: '#C1D4C4' }}
              >
                <span
                  className="font-semibold text-brand-green"
                  style={{ fontSize: 12, lineHeight: '20px', letterSpacing: '0.2px' }}
                >
                  Read full document
                </span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5h6M5 8l3-3-3-3"
                    stroke="#387440"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onAccept}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-brand-green transition-transform hover:translate-y-px"
            style={{
              border: '1px solid #2A5730',
              borderLeftWidth: 2,
              borderRightWidth: 2,
              borderBottomWidth: 2,
              boxShadow: '0 4px 0 #224626',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M16.77 5.21a.97.97 0 0 1 .02 1.06l-8.25 8.5a.97.97 0 0 1-1.4-.02l-4.25-4.5a.97.97 0 1 1 1.41-1.33l3.55 3.76 7.55-7.78a.97.97 0 0 1 1.37-.03Z"
                fill="#EBF1EC"
              />
            </svg>
            <span
              className="font-bold"
              style={{
                fontSize: 16,
                lineHeight: '24px',
                letterSpacing: '0.1px',
                color: '#FEF1E7',
              }}
            >
              {ctaLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModalShell;
