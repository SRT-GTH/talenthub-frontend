import { useEffect, useRef } from 'react';
import { debug } from '../../utils/debug.js';
import { classNames } from '../../utils/classNames.js';
import pillIcon from '../../assets/legal/legal-pill.svg';
import closeIcon from '../../assets/legal/legal-close.svg';
import bannerDocIcon from '../../assets/legal/legal-banner-doc.svg';
import bannerShieldIcon from '../../assets/legal/legal-banner-shield.svg';
import calloutInfoIcon from '../../assets/legal/legal-callout-info.svg';
import calloutWarnIcon from '../../assets/legal/legal-callout-warn.svg';
import calloutCheckIcon from '../../assets/legal/legal-callout-check.svg';
import ctaCheckIcon from '../../assets/legal/legal-cta-check.svg';

const log = debug('LegalModalShell');

/*
 * LegalModalShell — bottom-sheet overlay used for Terms & Conditions,
 * Privacy Policy and Data Processing Consent (talent Review step 07).
 *
 * Figma (restyled to the talent Review frames, owner order "100% Figma"):
 *   8027:211051 — Terms & Conditions dialog   (8027:211412)
 *   8027:211501 — Privacy Policy dialog       (8027:211862)
 *   8027:211943 — Data Processing Consent     (8027:212304)
 * Older frames 2837:28954 / 2846:29512 / 2846:30205 are superseded.
 *
 * Chrome (680 wide, top radius 24, scrim #1C2A21 @ .70):
 *   drag pip -> "Summary" pill + close X -> Bricolage 22/600 title
 *   (dark + green second word, NOT Instrument Serif) -> green intro banner
 *   -> scrollable numbered points -> callouts -> footer (helper copy,
 *   "Read full document" secondary button, green "I understand and Accept").
 * Figma insets all content 14px from the left edge and 0 on the right
 * (asymmetric); that is reproduced at md+ and made symmetric on phones.
 *
 * Props are unchanged: title {before, after}, introTitle, introSubtitle,
 * points [{n,title,body,highlight}], callouts [{variant,title,body}],
 * footerHelper, readFullHref, ctaLabel, onAccept, onClose. Callout variants:
 * 'amber' | 'blue' | 'blueSoft' (Terms) | 'green' (Privacy).
 *
 * A11y: role=dialog aria-modal aria-labelledby, focus moves into the dialog,
 * Tab/Shift+Tab are trapped, Esc and the X close, focus returns to the
 * element that opened it, backdrop click closes (as before).
 */

const POINT_VARIANT_STYLES = {
  // Highlighted row: light-green bubble, green digit + title.
  highlight: {
    bubble: { background: '#EBF1EC', borderColor: '#C1D4C4' },
    digit: '#2A5730',
    title: '#387440',
  },
  // Default row: neutral bubble, dark title (#1C2A21 per Figma).
  default: {
    bubble: { background: '#F8F8F4', borderColor: '#C6C6C3' },
    digit: '#70706E',
    title: '#1C2A21',
  },
};

const CALLOUT_VARIANT_STYLES = {
  // Figma 8027:212370 (DPC "Important if you are under 18").
  amber: {
    container: { background: '#FFF8F0', borderColor: '#EEDEB8' },
    iconBox: '#C8951A',
    icon: calloutWarnIcon,
    titleColor: '#967014',
    bodyColor: '#A07715',
  },
  // Figma 8027:212379 (DPC "Withdrawing consent ...").
  blue: {
    container: { background: '#EAEFFB', borderColor: '#BFCEF2' },
    iconBox: '#3062D4',
    icon: calloutInfoIcon,
    titleColor: '#244A9F',
    bodyColor: '#3062D4',
  },
  // Figma 8027:211483 (Terms "Under 18?"): bg #EAEFFB @ .4, border #BDD7F0.
  blueSoft: {
    container: { background: 'rgba(234,239,251,0.4)', borderColor: '#BDD7F0' },
    iconBox: '#3062D4',
    icon: calloutInfoIcon,
    titleColor: '#3062D4',
    bodyColor: '#3062D4',
  },
  // Figma 8027:211927 (Privacy "Protected by Ghanaian law").
  green: {
    container: { background: 'rgba(235,241,236,0.5)', borderColor: '#C1D4C4' },
    iconBox: '#387440',
    icon: calloutCheckIcon,
    titleColor: '#165D3A',
    bodyColor: '#165D3A',
  },
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

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
  bannerIcon = 'shield',
}) => {
  log('mount', { title, points: points.length, callouts: callouts.length });
  const dialogRef = useRef(null);
  const titleId = 'legal-modal-title';

  // Focus in on mount, restore on unmount.
  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current?.focus({ preventScroll: true });
    log('focus moved into dialog');
    return () => {
      if (previous && typeof previous.focus === 'function') {
        previous.focus({ preventScroll: true });
        log('focus restored');
      }
    };
  }, []);

  // Esc closes; Tab is trapped inside the dialog.
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        log('escape pressed, closing');
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const nodes = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE));
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!dialogRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(28,42,33,0.7)' }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex w-full max-w-[680px] flex-col bg-white outline-none max-md:max-h-[90dvh]!"
        style={{
          maxHeight: 'min(90vh, 1126px)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: '0 -16px 48px rgba(0,0,0,0.22)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Drag pip — Figma 36x4 #C6C6C3 r2, 16px from top. */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-4 h-1 w-9 -translate-x-1/2 rounded-full bg-[#C6C6C3]"
        />

        {/* Header: pill + close, then the title (Figma 632x77). */}
        <div className="mx-6 mt-[41px] shrink-0 max-md:mx-4 max-md:mt-9">
          <div
            className="pb-[9px] pl-[14px] pt-3 max-md:pl-0"
            style={{ borderBottom: '1px solid rgba(28,42,33,0.07)' }}
          >
            <div className="flex items-start justify-between">
              <span
                className="inline-flex h-[21px] w-fit items-center gap-[5px] rounded-[4px] px-[10px]"
                style={{ background: 'rgba(248,248,244,0.5)', border: '1px solid #C6C6C3' }}
              >
                <img src={pillIcon} alt="" aria-hidden="true" width={9} height={9} />
                <span
                  className="font-ui text-[10px] font-bold uppercase leading-3 text-[#70706E]"
                  style={{ letterSpacing: '0.6px' }}
                >
                  Summary
                </span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-[27px] shrink-0 items-center justify-center rounded-full bg-[#F8F8F4] transition-colors hover:bg-brand-green-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <img src={closeIcon} alt="" aria-hidden="true" width={8} height={8} />
              </button>
            </div>
            <h2
              id={titleId}
              className="font-heading font-semibold"
              style={{
                fontSize: 22,
                lineHeight: '27.5px',
                letterSpacing: '-0.44px',
                color: '#1C2A21',
              }}
            >
              {title.before}
              <span style={{ color: '#387440' }}>{title.after}</span>
            </h2>
          </div>

          {/* Intro banner — Figma 632x68, bg #EBF1EC @ .6, bottom border #C1D4C4. */}
          <div
            className="flex items-center gap-4 py-[15px] pl-[14px] max-md:pl-0"
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
              <img
                src={bannerIcon === 'doc' ? bannerDocIcon : bannerShieldIcon}
                alt=""
                width={20}
                height={20}
              />
            </span>
            <div className="flex flex-col gap-1 pr-3">
              <p className="text-[14px] font-bold leading-[17px] text-[#2A5730]">{introTitle}</p>
              <p className="text-[12px] font-medium leading-[17px] text-[#2A5730]">
                {introSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable body — rows 12px pad, 1px rule rgba(28,42,33,.06). */}
        <div className="no-scrollbar mx-6 min-h-0 flex-1 overflow-y-auto pb-4 pl-[14px] pt-4 max-md:mx-4 max-md:pl-0">
          <ol className="flex flex-col">
            {points.map((point) => {
              const variant = point.highlight ? 'highlight' : 'default';
              const styles = POINT_VARIANT_STYLES[variant];
              return (
                <li
                  key={point.n}
                  className="flex items-start gap-3 pb-[11px] pt-3"
                  style={{ borderBottom: '1px solid rgba(28,42,33,0.06)' }}
                >
                  <span
                    className="mt-px flex size-[26px] shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: styles.bubble.background,
                      border: `1px solid ${styles.bubble.borderColor}`,
                    }}
                  >
                    <span
                      className="font-ui text-[11px] font-bold leading-[13px]"
                      style={{ color: styles.digit }}
                    >
                      {point.n}
                    </span>
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="text-[13px] font-bold leading-4" style={{ color: styles.title }}>
                      {point.title}
                    </h3>
                    <p className="text-[12px] leading-5 text-[#737373]">{point.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {callouts.length > 0 && (
            <div className="mt-4 flex flex-col gap-4">
              {callouts.map((callout) => {
                const styles =
                  CALLOUT_VARIANT_STYLES[callout.variant] ?? CALLOUT_VARIANT_STYLES.blue;
                return (
                  <div
                    key={callout.title}
                    className="flex items-start gap-[11px] rounded-[12px] py-2 pl-1 pr-3"
                    style={{
                      background: styles.container.background,
                      border: `1px solid ${styles.container.borderColor}`,
                    }}
                  >
                    <span
                      className="mt-1 flex size-[22px] shrink-0 items-center justify-center rounded-[6px]"
                      style={{ background: styles.iconBox, boxShadow: '0 1px 0 rgba(0,0,0,0.1)' }}
                      aria-hidden="true"
                    >
                      <img src={styles.icon} alt="" width={11} height={11} />
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <p
                        className="text-[14px] font-semibold leading-6"
                        style={{ letterSpacing: '0.2px', color: styles.titleColor }}
                      >
                        {callout.title}
                      </p>
                      <p
                        className="text-[12px] leading-[18px]"
                        style={{ letterSpacing: '0.2px', color: styles.bodyColor }}
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

        {/* Footer — Figma 680x128, top rule rgba(28,42,33,.07). */}
        <div
          className="shrink-0 pb-2 pl-[37px] pr-[25px] pt-[13px] max-md:px-4 max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-md:pt-3"
          style={{ borderTop: '1px solid rgba(28,42,33,0.07)' }}
        >
          <div className="flex flex-col gap-4 max-md:gap-3">
            <div className="flex items-start justify-between gap-[60px] max-md:items-center max-md:gap-3">
              <p
                className={classNames(
                  'font-ui max-w-[401px] text-[11px] leading-[15px] text-[#BABAB7]',
                  'max-md:text-[12px]'
                )}
              >
                {footerHelper}
              </p>
              {readFullHref && (
                <a
                  href={readFullHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-[35px] min-w-[159px] shrink-0 items-center justify-center whitespace-nowrap rounded-[14px] bg-white px-3 text-[12px] font-bold leading-6 text-[#1C2A21] transition-transform hover:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-md:h-9 max-md:min-w-0"
                  style={{
                    border: '2px solid rgba(28,42,33,0.3)',
                    borderTopWidth: 1,
                    letterSpacing: '0.1px',
                    boxShadow: '0 4px 0 rgba(17,17,17,0.25)',
                  }}
                >
                  Read full document
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={onAccept}
              className="flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-brand-green px-10 transition-transform hover:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-md:h-11 max-md:rounded-[10px] max-md:px-4 max-md:shadow-none!"
              style={{
                border: '2px solid #2A5730',
                borderTopWidth: 1,
                boxShadow: '0 4px 0 #224626',
              }}
            >
              <img src={ctaCheckIcon} alt="" aria-hidden="true" width={20} height={20} />
              <span
                className="text-[16px] font-bold leading-6 max-md:text-[14px]"
                style={{ letterSpacing: '0.1px', color: '#FEF1E7' }}
              >
                {ctaLabel}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalModalShell;
