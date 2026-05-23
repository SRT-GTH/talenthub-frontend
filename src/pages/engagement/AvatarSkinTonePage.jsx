import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import AvatarSkinPanel from '../../components/sections/engagement/avatar/AvatarSkinPanel.jsx';
import skinHeroStage from '../../assets/engagement/avatar-skin-hero-stage.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarSkinTonePage');

/*
 * AvatarSkinTonePage — Avatar customiser Skin Tone step.
 * Source: Figma frame (Avatar Skin Tone — Your shade, your way).
 *
 * LEFT side keeps the designer hero PNG (avatar preview baked in).
 * RIGHT side is the real React AvatarSkinPanel — 12 tone tiles,
 * Lightness slider, 3-look lighting preview, and a brand-green helper
 * tip. Selections persist via AvatarSelectionContext provided by
 * AvatarFlowLayout one route level up.
 *
 * Continue advances to the Hair step.
 */

const TAB_TO_ROUTE = {
  style: '/profile/engagement/avatar',
  skin: '/profile/engagement/avatar/skin',
  hair: '/profile/engagement/avatar/hair',
  extras: '/profile/engagement/avatar/extras',
  outfit: '/profile/engagement/avatar/outfit',
};

const AvatarSkinTonePage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleTabSelect = (tabId) => {
    const route = TAB_TO_ROUTE[tabId];
    if (route && route !== '/profile/engagement/avatar/skin') {
      log('tab → navigate', tabId, route);
      navigate(route);
    }
  };

  const handleGoBack = () => {
    log('go back → style step');
    navigate('/profile/engagement/avatar');
  };

  const handleNext = () => {
    log('save tone, next → hair step');
    navigate('/profile/engagement/avatar/hair');
  };

  return (
    <AvatarStepLayout
      heroSrc={skinHeroStage}
      heroAlt="Skin tone preview on the customiser stage — your shade, your way"
      panel={<AvatarSkinPanel activeTab="skin" onTabSelect={handleTabSelect} />}
      continueLabel="Save tone, Next"
      onGoBack={handleGoBack}
      onContinue={handleNext}
    />
  );
};

export default AvatarSkinTonePage;
