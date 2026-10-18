import { debug } from '../../../utils/debug.js';
import ProfileA11yPopover from './ProfileA11yPopover.jsx';
import ProfileReadAloud from './ProfileReadAloud.jsx';
import ProfileFocusOrderOverlay from './ProfileFocusOrderOverlay.jsx';
import ProfileLandmarksOverlay from './ProfileLandmarksOverlay.jsx';
import ProfileShareModalNotes from './ProfileShareModalNotes.jsx';

const log = debug('ProfileAccessibilityPanel');

/*
 * ProfileAccessibilityPanel — renders whatever the `?ax=` frame state adds on top of the profile
 * (wiki/talent-profile.md). The page itself applies the stored/frame settings (calm, text size, one
 * column, contrast) and the "what is on" pills; this component owns the overlays:
 *   panel   AX-01  the "Accessibility · your way" popover under the nav button
 *   aloud   AX-04  reading player + reading order          (ProfileReadAloud)
 *   focus   AX-07a keyboard focus-order badges             (ProfileFocusOrderOverlay)
 *   landmarks AX-07b landmark outlines + screen-reader map (ProfileLandmarksOverlay)
 *   share-modal AX-08 dialog rules + keyboard hints        (ProfileShareModalNotes)
 * calm / contrast / pitch / images / alt draw no overlay here: calm + contrast are page-level modes,
 * pitch lives in the About tab (ProfilePitchAccessibility), images/alt in the Portfolio tab.
 *
 * Props: profile (state object, tab/share already forced for the frame), prefs, setPref, effective.
 */
const ProfileAccessibilityPanel = ({ profile, prefs, setPref }) => {
  log('render', { ax: profile.ax });
  if (profile.ax === 'panel') {
    return <ProfileA11yPopover profile={profile} prefs={prefs} setPref={setPref} />;
  }
  if (profile.ax === 'aloud') return <ProfileReadAloud profile={profile} />;
  if (profile.ax === 'focus') return <ProfileFocusOrderOverlay profile={profile} />;
  if (profile.ax === 'landmarks') return <ProfileLandmarksOverlay profile={profile} />;
  if (profile.ax === 'share-modal') return <ProfileShareModalNotes profile={profile} />;
  return null;
};

export default ProfileAccessibilityPanel;
