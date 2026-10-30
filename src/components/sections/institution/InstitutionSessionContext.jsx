import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import PageLoader from '../../ui/gthLoader/PageLoader.jsx';
import { institutionMe, prefetchInstitutionHome } from '../../../services/institutionPortal.api.js';
import { getApiErrorCode, getApiErrorMessage } from '../../../services/apiErrors.js';
import { isLoggedIn } from '../../../services/auth.api.js';
import {
  InstitutionSessionContext,
  useInstitutionSessionState,
} from './institutionSessionStore.js';

/*
 * InstitutionSessionContext: the signed-in institution, read from GET /api/institution/me (backend services/institution.service.js).
 * <InstitutionGate> wraps the signed-in portal routes:
 *   not signed in                 -> /login (comes back here after)
 *   not an institution's staff    -> an explanation, no portal
 *   paused / removed              -> an explanation
 *   not accredited yet            -> only the accreditation pages, settings and the profile menu (requireApproved pages redirect)
 * useInstitutionSession() (./useInstitutionSession.js) turns the response into the shape the pages already use.
 */

export const InstitutionSessionProvider = ({ children }) => {
  const [state, setState] = useState({ loading: true, me: null, error: null, code: null });
  const firstLoad = useRef(true);
  const load = useCallback(async () => {
    if (!isLoggedIn()) {
      setState({ loading: false, me: null, error: null, code: 'UNAUTHORIZED' });
      return null;
    }
    // A full load of the home page: start its data now instead of after /me (the gate waits for /me).
    if (firstLoad.current && window.location.pathname.replace(/\/+$/, '') === '/institution') {
      prefetchInstitutionHome();
    }
    firstLoad.current = false;
    setState((s) => ({ ...s, loading: true }));
    try {
      const me = await institutionMe();
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
  return (
    <InstitutionSessionContext.Provider value={value}>
      {children}
    </InstitutionSessionContext.Provider>
  );
};

const Explain = ({ title, body }) => (
  <main className="mx-auto flex min-h-[70vh] max-w-[520px] flex-col justify-center gap-[12px] px-[16px] font-sans">
    <h1 className="m-0 text-[24px] font-semibold text-[#1c2a21]">{title}</h1>
    <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">{body}</p>
    <p className="m-0 flex flex-wrap gap-x-[16px] gap-y-[6px] text-[15px]">
      <Link to="/login" className="font-semibold text-brand-green underline">
        Sign in with another account
      </Link>
      <Link to="/institution/sign-up" className="font-semibold text-brand-green underline">
        Register your institution
      </Link>
    </p>
  </main>
);

/* Pages that stay open before the institution is accredited. */
const OPEN_BEFORE_APPROVAL = /^\/institution\/(accreditation(\/status)?|settings(\/.*)?)\/?$/;

export const InstitutionGate = ({ children, requireApproved = true }) => {
  const ctx = useInstitutionSessionState();
  const { pathname, search } = useLocation();
  // a background reload (after a save) keeps the portal mounted
  if (!ctx || (ctx.loading && !ctx.me)) return <PageLoader look="focused" />;
  if (ctx.code === 'UNAUTHORIZED')
    return <Navigate to="/login" replace state={{ from: pathname + search }} />;
  if (ctx.code === 'NOT_INSTITUTION') {
    return (
      <Explain
        title="This portal is for schools and colleges"
        body="You are signed in with an account that is not on an institution’s staff. Register your institution, or ask your institution’s admin to invite you."
      />
    );
  }
  if (ctx.code === 'STAFF_REMOVED' || ctx.code === 'INSTITUTION_PAUSED') {
    return <Explain title="You can’t open this institution" body={ctx.error} />;
  }
  if (!ctx.me) {
    return (
      <Explain
        title="We couldn’t open the institution portal"
        body={ctx.error || 'Please try again in a moment.'}
      />
    );
  }
  const status = ctx.me.verify?.status;
  if (requireApproved && status !== 'approved' && !OPEN_BEFORE_APPROVAL.test(pathname)) {
    return (
      <Navigate
        to={status === 'none' ? '/institution/accreditation' : '/institution/accreditation/status'}
        replace
      />
    );
  }
  return children;
};
