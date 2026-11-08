import { useCallback, useEffect, useState } from 'react';
import api from '../../../services/api.js';
import { isRecruiterSession, refreshRecruiterShell } from '../../../services/recruiterShell.api.js';
import { fetchMyJobs, fetchReceivedApplications } from '../../../services/recruiterPipeline.api.js';
import { closePosting } from '../../../services/recruiterPostings.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('useLivePostings');

/*
 * useLivePostings - the signed-in recruiter's own postings for /recruiter/job-postings.
 * Signed out (or not a recruiter) it returns { status: 'demo' } and the page keeps its Figma cards.
 *
 *   GET    /opportunities/my/list        my postings (newest 20)
 *   GET    /applications/received        applications to me -> per-posting totals and "awaiting review"
 *   PUT    /opportunities/:id            { updates: { status } }  paused | expired (closed) | published (reopen / resume)
 *   POST   /opportunities/:id/close      { tell } close; "message" tells applicants not heard back yet
 *   DELETE /opportunities/:id            postings nobody applied to (409 HAS_APPLICANTS otherwise)
 *
 * Backend statuses: draft, published, paused, expired, filled. The cards show Active (published),
 * Draft, Paused, Closed (expired or filled). Every mutation reloads the list and the shell counts.
 */

const STATUS_LABEL = {
  published: 'Active',
  draft: 'Draft',
  paused: 'Paused',
  expired: 'Closed',
  filled: 'Closed',
};
const ACTION_FOR = {
  Active: 'View Pipeline',
  Draft: 'Continue Editing',
  Paused: 'Resume applications',
  Closed: 'View summary',
};
const AWAITING_STAGES = new Set(['submitted', 'under_review']);

const TYPE_LABEL = {
  'full-time-job': 'Full-Time',
  'part-time-job': 'Part-Time',
  internship: 'Internship',
  contract: 'Contract',
  volunteer: 'Volunteer',
  apprenticeship: 'Apprenticeship',
  nss: 'National Service',
};

const titleCase = (s) =>
  String(s || '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

export const ago = (iso, now = Date.now()) => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const mins = Math.max(0, Math.round((now - t) / 60000));
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return days === 1 ? '1 day ago' : `${days} days ago`;
  const weeks = Math.round(days / 7);
  if (days < 30) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  const months = Math.round(days / 30);
  return months <= 1 ? '1 month ago' : `${months} months ago`;
};

const iconFor = (job) => {
  if (job.type === 'internship' || /intern|graduate|trainee/i.test(job.title || ''))
    return 'hat-graduation';
  if (/design|ux|ui|creative|architect/i.test(job.title || '')) return 'pencil-ruler';
  return 'developer-board';
};

const placeOf = (loc = {}) => {
  if (loc.type === 'remote') return 'Remote';
  const where = [loc.city, loc.country === 'GH' || !loc.country ? 'Ghana' : loc.country]
    .filter(Boolean)
    .join(', ');
  return where || 'Ghana';
};

export const toPosting = (job, apps = []) => {
  const id = String(job._id || job.id);
  const status = STATUS_LABEL[job.status] || 'Closed';
  const mine = apps.filter((a) => String(a.resourceId) === id && a.currentStage !== 'withdrawn');
  const awaiting = mine.filter((a) => AWAITING_STAGES.has(a.currentStage)).length;
  const isDraft = status === 'Draft';
  return {
    id,
    icon: iconFor(job),
    title: job.title || 'Untitled posting',
    status,
    location: placeOf(job.location),
    type: TYPE_LABEL[job.type] || titleCase(job.type) || 'Job',
    age: ago(job.publishDate || job.createdAt),
    totalApplicants: isDraft ? '--' : String(mine.length),
    awaiting: isDraft ? '--' : String(awaiting),
    avgMatch: '--', // no match score per posting yet
    action: ACTION_FOR[status],
    applicantCount: mine.length,
    live: true,
  };
};

export const useLivePostings = () => {
  const live = isRecruiterSession();
  const [status, setStatus] = useState(live ? 'loading' : 'demo');
  const [postings, setPostings] = useState([]);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    const [jobs, apps] = await Promise.all([
      fetchMyJobs(),
      fetchReceivedApplications().catch(() => []),
    ]);
    setPostings(jobs.map((j) => toPosting(j, apps)));
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    load()
      .then(() => alive && setStatus('live'))
      .catch((err) => {
        log.error('load failed:', err?.response?.status || err?.message);
        if (alive) setStatus('error');
      });
    return () => {
      alive = false;
    };
  }, [live, load]);

  const run = useCallback(
    async (id, label, fn) => {
      setBusy(id);
      setError(null);
      try {
        await fn();
        log('done', label, id);
        await load();
        refreshRecruiterShell();
        return true;
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Something went wrong';
        log.error(label, 'failed:', err?.response?.status, msg);
        setError(msg);
        return false;
      } finally {
        setBusy(null);
      }
    },
    [load]
  );

  const setJobStatus = (id, next, label) =>
    run(id, label, () => api.put(`/opportunities/${id}`, { updates: { status: next } }));

  return {
    status,
    postings,
    busy,
    error,
    clearError: () => setError(null),
    pause: (id) => setJobStatus(id, 'paused', 'pause'),
    resume: (id) => setJobStatus(id, 'published', 'resume'),
    // tell: message (kind role-closed note to people not heard back yet) | keep | nothing
    close: (id, tell = 'nothing') => run(id, 'close', () => closePosting(id, tell)),
    reopen: (id) => setJobStatus(id, 'published', 'reopen'),
    remove: (id) => run(id, 'delete', () => api.delete(`/opportunities/${id}`)),
  };
};
