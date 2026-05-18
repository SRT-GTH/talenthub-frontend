import { classNames } from '../../../utils/classNames.js';
import SectionProgressBanner from './SectionProgressBanner.jsx';
import StageMapNode from '../../cards/StageMapNode.jsx';
import { PROFILE_STAGES, STAGE_STATUS } from '../../../constants/profileStages.js';
import talentBoy from '../../../assets/engagement/talent-boy.png';
import trophyImg from '../../../assets/engagement/trophy.png';
import giftImg from '../../../assets/engagement/reward-gift.png';
import { debug } from '../../../utils/debug.js';

const log = debug('IdentityStageMap');

/*
 * IdentityStageMap — the green map column on the Identity Map page.
 * Source: Figma frame (Section 1 · Your Identity).
 *
 * A relatively-positioned panel with a vertical green gradient background
 * that hosts:
 *   ├─ SectionProgressBanner pinned top-centre
 *   ├─ decorative trees / mountains / sparkles / geo labels in the bg
 *   ├─ the boy mascot anchored on the right
 *   ├─ a vertical stage trail running down the centre (9 stage nodes
 *   │  + REWARD and TROPHY milestone nodes), wired up by a dashed
 *   │  SVG connector path running behind them
 *   └─ a dashed road at the bottom marking the journey continues
 *
 * The map sequence weaves the 9 profile stages with two milestone nodes:
 *   - REWARD after stage 3 (Personality) — celebrates 1/3 of the journey
 *   - TROPHY after stage 6 (Project Portfolio) — celebrates 2/3
 *
 * Visual layout decisions:
 *   - Nodes alternate slight left/right horizontal offsets to suggest a
 *     winding path (matches Figma's hand-drawn-feel layout).
 *   - The dashed connector is one SVG path drawn behind the nodes; we
 *     compute the path from the same offset values used to position
 *     each node so the line meets the nodes precisely.
 */

const MAP_HEIGHT = 1480; // px — total vertical span of the map column
const NODE_SIZE = 88;
const ACTIVE_NODE_SIZE = 104;
const MILESTONE_SIZE = 92;
const COL_LEFT_X = 38; // % — left offset for nodes on the "left" path
const COL_RIGHT_X = 50; // % — left offset for nodes on the centre/right
const COL_CENTRE_X = 44; // % — middle offset for centre path

// Sequence of map nodes from top to bottom. Each entry tracks its rendered
// position (y in px, x in %) and its source (stage index or milestone kind).
const buildSequence = (stages) => {
  const seq = [];
  let y = 130; // start below the top banner
  const stepY = 130;

  const positions = [
    // y-offset relative to previous, x-position in %
    { dy: 0, x: COL_CENTRE_X }, // 1 Avatar
    { dy: stepY, x: COL_RIGHT_X }, // 2 Interests
    { dy: stepY, x: COL_LEFT_X }, // 3 Personality
    { dy: stepY - 10, x: COL_CENTRE_X, milestone: 'reward' }, // Reward
    { dy: stepY - 10, x: COL_RIGHT_X }, // 4 Skills
    { dy: stepY, x: COL_LEFT_X }, // 5 Work
    { dy: stepY, x: COL_RIGHT_X }, // 6 Portfolio
    { dy: stepY - 10, x: COL_CENTRE_X, milestone: 'trophy' }, // Trophy
    { dy: stepY - 10, x: COL_LEFT_X }, // 7 Certs
    { dy: stepY, x: COL_RIGHT_X }, // 8 Goals
    { dy: stepY, x: COL_CENTRE_X }, // 9 Pitch
  ];

  let stageIdx = 0;
  positions.forEach((pos) => {
    y += pos.dy;
    if (pos.milestone) {
      seq.push({ kind: 'milestone', milestone: pos.milestone, x: pos.x, y });
    } else {
      seq.push({ kind: 'stage', stage: stages[stageIdx], stageIndex: stageIdx, x: pos.x, y });
      stageIdx += 1;
    }
  });
  return seq;
};

// Small decorative inline SVGs (trees, mountains, sparkles, ellipses).
const TreeTriangle = ({ className, style }) => (
  <svg viewBox="0 0 60 70" fill="none" aria-hidden="true" className={className} style={style}>
    <path d="M30 5L55 60H5L30 5z" fill="var(--color-brand-green-dark)" />
    <rect x="27" y="55" width="6" height="12" fill="var(--color-brand-green-darker)" />
  </svg>
);

const TreeCanopy = ({ className, style }) => (
  <svg viewBox="0 0 100 60" fill="none" aria-hidden="true" className={className} style={style}>
    <ellipse cx="50" cy="30" rx="48" ry="24" fill="var(--color-brand-green-dark)" opacity="0.55" />
  </svg>
);

const Mountain = ({ className, style, tone = 'dark' }) => (
  <svg viewBox="0 0 120 90" fill="none" aria-hidden="true" className={className} style={style}>
    <path
      d="M10 85L60 10L110 85H10z"
      fill={tone === 'dark' ? 'var(--color-brand-green-dark)' : 'var(--color-brand-green-active)'}
    />
  </svg>
);

const Sparkle = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} style={style}>
    <path
      d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2z"
      fill="var(--color-yellow-light)"
      opacity="0.7"
    />
  </svg>
);

const SoftEllipse = ({ className, style }) => (
  <svg viewBox="0 0 200 120" fill="none" aria-hidden="true" className={className} style={style}>
    <ellipse cx="100" cy="60" rx="98" ry="56" fill="var(--color-brand-green-dark)" opacity="0.18" />
  </svg>
);

const IdentityStageMap = ({ onStageSelect, className }) => {
  log('render');

  const sequence = buildSequence(PROFILE_STAGES);

  // Counts for the section banner
  const done = PROFILE_STAGES.filter((s) => s.status === STAGE_STATUS.DONE).length;

  // Build the dashed connector path. SVG coordinates are in %/px — we map
  // node x (%) to viewBox 0..1000 and y (px) directly to viewBox.
  const pathPoints = sequence.map((n) => `${(n.x / 100) * 1000},${n.y}`);
  const pathD = pathPoints.map((pt, i) => (i === 0 ? `M${pt}` : `L${pt}`)).join(' ');

  return (
    <div
      className={classNames(
        'relative w-full overflow-hidden',
        'rounded-r-3xl lg:rounded-r-none',
        // Soft vertical green gradient — lighter at top, olive at bottom
        'bg-[linear-gradient(180deg,#cfe0c8_0%,#bcd2b3_45%,#c9d7a7_100%)]',
        className
      )}
      style={{ minHeight: MAP_HEIGHT }}
    >
      {/* Section banner */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 z-20">
        <SectionProgressBanner
          sectionNumber={1}
          sectionLabel="Your Identity"
          stagesDone={done}
          totalStages={PROFILE_STAGES.length}
        />
      </div>

      {/* Decorative geography labels — faint, behind everything */}
      <span className="absolute top-[58%] left-[18%] font-sans font-bold text-[44px] leading-none tracking-[6px] text-brand-green-darker/15 select-none pointer-events-none">
        GHANA
      </span>
      <span className="absolute top-[26%] right-[14%] font-sans font-semibold text-[11px] tracking-[2px] text-brand-green-darker/40 select-none pointer-events-none">
        TAMALE
      </span>
      <span className="absolute top-[80%] left-[55%] font-sans font-semibold text-[11px] tracking-[2px] text-brand-green-darker/50 select-none pointer-events-none">
        ACCRA
      </span>

      {/* Decorative trees / canopies / sparkles / mountains */}
      <TreeCanopy className="absolute top-[12%] left-[6%] w-24 h-12" />
      <TreeCanopy className="absolute top-[8%] right-[22%] w-32 h-14" />
      <TreeCanopy className="absolute top-[28%] left-[20%] w-20 h-10" />
      <TreeCanopy className="absolute top-[44%] left-[5%] w-28 h-12" />
      <TreeCanopy className="absolute top-[52%] right-[12%] w-24 h-12" />
      <TreeCanopy className="absolute top-[64%] left-[18%] w-20 h-10" />
      <TreeCanopy className="absolute top-[76%] right-[26%] w-24 h-12" />

      <TreeTriangle className="absolute top-[10%] left-[28%] w-9 h-12 opacity-70" />
      <TreeTriangle className="absolute top-[34%] right-[34%] w-8 h-10 opacity-65" />
      <TreeTriangle className="absolute top-[70%] left-[8%] w-9 h-12 opacity-70" />

      <Mountain className="absolute top-[68%] left-[2%] w-32 h-24" tone="dark" />
      <Mountain className="absolute top-[60%] left-[18%] w-24 h-16" tone="light" />
      <Mountain className="absolute top-[88%] right-[8%] w-32 h-24" tone="dark" />
      <Mountain className="absolute top-[80%] right-[22%] w-24 h-16" tone="light" />

      <Sparkle className="absolute top-[5%] left-[4%] w-6 h-6" />
      <Sparkle className="absolute top-[18%] right-[5%] w-7 h-7" />
      <Sparkle className="absolute top-[42%] right-[8%] w-5 h-5" />
      <Sparkle className="absolute top-[78%] left-[4%] w-6 h-6" />

      <SoftEllipse className="absolute top-[46%] right-[3%] w-48 h-28" />

      {/* Boy mascot — anchored to the right side of the map, vertically
        about a third down. Hidden on narrow viewports so the stage
        nodes have room to breathe. */}
      <img
        src={talentBoy}
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute right-[6%] top-[26%] w-[clamp(180px,18vw,260px)] z-10 pointer-events-none select-none"
      />

      {/* Dashed connector path (SVG overlay, behind nodes) */}
      <svg
        viewBox={`0 0 1000 ${MAP_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      >
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-brand-green-dark)"
          strokeWidth="3"
          strokeDasharray="2 12"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      {/* Stage nodes */}
      {sequence.map((node, i) => {
        if (node.kind === 'milestone') {
          const isReward = node.milestone === 'reward';
          return (
            <div
              key={`milestone-${i}`}
              className="absolute z-10"
              style={{
                left: `${node.x}%`,
                top: node.y,
                transform: `translate(-50%, -50%)`,
              }}
            >
              <StageMapNode
                variant="milestone"
                label={isReward ? 'Reward' : 'Trophy'}
                imageSrc={isReward ? giftImg : trophyImg}
                size={MILESTONE_SIZE}
              />
            </div>
          );
        }

        const { stage, stageIndex } = node;
        const isDone = stage.status === STAGE_STATUS.DONE;
        const isActive =
          !isDone && stageIndex === PROFILE_STAGES.findIndex((s) => s.status !== STAGE_STATUS.DONE);
        const variant = isDone ? 'stage-done' : isActive ? 'stage-active' : 'stage-pending';

        return (
          <div
            key={stage.id}
            className="absolute z-10"
            style={{
              left: `${node.x}%`,
              top: node.y,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <StageMapNode
              variant={variant}
              label={stage.trailLabel}
              order={stageIndex + 1}
              size={isActive ? ACTIVE_NODE_SIZE : NODE_SIZE}
              onClick={() => onStageSelect?.(stage)}
            />
          </div>
        );
      })}

      {/* Dashed road at the bottom — Figma uses a yellow dashed centre
        line over a green strip. */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-10 bg-brand-green-dark">
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t-2 border-dashed border-accent-light" />
      </div>
    </div>
  );
};

export default IdentityStageMap;
