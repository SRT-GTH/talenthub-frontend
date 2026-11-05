import { useCallback, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';

const log = debug('useGridEntry');

/*
 * useGridEntry — the player's side of a grid game (shared by Grid Logic and Sum Grid):
 * the digits they typed, pencil marks, the selected square, Notes mode and the square they touched last.
 *   locked[i]   true for puzzle squares (Grid Logic givens / bonus givens) — they cannot be changed
 *   enter(d)    → 'blocked' (locked square) | 'none' (nothing selected) | 'note' | 'value'
 *   erase()     → 'blocked' | 'none' | 'erased'
 *   move(dRow, dCol) / select(index) / toggleNotes()
 *   touch       bumps on every edit so callers can drop frame-only overrides after the first change
 */
export const useGridEntry = ({
  size,
  locked,
  initialValues,
  initialSelected = null,
  initialNotesOn = false,
  initialLastEdit = -1,
}) => {
  const [state, setState] = useState(() => ({
    values: initialValues,
    notes: new Array(size * size).fill(0),
    selected: initialSelected,
    notesOn: initialNotesOn,
    lastEdit: initialLastEdit,
    touch: 0,
    clashesMade: 0,
  }));

  const select = useCallback((index) => {
    log('select', index);
    setState((s) => ({ ...s, selected: index }));
  }, []);

  const move = useCallback(
    (dRow, dCol) => {
      setState((s) => {
        const from = s.selected ?? 0;
        const row = Math.min(size - 1, Math.max(0, Math.floor(from / size) + dRow));
        const col = Math.min(size - 1, Math.max(0, (from % size) + dCol));
        const next = row * size + col;
        log('move', { from, next });
        return { ...s, selected: s.selected === null ? 0 : next };
      });
    },
    [size]
  );

  const toggleNotes = useCallback(() => {
    setState((s) => {
      log('notes', !s.notesOn);
      return { ...s, notesOn: !s.notesOn };
    });
  }, []);

  const enter = useCallback(
    (digit, onClash) => {
      const s = state;
      if (s.selected === null) {
        log('enter: nothing selected');
        return 'none';
      }
      if (locked[s.selected]) {
        log('enter: blocked (locked square)', s.selected);
        return 'blocked';
      }
      if (s.notesOn) {
        if (s.values[s.selected]) {
          log('enter: notes on but the square has a number, ignored');
          return 'blocked-notes';
        }
        const notes = s.notes.slice();
        notes[s.selected] ^= 1 << digit;
        log('note', { square: s.selected, digit, marks: notes[s.selected] });
        setState({ ...s, notes, lastEdit: s.selected, touch: s.touch + 1 });
        return 'note';
      }
      const values = s.values.slice();
      values[s.selected] = values[s.selected] === digit ? 0 : digit;
      const notes = s.notes.slice();
      notes[s.selected] = 0;
      const clashed = Boolean(values[s.selected]) && onClash?.(values, s.selected);
      log('value', { square: s.selected, digit: values[s.selected], clashed });
      setState({
        ...s,
        values,
        notes,
        lastEdit: s.selected,
        touch: s.touch + 1,
        clashesMade: s.clashesMade + (clashed ? 1 : 0),
      });
      return 'value';
    },
    [state, locked]
  );

  const erase = useCallback(() => {
    const s = state;
    if (s.selected === null) return 'none';
    if (locked[s.selected]) {
      log('erase: blocked (locked square)', s.selected);
      return 'blocked';
    }
    const values = s.values.slice();
    const notes = s.notes.slice();
    values[s.selected] = 0;
    notes[s.selected] = 0;
    log('erase', s.selected);
    setState({ ...s, values, notes, lastEdit: s.selected, touch: s.touch + 1 });
    return 'erased';
  }, [state, locked]);

  return useMemo(
    () => ({ ...state, select, move, toggleNotes, enter, erase }),
    [state, select, move, toggleNotes, enter, erase]
  );
};
