import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('settings.api');

/*
 * Talent Settings & Account API (backend services/talentSettings.service.js, gateway /api/settings).
 * Everything acts on the signed-in talent's own account.
 *
 *   GET  /settings/overview          { account, privacy, paused, preferences, passwordChangedAt, sessions, guardian }
 *   PUT  /settings/account           { firstName, lastName, phoneNumber, region, city } -> { account }
 *   PUT  /settings/preferences       { accessibility?, appearance?, language? } -> { preferences }
 *   GET|PUT /settings/notifications  { rows: { id: [inApp, email, sms, whatsapp] }, quiet, weekly, pause? }
 *   PUT  /settings/privacy           { visibility, see, employerCompanies } -> { privacy }
 *   POST /settings/blocked { kind, name, targetId? } · DELETE /settings/blocked/:id -> { blocked }
 *   PUT  /settings/pause { paused }  -> { paused, pausedAt }
 *   POST /settings/password { currentPassword, newPassword } -> { otherSessionsLoggedOut }
 *   GET  /settings/sessions · DELETE /settings/sessions/:id · POST /settings/sessions/revoke-others
 *   GET  /settings/export            JSON copy of the talent's data
 *   POST /settings/deactivate { confirm: 'DELETE' }   turns the account off (log back in to turn it on)
 *   POST /users/logout               ends this device's session
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const enc = encodeURIComponent;

/** Backend error message for the screen (validation / wrong password / …), or a generic one. */
export const settingsError = (err, fallback = 'Could not save. Try again.') =>
  err?.response?.data?.message || err?.response?.data?.error?.message || fallback;

export const fetchSettingsOverview = async () => {
  const data = unwrap(await api.get('/settings/overview'));
  log('overview', { sessions: data?.sessions?.length, visibility: data?.privacy?.visibility });
  return data;
};

export const saveAccount = async (fields) => unwrap(await api.put('/settings/account', fields))?.account;

export const savePreferences = async (patch) => unwrap(await api.put('/settings/preferences', patch))?.preferences;

export const fetchNotificationSettings = async () => unwrap(await api.get('/settings/notifications'))?.notifications;

export const saveNotificationSettings = async (body) =>
  unwrap(await api.put('/settings/notifications', body))?.notifications;

export const savePrivacy = async (body) => unwrap(await api.put('/settings/privacy', body))?.privacy;

export const blockSomeone = async ({ kind, name, targetId }) =>
  unwrap(await api.post('/settings/blocked', { kind, name, ...(targetId ? { targetId } : {}) }))?.blocked || [];

export const unblock = async (blockId) => unwrap(await api.delete(`/settings/blocked/${enc(blockId)}`))?.blocked || [];

export const setProfilePaused = async (paused) => unwrap(await api.put('/settings/pause', { paused }));

export const changePassword = async ({ currentPassword, newPassword, logOutOthers = true }) =>
  unwrap(await api.post('/settings/password', { currentPassword, newPassword, logOutOthers }));

export const fetchSessions = async () => unwrap(await api.get('/settings/sessions'))?.sessions || [];

export const logOutDevice = async (sessionId) => unwrap(await api.delete(`/settings/sessions/${enc(sessionId)}`));

export const logOutOtherDevices = async () => unwrap(await api.post('/settings/sessions/revoke-others'));

/** Downloads the export as gth-my-data-YYYY-MM-DD.json. */
export const downloadMyData = async () => {
  const data = unwrap(await api.get('/settings/export'));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gth-my-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  log('export downloaded', { bytes: blob.size });
  return blob.size;
};

export const deactivateAccount = async () => unwrap(await api.post('/settings/deactivate', { confirm: 'DELETE' }));

/** Server-side logout of this device (session revoked). Never throws: local logout must still happen. */
export const serverLogout = async () => {
  try {
    await api.post('/users/logout');
  } catch (err) {
    log('server logout failed', err?.response?.status);
  }
};
