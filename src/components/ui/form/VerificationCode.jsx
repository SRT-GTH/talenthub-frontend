import { useEffect, useId, useRef, useState } from 'react';
import Field from './Field.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('VerificationCode');

/*
 * VerificationCode — multi-box one-time-code input.
 * Source: Figma frame 2021:911 ("Verification Code"). Per-box state symbols:
 *   2024:1305 default, 2024:1303 active, 2024:1304 error, 2024:1357 disabled.
 *
 * External API exposes a single string value and a string callback
 * (`(code) => void`) — the consumer doesn't need to think about per-box
 * state. Internally the component keeps an array of single-char digits
 * mirrored to refs so it can move focus on input / backspace / paste.
 *
 * Per-box visual state (62×62 rounded-md, 3px shelf shadow — slightly
 * deeper than TextInput's 2.5px):
 *   default   — bg white, border #ccc, grey shelf
 *   active    — focused or filled: green-light-active border + green shelf
 *   error     — danger-light-active border + solid red shelf
 *   disabled  — bg brand-green-light, no shelf, no interaction
 *
 * Behaviour:
 *   typing            → write digit, advance focus
 *   backspace empty   → move focus back, then clear that previous digit
 *   backspace filled  → clear current digit (focus stays)
 *   ←/→               → move focus between boxes
 *   paste             → distribute from current index, advance focus
 *
 * Layout extras:
 *   `splitAfter={n}` inserts a centered "·" separator after the Nth box
 *   (Figma's example: 6-digit code rendered as 3 + dot + 3).
 */

const BOX_STATE_CLASSES = {
  default: 'bg-white border-2 border-[#cccccc] shadow-[0_3px_0_0_rgba(191,191,191,0.8)]',
  active: 'bg-white border-2 border-brand-green-light-active shadow-[0_3px_0_0_rgba(34,70,38,0.8)]',
  error: 'bg-white border-2 border-danger-light-active shadow-[0_3px_0_0_rgba(146,43,33,1)]',
  disabled: 'bg-brand-green-light border-2 border-[#cccccc] shadow-none cursor-not-allowed',
};

// size is omitted here — applied via the `boxSize` prop so callers can
// override the 62px default without breaking the Tailwind class chain.
const BOX_BASE =
  'flex items-center justify-center rounded-md ' +
  'font-sans font-semibold text-[16px] leading-[24px] tracking-[0.2px] text-center ' +
  'transition-[border-color,box-shadow,background-color] duration-100 ' +
  'focus:outline-none disabled:cursor-not-allowed';

// Convert an arbitrary string to a digits-only array of length `length`,
// padding with empty strings.
const stringToDigits = (str, length) => {
  const digitsOnly = (str || '').replace(/\D/g, '').slice(0, length);
  return Array.from({ length }, (_, i) => digitsOnly[i] || '');
};

const VerificationCode = ({
  length = 6,
  value,
  defaultValue,
  onChange,
  onComplete,
  splitAfter,
  autoFocus = false,
  // Field-style props
  label,
  required,
  optional,
  helperText,
  error,
  // Showcase / forced state
  state,
  disabled = false,
  // Optional box size override (pixels). Defaults to 62 — the Figma spec for
  // the general OTP input. Pass a smaller value (e.g. 52) for compact modals
  // without breaking any existing usage.
  boxSize = 62,
  className,
  name,
  id,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isControlled = value !== undefined;

  const [internalDigits, setInternalDigits] = useState(() => stringToDigits(defaultValue, length));
  const digits = isControlled ? stringToDigits(value, length) : internalDigits;

  const inputRefs = useRef([]);

  log('render', {
    length,
    state,
    disabled,
    hasError: Boolean(error),
    valueLength: digits.filter(Boolean).length,
  });

  // Auto-focus the first box on mount when requested.
  useEffect(() => {
    if (autoFocus && !disabled && state !== 'disabled') {
      requestAnimationFrame(() => inputRefs.current[0]?.focus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = (nextDigits) => {
    if (!isControlled) setInternalDigits(nextDigits);
    const joined = nextDigits.join('');
    onChange?.(joined);
    if (joined.length === length && nextDigits.every(Boolean)) {
      log('complete:', joined);
      onComplete?.(joined);
    }
  };

  const focusBox = (index) => {
    const target = inputRefs.current[index];
    if (target) {
      target.focus();
      // Select-all so subsequent typing replaces existing digit.
      target.select?.();
    }
  };

  const handleInput = (e, index) => {
    const raw = e.target.value;
    // Strip non-digits. With maxLength=1 we typically receive 1 char, but
    // mobile autofill / IME composition can deliver longer strings.
    const digitsOnly = raw.replace(/\D/g, '');
    if (!digitsOnly) {
      // User cleared the box (e.g. pressed delete) — record the empty.
      const next = [...digits];
      next[index] = '';
      emit(next);
      return;
    }

    const next = [...digits];
    // Distribute every typed digit starting at the current index.
    for (let i = 0; i < digitsOnly.length && index + i < length; i += 1) {
      next[index + i] = digitsOnly[i];
    }
    emit(next);

    // Move focus to the box after the last digit we wrote.
    const lastWritten = Math.min(index + digitsOnly.length - 1, length - 1);
    const nextFocus = Math.min(lastWritten + 1, length - 1);
    focusBox(nextFocus);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const next = [...digits];
      if (next[index]) {
        // Clear current; focus stays.
        next[index] = '';
        emit(next);
      } else if (index > 0) {
        // Already empty — move back and clear that one.
        next[index - 1] = '';
        emit(next);
        focusBox(index - 1);
      }
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      focusBox(index - 1);
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      focusBox(index + 1);
      e.preventDefault();
      return;
    }
    if (e.key === 'Home') {
      focusBox(0);
      e.preventDefault();
      return;
    }
    if (e.key === 'End') {
      focusBox(length - 1);
      e.preventDefault();
    }
  };

  const handlePaste = (e, index) => {
    const pasted = e.clipboardData?.getData('text') ?? '';
    const digitsOnly = pasted.replace(/\D/g, '');
    if (!digitsOnly) return;
    e.preventDefault();
    const next = [...digits];
    for (let i = 0; i < digitsOnly.length && index + i < length; i += 1) {
      next[index + i] = digitsOnly[i];
    }
    emit(next);
    const lastWritten = Math.min(index + digitsOnly.length - 1, length - 1);
    focusBox(Math.min(lastWritten + 1, length - 1));
  };

  const handleFocus = (e) => {
    e.target.select?.();
  };

  const isForced = Boolean(state);
  const effectiveDisabled = disabled || state === 'disabled';

  // Resolve per-box visual. Forced state pins the same variant on every box;
  // otherwise we fall back to interactive logic per box.
  const resolveBoxState = (index, isFocused) => {
    if (isForced) return state;
    if (effectiveDisabled) return 'disabled';
    if (error) return 'error';
    if (digits[index] || isFocused) return 'active';
    return 'default';
  };

  // Track which box is currently focused so non-empty + focused both light
  // up green. Only relevant when not forced via `state`.
  const [focusedIndex, setFocusedIndex] = useState(null);

  return (
    <Field
      label={label}
      htmlFor={`${inputId}-0`}
      required={required}
      optional={optional}
      helperText={helperText}
      error={error}
      className={className}
    >
      <div className="flex items-center gap-2.5" {...rest}>
        {Array.from({ length }, (_, index) => {
          const isFocused = focusedIndex === index && !isForced;
          const boxState = resolveBoxState(index, isFocused);
          const stateClasses = BOX_STATE_CLASSES[boxState];
          const filled = Boolean(digits[index]);

          // Text colour: filled / active boxes show black; empty boxes show
          // the placeholder grey. Disabled keeps the placeholder grey.
          const textClass =
            boxState === 'active' && filled
              ? 'text-content-primary'
              : filled
                ? 'text-content-primary'
                : 'text-[#595959]';

          return (
            <div key={index} className="contents">
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                id={`${inputId}-${index}`}
                name={name ? `${name}[${index}]` : undefined}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                disabled={effectiveDisabled}
                aria-invalid={Boolean(error) || undefined}
                aria-label={`Digit ${index + 1} of ${length}`}
                value={digits[index]}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                onFocus={(e) => {
                  setFocusedIndex(index);
                  handleFocus(e);
                }}
                onBlur={() => setFocusedIndex((prev) => (prev === index ? null : prev))}
                style={{ width: boxSize, height: boxSize }}
                className={classNames(BOX_BASE, stateClasses, textClass)}
              />
              {splitAfter && index + 1 === splitAfter && index < length - 1 && (
                <span
                  aria-hidden="true"
                  className="font-display text-[22px] leading-[33px] text-[#b0b0b0] mx-1 select-none"
                >
                  ·
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Field>
  );
};

export default VerificationCode;
