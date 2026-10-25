import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('adminSession');

/*
 * The signed-in GTH staff member, read from the normal login session (auth.api verifyLoginOtp stores the token and user).
 * Staff are users whose entityType is one of the backend staff types (services/adminAccount.service.js):
 *   super_admin -> 'super', senior_admin -> 'senior', support_agent -> 'support', content_moderator -> 'moderator'.
 * The Platform Admin screens use the short ids. There is no Data Protection Officer type in the backend yet.
 */

export const STAFF_ROLE_BY_TYPE = {
  super_admin: 'super',
  senior_admin: 'senior',
  support_agent: 'support',
  content_moderator: 'moderator',
};
export const STAFF_TYPE_BY_ROLE = Object.fromEntries(
  Object.entries(STAFF_ROLE_BY_TYPE).map(([type, role]) => [role, type]),
);

const decodeToken = (token) => {
  try {
    const part = String(token || '').split('.')[1];
    if (!part) return null;
    return JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
  } catch {
    return null;
  }
};

/** True when the entity type is a staff type. */
export const isStaffType = (entityType) => Boolean(STAFF_ROLE_BY_TYPE[String(entityType || '')]);

/**
 * The current staff session, or null when nobody (or a non-staff account) is signed in or the token has expired
 * past its refresh window (the api client renews access tokens itself; an expired token with a refresh token still counts).
 */
export const readStaffSession = () => {
  let token = null;
  let refresh = null;
  try {
    token = localStorage.getItem(STORAGE_KEYS.authToken);
    refresh = localStorage.getItem(STORAGE_KEYS.refreshToken);
  } catch {
    return null;
  }
  if (!token) return null;
  const claims = decodeToken(token) || {};
  if (claims.exp && claims.exp * 1000 < Date.now() && !refresh) return null;
  const user = readUser() || {};
  // Some accounts keep their role only in entities[] (top-level entityType unset): use the current / primary entity's type.
  const current = String(user.currentEntityId || user.entityId || claims.entityId || '');
  const ents = Array.isArray(user.entities) ? user.entities : [];
  const fromEntities =
    (ents.find((e) => String(e.entityId) === current) || ents.find((e) => isStaffType(e.entityType)) || {}).entityType;
  const entityType = [user.entityType, claims.entityType, fromEntities].find(isStaffType) || user.entityType || claims.entityType;
  if (!isStaffType(entityType)) {
    log('signed in, but not staff:', entityType);
    return null;
  }
  return { user, entityType, role: STAFF_ROLE_BY_TYPE[entityType], entityId: String(user.entityId || claims.entityId || '') };
};
