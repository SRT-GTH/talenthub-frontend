import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('useOnlineStatus');

/*
 * useOnlineStatus() -> boolean   true while the browser reports a connection.
 * Reads navigator.onLine and follows the window "online" / "offline" events. `?state=offline` in the URL forces offline (the Figma frame
 * 8.9.3e, and a handy manual test). Must be used inside the router. Pair with <OfflineBanner /> and publicDataCache.js.
 */

const readNavigator = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false);

const useOnlineStatus = () => {
  const [params] = useSearchParams();
  const forced = params.get('state') === 'offline';
  const [online, setOnline] = useState(readNavigator);

  useEffect(() => {
    const on = () => {
      log('online');
      setOnline(true);
    };
    const off = () => {
      log('offline');
      setOnline(false);
    };
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return forced ? false : online;
};

export default useOnlineStatus;
