import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { BADGES, DEFAULT_ROLE, ROLE_IDS, STAFF, STAFF_STATUS_LINE } from './data/adminCoreData.js';

const log = debug('useAdminSession');
const STORAGE_KEY = 'gth-admin-role';

/*
 * useAdminSession — the mock "signed-in" staff session (⚠️ ASSUMPTION: frontend only, no real auth).
 * ?role=support|moderator|senior|super|dpo picks the role (default senior). A role picked once is remembered for the tab
 * (sessionStorage) so links without ?role keep it. Returns { staff, role, badges, statusLine, can(permission) }.
 */
const readStored = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const useAdminSession = () => {
  const [params] = useSearchParams();
  const raw = params.get('role');
  return useMemo(() => {
    let role = DEFAULT_ROLE;
    if (ROLE_IDS.includes(raw)) {
      role = raw;
      try {
        sessionStorage.setItem(STORAGE_KEY, raw);
      } catch {
        /* storage blocked: the role then lives in the URL only */
      }
    } else {
      const stored = readStored();
      if (ROLE_IDS.includes(stored)) role = stored;
    }
    log('session', { role });
    return { staff: STAFF[role], role, badges: BADGES, statusLine: STAFF_STATUS_LINE };
  }, [raw]);
};
