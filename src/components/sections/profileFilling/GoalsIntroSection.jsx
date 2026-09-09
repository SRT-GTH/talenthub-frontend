import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import ProfileFillingJourneyPanel from './ProfileFillingJourneyPanel.jsx';
import { ArrowLeftIcon, ArrowRightSmIcon } from '../../shared/assets.jsx';

const log = debug('GoalsIntroSection');

/*
 * GoalsIntroSection — full page shell for /profile/filling/goals.
 * Source: Figma frame 5619:80997 ("Goals start screen"), file key
 * Bin8roWL8sloyc36IgFMuT. Structurally mirrors CertsIntroSection.jsx /
 * WorkIntroSection.jsx / PortfolioIntroSection.jsx (same nav/breadcrumb
 * chrome, header, numbered info cards, shared `ProfileFillingJourneyPanel`
 * right panel). See wiki/figma-node-map.md § "Goals — profile filling page
 * flow" for the full node inventory.
 *
 * ✅ FIGMA MCP AVAILABILITY — unlike the Certs build, `get_design_context`
 * worked throughout this session. EVERY string and colour on this page was
 * read from a real `get_design_context` dive on 5619:80997 (the whole page
 * subtree returned in one call, 2026-09-09). Nothing here is derived from
 * `get_metadata` layer names.
 *
 * Verbatim-copy inventory (all ✅ VERIFIED unless flagged):
 *   Headline 5619:81198 — mixed style: plain "Goals" (#111, Instrument
 *     Serif Regular) on line 1 + italic green "Where you're actually
 *     heading." (#387440) on line 2.
 *   Subtext 5619:81199 — three-line paragraph, reproduced verbatim
 *     including its missing comma after "summary card".
 *   Tags 5619:81201/81202/81203 — "Not Started", "3.4× attention",
 *     "~7 min".
 *   Section label 5619:81205 — "What this stage covers".
 *   Four numbered cards 5619:81208/81214/81220/81226.
 *   Footer 5619:81113/81114 — "Go back" / "Open Goals".
 *   Top bar 5619:81101/81102/81103 — "Step 8 of 9 · Goals",
 *     "· 78% profile complete · auto-saved".
 *
 * ❓ NEEDS-CLARIFICATION (flagged, NOT silently fixed):
 *   1. Stage card #4's TITLE is literally "Cover images" (5619:81230) while
 *      its own body (5619:81231) is entirely about impact-driven
 *      organisations / NGOs — an unmistakable Portfolio-stage clone
 *      leftover. Per WorkIntroSection.jsx's own precedent for a SINGLE
 *      mismatched card title (keep verbatim + flag; CertsIntroSection only
 *      substituted because ALL FOUR of its titles were wrong, which read as
 *      a systemic labelling bug) this ships verbatim. A designer should
 *      confirm the intended title.
 *   2. Figma's own numbers disagree with each other on this page: the
 *      header tag says "~7 min" (5619:81203) while the right panel's "Time
 *      to complete" card says "~4 min" (5619:81136). RESOLVED 2026-09-09 by
 *      the cross-flow duration sweep: the intro tag wins, the panel now
 *      renders "~7 min" (see the inline note on the prop below).
 *
 * ⚠️ ASSUMPTION (right-panel props only, same resolution CertsIntroSection
 * reached for its own clone leftovers):
 *   - showcaseTitle: Figma's own showcase reads "Personality"
 *     (5619:81127) — a Personality-stage clone. Replaced with "Goals".
 *   - showcaseSubtitle: Figma reads "What actually pulls you in."
 *     (5619:81128) — same clone. Replaced with THIS PAGE'S OWN ✅ VERIFIED
 *     headline suffix, "Where you're actually heading.", rather than
 *     inventing new copy.
 *   - impactLabel: the VALUE "60%" (5619:81132) is ✅ VERIFIED, but its
 *     label literally reads "more recruiter focus on portfolio"
 *     (5619:81133) — a Portfolio clone. Only the trailing noun phrase is
 *     swapped, grounded in this page's own verified subtext ("Set a comp
 *     range to cut mismatched outreach by 60%").
 *   - timeValue: Figma's "~4 min" is ✅ VERIFIED verbatim but deliberately
 *     NOT reproduced — see clarification #2 and the duration sweep.
 */

// Figma 5619:81207 and children — "What this stage covers" info cards.
// All four titles AND bodies are ✅ VERIFIED verbatim via get_design_context
// (2026-09-09); card #4's title/body mismatch is flagged in the file header.
const STAGE_CARDS = [
  {
    num: '1',
    title: 'Stacked priorities',
    body: 'Add up to 5 career goal entries ranked by priority. Drag to reorder. Recruiters see your top priority on your summary card.',
  },
  {
    num: '2',
    title: 'Compensation range',
    body: "Optional but high-value. Profiles with comp ranges receive 60% fewer mismatched outreaches — saving your time and recruiters' time simultaneously.",
  },
  {
    num: '3',
    title: 'Location preferences',
    body: 'Set per goal: Accra only · Anywhere in Ghana · Remote-first · Open to relocate internationally. Recruiters filter by this before reaching out.',
  },
  {
    // ❓ NEEDS-CLARIFICATION — verbatim Figma title (5619:81230) that does
    // not match its own body. See file-header note #1.
    num: '4',
    title: 'Cover images',
    body: 'Toggle on to boost visibility with impact-driven organisations. Surfaces you to NGOs, social enterprises, and mission-first companies specifically.',
  },
];

// ─── Main section ─────────────────────────────────────────────────────────────
const GoalsIntroSection = () => {
  log('mount', { stage: 'desired-career', stageIndex: 7 });
  const navigate = useNavigate();

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/certs/list');
    navigate('/profile/filling/certs/list');
  };

  const handleOpenGoals = () => {
    log('open goals → /profile/filling/goals/list');
    navigate('/profile/filling/goals/list');
  };

  const currentStage = PROFILE_STAGES[7]; // desired-career

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
        {/* completionPct 78 — ✅ VERIFIED from Figma 5619:81103's own
            "· 78% profile complete · auto-saved" string. */}
        <EngagementTopBar currentStageIndex={7} completionPct={78} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {/* Header section — Figma 5619:81195. The two radial gradients
                and the flat white base are the node's own literal
                backgroundImage stack. */}
            <section
              aria-label={`${currentStage?.title ?? 'Goals'} overview`}
              className="border-b border-[rgba(0,0,0,0.07)] flex flex-col justify-center px-[clamp(20px,3.24vw,56px)] py-[clamp(24px,2.78vw,48px)] relative"
              style={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(56,116,64,0.07) 0%, transparent 55%)',
                  'radial-gradient(circle at 100% 100%, rgba(244,114,182,0.1) 0%, transparent 55%)',
                  '#fff',
                ].join(', '),
              }}
            >
              {/* Figma 5619:81198 — 44px / tracking -2px / leading 40.48px,
                  line 1 plain #111, line 2 italic #387440. */}
              <h2 className="font-display text-[clamp(22px,2.55vw,44px)] leading-[0.92] tracking-[-2px] mb-[clamp(8px,0.93vw,16px)]">
                <span className="not-italic text-content-primary block">Goals</span>
                <span className="italic text-brand-green block">
                  Where you&rsquo;re actually heading.
                </span>
              </h2>

              {/* Figma 5619:81199 — ✅ VERIFIED verbatim (including the
                  missing comma after "summary card"). */}
              <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-5 tracking-[0.2px] text-[#959592] mb-[clamp(8px,0.93vw,16px)] max-w-[800px]">
                Multi-priority career goals. Recruiters see your top choice on your summary card
                secondary goals unlock when they browse your full profile. Set a comp range to cut
                mismatched outreach by 60%.
              </p>

              {/* Figma 5619:81201/81202/81203 — ✅ VERIFIED verbatim. */}
              <div className="flex items-center flex-wrap gap-[10px]">
                {['Not Started', '3.4× attention', '~7 min'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center font-sans font-semibold text-[clamp(10px,0.69vw,12px)] leading-5 text-[#737373] bg-white rounded-pill px-[12px] py-[6px] border border-brand-green-light-hover whitespace-nowrap"
                    style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Section label — Figma 5619:81204/81205/81206 */}
            <div className="flex items-center gap-[8px] px-[clamp(16px,3.125vw,54px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(10px,1.16vw,20px)]">
              <span className="font-sans font-bold text-[10px] leading-4 tracking-[0.2px] text-[#888] uppercase whitespace-nowrap shrink-0">
                What this stage covers
              </span>
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" aria-hidden="true" />
            </div>

            {/* Step cards — Figma 5619:81207 */}
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
                  <div className="flex flex-col justify-center min-w-0 gap-[4px]">
                    <p className="font-sans font-bold text-[13px] leading-normal text-content-primary truncate">
                      {card.title}
                    </p>
                    <p className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#959592] max-w-[941px]">
                      {card.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer — Figma 5619:81106 */}
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
                  onClick={handleOpenGoals}
                  rightIcon={<ArrowRightSmIcon className="size-full" />}
                >
                  Open Goals
                </Button>
              </div>
            </div>
          </footer>
        </div>

        {/* Right panel — Figma 5619:81115/81121. See the file-header
            ⚠️ ASSUMPTION block for exactly which of these four props are
            verbatim and which replace a clone leftover. */}
        <ProfileFillingJourneyPanel
          activeStageId="desired-career"
          showcaseTitle="Goals"
          showcaseSubtitle="Where you're actually heading."
          impactValue="60%"
          impactLabel="fewer mismatched recruiter outreaches"
          /* 🔧 DURATION-CONSISTENCY SWEEP (2026-09-09, explicit user
             instruction): was "~4 min" — Figma's own right-panel value and
             the mismatch clarification #2 above documented but left
             unreconciled. This page's own header tag ("~7 min", 5619:81203)
             is now the single source of truth for the Goals flow's duration
             and is reconciled into this panel + the stage-2 header tag
             (GoalsStage2Section.jsx, likewise moved off "~3 min").
             Deliberate, instructed divergence from Figma. */
          timeValue="~7 min"
        />
      </main>
    </div>
  );
};

export default GoalsIntroSection;
