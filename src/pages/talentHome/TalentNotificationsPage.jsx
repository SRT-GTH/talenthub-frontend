import { useEffect, useMemo } from 'react';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import DashboardShell from '../../components/sections/dashboard/DashboardShell.jsx';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import { useTalentHomeState } from '../../components/sections/talentHome/talentHomeState.js';
import AskBuddyFab from '../../components/sections/talentHome/AskBuddyFab.jsx';
import NotificationsScreen from '../../components/sections/notifications/NotificationsScreen.jsx';

const log = debug('TalentNotificationsPage');

/*
 * TalentNotificationsPage — `/notifications`, Figma "Talent Notification Screens" (7471:53182):
 * N-05 full screen (7471:55841) and N-06 Unread / inbox zero (7471:56304), each in Playful +
 * Focused (8110:*) and with the collapsed or expanded sidebar ("e" frames, `?rail=expanded`).
 * The pop-up (N-01..N-04) and Help overlay (HP) are opened from the top-nav bell / help buttons on
 * any talent page (`?notif=open|empty|loading`, `?help=1`) — see DashboardTopNav.
 * Playful + Focused share one build through <UiStyleScope> (wiki/playful-mode.md).
 */
const TalentNotificationsPage = () => {
  const base = useTalentHomeState();
  // Figma's notification frames show streak 12 in the top nav (the day-1 shell otherwise).
  const home = useMemo(() => ({ ...base, navStreak: '12' }), [base]);

  useEffect(() => {
    ensurePlayfulFont();
  }, []);

  // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', { filter: home.filter, rail: home.rail, readAll: home.readAll });
  }, [home.filter, home.rail, home.readAll]);

  return (
    <DashboardShell
      role="talent"
      talentHome={home}
      rail={home.rail}
      onToggleRail={() => home.update({ rail: home.rail === 'collapsed' ? 'expanded' : null })}
      railActiveId="messages"
      railBadges={{ messages: '4' }}
    >
      <UiStyleScope enabled />
      <NotificationsScreen home={home} />
      <AskBuddyFab home={home} />
    </DashboardShell>
  );
};

export default TalentNotificationsPage;
