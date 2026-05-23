import { Outlet } from 'react-router-dom';
import { AvatarSelectionProvider } from '../providers/AvatarSelectionProvider.jsx';

/*
 * AvatarFlowLayout — route-level shell for the 5-step avatar customiser.
 *
 * Mounting `AvatarSelectionProvider` here (as a layout route in App.jsx)
 * keeps the selection state alive while the user moves between the
 * Style / Skin / Hair / Extras / Outfit steps. Without this, each step
 * page would have to mount its own provider — and the state would reset
 * on every navigation.
 *
 * Previously the provider was wrapped per-page inside AvatarCustomiserPage
 * and AvatarSkinTonePage; the Hair / Extras / Outfit pages had no
 * provider at all, so `useAvatarSelection()` returned the no-op default
 * context and clicks on those panels' tiles did nothing visually.
 */
const AvatarFlowLayout = () => (
  <AvatarSelectionProvider>
    <Outlet />
  </AvatarSelectionProvider>
);

export default AvatarFlowLayout;
