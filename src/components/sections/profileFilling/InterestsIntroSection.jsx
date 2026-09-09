import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import ProfileFillingJourneyPanel from './ProfileFillingJourneyPanel.jsx';

const log = debug('InterestsIntroSection');

/*
 * InterestsIntroSection — full page shell for /profile/filling/interests.
 * Source: Figma frame 3530:35614 ("interests(intro page(optional))").
 *
 * Layout (h-screen, overflow-hidden, flex-col):
 *   ┌─ EngagementTopNav  (bg-neutral, clamp 64–90px tall)
 *   ├─ EngagementTopBar  (currentStageIndex=1 Interests, clamp 60–77px)
 *   └─ main (flex-1, flex-row)
 *       ├─ LEFT COLUMN (flex-1, flex-col)
 *       │   ├─ Header section (clamp 160–240px, gradient bg + headline + tags)
 *       │   ├─ Scrollable content (section label + 5 step cards)
 *       │   └─ Footer (h-142px, auto-saved + Go back / Open Interests)
 *       └─ RIGHT PANEL (clamp 240–329px, dark-green gradient + journey cards)
 *
 * Right panel node: Figma 3531:46485.
 * Header node:      Figma 3531:47134.
 * Step cards node:  Figma 3531:47225.
 * Footer node:      Figma 3530:36694.
 */

// ─── Inline SVG icons ────────────────────────────────────────────────────────

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

// Footer "Open Interests" right arrow.
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

// Figma 3531:47225 — "WHAT THIS STAGE COVERS" step cards (verbatim from Figma).
// Note: cards 3 & 4 both carry the label "3" and share the same body in Figma.
const STAGE_CARDS = [
  {
    num: '1',
    title: 'Broad categories',
    body: 'Pick 2–6 areas that genuinely describe you. Technology · Business · Creative Arts · Health Sciences · Education · Agriculture · Law · Engineering · Media.',
  },
  {
    num: '2',
    title: 'Specific interests',
    body: 'Add specifics inside each broad category. E.g. inside Technology: "UI/UX design", "Machine learning", "Data pipelines", "Mobile development".',
  },
  {
    num: '3',
    title: 'How the matching works',
    body: "Categories feed role matching first. Specifics unlock mentor matching — you're surfaced to senior professionals with the exact same niche.",
  },
  {
    num: '3',
    title: 'Multi-entry, no limit',
    body: "Categories feed role matching first. Specifics unlock mentor matching — you're surfaced to senior professionals with the exact same niche.",
  },
  {
    num: '4',
    title: 'Multi-entry, no limit',
    body: 'Add as many interests as genuinely describe you. The algorithm distinguishes signal from noise — specificity beats quantity.',
  },
];

// ─── Main section ─────────────────────────────────────────────────────────────
const InterestsIntroSection = () => {
  log('mount', { stage: 'personal-interests', stageIndex: 1 });
  const navigate = useNavigate();

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → avatar');
    navigate('/profile/engagement/avatar');
  };

  const handleOpenInterests = () => {
    log('open interests → /profile/filling/interests/categories');
    navigate('/profile/filling/interests/categories');
  };

  const currentStage = PROFILE_STAGES[1]; // personal-interests

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* ── Top nav — bg-neutral per Figma 3530:35666 ── */}
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch">
        <EngagementTopNav
          bgClass="bg-neutral"
          onSaveExit={handleSaveExit}
          showSwitchModes={false}
          className="w-full h-full"
        />
      </div>

      {/* ── Stage trail bar — Interests (index 1) is active ── */}
      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch">
        <EngagementTopBar currentStageIndex={1} completionPct={0} className="w-full h-full" />
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 min-h-0 overflow-hidden flex">
        {/* ── Left content column ── */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Scrollable content area — header + section label + step cards all scroll together */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {/* Header section — Figma 3531:47134 */}
            <section
              aria-label={`${currentStage?.title ?? 'Interests'} overview`}
              className="border-b border-[rgba(0,0,0,0.07)] flex flex-col justify-center px-[clamp(20px,3.24vw,56px)] py-[clamp(24px,2.78vw,48px)] relative"
              style={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(56,116,64,0.07) 0%, transparent 55%)',
                  'radial-gradient(circle at 100% 100%, rgba(244,114,182,0.1) 0%, transparent 55%)',
                  '#fff',
                ].join(', '),
              }}
            >
              {/* Mixed-style headline */}
              <h2 className="font-display text-[clamp(22px,2.55vw,44px)] leading-[0.92] tracking-[-2px] mb-[clamp(8px,0.93vw,16px)]">
                <span className="not-italic text-content-primary block">Interest</span>
                <span className="italic text-brand-green block">What actually pulls you in.</span>
              </h2>

              {/* Subtitle */}
              <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-5 tracking-[0.2px] text-[#959592] mb-[clamp(8px,0.93vw,16px)] max-w-[798px]">
                Pick broad categories first — this anchors your profile in the matching engine. Your
                choices feed the role-matching algorithm directly, and your specific interests
                surface you to mentors who share your niche.
              </p>

              {/* Tags row */}
              <div className="flex items-center flex-wrap gap-[10px]">
                <span className="inline-flex items-center font-sans font-medium text-[clamp(10px,0.69vw,12px)] leading-4 text-white bg-accent rounded-pill px-[10px] py-[4px] border-2 border-accent-light-active whitespace-nowrap">
                  In progress
                </span>
                {[
                  '4 specific interests',
                  'Matching engine',
                  '3 categories added',
                  'Mentor matching',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center font-sans font-medium text-[clamp(10px,0.69vw,12px)] leading-4 text-content-helper bg-white rounded-pill px-[10px] py-[4px] border border-brand-green-light-hover whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Section label — Figma 3531:47156 */}
            <div className="flex items-center gap-[8px] px-[clamp(16px,3.125vw,54px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(10px,1.16vw,20px)]">
              <span className="font-sans font-bold text-[10px] leading-4 tracking-[0.08em] text-[#888] uppercase whitespace-nowrap shrink-0">
                WHAT THIS STAGE COVERS
              </span>
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" aria-hidden="true" />
            </div>

            {/* Step cards — Figma 3531:47225 */}
            <div className="flex flex-col gap-[8px] px-[clamp(16px,3.125vw,54px)] pb-[clamp(16px,2vw,32px)]">
              {STAGE_CARDS.map((card, index) => (
                <div
                  key={`card-${index}`}
                  className="flex items-center gap-[clamp(10px,1.39vw,24px)] bg-white border border-[#e8e8e4] rounded-[12px] h-[clamp(64px,4.92vw,85px)] px-[clamp(10px,0.87vw,15px)] shrink-0"
                  style={{ boxShadow: '0px 4px 0px rgba(0,0,0,0.06)' }}
                >
                  {/* Green badge with step number */}
                  <div className="size-[26px] rounded-[13px] bg-brand-green flex items-center justify-center shrink-0">
                    <span className="font-mono text-[11px] font-medium text-white leading-none select-none">
                      {card.num}
                    </span>
                  </div>
                  {/* Card text */}
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

          {/* Footer — Figma 3530:36694, h-142px */}
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
                  onClick={handleOpenInterests}
                  rightIcon={<ArrowRightIcon className="size-full" />}
                >
                  Open Interests
                </Button>
              </div>
            </div>
          </footer>
        </div>

        {/* ── Right panel ── */}
        <ProfileFillingJourneyPanel
          activeStageId="personal-interests"
          showcaseTitle="Interests"
          showcaseSubtitle="What actually pulls you in."
          impactValue="3+"
          impactLabel="role matches unlocked from interests alone"
          timeValue="~4 min"
        />
      </main>
    </div>
  );
};

export default InterestsIntroSection;
