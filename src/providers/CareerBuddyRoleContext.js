import { createContext } from 'react';

/**
 * Shared context for Career Buddy talent / recruiter / parent role.
 * Split from the Provider so react-refresh/only-export-components stays happy.
 */

/** @typedef {'talent' | 'recruiter' | 'parent'} CareerBuddyRole */

export const CAREER_BUDDY_ROLE_STORAGE_KEY = 'gth.careerBuddy.role';

export const CareerBuddyRoleContext = createContext({
  role: /** @type {CareerBuddyRole} */ ('talent'),
  setRole: /** @type {(role: CareerBuddyRole) => void} */ (() => {}),
});
