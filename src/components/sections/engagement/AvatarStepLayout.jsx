import { useNavigate } from 'react-router-dom';
import EngagementTopNav from './EngagementTopNav.jsx';
import EngagementTopBar from './EngagementTopBar.jsx';
import EngagementFooter from './EngagementFooter.jsx';
import { ROUTES } from '../../../constants/routes.js';
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
 *   │    └─ RIGHT → either a real React `panel` (interactive) or a
 *   │              full-bleed designer panel PNG (placeholder).
 *   └─ EngagementFooter (← Go back / [step-specific continue label] →)
 *
 * Step pages pass:
 *   - `heroSrc` + `heroAlt`  — the LEFT image (still a flat PNG; the
 *                              avatar preview is Phase 2 work)
 *   - `panel` (JSX)          — the RIGHT-side interactive panel, OR
 *   - `panelSrc` + `panelAlt` — a flat PNG fallback (legacy)
 *
 * Steps mid-migration from PNG to real React just swap `panelSrc` for
 * `panel` when their interactive panel is ready.
 */

const AvatarStepLayout = ({
  heroSrc,
  heroAlt,
  panel,
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
    navigate(ROUTES.identityMap);
  };

  const handleSaveExit = () => {
    navigate(ROUTES.home);
  };

  const handleGoBackDefault = () => {
    log('go back');
    navigate(ROUTES.profileEngagement);
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

          {/* RIGHT — customiser panel (interactive when `panel` is passed,
            flat PNG fallback otherwise) */}
          <aside className="relative bg-white border-l border-border-default px-[clamp(16px,2vw,32px)] py-[clamp(16px,2vw,32px)]">
            {panel ? (
              panel
            ) : (
              <img
                src={panelSrc}
                alt={panelAlt}
                className="block w-full h-auto select-none"
                draggable="false"
              />
            )}
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
