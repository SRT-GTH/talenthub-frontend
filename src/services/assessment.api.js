import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('assessment.api');

/*
 * My Assessment API — the six server-scored assessments (backend mixins/engagement/engagement.assessment.mixin.js,
 * gateway /api/engagement, guarded by utils/engagementRouteGuard.js):
 *
 *   GET  /engagement/assessments/templates          { rows:[{ assessmentType, displayName, description, estimatedMinutes,
 *                                                     questions:[{ key, text, dimension?, scale?, options?, difficulty? }] }] }
 *                                                   (answer keys stripped for talents)
 *   GET  /engagement/assessments/results/me         { rows:[result], required:[types] } — the caller's own results
 *   POST /engagement/start                          { engagement:{ id } } — the caller's active engagement (get-or-create)
 *   POST /engagement/assessments/score              { engagementId, assessmentType, rawResponses:{ [key]: answer } }
 *                                                   -> { scores, interpretation, ... } — scored and saved server-side
 *
 * Scoring never happens in the browser: the server holds the answer keys and writes the result.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const rowsOf = (data) =>
  Array.isArray(data) ? data : data?.rows || data?.results || data?.items || [];

export const fetchAssessmentTemplates = async () => {
  const data = unwrap(
    await api.get('/engagement/assessments/templates', { params: { pageSize: 50 } })
  );
  const rows = rowsOf(data).filter((t) => t?.isActive !== false);
  log(
    'templates',
    rows.map((t) => `${t.assessmentType}:${t.questions?.length ?? 0}`)
  );
  return rows;
};

export const fetchMyAssessmentResults = async () => {
  const data = unwrap(await api.get('/engagement/assessments/results/me'));
  const rows = rowsOf(data);
  log('results', { n: rows.length, required: data?.required });
  return { rows, required: data?.required || [] };
};

/** The caller's engagement id (scoring is filed against it). Resumes the active one, or starts one. */
export const ensureEngagementId = async () => {
  const data = unwrap(await api.post('/engagement/start', {}));
  const id = data?.engagement?.id || data?.engagement?._id || data?.id;
  log('engagement', { found: Boolean(id), isNew: data?.isNew });
  if (!id) throw new Error('No engagement returned by /engagement/start');
  return String(id);
};

export const scoreAssessment = async ({ assessmentType, rawResponses }) => {
  const engagementId = await ensureEngagementId();
  log('submit', { assessmentType, answers: Object.keys(rawResponses).length });
  const data = unwrap(
    await api.post('/engagement/assessments/score', { engagementId, assessmentType, rawResponses })
  );
  log('scored', { assessmentType, keys: data ? Object.keys(data) : null });
  return data;
};
