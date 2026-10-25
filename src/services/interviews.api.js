import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('interviews.api');

/*
 * Interview loop (Recruiter Buddy design, Iteration 4). Backend: application.service.
 *
 *   GET  /applications/interviews/upcoming        my open interviews (as applicant and as recruiter)
 *   POST /applications/:id/interview/respond      talent: { action: accept | propose | request_change, slots?, note? }
 *   POST /applications/:id/interview/cancel       recruiter: { reason? }
 *   GET  /applications/:id/interview.ics          calendar file for the open interview
 *
 * Interview view: { applicationId, interviewId, jobTitle, at, durationMin, format, meetingUrl, location,
 *                   status: proposed | confirmed | change_requested | cancelled, proposedSlots, responseNote }
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchUpcomingInterviews = async () => {
  const out = unwrap(await api.get('/applications/interviews/upcoming'));
  return Array.isArray(out?.interviews) ? out.interviews : [];
};

export const respondToInterview = async (applicationId, { action, slots, note } = {}) => {
  log('respond', applicationId, action, slots?.length || 0);
  return unwrap(
    await api.post(`/applications/${applicationId}/interview/respond`, {
      action,
      ...(slots && slots.length ? { slots } : {}),
      ...(note ? { note } : {}),
    })
  );
};

export const cancelInterview = async (applicationId, reason) =>
  unwrap(
    await api.post(`/applications/${applicationId}/interview/cancel`, reason ? { reason } : {})
  );

/** Downloads the .ics through the authed client and hands it to the browser. */
export const downloadInterviewIcs = async (applicationId) => {
  const res = await api.get(`/applications/${applicationId}/interview.ics`, {
    responseType: 'blob',
  });
  const blob = new Blob([res.data], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `interview-${applicationId}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Human copy for backend error codes. */
export const interviewErrorText = (err) => {
  const type = err?.response?.data?.type || err?.response?.data?.code;
  switch (type) {
    case 'SLOT_IN_PAST':
      return 'Pick times that are still ahead.';
    case 'SLOTS_REQUIRED':
    case 'TOO_MANY_SLOTS':
    case 'INVALID_SLOT':
      return 'Suggest one to three times.';
    case 'INVALID_INTERVIEW_STATE':
    case 'NO_OPEN_INTERVIEW':
      return 'This interview changed. Refresh to see the latest.';
    default:
      return 'That didn’t go through. Please try again.';
  }
};
