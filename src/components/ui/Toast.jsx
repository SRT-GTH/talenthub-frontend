import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { debug } from '../../utils/debug.js';

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
 *   variant   {string}     — 'success' | 'warning' | 'error' | 'info'
 *   duration  {number}     — ms until auto-dismiss (0 = no auto-dismiss)
 *   onDismiss {Function}   — called with `id` after dismiss animation
 *   position  {string}     — Toast/ToastContainer only: see POSITIONS map
 *
 * Portal target: <div id="toast-root"> in index.html.
 */

// ── variant configs ─────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2 6.5l3 3 5-6"
      stroke="#ebf1ec"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const VARIANTS = {
  success: {
    containerBg: '#ebf1ec',
    containerBorder: '#c1d4c4',
    leftAccentColor: '#387440',
    iconBg: '#387440',
    icon: <CheckIcon />,
  },
  // Remaining variants designed later — stubs keep the variant map complete.
  warning: {
    containerBg: '#fef9ec',
    containerBorder: '#e8d589',
    leftAccentColor: '#d6a243',
    iconBg: '#d6a243',
    icon: null,
  },
  error: {
    containerBg: '#fdf0ef',
    containerBorder: '#f5a8a1',
    leftAccentColor: '#c0392b',
    iconBg: '#c0392b',
    icon: null,
  },
  info: {
    containerBg: '#eff4fb',
    containerBorder: '#b3cced',
    leftAccentColor: '#2563eb',
    iconBg: '#2563eb',
    icon: null,
  },
};

// ── ToastItem ────────────────────────────────────────────────────────────────

const ToastItem = React.forwardRef(function ToastItem(
  { id, title, body, variant = 'success', duration = 6000, onDismiss, className = '', ...props },
  ref
) {
  const [visible, setVisible] = useState(true);
  const cfg = VARIANTS[variant] ?? VARIANTS.success;

  log('mount', { id, variant, duration });

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

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 rounded-[10px] px-4 py-3 transition-all duration-300 ease-in ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${className}`}
      style={{
        backgroundColor: cfg.containerBg,
        border: `1px solid ${cfg.containerBorder}`,
        borderLeft: `3px solid ${cfg.leftAccentColor}`,
        boxShadow: '0px 16px 24px -6px rgba(27,36,44,0.16), 0px 2px 2px -1px rgba(27,36,44,0.04)',
        maxWidth: 420,
        minWidth: 300,
      }}
      {...props}
    >
      {/* Icon box */}
      <span
        className="flex shrink-0 items-center justify-center rounded-[6px] mt-[1px]"
        style={{
          width: 26,
          height: 26,
          backgroundColor: cfg.iconBg,
          boxShadow: '0 2px 2px rgba(27,35,44,0.04), 0 8px 16px rgba(27,36,44,0.12)',
        }}
      >
        {cfg.icon}
      </span>

      {/* Body content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p
            className="font-sans font-semibold"
            style={{ fontSize: 14, lineHeight: '20px', color: '#387440' }}
          >
            {title}
          </p>
        )}
        {body && (
          <div
            className="font-sans mt-[2px]"
            style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '0.2px', color: '#575755' }}
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

const Toast = ({ position = 'top-right', ...props }) =>
  ReactDOM.createPortal(
    <div className={`fixed z-[100] ${POSITIONS[position] ?? POSITIONS['top-right']}`}>
      <ToastItem {...props} />
    </div>,
    document.getElementById('toast-root')
  );

// ── ToastContainer (queue of toasts via portal) ──────────────────────────────

const ToastContainer = React.forwardRef(function ToastContainer(
  { toasts = [], onDismiss, position = 'top-right', className = '' },
  ref
) {
  return ReactDOM.createPortal(
    <div
      ref={ref}
      className={`fixed z-[100] flex flex-col gap-2 ${
        POSITIONS[position] ?? POSITIONS['top-right']
      } ${className}`}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.getElementById('toast-root')
  );
});

export default Toast;
export { ToastItem, ToastContainer };
