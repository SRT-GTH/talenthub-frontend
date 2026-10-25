import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('recruiterPipeline.api');

/*
 * Recruiter Application Pipeline (/recruiter/application-pipeline), Recruiter Buddy design Iteration 4 F-2.
 * Backend: opportunity.service getByCreator, application.service.
 *
 *   GET  /opportunities/my/list                   my job postings (newest 20)
 *   GET  /applications/received?limit=100         applications sent to me (all jobs)
 *   PUT  /applications/:id/stage                  { stage } — recipient only
 *   POST /applications/:id/schedule-interview     { mode: book | offer, scheduledAt | offeredSlots, interviewType, … }
 *   POST /applications/:id/interview/cancel       { reason? }
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchMyJobs = async () => {
  const out = unwrap(await api.get('/opportunities/my/list'));
  const list = out?.opportunities || out?.items || (Array.isArray(out) ? out : []);
  log('jobs', list.length);
  return list;
};

export const fetchReceivedApplications = async () => {
  const out = unwrap(await api.get('/applications/received', { params: { limit: 100 } }));
  return Array.isArray(out?.applications) ? out.applications : [];
};

export const moveApplicationStage = async (applicationId, stage, notes) =>
  unwrap(
    await api.put(`/applications/${applicationId}/stage`, { stage, ...(notes ? { notes } : {}) })
  );

export const scheduleApplicationInterview = async (applicationId, body) =>
  unwrap(await api.post(`/applications/${applicationId}/schedule-interview`, body));

export const cancelApplicationInterview = async (applicationId, reason) =>
  unwrap(
    await api.post(`/applications/${applicationId}/interview/cancel`, reason ? { reason } : {})
  );

/** Human copy for backend error codes on the board. */
export const pipelineErrorText = (err) => {
  const type = err?.response?.data?.type || err?.response?.data?.code;
  switch (type) {
    case 'SLOT_IN_PAST':
      return 'Pick times that are still ahead.';
    case 'TOO_FEW_SLOTS':
    case 'TOO_MANY_SLOTS':
    case 'DUPLICATE_SLOT':
      return 'Offer 2 to 5 different times.';
    case 'PERMISSION_DENIED':
      return 'Only the recruiter who received this application can change it.';
    case 'NO_OPEN_INTERVIEW':
      return 'This interview changed. Refresh to see the latest.';
    default:
      return 'That didn’t go through. Please try again.';
  }
};

/**
 * Career Buddy draft card button: run a draft Buddy prepared (stage move or interview) with my own
 * login. POST /applications/agent-drafts/confirm { draftId } — single use, 30 minutes, mine only.
 */
export const confirmAgentDraft = async (draftId) =>
  unwrap(await api.post('/applications/agent-drafts/confirm', { draftId }));

export const draftErrorText = (err) => {
  const type = err?.response?.data?.type || err?.response?.data?.code;
  switch (type) {
    case 'DRAFT_EXPIRED':
      return 'This draft expired. Ask Career Buddy again.';
    case 'DRAFT_USED':
      return 'This was already done.';
    case 'DRAFT_INVALID':
    case 'PERMISSION_DENIED':
      return 'This draft can’t be used. Ask Career Buddy again.';
    default:
      return pipelineErrorText(err);
  }
};
