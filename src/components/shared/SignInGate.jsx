import { Navigate, Routes, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { isLoggedIn, logoHomePath } from '../../services/auth.api.js';
import { debug } from '../../utils/debug.js';
import { portalAccountMismatch, signInPathFor } from '../../utils/protectedRoutes.js';
import { allowsSignedOutSample, isSampleMode, syncDemoSession } from '../../utils/sampleMode.js';

const log = debug('SignInGate');

/* The signed-in account's type: the stored profile, else the access token's claim. */
const sessionEntityType = () => {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
    const type = user?.entityType || user?.type;
    if (type) return type;
    const part = (localStorage.getItem(STORAGE_KEYS.authToken) || '').split('.')[1];
    if (!part) return null;
    return JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))).entityType || null;
  } catch {
    return null;
  }
};

/*
 * SignInGate (ADR-15) wraps the app's routes. On a protected page (utils/protectedRoutes.js):
 *   - signed out: go to /login?next=<this page>, unless this is a demo or preview (utils/sampleMode.js: ?demo=1, the Demo
 *     navigator's demo session, Site copy preview, dev tooling), which keeps the Figma sample pages;
 *   - signed in to an account of another type (a talent on /recruiter/...): go to that account's own home, because the
 *     page could only show its sample organisation.
 * Every other page renders as before.
 */
const SignInGate = ({ children }) => {
  const { pathname, search } = useLocation();
  syncDemoSession(search);
  const signIn = signInPathFor(pathname, search);
  if (signIn) {
    if (!isLoggedIn()) {
      if (!allowsSignedOutSample(search)) {
        log('signed out on a protected page -> sign in', pathname);
        return <Navigate to={signIn} replace />;
      }
      log('signed out, demo / preview: sample page kept', pathname);
    } else if (!isSampleMode(search) && portalAccountMismatch(pathname, sessionEntityType())) {
      const home = logoHomePath();
      log('signed in to another account type -> own home', { pathname, home });
      return <Navigate to={home} replace />;
    }
  }
  return children;
};

/* The app's top-level <Routes>, behind the gate (App.jsx). */
export const GatedRoutes = (props) => (
  <SignInGate>
    <Routes {...props} />
  </SignInGate>
);

export default SignInGate;
