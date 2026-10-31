import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import ParentMessages from '../../components/sections/parent/messages/ParentMessages.jsx';

/** /parent/messages — the parent's conversations with their wards (top bar Messages button). */
const ParentMessagesPage = () => (
  <ParentFrame active="messages">
    <ParentMessages />
  </ParentFrame>
);

export default ParentMessagesPage;
