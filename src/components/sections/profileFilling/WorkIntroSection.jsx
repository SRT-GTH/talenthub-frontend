import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import ProfileFillingJourneyPanel from './ProfileFillingJourneyPanel.jsx';
import { ArrowLeftIcon, ArrowRightSmIcon } from '../../shared/assets.jsx';

const log = debug('WorkIntroSection');

/*
 * WorkIntroSection — full page shell for /profile/filling/work.
 * Source: Figma frame 5112:32344 ("work"), file key Bin8roWL8sloyc36IgFMuT
 * ("Gh-Design-system--onboading"). Structurally mirrors
 * InterestsIntroSection.jsx / SkillsIntroSection.jsx (same nav/breadcrumb
 * chrome, header, numbered info cards) and reuses the shared
 * `ProfileFillingJourneyPanel` for the right panel (see that file's header
 * comment — extracted 2026-09-06 after this file's first draft re-duplicated
 * it with a regressed generic icon instead of the real per-stage icon set) —
 * see wiki/figma-node-map.md § "Work Experience — profile filling flow" for
 * the full node inventory dived into.
 *
 * Layout (h-screen, overflow-hidden, flex-col):
 *   ┌─ EngagementTopNav
 *   ├─ EngagementTopBar (currentStageIndex=4 Work)
 *   └─ main (flex-row)
 *       ├─ LEFT COLUMN — header + "what this stage covers" + 4 info cards + footer
 *       └─ RIGHT PANEL — ProfileFillingJourneyPanel (shared)
 *
 * Verbatim text confirmed via get_design_context on 5112:32344 (2026-09-06).
 *
 * ⚠️ FIGMA INCONSISTENCY (flagged, not silently fixed): info card #3's
 * `characters` field literally reads "Education tab" / "Schools, programmes
 * and dates. Add your degree or courses — recruiters filter by education
 * level for some roles." on the WORK frame. This reads like a copy-paste
 * artifact from the (not-yet-built) Education/Certifications stage — it does
 * not describe anything in this Work flow. Reproduced verbatim per this
 * session's "never silently fix Figma copy" rule; flag for design review.
 */

// ─── Data ────────────────────────────────────────────────────────────────────

// Figma 5112:32548 and children — "WHAT THIS STAGE COVERS" info cards
// (verbatim `characters` fields, confirmed via get_design_context).
const STAGE_CARDS = [
  {
    num: '1',
    title: 'Role entries',
    body: 'Add as many roles as relevant — current role first. Each entry: company, title, dates, location, employment type, and 1–3 impact bullets.',
  },
  {
    num: '2',
    title: 'Impact bullets',
    body: `Prompted to write outcome-focused bullets: "Reduced X by 30%" not "Responsible for X". This single change is what makes work experience actually get read.`,
  },
  {
    // ⚠️ Figma copy-paste artifact — see file-header comment. Kept verbatim.
    num: '3',
    title: 'Education tab',
    body: 'Schools, programmes and dates. Add your degree or courses — recruiters filter by education level for some roles.',
  },
  {
    num: '4',
    title: 'Data privacy',
    body: 'Manual entry only for now. Future LinkedIn import will require explicit per-field consent. Your data never leaves GTH without your permission.',
  },
];

// ─── Main section ─────────────────────────────────────────────────────────────
const WorkIntroSection = () => {
  log('mount', { stage: 'work-experience', stageIndex: 4 });
  const navigate = useNavigate();

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/skills/categories');
    navigate('/profile/filling/skills/categories');
  };

  const handleOpenWork = () => {
    log('open work → /profile/filling/work/history');
    navigate('/profile/filling/work/history');
  };

  const currentStage = PROFILE_STAGES[4]; // work-experience

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
        <EngagementTopBar currentStageIndex={4} completionPct={44} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {/* Header section — Figma 5112:32536 */}
            <section
              aria-label={`${currentStage?.title ?? 'Work'} overview`}
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
                <span className="not-italic text-content-primary block">Work</span>
                <span className="italic text-brand-green block">
                  Where you&rsquo;ve actually been.
                </span>
              </h2>

              <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-5 tracking-[0.2px] text-[#959592] mb-[clamp(8px,0.93vw,16px)] max-w-[500px]">
                Full-time, internship, freelance, national service, apprenticeship — all count. Add
                your roles with dates and impact, and re-order them any time. Even 3 months at a
                small firm beats a blank page.
              </p>

              <div className="flex items-center flex-wrap gap-[10px]">
                {['Not Started', 'Endorsements', '~5 min'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center font-sans font-medium text-[clamp(10px,0.69vw,12px)] leading-4 text-content-helper bg-white rounded-pill px-[10px] py-[4px] border border-brand-green-light-hover whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Section label — Figma 5112:32545 */}
            <div className="flex items-center gap-[8px] px-[clamp(16px,3.125vw,54px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(10px,1.16vw,20px)]">
              <span className="font-sans font-bold text-[10px] leading-4 tracking-[0.08em] text-[#888] uppercase whitespace-nowrap shrink-0">
                WHAT THIS STAGE COVERS
              </span>
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" aria-hidden="true" />
            </div>

            {/* Step cards — Figma 5112:32548 */}
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

          {/* Footer — Figma 5112:32453 */}
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
                  onClick={handleOpenWork}
                  rightIcon={<ArrowRightSmIcon className="size-full" />}
                >
                  Open Work
                </Button>
              </div>
            </div>
          </footer>
        </div>

        <ProfileFillingJourneyPanel
          activeStageId="work-experience"
          showcaseTitle="Work"
          showcaseSubtitle="Where you've been."
          impactValue="Senior"
          impactLabel="role matching unlocked after this stage"
          /* 🔧 DURATION-CONSISTENCY SWEEP (2026-09-09, explicit user
             instruction): was "~8 min", Figma's own right-panel value, which
             contradicted THIS PAGE'S OWN header tag ("~5 min", rendered
             above). Across every profile-filling flow, the intro page's tag
             row is now the single source of truth for that flow's duration
             and is reconciled into the right panel + the stage-2 header tag.
             Deliberate, instructed divergence from Figma. */
          timeValue="~5 min"
        />
      </main>
    </div>
  );
};

export default WorkIntroSection;
