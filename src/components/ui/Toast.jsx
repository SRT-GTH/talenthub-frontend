import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { debug } from '../../utils/debug.js';
import {
  ToastSuccessIcon,
  ToastErrorIcon,
  ToastWarningIcon,
  ToastWelcomeIcon,
} from '../shared/assets.jsx';

const log = debug('Toast');

/*
 * Toast — React Portal notification system (Figma 2900:76816).
 *
 * Exports:
 *   default Toast        — single toast via portal (wraps ToastItem)
 *   ToastItem            — raw item (no portal, use inside ToastContainer)
 *   ToastContainer       — queued toasts via portal
 *
 * Variants designed so far: 'success' (Figma 2900:76816).
 * Stubs for 'warning', 'error', 'info' are present — designer will fill them in.
 *
 * Props for ToastItem / Toast:
 *   title     {ReactNode}  — bold first line
 *   body      {ReactNode}  — secondary content (supports JSX for mixed styles)
 *   variant   {string}     — 'success' | 'warning' | 'error' | 'info' | 'welcome'
 *   duration  {number}     — ms until auto-dismiss (0 = no auto-dismiss)
 *   onDismiss {Function}   — called with `id` after dismiss animation
 *   position  {string}     — Toast/ToastContainer only: see POSITIONS map
 *   compact   {boolean}    — single-line Career Buddy banner (Figma 5132:45989)
 *
 * Every Toast / ToastContainer portal always mounts a full-viewport dim
 * scrim under the banner (Figma 5132:54581 / Frame 14574: solid black @ 5%).
 * Click / Escape on the scrim dismisses the toast (same as the X control).
 *
 * Portal target: <div id="toast-root"> in index.html.
 */

// ── variant configs ─────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M3.5 9.5l4 4 7-8.5"
      stroke="#ebf1ec"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Filled "!" glyph — shared by warning/error compact toasts (Figma 5132:45996 / 46274).
const ExclamationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 3.5v4M7 10.2v.01" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const VARIANTS = {
  success: {
    containerBg: '#ebf1ec',
    containerBorder: '#c1d4c4',
    leftAccentColor: '#387440',
    iconBg: '#387440',
    icon: <CheckIcon />,
    // Compact banner re-extracted 2026-07-29 via get_design_context on Figma
    // 5132:45989/46267/46545 (Career Buddy Educational Background save
    // feedback) — supersedes the earlier generic stub colours/icons below.
    compactBorder: '#387440',
    compactBg: '#ebf1ec',
    compactShadow: '0px 2px 2.8px rgba(56,116,64,0.24)',
    compactIcon: <ToastSuccessIcon className="size-full" />,
  },
  warning: {
    containerBg: '#fef9ec',
    containerBorder: '#e8d589',
    leftAccentColor: '#d6a243',
    iconBg: '#d6a243',
    icon: null,
    compactBorder: '#f59638',
    compactBg: '#fefbf4',
    compactShadow: '0px 2px 2.8px rgba(245,150,56,0.24)',
    compactIcon: <ToastWarningIcon className="size-full" />,
  },
  error: {
    containerBg: '#fdf0ef',
    containerBorder: '#f5a8a1',
    leftAccentColor: '#c0392b',
    iconBg: '#c0392b',
    icon: null,
    compactBorder: '#c0392b',
    compactBg: '#fef6f5',
    compactShadow: '0px 2px 2.8px rgba(192,57,43,0.24)',
    compactIcon: <ToastErrorIcon className="size-full" />,
  },
  info: {
    containerBg: '#eff4fb',
    containerBorder: '#b3cced',
    leftAccentColor: '#2563eb',
    iconBg: '#2563eb',
    icon: null,
    compactBorder: '#2563eb',
    compactBg: '#eff4fb',
    compactShadow: '0px 2px 2.8px rgba(37,99,235,0.24)',
    compactIcon: <ExclamationIcon />,
  },
  // Figma 5132:66245 / 66251 — recruiter landing welcome banner (white card,
  // green→gold gradient stroke, gold drop-shadow, waving-hand icon).
  // Text: title semibold + ",  " + body regular (Figma double-space).
  welcome: {
    containerBg: '#ffffff',
    containerBorder: '#c1d4c4',
    leftAccentColor: '#c8951a',
    iconBg: 'transparent',
    icon: null,
    compactBorder: '#c8951a',
    compactBg: '#ffffff',
    compactShadow: '0px 2px 5.6px rgba(200,149,26,0.12)',
    compactIcon: <ToastWelcomeIcon className="size-full" />,
  },
};

// ── ToastItem ────────────────────────────────────────────────────────────────

const ToastItem = React.forwardRef(function ToastItem(
  {
    id,
    title,
    body,
    variant = 'success',
    duration = 6000,
    onDismiss,
    className = '',
    compact = false,
    ...props
  },
  ref
) {
  const [visible, setVisible] = useState(true);
  const cfg = VARIANTS[variant] ?? VARIANTS.success;

  log('mount', { id, variant, duration, compact });

  const handleDismiss = () => {
    log('dismiss', id);
    setVisible(false);
    setTimeout(() => onDismiss?.(id), 300);
  };

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, id, onDismiss]);

  // Compact single-line banner — Figma 5132:45989 (Success) / 46267 (Error) /
  // 46545 (Warning), Career Buddy Educational Background save feedback.
  // `welcome` (Figma 5132:66245 / 66251) reuses this compact shell: white
  // fill, green→gold gradient border via dual background-clip (raw CSS —
  // Tailwind can't express gradient strokes), waving-hand icon, and the
  // same title/body split as success toasts (Figma keeps a double space
  // after the comma for welcome).
  if (compact || variant === 'welcome') {
    const isWelcome = variant === 'welcome';
    const welcomeBorderStyle = isWelcome
      ? {
          border: '1px solid transparent',
          backgroundImage:
            'linear-gradient(#ffffff, #ffffff), linear-gradient(105deg, #c1d4c4 0%, #c8951a 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: cfg.compactShadow,
        }
      : {
          backgroundColor: cfg.compactBg,
          borderBottom: `1px solid ${cfg.compactBorder}`,
          boxShadow: cfg.compactShadow,
        };

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        className={`inline-flex items-center gap-[40px] rounded-[12px] px-[16px] py-[12px] transition-all duration-300 ease-in ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        } ${className}`}
        style={welcomeBorderStyle}
        {...props}
      >
        <span className="inline-flex shrink-0 items-center gap-[10px]">
          {cfg.compactIcon && (
            <span aria-hidden="true" className="flex shrink-0" style={{ width: 24, height: 24 }}>
              {cfg.compactIcon}
            </span>
          )}
          <span className="font-sans whitespace-pre" style={{ fontSize: 15, color: '#404040' }}>
            <span className="font-semibold">
              {title}
              {isWelcome ? ',  ' : ', '}
            </span>
            {body && <span className="font-normal">{body}</span>}
          </span>
        </span>
        <button
          type="button"
          className="flex shrink-0 items-center justify-center hover:opacity-70 transition-opacity"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          style={{ width: 20, height: 20, color: '#404040' }}
        >
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="M1 1l8 8M9 1l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 rounded-[10px] px-6 py-5 transition-all duration-300 ease-in ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${className}`}
      style={{
        backgroundColor: cfg.containerBg,
        border: `1px solid ${cfg.containerBorder}`,
        borderLeft: `3px solid ${cfg.leftAccentColor}`,
        boxShadow: '0px 16px 24px -6px rgba(27,36,44,0.16), 0px 2px 2px -1px rgba(27,36,44,0.04)',
        maxWidth: 729, // Figma frame 2943:52577 width
        minWidth: 300,
      }}
      {...props}
    >
      {/* Icon box — Figma 2943:52591 (36×36, r-6) */}
      <span
        className="flex shrink-0 items-center justify-center rounded-[6px]"
        style={{
          width: 36,
          height: 36,
          backgroundColor: cfg.iconBg,
          boxShadow: '0 2px 2px rgba(27,35,44,0.04), 0 8px 16px rgba(27,36,44,0.12)',
        }}
      >
        {cfg.icon}
      </span>

      {/* Body content */}
      <div className="flex-1 min-w-0 flex flex-col gap-[8px] pt-[2px]">
        {title && (
          <p
            className="font-sans font-semibold"
            style={{ fontSize: 14, lineHeight: '24px', letterSpacing: '0.1px', color: '#387440' }}
          >
            {title}
          </p>
        )}
        {body && (
          <div
            className="font-sans"
            style={{ fontSize: 14, lineHeight: '20px', letterSpacing: '0.2px', color: '#575755' }}
          >
            {body}
          </div>
        )}
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        className="flex shrink-0 items-center justify-center hover:opacity-70 transition-opacity mt-[3px]"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        style={{ width: 20, height: 20, color: '#575755' }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path
            d="M1 1l8 8M9 1l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
});

// ── position map (shared by Toast + ToastContainer) ─────────────────────────

const POSITIONS = {
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-center': 'top-6 left-1/2 -translate-x-1/2',
};

// ── Toast (single via portal) ────────────────────────────────────────────────

// Figma 5132:54581 ("Frame 14574") — full-viewport solid black @ 5% under
// every toast (e.g. 5132:54057 CAREER OPTIONS SAVED). Lighter than Modal
// scrims (~30–50%); always on for Toast / ToastContainer, not opt-in.
const TOAST_OVERLAY_CLASS = 'fixed inset-0 z-[99] bg-black/[0.05]';

const Toast = ({ position = 'top-right', ...props }) => {
  log('portal', { position, variant: props.variant, compact: props.compact });

  const dismissViaOverlay = () => {
    log('branch', { dismissViaOverlay: true, id: props.id });
    props.onDismiss?.(props.id);
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99]"
      onClick={dismissViaOverlay}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          dismissViaOverlay();
        }
      }}
      role="presentation"
    >
      <div className={`${TOAST_OVERLAY_CLASS} pointer-events-none`} aria-hidden="true" />
      <div className={`fixed z-[100] ${POSITIONS[position] ?? POSITIONS['top-right']}`}>
        <ToastItem {...props} />
      </div>
    </div>,
    document.getElementById('toast-root')
  );
};

// ── ToastContainer (queue of toasts via portal) ──────────────────────────────

const ToastContainer = React.forwardRef(function ToastContainer(
  { toasts = [], onDismiss, position = 'top-right', className = '' },
  ref
) {
  const dismissAllViaOverlay = () => {
    log('branch', { dismissAllViaOverlay: true, count: toasts.length });
    toasts.forEach((toast) => onDismiss?.(toast.id));
  };

  return ReactDOM.createPortal(
    toasts.length > 0 ? (
      <div
        className="fixed inset-0 z-[99]"
        onClick={dismissAllViaOverlay}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            dismissAllViaOverlay();
          }
        }}
        role="presentation"
      >
        <div className={`${TOAST_OVERLAY_CLASS} pointer-events-none`} aria-hidden="true" />
        <div
          ref={ref}
          className={`fixed z-[100] flex flex-col gap-2 ${
            POSITIONS[position] ?? POSITIONS['top-right']
          } ${className}`}
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} onDismiss={onDismiss} />
          ))}
        </div>
      </div>
    ) : null,
    document.getElementById('toast-root')
  );
});

export default Toast;
export { ToastItem, ToastContainer };
