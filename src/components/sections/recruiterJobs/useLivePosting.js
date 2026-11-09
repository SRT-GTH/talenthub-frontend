import { useCallback, useEffect, useState } from 'react';
import { isRecruiterSession } from '../../../services/recruiterShell.api.js';
import { fetchPosting, fetchPostingPipeline } from '../../../services/recruiterPostings.api.js';
import { debug } from '../../../utils/debug.js';
import { ago } from '../jobPostings/useLivePostings.js';
import { fromOpportunity, placeLabel, splitDescription } from './liveJobForm.js';

const log = debug('useLivePosting');

/*
 * useLivePosting(postingId) - one of the signed-in recruiter's postings for the posting detail page
 * (/recruiter/job-postings/:id) and Edit posting (/:id/edit). Demo ids (signed out, or "senior-ux-designer")
 * return { status: 'demo' } and the pages keep their Figma content.
 *
 *   view   what PostingDetailPage draws: title, status, chips, stats, about, skills, pipeline rows, share link
 *   values the Edit posting form values (liveJobForm fromOpportunity)
 *   raw    the stored posting (Edit posting sends only what changed)
 */

const isObjectId = (id) => /^[a-f0-9]{24}$/i.test(String(id || ''));

const STATUS_LABEL = {
  published: 'Active',
  draft: 'Draft',
  paused: 'Paused',
  expired: 'Closed',
  filled: 'Closed',
};
const TYPE_LABEL = {
  'full-time-job': 'Full-time',
  internship: 'Internship',
  'training-program': 'Training programme',
  'government-program': 'National Service (NSS)',
  'international-opportunity': 'International',
};
const PER = {
  monthly: '/ month',
  yearly: '/ yr',
  hourly: '/ hour',
  weekly: '/ week',
  'project-based': '/ project',
};

const money = (n) => Number(n).toLocaleString('en-GH', { maximumFractionDigits: 0 });
const payLabel = (s) => {
  if (!s || (s.min == null && s.max == null)) return '';
  const range =
    s.min != null && s.max != null && s.min !== s.max
      ? `${money(s.min)}–${money(s.max)}`
      : money(s.min ?? s.max);
  return `${s.currency || 'GHS'} ${range} ${PER[s.type] || ''}`.trim();
};
const dayLabel = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const PIPELINE_ROWS = [
  { label: 'Applied', stages: ['submitted'], color: '#575755' },
  { label: 'Screening', stages: ['under_review'], color: '#3b5bdb' },
  { label: 'Shortlisted', stages: ['shortlisted'], color: '#387440' },
  { label: 'Interview', stages: ['interview_scheduled', 'interviewed'], color: '#c8951a' },
  {
    label: 'Offer extended',
    stages: ['offer_pending', 'offer_extended', 'accepted'],
    color: '#387440',
  },
  { label: 'Not progressed', stages: ['rejected'], color: '#c0392b' },
];

export const toPostingView = (opp, pipeline = { stages: {}, total: 0 }) => {
  const count = (stages) => stages.reduce((n, s) => n + (Number(pipeline.stages[s]) || 0), 0);
  const withdrawn = Number(pipeline.stages.withdrawn) || 0;
  const total = Math.max(0, pipeline.total - withdrawn);
  const awaiting = count(['submitted', 'under_review']);
  const views = Number(opp.viewCount ?? opp.views ?? opp.metadata?.viewCount) || 0;
  const status = STATUS_LABEL[opp.status] || 'Closed';
  const closes = opp.deadlineDate ? `Closes ${dayLabel(opp.deadlineDate)}` : '';
  const placeText = placeLabel(opp.location) || 'Ghana';
  const setup = { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' }[opp.location?.type];
  const posted = opp.publishDate || opp.createdAt;
  const { about, responsibilities } = splitDescription(opp.description);
  const id = String(opp._id || opp.id);
  return {
    id,
    title: opp.title || 'Untitled posting',
    status,
    statusKey: opp.status,
    company: opp.company?.name || '',
    posted: [
      status === 'Draft'
        ? 'Draft, not published'
        : posted
          ? `Posted ${ago(posted).toLowerCase()} by you`
          : '',
      closes,
    ]
      .filter(Boolean)
      .join(' · '),
    chips: [
      [placeText, setup && !placeText.startsWith('Remote') ? setup : '']
        .filter(Boolean)
        .join(' · '),
      TYPE_LABEL[opp.type] || 'Job',
      payLabel(opp.salary),
      closes,
    ],
    stats: [
      {
        label: 'Total applicants',
        value: String(total),
        note: total ? `${awaiting} not reviewed yet` : 'No applicants yet',
        tone: 'good',
      },
      {
        label: 'Awaiting review',
        value: String(awaiting),
        note: awaiting ? 'Submitted or in screening' : 'All caught up',
        tone: awaiting ? 'warn' : 'good',
      },
      {
        label: 'Shortlisted',
        value: String(count(['shortlisted'])),
        note: 'In your shortlist',
        tone: 'good',
      },
      {
        label: 'Views',
        value: money(views),
        note: views ? `${Math.round((total / views) * 100)}% applied` : 'No views yet',
        tone: 'good',
      },
    ],
    about,
    responsibilities,
    skills: (opp.skills || [])
      .map((s) =>
        typeof s === 'string'
          ? { name: s, required: true }
          : { name: s?.name, required: s?.isRequired !== false }
      )
      .filter((s) => s.name),
    pipeline: {
      total: `${total} applicant${total === 1 ? '' : 's'}`,
      rows: PIPELINE_ROWS.map((r) => ({ label: r.label, value: count(r.stages), color: r.color })),
    },
    share: `${window.location.origin}/jobs/${id}`,
    applicantCount: total,
  };
};

export const useLivePosting = (postingId) => {
  const live = isRecruiterSession() && isObjectId(postingId);
  const [state, setState] = useState({ status: live ? 'loading' : 'demo' });

  const load = useCallback(async () => {
    const [opp, pipeline] = await Promise.all([
      fetchPosting(postingId),
      fetchPostingPipeline(postingId).catch(() => ({ stages: {}, total: 0 })),
    ]);
    if (!opp) throw Object.assign(new Error('not found'), { code: 404 });
    return {
      status: 'live',
      raw: opp,
      view: toPostingView(opp, pipeline),
      values: fromOpportunity(opp),
    };
  }, [postingId]);

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    load()
      .then((next) => alive && setState(next))
      .catch((err) => {
        const code = err?.response?.status || err?.code;
        log.error('load failed:', code || err?.message);
        if (alive) setState({ status: code === 404 || code === 403 ? 'missing' : 'error' });
      });
    return () => {
      alive = false;
    };
  }, [live, load]);

  const reload = useCallback(() => load().then(setState), [load]);
  return { ...state, reload };
};
