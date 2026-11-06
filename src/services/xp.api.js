import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('xp.api');

/*
 * Talent XP ledger (backend services/xp.service.js, gateway /api/xp) — the one stored XP system (ADR-04). Every award is a row
 * (ranked games, Skills Lab labs, first arcade plays, streak milestones); the total and level are computed from those rows.
 *   GET /xp           { total, level, levelName, levelStart, nextLevelAt, xpIntoLevel, xpToNextLevel, thisWeek,
 *                       bySource: { game, lab, arcade_game, streak_milestone, profile_stage, other }, recent: [...] }
 *   GET /xp/history   { events: [{ source, label, xp, createdAt }] }
 * Screens that award XP (a ranked game, a finished lab) call notifyXpChanged() so the header / sidebar refresh.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const XP_CHANGED = 'gth:xp-changed';

export const notifyXpChanged = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(XP_CHANGED));
};

export const fetchXpSummary = async () => {
  const data = unwrap(await api.get('/xp'));
  log('summary', { total: data?.total, level: data?.level });
  return data;
};

export const fetchXpHistory = async (limit = 50) =>
  unwrap(await api.get('/xp/history', { params: { limit } }))?.events ?? [];
