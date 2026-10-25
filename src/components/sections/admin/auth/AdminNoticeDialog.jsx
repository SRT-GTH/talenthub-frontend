import { debug } from '../../../../utils/debug.js';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { NOTICES } from './data/adminAuthData.js';

const log = debug('AdminNoticeDialog');

/*
 * AdminNoticeDialog — the two sign-in notices (Figma 7.0.1c "Your staff account is locked" 8640:416090 · 7.0.1d "This set-up link has expired" 8666:12511):
 * the shared AdminConfirmDialog card with a red primary and a white "Close". ⚠️ ASSUMPTION: the red button has no destination drawn (a Super Admin is
 * reached outside the product): it logs the intent and closes the notice.
 * Props: kind 'locked' | 'expired', onClose.
 */

const AdminNoticeDialog = ({ kind, onClose }) => {
  const n = NOTICES[kind];
  return (
    <AdminConfirmDialog
      title={n.title}
      body={n.body}
      primary={{ label: n.primary, tone: 'red' }}
      secondary="Close"
      onPrimary={() => {
        log('primary action (no destination drawn)', kind);
        onClose();
      }}
      onClose={onClose}
    />
  );
};

export default AdminNoticeDialog;
