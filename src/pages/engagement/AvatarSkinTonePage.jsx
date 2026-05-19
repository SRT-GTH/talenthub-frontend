import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import skinHeroStage from '../../assets/engagement/avatar-skin-hero-stage.png';
import skinCustomiserPanel from '../../assets/engagement/avatar-skin-customiser-panel.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarSkinTonePage');

/*
 * AvatarSkinTonePage â€” Step 1 (Avatar â€” Skin Tone tab).
 * Source: Figma frame (Avatar Skin Tone â€” Your shade, your way).
 *
 * Renders the shared AvatarStepLayout with the skin-tone hero stage on
 * the left ("Avatar Â· Skin Tone" tag, "Your shade, your way." headline)
 * and the skin-tone customiser panel on the right (12 tone tiles,
 * fine-tune slider, lighting preview, helper tip).
 *
 * Continue button label is "Save tone, Next" â€” advances to the Hair step.
 */

const AvatarSkinTonePage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleGoBack = () => {
    log('go back â†’ style step');
    navigate('/profile/engagement/avatar');
  };

  const handleNext = () => {
    log('save tone, next â†’ hair step');
    navigate('/profile/engagement/avatar/hair');
  };

  return (
    <AvatarStepLayout
      heroSrc={skinHeroStage}
      heroAlt="Skin tone preview on the customiser stage â€” your shade, your way"
      panelSrc={skinCustomiserPanel}
      panelAlt="Skin tone customiser panel: base tones, fine-tune, lighting preview"
      continueLabel="Save tone, Next"
      onGoBack={handleGoBack}
      onContinue={handleNext}
    />
  );
};

export default AvatarSkinTonePage;
