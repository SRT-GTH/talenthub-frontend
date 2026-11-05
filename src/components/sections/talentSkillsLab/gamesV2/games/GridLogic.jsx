import { useCallback, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameClock } from '../useGameClock.js';
import { useGameV2Params } from '../gamesV2State.js';
import GridBoard from '../gridLogic/GridBoard.jsx';
import GridFeedback from '../gridLogic/GridFeedback.jsx';
import GridHead from '../gridLogic/GridHead.jsx';
import GridPad from '../gridLogic/GridPad.jsx';
import GridPlayArea from '../gridLogic/GridPlayArea.jsx';
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

const log = debug('GridLogic');

/*
 * Grid Logic — Sudoku (Figma "Games v2 · 8" GL-01 … GL-04). Levels: Beginner 4×4 (⚠️), Intermediate 6×6 (drawn, boxes 2×3),
 * Advanced 6×6 harder (⚠️), Expert 9×9 (drawn). Real play: select a square (tap / arrows), number pad or keys 1…N, Notes mode
 * (pencil marks), Erase, live clash highlighting (row → column → box), puzzle squares are locked ("not allowed"), Submit grid
 * validates, Done for now leaves (progress is "saved as you go" — a mock, nothing persists).
 *   ?f=GL-01…04 boots the exact frame state with the clock frozen (data in gridLogicData.js, frame quirks listed there).
 */
const PAD_LAYOUTS = {
  4: { cols: 2, keyW: 76, keyH: 64, padW: 260, mobileKeyH: 60, boardPx: 428 },
  6: { cols: 3, keyW: 76, keyH: 64, padW: 300, mobileKeyH: 56, boardPx: 428 },
  9: { cols: 3, keyW: 64, keyH: 64, padW: 280, mobileKeyH: 52, boardPx: 431 },
};

const describeCell = (size) => (i, cell) => {
  const row = Math.floor(i / size) + 1;
  const col = (i % size) + 1;
  const what = cell.value
    ? `${cell.given ? 'puzzle number ' : ''}${cell.value}`
    : cell.notes
      ? 'empty, with pencil marks'
      : 'empty';
  return `Row ${row}, column ${col}, ${what}${cell.bad ? ', clashes' : ''}`;
};

const GridLogicRun = ({ level, frame }) => {
  const g = useGameV2Params();
  const seed = frame ? (GRID_LOGIC_FRAMES[frame] ?? null) : null;
  const cfg = GRID_LOGIC_LEVELS[seed?.level ?? level];
  const { size } = cfg;
  const shape = useMemo(() => boxShape(size), [size]);
  const pad = PAD_LAYOUTS[size];

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

  const progress = {
    countLabel: shown?.filled ?? `${filled} of ${size * size} filled`,
    summary: shown?.strip ?? `${clock.label} so far`,
    dots: [],
    passMark: `Best so far: ${GRID_LOGIC_BEST}`,
  };

  return (
    <GameV2Shell
      name="Grid Logic"
      subtitleLead={cfg.subtitleLead}
      progress={progress}
      footer={{
        note: '',
        link: { label: 'Done for now', onClick: g.exit },
        action: { label: 'Submit grid', onClick: onSubmit },
      }}
      timeUp={{ summary: `You filled ${filled} of ${size * size} squares.` }}
      onSeeResult={() => g.finish(buildResult(true))}
    >
      <GridHead
        eyebrow={cfg.eyebrow}
        title={GRID_LOGIC_COPY.title}
        intro={notesOn ? GRID_LOGIC_COPY.notesIntro : cfg.intro}
        clockLabel={`${clock.label} so far`}
        measures={GRID_LOGIC_COPY.measures}
      />
      <GridPlayArea
        boardPx={pad.boardPx}
        onKeyDown={onKeyDown}
        board={
          <GridBoard
            size={size}
            cells={cells}
            lines={lines}
            focusIndex={selected ?? Math.max(0, values.indexOf(0))}
            onSelect={onSelect}
            ariaLabel={`${size} by ${size} grid`}
            describe={describeCell(size)}
          />
        }
        feedback={<GridFeedback feedback={feedback} />}
        pad={
          <GridPad
            size={size}
            layout={pad}
            notesOn={notesOn}
            onDigit={onDigit}
            onErase={onErase}
            onToggleNotes={onToggleNotes}
            hint={notesOn ? GRID_LOGIC_COPY.notesHint : cfg.hint}
          />
        }
      />
    </GameV2Shell>
  );
};

const GridLogic = ({ frame }) => {
  const g = useGameV2Params();
  return <GridLogicRun key={`${g.level}-${frame ?? 'live'}`} level={g.level} frame={frame} />;
};

export default GridLogic;

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'grid-logic': GridLogic };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'grid-logic': {
    name: 'Grid Logic',
    subtitleLead: 'Logical reasoning · 6×6 puzzle',
    // ⚠️ ASSUMPTION: the result frame's progress strip (no dots in this game)
    resultProgress: {
      countLabel: 'Grid complete',
      summary: 'Every row, column and box once',
      dots: [],
      passMark: `Best so far: ${GRID_LOGIC_BEST}`,
    },
  },
};
