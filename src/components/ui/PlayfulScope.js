import { useEffect, useState } from 'react';
import { debug } from '../../utils/debug.js';

const log = debug('PlayfulScope');

const readPlayful = () =>
  typeof document !== 'undefined' &&
  document.documentElement.getAttribute('data-ui-style') === 'playful';

/** True while the Playful scope attribute is on <html> (live, observer-driven). */
export const usePlayfulScope = () => {
  const [playful, setPlayful] = useState(readPlayful);

  useEffect(() => {
    const sync = () => {
      const next = readPlayful();
      setPlayful((prev) => {
        if (prev !== next) log('scope changed', { playful: next });
        return next;
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-ui-style'],
    });
    return () => observer.disconnect();
  }, []);

  return playful;
};
