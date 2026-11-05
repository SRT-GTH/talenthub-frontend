import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import AdminCopyArea from '../../components/sections/admin/siteCopy/AdminCopyArea.jsx';
import { resolveScreen } from '../../components/sections/admin/siteCopy/siteCopyScreens.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';

const AdminHomePage = lazy(() => import('./AdminHomePage.jsx'));

/*
 * AdminHomeEntry — `/admin`. The real-data staff home (AdminHomePage) unless a Platform Admin 7.8 home screen matches the URL: the
 * Content Editor home (`?role=editor`, 7.8.0a/b) or the Super Admin home with the name change waiting (`?role=super&copy=1`, 7.8.6f).
 * See components/sections/admin/siteCopy/siteCopyScreens.js.
 */
const AdminHomeEntry = () => {
  const session = useAdminSession();
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const ctx = { area: 'home', segments: [], params, role: session.role, session, pathname, search };
  const copyHome = (session.mock || session.role === 'editor') && resolveScreen('home', ctx);
  if (copyHome) return <AdminCopyArea area="home" />;
  return (
    <Suspense fallback={null}>
      <AdminHomePage />
    </Suspense>
  );
};

export default AdminHomeEntry;
