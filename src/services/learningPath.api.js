import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('learningPath.api');

/*
 * Learning path iteration 4 (backend PR #241, gateway /api/guidance).
 *
 * Course page and off-platform progress (learningActivity / courseCatalogue services):
 *   GET    /guidance/training/courses/:courseId               { course, progress, shortCheckAvailable, tracking, player, openUrl, needsGuardianConsent }
 *   POST   /guidance/training/courses/:courseId/open          { url, recorded, progress }
 *   POST   /guidance/training/courses/:courseId/finished      { answer: finished|not_yet|stopped, proofUrl? } -> { progress, shortCheckAvailable }
 *   POST   /guidance/training/courses/:courseId/check/start   { attemptId, questions[{ id, question, options }], passMark, expiresInSec }
 *   POST   /guidance/training/courses/:courseId/check/submit  { attemptId, answers{ [questionId]: optionIndex } } -> { passed, correct, total, results, progress }
 *   POST   /guidance/training/courses/:courseId/watch         { videoId, segments[[start,end]] } -> { videoPercent, coursePercent, complete, progress }
 *   GET    /guidance/training/my-activity                     { items }
 *   GET    /guidance/training/my-activity/export              JSON download
 *   DELETE /guidance/training/my-activity                     { deleted }
 *   POST   /guidance/training/tracking                        { allow }
 *   GET    /guidance/training/guardian/:wardEntityId          { tracking, paidCourses, providers, ageBand }
 *   POST   /guidance/training/guardian/:wardEntityId          { setting, allow, provider? }
 *
 * Goals and "This week" (learningPath service):
 *   GET    /guidance/learning-path/goals                      { goals[], maxActiveGoals, activeCount }
 *   GET    /guidance/learning-path/agenda                     { items[], minutes, more, askAbout[], goals[] }
 *   POST   /guidance/learning-path/goals/:career/status       { status: active|paused|achieved|archived }  (409 GOAL_CAP_REACHED)
 *   POST   /guidance/learning-path/goals/:career/primary
 *
 * Functions return the unwrapped payload and throw on failure; callers decide what to show.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const enc = encodeURIComponent;
const C = (id) => `/guidance/training/courses/${enc(id)}`;

export const fetchCoursePage = async (courseId) => {
  const data = unwrap(await api.get(C(courseId)));
  log('course page', { courseId, status: data?.progress?.status, player: Boolean(data?.player) });
  return data;
};

export const openCourseOutside = async (courseId) =>
  unwrap(await api.post(`${C(courseId)}/open`, {}));

export const reportFinished = async (courseId, answer, proofUrl) =>
  unwrap(await api.post(`${C(courseId)}/finished`, proofUrl ? { answer, proofUrl } : { answer }));

export const startShortCheck = async (courseId) =>
  unwrap(await api.post(`${C(courseId)}/check/start`, {}));

export const submitShortCheck = async (courseId, attemptId, answers) =>
  unwrap(await api.post(`${C(courseId)}/check/submit`, { attemptId, answers }));

export const sendWatchProgress = async (courseId, videoId, segments) =>
  unwrap(await api.post(`${C(courseId)}/watch`, { videoId, segments }));

export const fetchGoals = async () => unwrap(await api.get('/guidance/learning-path/goals'));

export const fetchAgenda = async (limit = 5) =>
  unwrap(await api.get('/guidance/learning-path/agenda', { params: { limit } }));

export const setGoalStatus = async (career, status) =>
  unwrap(await api.post(`/guidance/learning-path/goals/${enc(career)}/status`, { status }));

export const setPrimaryGoal = async (career) =>
  unwrap(await api.post(`/guidance/learning-path/goals/${enc(career)}/primary`, {}));

export const exportMyLearning = async () =>
  unwrap(await api.get('/guidance/training/my-activity/export'));

export const deleteMyLearning = async () =>
  unwrap(await api.delete('/guidance/training/my-activity'));

export const setMyTracking = async (allow) =>
  unwrap(await api.post('/guidance/training/tracking', { allow }));

export const fetchWardLearningSettings = async (wardEntityId) =>
  unwrap(await api.get(`/guidance/training/guardian/${enc(wardEntityId)}`));

export const setWardLearningSetting = async (wardEntityId, setting, allow) =>
  unwrap(await api.post(`/guidance/training/guardian/${enc(wardEntityId)}`, { setting, allow }));

/** The API's error code ("GOAL_CAP_REACHED", "CHECK_COOLDOWN", ...) and data, for messages. */
export const apiErrorOf = (err) => {
  const body = err?.response?.data || {};
  return {
    status: err?.response?.status || null,
    type: body.type || body.code || body.error?.type || null,
    message: body.message || err?.message || 'Something went wrong',
    data: body.data || null,
  };
};
