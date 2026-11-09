import { useEffect, useMemo, useState } from 'react';
import api from '../../../services/api.js';
import { fetchApplicationNotes } from '../../../services/recruiterPipeline.api.js';
import { snapshotOf } from '../applicationPipeline/pipelineLive.js';
import { debug } from '../../../utils/debug.js';

const log = debug('useLiveHomeExtras');

/*
 * useLiveHomeExtras - the recruiter home's Feedback, Recommended talents and In-demand skills cards, signed in.
 *
 *   Feedback (Give feedback): applications at "interviewed" with no interview-feedback note yet
 *     (GET /applications/:id/notes, noteType interview_feedback).
 *   Recommended talents: GET /guidance/opportunities/:id/talents for one of your open postings (best fit first,
 *     same privacy and minors rules as Talent Search).
 *   In-demand skills: GET /opportunities/stats/demand?region=&days=30 (postings on the platform by role).
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const TONES = [
  ['#ebf1ec', '#2a5730'],
  ['#f5f3ff', '#6d28d9'],
  ['#faf4e8', '#463409'],
  ['#eaeffb', '#244a9f'],
];
const tone = (id) => TONES[[...String(id)].reduce((n, c) => n + c.charCodeAt(0), 0) % TONES.length];
const initialsOf = (name) =>
  String(name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
const day = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        timeZone: 'Africa/Accra',
        day: 'numeric',
        month: 'short',
      })
    : '';

const nameOfApp = (app) => {
  const s = snapshotOf(app);
  return (
    [s.firstName, s.lastName].filter(Boolean).join(' ') || s.displayName || s.name || 'Candidate'
  );
};

const money = (n) => Number(n).toLocaleString('en-GH', { maximumFractionDigits: 0 });
export const skillsBands = (out) => {
  const row = (r) => ({
    name: r.name,
    pay: r.payMin
      ? `GH₵ ${money(r.payMin)}–${money(r.payMax)} / month`
      : `${r.postings} posting${r.postings === 1 ? '' : 's'}`,
    delta: r.delta === 'New' ? `+${r.postings}` : r.delta,
  });
  return [
    {
      id: 'hot',
      title: 'Hot',
      note: 'Most postings',
      tone: 'hot',
      rows: (out?.bands?.hot || []).map(row),
    },
    {
      id: 'warm',
      title: 'Warm',
      note: 'Steady demand',
      tone: 'warm',
      rows: (out?.bands?.warm || []).map(row),
    },
    {
      id: 'cooling',
      title: 'Cooling',
      note: 'Fewer postings than before',
      tone: 'cooling',
      rows: (out?.bands?.cooling || []).map(row),
    },
  ].filter((b) => b.rows.length);
};

export const useLiveHomeExtras = ({ isLive, apps, jobs, region }) => {
  const [notesByApp, setNotesByApp] = useState({});
  const [talents, setTalents] = useState({ status: 'idle', cards: [] });
  const [talentJobId, setTalentJobId] = useState('');
  const [skills, setSkills] = useState({ status: 'idle', bands: [], total: 0 });

  const openJobs = useMemo(
    () =>
      (jobs || [])
        .filter((j) => j.status === 'published')
        .map((j) => ({ id: String(j._id || j.id), title: j.title || 'Untitled' })),
    [jobs]
  );
  const jobId = talentJobId || openJobs[0]?.id || '';

  // Feedback: interviewed applications and whether a feedback note exists.
  const interviewed = useMemo(
    () => (apps || []).filter((a) => a.currentStage === 'interviewed'),
    [apps]
  );
  useEffect(() => {
    if (!isLive || !interviewed.length) return undefined;
    let alive = true;
    Promise.all(
      interviewed.map((a) =>
        fetchApplicationNotes(String(a._id))
          .then((notes) => [String(a._id), notes])
          .catch(() => [String(a._id), []])
      )
    ).then((pairs) => alive && setNotesByApp(Object.fromEntries(pairs)));
    return () => {
      alive = false;
    };
  }, [isLive, interviewed]);
  const pending = useMemo(
    () =>
      interviewed
        .filter(
          (a) => !(notesByApp[String(a._id)] || []).some((n) => n.noteType === 'interview_feedback')
        )
        .map((a) => {
          const id = String(a._id);
          const name = nameOfApp(a);
          const [bg, color] = tone(id);
          const last = [...(a.interviews || [])].reverse().find((i) => i?.scheduledAt);
          return {
            id,
            jobId: String(a.resourceId),
            initials: initialsOf(name),
            bg,
            color,
            name: `${name} · ${a.resourceTitle || 'Role'}`,
            due: last ? `Interviewed ${day(last.scheduledAt)}` : 'Interviewed',
          };
        }),
    [interviewed, notesByApp]
  );

  // Recommended talents for the chosen open posting.
  useEffect(() => {
    if (!isLive || !jobId) return undefined;
    let alive = true;
    setTalents((t) => ({ ...t, status: 'loading' }));
    api
      .get(`/guidance/opportunities/${jobId}/talents`, { params: { pageSize: 5 } })
      .then((res) => {
        const rows = unwrap(res)?.talents || [];
        const cards = rows.slice(0, 5).map((t) => {
          const [bg, color] = tone(t.profileId);
          return {
            id: String(t.profileId),
            initials: initialsOf(t.name),
            bg,
            color,
            name: t.name || 'Talent',
            sub: t.headline || t.educationLevel || 'GTH talent',
            fit: `${t.matchScore}% fit`,
            why: (t.reasons?.length ? t.reasons : t.topSkills || []).slice(0, 3),
          };
        });
        if (alive) setTalents({ status: cards.length ? 'live' : 'empty', cards });
      })
      .catch((err) => {
        log.error('recommended failed:', err?.response?.status);
        if (alive) setTalents({ status: 'empty', cards: [] });
      });
    return () => {
      alive = false;
    };
  }, [isLive, jobId]);

  // In-demand roles.
  useEffect(() => {
    if (!isLive) return undefined;
    let alive = true;
    setSkills((s) => ({ ...s, status: 'loading' }));
    api
      .get('/opportunities/stats/demand', { params: { days: 30, ...(region ? { region } : {}) } })
      .then((res) => {
        const out = unwrap(res);
        if (alive) setSkills({ status: 'live', bands: skillsBands(out), total: out?.total || 0 });
      })
      .catch((err) => {
        log.error('demand failed:', err?.response?.status);
        if (alive) setSkills({ status: 'error', bands: [], total: 0 });
      });
    return () => {
      alive = false;
    };
  }, [isLive, region]);

  return { pending, talents, jobId, setTalentJobId, openJobs, skills };
};
