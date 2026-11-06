import { useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { GRID_LOGIC_COPY } from './gridLogicData.js';
import { makeGridKeyHandler } from './gridKeys.js';
import { boxLines } from './gridLines.js';
import { clashMessage, countWord, findClashes, peersOf, pickClash } from './gridRules.js';
import { useGridServerEntry } from './useGridServerEntry.js';

const log = debug('useGridLogicLive');

const LEVEL_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

/** Screen-reader text of one square (shared with the mock). */
export const describeSudokuCell = (size) => (i, cell) => {
  const row = Math.floor(i / size) + 1;
  const col = (i % size) + 1;
  const what = cell.value
    ? `${cell.given ? 'puzzle number ' : ''}${cell.value}`
    : cell.notes
      ? 'empty, with pencil marks'
      : 'empty';
  return `Row ${row}, column ${col}, ${what}${cell.bad ? ', clashes' : ''}`;
};

/** The words a clash message uses, for the squares the SERVER flagged (`view.clashes`); the browser never judges the grid. */
export const serverClashText = (values, size, shape, clashSet, lastEdit, opts) => {
  if (!clashSet.size) return null;
  const clash = pickClash(
    findClashes(values, size, shape).filter((c) => c.cells.every((i) => clashSet.has(i))),
    lastEdit
  );
  return clash ? clashMessage(clash, opts) : null;
};

/*
 * useGridLogicLive — Grid Logic against the server sudoku engine (backend utils/gameEngines/engines/sudoku.js).
 * Returns the GridGameBoard state (same shape as the mock in games/GridLogic.jsx). Board size and boxes come from the view
 * (4×4 / 6×6 / 9×9 by level), the clock is the server's countdown (run.timeLabel), the grid ends itself on the server when it
 * is full with no clashes (the result card arrives with that move), and "Submit grid" asks once, then ends the run
 * (run.submit) so an unfinished grid is scored as it stands. Hidden in live: "Best so far" (the server gives none while playing).
 */
export const useGridLogicLive = (run) => {
  const g = useGameV2Params();
  const e = useGridServerEntry(run);
  const v = run.view;
  const size = e.size;
  const shape = useMemo(
    () => ({ boxRows: v?.boxRows ?? size, boxCols: v?.boxCols ?? size }),
    [v?.boxRows, v?.boxCols, size]
  );
  const [info, setInfo] = useState(null);
  const [armed, setArmed] = useState(null); // the "Submit grid" question shown once before the run ends
  const solved = Boolean(run.lastResult?.solved);
  const levelId = run.difficulty || g.level;
  const word = countWord(size).toLowerCase();

  const band = useMemo(
    () => (e.selected === null ? new Set() : new Set(peersOf(e.selected, size))),
    [e.selected, size]
  );
  const cells = useMemo(
    () =>
      e.values.map((value, i) => ({
        value,
        notes: e.notes[i],
        given: e.locked[i],
        selected: !solved && e.selected === i,
        band: !solved && band.has(i),
        bad: !solved && e.clashSet.has(i),
        ok: solved,
      })),
    [e.values, e.notes, e.locked, e.selected, band, e.clashSet, solved]
  );
  const lines = useMemo(() => boxLines(size, shape.boxRows, shape.boxCols), [size, shape]);

  let feedback = null;
  if (solved) feedback = { tone: 'ok', text: 'Solved! Every row, column and box is right.' };
  else if (e.error)
    feedback = { tone: e.error.code === 'GIVEN_CELL' ? 'info' : 'bad', text: e.error.text };
  else if (info) feedback = info;
  else {
    const text = serverClashText(e.values, size, shape, e.clashSet, e.lastEdit);
    if (text) feedback = { tone: 'bad', text };
    else if (e.clashSet.size)
      feedback = { tone: 'bad', text: 'Some numbers clash. Change one of them.' };
    else feedback = armed;
  }

  const touch = () => {
    setArmed(null);
    setInfo(null);
  };
  const onSelect = (i) => {
    touch();
    e.select(i);
    if (e.locked[i]) setInfo({ tone: 'info', text: GRID_LOGIC_COPY.givenBlocked });
  };
  const onDigit = (d) => {
    touch();
    const r = e.enter(d);
    log('digit', d, r);
    if (r === 'blocked') setInfo({ tone: 'info', text: GRID_LOGIC_COPY.givenBlocked });
  };
  const onErase = () => {
    touch();
    if (e.erase() === 'blocked') setInfo({ tone: 'info', text: GRID_LOGIC_COPY.givenBlocked });
  };
  const onToggleNotes = () => e.toggleNotes();
  const onKeyDown = makeGridKeyHandler({
    digitMax: size,
    move: (dr, dc) => {
      setInfo(null);
      e.move(dr, dc);
    },
    onDigit,
    onErase,
    onToggleNotes,
  });

  const onSubmit = () => {
    if (armed) {
      log('submit → run.submit');
      run.submit();
      return;
    }
    const why = e.filled < e.total ? 'Some squares are still empty.' : 'Some numbers still clash.';
    setInfo(null);
    setArmed({
      tone: 'info',
      text: `${why} Tap Submit grid again to finish now and score what you have.`,
    });
  };

  const clock =
    g.modal === 'offline' ? 'Paused' : run.timeLabel ? `${run.timeLabel} left` : 'No time limit';

  return {
    name: 'Grid Logic',
    subtitleLead: `Logical reasoning · ${size}×${size} puzzle`,
    progress: { countLabel: `${e.filled} of ${e.total} filled`, summary: clock, dots: [] },
    footer: solved
      ? { note: '' }
      : {
          note: '',
          link: { label: 'Done for now', onClick: g.exit },
          action: { label: 'Submit grid', onClick: onSubmit },
        },
    timeUp: { summary: `You filled ${e.filled} of ${e.total} squares.` },
    onSeeResult: run.submit,
    head: {
      eyebrow: `${(LEVEL_LABEL[levelId] ?? levelId ?? '').toUpperCase()} · ${size}×${size}`,
      title: solved ? 'Grid solved!' : GRID_LOGIC_COPY.title,
      intro: e.notesOn
        ? GRID_LOGIC_COPY.notesIntro
        : `Each row, column and box of ${word} uses 1 to ${size} exactly once.`,
      clockLabel: clock,
      showSaved: !solved,
      measures: GRID_LOGIC_COPY.measures,
    },
    size,
    cells,
    lines,
    focusIndex: e.selected ?? 0,
    onSelect,
    onKeyDown,
    ariaLabel: `${size} by ${size} grid`,
    describe: describeSudokuCell(size),
    feedback,
    pad: {
      notesOn: e.notesOn,
      onDigit,
      onErase,
      onToggleNotes,
      hint: e.notesOn
        ? GRID_LOGIC_COPY.notesHint
        : `Every row, column and box of ${word} uses 1 to ${size} once.`,
    },
  };
};
