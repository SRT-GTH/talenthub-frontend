import { Link, useLocation } from 'react-router-dom';
import { logoHomePath } from '../../services/auth.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('HomeLogoLink');

/*
 * HomeLogoLink — the navbar logo. Signed in: the user's own home (talent -> /home, recruiter ->
 * /recruiter/home, …); signed out: the landing page `/`. Already on that page: scrolls back to the top
 * instead of re-navigating. Props: className, aria-label (default "Ghana Talent Hub home"), children (the logo).
 */
const HomeLogoLink = ({
  className,
  children,
  'aria-label': ariaLabel = 'Ghana Talent Hub home',
}) => {
  const { pathname } = useLocation();
  const to = logoHomePath();
  const onClick = (event) => {
    if (pathname !== to) {
      log('go', to);
      return;
    }
    event.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.querySelector('main')?.scrollTo?.({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    log('already home: scroll to top');
  };
  return (
    <Link to={to} aria-label={ariaLabel} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

export default HomeLogoLink;
