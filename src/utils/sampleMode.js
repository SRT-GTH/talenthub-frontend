import { debug } from './debug.js';

const log = debug('sampleMode');

/*
 * Sample data rule (ADR-15 "No Sample Data in Signed-in Sessions").
 *
 * The Figma sample people, organisations and numbers are shown only in these modes:
 *   ?copyPreview=<token>   staff Site copy preview (auth.api.js isLoggedIn() is false there too)
 *   ?demo=1                design checks and walkthroughs; it also starts a demo session in this tab
 *   demo session           started by ?demo=1 or by the dev-only Demo navigator (sessionStorage, this tab only),
 *                          ended by ?demo=0
 *   dev tooling            localStorage `gth:demo` = '1' in a dev build (the Playwright suites set it, see
 *                          playwright.config.js), so the suites keep drawing the sample screens signed out
 * Everywhere else a signed-in session shows its own data or an honest empty / loading / error state, and a signed-out
 * visitor on a protected page is sent to sign in (components/shared/SignInGate.jsx, utils/protectedRoutes.js).
 * A demo session only lets a signed-out visitor see sample pages; it never puts sample data in front of a signed-in user.
 */
const SESSION_KEY = 'gth:demo-session';
const TOOLING_KEY = 'gth:demo';

const paramsOf = (search) => {
  try {
    return new URLSearchParams(search ?? window.location.search);
  } catch {
    return new URLSearchParams();
  }
};

const isDevBuild = () => {
  try {
    return Boolean(import.meta.env?.DEV);
  } catch {
    return false;
  }
};

const inDemoSession = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
};

const toolingDemo = () => {
  if (!isDevBuild()) return false;
  try {
    return window.localStorage.getItem(TOOLING_KEY) === '1';
  } catch {
    return false;
  }
};

/** Staff Site copy preview (`?copyPreview=`). */
export const inCopyPreview = (search) => paramsOf(search).has('copyPreview');

/** Explicit sample mode for this URL: Site copy preview or `?demo=1`. Signed-in screens show sample data only then. */
export const isSampleMode = (search) => {
  const p = paramsOf(search);
  return p.has('copyPreview') || p.get('demo') === '1';
};

/** Start this tab's demo session (the Demo navigator, `?demo=1`). */
export const startDemoSession = (why) => {
  try {
    if (window.sessionStorage.getItem(SESSION_KEY) === '1') return;
    window.sessionStorage.setItem(SESSION_KEY, '1');
    log('demo session on:', why);
  } catch {
    /* private mode: ?demo=1 still works page by page */
  }
};

export const endDemoSession = () => {
  try {
    if (window.sessionStorage.getItem(SESSION_KEY) !== '1') return;
    window.sessionStorage.removeItem(SESSION_KEY);
    log('demo session off');
  } catch {
    /* nothing stored */
  }
};

/** `?demo=1` starts this tab's demo session and `?demo=0` ends it. */
export const syncDemoSession = (search) => {
  const demo = paramsOf(search).get('demo');
  if (demo === '1') startDemoSession('?demo=1');
  else if (demo === '0') endDemoSession();
};

/** May a signed-out visitor see the sample version of a protected page? */
export const allowsSignedOutSample = (search) =>
  isSampleMode(search) || inDemoSession() || toolingDemo();
