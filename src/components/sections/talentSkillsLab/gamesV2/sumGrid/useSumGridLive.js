import { useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { makeGridKeyHandler } from '../gridLogic/gridKeys.js';
import { cageLines } from '../gridLogic/gridLines.js';
import { useGridServerEntry } from '../gridLogic/useGridServerEntry.js';
import { serverClashText } from '../gridLogic/useGridLogicLive.js';
import { SUM_GRID_COPY } from './sumGridData.js';
import { cageIndexByCell, cageMessage } from './sumGridRules.js';

const log = debug('useSumGridLive');

const LEVEL_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};
const GIVEN_BLOCKED = 'That number is part of the puzzle. Pick an empty square.';
/* server signs → the drawn ones; '=' is a one-square cage whose number is printed (a given square) */
const SIGN = { '+': '+', '-': '−', x: '×', '/': '÷', '=': '' };

/*
 * useSumGridLive — Sum Grid against the server number_grid engine (backend utils/gameEngines/engines/numberGrid.js).
 * Returns the GridGameBoard state (same shape as the mock in games/SumGrid.jsx). Size (3×3 … 6×6) and cages come from the view;
 * red squares = the server's `clashes` plus the squares of its `brokenCages` (full cages that miss their target). The grid
 * solves itself on the server (the result card comes with that move); "Submit grid" asks once, then ends the run (run.submit).
 * Hidden in live: "Best so far" (the server gives none while playing).
 */
export const useSumGridLive = (run) => {
  const g = useGameV2Params();
  const e = useGridServerEntry(run);
  const v = run.view;
  const size = e.size;
  const [info, setInfo] = useState(null);
  const [armed, setArmed] = useState(null);
  const solved = Boolean(run.lastResult?.solved);
  const levelId = run.difficulty || g.level;

  const cages = useMemo(
    () =>
      (v?.cages ?? []).map((cg) => {
        const sign = SIGN[cg.op] ?? cg.op ?? '';
        return {
          id: cg.id,
          op: sign,
          target: cg.target,
          label: `${cg.target}${sign}`,
          cells: cg.cells ?? [],
        };
      }),
    [v?.cages]
  );
  const cageOf = useMemo(() => cageIndexByCell(cages, size), [cages, size]);
  const lines = useMemo(() => cageLines(cageOf, size), [cageOf, size]);
  const labels = useMemo(() => {
    const out = {};
    cages.forEach((cage) => {
      if (cage.cells.length) out[Math.min(...cage.cells)] = cage.label;
    });
    return out;
  }, [cages]);
  const broken = useMemo(() => {
    const ids = new Set(v?.brokenCages ?? []);
    return cages.map((c, i) => (ids.has(c.id) ? i : -1)).filter((i) => i >= 0);
  }, [v?.brokenCages, cages]);
  const badSet = useMemo(() => {
    const out = new Set(e.clashSet);
    broken.forEach((i) => cages[i].cells.forEach((cell) => out.add(cell)));
    return out;
  }, [e.clashSet, broken, cages]);

  const cells = useMemo(
    () =>
      e.values.map((value, i) => ({
        value,
        notes: e.notes[i],
        given: e.locked[i],
        selected: !solved && e.selected === i,
        bad: !solved && badSet.has(i),
        ok: solved,
        label: labels[i],
        labelBad: !solved && broken.includes(cageOf[i]),
      })),
    [e.values, e.notes, e.locked, e.selected, solved, badSet, labels, broken, cageOf]
  );

  let feedback = null;
  if (solved) feedback = { tone: 'ok', text: SUM_GRID_COPY.solvedMessage };
  else if (e.error)
    feedback = { tone: e.error.code === 'GIVEN_CELL' ? 'info' : 'bad', text: e.error.text };
  else if (info) feedback = info;
  else {
    const clash = serverClashText(e.values, size, null, e.clashSet, e.lastEdit, {
      changeHint: false,
    });
    const edited = e.lastEdit >= 0 ? cageOf[e.lastEdit] : -1;
    const wrong = broken.includes(edited) ? edited : (broken[0] ?? null);
    if (clash) feedback = { tone: 'bad', text: clash };
    else if (e.clashSet.size)
      feedback = { tone: 'bad', text: 'A number repeats in a row or column.' };
    else if (wrong !== null && cages[wrong]?.cells.every((c) => e.values[c])) {
      feedback = { tone: 'bad', text: cageMessage(cages[wrong], e.values) };
    } else feedback = armed;
  }

  const touch = () => {
    setArmed(null);
    setInfo(null);
  };
  const onSelect = (i) => {
    if (solved) return;
    touch();
    e.select(i);
    if (e.locked[i]) setInfo({ tone: 'info', text: GIVEN_BLOCKED });
  };
  const onDigit = (d) => {
    if (solved) return;
    touch();
    const r = e.enter(d);
    log('digit', d, r);
    if (r === 'blocked') setInfo({ tone: 'info', text: GIVEN_BLOCKED });
  };
  const onErase = () => {
    if (solved) return;
    touch();
    if (e.erase() === 'blocked') setInfo({ tone: 'info', text: GIVEN_BLOCKED });
  };
  const onToggleNotes = () => {
    if (!solved) e.toggleNotes();
  };
  const onKeyDown = makeGridKeyHandler({
    digitMax: size,
    move: (dr, dc) => {
      if (solved) return;
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
    const why = e.filled < e.total ? 'Some squares are still empty.' : 'The grid isn’t right yet.';
    setInfo(null);
    setArmed({
      tone: 'info',
      text: `${why} Tap Submit grid again to finish now and score what you have.`,
    });
  };

  const signs = [...new Set(cages.map((c) => c.op).filter(Boolean))].join(' ');
  const clock =
    g.modal === 'offline' ? 'Paused' : run.timeLabel ? `${run.timeLabel} left` : 'No time limit';
  const ranked = (run.mode ?? g.mode) === 'ranked';

  return {
    name: 'Sum Grid',
    subtitle: `Numerical reasoning · ${size}×${size}${signs ? ` · ${signs}` : ''} · ${
      ranked ? 'Ranked' : 'Practice doesn’t count to your profile'
    }`,
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
      title: solved ? SUM_GRID_COPY.solvedTitle : SUM_GRID_COPY.title,
      intro: solved ? SUM_GRID_COPY.solvedIntro : SUM_GRID_COPY.intro,
      clockLabel: clock,
      showSaved: !solved,
      measures: SUM_GRID_COPY.measures,
    },
    size,
    cells,
    lines,
    focusIndex: e.selected ?? 0,
    onSelect,
    onKeyDown,
    focusedWeight: 'font-semibold',
    ariaLabel: `${size} by ${size} cage grid`,
    describe: (i, cell) =>
      `Row ${Math.floor(i / size) + 1}, column ${(i % size) + 1}, ${
        cell.label ? `cage ${cell.label}, ` : ''
      }${cell.value ? cell.value : 'empty'}${cell.bad ? ', needs fixing' : ''}`,
    feedback,
    pad: { notesOn: e.notesOn, onDigit, onErase, onToggleNotes, hint: SUM_GRID_COPY.hint },
  };
};
