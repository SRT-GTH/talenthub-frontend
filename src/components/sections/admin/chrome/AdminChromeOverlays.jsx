import { useCallback } from 'react';
import AdminMessagesPanel from './AdminMessagesPanel.jsx';
import AdminNotificationsPanel from './AdminNotificationsPanel.jsx';
import {
  AdminA11yPanel,
  AdminHelpPanel,
  AdminLanguagePanel,
  AdminProfileMenu,
} from './AdminSmallPanels.jsx';

/*
 * AdminChromeOverlays — mounts the top-bar panel named by ?modal= (notifications | messages | help | language | a11y |
 * profile). Pages keep their own modal names (suspend, merge …); anything else renders nothing here.
 */
const CHROME_MODALS = ['notifications', 'messages', 'help', 'language', 'a11y', 'profile'];

const AdminChromeOverlays = ({ data, session, counts }) => {
  const close = useCallback(() => data.update({ modal: null }), [data]);
  const open = useCallback((name) => data.update({ modal: name }), [data]);
  if (!session?.signedIn || !CHROME_MODALS.includes(data.modal)) return null;
  const myUserId = session.user?._id || session.user?.id || null;
  switch (data.modal) {
    case 'notifications':
      return <AdminNotificationsPanel onClose={close} />;
    case 'messages':
      return <AdminMessagesPanel onClose={close} myUserId={myUserId} />;
    case 'help':
      return <AdminHelpPanel onClose={close} session={session} />;
    case 'language':
      return <AdminLanguagePanel onClose={close} />;
    case 'a11y':
      return <AdminA11yPanel onClose={close} />;
    case 'profile':
      return <AdminProfileMenu onClose={close} onOpen={open} session={session} counts={counts} />;
    default:
      return null;
  }
};

export default AdminChromeOverlays;
