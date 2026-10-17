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

/**
 * Attachment-chip label, Playful (Figma 7873:52782 shows the literal text
 * "Transcr... .pdf"): names whose base is longer than 7 chars are cut after
 * 7 chars and the extension follows after "... ".
 */
export const pfFileLabel = (name = '') => {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  return base.length > 7 ? `${base.slice(0, 7)}... ${ext}`.trim() : name;
};
