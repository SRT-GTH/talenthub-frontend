import { useLocation, useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import MessagesView from '../../components/sections/institution/messages/MessagesView.jsx';

/*
 * InstitutionMessagesPage — Figma 11.3.3a-g (canvas 8520:10). Routes (InstitutionApp.jsx): /institution/messages · /new · /:threadId.
 * URL keys: tab=drafts · state=empty|scheduled|delivery-problem · step=confirm|edit · modal=failures (documented in MessagesView).
 */
const InstitutionMessagesPage = () => {
  const data = useInstitutionState();
  const { threadId } = useParams();
  const { pathname } = useLocation();
  const isNew = pathname.replace(/\/+$/, '').endsWith('/messages/new');
  return (
    <InstitutionFrame data={data} title="Messages" active="messages">
      <MessagesView data={data} threadId={isNew ? undefined : threadId} isNew={isNew} />
    </InstitutionFrame>
  );
};

export default InstitutionMessagesPage;
