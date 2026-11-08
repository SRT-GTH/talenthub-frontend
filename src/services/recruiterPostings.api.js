import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('recruiterPostings.api');

/*
 * One posting of the signed-in recruiter (posting detail, edit, close).
 *
 *   GET    /opportunities/:id                       the posting (drafts: owner only)
 *   GET    /applications/pipeline/:id               { stages: { submitted: n, ... }, totalApplications }
 *   PUT    /opportunities/:id                       { updates }  owner fields only; ignoredFields come back
 *   POST   /opportunities/:id/publish               publish a draft (posting limit, wording, moderation)
 *   POST   /opportunities/:id/close                 { tell: message | keep | nothing }
 *   POST   /opportunities/from-buddy                { form, asDraft: true }  Save as draft
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchPosting = async (id) => {
  const out = unwrap(await api.get(`/opportunities/${id}`));
  return out?.opportunity || out || null;
};

export const fetchPostingPipeline = async (id) => {
  const out = unwrap(await api.get(`/applications/pipeline/${id}`));
  return { stages: out?.stages || {}, total: Number(out?.totalApplications) || 0 };
};

export const updatePosting = async (id, updates) => {
  const out = unwrap(await api.put(`/opportunities/${id}`, { updates }));
  log('updated', id, Object.keys(updates));
  return out?.opportunity || out;
};

export const publishPosting = async (id) => unwrap(await api.post(`/opportunities/${id}/publish`));

export const closePosting = async (id, tell = 'nothing') => {
  const out = unwrap(await api.post(`/opportunities/${id}/close`, { tell }));
  log('closed', id, tell, out?.told);
  return out;
};

/* Saved job templates (yours). GET /opportunities/templates?mine=true, POST /opportunities/templates. */
export const fetchMyTemplates = async () => {
  const out = unwrap(
    await api.get('/opportunities/templates', { params: { mine: true, limit: 100 } })
  );
  return Array.isArray(out?.templates) ? out.templates : [];
};

/** { name, category?, description?, fromOpportunityId? | fields? } */
export const saveTemplate = async (body) => {
  const out = unwrap(await api.post('/opportunities/templates', body));
  log('template saved', out?.template?.id || out?.template?._id);
  return out?.template;
};

export const saveDraftFromForm = async (form) => {
  const out = unwrap(await api.post('/opportunities/from-buddy', { form, asDraft: true }));
  log('draft saved', out?.opportunity?.id);
  return out;
};
