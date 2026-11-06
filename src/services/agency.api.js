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

/** Public: an agency asks for access (no sign-in). Reviewed in Platform Admin › Agencies. */
export const registerAgency = (payload) => api.post('/government/register', payload).then(body);

export const agencyOverview = (filters = {}) =>
  api.get('/agency/overview', { params: clean(filters), timeout: 30000 }).then(body);

export const agencyRegions = () => api.get('/agency/regions').then(body);
export const agencyHome = () => api.get('/agency/home', { timeout: 30000 }).then(body);
export const agencyWelcomeSeen = () => api.post('/agency/home/welcome-seen', {}).then(body);
export const agencyDistricts = (params) =>
  api.get('/agency/districts', { params: clean(params), timeout: 30000 }).then(body);
export const agencyDistrictsExport = (params) =>
  api.post('/agency/districts/export', clean(params), { timeout: 30000 }).then(body);
export const agencyTrends = (range) =>
  api.get('/agency/trends', { params: clean({ range }), timeout: 30000 }).then(body);
export const agencyDemand = (params) =>
  api.get('/agency/demand', { params: clean(params), timeout: 30000 }).then(body);
export const agencyDemandTrends = (params) =>
  api.get('/agency/demand/trends', { params: clean(params), timeout: 30000 }).then(body);
export const agencyDemandSuccess = (params) =>
  api.get('/agency/demand/success', { params: clean(params), timeout: 30000 }).then(body);
export const agencyReport = () => api.get('/agency/report', { timeout: 60000 }).then(body);
export const agencyOutcomes = (range) =>
  api.get('/agency/outcomes', { params: clean({ range }), timeout: 30000 }).then(body);
export const agencyRegion = (regionId) =>
  api.get(`/agency/regions/${regionId}`, { timeout: 30000 }).then(body);
export const agencyDistrict = (regionId, districtId) =>
  api.get(`/agency/regions/${regionId}/districts/${districtId}`, { timeout: 30000 }).then(body);
export const agencyCompare = (ids) =>
  api.get('/agency/compare', { params: { regions: ids.join(',') }, timeout: 30000 }).then(body);

export const agencySubscriptions = () => api.get('/agency/subscriptions').then(body);
export const agencySubscribe = (regionId, districtId) =>
  api.post('/agency/subscriptions', clean({ regionId, districtId })).then(body);
export const agencyUnsubscribe = (id) => api.delete(`/agency/subscriptions/${id}`).then(body);

/* ---- settings: profile, notifications, analysts, API keys, audit log ---- */
export const agencySettings = () => api.get('/agency/settings').then(body);
export const agencyUpdateProfile = (patch) =>
  api.patch('/agency/settings/profile', clean(patch)).then(body);
export const agencyUpdateNotifications = (patch) =>
  api.patch('/agency/settings/notifications', patch).then(body);
export const agencyUpdateCapabilities = (patch) =>
  api.patch('/agency/settings/capabilities', patch).then(body);
export const agencyUpdateMou = (patch) => api.patch('/agency/settings/mou', patch).then(body);
export const agencyAnalysts = () => api.get('/agency/analysts').then(body);
export const agencyInviteAnalyst = (payload) => api.post('/agency/analysts', payload).then(body);
export const agencySetAnalystRole = (userId, role) =>
  api.patch(`/agency/analysts/${userId}`, { role }).then(body);
export const agencyResetAnalyst = (userId) =>
  api.post(`/agency/analysts/${userId}/reset`, {}).then(body);
export const agencyRemoveAnalyst = (userId) => api.delete(`/agency/analysts/${userId}`).then(body);
export const agencyApiKeys = () => api.get('/agency/api-keys').then(body);
export const agencyCreateApiKey = (name, env) =>
  api.post('/agency/api-keys', { name, env }).then(body);
export const agencyRevokeApiKey = (id) =>
  api.delete(id ? `/agency/api-keys/${id}` : '/agency/api-keys').then(body);
export const agencyAudit = (params) =>
  api.get('/agency/audit', { params: clean(params) }).then(body);
export const agencyAuditExport = (tab) =>
  api.post('/agency/audit/export', { tab }, { timeout: 30000 }).then(body);

/* ---- queries: extra filter options, saved queries, CSV exports (each uses the MoU quota) ---- */
export const agencyFilterOptions = () => api.get('/agency/filters').then(body);
export const agencySavedQueries = () => api.get('/agency/queries').then(body);
export const agencySaveQuery = (payload) =>
  api.post('/agency/queries', payload, { timeout: 30000 }).then(body);
export const agencyUpdateQuery = (id, patch) =>
  api.patch(`/agency/queries/${id}`, patch).then(body);
export const agencyDeleteQuery = (id) => api.delete(`/agency/queries/${id}`).then(body);
export const agencyRefreshQuery = (id) =>
  api.post(`/agency/queries/${id}/refresh`, {}, { timeout: 30000 }).then(body);
export const agencyExportCsv = (payload) =>
  api.post('/agency/exports', payload, { timeout: 30000 }).then(body);

/* ---- data requests (programme manager + DPO approval, 30-day logged access) ---- */
export const agencyDataRequests = () => api.get('/agency/data-requests').then(body);
export const agencyDataRequest = (id) => api.get(`/agency/data-requests/${id}`).then(body);
export const agencyCreateDataRequest = (payload) =>
  api.post('/agency/data-requests', payload).then(body);
export const agencyDataRequestDetail = (id, detail) =>
  api.post(`/agency/data-requests/${id}/detail`, { detail }).then(body);
export const agencyWithdrawDataRequest = (id) =>
  api.post(`/agency/data-requests/${id}/withdraw`, {}).then(body);
export const agencyAppealDataRequest = (id, payload) =>
  api.post(`/agency/data-requests/${id}/appeal`, payload).then(body);
export const agencyExtendDataRequest = (id, reason) =>
  api.post(`/agency/data-requests/${id}/extend`, { reason, confirm: true }).then(body);
export const agencyRequestDataset = (id) =>
  api.get(`/agency/data-requests/${id}/dataset`, { timeout: 30000 }).then(body);
export const agencyDownloadRequest = (id) =>
  api.post(`/agency/data-requests/${id}/download`, {}, { timeout: 30000 }).then(body);
export const adminListDataRequests = (status) =>
  api.get('/admin/agencies/data-requests', { params: clean({ status }) }).then(body);
export const adminDecideDataRequest = (id, payload) =>
  api.post(`/admin/agencies/data-requests/${id}/decide`, payload).then(body);

/* MoU documents (backend services/agencyMou.service.js). Files travel as base64 JSON (PDF / JPG / PNG up to 10 MB) and are private. */
export const agencyMou = () => api.get('/agency/mou').then(body);
export const agencyMouUpload = (payload) =>
  api.post('/agency/mou/documents', payload, { timeout: 120000 }).then(body);
export const agencyMouDetails = (kind, details) =>
  api.put(`/agency/mou/details/${kind}`, { details }).then(body);
export const agencyMouRemove = (id) => api.delete(`/agency/mou/documents/${id}`).then(body);
export const agencyMouFile = (id) =>
  api.get(`/agency/mou/documents/${id}/file`, { timeout: 120000 }).then(body);
export const agencyMouSubmit = () => api.post('/agency/mou/submit', {}).then(body);
export const adminMouQueue = () => api.get('/admin/agencies/mou').then(body);
export const adminMouAgency = (entityId) => api.get(`/admin/agencies/${entityId}/mou`).then(body);
export const adminMouFile = (entityId, docId) =>
  api
    .get(`/admin/agencies/${entityId}/mou/documents/${docId}/file`, { timeout: 120000 })
    .then(body);
export const adminMouReviewDoc = (entityId, docId, payload) =>
  api.post(`/admin/agencies/${entityId}/mou/documents/${docId}/review`, payload).then(body);
export const adminMouDecide = (entityId, payload) =>
  api.post(`/admin/agencies/${entityId}/mou/decide`, payload).then(body);

/** Reads a picked file as base64 (without the data: prefix). */
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).replace(/^data:[^;]*;base64,/, ''));
    r.onerror = () => reject(r.error || new Error('Could not read the file'));
    r.readAsDataURL(file);
  });

/** Saves a {fileName, mime, content (base64)} file from the API (or shows it in win, a tab opened by the click). */
export const openApiFile = ({ fileName, mime, content }, win) => {
  const bytes = Uint8Array.from(atob(content), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: mime || 'application/octet-stream' }));
  if (win && !win.closed) {
    win.location.href = url;
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'document';
    document.body.append(a);
    a.click();
    a.remove();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

/** Saves a server-built CSV string as a file. */
export const saveCsv = (fileName, csv) => {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

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

/* ---- programmes (agencyProgrammes.service.js) ---- */
export const listProgrammes = () => api.get('/agency/programmes').then(body);
export const getProgramme = (id) => api.get(`/agency/programmes/${id}`).then(body);
export const createProgramme = (payload) => api.post('/agency/programmes', payload).then(body);
export const updateProgramme = (id, payload) =>
  api.patch(`/agency/programmes/${id}`, payload).then(body);
export const publishProgrammeApi = (id) =>
  api.post(`/agency/programmes/${id}/publish`, {}).then(body);
export const closeProgrammeApi = (id) => api.post(`/agency/programmes/${id}/close`, {}).then(body);
export const duplicateProgrammeApi = (id) =>
  api.post(`/agency/programmes/${id}/duplicate`, {}).then(body);
export const programmeAudience = (rules) =>
  api.post('/agency/programmes/audience', { rules }, { timeout: 30000 }).then(body);
export const programmeInsights = () => api.get('/agency/programmes/insights').then(body);
export const programmeSkills = () => api.get('/agency/programmes/skills').then(body);
export const programmeApplicants = (id) =>
  api.get(`/agency/programmes/${id}/applicants`).then(body);
export const moveApplicant = (id, appId, stage) =>
  api.post(`/agency/programmes/${id}/applicants/${appId}/stage`, { stage }).then(body);
