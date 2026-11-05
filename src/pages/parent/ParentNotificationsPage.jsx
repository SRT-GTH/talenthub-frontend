import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import NotificationsPage from '../../components/sections/parent/notifications/NotificationsPage.jsx';

/*
 * ParentNotificationsPage — /parent/notifications, Figma canvas "Parent · 09 Notifications and milestones" 10057:67396, frame PN-04 10043:1351 (All; `?tab=` for the others, see notificationsState.js).
 * The bell pop-up (PN-01) is `?notif=open` on any parent page and is drawn by ParentFrame.
 */
const ParentNotificationsPage = () => (
  <ParentFrame active="notifications">
    <NotificationsPage />
  </ParentFrame>
);

export default ParentNotificationsPage;
