import { useEffect, useState } from 'react';

/*
 * useMediaQuery — subscribe to a CSS media query. SSR-safe default `false`.
 * Prefer CSS (Tailwind prefixes) for layout; use this only when the DOM
 * itself differs per breakpoint (drawer vs rail, sheet vs popover).
 */
export const useMediaQuery = (query) => {
  const getMatch = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false;
  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

// Tailwind-aligned helpers. lg (1024) is the desktop shell cut.
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsTabletUp = () => useMediaQuery('(min-width: 768px)');
