import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import PageLoader from '../../ui/gthLoader/PageLoader.jsx';
import { agencyMe } from '../../../services/agency.api.js';
import { getApiErrorCode, getApiErrorMessage } from '../../../services/apiErrors.js';
import { isLoggedIn } from '../../../services/auth.api.js';
import { AgencySessionContext, useAgencySessionState } from './agencySessionStore.js';

/*
 * AgencySessionContext: the signed-in agency, read once from GET /api/agency/me (backend services/agency.service.js).
 * <AgencyGate> wraps the signed-in portal routes:
 *   not signed in            -> /login
 *   temporary password       -> /agency/set-password (the backend also refuses data until it is changed)
 *   not an agency / paused   -> an explanation, no portal
 * useAgencySession() (./useAgencySession.js) turns the raw response into the shape the pages already use.
 */

export const AgencySessionProvider = ({ children }) => {
  const [state, setState] = useState({ loading: true, me: null, error: null, code: null });
  const load = useCallback(async () => {
    if (!isLoggedIn()) {
      setState({ loading: false, me: null, error: null, code: 'UNAUTHORIZED' });
      return null;
    }
    setState((s) => ({ ...s, loading: true }));
    try {
      const me = await agencyMe();
      setState({ loading: false, me, error: null, code: null });
      return me;
    } catch (err) {
      const status = err?.response?.status;
      setState({
        loading: false,
        me: null,
        error: getApiErrorMessage(err),
        code: status === 401 ? 'UNAUTHORIZED' : getApiErrorCode(err) || 'ERROR',
      });
      return null;
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const value = useMemo(() => ({ ...state, reload: load }), [state, load]);
  return <AgencySessionContext.Provider value={value}>{children}</AgencySessionContext.Provider>;
};

const Explain = ({ title, body }) => (
  <main className="mx-auto flex min-h-[70vh] max-w-[520px] flex-col justify-center gap-[12px] px-[16px] font-sans">
    <h1 className="m-0 text-[24px] font-semibold text-[#1c2a21]">{title}</h1>
    <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">{body}</p>
    <p className="m-0 text-[15px]">
      <Link to="/login" className="font-semibold text-brand-green underline">
        Sign in with another account
      </Link>
    </p>
  </main>
);

export const AgencyGate = ({ children }) => {
  const ctx = useAgencySessionState();
  const { pathname } = useLocation();
  if (!ctx || ctx.loading) return <PageLoader look="focused" />;
  if (ctx.code === 'UNAUTHORIZED')
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  if (ctx.code === 'NOT_AGENCY') {
    return (
      <Explain
        title="This portal is for government agencies"
        body="You are signed in with an account that is not a government agency account. Agencies get their sign-in details from the Ghana Talent Hub team."
      />
    );
  }
  if (ctx.code === 'AGENCY_SUSPENDED') {
    return (
      <Explain
        title="Your agency's access is paused"
        body={ctx.error || 'Contact the Ghana Talent Hub team to restore access.'}
      />
    );
  }
  if (ctx.code) {
    return (
      <Explain
        title="We couldn't open the agency portal"
        body={ctx.error || 'Please try again in a moment.'}
      />
    );
  }
  if (ctx.me?.mustChangePassword) return <Navigate to="/agency/set-password" replace />;
  return children;
};
