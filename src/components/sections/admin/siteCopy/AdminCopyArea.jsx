import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import AdminFrame from '../AdminFrame.jsx';
import AdminStub from '../AdminStub.jsx';
import { useAdminState } from '../adminState.js';
import { useAdminSession } from '../useAdminSession.js';
import { resolveScreen } from './siteCopyScreens.js';

const log = debug('AdminCopyArea');

/*
 * AdminCopyArea — the page of one Platform Admin 7.8 area (see siteCopyScreens.js for the registry and URL contract). It renders the
 * admin chrome (AdminFrame, with the Site copy nav for the role), resolves the screen for the URL and mounts it. A role without
 * "Read site copy" gets the `noaccess` screen (7.8.7d) instead; a URL no screen matches shows the stub.
 * Props: area ('home' | 'site-copy' | 'product-names' | 'media'). Screens render their own <h1>.
 */
const BASE = {
  home: '/admin',
  'site-copy': '/admin/site-copy',
  'product-names': '/admin/product-names',
  media: '/admin/media',
};

const AdminCopyArea = ({ area }) => {
  const data = useAdminState();
  const session = useAdminSession();
  const { pathname, search } = useLocation();
  const segments = pathname.replace(/\/+$/, '').slice(BASE[area].length).split('/').filter(Boolean);
  const ctx = {
    area,
    segments,
    params: data.params,
    role: session.role,
    session,
    pathname,
    search,
  };
  const allowed = session.copy?.read;
  const screen = resolveScreen(allowed ? area : 'noaccess', ctx);

  useEffect(() => {
    log('mount', {
      area,
      segments,
      role: session.role,
      mock: Boolean(session.mock),
      screen: screen?.id ?? null,
    });
  }, [area, segments.join('/'), search, session.role, session.mock, screen?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const Screen = screen?.Component;
  // The Settings-style screens that live under the 7.8 routes (media storage 7.8.9n, roles / staff 7.8.7a-e) keep "Settings" active.
  const active =
    (area === 'media' && segments[0] === 'storage') || segments[0] === 'settings'
      ? 'settings'
      : undefined;
  return (
    <AdminFrame data={data} title={allowed ? 'Site copy' : 'Not available'} active={active}>
      {Screen ? (
        <Screen ctx={ctx} data={data} session={session} />
      ) : (
        <AdminStub
          name={`Platform copy · ${area}`}
          frames="No Platform Admin 7.8 screen matches this URL yet."
        />
      )}
    </AdminFrame>
  );
};

export default AdminCopyArea;
