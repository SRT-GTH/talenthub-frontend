import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('usage.api');

/*
 * AI usage (backend services/usage.service.js, AI metering Phase 0). The routes exist only while the backend runs
 * with AI_METERING=1; the screens use them only when this build has VITE_AI_METERING=1.
 *   GET /usage/me                      the signed-in talent's weighted turns vs the caps (dark-launched, not enforced)
 *   GET /usage/report?from=&to=        GTH staff (Super Admin): totals, per model and per role, would-be cap hits
 * Days are YYYY-MM-DD in Accra time (= UTC). Costs are in US dollars; credits: 1 credit = USD 0.001 of shadow cost.
 */

export const aiMeteringEnabled = () => import.meta.env.VITE_AI_METERING === '1';

const unwrap = (res) => {
  const d = res?.data;
  return d && d.data && !d.type ? d.data : d;
};

export const getMyUsage = async () => unwrap(await api.get('/usage/me'));

export const getUsageReport = async ({ from, to }) => {
  log('report', { from, to });
  return unwrap(await api.get('/usage/report', { params: { from, to } }));
};

/** Date -> 'YYYY-MM-DD' (UTC, which is Accra time). */
export const isoDay = (d) => new Date(d).toISOString().slice(0, 10);

/** The last `n` days ending today, as { from, to }. */
export const lastDays = (n, now = new Date()) => ({
  from: isoDay(new Date(now.getTime() - (n - 1) * 86400000)),
  to: isoDay(now),
});

/** 0.01234 -> 'US$0.0123'; amounts under a cent keep 4 decimals so test traffic isn't shown as zero. */
export const formatUsd = (n) => {
  const v = Number(n || 0);
  const digits = v !== 0 && Math.abs(v) < 1 ? 4 : 2;
  return `US$${v.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

/** Model keys as people say them. */
export const modelLabel = (k) =>
  ({
    'claude-sonnet': 'Claude Sonnet',
    'claude-haiku': 'Claude Haiku',
    'claude-opus': 'Claude Opus',
    'gpt-oss-120b': 'gpt-oss-120b (Groq)',
    'gpt-oss-20b': 'gpt-oss-20b (Groq)',
    kasada: 'Kasada (pilot)',
    qwen: 'Qwen',
    unknown: 'Unknown model (priced as Sonnet)',
  })[k] ||
  k ||
  'Unknown';

export const roleLabel = (r) =>
  ({ talent: 'Talents', recruiter: 'Recruiters', system: 'System (no user)' })[r] ||
  (r ? r.replace(/_/g, ' ') : 'Not set');
