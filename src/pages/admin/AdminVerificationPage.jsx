import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AdminQueueView from '../../components/sections/admin/queue/AdminQueueView.jsx';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import { VERIFICATION } from '../../components/sections/admin/verification/data/adminVerificationQueue.js';
import {
  DIALOGS,
  REVIEWS,
} from '../../components/sections/admin/verification/data/adminVerificationReviews.js';
import VerificationReviewView from '../../components/sections/admin/verification/VerificationReviewView.jsx';
import { Select, TextInput } from '../../components/ui/form';
import { debug } from '../../utils/debug.js';

const log = debug('AdminVerificationPage');

/*
 * AdminVerificationPage — /admin/verification/* (Figma 7.6). Routes and URL states (shared keys in adminState.js):
 *   /admin/verification                      queue (7.6.1a) · ?view=approvals is the Super Admin approvals list of the home (shows the same queue)
 *   /admin/verification/kyb                  partner KYB review (7.6.2a) · ?modal=approve (2b) | info (2c) | reject (2d)
 *   /admin/verification/accreditation        institution accreditation review (7.6.3a)      /admin/verification/mou   agency MoU review (7.6.3b)
 *   /admin/verification/data-request         DPO data-request review (7.6.4a, ?role=dpo) · ?modal=approve (4b) | reject (4c)
 *   /admin/verification/appeal               appeal review (7.6.5a, ?role=super)
 * Real flow (⚠️ ASSUMPTION: mock only): the three decision buttons open the matching dialog; the primary and "Reject" dialogs go back to the queue, "Ask for more info" /
 * "Ask the agency a question" stays on the review. The decision dialog fields are real controls.
 */

const KEYS = {
  kyb: 'kyb',
  accreditation: 'accreditation',
  mou: 'mou',
  'data-request': 'data-request',
  appeal: 'appeal',
};

const DecisionDialog = ({ spec, tone, arrow, onPrimary, onClose }) => {
  const [choice, setChoice] = useState(spec.selectOptions?.[0]);
  const [text, setText] = useState(spec.message);
  return (
    <AdminConfirmDialog
      title={spec.title}
      body={spec.body}
      primary={{ label: spec.primary, tone, arrow }}
      secondary={spec.secondary}
      onPrimary={onPrimary}
      onClose={onClose}
    >
      <div className="flex flex-col gap-[16px]">
        <Select
          label={spec.selectLabel}
          required
          options={spec.selectOptions}
          value={choice}
          onChange={setChoice}
        />
        <TextInput
          label={spec.messageLabel}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </AdminConfirmDialog>
  );
};

const AdminVerificationPage = () => {
  const data = useAdminState();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sub = pathname.replace(/^\/admin\/verification\/?/, '');
  const key = KEYS[sub];
  const modal = data.modal;

  useEffect(() => {
    log('mount', { sub, modal });
  }, [sub, modal]);

  const close = () => data.update({ modal: null });
  const back = () => navigate('/admin/verification');

  if (!key) {
    return (
      <AdminFrame data={data} title="Verification">
        <AdminQueueView
          config={VERIFICATION}
          data={data}
          onRowButton={() => log('claim (no flow drawn)')}
        />
      </AdminFrame>
    );
  }

  const review = REVIEWS[key];
  const dpo = key === 'data-request';
  const decide = (id) => {
    if (id === 'primary') data.update({ modal: 'approve' });
    else if (id === 'info') data.update({ modal: dpo ? 'question' : 'info' });
    else data.update({ modal: 'reject' });
  };

  return (
    <AdminFrame data={data} title="Verification">
      <VerificationReviewView review={review} onDecide={decide} />
      {modal === 'approve' && !dpo ? (
        <AdminConfirmDialog
          title={DIALOGS.approve.title}
          body={DIALOGS.approve.body}
          primary={{ label: DIALOGS.approve.primary, arrow: true }}
          secondary={DIALOGS.approve.secondary}
          onPrimary={back}
          onClose={close}
        />
      ) : null}
      {modal === 'approve' && dpo ? (
        <DecisionDialog
          key="approve"
          spec={DIALOGS.dpoApprove}
          tone="green"
          arrow
          onPrimary={back}
          onClose={close}
        />
      ) : null}
      {modal === 'info' ? (
        <DecisionDialog
          key="info"
          spec={DIALOGS.info}
          tone="green"
          arrow
          onPrimary={close}
          onClose={close}
        />
      ) : null}
      {modal === 'question' ? (
        <DecisionDialog
          key="question"
          spec={{
            ...DIALOGS.info,
            title: 'Ask the agency a question?',
            body: 'The agency keeps its place in the queue. They see exactly what you ask.',
            selectLabel: 'Topic',
            selectOptions: ['Who will see it', 'Legal basis'],
            messageLabel: 'Message to the agency',
            message: 'Please confirm the two named viewers.',
          }}
          tone="green"
          arrow
          onPrimary={close}
          onClose={close}
        />
      ) : null}
      {modal === 'reject' ? (
        <DecisionDialog
          key="reject"
          spec={dpo ? DIALOGS.dpoReject : DIALOGS.reject}
          tone="red"
          onPrimary={back}
          onClose={close}
        />
      ) : null}
    </AdminFrame>
  );
};

export default AdminVerificationPage;
