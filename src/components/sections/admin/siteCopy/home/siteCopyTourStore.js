import { debug } from '../../../../../utils/debug.js';

const log = debug('siteCopyTourStore');

/*
 * siteCopyTourStore — remembers that the Content Editor has seen the first-visit tour of Site copy (7.8.0b): localStorage `gth:copy-tour-seen` = "1".
 * Storage can be blocked (private window, cleared site data): every access is guarded and the tour then simply shows again.
 */
export const TOUR_KEY = 'gth:copy-tour-seen';

export const hasSeenTour = () => {
  try {
    return window.localStorage.getItem(TOUR_KEY) === '1';
  } catch {
    log('storage unavailable (read)');
    return false;
  }
};

export const markTourSeen = () => {
  try {
    window.localStorage.setItem(TOUR_KEY, '1');
    log('tour marked as seen');
  } catch {
    log('storage unavailable (write)');
  }
};
