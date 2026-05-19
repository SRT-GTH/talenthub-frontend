import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../components/sections/engagement/AvatarStepLayout.jsx';
import skinHeroStage from '../assets/engagement/avatar-skin-hero-stage.png';
import skinCustomiserPanel from '../assets/engagement/avatar-skin-customiser-panel.png';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('AvatarSkinTonePage');

/*
 * AvatarSkinTonePage — Step 1 (Avatar — Skin Tone tab).
 * Source: Figma frame (Avatar Skin Tone — Your shade, your way).
 *
 * Renders the shared AvatarStepLayout with the skin-tone hero stage on
 * the left ("Avatar · Skin Tone" tag, "Your shade, your way." headline)
 * and the skin-tone customiser panel on the right (12 tone tiles,
 * fine-tune slider, lighting preview, helper tip).
 *
 * Continue button label is "Save tone, Next" — advances to the Hair step.
 */

const AvatarSkinTonePage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleGoBack = () => {
    log('go back → style step');
    navigate(ROUTES.avatarCustomiser);
  };

  const handleNext = () => {
    log('save tone, next → hair step');
    navigate(ROUTES.avatarHair);
  };

  return (
    <AvatarStepLayout
      heroSrc={skinHeroStage}
      heroAlt="Skin tone preview on the customiser stage — your shade, your way"
      panelSrc={skinCustomiserPanel}
      panelAlt="Skin tone customiser panel: base tones, fine-tune, lighting preview"
      continueLabel="Save tone, Next"
      onGoBack={handleGoBack}
      onContinue={handleNext}
    />
  );
};

export default AvatarSkinTonePage;
