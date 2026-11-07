import { debug } from '../../../../utils/debug.js';

const log = debug('useHiringPause');

/*
 * useHiringPause(settings) - "Hiring paused for the organisation" as URL state (Figma SR-19 10161:83628).
 *   ?hiring=paused            hiring is paused: HiringPausedBanner shows on every tab
 *   &toast=hiring-paused      the "Success - Hiring paused" toast (Undo resumes)
 * `settings` = useRecruiterSettingsState(). Returns { paused, toastOpen, pause(), resume(), closeToast() }.
 * The Language and data tab (which draws the "Pause hiring" card, SR-19) calls `pause()` from its "Pause hiring" button.
 */
export const useHiringPause = (settings) => {
  const paused = settings.get('hiring') === 'paused';
  const toastOpen = settings.get('toast') === 'hiring-paused';
  return {
    paused,
    toastOpen,
    pause: () => {
      log('pause hiring');
      settings.update({ hiring: 'paused', toast: 'hiring-paused' });
    },
    resume: () => {
      log('resume hiring');
      settings.update({ hiring: null, toast: null });
    },
    closeToast: () => {
      log('close toast');
      settings.update({ toast: null }, { replace: true });
    },
  };
};

export default useHiringPause;
