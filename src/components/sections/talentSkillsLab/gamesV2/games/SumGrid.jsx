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
import { makeGridKeyHandler } from '../gridLogic/gridKeys.js';
import { cageLines } from '../gridLogic/gridLines.js';
import {
  clashCells,
  clashMessage,
  filledCount,
  formatClockLabel,
  pickClash,
  scoreRun,
} from '../gridLogic/gridRules.js';
import { useGridEntry } from '../gridLogic/useGridEntry.js';
import {
  SUM_GRID_BEST,
  SUM_GRID_COPY,
  SUM_GRID_FRAMES,
  SUM_GRID_LEVELS,
} from '../sumGrid/sumGridData.js';
import {
  buildCages,
  cageIndexByCell,
  cageMessage,
  cageStatus,
  findRowColClashes,
  isSumGridSolved,
} from '../sumGrid/sumGridRules.js';

const log = debug('SumGrid');

/*
 * Sum Grid — KenKen-style cage sums (Figma "Games v2 · 8" SG-01 … SG-04). Fill every square with 1…N so no number repeats in a row
 * or column and every cage makes its target with its sign (+ − × ÷). Levels: Beginner 3×3 (⚠️), Intermediate 4×4 (drawn),
 * Advanced 5×5 (⚠️), Expert 6×6 (⚠️). Live clashes (row / column) and full-but-wrong cages are flagged; the grid solves itself the
 * moment it is right (SG-04 "Solved!" → See result). ?f=SG-01…04 boots the exact frame (data + quirks in sumGridData.js).
 */
const PAD_LAYOUTS = {
  3: { cols: 3, keyW: 76, keyH: 64, padW: 300, mobileKeyH: 60, boardPx: 428 },
  4: { cols: 2, keyW: 96, keyH: 96, padW: 260, mobileKeyH: 72, boardPx: 424 },
  5: { cols: 3, keyW: 76, keyH: 64, padW: 300, mobileKeyH: 56, boardPx: 428 },
  6: { cols: 3, keyW: 76, keyH: 64, padW: 300, mobileKeyH: 56, boardPx: 428 },
};
const GIVEN_BLOCKED = 'That number is part of the puzzle. Pick an empty square.';

const toIndex = (size, [row, col]) => (row - 1) * size + (col - 1);

const SumGridRun = ({ level, frame }) => {
  const g = useGameV2Params();
  const seed = frame ? (SUM_GRID_FRAMES[frame] ?? null) : null;
  const cfg = SUM_GRID_LEVELS[seed?.level ?? level];
  const { size } = cfg;
  const pad = PAD_LAYOUTS[size];

  const cages = useMemo(() => buildCages(cfg.cages, size), [cfg, size]);
  const cageOf = useMemo(() => cageIndexByCell(cages, size), [cages, size]);
  const lines = useMemo(() => cageLines(cageOf, size), [cageOf, size]);
  const labels = useMemo(() => {
    const out = {};
    cages.forEach((cage) => (out[Math.min(...cage.cells)] = cage.label));
    return out;
  }, [cages]);

  const { locked, startValues } = useMemo(() => {
    const base = new Array(size * size).fill(0);
    if (!seed)
      cfg.bonusGivens.forEach((b) => {
        base[toIndex(size, [b.row, b.col])] = b.value;
      });
    const lockedFlags = base.map(Boolean);
    if (seed)
      seed.users.forEach(([r, c, v]) => {
        base[toIndex(size, [r, c])] = v;
      });
    log('puzzle ready', { level: cfg.level, size, frame, cages: cages.length });
    return { locked: lockedFlags, startValues: base };
  }, [cfg, seed, size, frame, cages.length]);

  const entry = useGridEntry({
    size,
    locked,
    initialValues: startValues,
    initialSelected: seed
      ? seed.selected
        ? toIndex(size, seed.selected)
        : null
      : Math.max(0, startValues.indexOf(0)),
    initialNotesOn: false,
    initialLastEdit: seed?.lastEdit ? toIndex(size, seed.lastEdit) : -1,
  });
  const { values, notes, selected, notesOn, lastEdit } = entry;

  const [frozen, setFrozen] = useState(Boolean(seed));
  const [info, setInfo] = useState(null);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [wrongSubmits, setWrongSubmits] = useState(0);
  const shown = frozen ? (seed?.shown ?? null) : null;

  const solved = useMemo(() => isSumGridSolved(values, cages, size), [values, cages, size]);
  const clock = useGameClock({
    start: seed?.clockSeconds ?? 0,
    direction: 'up',
    running: !seed && !g.modal && !solved,
  });

  const clashes = useMemo(() => findRowColClashes(values, size), [values, size]);
  const wrongCages = useMemo(
    () =>
      cages.map((cage, i) => (cageStatus(cage, values) === 'wrong' ? i : -1)).filter((i) => i >= 0),
    [cages, values]
  );
  const badSet = useMemo(() => {
    if (shown?.bad) {
      log('frame override: flagged squares', shown.bad);
      return new Set(shown.bad.map((rc) => toIndex(size, rc)));
    }
    const out = clashCells(clashes);
    wrongCages.forEach((i) => cages[i].cells.forEach((cell) => out.add(cell)));
    return out;
  }, [shown, clashes, wrongCages, cages, size]);
  const filled = filledCount(values);

  const feedback = useMemo(() => {
    if (shown?.feedback) return shown.feedback;
    if (solved) return { tone: 'ok', text: SUM_GRID_COPY.solvedMessage };
    if (info) return info;
    const clash = pickClash(clashes, lastEdit);
    if (clash) {
      log('feedback: clash', clash.kind, clash.value);
      return { tone: 'bad', text: clashMessage(clash, { changeHint: false }) };
    }
    const editedCage = lastEdit >= 0 ? cageOf[lastEdit] : -1;
    const wrong = wrongCages.includes(editedCage) ? editedCage : null;
    if (wrong !== null) {
      log('feedback: cage full but wrong', cages[wrong].label);
      return { tone: 'bad', text: cageMessage(cages[wrong], values) };
    }
    return submitMsg;
  }, [shown, solved, info, clashes, lastEdit, cageOf, wrongCages, cages, values, submitMsg]);

  const cells = useMemo(
    () =>
      values.map((value, i) => ({
        value,
        notes: notes[i],
        given: locked[i],
        selected: selected === i && !solved,
        bad: !solved && badSet.has(i),
        ok: solved,
        label: labels[i],
        labelBad: !solved && wrongCages.includes(cageOf[i]),
      })),
    [values, notes, locked, selected, solved, badSet, labels, wrongCages, cageOf]
  );

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
          { label: 'Numerical reasoning', value: score },
          { label: 'Logical reasoning', value: Math.max(0, Math.min(100, run.score - 4)) },
          { label: 'Attention to detail', value: run.care },
        ],
        summary: partial
          ? `You filled ${filled} of ${size * size} squares of the ${size}×${size} grid.`
          : `Solved the ${size}×${size} grid in ${formatClockLabel(seconds)} with ${entry.clashesMade} ${clashWord} along the way.`,
        verifies: 'Numerical reasoning',
      };
    },
    [clock.seconds, cfg.parSeconds, wrongSubmits, entry.clashesMade, filled, size]
  );

  const touchBoard = () => {
    setFrozen(false);
    setSubmitMsg(null);
  };

  const onSelect = (i) => {
    if (solved) return;
    log('tap square', i, { locked: locked[i] });
    touchBoard();
    entry.select(i);
    setInfo(locked[i] ? { tone: 'info', text: GIVEN_BLOCKED } : null);
  };

  const onDigit = (d) => {
    if (solved) return;
    touchBoard();
    const result = entry.enter(d, (next, idx) =>
      findRowColClashes(next, size).some((c) => c.cells.includes(idx))
    );
    log('digit', d, '→', result);
    if (result === 'blocked') setInfo({ tone: 'info', text: GIVEN_BLOCKED });
    else if (result === 'none') entry.select(Math.max(0, values.indexOf(0)));
    else setInfo(null);
  };

  const onErase = () => {
    if (solved) return;
    touchBoard();
    const result = entry.erase();
    log('erase →', result);
    setInfo(result === 'blocked' ? { tone: 'info', text: GIVEN_BLOCKED } : null);
  };

  const onToggleNotes = () => {
    if (solved) return;
    setFrozen(false);
    entry.toggleNotes();
  };

  const onKeyDown = makeGridKeyHandler({
    digitMax: size,
    move: (dr, dc) => {
      if (solved) return;
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
      setSubmitMsg({ tone: 'info', text: SUM_GRID_COPY.incomplete });
      return;
    }
    // full but not solved: say what is wrong (row / column first, then the first cage that misses its target)
    const clash = pickClash(clashes, -1);
    setWrongSubmits((n) => n + 1);
    setInfo(null);
    if (clash) {
      log('submit: clash remains', clash.kind, clash.value);
      setSubmitMsg({ tone: 'bad', text: clashMessage(clash, { changeHint: false }) });
    } else if (wrongCages.length) {
      log('submit: cage off target', cages[wrongCages[0]].label);
      setSubmitMsg({ tone: 'bad', text: cageMessage(cages[wrongCages[0]], values) });
    }
  };

  const seeResult = () => {
    log('see result');
    g.finish(buildResult(false));
  };

  const progress = {
    countLabel: shown?.filled ?? `${filled} of ${size * size} filled`,
    summary: shown?.strip ?? `${clock.label} so far`,
    dots: [],
    passMark: `Best so far: ${SUM_GRID_BEST}`,
  };

  return (
    <GameV2Shell
      name="Sum Grid"
      subtitle={`${cfg.subtitleLead} · ${g.ranked ? 'Ranked' : 'Practice doesn’t count to your profile'}`}
      progress={progress}
      footer={
        solved
          ? { note: '', action: { label: 'See result', onClick: seeResult } }
          : {
              note: '',
              link: { label: 'Done for now', onClick: g.exit },
              action: { label: 'Submit grid', onClick: onSubmit },
            }
      }
      timeUp={{ summary: `You filled ${filled} of ${size * size} squares.` }}
      onSeeResult={() => g.finish(buildResult(true))}
    >
      <GridHead
        eyebrow={cfg.eyebrow}
        title={solved ? SUM_GRID_COPY.solvedTitle : SUM_GRID_COPY.title}
        intro={solved ? SUM_GRID_COPY.solvedIntro : SUM_GRID_COPY.intro}
        clockLabel={solved ? `${clock.label} total` : `${clock.label} so far`}
        showSaved={!solved}
        measures={SUM_GRID_COPY.measures}
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
            focusedWeight="font-semibold"
            ariaLabel={`${size} by ${size} cage grid`}
            describe={(i, cell) =>
              `Row ${Math.floor(i / size) + 1}, column ${(i % size) + 1}, ${
                cell.label ? `cage ${cell.label}, ` : ''
              }${cell.value ? cell.value : 'empty'}${cell.bad ? ', needs fixing' : ''}`
            }
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
            hint={SUM_GRID_COPY.hint}
          />
        }
      />
    </GameV2Shell>
  );
};

const SumGrid = ({ frame }) => {
  const g = useGameV2Params();
  return <SumGridRun key={`${g.level}-${frame ?? 'live'}`} level={g.level} frame={frame} />;
};

export default SumGrid;

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'sum-grid': SumGrid };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'sum-grid': {
    name: 'Sum Grid',
    subtitleLead: 'Numerical reasoning · 4×4 · + − × ÷',
    // ⚠️ ASSUMPTION: the result frame's progress strip (no dots in this game)
    resultProgress: {
      countLabel: 'Grid solved',
      summary: 'Every row, column and cage is right',
      dots: [],
      passMark: `Best so far: ${SUM_GRID_BEST}`,
    },
  },
};
