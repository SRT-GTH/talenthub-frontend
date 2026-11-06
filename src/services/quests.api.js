import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('quests.api');

/*
 * Weekly quests (backend services/quests.service.js, gateway /api/quests), talents only.
 *   GET /quests/week   { weekStart, weekEnd, quests: [{ id, text, count, target, xp, done, pct }], doneCount, total,
 *                        steps: { done, target }, xpTotal, xpEarned, awarded: [quest ids newly awarded by this call] }
 * Progress is counted on the server from games, Skills Lab and streak days; a completed quest's XP is awarded once
 * (on this read or right after the action), so the caller refreshes the XP header when `awarded` is not empty.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchWeeklyQuests = async () => {
  const data = unwrap(await api.get('/quests/week'));
  log('week', { weekStart: data?.weekStart, done: data?.doneCount, awarded: data?.awarded });
  return data;
};
