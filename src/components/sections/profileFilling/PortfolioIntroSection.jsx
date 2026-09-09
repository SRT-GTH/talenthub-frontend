import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import ProfileFillingJourneyPanel from './ProfileFillingJourneyPanel.jsx';
import { ArrowLeftIcon, ArrowRightSmIcon } from '../../shared/assets.jsx';

const log = debug('PortfolioIntroSection');

/*
 * PortfolioIntroSection — full page shell for /profile/filling/portfolio.
 * Source: Figma frame 5178:101277 ("Portfolio start screen"), file key
 * Bin8roWL8sloyc36IgFMuT ("Gh-Design-system--onboading"). Structurally
 * mirrors WorkIntroSection.jsx (same nav/breadcrumb chrome, header, numbered
 * info cards, shared `ProfileFillingJourneyPanel` right panel) per this
 * session's shared-shell convention — see wiki/figma-node-map.md § "Project
 * Portfolio — profile filling page flow" for the full node inventory dived
 * into (2026-09-07).
 *
 * Layout (h-screen, overflow-hidden, flex-col):
 *   ┌─ EngagementTopNav
 *   ├─ EngagementTopBar (currentStageIndex=5 Portfolio)
 *   └─ main (flex-row)
 *       ├─ LEFT COLUMN — header + "what this stage covers" + 4 info cards + footer
 *       └─ RIGHT PANEL — ProfileFillingJourneyPanel (shared)
 *
 * Verbatim text confirmed via get_design_context on 5178:101475 (header) and
 * 5178:101487 (info cards), 2026-09-07 — no Figma copy-paste inconsistencies
 * found on THIS page (unlike the Add/Edit modal, see that file's header
 * comment), so every string below reproduces the real dived text as-is.
 */

// ─── Data ────────────────────────────────────────────────────────────────────

// Figma 5178:101487 and children — "WHAT THIS STAGE COVERS" info cards
// (verbatim `characters` fields, confirmed via get_design_context).
const STAGE_CARDS = [
  {
    num: '1',
    title: 'Project cards',
    body: `Each project: cover image, title, what you did, tools and methods used, your specific role (not "team project"), and outcome achieved.`,
  },
  {
    num: '2',
    title: 'Links',
    body: 'GitHub · Figma · Notion · YouTube · Behance · Personal site · Google Drive (shared) · Any live URL. Multiple links per project.',
  },
  {
    num: '3',
    title: 'Pinned project',
    body: 'The pinned project appears first on your recruiter card. Choose the one with the most impact — not the most complexity.',
  },
  {
    num: '4',
    title: 'Cover images',
    body: 'Even a screenshot of your work increases recruiter engagement dramatically. Accepted: PNG, JPG, WebP, max 5MB per image.',
  },
];

// ─── Main section ─────────────────────────────────────────────────────────────
const PortfolioIntroSection = () => {
  log('mount', { stage: 'project-portfolio', stageIndex: 5 });
  const navigate = useNavigate();

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/work/history');
    navigate('/profile/filling/work/history');
  };

  const handleOpenPortfolio = () => {
    log('open portfolio → /profile/filling/portfolio/projects');
    navigate('/profile/filling/portfolio/projects');
  };

  const currentStage = PROFILE_STAGES[5]; // project-portfolio

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch">
        <EngagementTopNav
          bgClass="bg-neutral"
          onSaveExit={handleSaveExit}
          showSwitchModes={false}
          className="w-full h-full"
        />
      </div>

      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch">
        <EngagementTopBar currentStageIndex={5} completionPct={56} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {/* Header section — Figma 5178:101475 */}
            <section
              aria-label={`${currentStage?.title ?? 'Portfolio'} overview`}
              className="border-b border-[rgba(0,0,0,0.07)] flex flex-col justify-center px-[clamp(20px,3.24vw,56px)] py-[clamp(24px,2.78vw,48px)] relative"
              style={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(56,116,64,0.07) 0%, transparent 55%)',
                  'radial-gradient(circle at 100% 100%, rgba(244,114,182,0.1) 0%, transparent 55%)',
                  '#fff',
                ].join(', '),
              }}
            >
              <h2 className="font-display text-[clamp(22px,2.55vw,44px)] leading-[0.92] tracking-[-2px] mb-[clamp(8px,0.93vw,16px)]">
                <span className="not-italic text-content-primary block">Portfolio</span>
                <span className="italic text-brand-green block">Show, don&rsquo;t just tell.</span>
              </h2>

              <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-5 tracking-[0.2px] text-[#959592] mb-[clamp(8px,0.93vw,16px)] max-w-[500px]">
                Projects are where recruiters spend 3.4× longer than any other profile section. Your
                pinned project appears first on your summary card. Even one documented project beats
                none.
              </p>

              <div className="flex items-center flex-wrap gap-[10px]">
                {['Not Started', '3.4× attention', '~7 min'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center font-sans font-medium text-[clamp(10px,0.69vw,12px)] leading-4 text-content-helper bg-white rounded-pill px-[10px] py-[4px] border border-brand-green-light-hover whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Section label — Figma 5178:101484 */}
            <div className="flex items-center gap-[8px] px-[clamp(16px,3.125vw,54px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(10px,1.16vw,20px)]">
              <span className="font-sans font-bold text-[10px] leading-4 tracking-[0.08em] text-[#888] uppercase whitespace-nowrap shrink-0">
                WHAT THIS STAGE COVERS
              </span>
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" aria-hidden="true" />
            </div>

            {/* Step cards — Figma 5178:101487 */}
            <div className="flex flex-col gap-[8px] px-[clamp(16px,3.125vw,54px)] pb-[clamp(16px,2vw,32px)]">
              {STAGE_CARDS.map((card) => (
                <div
                  key={`card-${card.num}`}
                  className="flex items-center gap-[clamp(10px,1.39vw,24px)] bg-white border border-[#e8e8e4] rounded-[12px] min-h-[clamp(64px,4.92vw,85px)] px-[clamp(10px,0.87vw,15px)] py-[10px] shrink-0"
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
                    <p className="font-sans text-[12px] leading-5 tracking-[0.2px] text-[#959592] max-w-[711px]">
                      {card.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer — Figma 5178:101390 */}
          <footer className="shrink-0 h-[142px] border-t border-[#f1f5f9] bg-white flex items-center px-[clamp(20px,3.24vw,56px)]">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-[6px]">
                <span
                  aria-hidden="true"
                  className="inline-block w-[6px] h-[6px] rounded-[3px] bg-brand-green shrink-0"
                />
                <span className="font-sans text-[12px] leading-5 text-neutral-dark">
                  Auto-saved · changes carry to all tabs
                </span>
              </div>

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
                  onClick={handleOpenPortfolio}
                  rightIcon={<ArrowRightSmIcon className="size-full" />}
                >
                  Open Portfolio
                </Button>
              </div>
            </div>
          </footer>
        </div>

        <ProfileFillingJourneyPanel
          activeStageId="project-portfolio"
          showcaseTitle="Portfolio"
          showcaseSubtitle="Show, don't just tell."
          impactValue="3.4×"
          impactLabel="more recruiter focus on portfolio"
          /* 🔧 DURATION-CONSISTENCY SWEEP (2026-09-09, explicit user
             instruction): was "~8 min", Figma's own right-panel value, which
             contradicted THIS PAGE'S OWN header tag ("~7 min", rendered
             above). Across every profile-filling flow, the intro page's tag
             row is now the single source of truth for that flow's duration
             and is reconciled into the right panel + the stage-2 header tag
             (PortfolioStage2Section.jsx, likewise moved off "~6 min").
             Deliberate, instructed divergence from Figma. */
          timeValue="~7 min"
        />
      </main>
    </div>
  );
};

export default PortfolioIntroSection;
