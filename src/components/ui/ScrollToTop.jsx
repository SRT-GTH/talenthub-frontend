import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/*
 * ScrollToTop — forces window scroll back to (0, 0) whenever the route
 * changes. React Router v6 doesn't reset scroll on navigation by
 * default, so without this every new page inherits the previous page's
 * scroll position — landing the user mid-page instead of at the top.
 *
 * Mounted once inside <BrowserRouter> in App.jsx; renders nothing.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
