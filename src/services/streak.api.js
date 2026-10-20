import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('streak.api');

/*
 * Talent streak API (backend services/streaks.service.js, gateway /api/streak). The signed-in talent's own streak.
 *   GET  /streak                      { status, summary, popover, month, milestones, milestoneModal, reminders,
 *                                       leaderboard: { title, rows }, header: { week }, repair }
 *   POST /streak/fresh                "Start fresh" after a lost streak
 *   POST /streak/milestones/:id/seen  the milestone modal was shown
 *   PUT  /streak/reminders            { daily: { enabled, time }, warn: { enabled } }
 * A streak day is recorded by the backend whenever a lesson, Skills Lab answer / game or assessment is done; screens that
 * do one call notifyStreakActivity() so the nav pill refreshes.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const STREAK_CHANGED = 'gth:streak-changed';

export const notifyStreakActivity = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(STREAK_CHANGED));
};

export const fetchStreak = async () => {
  const data = unwrap(await api.get('/streak'));
  log('streak', { status: data?.status, current: data?.summary?.current });
  return data;
};

export const startFreshStreak = async () => unwrap(await api.post('/streak/fresh', {}));

export const markMilestoneSeen = async (id) =>
  unwrap(await api.post(`/streak/milestones/${encodeURIComponent(id)}/seen`, {}));

export const saveStreakReminders = async (body) =>
  unwrap(await api.put('/streak/reminders', body))?.reminders;
