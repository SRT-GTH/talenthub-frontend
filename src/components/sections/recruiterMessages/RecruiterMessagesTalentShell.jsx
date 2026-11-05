import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import MessagesFrame from '../talentMessages/MessagesFrame.jsx';
import { useMessagesState } from '../talentMessages/messagesState.js';

const log = debug('RecruiterMessagesTalentShell');

/*
 * RecruiterMessagesTalentShell — the chrome of the two "Talents - Messages" frames (7249:85147, 7249:85536): the
 * talent's own sidebar and top bar (Kofi), with "Messages" active. It reuses the talent Messages shell
 * (talentMessages/MessagesFrame) with the drawn Kofi persona forced on (`demo: true`), so no live API is used.
 * `?rail=collapsed` is understood by that shell too.
 */
const RecruiterMessagesTalentShell = ({ children }) => {
  const talentMessagesState = useMessagesState();

  useEffect(() => {
    log('mount', { rail: talentMessagesState.rail });
  }, [talentMessagesState.rail]);

  return (
    <MessagesFrame messages={{ ...talentMessagesState, demo: true }}>{children}</MessagesFrame>
  );
};

export default RecruiterMessagesTalentShell;
