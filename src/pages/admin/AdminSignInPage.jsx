import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCodeDialog from '../../components/sections/admin/auth/AdminCodeDialog.jsx';
import AdminNoticeDialog from '../../components/sections/admin/auth/AdminNoticeDialog.jsx';
import AdminSignInForm from '../../components/sections/admin/auth/AdminSignInForm.jsx';
import AdminSignInLayout from '../../components/sections/admin/auth/AdminSignInLayout.jsx';
import {
  ROLE_BY_EMAIL,
  SAMPLE_EMAIL,
} from '../../components/sections/admin/auth/data/adminAuthData.js';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminSignInPage');

/*
 * AdminSignInPage — /admin/sign-in (Figma 7.0.1a staff sign-in 8640:415409 · 7.0.1b 2-step code 8640:415778 · 7.0.1c account locked 8640:416090 ·
 * 7.0.1d set-up link expired 8666:12511). Not wrapped in the rail chrome. URL states (see adminState.js for the shared keys):
 *   /admin/sign-in                  the form                                      (7.0.1a)
 *   /admin/sign-in?state=code       the 2-step code dialog over the form          (7.0.1b)
 *   /admin/sign-in?state=locked     "Your staff account is locked" over the form  (7.0.1c)
 *   /admin/sign-in?state=expired    "This set-up link has expired" over the form  (7.0.1d)
 * Real flow (⚠️ ASSUMPTION: frontend only, no real auth): valid staff email + any password → ?state=code → the demo code (adminAuthData.js, never shown) →
 * the role home of that persona (/admin?role=…); 5 wrong codes → ?state=locked. Esc / Close removes the dialog.
 */

const AdminSignInPage = () => {
  const data = useAdminState();
  const navigate = useNavigate();
  const [email, setEmail] = useState(SAMPLE_EMAIL);
  const state = data.state;

  useEffect(() => {
    log('mount', { state });
  }, [state]);

  const closeDialog = () => data.update({ state: null });

  return (
    <AdminSignInLayout>
      <AdminSignInForm
        onSubmit={({ email: value }) => {
          setEmail(value);
          data.update({ state: 'code' });
        }}
      />
      {state === 'code' ? (
        <AdminCodeDialog
          email={email}
          onVerified={() => {
            const role = ROLE_BY_EMAIL[email] ?? 'senior';
            log('signed in', { role });
            navigate(`/admin?role=${role}`);
          }}
          onLocked={() => data.update({ state: 'locked' })}
          onBack={closeDialog}
          onClose={closeDialog}
        />
      ) : null}
      {state === 'locked' || state === 'expired' ? (
        <AdminNoticeDialog kind={state} onClose={closeDialog} />
      ) : null}
    </AdminSignInLayout>
  );
};

export default AdminSignInPage;
