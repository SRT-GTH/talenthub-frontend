import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import AvatarExtrasPanel from '../../components/sections/engagement/avatar/AvatarExtrasPanel.jsx';
import extrasHeroStage from '../../assets/engagement/avatar-extras-hero-stage.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarExtrasPage');

/*
 * AvatarExtrasPage — Avatar Step 4: Extras (eyewear, facial hair,
 * earrings, details). Source: Figma frame (Avatar Extras — Crown Energy).
 *
 * Hero on the left tags this as "Avatar · Extras". The right panel
 * (AvatarExtrasPanel) groups three pick-one rows (Eyewear, Facial hair,
 * Earrings) plus a multi-select "Details" row and the earrings/glasses
 * tint swatches. The "Selected" stat pill above the panel echoes the
 * live count.
 *
 * Continue advances to the Outfit step (the final avatar step).
 */

const AvatarExtrasPage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleGoBack = () => {
    log('go back → hair step');
    navigate('/profile/engagement/avatar/hair');
  };

  const handleNext = () => {
    log('save extras, next → outfit step');
    navigate('/profile/engagement/avatar/outfit');
  };

  const handleTabSelect = (tabId) => {
    log('tab switch:', tabId);
    if (tabId === 'style') navigate('/profile/engagement/avatar');
    else if (tabId === 'skin') navigate('/profile/engagement/avatar/skin');
    else if (tabId === 'hair') navigate('/profile/engagement/avatar/hair');
    else if (tabId === 'outfit') navigate('/profile/engagement/avatar/outfit');
  };

  return (
    <AvatarStepLayout
      heroSrc={extrasHeroStage}
      heroAlt="Avatar preview on the customiser stage — extras step"
      panel={<AvatarExtrasPanel activeTab="extras" onTabSelect={handleTabSelect} />}
      continueLabel="Save extras, Next"
      onGoBack={handleGoBack}
      onContinue={handleNext}
    />
  );
};

export default AvatarExtrasPage;
