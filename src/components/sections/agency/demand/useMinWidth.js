import { useEffect, useState } from 'react';

/* useMinWidth(px) — true while the viewport is at least px wide (matchMedia). Used to mount the Ghana map only where it is drawn (lg and up). */
const useMinWidth = (px) => {
  const query = `(min-width: ${px}px)`;
  const [on, setOn] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setOn(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return on;
};

export default useMinWidth;
