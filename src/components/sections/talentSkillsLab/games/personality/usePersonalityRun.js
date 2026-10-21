import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { PLAY_ORDER } from './personalityData.js';
import { markArcadePlayed } from '../../../engagementV2/arcade/arcadePlayed.js';

const log = debug('usePersonalityRun');
const readPlayed = () => {
  try {
    return JSON.parse(window.localStorage.getItem('gth:arcade-played') || '[]').length;
  } catch {
    return 0;
  }
};

/*
 * usePersonalityRun — the tiny state machine every round-based personality game shares (Makola Haggle, Escape Room,
 * Desert Island, Trotro Rush, Group Chat Drama, Tower Builder, Ludo Risk, The Pitch, Speed Sort).
 *
 *   const run = usePersonalityRun({ total: 4, seed: { index: 1, pick: null, finished: false } });
 *   run.index        0-based round being played      run.round   1-based
 *   run.pick         the chosen option of THIS round (number | null); `select(i)` sets it, `clear()` removes it
 *   run.picks        every confirmed pick so far (one entry per round, in order)
 *   run.confirm()    locks the pick, moves on, or finishes after the last round
 *   run.finished     true after the last confirm (the completion dialog opens)
 *   run.restart()    back to round 1
 *   run.segments     progress-strip states ('done' | 'now' | 'todo'); all 'done' when finished
 *   run.goNext()     navigates to the next personality game (PLAY_ORDER) / run.goArcade() to the Games tab
 *
 * `seed` boots an exact Figma frame (the `?f=` code is turned into a seed by each game).
 */
export const usePersonalityRun = ({ total, seed, gameId }) => {
  const navigate = useNavigate();
  const inArcade = useLocation().pathname.startsWith('/profile/filling/personality/arcade');
  const [state, setState] = useState(() => ({
    index: seed?.index ?? 0,
    pick: seed?.pick ?? null,
    picks: seed?.picks ?? [],
    finished: seed?.finished ?? false,
  }));

  const select = useCallback((pick) => {
    log('select', pick);
    setState((s) => (s.finished ? s : { ...s, pick }));
  }, []);

  const clear = useCallback(() => setState((s) => ({ ...s, pick: null })), []);

  const confirm = useCallback(() => {
    setState((s) => {
      if (s.finished || s.pick === null) return s;
      const picks = [...s.picks, s.pick];
      if (s.index + 1 >= total) {
        log('finished', picks);
        if (inArcade) markArcadePlayed(gameId);
        return { ...s, picks, finished: true };
      }
      log('next round', s.index + 1);
      return { ...s, picks, index: s.index + 1, pick: null };
    });
  }, [total, inArcade, gameId]);

  const finish = useCallback(() => {
    log('finish early');
    setState((s) => (s.finished ? s : { ...s, finished: true }));
  }, []);

  const restart = useCallback(() => {
    log('restart');
    setState({ index: 0, pick: null, picks: [], finished: false });
  }, []);

  const segments = Array.from({ length: total }, (_, i) => {
    if (state.finished || i < state.index) return 'done';
    return i === state.index ? 'now' : 'todo';
  });

  const goArcade = useCallback(
    () =>
      navigate(
        inArcade
          ? `/profile/filling/personality/arcade${readPlayed() >= 3 ? '?modal=archetype' : ''}`
          : '/skills-lab?tab=games'
      ),
    [navigate, inArcade]
  );
  const goNext = useCallback(() => {
    const at = PLAY_ORDER.indexOf(gameId);
    const next = PLAY_ORDER[(at + 1) % PLAY_ORDER.length];
    log('go next', { from: gameId, next });
    navigate(`${inArcade ? '/profile/filling/personality/arcade' : '/skills-lab/games'}/${next}`);
  }, [gameId, navigate, inArcade]);

  return {
    ...state,
    round: state.index + 1,
    total,
    segments,
    select,
    clear,
    confirm,
    finish,
    restart,
    goArcade,
    goNext,
  };
};
