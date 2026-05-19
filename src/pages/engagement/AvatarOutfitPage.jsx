import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import outfitHeroStage from '../../assets/engagement/avatar-outfit-hero-stage.png';
import outfitCustomiserPanel from '../../assets/engagement/avatar-outfit-customiser-panel.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarOutfitPage');

/*
 * AvatarOutfitPage â€” Avatar Step 5 (final): Outfit. Source: Figma frame
 * (Avatar Outfit â€” "Dress how you show up." "Last one!").
 *
 * The hero tag reads "Avatar Â· Outfit Â· Last one!" since this is the
 * closing avatar step. The right panel offers career-preset chips
 * (Designer / Engineer / Healthcare / Educator fits), an apparel grid
 * (Tee, Hoodie, Polo, Button-Down, Kente Top, Suit, Hijab fit, Dashiki,
 * Lab coat, Chef whites, Athletic, Tank), fit options (Slim / Regular
 * / Relaxed), and an 8-swatch colour row.
 *
 * The primary CTA reads "Save outfit, finish avatar â†’" â€” clicking it
 * completes the avatar flow and returns to the engagement hub.
 */

const AvatarOutfitPage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleGoBack = () => {
    log('go back â†’ extras step');
    navigate('/profile/engagement/avatar/extras');
  };

  const handleFinish = () => {
    log('save outfit, finish avatar â†’ engagement hub');
    navigate('/profile/engagement');
  };

  return (
    <AvatarStepLayout
      heroSrc={outfitHeroStage}
      heroAlt="Avatar preview on the customiser stage â€” outfit step, last one"
      panelSrc={outfitCustomiserPanel}
      panelAlt="Outfit customiser panel: career presets, apparel grid, fit, colour swatches"
      continueLabel="Save outfit, finish avatar"
      onGoBack={handleGoBack}
      onContinue={handleFinish}
    />
  );
};

export default AvatarOutfitPage;
