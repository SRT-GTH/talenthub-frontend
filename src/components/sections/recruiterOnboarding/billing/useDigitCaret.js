import { useLayoutEffect, useRef } from 'react';

/*
 * useDigitCaret - keeps the caret in the right place while a field re-formats
 * what the user types ("4084123" -> "4084 123", "12" -> "12 / "). Call
 * `remember(event.target)` in onChange BEFORE state updates; after the next
 * render the caret is put after the same number of digits it followed before.
 * Used by the card number, expiry and Mobile Money number inputs (R06).
 */
export const useDigitCaret = () => {
  const ref = useRef(null);
  const pending = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const want = pending.current;
    pending.current = null;
    if (!el || want == null || document.activeElement !== el) return;
    const value = el.value;
    let count = 0;
    let idx = 0;
    while (idx < value.length && count < want) {
      if (/\d/.test(value[idx])) count += 1;
      idx += 1;
    }
    // trailing separator (e.g. "12 / ") -> caret after it
    if (/^\D*$/.test(value.slice(idx))) idx = value.length;
    el.setSelectionRange(idx, idx);
  });

  const remember = (el) => {
    const before = el.value.slice(0, el.selectionStart ?? el.value.length);
    pending.current = (before.match(/\d/g) || []).length;
  };

  return { ref, remember };
};
