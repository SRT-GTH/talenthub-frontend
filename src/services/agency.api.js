import api from './api.js';

/*
 * Government agency portal API (backend services/agency.service.js and governmentAccess.service.js).
 *   agency side:  GET /agency/me, GET /agency/overview?region=&edu=&interest=&age=&gender=
 *   admin side:   /admin/agencies (Super / Senior Admin): list, create (returns a one-time temporary password),
 *                 reset password, suspend / reactivate, access requests
 */

const body = (res) => (res && res.data && res.data.data !== undefined ? res.data.data : res.data);
const clean = (o) =>
  Object.fromEntries(
    Object.entries(o || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );

export const agencyMe = () => api.get('/agency/me').then(body);

export const agencyOverview = (filters = {}) =>
  api.get('/agency/overview', { params: clean(filters), timeout: 30000 }).then(body);

/* ---- Platform Admin › Agencies ---- */
export const adminListAgencies = () => api.get('/admin/agencies').then(body);
export const adminCreateAgency = (payload) => api.post('/admin/agencies', payload).then(body);
export const adminResetAgencyPassword = (entityId) =>
  api.post(`/admin/agencies/${entityId}/reset-password`, {}).then(body);
export const adminSetAgencyStatus = (entityId, status, reason) =>
  api.patch(`/admin/agencies/${entityId}/status`, clean({ status, reason })).then(body);
export const adminListAgencyRequests = (status) =>
  api.get('/admin/agencies/requests', { params: clean({ status }) }).then(body);
export const adminApproveAgencyRequest = (requestId, accessDurationMonths) =>
  api
    .post(`/admin/agencies/requests/${requestId}/approve`, clean({ accessDurationMonths }))
    .then(body);
export const adminDenyAgencyRequest = (requestId, reason) =>
  api.post(`/admin/agencies/requests/${requestId}/deny`, clean({ reason })).then(body);

/* ---- any signed-in account: change password (clears the must-change flag) ---- */
export const changeMyPassword = ({ currentPassword, newPassword }) =>
  api.post('/settings/password', { currentPassword, newPassword, logOutOthers: true }).then(body);
