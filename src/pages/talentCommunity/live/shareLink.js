import { debug } from '../../../utils/debug.js';

const log = debug('communityShare');

/* Share (or copy) a community / post link — no share screen is drawn (same as the demo pages). */
export const shareLink = (path, title) => {
  const url = `${window.location.origin}${path}`;
  log('share', url);
  if (navigator.share) navigator.share({ title, url }).catch(() => {});
  else navigator.clipboard?.writeText(url).catch(() => {});
};
