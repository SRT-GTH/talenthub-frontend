import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../components/sections/engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../components/sections/engagement/EngagementTopBar.jsx';
import EngagementFooter from '../components/sections/engagement/EngagementFooter.jsx';
import avatarHeroStage from '../assets/engagement/avatar-hero-stage.png';
import avatarCustomiserPanel from '../assets/engagement/avatar-customiser-panel.png';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('AvatarCustomiserPage');

/*
 * AvatarCustomiserPage — Step 1 of 9: Avatar.
 * Source: Figma frame (Avatar customiser — Pick your vibe).
 *
 * Two-column layout under the standard top nav + stage trail:
 *   LEFT  → hero stage with the avatar preview, "Step 1 of 7 · Your
 *           Avatar" tag, "Pick your vibe." headline, sparkle decoration,
 *           and a username chip + shuffle button at the bottom.
 *   RIGHT → customiser panel: "Customise your look" header, stat pills
 *           (24 styles · 12 Skin Tones · 18 Hairstyles · 14 Extras),
 *           category tabs, base-style grid, skin-tone swatches.
 *
 * For this first pass we render both halves from the designer-provided
 * flat PNG exports (`avatar-hero-stage.png` and `avatar-customiser-panel.png`).
 * That gets us pixel-perfect parity with Figma immediately. Interactive
 * wiring (clickable style tiles, swatch selection, username edit,
 * shuffle action) is a follow-up — the assets reserve the right hit-
 * area positions so we can layer transparent buttons over them later
 * without changing the layout.
 *
 * Footer uses custom labels: "← Go back" and "Looks good, next →".
 */

const AvatarCustomiserPage = () => {
  log('mount');
  const navigate = useNavigate();

  const handleSwitchModes = () => {
    navigate(ROUTES.identityMap);
  };

  const handleSaveExit = () => {
    navigate(ROUTES.home);
  };

  const handleGoBack = () => {
    log('go back');
    navigate(ROUTES.profileEngagement);
  };

  const handleNext = () => {
    log('looks good, next');
    navigate(ROUTES.profileEngagement);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-default">
      <EngagementTopNav
        onSaveExit={handleSaveExit}
        showSwitchModes
        onSwitchModes={handleSwitchModes}
      />
      <EngagementTopBar currentStageIndex={0} completionPct={0} />

      <main className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_clamp(420px,42vw,720px)]">
          {/* LEFT — hero stage with the avatar preview baked in */}
          <div className="relative overflow-hidden bg-[#cfe0c8]">
            <img
              src={avatarHeroStage}
              alt="Your avatar preview on the customiser stage"
              className="block w-full h-auto select-none"
              draggable="false"
            />
          </div>

          {/* RIGHT — customiser panel (header + tabs + style grid + skin swatches) */}
          <aside className="relative bg-white border-l border-border-default px-[clamp(16px,2vw,32px)] py-[clamp(16px,2vw,32px)]">
            <img
              src={avatarCustomiserPanel}
              alt="Avatar customiser panel: style, skin, hair, extras, outfit"
              className="block w-full h-auto select-none"
              draggable="false"
            />
          </aside>
        </div>
      </main>

      <EngagementFooter
        onSkip={handleGoBack}
        onContinue={handleNext}
        skipLabel="Go back"
        continueLabel="Looks good, next"
      />
    </div>
  );
};

export default AvatarCustomiserPage;
