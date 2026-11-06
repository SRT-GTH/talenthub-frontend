import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';

const log = debug('useGridServerEntry');

/*
 * useGridServerEntry — the player's side of a LIVE grid game (Grid Logic = sudoku engine, Sum Grid = number_grid engine).
 * The squares, the puzzle squares and the clashes come from the server view (`view.cells[{index, value, given}]`,
 * `view.clashes[index…]`); every number is sent as `{ type: 'place', row, col, value }` (value 0 = erase) and the server
 * decides when the grid is solved. Only the selection, Notes mode and pencil marks live in the browser (pencil marks are
 * never sent: neither engine has a notes action).
 *   values / locked / clashSet / filled / total
 *   selected, notesOn, notes (bit masks), lastEdit
 *   select(i) · move(dRow, dCol) · toggleNotes()
 *   enter(d) → 'none' | 'blocked' | 'note' | 'blocked-notes' | 'sent'        erase() → 'none' | 'blocked' | 'sent'
 *   error     { code, text } of the last refused move (422), cleared by the next edit
 * A sent number shows at once (pending) and is replaced by the server's view when the answer arrives.
 */
export const useGridServerEntry = (run) => {
  const g = useGameV2Params();
  const v = run.view;
  const size = v?.size ?? 0;
  const serverCells = useMemo(() => v?.cells ?? [], [v]);
  const [pending, setPending] = useState({});
  const [ui, setUi] = useState({ selected: null, notesOn: false, notes: {}, lastEdit: -1 });
  const [error, setError] = useState(null);
  const alive = useRef(true);
  useEffect(
    () => () => {
      alive.current = false;
    },
    []
  );

  const values = useMemo(
    () => serverCells.map((c) => (c.index in pending ? pending[c.index] : c.value || 0)),
    [serverCells, pending]
  );
  const locked = useMemo(() => serverCells.map((c) => Boolean(c.given)), [serverCells]);
  const clashSet = useMemo(() => new Set(v?.clashes ?? []), [v]);
  const notes = useMemo(
    () => values.map((value, i) => (value ? 0 : (ui.notes[i] ?? 0))),
    [values, ui.notes]
  );
  const firstEmpty = Math.max(0, values.indexOf(0));
  const selected = ui.selected ?? (values.length ? firstEmpty : null);
  const closed = run.status !== 'ready' || Boolean(v?.finished) || Boolean(g.modal);

  const select = useCallback((index) => {
    log('select', index);
    setUi((s) => ({ ...s, selected: index }));
  }, []);

  const move = useCallback(
    (dRow, dCol) => {
      setUi((s) => {
        const from = s.selected ?? 0;
        const row = Math.min(size - 1, Math.max(0, Math.floor(from / size) + dRow));
        const col = Math.min(size - 1, Math.max(0, (from % size) + dCol));
        return { ...s, selected: row * size + col };
      });
    },
    [size]
  );

  const toggleNotes = useCallback(() => setUi((s) => ({ ...s, notesOn: !s.notesOn })), []);

  const place = useCallback(
    async (i, value) => {
      setError(null);
      setPending((p) => ({ ...p, [i]: value }));
      setUi((s) => ({ ...s, lastEdit: i, notes: { ...s.notes, [i]: 0 } }));
      log('place', { i, value });
      const res = await run.act({ type: 'place', row: Math.floor(i / size), col: i % size, value });
      if (!alive.current) return;
      setPending((p) => {
        const next = { ...p };
        delete next[i];
        return next;
      });
      if (res?.error) {
        log('refused', res.code);
        setError({ code: res.code, text: res.error });
      }
    },
    [run, size]
  );

  const enter = useCallback(
    (digit) => {
      if (closed) return 'none';
      if (selected === null) return 'none';
      if (locked[selected]) return 'blocked';
      if (ui.notesOn) {
        if (values[selected]) return 'blocked-notes';
        setError(null);
        setUi((s) => ({
          ...s,
          lastEdit: selected,
          notes: { ...s.notes, [selected]: (s.notes[selected] ?? 0) ^ (1 << digit) },
        }));
        return 'note';
      }
      place(selected, values[selected] === digit ? 0 : digit);
      return 'sent';
    },
    [closed, selected, locked, ui.notesOn, values, place]
  );

  const erase = useCallback(() => {
    if (closed || selected === null) return 'none';
    if (locked[selected]) return 'blocked';
    if (values[selected]) place(selected, 0);
    else setUi((s) => ({ ...s, notes: { ...s.notes, [selected]: 0 } }));
    return 'sent';
  }, [closed, selected, locked, values, place]);

  return {
    size,
    values,
    locked,
    clashSet,
    filled: values.filter(Boolean).length,
    total: values.length,
    selected,
    notesOn: ui.notesOn,
    notes,
    lastEdit: ui.lastEdit,
    error,
    closed,
    select,
    move,
    toggleNotes,
    enter,
    erase,
  };
};
