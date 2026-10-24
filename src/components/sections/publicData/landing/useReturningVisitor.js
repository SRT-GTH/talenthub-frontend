import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { RETURNING_SAMPLE } from './data/landingData.js';
import { readLastSection } from './lastVisit.js';

const log = debug('useReturningVisitor');

/*
 * useReturningVisitor — { label, to } for the "Continue where you left off → …" chip, or null for a first visit.
 * ?state=returning (Figma 8.1.1b) forces the sample section; ?state=fallback never shows the chip; otherwise the localStorage memory of
 * lastVisit.js decides (read after mount, so the first paint is always the first-visit layout).
 */

export const useReturningVisitor = (state) => {
  const [remembered, setRemembered] = useState(null);

  useEffect(() => {
    const last = readLastSection();
    log('remembered', last);
    setRemembered(last);
  }, []);

  if (state === 'returning') return RETURNING_SAMPLE;
  if (state === 'fallback') return null;
  return remembered;
};
