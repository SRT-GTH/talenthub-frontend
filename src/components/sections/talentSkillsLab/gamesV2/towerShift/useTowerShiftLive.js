import { useCallback, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { formatClock } from '../useGameClock.js';
import { useGameV2Params } from '../gamesV2State.js';
import { TOWER_COPY, towerSolvedLead, towerSolvedMessage } from './towerShiftData.js';

const log = debug('useTowerShiftLive');

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const LEVEL_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

/*
 * useTowerShiftLive — Tower Shift against the server tower_of_hanoi engine (backend utils/gameEngines/engines/towerOfHanoi.js).
 * Same return shape as useTowerShiftMock (games/TowerShift.jsx), so TowerShiftBoard draws both.
 *   view: { discs, pegs [[bottom → top sizes]…], moves, fewestPossible, goalPeg } + timeLeftSec / timeLimitSec.
 *   Lifting a disc is only drawn in the browser; dropping it on another peg sends { type: 'move', from, to }. The server refuses a
 *   bigger disc on a smaller one (422 ILLEGAL_MOVE) → the disc stays lifted and the peg shows "not allowed" (Figma TS-02).
 *   Dropping back on its own peg sends nothing (no move). The move that completes the tower returns the result card (opened by
 *   useGameRun). "Finish here" ends the run now (run.submit).
 *   The illegal-tries chip counts the 422s of this visit (the server keeps its own count for the score but does not send it).
 *   Hidden in live: "Best so far" (not sent while playing).
 */
export const useTowerShiftLive = (run) => {
  const g = useGameV2Params();
  const v = run.view;
  const n = v?.discs ?? 0;
  const pegs = useMemo(() => v?.pegs ?? [[], [], []], [v?.pegs]);
  const goal = v?.goalPeg ?? 2;
  const optimal = v?.fewestPossible ?? 0;
  const moves = v?.moves ?? 0;
  const [ui, setUi] = useState({ lifted: null, cursor: 0, blocked: false, illegal: 0, note: null });
  const solved = Boolean(run.lastResult?.solved) || (n > 0 && (pegs[goal]?.length ?? 0) === n);
  const locked = solved || Boolean(v?.finished) || Boolean(g.modal) || run.status !== 'ready';

  const lifted = ui.lifted;
  const stacks = pegs.map((s, i) => (lifted && i === lifted.from ? s.slice(0, -1) : s));

  const drop = useCallback(
    async (peg) => {
      const from = lifted.from;
      if (peg === from) {
        setUi((s) => ({ ...s, lifted: null, cursor: peg, blocked: false, note: null }));
        return;
      }
      setUi((s) => ({ ...s, cursor: peg, note: null }));
      log('move', { from, to: peg });
      const res = await run.act({ type: 'move', from, to: peg });
      if (res?.error) {
        log('refused', res.code);
        if (res.code === 'ILLEGAL_MOVE') {
          setUi((s) => ({ ...s, blocked: true, illegal: s.illegal + 1 }));
        } else {
          setUi((s) => ({ ...s, lifted: null, blocked: false, note: res.error }));
        }
        return;
      }
      setUi((s) => ({ ...s, lifted: null, blocked: false }));
    },
    [lifted, run]
  );

  const lift = useCallback(
    (peg) => {
      if (lifted) return;
      const stack = pegs[peg] ?? [];
      if (!stack.length) {
        setUi((s) => ({ ...s, cursor: peg, blocked: false }));
        return;
      }
      setUi((s) => ({
        ...s,
        lifted: { disc: stack[stack.length - 1], from: peg },
        cursor: peg,
        blocked: false,
        note: null,
      }));
    },
    [lifted, pegs]
  );

  const onTap = useCallback(
    (peg) => {
      if (locked || run.busy) return;
      if (lifted) drop(peg);
      else lift(peg);
    },
    [locked, run.busy, lifted, drop, lift]
  );

  const onKey = useCallback(
    (key) => {
      if (locked || run.busy) return false;
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const d = key === 'ArrowLeft' ? -1 : 1;
        setUi((s) => ({ ...s, cursor: Math.min(2, Math.max(0, s.cursor + d)), blocked: false }));
      } else if (key === 'ArrowUp') lift(ui.cursor);
      else if (key === 'ArrowDown') {
        if (lifted) drop(ui.cursor);
      } else return false;
      return true;
    },
    [locked, run.busy, lift, drop, lifted, ui.cursor]
  );

  const onGoal = pegs[goal]?.length ?? 0;
  const levelId = run.difficulty || g.level;
  const used =
    Number.isFinite(v?.timeLimitSec) && Number.isFinite(run.timeLeft)
      ? v.timeLimitSec - run.timeLeft
      : null;
  const clockLabel = solved
    ? used !== null
      ? `${formatClock(used)} total`
      : 'Done'
    : g.modal === 'offline'
      ? 'Paused'
      : run.timeLabel
        ? `${run.timeLabel} left`
        : 'No time limit';

  const feedback = solved
    ? { tone: 'success', text: towerSolvedMessage(moves, optimal) }
    : ui.blocked
      ? { tone: 'info', text: TOWER_COPY.notAllowed }
      : ui.note
        ? { tone: 'info', text: ui.note }
        : null;

  return {
    n,
    optimal,
    moves,
    illegal: ui.illegal,
    stacks,
    lifted,
    cursor: ui.cursor,
    blocked: ui.blocked,
    solved,
    eyebrow: `${(LEVEL_LABEL[levelId] ?? levelId ?? '').toUpperCase()} · ${n} DISCS`,
    title: solved ? TOWER_COPY.solvedTitle : TOWER_COPY.title,
    lead: solved ? towerSolvedLead(moves, optimal) : TOWER_COPY.lead,
    clockLabel,
    feedback,
    passMark: undefined,
    footer: solved
      ? { note: '' }
      : { note: '', link: { label: 'Finish here', size: 'lg', onClick: run.submit } },
    timeUpSummary: `You got ${onGoal} of ${n} discs onto the Goal peg in ${plural(moves, 'move', 'moves')}.`,
    onSeeResult: run.submit,
    onTap,
    onKey,
  };
};
