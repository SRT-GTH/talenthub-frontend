import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import extrasHeroStage from '../../assets/engagement/avatar-extras-hero-stage.png';
import extrasCustomiserPanel from '../../assets/engagement/avatar-extras-customiser-panel.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarExtrasPage');

/*
 * AvatarExtrasPage â€” Avatar Step 4: Extras (eyewear, facial hair,
 * earrings, details). Source: Figma frame (Avatar Extras â€” Crown Energy).
 *
 * Hero on the left tags this as "Avatar Â· Extras". The right panel
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
    log('go back â†’ hair step');
    navigate('/profile/engagement/avatar/hair');
  };

  const handleNext = () => {
    log('save extras, next â†’ outfit step');
    navigate('/profile/engagement/avatar/outfit');
  };

  return (
    <AvatarStepLayout
      heroSrc={extrasHeroStage}
      heroAlt="Avatar preview on the customiser stage â€” extras step"
      panelSrc={extrasCustomiserPanel}
      panelAlt="Extras customiser panel: eyewear, facial hair, earrings, details, tint swatches"
      continueLabel="Save extras, Next"
      onGoBack={handleGoBack}
      onContinue={handleNext}
    />
  );
};

export default AvatarExtrasPage;
