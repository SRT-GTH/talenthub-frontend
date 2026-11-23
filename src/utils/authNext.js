import { debug } from './debug.js';

const log = debug('authNext');

/*
 * "Log in, then carry on": public pages send a signed-out visitor to `/login?next=<where they were going>`, and the login page
 * goes there after a successful sign-in instead of the role's home.
 *
 * Only same-app paths are followed (must start with one "/", no "//" or "/\" that a browser would read as another site), and only
 * when the path belongs to the signed-in account's own area: a talent can be sent to talent pages, a recruiter to /recruiter/...,
 * and so on. Anything else falls back to the home page, so a recruiter who logs in from a talent link still lands on their dashboard.
 */
const PORTALS = ['/recruiter', '/parent', '/agency', '/institution', '/admin'];
const portalOf = (path) =>
  PORTALS.find((p) => path === p || path.startsWith(`${p}/`) || path.startsWith(`${p}?`)) || null;

// Browsers drop tabs / newlines and treat "\" as "/" in URLs, so "/\t/evil.com" or "/\evil.com" would become "//evil.com":
// refuse control characters, whitespace and backslashes anywhere.
// eslint-disable-next-line no-control-regex
const UNSAFE_CHARS = /[\u0000-\u001F\u007F\s\\]/;

export const isSafeInternalPath = (path) =>
  typeof path === 'string' &&
  path.startsWith('/') &&
  !path.startsWith('//') &&
  !UNSAFE_CHARS.test(path);

/** The path to go to after login: `next` when it is safe and fits the account's home, otherwise `home`. */
export const resolveNext = (next, home) => {
  if (!next) return home;
  if (!isSafeInternalPath(next)) {
    log('ignoring unsafe next', next);
    return home;
  }
  if (portalOf(next) !== portalOf(home)) {
    log('next is outside this account’s area, going home', { next, home });
    return home;
  }
  log('continuing to', next);
  return next;
};

/** `/login?next=…` for a destination inside the app. */
export const loginThen = (next) => `/login?next=${encodeURIComponent(next)}`;
