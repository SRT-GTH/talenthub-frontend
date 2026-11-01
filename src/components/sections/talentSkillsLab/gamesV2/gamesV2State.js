import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('gamesV2State');

/*
 * Games v2 — URL contract (Figma canvas "Talent - Skills Lab" 7500:92564, sections "Games v2 · 1 … 14"; frame table in
 * wiki/talent-games-v2.md). Every Figma frame is a URL; the lead owns this file, game agents only READ it.
 *
 *   /skills-lab?tab=games                               GV-01 Games tab (new "Skill games" section above the Arcade)
 *   /skills-lab?tab=games&game=<id>                     GV-02 details dialog (Ranked picked)   &level=beginner|intermediate|advanced|expert
 *   /skills-lab?tab=games&game=<id>&mode=practice       practice picked        &gstate=cooldown  GV-03 (Ranked on cooldown)
 *   /skills-lab?tab=games&dialog=resume&game=<id>       GV-09 "Pick up where you left off?"
 *   /skills-lab?tab=games&dialog=expired&game=<id>      GV-13 "Game expired (24 h)"
 *   /skills-lab/play/<id>?mode=ranked|practice&level=…  the game (default ranked, intermediate)
 *   …&f=<frame code>                                    boots the exact Figma state (each game maps its own codes: PP-03, WS-02 …)
 *   …&modal=quit|timeup|offline                         GV-06 / GV-07 / GV-08, drawn by GameV2Shell over the game
 *   …&view=result[&f=GV-10|GV-11|GV-12]                 result card (GameV2Result); GV-11 = under 18, GV-12 = Makola Haggle play style
 *   &help=1                                             Help pop-over (shared HelpPopover)
 *
 * <id> ∈ memory-match pattern-pulse word-shuffle switch-sort three-in-a-row grid-logic sum-grid tower-shift errand-run
 *        chess-tactics chess-match crisis-room makola-haggle.   (The legacy Arcade games keep `/skills-lab/games/<id>`.)
 */
export const GAME_V2_IDS = [
  'memory-match',
  'pattern-pulse',
  'word-shuffle',
  'switch-sort',
  'three-in-a-row',
  'grid-logic',
  'sum-grid',
  'tower-shift',
  'errand-run',
  'chess-tactics',
  'chess-match',
  'crisis-room',
  'makola-haggle',
];
export const GAME_V2_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
export const GAME_V2_MODES = ['ranked', 'practice'];
export const GAME_V2_MODALS = ['quit', 'timeup', 'offline'];

const RESULT_KEY = 'gth:gv2-result';

const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);

export const gamePlayUrl = (gameId, query = {}) => {
  const qs = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => v !== undefined && v !== null && qs.set(k, String(v)));
  const s = qs.toString();
  return `/skills-lab/play/${gameId}${s ? `?${s}` : ''}`;
};
export const GAMES_TAB_URL = '/skills-lab?tab=games';

/*
 * useGameV2Params() → the play page's state:
 *   gameId, mode ('ranked'|'practice'), ranked (bool), level, frame (the `?f=` code or null), resume (`?resume=1`), modal, view ('play'|'result'),
 *   update(patch)            merge into the query string (null / '' removes a key), replace history
 *   openModal(kind) / closeModal()
 *   exit()                   back to the Games tab
 *   finish(result)           stores the run's result (sessionStorage) and shows the result card (?view=result)
 *   readResult()             the stored result or null
 *   again(extra)             same game, fresh run (drops view / modal / f), `extra` keys are merged
 */
export const useGameV2Params = () => {
  const { gameId } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = pick(params.get('mode'), GAME_V2_MODES, 'ranked');
  const level = pick(params.get('level'), GAME_V2_LEVELS, 'intermediate');
  const modal = pick(params.get('modal'), GAME_V2_MODALS, null);
  const view = params.get('view') === 'result' ? 'result' : 'play';
  const frame = params.get('f');
  const resume = params.get('resume') === '1';

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false || v === '') next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    },
    [params, setParams]
  );
  const openModal = useCallback((kind) => update({ modal: kind }), [update]);
  const closeModal = useCallback(() => update({ modal: null }), [update]);
  const exit = useCallback(() => {
    log('exit', gameId);
    navigate(GAMES_TAB_URL);
  }, [navigate, gameId]);
  const finish = useCallback(
    (result) => {
      log('finish', gameId, result && Object.keys(result));
      try {
        window.sessionStorage.setItem(
          RESULT_KEY,
          JSON.stringify({ gameId, mode, level, ...result })
        );
      } catch {
        /* private mode: the result card falls back to its drawn mock */
      }
      update({ view: 'result', modal: null, f: null });
    },
    [gameId, mode, level, update]
  );
  const readResult = useCallback(() => {
    try {
      const raw = JSON.parse(window.sessionStorage.getItem(RESULT_KEY) || 'null');
      return raw && raw.gameId === gameId ? raw : null;
    } catch {
      return null;
    }
  }, [gameId]);
  const again = useCallback(
    (extra = {}) => {
      const next = new URLSearchParams(params);
      ['view', 'modal', 'f'].forEach((k) => next.delete(k));
      Object.entries(extra).forEach(([k, v]) => next.set(k, String(v)));
      navigate(`/skills-lab/play/${gameId}?${next.toString()}`, { replace: true });
    },
    [params, navigate, gameId]
  );

  return useMemo(
    () => ({
      gameId,
      mode,
      ranked: mode === 'ranked',
      level,
      frame,
      resume,
      modal,
      view,
      update,
      openModal,
      closeModal,
      exit,
      finish,
      readResult,
      again,
    }),
    [
      gameId,
      mode,
      level,
      frame,
      resume,
      modal,
      view,
      update,
      openModal,
      closeModal,
      exit,
      finish,
      readResult,
      again,
    ]
  );
};
