import { debug } from './debug.js';

const log = debug('ensurePlayfulFont');

// Playful display faces (Bricolage Grotesque + Instrument Sans) are deliberately NOT in index.html:
// load them once, only while a Playful-capable talent screen is mounted. Same <link data-pf-font>
// marker as CareerBuddySection, so whichever screen mounts first wins and the other is a no-op.
const PLAYFUL_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,600&family=Instrument+Sans:wght@400;500;600;700&display=swap';

export const ensurePlayfulFont = () => {
  if (typeof document === 'undefined' || document.querySelector('link[data-pf-font]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = PLAYFUL_FONT_HREF;
  link.setAttribute('data-pf-font', '');
  document.head.appendChild(link);
  log('playful font link added');
};
