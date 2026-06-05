import { useMemo, useRef, useState } from 'react';
import { AvatarSelectionContext, AVATAR_SELECTION_DEFAULTS } from './avatarSelectionContext.js';
import { debug } from '../utils/debug.js';

const log = debug('AvatarSelectionProvider');

/*
 * AvatarSelectionProvider — shared selection state across the 5 avatar
 * customisation steps (Style, Skin, Hair, Extras, Outfit).
 *
 * The state shape mirrors the Figma panels. Each step page reads + writes
 * its slice via the `useAvatarSelection()` hook; selections persist
 * across step navigation as long as the user stays in the avatar flow.
 *
 * Undo:
 *   Every state-changing action (setField, toggleMulti, reset) snapshots
 *   the PREVIOUS state into the `history` stack before mutating. Calling
 *   `undo()` pops the latest snapshot and applies it — so users can step
 *   back one action at a time. The history is bounded to a sensible
 *   depth so it doesn't grow forever during long sessions.
 *
 * Lifting to Redux is straightforward later — every consumer goes through
 * a single hook, so we can swap the source without touching the panels.
 */

// Cap the undo history so it doesn't grow unbounded. Plenty of headroom
// for a typical customise-then-tweak session.
const HISTORY_MAX = 50;

const AvatarSelectionProvider = ({ initial, children }) => {
  const [selection, setSelection] = useState({ ...AVATAR_SELECTION_DEFAULTS, ...initial });
  const [history, setHistory] = useState([]);
  // Snapshot the initial overrides in a ref so `reset()` works regardless
  // of whether `initial` is provided as a stable object or rebuilt on every
  // render.
  const initialRef = useRef(initial);

  const value = useMemo(() => {
    // Push the CURRENT selection onto the history stack before mutation.
    // Capped at HISTORY_MAX so the array doesn't grow without bound.
    const pushHistory = () => {
      setHistory((h) => {
        const next = [...h, selection];
        return next.length > HISTORY_MAX ? next.slice(-HISTORY_MAX) : next;
      });
    };

    const setField = (key, fieldValue) => {
      log('setField', key, fieldValue);
      pushHistory();
      setSelection((prev) => ({ ...prev, [key]: fieldValue }));
    };

    const toggleMulti = (key, fieldValue) => {
      pushHistory();
      setSelection((prev) => {
        const arr = prev[key] || [];
        const next = arr.includes(fieldValue)
          ? arr.filter((v) => v !== fieldValue)
          : [...arr, fieldValue];
        log('toggleMulti', key, fieldValue, '→', next);
        return { ...prev, [key]: next };
      });
    };

    // Undo: revert to the most recent snapshot in history. If history is
    // empty (nothing to undo), no-op.
    const undo = () => {
      if (history.length === 0) {
        log('undo — nothing to undo');
        return;
      }
      log('undo — popping last action', { historyDepth: history.length });
      const previous = history[history.length - 1];
      setSelection(previous);
      setHistory((h) => h.slice(0, -1));
    };

    // Reset every field to its default. Snapshots current state first so
    // the user can undo a mis-clicked reset.
    const reset = () => {
      log('reset — restoring defaults');
      pushHistory();
      setSelection({ ...AVATAR_SELECTION_DEFAULTS, ...(initialRef.current || {}) });
    };

    return { selection, setField, toggleMulti, undo, reset };
  }, [selection, history]);

  return (
    <AvatarSelectionContext.Provider value={value}>{children}</AvatarSelectionContext.Provider>
  );
};

export default AvatarSelectionProvider;
export { AvatarSelectionProvider };
