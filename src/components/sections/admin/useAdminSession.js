import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { readStaffSession } from '../../../services/adminSession.js';
import { BADGES, STAFF, STAFF_STATUS_LINE } from './data/adminCoreData.js';

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

export const useAdminSession = () => {
  const { pathname } = useLocation();
  return useMemo(() => {
    const s = readStaffSession();
    if (!s) {
      log('no staff session');
      return { signedIn: false, role: null, staff: STAFF.senior, badges: BADGES, statusLine: STAFF_STATUS_LINE };
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
    };
    // Re-read on navigation so a sign-in / sign-out shows up without a reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
};
