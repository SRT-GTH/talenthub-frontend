import { debug } from '../../utils/debug.js';
import MessagesOverlays from '../../components/sections/talentMessages/MessagesOverlays.jsx';
import MessagesFrame from '../../components/sections/talentMessages/MessagesFrame.jsx';
import MessagesInbox from '../../components/sections/talentMessages/MessagesInbox.jsx';
import { useMessagesState } from '../../components/sections/talentMessages/messagesState.js';

const log = debug('TalentMessagesPage');

/*
 * TalentMessagesPage — `/messages`, Figma "Talent Messages" (Focused + Playful in one build).
 * Frame ↔ URL table and file ownership: wiki/talent-messages.md. State comes from the URL (messagesState.js).
 * Body = MessagesInbox (package A): title row, inbox list, conversation. Dialogs / panels: MessagesOverlays.
 */
const TalentMessagesPage = () => {
  const messages = useMessagesState();
  log('render', { tab: messages.tab, c: messages.c, state: messages.state, rail: messages.rail });
  return (
    <MessagesFrame messages={messages}>
      <MessagesInbox messages={messages} />
      <MessagesOverlays messages={messages} />
    </MessagesFrame>
  );
};

export default TalentMessagesPage;
