import { useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';

/*
 * AgencyCodeBoxes — the six one-digit boxes of the check-your-inbox dialog (Figma 11.4.1a3 8607:1188 "Enter 6-digit verification code": six 54-62 x 62 boxes, gap 4,
 * 2px #ccc border, r10, "-" placeholder 16/24 600 #595959; the active box has a #387440 border; the wrong-code frame draws red borders).
 * Behaviour: typing a digit moves to the next box, Backspace on an empty box moves back, arrows move, paste spreads digits from the current box.
 * Props: value (string of up to 6 digits), onChange(string), error (bool), label (accessible name of the group), disabled.
 */

const LENGTH = 6;

const AgencyCodeBoxes = ({
  value,
  onChange,
  error = false,
  label = 'Verification code',
  disabled = false,
}) => {
  const refs = useRef([]);
  // The latest value, updated as soon as a key is handled: keys can arrive faster than React re-renders (fast typing, autofill, test
  // tools), and reading the rendered `value` then would overwrite the digits typed in between.
  const latest = useRef(value);
  latest.current = value;
  const toDigits = (v) => Array.from({ length: LENGTH }, (_, i) => (v || '')[i] ?? '');
  const digits = toDigits(value);
  const current = () => toDigits(latest.current);
  const focusAt = (i) => refs.current[Math.max(0, Math.min(LENGTH - 1, i))]?.focus();
  const commit = (next) => {
    const clean = next.join('').replace(/\D/g, '').slice(0, LENGTH);
    latest.current = clean;
    onChange(clean);
  };

  const spread = (i, text) => {
    const next = current();
    text.split('').forEach((ch, k) => {
      if (i + k < LENGTH) next[i + k] = ch;
    });
    commit(next);
    focusAt(Math.min(LENGTH - 1, i + text.length));
  };

  const onInput = (i, e) => {
    const typed = e.target.value.replace(/\D/g, '');
    const prev = current()[i];
    // Several digits at once (one-time-code autofill, IME, inserted text): spread them like a paste.
    const fresh = prev && typed.startsWith(prev) && typed.length > 1 ? typed.slice(1) : typed;
    if (fresh.length > 1) {
      spread(i, fresh);
      return;
    }
    const d = fresh.slice(-1);
    const next = current();
    next[i] = d;
    commit(next);
    if (d && i < LENGTH - 1) focusAt(i + 1);
  };

  const onKeyDown = (i, e) => {
    // A digit typed over the same digit fires no change event, so digits are handled here (change stays for IME / mobile keyboards).
    if (/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const next = current();
      next[i] = e.key;
      commit(next);
      if (i < LENGTH - 1) focusAt(i + 1);
      return;
    }
    if (e.key === 'Backspace' && !current()[i] && i > 0) {
      e.preventDefault();
      const next = current();
      next[i - 1] = '';
      commit(next);
      focusAt(i - 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const onPaste = (i, e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!text) return;
    e.preventDefault();
    spread(i, text);
  };

  return (
    <div role="group" aria-label={label} className="grid grid-cols-6 gap-[4px]">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-autofocus={i === 0 ? '' : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={LENGTH + 1}
          disabled={disabled}
          value={d}
          placeholder="-"
          aria-label={`Digit ${i + 1} of ${LENGTH}`}
          aria-invalid={error || undefined}
          onChange={(e) => onInput(i, e)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={(e) => onPaste(i, e)}
          onFocus={(e) => e.target.select()}
          className={classNames(
            'h-[62px] min-w-0 rounded-[10px] border-2 border-solid bg-white text-center font-sans text-[16px] leading-[24px] font-semibold tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.06)] outline-none placeholder:text-[#595959] focus:border-[#387440] disabled:opacity-55',
            error ? 'border-[#f1a9a0]' : d ? 'border-[#387440]' : 'border-[#cccccc]'
          )}
        />
      ))}
    </div>
  );
};

export default AgencyCodeBoxes;
