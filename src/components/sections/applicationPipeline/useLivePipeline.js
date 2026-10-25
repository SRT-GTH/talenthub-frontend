import { useCallback, useEffect, useMemo, useState } from 'react';
import { isLoggedIn } from '../../../services/auth.api.js';
import {
  cancelApplicationInterview,
  fetchMyJobs,
  fetchReceivedApplications,
  moveApplicationStage,
  scheduleApplicationInterview,
} from '../../../services/recruiterPipeline.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('useLivePipeline');

/*
 * useLivePipeline — data for the live recruiter board. Signed out it stays in demo mode (Figma content).
 * Every mutation calls the API and then reloads, so the board always shows what the backend has.
 *
 * Returns { status: demo | loading | live | error, jobs, jobId, setJobId, applications, busy, error,
 *           retry, move(appId, stage), schedule(appId, body), cancelInterview(appId, reason) }
 */
export const useLivePipeline = () => {
  const live = isLoggedIn();
  const [status, setStatus] = useState(live ? 'loading' : 'demo');
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [busy, setBusy] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async () => {
    const [j, a] = await Promise.all([fetchMyJobs(), fetchReceivedApplications()]);
    setJobs(j);
    setApplications(a);
    setJobId((cur) => {
      if (cur && j.some((x) => String(x._id || x.id) === cur)) return cur;
      // Default: the newest posting that has applications, else the newest posting.
      const withApps = j.find((x) => a.some((p) => String(p.resourceId) === String(x._id || x.id)));
      const first = withApps || j[0];
      return first ? String(first._id || first.id) : null;
    });
    return { jobs: j, applications: a };
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    setStatus('loading');
    load()
      .then(() => !cancelled && setStatus('live'))
      .catch((err) => {
        if (cancelled) return;
        log.error('load failed:', err?.response?.status || err?.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [live, attempt, load]);

  const run = useCallback(
    async (label, fn) => {
      setBusy(label);
      try {
        const out = await fn();
        await load();
        return out;
      } finally {
        setBusy(null);
      }
    },
    [load]
  );

  const move = useCallback(
    (appId, stage) => run(`move:${appId}`, () => moveApplicationStage(appId, stage)),
    [run]
  );
  const schedule = useCallback(
    (appId, body) => run(`schedule:${appId}`, () => scheduleApplicationInterview(appId, body)),
    [run]
  );
  const cancelInterview = useCallback(
    (appId, reason) => run(`cancel:${appId}`, () => cancelApplicationInterview(appId, reason)),
    [run]
  );

  return useMemo(
    () => ({
      status,
      live,
      jobs,
      jobId,
      setJobId,
      applications,
      busy,
      retry: () => setAttempt((n) => n + 1),
      move,
      schedule,
      cancelInterview,
    }),
    [status, live, jobs, jobId, applications, busy, move, schedule, cancelInterview]
  );
};
