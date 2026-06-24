import { useNavigate } from 'react-router-dom';
import EngagementTopNav from './EngagementTopNav.jsx';
import EngagementTopBar from './EngagementTopBar.jsx';
import EngagementFooter from './EngagementFooter.jsx';
import AvatarPreview from './avatar/AvatarPreview.jsx';
import { useAvatarSelection } from '../../../hooks/useAvatarSelection.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('AvatarStepLayout');

// Four-point diamond with curved concave sides (each side is a
// quadratic Bezier curving inward toward the centre). Matches the
// reference image — a "pinched" sparkle/star shape, not the straight-
// edged version.
const SparkleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" />
  </svg>
);

/*
 * AvatarStage — purely decorative backdrop. Renders:
 *   • a dashed outer ring drawn as an SVG circle (CSS `border-dashed`
 *     can't space dashes perfectly evenly around a circle, which made
 *     the bottom of the ring look skewed; SVG gives us a true circle
 *     with mathematically even dashes).
 *   • two gold electron-style dots positioned mathematically ON the
 *     ring (at 45° and 225° from centre — diagonally opposite).
 *   • a handful of sparkle stars at varying sizes, with one tiny one.
 *
 * The INNER solid light-white circle that houses the avatar is part of
 * AvatarPreview (the clip-container picks up a translucent white
 * background), so the avatar and its background travel as one unit.
 *
 * All decorations are pointer-events:none so they never block tile clicks.
 */

// Position offset for a point on a circle of radius r at angle θ (deg),
// expressed as a CSS percentage that the consumer can paste into top/left.
// Used for the gold electron dots. 45° = top-right; 225° = bottom-left.
//   x% = 50% + cos(θ) * 50%       (50 because radius is half the box)
//   y% = 50% - sin(θ) * 50%
// (cos 45° = sin 45° ≈ 0.7071)
const DOT_OFFSET_TR = { top: `${50 - 0.7071 * 50}%`, left: `${50 + 0.7071 * 50}%` };
const DOT_OFFSET_BL = { top: `${50 + 0.7071 * 50}%`, left: `${50 - 0.7071 * 50}%` };

// Single source of truth for the dashed ring diameter. The avatar
// canvas, the ring itself, and the bottom username/undo/shuffle bar
// all derive their size/position from this so they stay locked
// together at every viewport. Bumped up per the latest Figma —
// the ring should read big and confident, not dainty.
const RING_SIZE = 'clamp(460px, 78vh, 800px)';

// Horizontal anchor for the avatar stage (ring + canvas + bottom bar)
// inside the LEFT column. 50% would centre everything; pushing it to
// ~56% gives the top-left heading more breathing room and frees up
// horizontal space so the (now-larger) ring doesn't crowd the headline.
// All three layers (ring, canvas, bar) read from this constant so they
// stay locked to the same column-x at every viewport.
const STAGE_X = '53%';

const AvatarStage = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {/* Outer dashed ring container — sized to wrap the avatar's inner
        solid circle. Uses an SVG <circle> for perfectly even dashing. */}
    <div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: STAGE_X,
        // Ring at 95% of RING_SIZE — bigger than the 0.85 attempt
        // (which read as too close to the disc) but still slightly
        // smaller than the full canvas so there's a comfortable
        // gap between the dotted ring and the white disc's edge.
        width: `calc(${RING_SIZE} * 0.95)`,
        height: `calc(${RING_SIZE} * 0.95)`,
      }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
        {/* DOTTED ring (not dashed). The trick:
            • strokeDasharray="0 1.7"  → zero-length "dash" with a
              1.7-unit gap between positions.
            • strokeLinecap="round"  → a zero-length stroke with round
              caps renders as a full circle, so each dash position
              becomes a perfectly round dot.
            • strokeWidth controls dot DIAMETER.
            Alpha dialled back from 0.9 → 0.45 so each dot reads at
            the SAME subtle brightness as the white inner disc
            (rgba(255,255,255,0.22) on green tints to ≈ 0.45-feel)
            — both elements now sit at the same visual weight. */}
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="0 1.7"
        />
      </svg>

      {/* Two gold electron dots, placed mathematically ON the ring at
          45° (top-right) and 225° (bottom-left). -translate-x/y-1/2
          centres each dot ON its computed point instead of placing the
          top-left corner there. */}
      <span
        className="absolute size-3.5 rounded-full bg-[#E5B448] shadow-[0_0_8px_rgba(229,180,72,0.6)] -translate-x-1/2 -translate-y-1/2"
        style={DOT_OFFSET_TR}
      />
      <span
        className="absolute size-3.5 rounded-full bg-[#E5B448] shadow-[0_0_8px_rgba(229,180,72,0.6)] -translate-x-1/2 -translate-y-1/2"
        style={DOT_OFFSET_BL}
      />
    </div>

    {/* Sparkles — two large diamonds on one diagonal (top-right ↔
        bottom-left) plus one tiny accent. The opposite diagonal
        (top-left + bottom-right) is intentionally empty so the top
        heading has clean negative space behind it. */}
    <SparkleIcon className="absolute top-[10%] right-[12%] size-14 text-white/85" />
    <SparkleIcon className="absolute bottom-[10%] left-[8%] size-14 text-white/85" />
    {/* Tiny accent star near the middle-left */}
    <SparkleIcon className="absolute top-[44%] left-[5%] size-3 text-white/60" />
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

// Small inline icons used by the bottom username / undo / shuffle bar.
const UndoIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M9 14L5 10L9 6M5 10H14C16.7614 10 19 12.2386 19 15V18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const PencilIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M4 20H8L18 10L14 6L4 16V20Z M13 7L17 11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ShuffleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M16 4L20 4L20 8 M16 20L20 20L20 16 M4 6L7 6C9 6 10 7 11 9L13 15C14 17 15 18 17 18L20 18 M4 18L7 18C9 18 10 17 11 15 M17 6L20 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/*
 * AvatarStageOverlay — top-left heading + bottom username/undo/shuffle bar.
 * Sits ABOVE the avatar preview (pointer-events-none on the wrapper so it
 * doesn't block tile clicks; explicitly re-enables events on the actual
 * interactive buttons at the bottom).
 *
 * Per-page text comes from `stageTag` (small pill at top) and
 * `stageHeading` (big display headline below). The heading accepts JSX
 * so pages can italicise a word (e.g. "Pick your <em>vibe.</em>").
 *
 * The bottom bar shows: undo button (left), username pill with edit
 * pencil (centre), shuffle/randomise button (right). The shuffle button
 * randomises every selection; that's the closest match to the unlabelled
 * icon in the Figma reference.
 */
const AvatarStageOverlay = ({ stageTag, stageHeading }) => {
  const { selection, undo, setField } = useAvatarSelection();

  const handleShuffle = () => {
    // Tiny inline catalogue of randomisable picks, hard-coded so we
    // don't have to import each panel's option arrays here.
    const SKIN = [
      'soft-almond',
      'warm-sand',
      'honey',
      'caramel',
      'bronze',
      'cocoa-light',
      'cocoa',
      'mahogany',
      'chestnut',
      'espresso',
      'deep-cocoa',
      'onyx',
    ];
    const HAIR = [
      'hair-1',
      'hair-2',
      'hair-3',
      'hair-4',
      'hair-5',
      'hair-6',
      'hair-7',
      'hair-8',
      'hair-9',
      'hair-10',
      'hair-11',
      'hair-12',
    ];
    const HAIR_COLOR = [
      'black',
      'dark-brown',
      'brown',
      'auburn',
      'chestnut',
      'honey',
      'blue-tone',
      'pink-tone',
      'green-tone',
    ];
    const OUTFIT = [
      'outfit-tee',
      'outfit-hoodie',
      'outfit-polo',
      'outfit-button-down',
      'outfit-kente-top',
      'outfit-suit',
      'outfit-hijab-fit',
      'outfit-dashiki',
      'outfit-lab-coat',
      'outfit-chef-whites',
      'outfit-athletic',
    ];
    const APPAREL_COLOR = [
      'brand-green',
      'kente-gold',
      'sunset-orange',
      'red',
      'rose',
      'violet',
      'ocean',
      'charcoal',
      'cream',
    ];
    setField('skinTone', SKIN[Math.floor(Math.random() * SKIN.length)]);
    setField('hairStyle', HAIR[Math.floor(Math.random() * HAIR.length)]);
    setField('hairColor', HAIR_COLOR[Math.floor(Math.random() * HAIR_COLOR.length)]);
    setField('apparel', OUTFIT[Math.floor(Math.random() * OUTFIT.length)]);
    setField('apparelColor', APPAREL_COLOR[Math.floor(Math.random() * APPAREL_COLOR.length)]);
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Top-left tag + heading. WHITE text with a subtle shadow for
        readability against the green stage. Narrow max-width so the
        text wraps onto multiple lines and never bleeds into the avatar
        circle in the middle of the stage. */}
      {(stageTag || stageHeading) && (
        <div
          className="absolute top-[clamp(12px,2vw,28px)] left-[clamp(12px,2vw,28px)] max-w-[clamp(180px,28vw,320px)]"
          style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.18)' }}
        >
          {stageTag && (
            <div className="inline-flex items-center gap-1.5 rounded-pill bg-white px-2.5 py-1 font-sans text-[11px] leading-4 tracking-[0.2px] text-brand-green shadow-sm">
              {stageTag}
            </div>
          )}
          {stageHeading && (
            <h2 className="mt-3 font-display text-[clamp(22px,2.4vw,34px)] leading-[1.1] tracking-[-0.3px] text-white">
              {stageHeading}
            </h2>
          )}
        </div>
      )}

      {/* Bottom bar: undo / username / shuffle. Centred ON the dashed
        ring's bottom edge — `top` lands the row's vertical centre at
        the ring's bottom point (50% + ring_radius), and the additional
        -translate-y-1/2 splits the bar half-above / half-below that
        point so the buttons visually rest on the ring. Uses the same
        size constant as the ring so they stay locked together. */}
      <div
        className="pointer-events-auto absolute flex items-center gap-2"
        style={{
          // Bar tracks the ring at its new 0.95 multiplier. The
          // translate dropped from -100% to -65% — bar moves DOWN
          // so it's no longer floating well above the ring; its
          // ~65% point now sits at the ring's bottom edge.
          left: STAGE_X,
          top: `calc(50% + ${RING_SIZE} * 0.95 / 2)`,
          transform: 'translate(-50%, -65%)',
        }}
      >
        <button
          type="button"
          onClick={undo}
          aria-label="Undo last change"
          className={classNames(
            'inline-flex items-center justify-center size-9 rounded-full bg-white shadow-sm',
            'text-content-primary transition-colors duration-150 hover:text-brand-green',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
          )}
        >
          <UndoIcon className="size-4" />
        </button>

        <div className="inline-flex items-center gap-2 rounded-pill bg-white px-3 py-1.5 shadow-sm">
          <span className="font-sans font-semibold text-[13px] leading-4 text-content-primary">
            {selection.username || 'KofiA_23'}
          </span>
          <PencilIcon className="size-3.5 text-content-primary" />
        </div>

        <button
          type="button"
          onClick={handleShuffle}
          aria-label="Randomise avatar"
          className={classNames(
            'inline-flex items-center justify-center size-9 rounded-full bg-white shadow-sm',
            'text-content-primary transition-colors duration-150 hover:text-brand-green',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
          )}
        >
          <ShuffleIcon className="size-4" />
        </button>
      </div>
    </div>
  );
};

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
  // stageTag (small pill at top-left) + stageHeading (display headline
  // below it) vary per avatar step. Each step page passes its own.
  stageTag,
  stageHeading,
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
    // h-screen + overflow-hidden makes the customiser non-scrollable at
    // the page level. The right column scrolls INTERNALLY if its content
    // is taller than its area; the LEFT column (avatar stage) is fixed.
    //
    // Heights match the Figma spec for the 1728-wide design:
    //   • top nav   = 90px (5.2vw of 1728)
    //   • topbar    = 81px (4.7vw of 1728)
    //   • footer    = 150px (8.7vw of 1728, lives inside right column)
    // clamps give a sensible floor on smaller viewports.
    <div className="flex flex-col h-screen overflow-hidden bg-background-default">
      {/* Top nav — 90px tall per Figma */}
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch">
        <EngagementTopNav
          onSaveExit={handleSaveExit}
          showSwitchModes
          onSwitchModes={handleSwitchModes}
          className="w-full h-full"
        />
      </div>
      {/* Stage trail — 81px tall per Figma */}
      <div className="shrink-0 h-[clamp(58px,4.7vw,81px)] flex items-stretch">
        <EngagementTopBar currentStageIndex={0} completionPct={0} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden">
        {/* Left:right column proportion matches the Figma reference
            990:738 (left stage : right customiser ≈ 57.3% : 42.7%). The
            `fr` units keep that ratio at every viewport instead of
            pinning the right column to a fixed clamp. */}
        <div className="grid grid-cols-1 lg:grid-cols-[990fr_738fr] h-full">
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
            className="relative h-full flex items-center justify-center px-[clamp(16px,3vw,48px)] py-[clamp(16px,3vw,40px)] overflow-hidden"
            style={{
              // Layered backgrounds (front-to-back):
              //   1. faint diagonal grid lines (both 45° and -45°)
              //   2. diagonal split: green at top-left → light-white at
              //      bottom-right (135deg goes TL → BR). Approximates the
              //      "diagonal line from BL to TR with green above,
              //      whitish below" the user described.
              background: `
                repeating-linear-gradient(45deg,
                  rgba(255,255,255,0.14) 0 1px,
                  transparent 1px 34px),
                repeating-linear-gradient(-45deg,
                  rgba(255,255,255,0.14) 0 1px,
                  transparent 1px 34px),
                linear-gradient(135deg, #6c9b5f 0%, #a8c89d 45%, #dfe8d9 100%)
              `,
            }}
          >
            {/* Decorative stage backdrop — halo rings, sparkles, accent
              dots. Lives behind the avatar (pointer-events-none + behind
              the AvatarPreview in the DOM). */}
            <AvatarStage />

            {/* The avatar itself — sits ON TOP of the decorations via
              z-index so the halo rings frame it nicely. Absolute-
              positioned at STAGE_X so it lines up dead-centre INSIDE
              the dashed ring (which uses the same STAGE_X). Width
              now equals RING_SIZE in full (was 0.92×) — the avatar's
              outer white disc spans the entire dashed ring, so the
              avatar reads much larger. */}
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: STAGE_X,
                top: '50%',
                width: RING_SIZE,
              }}
            >
              <AvatarPreview />
            </div>

            {/* Stage overlay — top-left heading + bottom username/undo/
              shuffle bar. Rendered AFTER AvatarPreview so the bottom
              bar sits on top of any clipped avatar content. */}
            <AvatarStageOverlay stageTag={stageTag} stageHeading={stageHeading} />
          </div>

          {/* RIGHT — customiser column. Footer now lives INSIDE this
            column so the "Auto-Saved · Everything is Reversible …"
            text + Go-back/Next buttons only span the right side of the
            page. That leaves the LEFT (avatar) column visually clean —
            no footer text bleeding under the avatar.

            The panel content area scrolls internally (data-scroll-container
            is marked so ScrollToTop can reset it on navigation), the
            footer is pinned at the bottom of the column. */}
          {/* Aside itself is the scroll container — `overflow-y-auto`
            on the column means the WHOLE right side scrolls as one
            unit (panel + footer together). The inner div uses
            `min-h-full` so the footer is pushed to the column bottom
            when content fits, and travels with the panel when
            content overflows.

            Scrollbar is HIDDEN but scrolling still works:
              • [scrollbar-width:none]              → Firefox
              • [-ms-overflow-style:none]           → IE/legacy Edge
              • [&::-webkit-scrollbar]:hidden       → Chrome / Safari /
                                                       modern Edge */}
          <aside
            data-scroll-container
            className="relative h-full bg-white border-l border-border-default overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex flex-col min-h-full">
              {/* Horizontal padding = 7% of column width → ~635px inner
              content area when the right column is 738px (Figma's
              "635 × 510.44 Hug" annotation). `flex-1` lets the panel
              grow so the footer below sticks to the column bottom. */}
              <div className="flex-1 px-[7%] py-[clamp(16px,2vw,32px)]">
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
              </div>

              {/* Footer — 150px tall per Figma (the "736 × 150" area).
              Avatar-specific layout: Go-back + primary-next buttons sit
              on TOP, the auto-saved status text sits CENTERED below
              them. This differs from the default EngagementFooter
              (which puts status on the left and buttons on the right)
              — so we inline a scoped footer here instead of patching
              the shared component. shrink-0 keeps it from collapsing. */}
              {/* Footer height reduced (was clamp(110, 8.7vw, 150)). The
              previous 150px was eating into the panel and hiding the
              skin-tone swatches + everything below. ~96px max is
              enough room for the buttons + the auto-saved line below. */}
              <div className="shrink-0 h-[clamp(72px,5.6vw,96px)] border-t border-border-default flex flex-col items-center justify-center gap-[clamp(4px,0.6vw,8px)] px-[clamp(16px,3vw,40px)] bg-background-default">
                <div className="flex items-center justify-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={onGoBack || handleGoBackDefault}
                    className={classNames(
                      'inline-flex items-center gap-2 rounded-pill bg-white border border-border-default',
                      'px-5 py-2 font-sans font-semibold text-[14px] leading-5 text-content-primary',
                      'shadow-sm transition-colors duration-150 hover:border-brand-green hover:text-brand-green',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
                    )}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="size-4"
                    >
                      <path d="M16 10H4" />
                      <path d="M10 4l-6 6 6 6" />
                    </svg>
                    Go back
                  </button>
                  <button
                    type="button"
                    onClick={onContinue || handleContinueDefault}
                    className={classNames(
                      'inline-flex flex-1 items-center justify-center gap-2 rounded-pill bg-brand-green',
                      'px-6 py-2 font-sans font-semibold text-[14px] leading-5 text-white',
                      'shadow-sm transition-colors duration-150 hover:bg-brand-green-dark',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
                    )}
                  >
                    {continueLabel}
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="size-4"
                    >
                      <path d="M4 10h12" />
                      <path d="M10 4l6 6-6 6" />
                    </svg>
                  </button>
                </div>
                <p className="flex items-center gap-1.5 font-sans text-[12px] leading-4 tracking-[0.2px] text-neutral-dark-hover">
                  <span
                    className="inline-block size-1.5 rounded-full bg-brand-green"
                    aria-hidden="true"
                  />
                  Auto-saved · changes carry to all tabs
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Slot for modals or other floating UI specific to this step */}
      {children}
    </div>
  );
};

export default AvatarStepLayout;
