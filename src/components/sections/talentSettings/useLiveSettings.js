import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { STORAGE_KEYS } from '../../../constants/storageKeys.js';
import {
  fetchNotificationSettings,
  fetchSettingsOverview,
  saveAccount,
  saveNotificationSettings,
  savePreferences,
  savePrivacy,
  setProfilePaused,
} from '../../../services/settings.api.js';

const log = debug('useLiveSettings');

/*
 * Live data for /settings/* (services/settings.api.js). The page passes it to every section as `settings.live`:
 *   { status, overview, notifications, reload, patch(part, value), saveAccount, savePreferences(group, values),
 *     saveNotifications(body), savePrivacy(body), setPaused(bool) }
 * Sections render the drawn mock when `settings.live` is absent (`?demo=1`).
 * Every save resolves the server's answer and updates `overview` so the other sections see it at once.
 */
export const useLiveSettings = ({ enabled = true } = {}) => {
  // The profile menu usually loaded the overview already: start from it, refresh below.
  const [state, setState] = useState(() => {
    const cached = enabled ? overviewCache.data : null;
    return { status: enabled ? (cached ? 'ready' : 'loading') : 'off', overview: cached, notifications: null };
  });

  const load = useCallback(async () => {
    if (!enabled) return;
    setState((s) => ({ ...s, status: s.overview ? 'ready' : 'loading' }));
    try {
      const [overview, notifications] = await Promise.all([
        loadOverviewFresh(),
        fetchNotificationSettings().catch((err) => {
          log('notifications failed', err?.response?.status);
          return null;
        }),
      ]);
      setState({ status: 'ready', overview, notifications });
    } catch (err) {
      log('overview failed', err?.response?.status || err?.message);
      // Keep showing the cached overview if there is one.
      setState((s) => (s.overview ? s : { ...s, status: 'error' }));
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = useCallback(
    (part, value) => setState((s) => ({ ...s, overview: s.overview ? { ...s.overview, [part]: value } : s.overview })),
    []
  );

  if (!enabled) return null;

  return {
    ...state,
    reload: load,
    patch,
    saveAccount: async (fields) => {
      const account = await saveAccount(fields);
      invalidateAccountOverview();
      patch('account', account);
      // The shell (top nav, sidebar) reads the stored profile for the name.
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
        if (stored) {
          localStorage.setItem(
            STORAGE_KEYS.userProfile,
            JSON.stringify({ ...stored, firstName: account.firstName, lastName: account.lastName })
          );
        }
      } catch {
        /* storage unavailable: the name updates on the next login */
      }
      return account;
    },
    savePreferences: async (group, values) => {
      const preferences = await savePreferences({ [group]: values });
      invalidateAccountOverview();
      patch('preferences', preferences);
      return preferences;
    },
    saveNotifications: async (body) => {
      const notifications = await saveNotificationSettings(body);
      setState((s) => ({ ...s, notifications }));
      return notifications;
    },
    savePrivacy: async (body) => {
      const privacy = await savePrivacy(body);
      patch('privacy', privacy);
      return privacy;
    },
    setPaused: async (paused) => {
      const res = await setProfilePaused(paused);
      setState((s) => ({ ...s, overview: s.overview ? { ...s.overview, paused: res.paused, pausedAt: res.pausedAt } : s.overview }));
      return res;
    },
  };
};

/* ---- Shell overlays (profile menu, log out): one cached overview, refreshed at most every 60s ---- */
let overviewCache = { at: 0, data: null, promise: null };

/** Forget the cached overview (after a save that changes the menu: name, language, …). */
export const invalidateAccountOverview = () => {
  overviewCache = { at: 0, data: null, promise: null };
};

/** A fresh overview; joins a request already in flight (the profile menu asks for the same one). */
const loadOverviewFresh = () => {
  if (!overviewCache.promise) {
    const pending = fetchSettingsOverview()
      .then((data) => {
        if (overviewCache.promise === pending) overviewCache = { at: Date.now(), data, promise: null };
        return data;
      })
      .catch((err) => {
        if (overviewCache.promise === pending) overviewCache.promise = null;
        throw err;
      });
    overviewCache.promise = pending;
  }
  return overviewCache.promise;
};

const loadOverviewCached = () => {
  if (overviewCache.data && Date.now() - overviewCache.at < 60_000) return Promise.resolve(overviewCache.data);
  if (!overviewCache.promise) {
    overviewCache.promise = fetchSettingsOverview()
      .then((data) => {
        overviewCache = { at: Date.now(), data, promise: null };
        return data;
      })
      .catch((err) => {
        overviewCache.promise = null;
        throw err;
      });
  }
  return overviewCache.promise;
};

/** `overview` (or null while loading / on failure / when disabled) for the shell overlays. */
export const useAccountOverview = ({ enabled = true } = {}) => {
  const [data, setData] = useState(overviewCache.data);
  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    loadOverviewCached()
      .then((d) => alive && setData(d))
      .catch((err) => log('overview (overlay) failed', err?.response?.status));
    return () => {
      alive = false;
    };
  }, [enabled]);
  return enabled ? data : null;
};
