import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('games.api');

/*
 * Games API (backend services/games.service.js, gateway /api/games). Server-authoritative game engines: the server holds
 * the answer key, checks every move and computes the score; the browser only sends actions and draws the view.
 *   GET  /games/catalogue                 { games: [{ key, title, difficulties, status, openRun, plays, best,
 *                                                     rankedAvailable, nextRankedAt, measures, evidences, baseXp, ... }] }
 *   POST /games/session/start             { gameKey, difficulty?, mode?: auto|ranked|practice, restart? }
 *                                         -> { runId, game, mode, difficulty, view, resumed }
 *                                         409 GAME_IN_PROGRESS { runId, mode, difficulty } · 409 GAME_COOLDOWN { nextRankedAt }
 *   GET  /games/session/:runId            -> { runId, game, mode, difficulty, view }
 *   POST /games/session/:runId/action     { action } -> { result, view, card? }   (card = the result card when the move ended the game)
 *   POST /games/session/:runId/submit     -> result card { points, measures, traits, percentile, xp, skillsStrengthened, summary, ... }
 *   POST /games/session/:runId/abandon    -> { status }
 *   GET  /games/history?gameKey=&limit=   -> { sessions: [...] }
 *   GET  /games/profile                   -> { profile }
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchGamesCatalogue = async () => {
  const data = unwrap(await api.get('/games/catalogue'));
  log('catalogue', data?.games?.length);
  return data?.games ?? [];
};

export const startGameRun = async ({ gameKey, difficulty, mode = 'auto', restart = false }) => {
  log('start', { gameKey, difficulty, mode, restart });
  return unwrap(await api.post('/games/session/start', { gameKey, difficulty, mode, restart }));
};

export const fetchGameRun = async (runId) =>
  unwrap(await api.get(`/games/session/${encodeURIComponent(runId)}`));

export const sendGameAction = async (runId, action) =>
  unwrap(await api.post(`/games/session/${encodeURIComponent(runId)}/action`, { action }));

export const submitGameRun = async (runId) =>
  unwrap(await api.post(`/games/session/${encodeURIComponent(runId)}/submit`, {}));

export const abandonGameRun = async (runId) =>
  unwrap(await api.post(`/games/session/${encodeURIComponent(runId)}/abandon`, {}));

export const fetchGamesHistory = async ({ gameKey, limit } = {}) => {
  const params = {};
  if (gameKey) params.gameKey = gameKey;
  if (limit) params.limit = limit;
  return unwrap(await api.get('/games/history', { params }))?.sessions ?? [];
};

export const fetchGamesProfile = async () =>
  unwrap(await api.get('/games/profile'))?.profile ?? null;

/** The API error code (`GAME_IN_PROGRESS`, `GAME_COOLDOWN`, `STALE_STATE`, …) or null. */
export const gameErrorCode = (err) =>
  err?.response?.data?.type || err?.response?.data?.code || null;
export const gameErrorData = (err) => err?.response?.data?.data ?? null;
export const gameErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong. Try again.';
