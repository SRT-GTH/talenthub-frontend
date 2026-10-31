import api from './api.js';

/*
 * Open data pages (/data/*) — backend services/publicData.service.js, no sign-in. National and regional figures only (the
 * agency portal's numbers, groups under 5 sent as 0 + suppressed). Districts, the Queries extras and saved queries stay
 * behind the agency sign-in. The server caches each answer for 5 minutes.
 */

const body = (res) => (res && res.data && res.data.data !== undefined ? res.data.data : res.data);
const clean = (o) =>
  Object.fromEntries(
    Object.entries(o || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );

export const publicOverview = (filters = {}) =>
  api.get('/public-data/overview', { params: clean(filters), timeout: 30000 }).then(body);
export const publicRegions = () => api.get('/public-data/regions', { timeout: 30000 }).then(body);
export const publicRegion = (regionId) =>
  api.get(`/public-data/regions/${encodeURIComponent(regionId)}`, { timeout: 30000 }).then(body);
export const publicCompare = (ids) =>
  api
    .get('/public-data/compare', { params: { regions: ids.join(',') }, timeout: 30000 })
    .then(body);
export const publicTrends = (range) =>
  api.get('/public-data/trends', { params: clean({ range }), timeout: 30000 }).then(body);
export const publicOutcomes = (range) =>
  api.get('/public-data/outcomes', { params: clean({ range }), timeout: 30000 }).then(body);
