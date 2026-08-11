import { useContext } from 'react';
import { CareerBuddyRoleContext } from '../providers/CareerBuddyRoleContext.js';

export function useCareerBuddyRole() {
  return useContext(CareerBuddyRoleContext);
}
