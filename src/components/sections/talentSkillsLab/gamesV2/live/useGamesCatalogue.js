import { useEffect, useSyncExternalStore } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { fetchGamesCatalogue, fetchGamesHistory } from '../../../../../services/games.api.js';
import { GAMES_V2 } from '../gamesV2Data.js';
import { gameIdFor, isLiveGames } from './gameKeys.js';

const log = debug('useGamesCatalogue');

/*
 * useGamesCatalogue() → the 13 Games v2 rows (gamesV2Data.js copy: title, description, levels, how to play …) with each game's
 * status for the signed-in talent from GET /games/catalogue (+ GET /games/history for the best score's level and percentile):
 *   in_progress           → { kind: 'in-progress', mode, level, runId, savedHoursAgo, keptHours }      (resume / restart)
 *   ranked on cool-down   → { kind: 'cooldown', opensOn, opensAt, best? }
 *   played, ranked open   → { kind: 'ranked-open', best: { score, level, topPercent|null } }
 *   never played          → { kind: 'new' }
 * Games the talent may not play (age) are left out, as the server does. `?demo=1` / `?f=` return the drawn mock rows unchanged.
 * One shared store, so the tab and its dialogs (GameV2DialogLayer) agree; refresh() after a run finishes.
 */
const LEVEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};
const KEPT_HOURS = 24;

let state = { status: 'idle', games: [], error: null }; // live rows only; never flash the drawn mock statuses
const listeners = new Set();
const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

const fmtDay = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtDayTime = (iso) =>
  `${fmtDay(iso)}, ${new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

const bestOf = (sessions) => {
  const ranked = sessions.filter((s) => s.mode === 'ranked' && Number.isFinite(s.points));
  const pool = ranked.length ? ranked : sessions.filter((s) => Number.isFinite(s.points));
  if (!pool.length) return null;
  const top = pool.reduce((b, s) => (s.points > b.points ? s : b), pool[0]);
  return {
    score: top.points,
    level: LEVEL[top.difficulty] ?? top.difficulty,
    topPercent: Number.isFinite(top.percentile) ? Math.max(1, 100 - top.percentile) : null,
  };
};

const statusFor = (row, sessions) => {
  if (row.openRun) {
    const hours = Math.max(
      0,
      Math.floor((Date.now() - new Date(row.openRun.startedAt).getTime()) / 3600000)
    );
    return {
      kind: 'in-progress',
      mode: row.openRun.mode,
      level: row.openRun.difficulty,
      runId: row.openRun.runId,
      savedHoursAgo: hours,
      keptHours: Math.max(1, KEPT_HOURS - hours),
    };
  }
  const best = bestOf(sessions);
  if (!row.rankedAvailable && row.nextRankedAt) {
    return {
      kind: 'cooldown',
      opensOn: fmtDay(row.nextRankedAt),
      opensAt: fmtDayTime(row.nextRankedAt),
      best,
    };
  }
  if (best) return { kind: 'ranked-open', best };
  return { kind: 'new' };
};

export const refreshGamesCatalogue = async () => {
  if (!isLiveGames()) return;
  set({ status: state.status === 'ready' ? 'ready' : 'loading' });
  try {
    const [rows, history] = await Promise.all([
      fetchGamesCatalogue(),
      fetchGamesHistory({ limit: 200 }),
    ]);
    const byId = new Map(rows.map((r) => [gameIdFor(r.key), r]));
    const games = GAMES_V2.filter((g) => byId.has(g.id)).map((g) => {
      const row = byId.get(g.id);
      const sessions = history.filter((s) => s.gameKey === row.key);
      return { ...g, gameKey: row.key, server: row, status: statusFor(row, sessions) };
    });
    log('catalogue', games.map((g) => `${g.id}:${g.status.kind}`).join(' '));
    set({ status: 'ready', games, error: null });
  } catch (err) {
    log.error('catalogue failed', err?.message);
    set({
      status: 'error',
      error: err?.response?.data?.message || err?.message || 'Could not load your games',
    });
  }
};

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => state;

export const useGamesCatalogue = ({ load = false } = {}) => {
  const s = useSyncExternalStore(subscribe, snapshot, snapshot);
  useEffect(() => {
    if (load) refreshGamesCatalogue();
  }, [load]);
  if (!isLiveGames()) return { status: 'ready', games: GAMES_V2, error: null, live: false };
  return { ...s, live: true };
};

export const liveGameById = (id) =>
  isLiveGames() ? state.games.find((g) => g.id === id) || null : null;
