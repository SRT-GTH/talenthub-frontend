import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import ProfileFillingJourneyPanel from './ProfileFillingJourneyPanel.jsx';

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
        <ProfileFillingJourneyPanel
          activeStageId="skills"
          showcaseTitle="Skills"
          showcaseSubtitle="What actually pulls you in."
          impactValue="3+"
          impactLabel="role matches unlocked from interests alone"
          timeValue="~5 min"
        />
      </main>
    </div>
  );
};

export default SkillsIntroSection;
