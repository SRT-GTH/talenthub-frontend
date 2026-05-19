import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../components/sections/engagement/AvatarStepLayout.jsx';
import hairHeroStage from '../assets/engagement/avatar-hair-hero-stage.png';
import hairCustomiserPanel from '../assets/engagement/avatar-hair-customiser-panel.png';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('AvatarHairPage');

/*
 * AvatarHairPage — Step 1 (Avatar — Hair tab).
 * Source: Figma frame (Avatar Hair — Crown Energy).
 *
 * Renders the shared AvatarStepLayout with the hair hero stage on the
 * left ("Avatar · Hair" tag, "Crown Energy" headline) and the
 * hairstyle customiser panel on the right (12 hairstyle tiles, 9-colour
 * swatch row, volume slider, helper tip).
 *
 * Continue advances to the Extras step.
 */

const AvatarHairPage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleGoBack = () => {
    log('go back → skin tone step');
    navigate(ROUTES.avatarSkinTone);
  };

  const handleNext = () => {
    log('save tone, next → extras step');
    navigate(ROUTES.avatarExtras);
  };

  return (
    <AvatarStepLayout
      heroSrc={hairHeroStage}
      heroAlt="Hairstyle preview on the customiser stage — crown energy"
      panelSrc={hairCustomiserPanel}
      panelAlt="Hair customiser panel: base styles, hair colour swatches, volume slider"
      continueLabel="Save tone, Next"
      onGoBack={handleGoBack}
      onContinue={handleNext}
    />
  );
};

export default AvatarHairPage;
