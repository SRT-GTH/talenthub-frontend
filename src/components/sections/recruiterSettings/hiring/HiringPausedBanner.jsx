import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import PipelineToast from '../../applicationPipeline/actions/PipelineToast.jsx';
import SettingsBanner from './SettingsBanner.jsx';
import { PauseIcon } from './hiringIcons.jsx';
import { HIRING_PAUSED } from './hiringData.js';
import { useHiringPause } from './useHiringPause.js';

const log = debug('HiringPausedBanner');

/*
 * HiringPausedBanner - "Hiring is paused at Silver Rock Technology" (Figma SR-19 10161:83628, banner 10161:83680) + the "Success - Hiring paused" toast (Component 31).
 * Rendered by RecruiterSettingsSection above the active tab, so it shows on whichever tab is open while `?hiring=paused` (Figma draws it over Language and data).
 * "Resume hiring" clears the flag; the toast's "Undo" does the same, its X only closes it.
 * Props: settings (useRecruiterSettingsState()).
 */
const HiringPausedBanner = ({ settings }) => {
  const { paused, toastOpen, resume, closeToast } = useHiringPause(settings);
  useEffect(() => {
    log('state', { paused, toastOpen });
  }, [paused, toastOpen]);
  if (!paused && !toastOpen) return null;
  return (
    <>
      {paused ? (
        <SettingsBanner
          tone="amber"
          icon={PauseIcon}
          title={HIRING_PAUSED.title}
          body={HIRING_PAUSED.body}
          actionLabel={HIRING_PAUSED.resume}
          onAction={resume}
          data-testid="hiring-paused-banner"
        />
      ) : null}
      {toastOpen ? (
        <PipelineToast
          title={HIRING_PAUSED.toast.title}
          message={HIRING_PAUSED.toast.message}
          actionLabel={HIRING_PAUSED.toast.undo}
          onAction={resume}
          onClose={closeToast}
        />
      ) : null}
    </>
  );
};

export default HiringPausedBanner;
