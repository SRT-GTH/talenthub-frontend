/**
 * debug(scope) — returns a logger that prefixes every line with `[scope]`.
 * Logs only fire in dev (`import.meta.env.DEV`); production bundle stays silent.
 *
 * Convention (see wiki/debugging-workflow.md):
 *   const log = debug('HomePage');
 *   log('fetching content...');
 *   log('categories loaded:', categories.length);
 *   log.error('failed to load:', err);
 */
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

const noop = () => {};

export const debug = (scope) => {
  const prefix = `[${scope}]`;
  if (!isDev) {
    const fn = noop;
    fn.warn = noop;
    fn.error = noop;
    return fn;
  }
  const fn = (...args) => console.log(prefix, ...args);
  fn.warn = (...args) => console.warn(prefix, ...args);
  fn.error = (...args) => console.error(prefix, ...args);
  return fn;
};
