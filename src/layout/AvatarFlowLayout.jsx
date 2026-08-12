import { Outlet } from 'react-router-dom';

/*
 * AvatarFlowLayout — route-level shell for the 5-step avatar customiser.
 *
 * Selection state now lives on the app-root `AvatarSelectionProvider`
 * (see App.jsx) so Career Buddy voice/chat can reuse the same layered
 * avatar. This layout is just the nested outlet for the 5 step routes.
 */
const AvatarFlowLayout = () => <Outlet />;

export default AvatarFlowLayout;
