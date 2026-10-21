import { useLayoutEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';

const log = debug('MessagesA11yAnchor');

/*
 * Anchor a fixed pop-over under a top-nav button (Figma A-01 / L-01: the panel hangs 8px below the trigger and is
 * right-aligned with it). The shared top-nav buttons are not edited, so they are found in the DOM:
 *   accessibility -> the "Accessibility mode" button, language -> the header button whose text is "EN".
 * Falls back to the Figma offsets (top 122 - 26 browser bar, right 205) when the button is hidden (phone).
 */
const FALLBACK = { top: 96, right: 24 };

export const findNavButton = (kind) => {
  const header = document.querySelector('header');
  if (!header) return null;
  if (kind === 'a11y') return header.querySelector('button[aria-label="Accessibility mode"]');
  return (
    Array.from(header.querySelectorAll('button')).find(
      (b) => !b.getAttribute('aria-label') && /^\s*EN\s*$/.test(b.textContent || '')
    ) || null
  );
};

export const useNavPopoverPos = (kind) => {
  const [pos, setPos] = useState(FALLBACK);
  useLayoutEffect(() => {
    const place = () => {
      const btn = findNavButton(kind);
      const rect = btn?.getBoundingClientRect();
      if (!rect || rect.width === 0) {
        log('anchor not found; fallback', kind);
        setPos(FALLBACK);
        return;
      }
      const next = {
        top: Math.round(rect.bottom + 8),
        right: Math.max(12, window.innerWidth - rect.right),
      };
      log('anchor', kind, next);
      setPos(next);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [kind]);
  return pos;
};
