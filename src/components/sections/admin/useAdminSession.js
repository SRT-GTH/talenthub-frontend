import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { readStaffSession } from '../../../services/adminSession.js';
import { BADGES, ROLE_IDS, STAFF, STAFF_STATUS_LINE } from './data/adminCoreData.js';
import { copyAccess, copyNavIds } from './siteCopy/copyAccess.js';

const log = debug('useAdminSession');

/*
 * useAdminSession — the signed-in staff member (real login, see services/adminSession.js). Returns
 * { signedIn, staff, role, entityType, user, badges, statusLine }. `role` is the screen id (super | senior | support | moderator).
 * `staff` keeps the persona-card shape: name, monogram and title come from the account; the role's chip / SLA / handbook copy
 * and stats come from adminCoreData until the home screen loads real numbers.
 */

const monogramOf = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || 'GT';

export const staffFromUser = (user, role) => {
  const base = STAFF[role] || STAFF.senior;
  const display =
    (user.metadata && user.metadata.displayName) ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    user.username ||
    user.email ||
    base.name;
  const parts = display.split(/\s+/).filter(Boolean);
  return {
    ...base,
    name: display,
    firstName: parts[0] || display,
    shortName: parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : display,
    monogram: monogramOf(display),
    title: base.roleLabel,
  };
};

/*
 * Mock role override for the Site copy area (Platform Admin 7.8): the backend has no Content Editor role and the area runs on mock data,
 * so `?role=editor|super|senior|support|moderator|dpo` picks the role of the screen INSIDE that area only (the paths below, and `/admin`
 * for the Content Editor home `?role=editor` / name-change home `?role=super&copy=1`). It needs a real staff session first and grants
 * nothing on real-data pages: everywhere else the role still comes from the account.
 */
const MOCK_ROLE_PREFIXES = ['/admin/site-copy', '/admin/product-names', '/admin/media'];
export const mockCopyRole = (pathname, search) => {
  const q = new URLSearchParams(search);
  const role = q.get('role');
  if (!role || !ROLE_IDS.includes(role)) return null;
  const path = pathname.replace(/\/+$/, '') || '/';
  const inArea = MOCK_ROLE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
  const home = path === '/admin' && (role === 'editor' || q.has('copy'));
  return inArea || home ? role : null;
};

export const useAdminSession = () => {
  const { pathname, search } = useLocation();
  return useMemo(() => {
    const s = readStaffSession();
    if (!s) {
      log('no staff session');
      return {
        signedIn: false,
        role: null,
        staff: STAFF.senior,
        badges: BADGES,
        statusLine: STAFF_STATUS_LINE,
      };
    }
    const mock = mockCopyRole(pathname, search);
    if (mock) {
      log('session (mock site-copy role)', { real: s.role, mock });
      return {
        signedIn: true,
        role: mock,
        mock: true,
        realRole: s.role,
        user: s.user,
        staff: STAFF[mock],
        badges: BADGES,
        statusLine: STAFF_STATUS_LINE,
        copy: copyAccess(mock),
        copyNav: copyNavIds(mock),
      };
    }
    log('session', { role: s.role });
    return {
      signedIn: true,
      role: s.role,
      entityType: s.entityType,
      entityId: s.entityId,
      user: s.user,
      staff: staffFromUser(s.user, s.role),
      badges: BADGES,
      statusLine: STAFF_STATUS_LINE,
      copy: copyAccess(s.role),
      copyNav: copyNavIds(s.role),
    };
    // Re-read on navigation so a sign-in / sign-out shows up without a reload.
  }, [pathname, search]);
};
