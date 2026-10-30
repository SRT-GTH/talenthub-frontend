import { useEffect, useSyncExternalStore } from 'react';
import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { isLoggedIn } from './auth.api.js';
import { debug } from '../utils/debug.js';

const log = debug('spaces.api');

/*
 * Spaces: one account can hold several roles ("entities"), e.g. a parent who also has their own career profile.
 * Backend (auth.service, gateway /api/users):
 *   GET  /users/me/entities          { entities: [{ entityId, entityType, status, isCurrent?, ... }] }
 *   POST /users/me/entities          { entityType: 'talent' }  adds a role (+ its talent profile)
 *   PUT  /users/me/entities/switch   { entityId } -> { accessToken, currentEntity }
 * A switch issues a new access token for the other role; the refresh token stays the same (it follows the user's
 * current role on the server). After a switch the app reloads the page it lands on so every screen reads as the new role.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

let state = { status: 'idle', entities: [], error: null };
const listeners = new Set();
const emit = (next) => {
  state = next;
  listeners.forEach((l) => l());
};
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const tokenEntity = () => {
  try {
    const part = (localStorage.getItem(STORAGE_KEYS.authToken) || '').split('.')[1];
    const p = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
    return {
      entityId: String(p.currentEntityId || p.entityId || ''),
      entityType: p.entityType || null,
    };
  } catch {
    return { entityId: '', entityType: null };
  }
};

export const loadSpaces = async (force = false) => {
  if (!force && state.status !== 'idle') return state.entities;
  emit({ ...state, status: 'loading' });
  try {
    const data = unwrap(await api.get('/users/me/entities'));
    const current = tokenEntity().entityId;
    const entities = (data?.entities || [])
      .filter((e) => (e.status || 'active') === 'active')
      .map((e) => ({
        entityId: String(e.entityId || e.id || e._id),
        entityType: String(e.entityType || e.type || '').toLowerCase(),
        current: String(e.entityId || e.id || e._id) === current,
      }));
    emit({ status: 'ready', entities, error: null });
    log(
      'spaces',
      entities.map((e) => e.entityType)
    );
    return entities;
  } catch (err) {
    emit({ status: 'error', entities: [], error: err?.message || 'failed' });
    return [];
  }
};

/** { status, entities, parent, talent } — the account's parent and talent roles (null when absent). */
export const useSpaces = () => {
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
  useEffect(() => {
    if (isLoggedIn() && s.status === 'idle') loadSpaces();
  }, [s.status]);
  const find = (...types) => s.entities.find((e) => types.includes(e.entityType)) || null;
  return { ...s, parent: find('parent', 'guardian'), talent: find('talent') };
};

/** Switches the signed-in account to another of its roles and stores the new token. */
export const switchSpace = async (entityId) => {
  const data = unwrap(await api.put('/users/me/entities/switch', { entityId }));
  if (!data?.accessToken) throw new Error('Could not switch.');
  localStorage.setItem(STORAGE_KEYS.authToken, data.accessToken);
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
    if (user) {
      const t = data.currentEntity || {};
      localStorage.setItem(
        STORAGE_KEYS.userProfile,
        JSON.stringify({
          ...user,
          entityType: t.entityType,
          currentEntityId: t.entityId,
          entityId: t.entityId,
        })
      );
    }
  } catch {
    /* the token is what counts */
  }
  log('switched to', data.currentEntity?.entityType);
  emit({ status: 'idle', entities: [], error: null });
  return data.currentEntity;
};

/** Adds a talent role to this account (a parent building their own career profile) and switches to it. */
export const startCareerSpace = async () => {
  const spaces = await loadSpaces(true);
  let talent = spaces.find((e) => e.entityType === 'talent');
  if (!talent) {
    const data = unwrap(await api.post('/users/me/entities', { entityType: 'talent' }));
    talent = { entityId: String(data?.entity?.id), entityType: 'talent' };
  }
  return switchSpace(talent.entityId);
};
