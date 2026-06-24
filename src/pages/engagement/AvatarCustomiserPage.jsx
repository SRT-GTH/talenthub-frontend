import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import AvatarStylePanel from '../../components/sections/engagement/avatar/AvatarStylePanel.jsx';
import avatarHeroStage from '../../assets/engagement/avatar-hero-stage.png';
import { useAvatarSelection } from '../../hooks/useAvatarSelection.js';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarCustomiserPage');

/*
 * AvatarCustomiserPage — Step 1 of 9 (Avatar — Style tab).
 * Source: Figma frame (Avatar — Pick your vibe).
 *
 * AvatarSelectionProvider is mounted one level up (AvatarFlowLayout in
 * App.jsx) so selections persist across the Skin / Hair / Extras /
 * Outfit steps. This page just renders the Style panel and the hero
 * stage; navigation between steps preserves state via the shared
 * provider above the route group.
 *
 * The LEFT side still uses the flat hero PNG (Phase 2 — wire a layered
 * avatar preview that morphs with selections — needs per-part art).
 * The RIGHT side is the real React `AvatarStylePanel`: clicking a base
 * style tile or a skin-tone swatch fires state updates that show as the
 * selected-ring on the tile/swatch and stay set when the user navigates
 * between steps.
 *
 * Continue button advances to Skin Tone.
 */

const TAB_TO_ROUTE = {
  style: '/profile/engagement/avatar',
  skin: '/profile/engagement/avatar/skin',
  hair: '/profile/engagement/avatar/hair',
  extras: '/profile/engagement/avatar/extras',
  outfit: '/profile/engagement/avatar/outfit',
};

const AvatarCustomiserPage = () => {
  log('mount');
  const navigate = useNavigate();
  // `reset()` from the selection provider clears every field back to its
  // default — so leaving the Style step strips off whichever preset the
  // user previewed here and starts the build-your-own flow with just the
  // bare body-base on the next step.
  const { reset } = useAvatarSelection();

  // Leaving the Style step resets the avatar to base body — the user
  // can preview style presets here, but switching to Skin/Hair/Extras/
  // Outfit drops those presets so the user builds their own avatar
  // piece-by-piece from a clean slate.
  const leaveStyleStep = (route) => {
    log('leaving Style step → reset preset, navigate to', route);
    reset();
    navigate(route);
  };

  const handleTabSelect = (tabId) => {
    const route = TAB_TO_ROUTE[tabId];
    if (route && route !== '/profile/engagement/avatar') {
      log('tab → navigate', tabId, route);
      leaveStyleStep(route);
    }
  };

  const handleNext = () => {
    log('looks good, next → skin tone');
    leaveStyleStep('/profile/engagement/avatar/skin');
  };

  return (
    <AvatarStepLayout
      heroSrc={avatarHeroStage}
      heroAlt="Your avatar preview on the customiser stage — pick your vibe"
      panel={<AvatarStylePanel activeTab="style" onTabSelect={handleTabSelect} />}
      continueLabel="Looks good, next"
      onContinue={handleNext}
      stageTag="Step 1 of 9 · Your Avatar"
      stageHeading={
        <>
          Pick your <em className="italic">vibe.</em>
        </>
      }
    />
  );
};

export default AvatarCustomiserPage;
