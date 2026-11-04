import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { applyCopy } from './copySections.js';
import { fillTerms, getCopyState, loadCopyBundle, subscribeCopy } from './copyBundle.js';

/**
 * useCopySection(section) — the section's data with the published site copy applied (see copySections.js).
 * Renders the built-in text at once and swaps in the published text when the bundle arrives.
 */
export const useCopySection = (section) => {
  const copy = useSyncExternalStore(subscribeCopy, getCopyState, getCopyState);
  useEffect(() => {
    loadCopyBundle();
  }, []);
  const values = copy.blocks?.[section.key];
  return useMemo(
    () => applyCopy(section, values, (t) => fillTerms(t, copy.terms)),
    [section, values, copy.terms]
  );
};
