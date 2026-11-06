import { useEffect, useRef } from 'react';
import { debug } from '../../../../../utils/debug.js';

const log = debug('usePublishGuard');

/*
 * usePublishGuard — asks before the editor is left with unpublished changes (7.8.4g), WITHOUT useBlocker (the app has no data router).
 * While `active`:
 *   1. a capture-phase click listener on the document catches every plain left-click on an internal <a href> (the sidebar, the top bar, the
 *      breadcrumbs: React Router <Link> / <NavLink> render anchors) whose path differs from the current one, cancels it before React Router
 *      sees it and calls onBlock(href). Links inside a dialog and anchors marked data-leave-ok (the toast's "View history") are never caught;
 *      new-tab clicks (Ctrl / Cmd / Shift / middle button, target=_blank, download) and other origins are left alone.
 *   2. `beforeunload` shows the browser's own prompt for a reload / tab close.
 * ⚠️ Not caught: the browser Back / Forward buttons (popstate cannot be cancelled without a data router) and programmatic navigate() calls.
 * onBlock(href) should open the 'leave' dialog; "Leave editor" then navigates to that href.
 */
export const usePublishGuard = ({ active, onBlock }) => {
  const latest = useRef(onBlock);
  latest.current = onBlock;

  useEffect(() => {
    if (!active) return undefined;
    log('armed');
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      if (a.closest('[role="dialog"]') || a.hasAttribute('data-leave-ok')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      log('leave attempt', url.pathname + url.search);
      e.preventDefault();
      e.stopPropagation();
      latest.current?.(url.pathname + url.search + url.hash);
    };
    const onUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    document.addEventListener('click', onClick, true);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('beforeunload', onUnload);
      log('disarmed');
    };
  }, [active]);
};

export default usePublishGuard;
