import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isLoggedIn } from '../../../services/auth.api.js';
import {
  applyToJob,
  fetchTalentJob,
  fetchMyProfile,
  fetchTalentJobs,
  saveJob,
  unsaveJob,
  withdrawApplication,
} from '../../../services/talentJobs.api.js';
import { respondToInterview } from '../../../services/interviews.api.js';
import { debug } from '../../../utils/debug.js';
import { applyJobsData, jobById } from './talentJobsData.js';
import { buildJobsData, buildProfilePreview, mergeJobDetail } from './talentJobsLive.js';

const log = debug('useLiveJobs');

/*
 * Live data for /job-postings (2026-10-18). A logged-in talent sees their real feed; `?demo=1` or a
 * logged-out visit keeps the Figma demo. Every mutation (save, apply, withdraw) calls the API and then
 * reloads the feed, so counts, tabs and the detail screen always reflect what the backend has.
 *
 * Returns { status: demo|loading|live|error, version, live, retry, toggleSave, apply, withdraw, respondInterview,
 * loadDetail, busy, error }. `version` changes whenever the data bindings were swapped (use as a key).
 */
export const useLiveJobs = () => {
  const [params] = useSearchParams();
  const live = params.get('demo') !== '1' && isLoggedIn();
  const [state, setState] = useState({ status: live ? 'loading' : 'demo', version: 0 });
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(null);
  const feedRef = useRef(null);
  const dataRef = useRef(null);
  const detailsRef = useRef({});
  const previewRef = useRef(null);

  const install = useCallback((feed) => {
    feedRef.current = feed;
    let data = buildJobsData(feed);
    if (previewRef.current) data = { ...data, PROFILE_PREVIEW: previewRef.current };
    // Keep detail payloads (about, recruiter) fetched earlier across feed reloads.
    for (const job of Object.values(detailsRef.current).filter((x) => x.title)) {
      const fresh = feed.jobs.find((j) => j.id === job.id);
      data = mergeJobDetail(
        data,
        fresh ? { ...job, ...fresh, about: job.about, recruiter: job.recruiter } : job,
        feed.jobs
      );
    }
    dataRef.current = data;
    applyJobsData(data);
    setState((s) => ({ status: 'live', version: s.version + 1 }));
  }, []);

  const reload = useCallback(async () => {
    const feed = await fetchTalentJobs();
    install(feed);
    return feed;
  }, [install]);

  useEffect(() => {
    if (!live) {
      applyJobsData(null);
      setState((s) => ({ status: 'demo', version: s.version + 1 }));
      return undefined;
    }
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));
    Promise.all([fetchTalentJobs(), fetchMyProfile()])
      .then(([feed, profile]) => {
        if (cancelled) return;
        previewRef.current = buildProfilePreview(profile);
        install(feed);
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('feed load failed:', err?.response?.status || err?.code || err?.message);
        setState((s) => ({ ...s, status: 'error' }));
      });
    return () => {
      cancelled = true;
      // Leaving the page restores the demo bindings so other demo-only screens never see stale live data.
      applyJobsData(null);
    };
  }, [live, attempt, install]);

  const run = useCallback(
    async (label, fn) => {
      setBusy(label);
      try {
        const out = await fn();
        await reload();
        return out;
      } finally {
        setBusy(null);
      }
    },
    [reload]
  );

  const toggleSave = useCallback(
    (id) => {
      if (!live) return Promise.resolve(null);
      const job = jobById(id);
      if (!job) return Promise.resolve(null);
      log('toggle save', id, Boolean(job.bookmarkId));
      return run(`save:${id}`, () => (job.bookmarkId ? unsaveJob(job.bookmarkId) : saveJob(job)));
    },
    [live, run]
  );

  const apply = useCallback(
    (id, hiddenSections = []) => {
      log('apply', id, hiddenSections);
      return run(`apply:${id}`, () => applyToJob(id, hiddenSections));
    },
    [run]
  );

  const withdraw = useCallback(
    (id, reason) => {
      const appId = jobById(id)?.application?.id;
      if (!appId) return Promise.reject(new Error('No application to withdraw'));
      log('withdraw', id, reason);
      return run(`withdraw:${id}`, () => withdrawApplication(appId, reason));
    },
    [run]
  );

  // Interview reply (accept / suggest times / ask to change), then the feed reloads.
  const respondInterview = useCallback(
    (id, body) => {
      const appId = jobById(id)?.application?.id;
      if (!appId) return Promise.reject(new Error('No application for this job'));
      log('interview reply', id, body?.action);
      return run(`interview:${id}`, () => respondToInterview(appId, body));
    },
    [run]
  );

  const loadDetail = useCallback(
    async (id) => {
      if (!live || !id || !dataRef.current || detailsRef.current[id]) return;
      detailsRef.current[id] = { id }; // in flight: never fetch the same posting twice
      try {
        const job = await fetchTalentJob(id);
        if (!job) return;
        detailsRef.current[id] = job;
        const data = mergeJobDetail(dataRef.current, job, feedRef.current?.jobs || []);
        dataRef.current = data;
        applyJobsData(data);
        setState((s) => ({ ...s, version: s.version + 1 }));
      } catch (err) {
        delete detailsRef.current[id];
        log.error('detail load failed:', err?.response?.status || err?.message);
      }
    },
    [live]
  );

  return useMemo(
    () => ({
      ...state,
      live,
      busy,
      retry: () => setAttempt((n) => n + 1),
      toggleSave,
      apply,
      withdraw,
      respondInterview,
      loadDetail,
    }),
    [state, live, busy, toggleSave, apply, withdraw, respondInterview, loadDetail]
  );
};
