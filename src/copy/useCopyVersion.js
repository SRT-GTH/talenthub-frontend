import { useSyncExternalStore } from 'react';
import { getCopyState, subscribeCopy } from './copyBundle.js';

/**
 * useCopyVersion() — re-renders the caller when newly published site copy arrives (copyBundle refreshes every minute while the tab
 * is visible). Used once at the app root so pages already open pick up bound copy (copyBind.js) without a reload.
 */
export const useCopyVersion = () =>
  useSyncExternalStore(
    subscribeCopy,
    () => getCopyState().version,
    () => getCopyState().version
  );
