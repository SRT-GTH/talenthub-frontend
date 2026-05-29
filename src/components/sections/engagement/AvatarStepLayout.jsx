import { useNavigate } from 'react-router-dom';
import EngagementTopNav from './EngagementTopNav.jsx';
import EngagementTopBar from './EngagementTopBar.jsx';
import EngagementFooter from './EngagementFooter.jsx';
import AvatarPreview from './avatar/AvatarPreview.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('AvatarStepLayout');

// Small four-point sparkle, used as a decorative element around the
// avatar stage. Renders in `currentColor` so the wrapper can tint it.
const SparkleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 0 L13.6 9.4 L24 12 L13.6 14.6 L12 24 L10.4 14.6 L0 12 L10.4 9.4 Z" />
  </svg>
);

/*
 * AvatarStage — decorative backdrop behind the avatar preview. Matches
 * the Figma reference: concentric soft halo rings around the avatar
 * plus a handful of sparkles scattered across the stage. All
 * decorations sit BEHIND the avatar (z-0) with `pointer-events-none`
 * so they never block interaction with the AvatarPreview.
 */
const AvatarStage = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {/* Concentric halo rings centred on the avatar.

       Sizing rule: the outer ring is capped by viewport HEIGHT (65vh)
       so on shorter screens it can never grow taller than the column —
       previous version used vw and could overflow the top of the
       column on standard-aspect viewports, clipping the upper arc of
       every ring. The wrapper is a fixed square box and the 4 rings
       nest inside it via percentage insets. */}
    <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 size-[clamp(360px,80vh,720px)]">
      <div className="absolute inset-0 rounded-full border border-white/40" />
      <div className="absolute inset-[8%] rounded-full border border-white/50" />
      <div className="absolute inset-[18%] rounded-full bg-white/15" />
      <div className="absolute inset-[28%] rounded-full bg-white/10" />
    </div>

    {/* Sparkles — scattered around the stage */}
    <SparkleIcon className="absolute top-[8%] left-[12%] size-7 text-white/70" />
    <SparkleIcon className="absolute top-[14%] right-[14%] size-5 text-white/60" />
    <SparkleIcon className="absolute bottom-[28%] left-[8%] size-8 text-white/70" />
    <SparkleIcon className="absolute bottom-[18%] right-[10%] size-4 text-white/60" />
    <SparkleIcon className="absolute top-[30%] right-[22%] size-3 text-white/50" />

    {/* Small golden accent dots — echo the Figma decorations */}
    <span className="absolute top-[18%] right-[8%] size-3 rounded-full bg-[#E5B448]/70" />
    <span className="absolute bottom-[36%] right-[28%] size-2 rounded-full bg-[#E5B448]/60" />
  </div>
);

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
  // heroSrc / heroAlt accepted for backwards compatibility from the pages
  // but ignored — the LEFT side now renders <AvatarPreview /> (the
  // layered, live-updating avatar) instead of a static hero PNG.
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
          {/* LEFT — live avatar stage. AvatarPreview stacks the layered
            SVGs (body + hair + outfit + extras) and updates as the user
            clicks tiles on the right.

            Sticky positioning + h-screen pins the avatar to a fixed
            viewport-height column so it stays in the same place when
            the user navigates between pages and as they scroll the
            right panel. `items-start` + top padding anchors the avatar
            near the TOP of the stage (instead of vertically centring,
            which made it land in the middle of the screen).

            The radial gradient adds depth to what was previously a
            flat-green canvas — lighter at the top, slightly deeper at
            the edges — so the stage doesn't feel empty around the
            avatar. */}
          {/*
            Note: NO `overflow-hidden` on this column — the AvatarStage
            inside has its own `overflow-hidden` to clip the halo +
            sparkles, but we don't want the column itself to clip the
            reset button (which used to get cut off the bottom of the
            viewport on shorter screens).
          */}
          <div
            className="relative lg:sticky lg:top-0 lg:self-start lg:h-screen flex items-start justify-center px-[clamp(16px,3vw,48px)] pt-[clamp(32px,5vw,72px)] pb-[clamp(16px,3vw,40px)]"
            style={{
              background: 'radial-gradient(ellipse at top, #e3f0db 0%, #cfe0c8 55%, #b8cfb0 100%)',
            }}
          >
            {/* Decorative stage backdrop — halo rings, sparkles, accent
              dots. Lives behind the avatar (pointer-events-none + behind
              the AvatarPreview in the DOM). */}
            <AvatarStage />

            {/* The avatar itself — sits ON TOP of the decorations via
              z-index so the halo rings frame it nicely. */}
            <div className="relative z-10 w-full">
              <AvatarPreview />
            </div>
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
