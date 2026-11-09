import api from './api.js';

/*
 * Screening criteria (recruiter Job Postings > Screening, Figma JS-01 … JS-14).
 *
 *   GET  /opportunities/my/list                   the recruiter's postings (to pick one)
 *   GET  /opportunities/:id/screening             { job, applicants, suggestions: { experience, region, skills } }
 *   POST /opportunities/:id/screening             { criteria } -> { screened, counts, meet, close, dont }
 *   GET  /recruiter/screening-criteria            { saved: [{ name, criteria, jobId, isDefault }] }
 *   PUT  /recruiter/screening-criteria            { name, criteria, jobId, isDefault } | { remove: name }
 *   PUT  /applications/:id/stage                  { stage: 'under_review' }  "Move to pipeline" (Screening column)
 * criteria: { experience?: { min, max? }, skills?: [names], education?: 'diploma'|'bachelors'|'masters', location?: { region } }
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchMyPostings = async () => {
  const out = unwrap(await api.get('/opportunities/my/list'));
  return out?.opportunities || [];
};

export const fetchScreeningSetup = async (id) =>
  unwrap(await api.get(`/opportunities/${id}/screening`));

export const runScreening = async (id, criteria) =>
  unwrap(await api.post(`/opportunities/${id}/screening`, { criteria }));

export const fetchSavedCriteria = async () =>
  unwrap(await api.get('/recruiter/screening-criteria'))?.saved || [];

export const saveCriteria = async (body) =>
  unwrap(await api.put('/recruiter/screening-criteria', body))?.saved || [];

/** Move applications to Screening; returns how many moved. */
export const moveToScreening = async (ids = []) => {
  let moved = 0;
  for (const id of ids) {
    try {
      await api.put(`/applications/${id}/stage`, { stage: 'under_review' });
      moved += 1;
    } catch {
      // keep going: one failure must not stop the rest
    }
  }
  return moved;
};
