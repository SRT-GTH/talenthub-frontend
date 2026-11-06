import api from './api.js';
import { debug } from '../utils/debug.js';
import { notifyStreakActivity } from './streak.api.js';
import { notifyXpChanged } from './xp.api.js';

const log = debug('skillsLabWeekly.api');

/*
 * Skills Lab weekly challenge (backend services/skillsLabWeekly.service.js, gateway /api/skills-lab/weekly). The signed-in
 * talent's own attempt only; one attempt a week (Monday to Sunday 11:59 pm, Ghana time).
 *
 *   GET  /skills-lab/weekly          { available, id, title, body, labId, questionCount, secondsPerQuestion, xp, endsAt,
 *                                      playing, board: { title, hidden, notice, rows[{ rank, name, score, you? }],
 *                                      you: { rank, score, played } }, optedIn, canOptIn, myAttempt }
 *   POST /skills-lab/weekly/start    { optIn? } -> in progress: { status, title, total, secondsPerQuestion, questions (handed
 *                                      out so far, no answers), attempt: { id, index, results, optIn },
 *                                      current: { index, deadline }, serverNow } | finished: the finish shape
 *   POST /skills-lab/weekly/answer   { questionId, answer } -> { ok, late, seconds, reveal, results }  (answer -1 = time's up)
 *   POST /skills-lab/weekly/finish   -> { status: 'finished', title, correct, total, timeSec, time, xp, xpAwarded, optedIn,
 *                                      canOptIn, board }
 *   POST /skills-lab/weekly/opt-in   { optIn } -> the GET shape
 *
 * The server keeps each question's 2-minute clock; an answer after it is a miss.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchWeekly = async () => {
  const data = unwrap(await api.get('/skills-lab/weekly'));
  log('weekly', { available: data?.available, playing: data?.playing });
  return data;
};

export const startWeekly = async ({ optIn } = {}) =>
  unwrap(await api.post('/skills-lab/weekly/start', optIn === undefined ? {} : { optIn }));

// A recorded answer is a streak day on the server; tell the nav pill to refresh.
export const answerWeekly = async (body) => {
  const data = unwrap(await api.post('/skills-lab/weekly/answer', body));
  notifyStreakActivity();
  return data;
};

// Finishing earns the weekly XP once (XP ledger); tell the XP header / sidebar to refresh.
export const finishWeekly = async () => {
  const data = unwrap(await api.post('/skills-lab/weekly/finish', {}));
  notifyXpChanged();
  return data;
};

export const saveWeeklyOptIn = async (optIn) =>
  unwrap(await api.post('/skills-lab/weekly/opt-in', { optIn }));
