import { useEffect } from 'react';
import Button from '../../ui/Button.jsx';
import { CloseIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ConsentModal');

/*
 * ConsentModal — shared bottom-sheet dialog used by the three Review & Consent
 * pop-ups (opt-out model, parent rights, data processing). Figma dialog shell:
 * 2947:79682 (rounded-top sheet, drag handle, SUMMARY badge + italic-accent
 * title, intro banner, scrollable body, footer note + "Read full document" +
 * green "I understand and Accept" CTA).
 *
 * Props:
 *   badge        {string}     pill label (default "Summary")
 *   title        {string}     leading (serif) title text
 *   titleAccent  {string}     italic amber accent appended to the title
 *   intro        {{title,subtitle}}  green intro banner
 *   footnote     {string}     grey footer note
 *   children     {ReactNode}  scrollable body (list items + notices)
 *   onClose      {Function}
 *   onAccept     {Function}   "I understand and Accept"
 */

// Intro-banner glyph — document/list (hand-crafted, white on green box).
const SummaryDocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="4" y="3" width="12" height="14" rx="2" stroke="#ffffff" strokeWidth="1.5" />
    <path d="M7 7h6M7 10h6M7 13h4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SummaryBadgeIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
    <rect x="1" y="0.5" width="7" height="8" rx="1" stroke="#70706e" strokeWidth="0.9" />
    <path d="M2.5 3h4M2.5 5h3" stroke="#70706e" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);

const CheckLargeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M4 10.5l4 4 8-9"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowMini = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path
      d="M1.5 5h7M5.5 2l3 3-3 3"
      stroke="#387440"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Numbered list item — Figma 2947:79705 etc. ──────────────────────────────
export const ConsentListItem = ({ n, title, desc, highlight = false }) => (
  <div
    className="flex items-start gap-[12px] border-b py-[13px]"
    style={{ borderColor: 'rgba(0,0,0,0.06)' }}
  >
    <span
      className="flex size-[26px] shrink-0 items-center justify-center rounded-[13px] border font-display font-bold"
      style={{
        fontSize: 11,
        backgroundColor: highlight ? '#ebf1ec' : '#f8f8f4',
        borderColor: highlight ? '#c1d4c4' : '#c6c6c3',
        color: highlight ? '#2a5730' : '#70706e',
      }}
    >
      {n}
    </span>
    <div className="flex flex-col gap-[4px]">
      <p
        className="font-sans font-bold"
        style={{ fontSize: 13, color: highlight ? '#387440' : '#111', lineHeight: 'normal' }}
      >
        {title}
      </p>
      <p className="font-sans" style={{ fontSize: 12, color: '#737373', lineHeight: '19.8px' }}>
        {desc}
      </p>
    </div>
  </div>
);

// ── Notice box (blue informative / amber warning) — Figma 2947:79753 etc. ───
export const NoticeBox = ({ variant = 'blue', title, children }) => {
  const cfg =
    variant === 'amber'
      ? { bg: 'rgba(250,244,232,0.5)', border: '#eedeb8', icon: '#c8951a', text: '#b48617' }
      : { bg: 'rgba(234,239,251,0.4)', border: '#bdd7f0', icon: '#3062d4', text: '#3062d4' };

  return (
    <div
      className="flex gap-[12px] rounded-[12px] border p-[12px]"
      style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
    >
      <span
        className="flex size-[22px] shrink-0 items-center justify-center rounded-[6px]"
        style={{ backgroundColor: cfg.icon }}
      >
        <span className="font-sans font-bold text-white" style={{ fontSize: 13, lineHeight: 1 }}>
          {variant === 'amber' ? '!' : 'i'}
        </span>
      </span>
      <div className="flex flex-col gap-[2px]">
        <p
          className="font-sans font-semibold"
          style={{ fontSize: 14, color: cfg.text, lineHeight: '24px' }}
        >
          {title}
        </p>
        <p
          className="font-sans"
          style={{ fontSize: 12, color: cfg.text, lineHeight: '18px', opacity: 0.85 }}
        >
          {children}
        </p>
      </div>
    </div>
  );
};

// ── Main shell ──────────────────────────────────────────────────────────────
const ConsentModal = ({
  badge = 'Summary',
  title,
  titleAccent,
  intro,
  footnote,
  children,
  onClose,
  onAccept,
}) => {
  log('render', { title });

  // Close on ESC.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        log('escape pressed — closing');
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-[666px] flex-col overflow-hidden rounded-t-[24px] bg-white sm:rounded-[24px]"
        style={{ boxShadow: '0px -16px 24px rgba(0,0,0,0.22)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — Figma 2947:79683 */}
        <div className="flex shrink-0 justify-center pt-[16px]">
          <span className="h-[4px] w-[36px] rounded-[2px]" style={{ backgroundColor: '#c6c6c3' }} />
        </div>

        {/* Header — Figma 2947:79684 */}
        <div
          className="shrink-0 mx-6 pb-[14px] pt-[12px]"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-start justify-between">
            <span
              className="flex items-center gap-[8px] rounded-[4px] border px-[10px] py-[3px]"
              style={{ backgroundColor: 'rgba(248,248,244,0.5)', borderColor: '#c6c6c3' }}
            >
              <SummaryBadgeIcon />
              <span
                className="font-sans font-bold uppercase"
                style={{ fontSize: 10, color: '#70706e', letterSpacing: '0.6px' }}
              >
                {badge}
              </span>
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-[27px] items-center justify-center rounded-[16px] text-[#70706e] transition-colors hover:bg-neutral"
              style={{ backgroundColor: '#f8f8f4' }}
            >
              <CloseIcon />
            </button>
          </div>
          {/* Title — Instrument Serif 24px + italic amber accent */}
          <h2
            className="mt-[10px] font-display font-normal"
            style={{ fontSize: 24, letterSpacing: '-1px', lineHeight: '23.1px', color: '#111' }}
          >
            {title}{' '}
            {titleAccent && (
              <span className="italic" style={{ color: '#c8951a' }}>
                {titleAccent}
              </span>
            )}
          </h2>
        </div>

        {/* Intro banner — Figma 2947:79695 */}
        {intro && (
          <div
            className="flex shrink-0 items-center gap-[16px] mx-6 px-3.5 py-[15px]"
            style={{ backgroundColor: 'rgba(235,241,236,0.6)', borderBottom: '1px solid #c1d4c4' }}
          >
            <span
              className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px]"
              style={{ backgroundColor: '#387440', boxShadow: '0px 3px 0px #2a5730' }}
            >
              <SummaryDocIcon />
            </span>
            <div className="flex flex-col gap-[4px]" style={{ color: '#2a5730' }}>
              <p className="font-sans font-bold" style={{ fontSize: 14, lineHeight: 'normal' }}>
                {intro.title}
              </p>
              <p
                className="font-sans font-medium"
                style={{ fontSize: 12, lineHeight: '17.05px', opacity: 0.8 }}
              >
                {intro.subtitle}
              </p>
            </div>
          </div>
        )}

        {/* Scrollable body — Figma 2947:79704 */}
        <div className="flex-1 overflow-y-auto px-6 py-[16px]">
          <div className="flex flex-col gap-[8px]">{children}</div>
        </div>

        {/* Footer — Figma 2947:79762 */}
        <div
          className="shrink-0 px-6 pb-[16px] pt-[12px]"
          style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-center justify-between gap-4">
            <p
              className="font-sans"
              style={{ fontSize: 11, color: '#babab7', lineHeight: '15.4px' }}
            >
              {footnote}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                log('read full document clicked');
              }}
              className="flex shrink-0 items-center gap-[8px] rounded-[4px] border px-[16px] py-[8px] font-sans font-semibold"
              style={{
                borderColor: '#c1d4c4',
                color: '#387440',
                fontSize: 12,
                letterSpacing: '0.2px',
              }}
            >
              Read full document
              <ArrowMini />
            </button>
          </div>
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="mt-[16px] w-full justify-center"
            leftIcon={<CheckLargeIcon />}
            onClick={() => {
              log('accept clicked');
              onAccept?.();
            }}
          >
            I understand and Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
