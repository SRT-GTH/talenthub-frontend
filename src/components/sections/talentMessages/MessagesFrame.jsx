import { useEffect } from 'react';
import '../../../styles/talentA11y.css';
import { debug } from '../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../utils/ensurePlayfulFont.js';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import UiStyleScope from '../../shared/UiStyleScope.jsx';
import AskBuddyFab from '../talentHome/AskBuddyFab.jsx';
import { useTalentHomeState } from '../talentHome/talentHomeState.js';
import { useLiveMessagesContext } from './useLiveMessages.js';

const log = debug('MessagesFrame');

/*
 * MessagesFrame — the talent shell every Messages screen sits in (Figma T-MSG-01…14: expanded sidebar with "Messages" active,
 * Wallet item, badges 142 / 142 / 4, nav streak 12). `?rail=collapsed` = icon rail ("c" frames).
 * Props: messages (useMessagesState()), children.
 * Same live-vs-drawn shell rule as CommunityFrame: a signed-in visit to plain /messages shows the talent's own sidebar / nav;
 * every frame URL (`messages.demo`) keeps the drawn Kofi shell.
 */
const MessagesFrame = ({ messages, children }) => {
  const home = useTalentHomeState();
  const liveShell = !messages.demo && Boolean(home?.live);
  const live = useLiveMessagesContext();
  const liveUnread = live ? live.counts.unread + live.counts.requests : 0;
  useEffect(() => {
    ensurePlayfulFont();
    log('mount');
  }, []);

  // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  return (
    <DashboardShell
      role="talent"
      activeNav="messages"
      talentHome={
        liveShell
          ? { ...home, update: messages.update, rail: messages.rail }
          : { ...messages, navStreak: '12', navMessageCount: messages.state === 'empty' ? '' : '5' }
      }
      rail={messages.rail}
      onToggleRail={() =>
        messages.update({ rail: messages.rail === 'collapsed' ? null : 'collapsed' })
      }
      railActiveId="messages"
      railBadges={
        liveShell
          ? liveUnread
            ? { messages: String(liveUnread) }
            : {}
          : { assessment: '142', opportunities: '142', messages: '4' }
      }
    >
      <UiStyleScope enabled />
      {children}
      <AskBuddyFab home={messages} />
    </DashboardShell>
  );
};

export default MessagesFrame;
