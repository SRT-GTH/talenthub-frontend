import { debug } from '../../../../utils/debug.js';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { NOTICES } from './data/adminAuthData.js';

const log = debug('AdminNoticeDialog');

/*
 * AdminNoticeDialog — the two sign-in notices (Figma 7.0.1c "Your staff account is locked" 8640:416090 · 7.0.1d "This set-up link has expired" 8666:12511):
 * the shared AdminConfirmDialog card. A Super Admin is reached outside the product, so the notice says what to ask for and has one
 * "Close" button (the Figma red "Contact a Super Admin" / "Ask for a new link" had nowhere to go).
 * Props: kind 'locked' | 'expired', onClose.
 */

const AdminNoticeDialog = ({ kind, onClose }) => {
  const n = NOTICES[kind];
  return (
    <AdminConfirmDialog
      title={n.title}
      body={n.body}
      primary={{ label: 'Close' }}
      onPrimary={() => {
        log('close notice', kind);
        onClose();
      }}
      onClose={onClose}
    />
  );
};

export default AdminNoticeDialog;
