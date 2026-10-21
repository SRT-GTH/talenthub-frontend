import { Navigate, useParams } from 'react-router-dom';

/* `/messages/:conversationId` — the link in "New message" notifications and emails (backend messaging.service.js
 * actionUrl) opens that conversation in the inbox. */
const MessageLinkRedirect = () => {
  const { conversationId } = useParams();
  return <Navigate to={`/messages?c=${encodeURIComponent(conversationId ?? '')}`} replace />;
};

export default MessageLinkRedirect;
