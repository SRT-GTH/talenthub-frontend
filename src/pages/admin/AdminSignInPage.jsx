import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import AdminCodeDialog from '../../components/sections/admin/auth/AdminCodeDialog.jsx';
import AdminNoticeDialog from '../../components/sections/admin/auth/AdminNoticeDialog.jsx';
import AdminSignInForm from '../../components/sections/admin/auth/AdminSignInForm.jsx';
import AdminSignInLayout from '../../components/sections/admin/auth/AdminSignInLayout.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { logout, requestLoginOtp, resendLoginOtp, verifyLoginOtp } from '../../services/auth.api.js';
import { isStaffType, readStaffSession } from '../../services/adminSession.js';
import { getApiErrorMessage } from '../../services/apiErrors.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminSignInPage');

/*
 * AdminSignInPage — /admin/sign-in (Figma 7.0.1a staff sign-in 8640:415409 · 7.0.1b 2-step code 8640:415778 · 7.0.1c account locked 8640:416090 ·
 * 7.0.1d set-up link expired 8666:12511). Not wrapped in the rail chrome. URL states (see adminState.js for the shared keys):
 *   /admin/sign-in                  the form                                      (7.0.1a)
 *   /admin/sign-in?state=code       the 2-step code dialog over the form          (7.0.1b; only after a password was accepted)
 *   /admin/sign-in?state=locked     "Your staff account is locked" over the form  (7.0.1c)
 *   /admin/sign-in?state=expired    "This set-up link has expired" over the form  (7.0.1d)
 *   ?next=/admin/...                where to go after signing in (set by the route guard)
 * Real flow: POST /auth/login (email + password) -> the code is emailed -> POST /auth/verify-otp -> token stored. Only staff accounts
 * (super_admin, senior_admin, support_agent, content_moderator) get in; anyone else is signed straight back out with a message.
 * A suspended account (403) shows the locked notice; 5 wrong codes do too.
 */

const safeNext = (next) => (next && next.startsWith('/admin') && !next.startsWith('/admin/sign-in') ? next : '/admin');

const AdminSignInPage = () => {
  const data = useAdminState();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);
  const state = data.state;
  const next = safeNext(params.get('next'));

  useEffect(() => {
    log('mount', { state });
  }, [state]);

  // Already signed in as staff: straight to the portal.
  if (readStaffSession() && state !== 'code') return <Navigate to={next} replace />;

  const closeDialog = () => data.update({ state: null });

  const submit = async ({ email: value, password }) => {
    setFormError(null);
    setBusy(true);
    try {
      await requestLoginOtp({ identity: { email: value }, password });
      setEmail(value);
      data.update({ state: 'code' });
    } catch (err) {
      const status = err?.response?.status;
      log('login failed', status);
      if (status === 403) data.update({ state: 'locked' });
      else setFormError(getApiErrorMessage(err, 'That email and password did not match a staff account.'));
    } finally {
      setBusy(false);
    }
  };

  const verify = async (code) => {
    try {
      const { user } = await verifyLoginOtp({ identity: { email }, otp: code });
      if (!isStaffType(user?.entityType)) {
        log('not a staff account', user?.entityType);
        logout();
        closeDialog();
        setFormError('This account is not a GTH staff account.');
        return { ok: true };
      }
      log('signed in', { entityType: user.entityType });
      navigate(next, { replace: true });
      return { ok: true };
    } catch (err) {
      return { ok: false, message: getApiErrorMessage(err, 'That code didn’t match. Check it and try again.') };
    }
  };

  return (
    <AdminSignInLayout>
      <AdminSignInForm onSubmit={submit} error={formError} busy={busy} />
      {state === 'code' && email ? (
        <AdminCodeDialog
          email={email}
          onVerify={verify}
          onResend={() => resendLoginOtp({ identity: { email } })}
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
