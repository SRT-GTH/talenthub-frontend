import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import AvatarHairPanel from '../../components/sections/engagement/avatar/AvatarHairPanel.jsx';
import hairHeroStage from '../../assets/engagement/avatar-hair-hero-stage.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarHairPage');

/*
 * AvatarHairPage — Avatar step 3 (Hair tab).
 * Source: Figma frame (Avatar Hair — Crown Energy).
 *
 * Renders the shared AvatarStepLayout with the hair hero stage on the
 * left and the interactive AvatarHairPanel on the right (12 hairstyle
 * tiles, 9 hair-colour swatches, volume slider, helper tip).
 *
 * Continue advances to the Extras step.
 */

const AvatarHairPage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleGoBack = () => {
    log('go back → skin tone step');
    navigate('/profile/engagement/avatar/skin');
  };

  const handleNext = () => {
    log('save hair, next → extras step');
    navigate('/profile/engagement/avatar/extras');
  };

  const handleTabSelect = (tabId) => {
    log('tab switch:', tabId);
    if (tabId === 'style') navigate('/profile/engagement/avatar');
    else if (tabId === 'skin') navigate('/profile/engagement/avatar/skin');
    else if (tabId === 'extras') navigate('/profile/engagement/avatar/extras');
    else if (tabId === 'outfit') navigate('/profile/engagement/avatar/outfit');
  };

  return (
    <AvatarStepLayout
      heroSrc={hairHeroStage}
      heroAlt="Hairstyle preview on the customiser stage — crown energy"
      panel={<AvatarHairPanel activeTab="hair" onTabSelect={handleTabSelect} />}
      continueLabel="Save tone, Next"
      onGoBack={handleGoBack}
      onContinue={handleNext}
      stageTag="Avatar · Hair"
      stageHeading="Crown Energy"
    />
  );
};

export default AvatarHairPage;
