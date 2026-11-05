/*
 * frameSeed — every Figma state of a flow reachable by URL (mock data, no route guards).
 * Reads a query key once at mount and returns its value ('' when absent). Pages use it only for the INITIAL value of their own state,
 * so a page opened without the key behaves exactly as before. The keys a page understands are listed in its wiki page.
 */
export const frameSeed = (key = 'state') =>
  typeof window === 'undefined' ? '' : (new URLSearchParams(window.location.search).get(key) ?? '');

export default frameSeed;
