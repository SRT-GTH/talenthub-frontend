import api from './api.js';
import { debug } from '../utils/debug.js';
import { notifyStreakActivity } from './streak.api.js';

const log = debug('skillsLab.api');

/*
 * Skills Lab API (backend services/skillsLab.service.js, gateway /api/skills-lab). The signed-in talent's own runs only.
 *
 *   GET  /skills-lab/labs                     { labs[], summary, weekly, nudge, popularForNewTalent[], closeMatches[] }
 *   GET  /skills-lab/attempts                 { attempts[] }  History rows
 *   GET  /skills-lab/profile-scores           { scores[] }    · PUT /skills-lab/profile-scores/:labId { shown }
 *   GET  /skills-lab/labs/:labId/play         { lab, questions (no answers), attempt: { id, index, results } }
 *   POST /skills-lab/labs/:labId/restart      same shape, fresh run
 *   POST /skills-lab/labs/:labId/answer       { attemptId, questionId, selected, hintUsed, final } -> { ok, final, reveal }
 *   POST /skills-lab/labs/:labId/finish       { attemptId } -> { correct, total, passMark, scenario, passed, earned }
 *   GET  /skills-lab/games                    { games[] }  per-game status for this talent
 *   POST /skills-lab/games/:gameId/result     { correct, total, passed, durationSeconds, traits, playStyle }
 *
 * The server holds the answer keys and decides right / wrong; `reveal` ({ answer, explain, weaker, correct, san, … })
 * arrives only after an answer is recorded.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const enc = encodeURIComponent;

export const skillsLabError = (err, fallback = 'Could not reach Skills Lab. Try again.') =>
  err?.response?.data?.message || err?.response?.data?.error?.message || fallback;

export const fetchHub = async () => {
  const data = unwrap(await api.get('/skills-lab/labs'));
  log('hub', { labs: data?.labs?.length, verified: data?.summary?.verified });
  return data;
};

export const fetchAttempts = async () => unwrap(await api.get('/skills-lab/attempts'))?.attempts ?? [];

export const fetchProfileScores = async () => unwrap(await api.get('/skills-lab/profile-scores'))?.scores ?? [];

export const saveProfileScore = async (labId, shown) =>
  unwrap(await api.put(`/skills-lab/profile-scores/${enc(labId)}`, { shown }))?.scores ?? [];

export const playLab = async (labId) => unwrap(await api.get(`/skills-lab/labs/${enc(labId)}/play`));

export const restartLab = async (labId) => unwrap(await api.post(`/skills-lab/labs/${enc(labId)}/restart`, {}));

// Each recorded answer / game counts as a streak day on the server; tell the nav pill to refresh.
export const answerLab = async (labId, body) => {
  const data = unwrap(await api.post(`/skills-lab/labs/${enc(labId)}/answer`, body));
  if (data?.final !== false) notifyStreakActivity();
  return data;
};

export const finishLab = async (labId, attemptId) =>
  unwrap(await api.post(`/skills-lab/labs/${enc(labId)}/finish`, { attemptId }));

export const fetchGames = async () => unwrap(await api.get('/skills-lab/games'))?.games ?? [];

export const postGameResult = async (gameId, body) => {
  const data = unwrap(await api.post(`/skills-lab/games/${enc(gameId)}/result`, body));
  log('game result', gameId, { passed: data?.passed, verified: data?.verified });
  notifyStreakActivity();
  return data;
};
