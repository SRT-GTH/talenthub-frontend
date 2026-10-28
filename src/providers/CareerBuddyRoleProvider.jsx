import { useEffect, useMemo, useState } from 'react';
import { debug } from '../utils/debug.js';
import { CAREER_BUDDY_ROLE_STORAGE_KEY, CareerBuddyRoleContext } from './CareerBuddyRoleContext.js';

const log = debug('CareerBuddyRole');

const VALID_ROLES = new Set(['talent', 'recruiter', 'parent']);

/**
 * CareerBuddyRoleProvider — demo stand-in for the DB-tagged user role that
 * drives which Career Buddy experience mounts at the shared
 * `/profile/filling/career-buddy` route. Persists to localStorage so a
 * DemoNavigator role flip survives refresh.
 */
export default function CareerBuddyRoleProvider({ children }) {
  const [role, setRoleState] = useState(() => {
    // `?role=parent|recruiter|talent` picks the experience from the URL (every Figma frame is a URL: the parent Career Buddy canvas 7958:183942); without it the stored choice applies.
    const fromUrl =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('role')
        : null;
    if (VALID_ROLES.has(fromUrl)) {
      window.localStorage.setItem(CAREER_BUDDY_ROLE_STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    const stored =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(CAREER_BUDDY_ROLE_STORAGE_KEY)
        : null;
    return VALID_ROLES.has(stored) ? stored : 'talent';
  });

  useEffect(() => {
    log('mount', { role });
  }, [role]);

  const setRole = (next) => {
    const resolved = VALID_ROLES.has(next) ? next : 'talent';
    log('dispatch', { role: resolved });
    window.localStorage.setItem(CAREER_BUDDY_ROLE_STORAGE_KEY, resolved);
    setRoleState(resolved);
  };

  const value = useMemo(() => ({ role, setRole }), [role]);

  return (
    <CareerBuddyRoleContext.Provider value={value}>{children}</CareerBuddyRoleContext.Provider>
  );
}
