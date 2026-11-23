import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { smoothScrollTo } from '../../../../utils/smoothScrollTo.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('useLandingHash');

/*
 * useLandingHash — scrolls to `#id` in the URL once that element exists (footer links such as /for-parents-schools#schools,
 * /features#skills-lab). The pages are lazy and ScrollToTop resets the window on a path change, so it retries for up to ~2s
 * and lands the target just below the fixed landing nav.
 */
const navOffset = () => (document.querySelector('[data-landing-nav]')?.offsetHeight ?? 0) + 16;

const useLandingHash = () => {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    if (!id) return undefined;
    let tries = 0;
    let timer;
    let cancelScroll = () => {};
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        log('scroll to section', id, { tries });
        cancelScroll = smoothScrollTo(el, { offset: navOffset });
        return;
      }
      tries += 1;
      if (tries > 20) {
        log('section not found', id);
        return;
      }
      timer = setTimeout(attempt, 100);
    };
    timer = setTimeout(attempt, 50); // after ScrollToTop's reset
    return () => {
      clearTimeout(timer);
      cancelScroll();
    };
  }, [hash, pathname]);
};

export default useLandingHash;
