import { useContext } from 'react';
import { AvatarSelectionContext } from '../providers/avatarSelectionContext.js';

/*
 * useAvatarSelection — consumer hook for AvatarSelectionContext.
 *
 * Lives in its own file because the eslint react-refresh/only-export-components
 * rule wants providers to export only components. Returns
 * `{ selection, setField, toggleMulti }`.
 */
export const useAvatarSelection = () => useContext(AvatarSelectionContext);

export default useAvatarSelection;
