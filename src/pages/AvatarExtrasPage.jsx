import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../components/sections/engagement/AvatarStepLayout.jsx';
import extrasHeroStage from '../assets/engagement/avatar-extras-hero-stage.png';
import extrasCustomiserPanel from '../assets/engagement/avatar-extras-customiser-panel.png';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('AvatarExtrasPage');

/*
 * AvatarExtrasPage — Avatar Step 4: Extras (eyewear, facial hair,
 * earrings, details). Source: Figma frame (Avatar Extras — Crown Energy).
 *
 * Hero on the left tags this as "Avatar · Extras". The right panel
 * groups several pick-one rows (Eyewear, Facial hair, Earrings) plus a
 * multi-select "Details" row and the earrings/glasses tint swatches.
 * A small "3 SELECTED" pill above the panel echoes the live count.
 *
 * Continue advances to the Outfit step (the final avatar step).
 */

const AvatarExtrasPage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleGoBack = () => {
    log('go back → hair step');
    navigate(ROUTES.avatarHair);
  };

  const handleNext = () => {
    log('save extras, next → outfit step');
    navigate(ROUTES.avatarOutfit);
  };

  return (
    <AvatarStepLayout
      heroSrc={extrasHeroStage}
      heroAlt="Avatar preview on the customiser stage — extras step"
      panelSrc={extrasCustomiserPanel}
      panelAlt="Extras customiser panel: eyewear, facial hair, earrings, details, tint swatches"
      continueLabel="Save extras, Next"
      onGoBack={handleGoBack}
      onContinue={handleNext}
    />
  );
};

export default AvatarExtrasPage;
