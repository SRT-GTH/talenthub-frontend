import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
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
} from '../../shared/assets.jsx';

const log = debug('SkillsIntroSection');

/*
 * SkillsIntroSection — full page shell for /profile/filling/skills.
 * Source: Figma frame 3625:138665 ("skills intro").
 *
 * Layout (h-screen, overflow-hidden, flex-col):
 *   ┌─ EngagementTopNav  (bg-neutral, clamp 64–90px tall)
 *   ├─ EngagementTopBar  (currentStageIndex=3 Skills, clamp 60–77px)
 *   └─ main (flex-1, flex-row)
 *       ├─ LEFT COLUMN (flex-1, flex-col)
 *       │   ├─ Header section (headline + subtitle + tags)
 *       │   ├─ Scrollable content (section label + 4 step cards)
 *       │   └─ Footer (auto-saved + Go back / Open Skills)
 *       └─ RIGHT PANEL (clamp 240–329px, dark-green gradient + journey cards)
 *
 * Right panel node:  Figma 3625:138787.
 * Header node:       Figma 3625:138859.
 * Step cards node:   Figma 3625:138873.
 * Footer node:       Figma 3625:138778.
 */

// ─── Local icon helpers ───────────────────────────────────────────────────────

// Completed step indicator (right side of journey row).
const CheckMark = ({ className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2.5 7l3.5 3.5L11.5 3.5" />
  </svg>
);

// Active step indicator (right side of journey row).
const PlayMark = ({ className }) => (
  <svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M3.5 2.5L11.5 7 3.5 11.5V2.5z" />
  </svg>
);

// Footer "Go back" left arrow.
const ArrowLeftIcon = ({ className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M11 7H3M6 4l-3 3 3 3" />
  </svg>
);

// Footer "Open Skills" right arrow.
const ArrowRightIcon = ({ className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 7h8M8 4l3 3-3 3" />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────

// Figma 3625:138873 — "WHAT THIS STAGE COVERS" step cards (verbatim from Figma).
const STAGE_CARDS = [
  {
    num: '1',
    title: 'Self-reported skills',
    body: 'Situational judgment scenarios calibrated for Ghanaian professional context — not US/EU workplace defaults. Each question takes 20–40 seconds.',
  },
  {
    num: '2',
    title: 'Verified skills',
    body: 'Skills Lab mini-game: 5–10 min per skill. Pass = green ✓ badge on your profile. Recruiters click verified skills 4× more often than self-reported.',
  },
  {
    num: '3',
    title: 'Peer endorsements',
    body: "Anyone on GTH who's worked with you can endorse a skill. Endorsement count shows next to each skill. Social proof that builds trust.",
  },
  {
    num: '4',
    title: 'Skills Lab',
    body: "A separate mini-game area accessible from this stage. Retake any skill assessment if you don't pass first time — no penalty for retrying.",
  },
];

// Figma 3625:138810 — journey progress step list (right panel).
// Avatar, Interests, Personality are done; Skills is active; rest are future.
const JOURNEY_STEPS = [
  { label: 'Avatar', status: 'done', Icon: AvatarStepIcon },
  { label: 'Interests', status: 'done', Icon: InterestsStepIcon },
  { label: 'Personality', status: 'done', Icon: PersonalityStepIcon },
  { label: 'Skills', status: 'active', Icon: SkillsStepIcon },
  { label: 'Work', status: 'future', Icon: WorkStepIcon },
  { label: 'Portfolio', status: 'future', Icon: PortfolioStepIcon },
  { label: 'Certs', status: 'future', Icon: CertsStepIcon },
  { label: 'Goals', status: 'future', Icon: GoalsStepIcon },
  { label: 'Pitch', status: 'future', Icon: PitchStepIcon },
];

// ─── Glass card helper ────────────────────────────────────────────────────────
const GlassCard = ({ className, children }) => (
  <div
    className={`rounded-[14px] border border-[rgba(255,255,255,0.18)] ${className ?? ''}`}
    style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(2px)' }}
  >
    {children}
  </div>
);

// ─── Right panel ─────────────────────────────────────────────────────────────
// Figma 3625:138787 — dark green gradient panel (329px wide).
// Top showcase displays the Personality stage (previous completed stage) as
// a motivational "look what you just unlocked" card.
// Stats: recruiter impact (3+) + time to complete (~8 min).
// Journey list: Avatar/Interests/Personality done, Skills active, rest future.
const SkillsRightPanel = () => (
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

    {/* Scrollable content — Figma 3625:138793 */}
    <div
      className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="relative" style={{ minHeight: '853px', paddingBottom: '58px' }}>
        {/* Icon showcase — Figma 3625:138794
            Shows Personality (the stage just completed) as motivational context. */}
        <div className="absolute inset-x-0 top-[10px] h-[152px] flex flex-col items-center pt-[20px] gap-[10px]">
          <div
            className="size-[56px] rounded-[16px] flex items-center justify-center border-2 border-[rgba(255,255,255,0.3)] shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <SkillsStepIcon className="size-[28px] text-white" />
          </div>
          <p className="font-display not-italic text-[22px] leading-tight text-white text-center tracking-[-0.4px]">
            Skills
          </p>
          <p
            className="font-sans text-[10px] leading-4 text-center"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            What actually pulls you in.
          </p>
        </div>

        {/* Stat cards — Figma 3625:138801 */}
        <div className="absolute left-[28px] right-[28px] top-[174px] flex flex-col gap-[14px]">
          {/* Recruiter impact */}
          <GlassCard className=" flex flex-col items-center justify-center gap-[6px] px-[14px] py-[12px] text-center">
            <p
              className="font-sans font-semibold text-[10px] leading-4"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Recruiter impact
            </p>
            <p className="font-display not-italic text-[42px] leading-none text-white">3+</p>
            <p
              className="font-sans text-[10px] leading-4"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              role matches unlocked from interests alone
            </p>
          </GlassCard>

          {/* Time to complete */}
          <GlassCard className=" flex flex-col items-center justify-center gap-[6px] px-[14px] py-[12px] text-center">
            <p
              className="font-sans font-semibold text-[10px] leading-4"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Time to complete
            </p>
            <p className="font-display not-italic text-[30px] leading-none text-white">~5 min</p>
            <p
              className="font-sans text-[10px] leading-4"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Auto-saves · do it across sittings
            </p>
          </GlassCard>
        </div>

        {/* Journey progress card — Figma 3625:138810 */}
        <GlassCard className="absolute left-[28px] right-[28px] top-[435px] overflow-hidden flex flex-col">
          <p
            className="font-sans font-semibold text-[10px] leading-4 uppercase tracking-[0.08em] px-[16px] pt-[16px] pb-[10px] shrink-0"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Your journey
          </p>

          <div className="flex flex-col flex-1 overflow-hidden">
            {JOURNEY_STEPS.map((step, index) => {
              const { label, status, Icon } = step;
              const isDone = status === 'done';
              const isActive = status === 'active';
              const isLast = index === JOURNEY_STEPS.length - 1;
              log('step render', { label, status });

              return (
                <div
                  key={label}
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
                      {label}
                    </span>
                  </div>
                  {isDone && (
                    <CheckMark className="size-[14px] shrink-0 text-[rgba(255,255,255,0.8)]" />
                  )}
                  {isActive && (
                    <PlayMark className="size-[14px] shrink-0 text-[rgba(255,255,255,0.8)]" />
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

// ─── Main section ─────────────────────────────────────────────────────────────
const SkillsIntroSection = () => {
  log('mount', { stage: 'skills', stageIndex: 3 });
  const navigate = useNavigate();

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → personality');
    navigate('/profile/filling/personality');
  };

  const handleOpenSkills = () => {
    log('open skills → /profile/filling/skills/categories');
    navigate('/profile/filling/skills/categories');
  };

  const currentStage = PROFILE_STAGES[3]; // skills

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* ── Top nav */}
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch">
        <EngagementTopNav
          bgClass="bg-neutral"
          onSaveExit={handleSaveExit}
          showSwitchModes={false}
          className="w-full h-full"
        />
      </div>

      {/* ── Stage trail — Skills (index 3) is active */}
      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch">
        <EngagementTopBar currentStageIndex={3} completionPct={0} className="w-full h-full" />
      </div>

      {/* ── Main content */}
      <main className="flex-1 min-h-0 overflow-hidden flex">
        {/* ── Left content column */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {/* Header section — Figma 3625:138859 */}
            <section
              aria-label={`${currentStage?.title ?? 'Skills'} overview`}
              className="border-b border-[rgba(0,0,0,0.07)] flex flex-col justify-center px-[clamp(20px,3.24vw,56px)] py-[clamp(24px,2.78vw,48px)] relative"
              style={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(56,116,64,0.07) 0%, transparent 55%)',
                  'radial-gradient(circle at 100% 100%, rgba(244,114,182,0.1) 0%, transparent 50%)',
                  '#fff',
                ].join(', '),
              }}
            >
              {/* Headline — Figma 3625:138861–3625:138862 */}
              <h2 className="font-display text-[clamp(22px,2.55vw,44px)] leading-[0.92] tracking-[-2px] mb-[clamp(8px,0.93vw,16px)]">
                <span className="not-italic text-content-primary block">Skills</span>
                <span className="italic text-brand-green block">What you can actually do.</span>
              </h2>

              {/* Subtitle — Figma 3625:138863 */}
              <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-5 tracking-[0.2px] text-[#959592] mb-[clamp(8px,0.93vw,16px)] max-w-[798px]">
                Add as many skills as you have. Set proficiency, collect peer endorsements, and
                verify your top skills via the Skills Lab mini-game to earn the green ✓ badge that
                recruiters trust 4× more.
              </p>

              {/* Tags — Figma 3625:138864 */}
              <div className="flex items-center flex-wrap gap-[10px]">
                {['Not Started', 'Endorsements', '~5 min'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center font-sans font-semibold text-[clamp(10px,0.69vw,12px)] leading-5 text-[#737373] bg-white rounded-full px-[12px] py-[6px] border border-[#e1eae2] whitespace-nowrap"
                    style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Section label — Figma 3625:138870 */}
            <div className="flex items-center gap-[8px] px-[clamp(16px,3.125vw,54px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(10px,1.16vw,20px)]">
              <span className="font-sans font-bold text-[10px] leading-4 tracking-[0.08em] text-[#888] uppercase whitespace-nowrap shrink-0">
                WHAT THIS STAGE COVERS
              </span>
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" aria-hidden="true" />
            </div>

            {/* Step cards — Figma 3625:138873 */}
            <div className="flex flex-col gap-[8px] px-[clamp(16px,3.125vw,54px)] pb-[clamp(16px,2vw,32px)]">
              {STAGE_CARDS.map((card, index) => (
                <div
                  key={`card-${index}`}
                  className="flex items-center gap-[clamp(10px,1.39vw,24px)] bg-white border border-[#e8e8e4] rounded-[12px] py-4 px-[clamp(10px,0.87vw,15px)] shrink-0"
                  style={{ boxShadow: '0px 4px 0px rgba(0,0,0,0.06)' }}
                >
                  <div className="size-[26px] rounded-[13px] bg-brand-green flex items-center justify-center shrink-0">
                    <span className="font-mono text-[11px] font-medium text-white leading-none select-none">
                      {card.num}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="font-sans font-bold text-[13px] leading-5 text-content-primary truncate">
                      {card.title}
                    </p>
                    <p className="font-sans text-[12px] leading-5 tracking-[0.2px] text-[#959592] line-clamp-2">
                      {card.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer — Figma 3625:138778 */}
          <footer className="shrink-0 h-[142px] border-t border-[#f1f5f9] bg-white flex items-center px-[clamp(20px,3.24vw,56px)]">
            <div className="flex items-center justify-between w-full">
              {/* Auto-saved notice */}
              <div className="flex items-center gap-[6px]">
                <span
                  aria-hidden="true"
                  className="inline-block w-[6px] h-[6px] rounded-[3px] bg-brand-green shrink-0"
                />
                <span className="font-sans text-[12px] leading-5 text-neutral-dark">
                  Auto-saved · changes carry to all tabs
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-6">
                <Button
                  variant="tertiary"
                  size="md"
                  onClick={handleGoBack}
                  leftIcon={<ArrowLeftIcon className="size-full" />}
                >
                  Go back
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleOpenSkills}
                  rightIcon={<ArrowRightIcon className="size-full" />}
                >
                  Open Skills
                </Button>
              </div>
            </div>
          </footer>
        </div>

        {/* ── Right panel */}
        <SkillsRightPanel />
      </main>
    </div>
  );
};

export default SkillsIntroSection;
