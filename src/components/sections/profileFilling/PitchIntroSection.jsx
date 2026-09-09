import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import ProfileFillingJourneyPanel from './ProfileFillingJourneyPanel.jsx';
import { ArrowLeftIcon, ArrowRightSmIcon } from '../../shared/assets.jsx';

const log = debug('PitchIntroSection');

/*
 * PitchIntroSection — full page shell for /profile/filling/pitch.
 * Source: Figma frame 5625:92953 ("Pitch start screen"), file key
 * Bin8roWL8sloyc36IgFMuT. Structurally mirrors GoalsIntroSection.jsx /
 * CertsIntroSection.jsx (same nav/breadcrumb chrome, header, numbered info
 * cards, shared `ProfileFillingJourneyPanel` right panel). See
 * wiki/figma-node-map.md § "Talent Pitch — profile filling page flow".
 *
 * ✅ FIGMA MCP AVAILABILITY — `mcp__figma__get_design_context` returned the
 * whole 5625:92953 subtree in one call (2026-09-09). EVERY string, colour and
 * measurement below is read from that dive. Nothing here is derived from
 * `get_metadata` layer names.
 *
 * Verbatim-copy inventory (all ✅ VERIFIED unless flagged):
 *   Headline 5625:93160 — mixed style: plain "Pitch" (#111, Instrument Serif
 *     Regular) on line 1 + italic green "Your 60-second story." (#387440) on
 *     line 2. (Checked per-headline, not assumed: the STAGE-2 page's own
 *     headline is NOT mixed-style — see PitchStage2Section.jsx.)
 *   Subtext 5625:93161 — three-line paragraph, verbatim.
 *   Tags 5625:93163/93164/93165 — "Not Started", "3.4× attention", "~7 min".
 *   Section label 5625:93167 — "What this stage covers".
 *   Four numbered cards 5625:93170/93176/93182/93188 — titles AND bodies all
 *     genuinely Pitch-specific (no cross-stage clone leftovers on this page,
 *     unlike the Goals intro's "Cover images" card).
 *   Footer 5625:93073/93074 — "Go back" / "Open Pitch".
 *   Top bar 5625:93152/93153/93154 — "Step 9 of 9 ·", "Pitch",
 *     "· 90% profile complete · auto-saved".
 *
 * ⚠️ ASSUMPTION — right-panel `impactLabel`:
 *   Figma's Recruiter-impact card reads "60%" (5625:93092, ✅ VERIFIED) over
 *   the label "more recruiter focus on portfolio" (5625:93093) — the exact
 *   same Portfolio-stage clone leftover the Goals intro carried. Only the
 *   trailing noun phrase is swapped, grounded in THIS page's own verified
 *   subtext ("Profiles with a pitch video get 6× more recruiter messages")
 *   and the stage-2 page's own "Why pitch matters" card. The showcase title
 *   ("Pitch", 5625:93087) and subtitle ("Your 60-second story.", 5625:93088)
 *   are genuinely Pitch-specific and used verbatim.
 *
 * 🔧 DURATION-CONSISTENCY SWEEP (2026-09-09, explicit user instruction):
 *   Figma's own numbers disagree on this page — the header tag says "~7 min"
 *   (5625:93165) while the right panel's "Time to complete" card says
 *   "~4 min" (5625:93096). Per the cross-flow sweep run at the end of this
 *   build, EACH FLOW'S INTRO-PAGE TAG IS THE SINGLE SOURCE OF TRUTH, so the
 *   panel is set to "~7 min" here rather than reproducing Figma's "~4 min".
 *   This is a deliberate, instructed divergence from Figma — flagged so a
 *   designer can reconcile the source file.
 */

// Figma 5625:93169 and children — "What this stage covers" info cards.
// All four titles AND bodies are ✅ VERIFIED verbatim via get_design_context.
const STAGE_CARDS = [
  {
    num: '1',
    title: '60-second video',
    body: "Record in-browser or upload a file. Three tips: look at the camera not your face on screen. Name one specific thing you've shipped. End with what you're actually looking for.",
  },
  {
    num: '2',
    title: 'Multiple takes',
    body: "Record as many takes as you need — no limit. The last one saves. Re-record anytime, nothing locks, your previous takes don't count against you.",
  },
  {
    num: '3',
    title: 'AI-drafted bio',
    body: 'GTH generates a first-draft written bio from your completed stages. You edit and approve. Removes blank-page friction — the hardest part of any "about me".',
  },
  {
    num: '4',
    title: 'How both are shown',
    body: 'Video: play button on your recruiter card. Bio: text recruiters read before deciding to press play. Together they complete your talent story.',
  },
];

// ─── Main section ─────────────────────────────────────────────────────────────
const PitchIntroSection = () => {
  log('mount', { stage: 'talent-pitch', stageIndex: 8 });
  const navigate = useNavigate();

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/goals/list');
    navigate('/profile/filling/goals/list');
  };

  const handleOpenPitch = () => {
    log('open pitch → /profile/filling/pitch/record');
    navigate('/profile/filling/pitch/record');
  };

  const currentStage = PROFILE_STAGES[8]; // talent-pitch

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
        {/* completionPct 90 — ✅ VERIFIED from Figma 5625:93154's own
            "· 90% profile complete · auto-saved" string. */}
        <EngagementTopBar currentStageIndex={8} completionPct={90} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {/* Header section — Figma 5625:93157. The two radial gradients
                and the flat white base are the node's own literal
                backgroundImage stack. */}
            <section
              aria-label={`${currentStage?.title ?? 'Pitch'} overview`}
              className="border-b border-[rgba(0,0,0,0.07)] flex flex-col justify-center px-[clamp(20px,3.24vw,56px)] py-[clamp(24px,2.78vw,48px)] relative"
              style={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(56,116,64,0.07) 0%, transparent 55%)',
                  'radial-gradient(circle at 100% 100%, rgba(244,114,182,0.1) 0%, transparent 55%)',
                  '#fff',
                ].join(', '),
              }}
            >
              {/* Figma 5625:93160 — 44px / tracking -2px / leading 40.48px,
                  line 1 plain #111, line 2 italic #387440. */}
              <h2 className="font-display text-[clamp(22px,2.55vw,44px)] leading-[0.92] tracking-[-2px] mb-[clamp(8px,0.93vw,16px)]">
                <span className="not-italic text-content-primary block">Pitch</span>
                <span className="italic text-brand-green block">Your 60-second story.</span>
              </h2>

              {/* Figma 5625:93161 — ✅ VERIFIED verbatim. */}
              <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-5 tracking-[0.2px] text-[#959592] mb-[clamp(8px,0.93vw,16px)] max-w-[800px]">
                A 60-second video pitch plus an AI-drafted written bio. The video is the emotional
                hook. The bio is the same story in scannable text. Profiles with a pitch video get
                6× more recruiter messages.
              </p>

              {/* Figma 5625:93163/93164/93165 — ✅ VERIFIED verbatim. This
                  "~7 min" tag is the source of truth for every other
                  duration in the Pitch flow (see the sweep note in the file
                  header). */}
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

            {/* Section label — Figma 5625:93166/93167/93168 */}
            <div className="flex items-center gap-[8px] px-[clamp(16px,3.125vw,54px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(10px,1.16vw,20px)]">
              <span className="font-sans font-bold text-[10px] leading-4 tracking-[0.2px] text-[#888] uppercase whitespace-nowrap shrink-0">
                What this stage covers
              </span>
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" aria-hidden="true" />
            </div>

            {/* Step cards — Figma 5625:93169 */}
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

          {/* Footer — Figma 5625:93066 */}
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
                  onClick={handleOpenPitch}
                  rightIcon={<ArrowRightSmIcon className="size-full" />}
                >
                  Open Pitch
                </Button>
              </div>
            </div>
          </footer>
        </div>

        {/* Right panel — Figma 5625:93075/93081. See the file-header
            ⚠️ ASSUMPTION and 🔧 DURATION-SWEEP blocks for exactly which of
            these props are verbatim and which deliberately diverge. */}
        <ProfileFillingJourneyPanel
          activeStageId="talent-pitch"
          showcaseTitle="Pitch"
          showcaseSubtitle="Your 60-second story."
          impactValue="60%"
          impactLabel="more recruiter focus on your pitch"
          timeValue="~7 min"
        />
      </main>
    </div>
  );
};

export default PitchIntroSection;
