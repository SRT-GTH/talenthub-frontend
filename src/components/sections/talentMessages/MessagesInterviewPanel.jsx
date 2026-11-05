import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { fetchTalentJob } from '../../../services/talentJobs.api.js';
import { respondToInterview } from '../../../services/interviews.api.js';
import JobInterviewPanel from '../talentJobs/JobInterviewPanel.jsx';

const log = debug('MessagesInterviewPanel');

/*
 * MessagesInterviewPanel — the live interview card inside a recruiter conversation (T-MSG-08/09).
 *
 * The conversation's job card only knows the job id and whether the talent applied, so this loads the job
 * (GET /guidance/jobs/:id, which carries the talent's application and its open interview) and reuses the
 * job detail screen's JobInterviewPanel: pick a time, accept, suggest other times, add to calendar, ask
 * for a change. Replies go to POST /applications/:id/interview/respond, then the job reloads.
 * Renders nothing when there is no interview.
 */
const MessagesInterviewPanel = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(
    () =>
      fetchTalentJob(jobId)
        .then((j) => setJob(j?.job || j || null))
        .catch((err) => log.error('job failed:', err?.response?.status || err?.message)),
    [jobId]
  );

  useEffect(() => {
    if (!jobId) return undefined;
    let live = true;
    fetchTalentJob(jobId)
      .then((j) => live && setJob(j?.job || j || null))
      .catch((err) => log.error('job failed:', err?.response?.status || err?.message));
    return () => {
      live = false;
    };
  }, [jobId]);

  if (!job?.application?.interview) return null;

  // The same shape JobInterviewPanel gets from useLiveJobs.
  const jobs = {
    data: {
      busy,
      respondInterview: (id, body) => {
        setBusy(`interview:${id}`);
        return respondToInterview(job.application.id, body)
          .then(load)
          .finally(() => setBusy(null));
      },
    },
  };

  return (
    <div className="my-3">
      <JobInterviewPanel job={job} jobs={jobs} />
    </div>
  );
};

export default MessagesInterviewPanel;
