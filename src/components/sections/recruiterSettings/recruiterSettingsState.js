import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RECRUITER_SETTINGS_TAB_IDS } from './recruiterSettingsData.js';

/*
 * useRecruiterSettingsState - URL state of /recruiter/settings (every Figma frame is a URL; a frame reproduces from a fresh load).
 *   tab=account|organisation|team|hiring|notifications|billing|accessibility|language|security   (default account)
 *   modal=<id>   a dialog over the tab (logout, remove-member, ...)      state=<id>   a full-page result (logged-out) or a tab variant
 *   Any other key (toast, menu, help, role, ...) is owned by the tab that reads it: `get(key)` / `update({ key: value })`.
 * `update(patch, { replace })` merges into the live query string (null / '' removes a key), like parent/settings/settingsState.js.
 */
export const useRecruiterSettingsState = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const base = useMemo(() => {
    const tab = params.get('tab');
    const activeTab = RECRUITER_SETTINGS_TAB_IDS.includes(tab) ? tab : 'account';
    return {
      tab: activeTab,
      section: activeTab, // SettingsLayout reads `settings.section` to highlight the current nav item
      modal: params.get('modal') ?? '',
      state: params.get('state') ?? '',
    };
  }, [params]);

  const get = useCallback((key) => params.get(key) ?? '', [params]);

  const update = useCallback(
    (patch, { replace = false } = {}) => {
      const next = new URLSearchParams(window.location.search);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === '' || v === undefined) next.delete(k);
        else next.set(k, v);
      });
      navigate({ search: next.toString() }, { replace });
    },
    [navigate]
  );

  return { ...base, get, update };
};
