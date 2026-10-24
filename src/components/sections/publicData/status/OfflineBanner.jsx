import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { offlineBannerText } from './publicDataCache.js';
import { OFFLINE_COPY } from './data/statusData.js';
import { PublicIconStatusWifiOff } from './statusIcons.jsx';
import useOnlineStatus from './useOnlineStatus.js';

const log = debug('OfflineBanner');

/*
 * OfflineBanner — Figma "offline banner" 8508:353656 (1440x42, #2b2b28, p 12/40, between the top bar and the page body of 8.9.3e).
 * wifi-off 18px white · "You’re offline. Showing data saved at 09:12 today, so some numbers may be out of date." 14/500 white ·
 * "Retry connection" 14/600 #c1d4c4 on the right (wraps under the text on phones).
 * Mount ONCE in PublicDataFrame, directly under the top bar:  <OfflineBanner savedAt={cacheTimestamp} />
 * Props
 *   savedAt  number | Date | string   when the cached data was saved (loadCache(key).savedAt); omit for the drawn "09:12"
 *   onRetry  fn()                     custom retry; default: if the offline state is forced with ?state=offline the key is removed,
 *                                     otherwise the page reloads (⚠️ ASSUMPTION: no per-section refetch is drawn)
 *   forceVisible boolean              render even when online (galleries / tests)
 * Renders nothing while online (useOnlineStatus). role="status" + aria-live="polite" so the change is announced once.
 */

const OfflineBanner = ({ savedAt, onRetry, forceVisible = false }) => {
  const online = useOnlineStatus();
  const [params, setParams] = useSearchParams();
  if (online && !forceVisible) return null;

  const retry = () => {
    log('retry');
    if (onRetry) {
      onRetry();
      return;
    }
    if (params.get('state') === 'offline') {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('state');
          return next;
        },
        { replace: true }
      );
      return;
    }
    window.location.reload();
  };

  return (
    <div
      data-offline-banner=""
      role="status"
      aria-live="polite"
      className="flex flex-wrap items-center gap-x-[10px] gap-y-[6px] bg-[#2b2b28] px-[16px] py-[9px] font-sans md:px-[32px] xl:px-[40px]"
    >
      <PublicIconStatusWifiOff className="size-[18px] shrink-0 text-white" />
      <p className="m-0 min-w-0 flex-1 text-[14px] leading-[17px] font-medium text-white">
        {offlineBannerText(savedAt)}
      </p>
      <button
        type="button"
        onClick={retry}
        className="ml-auto cursor-pointer rounded-[6px] border-0 bg-transparent px-0 py-[3.5px] text-[14px] leading-[17px] font-semibold text-[#c1d4c4] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {OFFLINE_COPY.retry}
      </button>
    </div>
  );
};

export default OfflineBanner;
