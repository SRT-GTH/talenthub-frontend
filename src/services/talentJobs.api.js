import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('talentJobs.api');

/*
 * Talent Job Postings (/job-postings) data, 2026-10-18. Backend: opportunityMatch talentJobs.mixin.
 *
 *   GET    /guidance/jobs                   feed: every open posting scored for me + my saved / applied state
 *   GET    /guidance/jobs/:id               one posting with about, requirements and the recruiter's display name
 *   POST   /guidance/jobs/:id/apply         apply with my GTH profile ({ hiddenSections })
 *   POST   /guidance/bookmarks              save a posting ({ contentType: 'opportunity', contentId, contentTitle })
 *   DELETE /guidance/bookmarks/:bookmarkId  unsave
 *   POST   /applications/:id/withdraw       withdraw an application ({ reason })
 *   GET    /profiles/me                     my profile, for the apply preview ("what they will see")
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchTalentJobs = async () => {
  const feed = unwrap(await api.get('/guidance/jobs'));
  if (!feed || !Array.isArray(feed.jobs)) {
    const err = new Error('Job feed unavailable');
    err.code = 'UNAVAILABLE';
    throw err;
  }
  log('feed', { jobs: feed.jobs.length, counts: feed.counts });
  return feed;
};

export const fetchTalentJob = async (id) => unwrap(await api.get(`/guidance/jobs/${id}`));

export const applyToJob = async (id, hiddenSections = []) =>
  unwrap(await api.post(`/guidance/jobs/${id}/apply`, { hiddenSections }));

export const saveJob = async (job) =>
  unwrap(
    await api.post('/guidance/bookmarks', {
      contentType: 'opportunity',
      contentId: job.id,
      contentTitle: job.title,
    })
  );

export const unsaveJob = async (bookmarkId) =>
  unwrap(await api.delete(`/guidance/bookmarks/${bookmarkId}`));

export const withdrawApplication = async (applicationId, reason) =>
  unwrap(await api.post(`/applications/${applicationId}/withdraw`, reason ? { reason } : {}));

export const fetchMyProfile = async () => {
  try {
    const res = unwrap(await api.get('/profiles/me'));
    const profile = res?.profile || res || null;
    if (!profile) return null;
    // Location lives on the user record for some talents (same fallback as the /profile hero).
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null') || {};
    } catch {
      user = {};
    }
    return {
      ...profile,
      locality: profile.locality || user.locality || null,
      district: profile.district || user.district || null,
    };
  } catch (err) {
    log.error('profile for preview failed:', err?.response?.status || err?.message);
    return null;
  }
};
