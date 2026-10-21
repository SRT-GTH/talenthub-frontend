import { useMemo, useState } from 'react';
import { debug } from '../../utils/debug.js';
import MessagesOverlays from '../../components/sections/talentMessages/MessagesOverlays.jsx';
import MessagesFrame from '../../components/sections/talentMessages/MessagesFrame.jsx';
import MessagesInbox from '../../components/sections/talentMessages/MessagesInbox.jsx';
import { useMessagesState } from '../../components/sections/talentMessages/messagesState.js';
import {
  LiveMessagesProvider,
  useLiveMessages,
} from '../../components/sections/talentMessages/useLiveMessages.js';

const log = debug('TalentMessagesPage');

/*
 * TalentMessagesPage — `/messages`, Figma "Talent Messages" (Focused + Playful in one build).
 * Frame ↔ URL table and file ownership: wiki/talent-messages.md. State comes from the URL (messagesState.js).
 * Body = MessagesInbox (package A): title row, inbox list, conversation. Dialogs / panels: MessagesOverlays.
 * A signed-in talent gets their own conversations (useLiveMessages.js, shared through LiveMessagesProvider); drawn frame
 * URLs keep the mock (messages.demo).
 */
const TalentMessagesPage = () => {
  const messages = useMessagesState();
  // The open conversation (decided by MessagesInbox, which knows the layout) is polled and marked read.
  const [activeId, setActiveId] = useState(null);
  const live = useLiveMessages({ enabled: !messages.demo, activeId });
  const value = useMemo(() => (live ? { ...live, activeId, setActiveId } : null), [live, activeId]);
  log('render', {
    live: Boolean(live),
    tab: messages.tab,
    c: messages.c,
    state: messages.state,
    rail: messages.rail,
  });
  return (
    <LiveMessagesProvider value={value}>
      <MessagesFrame messages={messages}>
        <MessagesInbox messages={messages} />
        <MessagesOverlays messages={messages} />
      </MessagesFrame>
    </LiveMessagesProvider>
  );
};

export default TalentMessagesPage;
