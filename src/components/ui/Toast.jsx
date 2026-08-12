import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
 * Props for ToastItem / Toast:
 *   title     {ReactNode}  — bold first line
 *   body      {ReactNode}  — secondary content (supports JSX for mixed styles)
 *   variant   {string}     — 'success' | 'warning' | 'error' | 'info' | 'welcome'
 *   duration  {number}     — ms until auto-dismiss (0 = no auto-dismiss)
 *   onDismiss {Function}   — called with `id` after dismiss animation
 *   position  {string}     — Toast/ToastContainer only: see POSITIONS map
 *   compact   {boolean}    — single-line Career Buddy banner (Figma 5132:45989)
 *   exitSignal {number}    — bump to request animated exit (overlay / Escape)
 *
 * Motion: rAF slide-in from above + fade; after `duration` (or dismiss) slide
 * back up + fade, then `onDismiss` fires.
 *
 * Every Toast / ToastContainer portal always mounts a full-viewport dim
 * scrim under the banner (Figma 5132:54581 / Frame 14574: solid black @ 5%).
 * Click / Escape on the scrim dismisses the toast (same as the X control).
 *
 * Portal target: <div id="toast-root"> in index.html.
 */

const EXIT_MS = 300;
const ENTER_MS = 300;

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/** Timed slide+fade on the toast node (respects prefers-reduced-motion). */
function runToastMotion(el, { fromY, toY, fromOpacity, toOpacity, ms }) {
  return new Promise((resolve) => {
    if (!el) {
      resolve();
      return;
    }
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduced) {
      el.style.opacity = String(toOpacity);
      el.style.transform = `translateY(${toY}px)`;
      resolve();
      return;
    }

    const start = performance.now();
    el.style.opacity = String(fromOpacity);
    el.style.transform = `translateY(${fromY}px)`;

    // setInterval (not only rAF): background/automation tabs often throttle
    // rAF to 0–1fps, which made the toast look like it popped instead of slid.
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / ms);
      const e = easeOutCubic(t);
      el.style.opacity = String(fromOpacity + (toOpacity - fromOpacity) * e);
      el.style.transform = `translateY(${fromY + (toY - fromY) * e}px)`;
      if (t >= 1) {
        clearInterval(intervalId);
        el.__gthToastRaf = null;
        resolve();
      }
    };
    const intervalId = setInterval(tick, 16);
    tick();
    el.__gthToastRaf = () => clearInterval(intervalId);
  });
}

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
  welcome: {
    containerBg: '#f4faf5',
    containerBorder: '#2e7d32',
    leftAccentColor: '#387440',
    iconBg: 'transparent',
    icon: null,
    compactBorder: '#2e7d32',
    compactBg: '#f4faf5',
    compactShadow: '0px 2px 2.8px rgba(56,116,64,0.24)',
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
    exitSignal = 0,
    onPhaseChange,
    ...props
  },
  ref
) {
  const [phase, setPhase] = useState('entering');
  const exitingRef = useRef(false);
  const nodeRef = useRef(null);
  const onDismissRef = useRef(onDismiss);
  const onPhaseChangeRef = useRef(onPhaseChange);
  const cfg = VARIANTS[variant] ?? VARIANTS.success;

  onDismissRef.current = onDismiss;
  onPhaseChangeRef.current = onPhaseChange;

  const setRefs = useCallback(
    (node) => {
      nodeRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  log('mount', { id, variant, duration, compact });

  const beginExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    log('dismiss', id);
    setPhase('exiting');
    onPhaseChangeRef.current?.('exiting');
  }, [id]);

  // Seed off-screen pose before paint so the first frame isn't a flash.
  useLayoutEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(-16px)';
    el.style.willChange = 'opacity, transform';
  }, []);

  // Enter from top on mount.
  useEffect(() => {
    const el = nodeRef.current;
    let cancelled = false;
    (async () => {
      await runToastMotion(el, {
        fromY: -16,
        toY: 0,
        fromOpacity: 0,
        toOpacity: 1,
        ms: ENTER_MS,
      });
      if (cancelled) return;
      setPhase('shown');
      onPhaseChangeRef.current?.('shown');
    })();
    return () => {
      cancelled = true;
      el?.__gthToastRaf?.();
    };
  }, []);

  // Exit toward top, then notify parent to unmount.
  useEffect(() => {
    if (phase !== 'exiting') return;
    const el = nodeRef.current;
    let cancelled = false;
    (async () => {
      await runToastMotion(el, {
        fromY: 0,
        toY: -16,
        fromOpacity: 1,
        toOpacity: 0,
        ms: EXIT_MS,
      });
      if (cancelled) return;
      onDismissRef.current?.(id);
    })();
    return () => {
      cancelled = true;
      el?.__gthToastRaf?.();
    };
  }, [phase, id]);

  // Auto-dismiss after duration once fully shown.
  useEffect(() => {
    if (!duration || phase !== 'shown') return;
    log('branch', { autoDismissIn: duration, id });
    const timer = setTimeout(() => beginExit(), duration);
    return () => clearTimeout(timer);
  }, [duration, phase, beginExit, id]);

  // Overlay / Escape bumps exitSignal to request the same animated exit.
  useEffect(() => {
    if (!exitSignal) return;
    beginExit();
  }, [exitSignal, beginExit]);

  if (compact || variant === 'welcome') {
    const isWelcome = variant === 'welcome';
    const bannerStyle = {
      backgroundColor: cfg.compactBg,
      borderBottom: `1px solid ${cfg.compactBorder}`,
      boxShadow: cfg.compactShadow,
    };

    return (
      <div
        ref={setRefs}
        role="alert"
        aria-live="assertive"
        className={`inline-flex items-center gap-[48px] rounded-[12px] pl-[16px] pr-[14px] py-[12px] ${className}`}
        style={bannerStyle}
        {...props}
      >
        <span className="inline-flex min-w-0 flex-1 items-center gap-[11px]">
          {cfg.compactIcon && (
            <span
              aria-hidden="true"
              className="flex shrink-0"
              style={{ width: isWelcome ? 24 : 22, height: isWelcome ? 24 : 22 }}
            >
              {cfg.compactIcon}
            </span>
          )}
          {isWelcome ? (
            <span className="flex min-w-0 flex-col items-start gap-[4px] font-sans leading-normal">
              <span className="font-semibold text-[14px] text-[#2a5730]">{title}</span>
              {body && <span className="font-normal text-[13px] text-[#595959]">{body}</span>}
            </span>
          ) : (
            <span className="font-sans whitespace-pre" style={{ fontSize: 15, color: '#404040' }}>
              <span className="font-semibold">
                {title}
                {', '}
              </span>
              {body && <span className="font-normal">{body}</span>}
            </span>
          )}
        </span>
        <button
          type="button"
          className="flex shrink-0 items-center justify-center hover:opacity-70 transition-opacity"
          onClick={beginExit}
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
      ref={setRefs}
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 rounded-[10px] px-6 py-5 ${className}`}
      style={{
        backgroundColor: cfg.containerBg,
        border: `1px solid ${cfg.containerBorder}`,
        borderLeft: `3px solid ${cfg.leftAccentColor}`,
        boxShadow: '0px 16px 24px -6px rgba(27,36,44,0.16), 0px 2px 2px -1px rgba(27,36,44,0.04)',
        maxWidth: 729,
        minWidth: 300,
      }}
      {...props}
    >
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

      <button
        type="button"
        className="flex shrink-0 items-center justify-center hover:opacity-70 transition-opacity mt-[3px]"
        onClick={beginExit}
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

const TOAST_OVERLAY_CLASS = 'fixed inset-0 z-[99] bg-black/[0.05]';

const Toast = ({ position = 'top-right', onDismiss, ...props }) => {
  log('portal', { position, variant: props.variant, compact: props.compact });

  const [exitSignal, setExitSignal] = useState(0);
  const [overlayShown, setOverlayShown] = useState(false);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setOverlayShown(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const requestExit = () => {
    log('branch', { dismissViaOverlay: true, id: props.id });
    setOverlayShown(false);
    setExitSignal((n) => n + 1);
  };

  const handlePhaseChange = (nextPhase) => {
    if (nextPhase === 'exiting') setOverlayShown(false);
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99]"
      onClick={requestExit}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          requestExit();
        }
      }}
      role="presentation"
    >
      <div
        className={`${TOAST_OVERLAY_CLASS} pointer-events-none transition-opacity duration-300 ease-out ${
          overlayShown ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      <div
        className={`fixed z-[100] ${POSITIONS[position] ?? POSITIONS['top-right']}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <ToastItem
          {...props}
          onDismiss={onDismiss}
          exitSignal={exitSignal}
          onPhaseChange={handlePhaseChange}
        />
      </div>
    </div>,
    document.getElementById('toast-root')
  );
};

const ToastContainer = React.forwardRef(function ToastContainer(
  { toasts = [], onDismiss, position = 'top-right', className = '' },
  ref
) {
  const [exitSignal, setExitSignal] = useState(0);
  const [overlayShown, setOverlayShown] = useState(false);

  useEffect(() => {
    if (toasts.length === 0) {
      setOverlayShown(false);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setOverlayShown(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [toasts.length]);

  const requestExitAll = () => {
    log('branch', { dismissAllViaOverlay: true, count: toasts.length });
    setOverlayShown(false);
    setExitSignal((n) => n + 1);
  };

  return ReactDOM.createPortal(
    toasts.length > 0 ? (
      <div
        className="fixed inset-0 z-[99]"
        onClick={requestExitAll}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            requestExitAll();
          }
        }}
        role="presentation"
      >
        <div
          className={`${TOAST_OVERLAY_CLASS} pointer-events-none transition-opacity duration-300 ease-out ${
            overlayShown ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
        <div
          ref={ref}
          className={`fixed z-[100] flex flex-col gap-2 ${
            POSITIONS[position] ?? POSITIONS['top-right']
          } ${className}`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} onDismiss={onDismiss} exitSignal={exitSignal} />
          ))}
        </div>
      </div>
    ) : null,
    document.getElementById('toast-root')
  );
});

export default Toast;
export { ToastItem, ToastContainer, EXIT_MS, ENTER_MS };
