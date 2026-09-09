import { debug } from '../../../utils/debug.js';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import {
  AvatarStepIcon,
  InterestsStepIcon,
  PersonalityStepIcon,
  SkillsStepIcon,
  WorkStepIcon,
  PortfolioStepIcon,
  CertsStepIcon,
  GoalsStepIcon,
  PitchStepIcon,
  CheckIcon,
  PlayMarkIcon,
} from '../../shared/assets.jsx';

const log = debug('ProfileFillingJourneyPanel');

/*
 * ProfileFillingJourneyPanel — shared dark-green right panel for every
 * profile-filling INTRO page (Interests/Skills/Work, and future
 * Portfolio/Certs/Goals/Pitch intros as they're built).
 *
 * Extracted 2026-09-06: this exact panel (decorative grid+glow+sparkles,
 * icon showcase, Recruiter-impact stat, Time-to-complete stat, 9-step
 * "Your journey" list with real per-stage icons) had been copy-pasted
 * near-verbatim into InterestsIntroSection.jsx and SkillsIntroSection.jsx,
 * then copied a 3rd time into WorkIntroSection.jsx (which regressed to a
 * single generic circle+dot icon for every non-active stage instead of the
 * real `*StepIcon` set already sitting in assets.jsx — SkillsIntroSection
 * had already corrected this once). Per this session's "3rd duplicate →
 * extract to shared" rule (same reasoning as Button's `gold` variant / `sm`
 * chip size), this is now the single source of truth — call sites just pass
 * which stage is active and stage-specific showcase copy.
 *
 * Stage icons + labels are read directly from PROFILE_STAGES
 * (constants/profileStages.js) rather than re-listing all 9 labels here, so
 * the journey list can never drift from the canonical stage list.
 */

// Per-stage journey icon, keyed by PROFILE_STAGES id — the real icon set
// (not a generic placeholder), matching SkillsIntroSection's convention.
const STAGE_ICONS = {
  avatar: AvatarStepIcon,
  'personal-interests': InterestsStepIcon,
  personality: PersonalityStepIcon,
  skills: SkillsStepIcon,
  'work-experience': WorkStepIcon,
  'project-portfolio': PortfolioStepIcon,
  certifications: CertsStepIcon,
  'desired-career': GoalsStepIcon,
  'talent-pitch': PitchStepIcon,
};

const GlassCard = ({ className, children }) => (
  <div
    className={`rounded-[14px] border border-[rgba(255,255,255,0.18)] ${className ?? ''}`}
    style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(2px)' }}
  >
    {children}
  </div>
);

/*
 * Props:
 *   activeStageId  — a PROFILE_STAGES id (e.g. 'work-experience'); every
 *                     stage before it renders "done", this one "active",
 *                     the rest "future".
 *   showcaseTitle    — big label under the icon circle (usually the stage's
 *                       own title, e.g. "Work").
 *   showcaseSubtitle — small line under the title.
 *   impactValue / impactLabel — "Recruiter impact" stat card content.
 *   timeValue                 — "Time to complete" stat card value.
 */
const ProfileFillingJourneyPanel = ({
  activeStageId,
  showcaseTitle,
  showcaseSubtitle,
  impactValue,
  impactLabel,
  timeValue,
}) => {
  const activeIndex = PROFILE_STAGES.findIndex((stage) => stage.id === activeStageId);
  const ShowcaseIcon = STAGE_ICONS[activeStageId] ?? AvatarStepIcon;
  log('render', { activeStageId, activeIndex });

  return (
    <aside
      className="w-[clamp(240px,19.04vw,329px)] shrink-0 relative overflow-hidden"
      aria-label="Profile journey progress"
      style={{ background: 'linear-gradient(109.386deg, #142916 0%, #2a5730 100%)' }}
    >
      {/* Grid line overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 48px)',
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 48px)',
          ].join(', '),
        }}
      />

      {/* Radial glow — top-right corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: '-60px',
          right: '-60px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)',
        }}
      />

      {/* Sparkle decorators */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-sans leading-none text-[rgba(255,255,255,0.2)]"
        style={{ fontSize: '20px', top: '12px', right: '20px' }}
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-sans leading-none text-[rgba(255,255,255,0.2)]"
        style={{ fontSize: '11px', top: '33px', right: '44px' }}
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-sans leading-none text-[rgba(255,255,255,0.2)]"
        style={{ fontSize: '13px', bottom: '193px', left: '24px' }}
      >
        ✦
      </span>

      {/* Scrollable content */}
      <div
        className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="relative" style={{ minHeight: '853px', paddingBottom: '58px' }}>
          {/* Icon showcase */}
          <div className="absolute inset-x-0 top-[10px] h-[152px] flex flex-col items-center pt-[20px] gap-[10px]">
            <div
              className="size-[56px] rounded-[16px] flex items-center justify-center border-2 border-[rgba(255,255,255,0.3)] shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <ShowcaseIcon className="size-[28px] text-white" />
            </div>
            <p className="font-display not-italic text-[22px] leading-tight text-white text-center tracking-[-0.4px]">
              {showcaseTitle}
            </p>
            <p
              className="font-sans text-[10px] leading-4 text-center"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {showcaseSubtitle}
            </p>
          </div>

          {/* Stat cards */}
          <div className="absolute left-[28px] right-[28px] top-[174px] flex flex-col gap-[14px]">
            <GlassCard className="flex flex-col items-center justify-center gap-[6px] px-[14px] py-[12px] text-center">
              <p
                className="font-sans font-semibold text-[10px] leading-4"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Recruiter impact
              </p>
              <p className="font-display not-italic text-[42px] leading-none text-white">
                {impactValue}
              </p>
              <p
                className="font-sans text-[10px] leading-4"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {impactLabel}
              </p>
            </GlassCard>

            <GlassCard className="flex flex-col items-center justify-center gap-[6px] px-[14px] py-[12px] text-center">
              <p
                className="font-sans font-semibold text-[10px] leading-4"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Time to complete
              </p>
              <p className="font-display not-italic text-[30px] leading-none text-white">
                {timeValue}
              </p>
              <p
                className="font-sans text-[10px] leading-4"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Auto-saves · do it across sittings
              </p>
            </GlassCard>
          </div>

          {/* Journey progress card */}
          <GlassCard className="absolute left-[28px] right-[28px] top-[435px] overflow-hidden flex flex-col">
            <p
              className="font-sans font-semibold text-[10px] leading-4 uppercase tracking-[0.08em] px-[16px] pt-[16px] pb-[10px] shrink-0"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Your journey
            </p>

            <div className="flex flex-col flex-1 overflow-hidden">
              {PROFILE_STAGES.map((stage, index) => {
                const Icon = STAGE_ICONS[stage.id] ?? AvatarStepIcon;
                const isDone = index < activeIndex;
                const isActive = index === activeIndex;
                const isLast = index === PROFILE_STAGES.length - 1;
                log('step render', { label: stage.trailLabel, isDone, isActive });

                return (
                  <div
                    key={stage.id}
                    className={`flex items-center justify-between gap-[12px] px-[16px] py-[9px] ${!isLast ? 'border-b border-b-[rgba(255,255,255,0.1)]' : ''}`}
                    style={{
                      ...(isActive
                        ? { background: 'rgba(255,255,255,0.28)', border: '1px solid #fef1e7' }
                        : {}),
                      ...(isDone ? { opacity: 0.5 } : {}),
                      ...(!isDone && !isActive ? { opacity: 0.45 } : {}),
                    }}
                  >
                    <div className="flex items-center gap-[8px] min-w-0">
                      <Icon
                        className={`size-4 shrink-0 ${isActive ? 'text-white' : 'text-[rgba(255,255,255,0.7)]'}`}
                      />
                      <span
                        className={`font-sans text-[12px] leading-5 text-white min-w-0 ${isDone ? 'line-through decoration-white/50' : ''} ${isActive ? 'font-semibold' : 'font-normal'}`}
                      >
                        {stage.trailLabel}
                      </span>
                    </div>
                    {isDone && (
                      <CheckIcon className="size-[14px] shrink-0 text-[rgba(255,255,255,0.8)]" />
                    )}
                    {isActive && (
                      <PlayMarkIcon className="size-[14px] shrink-0 text-[rgba(255,255,255,0.8)]" />
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </aside>
  );
};

export default ProfileFillingJourneyPanel;
