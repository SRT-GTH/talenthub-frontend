import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import focusedActive from '../../../assets/playful/style-focused-active.svg';
import focusedInactive from '../../../assets/playful/style-focused-inactive.svg';
import playfulActive from '../../../assets/playful/style-playful-active.svg';
import playfulInactive from '../../../assets/playful/style-playful-inactive.svg';

const log = debug('StyleDial');

/*
 * StyleDial — phone-only (< md) appearance switch, a small "speed dial" that sits just above the
 * Ask Buddy button (⚠️ ASSUMPTION — Figma has no phone frame; owner request 2026-10-18).
 *   closed  one 48px WHITE circle showing the CURRENT mode's icon in brand green
 *   open    that circle turns into a green ✕ and the two modes fan out around it (Focused above,
 *           Playful to the left); tap one to switch, tap ✕ / outside / Esc to close.
 * Motion: icon cross-fade + 90° turn on the main circle, options scale/translate out from the
 * main circle with a small overshoot and a 45ms stagger; all of it is removed for
 * `prefers-reduced-motion` (state still changes, instantly).
 *
 * Instant switching: every icon image is ALWAYS mounted and only its opacity changes. Swapping an
 * <img src> (or a CSS mask URL) makes the browser fetch/decode first, which showed as a solid
 * square after a refresh and a laggy switch. The green tint is an inline SVG colour filter
 * (constant #387440, alpha kept), so no extra request is involved.
 * Sits at the Ask Buddy button's right edge; vertical offset = tab bar 56 + gap + the button's
 * height (54px, 42px on screens shorter than 700px — keep in sync with AskBuddyFab).
 */
const MODES = [
  // x / y = where the option rests when open (px from the main circle's centre)
  {
    id: 'focused',
    label: 'Focused',
    active: focusedActive,
    inactive: focusedInactive,
    x: 0,
    y: -62,
  },
  {
    id: 'playful',
    label: 'Playful',
    active: playfulActive,
    inactive: playfulInactive,
    x: -62,
    y: 0,
  },
];

const EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // soft overshoot
const circle =
  'absolute right-0 bottom-0 flex items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';
const shelf =
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[3px_3px_0_rgba(28,42,33,0.55)]';

// Layered, always-mounted icon: `on` only toggles opacity (and an optional turn).
const Layer = ({ src, on, size = 18, filter, style }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    draggable="false"
    decoding="sync"
    className="pointer-events-none absolute motion-reduce:transition-none"
    style={{
      width: size,
      height: size,
      opacity: on ? 1 : 0,
      filter,
      transition: `opacity 180ms ease, transform 320ms ${EASE}`,
      ...style,
    }}
  />
);

const StyleDial = () => {
  const { uiStyle, setUiStyle } = useUiStyle();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const choose = (id) => {
    log('select', id);
    if (id !== uiStyle) setUiStyle(id);
    setOpen(false);
  };

  const current = MODES.find((m) => m.id === uiStyle) ?? MODES[0];

  return (
    <div
      ref={rootRef}
      className="fixed right-[clamp(12px,2.31vw,40px)] bottom-[calc(56px+12px+54px+12px+env(safe-area-inset-bottom))] z-40 size-[48px] md:hidden max-md:[@media(max-height:700px)]:bottom-[calc(56px+8px+42px+10px+env(safe-area-inset-bottom))]"
    >
      {/* constant-colour filter: keeps each icon's alpha, paints it brand green (#387440) */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <filter id="gth-dial-green" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.2196  0 0 0 0 0.4549  0 0 0 0 0.2510  0 0 0 1 0"
          />
        </filter>
      </svg>

      {MODES.map((m, i) => {
        const selected = m.id === uiStyle;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${m.label} mode`}
            title={m.label}
            tabIndex={open ? 0 : -1}
            onClick={() => choose(m.id)}
            className={classNames(
              circle,
              shelf,
              'size-[44px] right-[2px] bottom-[2px] motion-reduce:transition-none',
              open ? 'pointer-events-auto' : 'pointer-events-none'
            )}
            style={{
              background: selected ? '#387440' : '#ffffff',
              transform: open
                ? `translate(${m.x}px, ${m.y}px) scale(1)`
                : 'translate(0, 0) scale(0.3)',
              opacity: open ? 1 : 0,
              transition: `transform 380ms ${EASE} ${open ? i * 45 : 0}ms, opacity 200ms ease ${open ? i * 45 : 0}ms, background-color 180ms ease`,
            }}
          >
            <Layer src={m.active} on={selected} />
            <Layer src={m.inactive} on={!selected} />
          </button>
        );
      })}

      <button
        type="button"
        aria-haspopup="radiogroup"
        aria-expanded={open}
        aria-label={open ? 'Close appearance options' : `Appearance: ${current.label} mode`}
        onClick={() => {
          log(open ? 'close' : 'open');
          setOpen((o) => !o);
        }}
        className={classNames(
          circle,
          shelf,
          'size-[48px] bg-white shadow-[0_5px_15px_rgba(41,71,46,0.17)] motion-reduce:transition-none active:scale-95'
        )}
        style={{ transition: 'transform 160ms ease, box-shadow 200ms ease' }}
      >
        {/* current mode's icon in green; one layer per mode, only opacity/turn changes */}
        {MODES.map((m) => (
          <Layer
            key={m.id}
            src={m.active}
            on={!open && m.id === uiStyle}
            size={20}
            filter="url(#gth-dial-green)"
            style={{ transform: open ? 'rotate(90deg) scale(0.4)' : 'rotate(0deg) scale(1)' }}
          />
        ))}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute size-[20px] motion-reduce:transition-none"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.4)',
            transition: `transform 320ms ${EASE}, opacity 180ms ease`,
          }}
        >
          <path
            d="M5 5l10 10M15 5L5 15"
            fill="none"
            stroke="#387440"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default StyleDial;
