import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import AvatarOutfitPanel from '../../components/sections/engagement/avatar/AvatarOutfitPanel.jsx';
import outfitHeroStage from '../../assets/engagement/avatar-outfit-hero-stage.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarOutfitPage');

/*
 * AvatarOutfitPage — Avatar Step 5 (final): Outfit. Source: Figma frame
 * (Avatar Outfit — "Dress how you show up." "Last one!").
 *
 * The hero tag reads "Avatar · Outfit · Last one!" since this is the
 * closing avatar step. The right panel (AvatarOutfitPanel) offers 11
 * outfit tiles, a 3-option fit selector (Slim / Regular / Relaxed),
 * and an 8-swatch apparel-colour row.
 *
 * The primary CTA reads "Save outfit, finish avatar →" — clicking it
 * completes the avatar flow and returns to the engagement hub.
 */

const AvatarOutfitPage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleGoBack = () => {
    log('go back → extras step');
    navigate('/profile/engagement/avatar/extras');
  };

  const handleFinish = () => {
    log('save outfit, finish avatar → engagement hub');
    navigate('/profile/engagement');
  };

  const handleTabSelect = (tabId) => {
    log('tab switch:', tabId);
    if (tabId === 'style') navigate('/profile/engagement/avatar');
    else if (tabId === 'skin') navigate('/profile/engagement/avatar/skin');
    else if (tabId === 'hair') navigate('/profile/engagement/avatar/hair');
    else if (tabId === 'extras') navigate('/profile/engagement/avatar/extras');
  };

  return (
    <AvatarStepLayout
      heroSrc={outfitHeroStage}
      heroAlt="Avatar preview on the customiser stage — outfit step, last one"
      panel={<AvatarOutfitPanel activeTab="outfit" onTabSelect={handleTabSelect} />}
      continueLabel="Save outfit, finish avatar"
      onGoBack={handleGoBack}
      onContinue={handleFinish}
      stageTag="Avatar · Outfit · Last one!"
      stageHeading={
        <>
          Dress how you
          <br />
          show up.
        </>
      }
    />
  );
};

export default AvatarOutfitPage;
