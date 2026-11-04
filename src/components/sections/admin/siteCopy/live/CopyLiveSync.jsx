import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { COPY_LIVE_EVENT, hydrateCopy, hydrateNames, isCopyLive } from './copyLive.js';

const log = debug('CopyLiveSync');

/*
 * CopyLiveSync — loads the Site copy area from the backend when live mode is on (see copyLive.js) and shows what went wrong
 * when a save, publish or load fails (a small toast at the bottom of the page; the screens themselves stay as drawn).
 * Props: area — the Product names area also loads the names.
 */
const CopyLiveSync = ({ area }) => {
  const [toast, setToast] = useState(null);
  const live = isCopyLive();

  useEffect(() => {
    if (!live) return;
    hydrateCopy().catch(() => undefined);
    if (area === 'product-names' || area === 'home') hydrateNames();
  }, [live, area]);

  useEffect(() => {
    const on = (e) => {
      log('event', e.detail);
      setToast(e.detail);
    };
    window.addEventListener(COPY_LIVE_EVENT, on);
    return () => window.removeEventListener(COPY_LIVE_EVENT, on);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), toast.type === 'error' ? 8000 : 2500);
    return () => window.clearTimeout(id);
  }, [toast]);

  if (!toast || toast.type !== 'error') return null;
  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 z-50 max-w-[560px] -translate-x-1/2 rounded-xl bg-[#3b1d1a] px-4 py-3 text-sm text-white shadow-lg"
    >
      {toast.message}
      <button
        type="button"
        onClick={() => setToast(null)}
        className="ml-3 font-semibold underline underline-offset-2"
      >
        Dismiss
      </button>
    </div>
  );
};

export default CopyLiveSync;
