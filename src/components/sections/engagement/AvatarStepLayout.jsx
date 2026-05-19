import { useNavigate } from 'react-router-dom';
import EngagementTopNav from './EngagementTopNav.jsx';
import EngagementTopBar from './EngagementTopBar.jsx';
import EngagementFooter from './EngagementFooter.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('AvatarStepLayout');

/*
 * AvatarStepLayout — shared page shell for each avatar customisation step
 * (Style, Skin, Hair, Extras, Outfit). Source: Figma frames in the
 * Avatar customiser flow.
 *
 * Every step renders the same chrome:
 *   ┌─ EngagementTopNav (with Switch Modes pill)
 *   ├─ EngagementTopBar (stage trail — Avatar is the active step)
 *   ├─ main 2-column grid
 *   │    ├─ LEFT  → full-bleed designer hero stage PNG (the avatar
 *   │    │         preview with sparkles + the step's title + sub-tag)
 *   │    └─ RIGHT → full-bleed designer customiser panel PNG (header,
 *   │              category tabs, option grid, swatches, etc.)
 *   └─ EngagementFooter (← Go back / [step-specific continue label] →)
 *
 * Individual step pages just pass in the two image sources and the
 * "continue" button label — everything else is identical.
 *
 * Interactive wiring for the panel (clickable tiles, swatch selection,
 * username edit, shuffle, sliders) is deferred. The flat PNGs preserve
 * exact hit-area positions so transparent button overlays can be
 * layered in a follow-up without changing the layout.
 */

const AvatarStepLayout = ({
  heroSrc,
  heroAlt,
  panelSrc,
  panelAlt,
  continueLabel = 'Looks good, next',
  onContinue,
  onGoBack,
  children,
}) => {
  log('render');
  const navigate = useNavigate();

  const handleSwitchModes = () => {
    navigate('/profile/engagement/identity');
  };

  const handleSaveExit = () => {
    navigate('/');
  };

  const handleGoBackDefault = () => {
    log('go back');
    navigate('/profile/engagement');
  };

  const handleContinueDefault = () => {
    log('continue (no handler wired)');
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
          {/* LEFT — hero stage (avatar preview + step title) */}
          <div className="relative overflow-hidden bg-[#cfe0c8]">
            <img
              src={heroSrc}
              alt={heroAlt}
              className="block w-full h-auto select-none"
              draggable="false"
            />
          </div>

          {/* RIGHT — customiser panel (controls for the current step) */}
          <aside className="relative bg-white border-l border-border-default px-[clamp(16px,2vw,32px)] py-[clamp(16px,2vw,32px)]">
            <img
              src={panelSrc}
              alt={panelAlt}
              className="block w-full h-auto select-none"
              draggable="false"
            />
          </aside>
        </div>
      </main>

      <EngagementFooter
        onSkip={onGoBack || handleGoBackDefault}
        onContinue={onContinue || handleContinueDefault}
        skipLabel="Go back"
        continueLabel={continueLabel}
      />

      {/* Slot for modals or other floating UI specific to this step */}
      {children}
    </div>
  );
};

export default AvatarStepLayout;
