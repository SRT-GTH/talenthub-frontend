import { useCallback, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameClock } from '../useGameClock.js';
import { useGameV2Params } from '../gamesV2State.js';
import GridGameBoard from '../gridLogic/GridGameBoard.jsx';
import {
  GRID_LOGIC_BEST,
  GRID_LOGIC_COPY,
  GRID_LOGIC_FRAMES,
  GRID_LOGIC_LEVELS,
} from '../gridLogic/gridLogicData.js';
import { makeGridKeyHandler } from '../gridLogic/gridKeys.js';
import { boxLines } from '../gridLogic/gridLines.js';
import {
  boxShape,
  clashCells,
  clashMessage,
  filledCount,
  findClashes,
  formatClockLabel,
  parseRows,
  peersOf,
  pickClash,
  scoreRun,
} from '../gridLogic/gridRules.js';
import { useGridEntry } from '../gridLogic/useGridEntry.js';
import { describeSudokuCell, useGridLogicLive } from '../gridLogic/useGridLogicLive.js';
import GameV2LiveGate from '../live/GameV2LiveGate.jsx';
import { isLiveGames } from '../live/gameKeys.js';
import { useGameRun } from '../live/useGameRun.js';
import { isMockGamesUrl, liveBestMark, readLiveResult } from '../planningShared/liveResultMeta.js';

const log = debug('GridLogic');

/*
 * Grid Logic — Sudoku (Figma "Games v2 · 8" GL-01 … GL-04).
 *   Live (default): the server sudoku engine (/api/games, gridLogic/useGridLogicLive.js) — board size by level from the view
 *   (Beginner 4×4 · Intermediate 6×6 · Advanced / Expert 9×9), server clashes, server clock, server score.
 *   Mock (`?f=GL-01…04`, `?demo=1`): the local puzzle below. Levels: Beginner 4×4 (⚠️), Intermediate 6×6 (drawn, boxes 2×3),
 *   Advanced 6×6 harder (⚠️), Expert 9×9 (drawn). Real play: select a square (tap / arrows), number pad or keys 1…N, Notes mode
 *   (pencil marks), Erase, live clash highlighting (row → column → box), puzzle squares are locked ("not allowed"), Submit grid
 *   validates, Done for now leaves (progress is "saved as you go" — a mock, nothing persists).
 *   ?f=GL-01…04 boots the exact frame state with the clock frozen (data in gridLogicData.js, frame quirks listed there).
 */
const PAD_LAYOUTS = {
  4: { cols: 2, keyW: 76, keyH: 64, padW: 260, mobileKeyH: 60, boardPx: 428 },
  6: { cols: 3, keyW: 76, keyH: 64, padW: 300, mobileKeyH: 56, boardPx: 428 },
  9: { cols: 3, keyW: 64, keyH: 64, padW: 280, mobileKeyH: 52, boardPx: 431 },
};
const padFor = (size) => PAD_LAYOUTS[size] ?? PAD_LAYOUTS[9];

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local puzzle and mock scoring */
const useGridLogicMock = ({ level, frame }) => {
  const g = useGameV2Params();
  const seed = frame ? (GRID_LOGIC_FRAMES[frame] ?? null) : null;
  const cfg = GRID_LOGIC_LEVELS[seed?.level ?? level] ?? GRID_LOGIC_LEVELS.intermediate;
  const { size } = cfg;
  const shape = useMemo(() => boxShape(size), [size]);

  // the puzzle: drawn givens (+ the bonus givens of a fresh run, see gridLogicData.js)
  const { locked, startValues } = useMemo(() => {
    const base = parseRows(cfg.givens);
    if (!seed) cfg.bonusGivens.forEach((b) => (base[(b.row - 1) * size + (b.col - 1)] = b.value));
    const lockedFlags = base.map(Boolean);
    const values = base.slice();
    if (seed) seed.users.forEach(([r, c, v]) => (values[(r - 1) * size + (c - 1)] = v));
    log('puzzle ready', {
      level: cfg.level,
      size,
      frame,
      givens: lockedFlags.filter(Boolean).length,
    });
    return { locked: lockedFlags, startValues: values };
  }, [cfg, seed, size, frame]);

  const entry = useGridEntry({
    size,
    locked,
    initialValues: startValues,
    initialSelected: seed
      ? seed.selected
        ? (seed.selected[0] - 1) * size + (seed.selected[1] - 1)
        : null
      : Math.max(0, startValues.indexOf(0)),
    initialNotesOn: seed?.notesOn ?? false,
    initialLastEdit: seed?.lastEdit ? (seed.lastEdit[0] - 1) * size + (seed.lastEdit[1] - 1) : -1,
  });
  const { values, notes, selected, notesOn, lastEdit } = entry;

  const [frozen, setFrozen] = useState(Boolean(seed)); // frame-only printed values apply until the first action
  const [info, setInfo] = useState(null);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [wrongSubmits, setWrongSubmits] = useState(0);
  const [finished, setFinished] = useState(false);
  const shown = frozen ? (seed?.shown ?? null) : null;

  const clock = useGameClock({
    start: seed?.clockSeconds ?? 0,
    direction: 'up',
    running: !seed && !g.modal && !finished,
  });

  const clashes = useMemo(() => findClashes(values, size, shape), [values, size, shape]);
  const badSet = useMemo(() => {
    if (shown?.bad) {
      log('frame override: flagged squares', shown.bad);
      return new Set(shown.bad.map(([r, c]) => (r - 1) * size + (c - 1)));
    }
    return clashCells(clashes);
  }, [shown, clashes, size]);
  const filled = filledCount(values);

  const feedback = useMemo(() => {
    if (shown?.feedback) return shown.feedback;
    if (info) return info;
    const clash = pickClash(clashes, lastEdit);
    if (clash) {
      log('feedback: clash', clash.kind, clash.value);
      return { tone: 'bad', text: clashMessage(clash) };
    }
    return submitMsg;
  }, [shown, info, clashes, lastEdit, submitMsg]);

  const band = useMemo(
    () => (selected === null ? new Set() : new Set(peersOf(selected, size))),
    [selected, size]
  );
  const cells = useMemo(
    () =>
      values.map((value, i) => ({
        value,
        notes: notes[i],
        given: locked[i],
        selected: selected === i,
        band: band.has(i),
        bad: badSet.has(i),
      })),
    [values, notes, locked, selected, band, badSet]
  );
  const lines = useMemo(() => boxLines(size, shape.boxRows, shape.boxCols), [size, shape]);

  const buildResult = useCallback(
    (partial) => {
      const seconds = clock.seconds;
      const run = scoreRun({
        seconds,
        parSeconds: cfg.parSeconds,
        wrongSubmits,
        clashesMade: entry.clashesMade,
      });
      const score = partial ? Math.round((40 * filled) / (size * size)) : run.score;
      const clashWord = entry.clashesMade === 1 ? 'clash' : 'clashes';
      return {
        score,
        skills: [
          { label: 'Logical reasoning', value: score },
          { label: 'Attention to detail', value: run.care },
          { label: 'Processing speed', value: run.speed },
        ],
        summary: partial
          ? `You filled ${filled} of ${size * size} squares of the ${size}×${size} grid.`
          : `Filled the ${size}×${size} grid in ${formatClockLabel(seconds)} with ${entry.clashesMade} ${clashWord} along the way.`,
        verifies: 'Logical reasoning',
      };
    },
    [clock.seconds, cfg.parSeconds, wrongSubmits, entry.clashesMade, filled, size]
  );

  const touchBoard = () => {
    setFrozen(false);
    setSubmitMsg(null);
  };

  const onSelect = (i) => {
    log('tap square', i, { locked: locked[i], value: values[i] });
    touchBoard();
    entry.select(i);
    if (locked[i]) {
      log('branch: puzzle square tapped → "not allowed"');
      setInfo({ tone: 'info', text: GRID_LOGIC_COPY.givenBlocked });
    } else {
      setInfo(null);
    }
  };

  const onDigit = (d) => {
    touchBoard();
    const result = entry.enter(d, (next, idx) =>
      findClashes(next, size, shape).some((c) => c.cells.includes(idx))
    );
    log('digit', d, '→', result);
    if (result === 'blocked') setInfo({ tone: 'info', text: GRID_LOGIC_COPY.givenBlocked });
    else if (result === 'none') entry.select(Math.max(0, values.indexOf(0)));
    else setInfo(null);
  };

  const onErase = () => {
    touchBoard();
    const result = entry.erase();
    log('erase →', result);
    if (result === 'blocked') setInfo({ tone: 'info', text: GRID_LOGIC_COPY.givenBlocked });
    else setInfo(null);
  };

  const onToggleNotes = () => {
    setFrozen(false);
    entry.toggleNotes();
  };

  const onKeyDown = makeGridKeyHandler({
    digitMax: size,
    move: (dr, dc) => {
      setFrozen(false);
      setInfo(null);
      entry.move(dr, dc);
    },
    onDigit,
    onErase,
    onToggleNotes,
  });

  const onSubmit = () => {
    setFrozen(false);
    if (filled < size * size) {
      log('submit: grid not full', { filled });
      setSubmitMsg({ tone: 'info', text: GRID_LOGIC_COPY.incomplete });
      return;
    }
    if (clashes.length) {
      log('submit: clashes remain', clashes.length);
      setWrongSubmits((n) => n + 1);
      setSubmitMsg(null);
      setInfo(null);
      return;
    }
    log('submit: solved');
    setFinished(true);
    g.finish(buildResult(false));
  };

  return {
    name: 'Grid Logic',
    subtitleLead: cfg.subtitleLead,
    progress: {
      countLabel: shown?.filled ?? `${filled} of ${size * size} filled`,
      summary: shown?.strip ?? `${clock.label} so far`,
      dots: [],
      passMark: `Best so far: ${GRID_LOGIC_BEST}`,
    },
    footer: {
      note: '',
      link: { label: 'Done for now', onClick: g.exit },
      action: { label: 'Submit grid', onClick: onSubmit },
    },
    timeUp: { summary: `You filled ${filled} of ${size * size} squares.` },
    onSeeResult: () => g.finish(buildResult(true)),
    head: {
      eyebrow: cfg.eyebrow,
      title: GRID_LOGIC_COPY.title,
      intro: notesOn ? GRID_LOGIC_COPY.notesIntro : cfg.intro,
      clockLabel: `${clock.label} so far`,
      measures: GRID_LOGIC_COPY.measures,
    },
    size,
    cells,
    lines,
    focusIndex: selected ?? Math.max(0, values.indexOf(0)),
    onSelect,
    onKeyDown,
    ariaLabel: `${size} by ${size} grid`,
    describe: describeSudokuCell(size),
    feedback,
    pad: {
      layout: padFor(size),
      notesOn,
      onDigit,
      onErase,
      onToggleNotes,
      hint: notesOn ? GRID_LOGIC_COPY.notesHint : cfg.hint,
    },
  };
};

const MockGridLogic = ({ level, frame }) => (
  <GridGameBoard m={useGridLogicMock({ level, frame })} />
);

/* live: the server engine holds the solution, judges clashes and scores the run */
const LiveGridLogic = () => {
  const run = useGameRun();
  const m = useGridLogicLive(run);
  if (run.status !== 'ready' && run.status !== 'finished') {
    return <GameV2LiveGate run={run} name="Grid Logic" subtitleLead="Logical reasoning" />;
  }
  return <GridGameBoard m={{ ...m, pad: { ...m.pad, layout: padFor(m.size) } }} />;
};

const GridLogic = ({ frame }) => {
  const g = useGameV2Params();
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? (
    <LiveGridLogic key={key} />
  ) : (
    <MockGridLogic key={key} level={g.level} frame={frame} />
  );
};

export default GridLogic;

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'grid-logic': GridLogic };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'grid-logic': {
    name: 'Grid Logic',
    // live results do not store the board size, so the live header names the skill only
    get subtitleLead() {
      return isMockGamesUrl() ? 'Logical reasoning · 6×6 puzzle' : 'Logical reasoning';
    },
    /* a getter: the live strip follows the run just finished (the server's correct / total = squares right of the empty ones) */
    get resultProgress() {
      const stored = readLiveResult('grid-logic');
      if (stored) {
        return {
          countLabel: stored.completed
            ? 'Grid complete'
            : `${stored.correct ?? 0} of ${stored.total ?? 0} squares right`,
          summary: stored.summary ?? '',
          dots: [],
          passMark: liveBestMark(stored),
        };
      }
      if (!isMockGamesUrl()) return null;
      // ⚠️ ASSUMPTION: the result frame's progress strip (no dots in this game)
      return {
        countLabel: 'Grid complete',
        summary: 'Every row, column and box once',
        dots: [],
        passMark: `Best so far: ${GRID_LOGIC_BEST}`,
      };
    },
  },
};
