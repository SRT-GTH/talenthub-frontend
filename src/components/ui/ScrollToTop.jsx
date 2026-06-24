import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/*
 * ScrollToTop — resets scroll back to top whenever the route changes.
 *
 * Handles two scroll surfaces:
 *   1. `window.scrollTo(0, 0)` — for normal pages where the window
 *      itself scrolls.
 *   2. All elements with `data-scroll-container` — for pages (like the
 *      avatar customiser) where the page is fixed-height and a nested
 *      panel scrolls internally. Without this, navigating to a new
 *      panel would inherit the previous panel's scrollTop.
 *
 * React Router v6 doesn't reset scroll on navigation by default, hence
 * this component. Mounted once inside <BrowserRouter> in App.jsx;
 * renders nothing.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll('[data-scroll-container]').forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
