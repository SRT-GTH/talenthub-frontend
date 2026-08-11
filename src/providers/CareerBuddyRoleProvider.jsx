import { useEffect, useMemo, useState } from 'react';
import { debug } from '../utils/debug.js';
import { CAREER_BUDDY_ROLE_STORAGE_KEY, CareerBuddyRoleContext } from './CareerBuddyRoleContext.js';

const log = debug('CareerBuddyRole');

/**
 * CareerBuddyRoleProvider — demo stand-in for the DB-tagged user role that
 * will eventually drive which Career Buddy experience mounts at the shared
 * `/profile/filling/career-buddy` route. Persists to localStorage so a
 * DemoNavigator role flip survives refresh.
 */
export default function CareerBuddyRoleProvider({ children }) {
  const [role, setRoleState] = useState(() => {
    const stored =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(CAREER_BUDDY_ROLE_STORAGE_KEY)
        : null;
    return stored === 'recruiter' ? 'recruiter' : 'talent';
  });

  useEffect(() => {
    log('mount', { role });
  }, [role]);

  const setRole = (next) => {
    const resolved = next === 'recruiter' ? 'recruiter' : 'talent';
    log('dispatch', { role: resolved });
    window.localStorage.setItem(CAREER_BUDDY_ROLE_STORAGE_KEY, resolved);
    setRoleState(resolved);
  };

  const value = useMemo(() => ({ role, setRole }), [role]);

  return (
    <CareerBuddyRoleContext.Provider value={value}>{children}</CareerBuddyRoleContext.Provider>
  );
}
