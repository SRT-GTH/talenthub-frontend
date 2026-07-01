import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { useEngagementProgress } from '../../../hooks/useEngagementProgress.js';
import { debug } from '../../../utils/debug.js';

// Background — the trees, dark-green organic shapes, and gold sun.
import mapBackground from '../../../assets/engagement/SVG - GHANA GAME-MAP BACKGROUND.svg';

// Stage node SVGs — one per stage (designed for the design's snapshot
// state; CSS filters fake the other states when the user progresses).
import nodeAvatar from '../../../assets/engagement/NODE 1_ Avatar — DONE — centre → Link.svg';
import nodeInterests from '../../../assets/engagement/button_beneath_continue_textbox.svg';
import nodePersonality from '../../../assets/engagement/NODE 3_ Personality — UPCOMING — left → Link.svg';
import nodeSkills from '../../../assets/engagement/NODE 4_ Skills — UPCOMING — right → Link.svg';
import nodeWork from '../../../assets/engagement/NODE 5_ Work — LOCKED — centre.svg';
import nodePortfolio from '../../../assets/engagement/NODE 6_ Portfolio — LOCKED — left.svg';
import nodeCerts from '../../../assets/engagement/NODE 7_ Certs — LOCKED — centre.svg';
import nodeGoals from '../../../assets/engagement/NODE 8_ Goals — LOCKED — left.svg';

// Milestone SVGs (chest and trophy) — decorative, not stages, no progress.
import milestoneChest from '../../../assets/engagement/MILESTONE CHEST — centre.svg';
import milestoneTrophy from '../../../assets/engagement/MILESTONE TROPHY — right.svg';

// "CONTINUE →" pill that sits above the active stage.
import continueTag from '../../../assets/engagement/Green_Background+Shadow_with_the_continue_text .svg';

// Boy character (the penguin/boy mascot on the right side of the map).
import boyCharacter from '../../../assets/engagement/Boy_character_for_identity_page.svg';

const log = debug('IdentityStageMap');

// PadlockBadge — small circular badge (matches the size + style of
// the check badge on the Avatar DONE node), rendered in the bottom-
// right corner of any LOCKED stage. Circular white background with
// a subtle border + a padlock glyph inside so the "locked" state
// reads as an obvious differentiator, not just a colour tone.
// Replace with an <img src={padlock} /> once the real padlock.svg
// exports from Figma with proper paths (currently it's a rectangle).
const PadlockBadge = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circular badge background — white with a soft grey border, mirrors
        the check-badge treatment on the Avatar node. */}
    <circle cx="12" cy="12" r="11" fill="white" stroke="#8B8B85" strokeWidth="1.5" />
    {/* Padlock glyph inside the badge — small enough to leave a comfortable
        margin from the badge edge. */}
    <path
      d="M9.8 11V9.6a2.2 2.2 0 0 1 4.4 0V11"
      stroke="#4A4A48"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="8.4" y="11" width="7.2" height="5.6" rx="1" fill="#4A4A48" />
    <circle cx="12" cy="13.4" r="0.7" fill="white" />
    <rect x="11.65" y="13.4" width="0.7" height="1.7" fill="white" />
  </svg>
);

/*
 * IdentityStageMap — game-map view of Section 1.
 *
 * Layered structure (z-order, bottom to top):
 *   1. Gradient background (green → pale)                   — CSS
 *   2. Background SVG (trees + organic shapes + gold sun)   — full-bleed img
 *   3. Stage nodes + milestones (absolutely positioned)     — buttons
 *   4. CONTINUE → tag above the active stage                — img
 *   5. Boy character + "Start with Career Buddy" button     — right side
 *   6. Section pill ("X of N stages done")                  — top centre
 *
 * Each stage node reads its status from useEngagementProgress():
 *   • done   → SVG renders as-is, clickable to revisit
 *   • active → SVG renders as-is, CONTINUE tag floats above it, clickable
 *   • locked → CSS filter grayscale+opacity, not clickable
 *
 * The node SVGs were exported from one snapshot of the Figma design
 * (Avatar=done, Interests=active, etc.). For states that don't match
 * the snapshot (e.g. Avatar resetting to locked, or Personality
 * becoming active later) we re-tint via CSS. When the design has
 * extra state variants drawn, swap the SVG instead of the filter.
 */

// Where each stage navigates to when clickable. Stages without a built
// page still get a real route — the page may 404 until a teammate
// lands the work, but no clicks ever dump the user on the entry-method
// modal again.
const STAGE_ROUTES = {
  avatar: '/profile/engagement/avatar',
  'personal-interests': '/profile/engagement/interests',
  personality: '/profile/engagement/personality',
  skills: '/profile/engagement/skills',
  'work-experience': '/profile/engagement/work',
  'project-portfolio': '/profile/engagement/portfolio',
  certifications: '/profile/engagement/certifications',
  'desired-career': '/profile/engagement/goals',
};

// Each map node — its stage id (or null for purely-decorative milestones),
// the SVG to render, and where it sits on the map (% of the relative
// container so it scales with the SVG background). Positions were
// eyeballed from the Figma design; nudge `left`/`top` per node to fine
// tune. `width` is a clamp() so the node scales but doesn't get
// microscopic on small viewports.
const MAP_NODES = [
  // Top of the trail — Avatar.
  {
    key: 'avatar',
    stageId: 'avatar',
    src: nodeAvatar,
    left: '48%',
    top: '7%',
    width: 'clamp(56px, 6.5vw, 80px)',
    label: 'Avatar',
  },
  // Interests (the green "ACTIVE" pill in the design snapshot).
  {
    key: 'personal-interests',
    stageId: 'personal-interests',
    src: nodeInterests,
    left: '52%',
    top: '17%',
    width: 'clamp(64px, 7.5vw, 92px)',
    label: 'Interests',
  },
  // Personality — left of trail.
  {
    key: 'personality',
    stageId: 'personality',
    src: nodePersonality,
    left: '40%',
    top: '26%',
    width: 'clamp(54px, 6.2vw, 75px)',
    label: 'Personality',
  },
  // Decorative milestone — chest reward.
  {
    key: 'milestone-chest',
    stageId: null,
    src: milestoneChest,
    left: '49%',
    top: '34%',
    width: 'clamp(58px, 6.5vw, 80px)',
    label: 'Reward',
  },
  // Skills — right of trail.
  {
    key: 'skills',
    stageId: 'skills',
    src: nodeSkills,
    left: '57%',
    top: '44%',
    width: 'clamp(54px, 6.2vw, 75px)',
    label: 'Skills',
  },
  // Work — centre.
  {
    key: 'work-experience',
    stageId: 'work-experience',
    src: nodeWork,
    left: '48%',
    top: '54%',
    width: 'clamp(54px, 6.2vw, 75px)',
    label: 'Work',
  },
  // Portfolio — left.
  {
    key: 'project-portfolio',
    stageId: 'project-portfolio',
    src: nodePortfolio,
    left: '38%',
    top: '64%',
    width: 'clamp(54px, 6.2vw, 75px)',
    label: 'Portfolio',
  },
  // Decorative milestone — trophy.
  {
    key: 'milestone-trophy',
    stageId: null,
    src: milestoneTrophy,
    left: '52%',
    top: '72%',
    width: 'clamp(58px, 6.5vw, 80px)',
    label: 'Trophy',
  },
  // Certs — centre.
  {
    key: 'certifications',
    stageId: 'certifications',
    src: nodeCerts,
    left: '46%',
    top: '81%',
    width: 'clamp(54px, 6.2vw, 75px)',
    label: 'Certs',
  },
  // Goals — left, end of trail.
  {
    key: 'desired-career',
    stageId: 'desired-career',
    src: nodeGoals,
    left: '40%',
    top: '90%',
    width: 'clamp(54px, 6.2vw, 75px)',
    label: 'Goals',
  },
];

// Status → visual treatment.
// All states render the node SVG at full opacity + full colour so
// the design reads clearly. The DIFFERENTIATOR for locked nodes is
// the padlock badge overlay in the bottom-right corner (rendered
// separately below). No global filter is applied here.
const statusClasses = {
  done: '',
  active: '',
  locked: '',
};

const IdentityStageMap = ({ className, onStageSelect }) => {
  log('render');
  const navigate = useNavigate();
  const { getStageStatus, doneCount, totalCount } = useEngagementProgress();

  const handleClick = (node) => {
    if (!node.stageId) return; // milestones aren't clickable
    const status = getStageStatus(node.stageId);
    if (status === 'locked') {
      log('locked stage click ignored', node.stageId);
      return;
    }
    log('navigate', node.stageId);
    onStageSelect?.({ id: node.stageId });
    const route = STAGE_ROUTES[node.stageId];
    if (route) navigate(route);
  };

  return (
    <div
      className={classNames(
        'relative w-full overflow-hidden rounded-r-3xl lg:rounded-r-none',
        // Flex column: top row holds the SECTION pill in its OWN space
        // (so it can't be overlapped by the Avatar node); bottom row
        // holds the absolutely-positioned map. Gradient covers both.
        'flex flex-col',
        className
      )}
      // Gradient background (under everything). The two stops at 0%
      // are intentional — they create a sharp green band at the top,
      // then a long fade through pale blue/green at the bottom. Matches
      // the swatches the user provided (#387440 → #EEF6FD).
      style={{
        background: 'linear-gradient(180deg, #387440 0%, #387440 5%, #EEF6FD 100%)',
      }}
    >
      {/* TOP ROW — green strip just above the map that hosts the
        "Section 1 · X of N" pill. Sits in normal flow (not absolute)
        so the pill has its own breathing room and the Avatar node
        below can't overlap it. */}
      <div className="shrink-0 px-4 py-[clamp(14px,2vw,24px)] flex justify-center">
        <div
          className={classNames(
            'flex items-center gap-2 rounded-pill bg-white shadow-md',
            'px-3 py-1.5 sm:px-4 sm:py-2',
            'font-sans font-bold text-[10px] sm:text-[11px] tracking-[0.12em] text-content-primary uppercase'
          )}
        >
          <span className="inline-block size-2 rounded-full bg-brand-green" aria-hidden="true" />
          <span>
            Section 1 · Your Identity · {doneCount} of {totalCount} stages done
          </span>
        </div>
      </div>

      {/* BOTTOM ROW — the actual map. Its OWN relative positioning
        context, with the 1255×1223 background SVG filling it and
        every node positioned by % of THIS area (not the whole
        container, which would shift positions when the pill row
        changes height). */}
      <div className="relative w-full" style={{ aspectRatio: '1255 / 1223' }}>
        {/* Background SVG — trees, dark green shapes, gold sun. Fills
        this row; coordinates inside are 0..1255 × 0..1223. */}
        <img
          src={mapBackground}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="absolute inset-0 w-full h-full select-none pointer-events-none"
        />

        {/* 4. Stage nodes — absolutely positioned along the trail. */}
        {MAP_NODES.map((node) => {
          const status = node.stageId ? getStageStatus(node.stageId) : 'milestone';
          const isClickable = node.stageId && status !== 'locked';
          const stateClass = node.stageId ? statusClasses[status] : '';

          return (
            <div
              key={node.key}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: node.left, top: node.top }}
            >
              <button
                type="button"
                onClick={() => handleClick(node)}
                disabled={!isClickable}
                aria-label={node.stageId ? `${node.label} — ${status}` : `${node.label} milestone`}
                className={classNames(
                  'relative block transition-transform duration-150',
                  isClickable
                    ? // Clickable — obvious pointer + big hover scale +
                      // a bright ring on hover/focus so it visually
                      // "pops" and you can tell instantly which nodes
                      // are interactive.
                      'cursor-pointer hover:scale-[1.15] hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white'
                    : 'cursor-not-allowed',
                  !node.stageId && 'cursor-default',
                  stateClass
                )}
                style={{ width: node.width }}
              >
                <img
                  src={node.src}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  className="block w-full h-auto select-none"
                />

                {/* Personality — emoji textbox over the placeholder.
                ▶ MANUALLY TYPE the emoji you want between the span
                tags (e.g. 🧠). Font size scales with the node so
                the emoji stays proportional at every viewport. */}
                {node.stageId === 'personality' && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[54%] top-[37%] -translate-x-1/2 -translate-y-1/2 leading-none select-none pointer-events-none"
                    style={{ fontSize: `calc(${node.width} * 0.42)` }}
                  >
                    🧠
                  </span>
                )}

                {/* Chest milestone — emoji textbox over the placeholder.
                ▶ MANUALLY TYPE the emoji between the span tags. */}
                {node.key === 'milestone-chest' && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[55%] top-[38%] -translate-x-1/2 -translate-y-1/2 leading-none select-none pointer-events-none"
                    style={{ fontSize: `calc(${node.width} * 0.42)` }}
                  >
                    🎁
                  </span>
                )}

                {/* Trophy milestone — emoji textbox over the placeholder.
                ▶ MANUALLY TYPE the emoji between the span tags. */}
                {node.key === 'milestone-trophy' && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[54%] top-[38%] -translate-x-1/2 -translate-y-1/2 leading-none select-none pointer-events-none"
                    style={{ fontSize: `calc(${node.width} * 0.42)` }}
                  >
                    🏆
                  </span>
                )}

                {/* Padlock badge — small circular badge in the bottom-
                right corner of any LOCKED stage node. Mirrors the
                position of the check badge on the Avatar DONE node.
                Node icons render at full colour + opacity; the
                badge is the sole differentiator that the stage is
                not yet accessible. */}
                {status === 'locked' && (
                  <PadlockBadge className="absolute left-[72%] top-[72%] w-[26%] h-auto" />
                )}
              </button>

              {/* CONTINUE → tag floats above the active stage only. */}
              {status === 'active' && (
                <img
                  src={continueTag}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[clamp(60px,5.6vw,86px)] h-auto select-none pointer-events-none"
                />
              )}
            </div>
          );
        })}

        {/* Boy character — right side of the map. Positioned by TOP
        (not bottom) so it lines up with the Interests node, which
        sits at top:17%. Character TOP at 5% puts its head around the
        Interests level and its body trails down through ~35% of the
        map. The "Start with Career Buddy" button is no longer here
        — the sidebar's CareerBuddyPromoCard owns that CTA. */}
        <div className="absolute right-[3%] top-[5%] w-[clamp(100px,14vw,170px)]">
          <img
            src={boyCharacter}
            alt="Career Buddy character"
            draggable="false"
            className="block w-full h-auto select-none"
          />
        </div>
      </div>
    </div>
  );
};

export default IdentityStageMap;
