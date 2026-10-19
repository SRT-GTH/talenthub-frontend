import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('extHooks');

/* Font for the chess board coordinates (Figma: DM Mono 500 11px). Loaded once, like the lab mono font in LabPlayPage. */
export const useBoardFont = () => {
  useEffect(() => {
    if (typeof document === 'undefined' || document.querySelector('link[data-lab-board-mono]'))
      return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@500&display=swap';
    link.setAttribute('data-lab-board-mono', '');
    document.head.appendChild(link);
    log('board font requested');
  }, []);
};
