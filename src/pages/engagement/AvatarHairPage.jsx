import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import hairHeroStage from '../../assets/engagement/avatar-hair-hero-stage.png';
import hairCustomiserPanel from '../../assets/engagement/avatar-hair-customiser-panel.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarHairPage');

/*
 * AvatarHairPage â€” Step 1 (Avatar â€” Hair tab).
 * Source: Figma frame (Avatar Hair â€” Crown Energy).
 *
 * Renders the shared AvatarStepLayout with the hair hero stage on the
 * left ("Avatar Â· Hair" tag, "Crown Energy" headline) and the
 * hairstyle customiser panel on the right (12 hairstyle tiles, 9-colour
 * swatch row, volume slider, helper tip).
 *
 * Continue advances to the Extras step.
 */

const AvatarHairPage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleGoBack = () => {
    log('go back â†’ skin tone step');
    navigate('/profile/engagement/avatar/skin');
  };

  const handleNext = () => {
    log('save tone, next â†’ extras step');
    navigate('/profile/engagement/avatar/extras');
  };

  return (
    <AvatarStepLayout
      heroSrc={hairHeroStage}
      heroAlt="Hairstyle preview on the customiser stage â€” crown energy"
      panelSrc={hairCustomiserPanel}
      panelAlt="Hair customiser panel: base styles, hair colour swatches, volume slider"
      continueLabel="Save tone, Next"
      onGoBack={handleGoBack}
      onContinue={handleNext}
    />
  );
};

export default AvatarHairPage;
