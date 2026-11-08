import api from './api.js';
import { isLoggedIn } from './auth.api.js';
import { debug } from '../utils/debug.js';

const log = debug('recruiterShell.api');

/*
 * Recruiter shell data: who is signed in, for which organisation, on which plan, and the
 * headline counts the workspace rail, top bar and home show. Before this every recruiter
 * page drew the Figma demo person ("Kwame Asante, MTN Ghana, 128 applicants").
 *
 *   GET /recruiter/onboarding        name, email, organisation (+ affiliation), plan tier
 *   GET /recruiter/company           company card (region/district, completion %, KYB)
 *   GET /opportunities/my/list       my postings, newest 20 (a query-string limit is rejected: 422) -> counts
 *   GET /messaging/stats             conversations, unread
 *   GET /applications/stats/received applicants by stage (slow on staging: loaded last, never blocks)
 *
 * One load per tab, shared by every caller (`loadRecruiterShell`), refreshed with `refreshRecruiterShell`
 * after a mutation (a job posted or closed). Each part fails on its own: a missing part leaves its
 * fields null and the UI shows a dash, never a demo number.
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

/* Plan allowances from the plan cards (billingData PLANS). null = unlimited. */
export const PLAN_LIMITS = {
  free: { label: 'Free', badge: 'Free', jobPosts: 1, inmails: 5 },
  professional: { label: 'Professional', badge: 'Pro', jobPosts: 20, inmails: 50 },
  enterprise: { label: 'Enterprise', badge: 'Enterprise', jobPosts: null, inmails: 150 },
};

const storedEntityType = () => {
  try {
    const part = (localStorage.getItem('th:auth-token') || '').split('.')[1];
    if (part) {
      const t = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))).entityType;
      if (t) return t;
    }
    return JSON.parse(localStorage.getItem('th:user-profile') || '{}').entityType || null;
  } catch {
    return null;
  }
};

/* Live data only for a signed-in recruiter; demo (Figma) content otherwise. */
export const isRecruiterSession = () => isLoggedIn() && storedEntityType() === 'recruiter';

const ACTIVE = new Set(['published', 'active', 'open']);
const DRAFT = new Set(['draft', 'pending_review', 'scheduled']);

export const jobBucket = (job) => {
  const s = String(job?.status || '').toLowerCase();
  if (ACTIVE.has(s)) return 'active';
  if (DRAFT.has(s)) return 'draft';
  return 'closed';
};

export const summariseJobs = (jobs = []) => {
  const now = new Date();
  const out = { total: jobs.length, active: 0, draft: 0, closed: 0, postedThisMonth: 0 };
  jobs.forEach((j) => {
    out[jobBucket(j)] += 1;
    const d = new Date(j.publishDate || j.createdAt);
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) out.postedThisMonth += 1;
  });
  return out;
};

const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const build = ({ onboarding, company, jobs, messaging, applications }) => {
  const ob = onboarding || {};
  const org = ob.organisation || {};
  const co = company?.company || {};
  const tier = ob.plan?.tier || 'free';
  const plan = PLAN_LIMITS[tier] || PLAN_LIMITS.free;
  const fullName = ob.profile?.fullName || '';
  const words = fullName.split(/\s+/).filter(Boolean);
  const area = co.district || co.region || '';
  return {
    fullName,
    firstName: words[0] || '',
    shortName: words.length > 1 ? `${words[0]} ${words[words.length - 1][0]}.` : words[0] || '',
    initials: words
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join(''),
    email: ob.profile?.email || '',
    orgId: org.id || null,
    orgName: co.name || org.name || '',
    orgTradingName: org.tradingName || '',
    affiliation: org.affiliation || null,
    place: area ? `${area}, GH` : '',
    logoUrl: co.logoUrl || null,
    tier,
    plan,
    companyCompletion: typeof company?.completion === 'number' ? company.completion : null,
    kyb: company?.kyb || null,
    jobs: jobs ? summariseJobs(jobs) : null,
    jobList: jobs || [],
    conversations: messaging ? (messaging.totalConversations ?? null) : null,
    unreadMessages: messaging ? (messaging.unreadMessages ?? null) : null,
    applicants: applications ? (applications.total ?? null) : null,
    applicantsByStage: applications?.byStage || null,
    upcomingInterviews: applications ? (applications.upcomingInterviews ?? null) : null,
    publicSlug: slug(fullName),
  };
};

let cache = null; // { parts, data }
let inflight = null;
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn(cache?.data || null));

export const peekRecruiterShell = () => cache?.data || null;

export const subscribeRecruiterShell = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const settle = (p) =>
  p.catch((err) => {
    log.error('part failed:', err?.response?.status || err?.message);
    return null;
  });

export const loadRecruiterShell = ({ force = false } = {}) => {
  if (!force && cache) return Promise.resolve(cache.data);
  if (!force && inflight) return inflight;
  const parts = { ...(cache?.parts || {}) };
  const put = (key, value) => {
    parts[key] = value;
    cache = { parts, data: build(parts) };
    emit();
  };
  const fast = Promise.all([
    settle(api.get('/recruiter/onboarding').then((r) => unwrap(r)?.onboarding)).then((v) => put('onboarding', v)),
    settle(api.get('/recruiter/company').then(unwrap)).then((v) => put('company', v)),
    settle(
      api.get('/opportunities/my/list').then((r) => unwrap(r)?.opportunities || [])
    ).then((v) => put('jobs', v)),
    settle(api.get('/messaging/stats').then((r) => unwrap(r)?.stats)).then((v) => put('messaging', v)),
  ]);
  // The applicant stats can take >10 s on staging: do not hold the shell for them.
  settle(api.get('/applications/stats/received').then((r) => unwrap(r)?.stats)).then((v) =>
    put('applications', v)
  );
  inflight = fast.then(() => {
    inflight = null;
    return cache.data;
  });
  return inflight;
};

export const refreshRecruiterShell = () => loadRecruiterShell({ force: true });
