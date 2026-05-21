import { useMemo, useState } from 'react';
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
 * Lifting to Redux is straightforward later — every consumer goes through
 * a single hook, so we can swap the source without touching the panels.
 */

const AvatarSelectionProvider = ({ initial, children }) => {
  const [selection, setSelection] = useState({ ...AVATAR_SELECTION_DEFAULTS, ...initial });

  const value = useMemo(() => {
    // Set a single field by key.
    const setField = (key, fieldValue) => {
      log('setField', key, fieldValue);
      setSelection((prev) => ({ ...prev, [key]: fieldValue }));
    };

    // Toggle membership of a value in a multi-select array field.
    const toggleMulti = (key, fieldValue) => {
      setSelection((prev) => {
        const arr = prev[key] || [];
        const next = arr.includes(fieldValue)
          ? arr.filter((v) => v !== fieldValue)
          : [...arr, fieldValue];
        log('toggleMulti', key, fieldValue, '→', next);
        return { ...prev, [key]: next };
      });
    };

    return { selection, setField, toggleMulti };
  }, [selection]);

  return (
    <AvatarSelectionContext.Provider value={value}>{children}</AvatarSelectionContext.Provider>
  );
};

export default AvatarSelectionProvider;
export { AvatarSelectionProvider };
