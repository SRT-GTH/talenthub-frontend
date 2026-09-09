import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import AddEditGoalModal from './AddEditGoalModal.jsx';
import DeleteGoalModal from './DeleteGoalModal.jsx';
import GoalSavedModal from './GoalSavedModal.jsx';
import { NEUTRAL_CHIP_STYLE, buildSalarySummary } from './goalTypeStyles.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ArrowLeftIcon,
  ArrowRightSmIcon,
  UploadCertificateIcon,
  WorkRoleIcon,
  WorkDeleteWarningIcon,
  WorkEditPencilIcon,
  GoalSalaryIcon,
} from '../../shared/assets.jsx';

const log = debug('GoalsStage2Section');

/*
 * GoalsStage2Section — full page for /profile/filling/goals/list.
 * Source: Figma 5619:81232 "Goals empty state" (empty) + 5619:81443
 * (populated), file key Bin8roWL8sloyc36IgFMuT. Both frames were dived in
 * full with `get_design_context` (2026-09-09), so every string, colour and
 * measurement below is ✅ VERIFIED unless flagged. Structurally mirrors
 * CertsStage2Section.jsx (single-row card list + inline right aside + full
 * width footer) — this flow does NOT use a shared institution-style right
 * panel component; each stage builds its own small aside inline.
 *
 * ── Canonical vs stale Figma frames (important for future re-verification) ──
 *   The file contains THREE populated Goals list artboards. 5619:81443 is
 *   canonical: it carries the correct onboarding chrome (Switch Modes /
 *   Save & Exit nav) matching the intro + empty-state frames, and its cards
 *   carry exactly four data points (title, salary, three chips, quote).
 *   5622:89666 ("goals") and 5619:82728's own underlying list are OLDER
 *   duplicates — they wear the marketing site's nav (How it works / About /
 *   For Students…), their section header still reads "What pulls you in?"
 *   and their asides still say "📊 Popular in Ghana" / "🌱 Why interests
 *   matter", and their cards carry extra Work-stage fields ("Jan 2024 –
 *   Present", "1yr 7mo", "● Active", SQL/R chips, "↕ Re-order"). Those are
 *   NOT reproduced here; only 5619:81443's card shape is.
 *
 * ── ❓ NEEDS-CLARIFICATION (flagged, not silently invented) ─────────────
 *   1. NO edit/delete affordance appears on any card in the canonical
 *      populated frame (5619:81443) — yet Figma ships a full Edit-Goal
 *      modal (5625:90924) and a Delete-Goal modal (5625:92747), so an entry
 *      point must exist. The 28px edit + delete icon buttons in the card's
 *      top-right corner are carried over from CertsStage2Section /
 *      WorkStage2Section / PortfolioStage2Section (identical styling), NOT
 *      read from a Goals node. Flagged for design confirmation.
 *   2. Drag-to-reorder is described in copy twice (intro card #1 "Drag to
 *      reorder", header subtext "Add multiple goals and drag to set your
 *      priority") and a stale artboard shows a "↕ Re-order" chip, but the
 *      canonical frame has no reorder UI at all. NOT implemented — the
 *      first goal in the list is simply treated as the primary one (which
 *      is what every piece of verified copy actually claims drives the
 *      headline match). Flagged.
 *   3. The empty state's headline glyph is Figma node "certificate-01"
 *      (5659:81364) — a Certs leftover on a Goals screen. Reproduced as
 *      designed via `UploadCertificateIcon`, whose path data is byte-identical
 *      to that node's own SVG asset. Flagged.
 *   4. The empty state's skip line literally reads "No certs yet?? " +
 *      "Skip this stage" (5659:81375) — another Certs leftover, including
 *      the doubled question mark. Reproduced verbatim per the
 *      never-invent-copy rule. Flagged.
 *   5. The footer's back button is literally labelled "Goals"
 *      (5619:81438 / 6686:91420), which reads oddly next to the page's own
 *      "Your goals." header; kept verbatim. Its Next label is
 *      "Next: Pitch →" with the arrow baked into the STRING and no icon
 *      node — rendered here as "Next: Pitch" plus the shared
 *      `ArrowRightSmIcon` so it matches every sibling stage's footer
 *      instead of shipping a literal text arrow.
 *   6. Figma's node id 5659:81360 ("Large empty state") really does use the
 *      5659 page prefix even though every sibling node on the frame is
 *      5619:81xxx — it is NOT a typo, it resolved cleanly.
 */

// ─── Data ─────────────────────────────────────────────────────────────────────

// Figma 5619:81443's five populated cards (5622:89437 / 89473 / 89509 /
// 89545 / 89581) — every field below is ✅ VERIFIED verbatim: title, salary
// line, the blue opportunity-type chip, the location chip, the timeline
// chip and the green quoted description.
//
// ⚠️ Figma is internally inconsistent about the title separator: card 1 is
// "Software Engineer — Fintech" (em dash) while cards 2-5 use " : "
// ("Data Analyst : E-commerce"). `role` and `industry` are stored separately
// and always composed with the em dash so the app renders one consistent
// pattern; the underlying words are Figma's own.
//
// `skills` is intentionally empty on every seed: the Add/Edit modal has a
// "Skills or subjects covered" field whose helper says the values "appear as
// searchable tags on your goal card", but the canonical populated frame
// shows NO skill chips on any card (only the stale 5622:89666 duplicate
// does). Cards therefore render skill chips only when a user actually
// supplies them.
const INITIAL_GOALS = [
  {
    id: 'goal-1',
    role: 'Software Engineer',
    industry: 'Fintech',
    opportunityType: 'Full-time job',
    skills: [],
    location: 'Accra or Remote',
    timeframe: 'Within 6 months',
    salaryMin: '3,000',
    salaryMax: '6,000',
    description: 'Preferably a startup or scale-up. Open to both product and agency side.',
  },
  {
    id: 'goal-2',
    role: 'Data Analyst',
    industry: 'E-commerce',
    opportunityType: 'Full-time job',
    skills: [],
    location: 'Accra or Remote',
    timeframe: 'Within 3 months',
    salaryMin: '2,500',
    salaryMax: '5,000',
    description:
      'Experience with SQL and Python is a plus. Passion for data-driven decision making.',
  },
  {
    id: 'goal-3',
    role: 'UX/UI Designer',
    industry: 'Technology',
    opportunityType: 'Full-time job',
    skills: [],
    location: 'Accra or Remote',
    timeframe: 'Within 4 months',
    salaryMin: '3,500',
    salaryMax: '7,000',
    description: 'Strong portfolio required. Experience with user research and prototyping.',
  },
  {
    id: 'goal-4',
    role: 'Product Manager',
    industry: 'Health Tech',
    opportunityType: 'Full-time job',
    skills: [],
    location: 'Accra',
    timeframe: 'Immediately',
    salaryMin: '4,500',
    salaryMax: '9,000',
    description: 'Must have experience in agile methodologies and stakeholder management.',
  },
  {
    id: 'goal-5',
    role: 'Digital Marketing Specialist',
    industry: 'Startups',
    opportunityType: 'Contract',
    skills: [],
    location: 'Remote',
    timeframe: 'Within 2 months',
    salaryMin: '2,800',
    salaryMax: '5,500',
    description: 'Focus on SEO and content marketing. Background in B2B is advantageous.',
  },
];

// ─── GoalCard ─────────────────────────────────────────────────────────────────
// Figma 5622:89437 (populated) / 5619:81402 (the empty state's "Example of a
// complete goal" reference card) — the two are the SAME node shape, so one
// component covers both. Card spec: white, 1px #e8e8e4, rounded-16,
// 0 4px 0 rgba(0,0,0,0.07) shelf, opacity-85 on the whole card.
const GoalCard = ({ goal, onEdit, onDelete, readOnly = false }) => {
  const salary = buildSalarySummary(goal.salaryMin, goal.salaryMax);
  log('GoalCard render', { id: goal.id, readOnly, hasSalary: Boolean(salary) });

  // Chip row — Figma 5622:89460: blue informative chip (opportunity type)
  // first, then neutral chips for location, timeline and any user-supplied
  // skills.
  const neutralChips = [goal.location, goal.timeframe, ...(goal.skills ?? [])].filter(Boolean);

  return (
    <div
      className="bg-white border border-[#e8e8e4] rounded-[16px] p-[17px] flex flex-col gap-[10px] relative opacity-[0.85]"
      style={{ boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.07)' }}
    >
      {/* ❓ Edit/delete icon buttons — see file-header note #1: this pair is
          NOT in Figma's Goals frames, it's the established sibling-stage
          affordance carried over so the (real) Edit + Delete modals have an
          entry point. Hidden on the empty state's static reference card. */}
      {!readOnly && (
        <div className="absolute right-[14px] top-[14px] flex items-center gap-[6px]">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${goal.role}`}
            className="size-[28px] rounded-[6px] border border-[#e8e8e4] bg-white flex items-center justify-center text-[#555] hover:bg-[#f8f8f4] transition-colors duration-150"
          >
            <WorkEditPencilIcon className="size-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${goal.role}`}
            className="size-[28px] rounded-[6px] border border-[#e8e8e4] bg-white flex items-center justify-center text-[#555] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors duration-150"
          >
            <WorkDeleteWarningIcon className="size-3" />
          </button>
        </div>
      )}

      {/* Figma 5622:89438 — 44px rounded-10 rgba(235,241,236,0.5) tile with
          the "laptop" glyph, vertically centred against the text column. */}
      <div className={`flex items-center gap-[14px] ${readOnly ? '' : 'pr-[70px]'}`}>
        <span className="size-[44px] rounded-[10px] bg-[rgba(235,241,236,0.5)] flex items-center justify-center shrink-0">
          <WorkRoleIcon className="size-5 text-brand-green" />
        </span>

        <div className="flex flex-col gap-[6px] min-w-0 flex-1">
          <div className="flex flex-col gap-[8px] items-start">
            <span className="font-sans font-bold text-[15px] text-[#111]">
              {goal.industry ? `${goal.role} — ${goal.industry}` : goal.role}
            </span>
            {salary && (
              /* Figma 5622:89447 — 12px "money-03" glyph + 12px #70706e text */
              <span className="flex items-start gap-[8px]">
                <GoalSalaryIcon className="size-3 shrink-0 text-brand-green mt-[2px]" />
                <span className="font-sans text-[12px] text-[#70706e]">{salary}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[3px]">
            <div className="flex items-center flex-wrap gap-[8px]">
              {goal.opportunityType && (
                /* Figma 5622:89461 — informative-blue chip */
                <span className="inline-flex items-center h-[22px] px-[10px] rounded-full border border-[#bfcef2] bg-[#eaeffb] font-sans font-semibold text-[10px] text-[#3062d4]">
                  {goal.opportunityType}
                </span>
              )}
              {neutralChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center h-[22px] px-[10px] rounded-full border font-sans font-semibold text-[10px]"
                  style={{
                    background: NEUTRAL_CHIP_STYLE.bg,
                    borderColor: NEUTRAL_CHIP_STYLE.border,
                    color: NEUTRAL_CHIP_STYLE.text,
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
            {goal.description && (
              /* Figma 5622:89471 — the description renders in brand green,
                 wrapped in curly quotes. */
              <p className="font-sans text-[12px] text-brand-green leading-[19.8px]">
                &ldquo;{goal.description}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Right aside ──────────────────────────────────────────────────────────────
// Figma "Aside" 5619:81566 (populated) / 5619:81355 (empty) — identical in
// both frames. Unlike the Certs aside (whose middle card was an
// Interests-stage "📊 Popular in Ghana" clone that had to be replaced), all
// THREE cards here are genuinely Goals-specific and ✅ VERIFIED verbatim.
const GoalsStage2RightAside = ({ goalCount }) => {
  log('aside render', { goalCount });
  return (
    <aside
      className="w-[clamp(240px,19.04vw,329px)] shrink-0 bg-[#f8f8f4] border-l border-[rgba(0,0,0,0.07)] overflow-y-auto [&::-webkit-scrollbar]:hidden"
      aria-label="Goals guidance"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="flex flex-col gap-[22px] p-[clamp(16px,1.5vw,24px)]">
        {/* What counts? — Figma 5619:81357, list items 5619:81362/81365/81368/81371 */}
        <div
          className="rounded-[10px] border border-[#c1d4c4] p-[15px]"
          style={{ background: 'rgba(235,241,236,0.5)', boxShadow: '0px 1px 3px rgba(0,0,0,0.06)' }}
        >
          <p
            className="font-sans font-bold text-[12px] uppercase tracking-[0.6px] mb-[10px]"
            style={{
              backgroundImage: 'linear-gradient(172deg, rgb(20,41,22) 0%, rgb(42,87,48) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            What counts?
          </p>
          <ul className="flex flex-col gap-[8px]">
            {[
              'A specific role or path',
              'Salary range (private)',
              'Location & timeline',
              'One primary goal',
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-[7px] font-sans text-[12px] text-[#716e65] leading-[18px]"
              >
                <span className="font-bold text-brand-green shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Why this matters — Figma 5619:81372/81373/81374 */}
        <div
          className="bg-white border border-[#e8e8e4] rounded-[10px] p-[15px]"
          style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
        >
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.6px] text-[#70706e] mb-[8px]">
            Why this matters
          </p>
          <p className="font-sans text-[12px] text-[#999] leading-[19.2px]">
            Specific goals beat vague ones. &ldquo;Product designer, fintech, Accra, GHS 4k+&rdquo;
            matches far better than &ldquo;open to anything&rdquo;.
          </p>
        </div>

        {/* Recruiter views this week — Figma 5619:81375. Figma's static
            state is 0 views with a 2%-wide bar and the prompt "Set your
            goals to unlock recruiter discovery"; the count/bar/prompt swap
            to a live derived state once goals exist, same convention every
            sibling aside uses (no real analytics backend exists). */}
        <div
          className="bg-white border border-[#e8e8e4] rounded-[16px] p-[16px]"
          style={{ boxShadow: '0px 4px 0px rgba(0,0,0,0.07)' }}
        >
          <p className="font-sans font-bold text-[10px] uppercase tracking-[0.8px] text-[#70706e] mb-[10px]">
            👀 Recruiter views this week
          </p>
          <p className="font-display text-[36px] leading-[36px] text-[#111] mb-[10px]">
            {goalCount > 0 ? Math.min(goalCount * 3, 24) : 0}
          </p>
          <p className="font-sans text-[11px] text-[#70706e] mb-[10px]">
            profile views from recruiters
          </p>
          <div className="h-[6px] rounded-full bg-[#e8e8e4] overflow-hidden mb-[10px]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${goalCount > 0 ? Math.min(goalCount * 20, 100) : 2}%`,
                background: 'linear-gradient(90deg, #3f6212, #84cc16)',
              }}
            />
          </div>
          <p className="font-sans text-[10px] text-[#70706e]">
            {goalCount > 0
              ? 'Recruiters are already discovering your profile.'
              : 'Set your goals to unlock recruiter discovery'}
          </p>
        </div>
      </div>
    </aside>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────────

const GoalsStage2Section = () => {
  log('mount', { route: '/profile/filling/goals/list', stageIndex: 7 });
  const navigate = useNavigate();

  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/goals');
    navigate('/profile/filling/goals');
  };

  const handleNext = () => {
    log('next → /profile/filling/pitch');
    navigate('/profile/filling/pitch');
  };

  const openAddModal = () => {
    log('open add-goal modal');
    setModalMode('add');
    setEditingGoal(null);
    setIsAddEditOpen(true);
  };

  const openEditModal = (goal) => {
    log('open edit-goal modal', { id: goal.id });
    setModalMode('edit');
    setEditingGoal({ ...goal, onDelete: () => setDeletingGoal(goal) });
    setIsAddEditOpen(true);
  };

  const closeAddEditModal = () => {
    setIsAddEditOpen(false);
    setEditingGoal(null);
  };

  const buildGoal = (formData, existing = {}) => ({
    ...existing,
    id: formData.id,
    role: formData.role,
    industry: formData.industry,
    opportunityType: formData.opportunityType,
    skills: formData.skills,
    location: formData.location,
    timeframe: formData.timeframe,
    salaryMin: formData.salaryMin,
    salaryMax: formData.salaryMax,
    description: formData.description,
  });

  const handleSaveGoal = (formData) => {
    if (formData.id) {
      log('update existing goal', { id: formData.id });
      setGoals((prev) => prev.map((g) => (g.id === formData.id ? buildGoal(formData, g) : g)));
    } else {
      const newGoal = buildGoal({ ...formData, id: `goal-${Date.now()}` });
      log('add new goal', { id: newGoal.id });
      setGoals((prev) => [newGoal, ...prev]);
    }
    // GoalSavedModal's copy is a generic "here's what this unlocks"
    // confirmation, not a one-time milestone screen — opens after every
    // successful save (add AND edit), the same rule every other stage in
    // this app already established.
    setIsSavedModalOpen(true);
  };

  const handleDeleteGoal = () => {
    if (!deletingGoal) return;
    log('delete goal', { id: deletingGoal.id });
    setGoals((prev) => prev.filter((g) => g.id !== deletingGoal.id));
    setDeletingGoal(null);
  };

  const handleEditInsteadFromDelete = () => {
    if (!deletingGoal) return;
    openEditModal(deletingGoal);
  };

  const isEmpty = goals.length === 0;
  log('branch: list state', { isEmpty, goalCount: goals.length });

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
        <EngagementTopBar currentStageIndex={7} completionPct={78} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 flex overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              {/* Header — Figma 5619:81341 (empty) / 5622:89365 (populated),
                  identical in both. Unlike Certs, this header needed NO
                  substitution: the headline, subtext, stat card and tags are
                  all genuinely Goals-specific and ✅ VERIFIED verbatim. */}
              <section
                aria-label="Goals — where you want to go"
                className="border-b border-[rgba(0,0,0,0.07)] px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2.31vw,40px)] flex items-start justify-between gap-x-[40px]"
                style={{
                  background: [
                    'radial-gradient(circle at 8% 0%, rgba(56,116,64,0.07) 0%, transparent 55%)',
                    'radial-gradient(circle at 95% 100%, rgba(244,114,182,0.1) 0%, transparent 50%)',
                    '#fff',
                  ].join(', '),
                }}
              >
                <div className="min-w-0">
                  {/* Figma 5619:81342 — mixed style within ONE line: plain
                      "Your goals.  " + italic green "Where do you want to
                      go?" */}
                  <h2 className="font-display text-[clamp(26px,2.89vw,40px)] max-w-[420px] leading-[0.95] tracking-[-1.8px] mb-[clamp(8px,0.93vw,16px)]">
                    <span className="not-italic text-[#111]">Your goals. </span>
                    <span className="italic text-brand-green">Where do you want to go?</span>
                  </h2>
                  {/* Figma 5619:81343 */}
                  <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-[22.4px] text-[#70706e] mb-[clamp(10px,0.93vw,16px)] max-w-[680px]">
                    Tell recruiters exactly what you&rsquo;re looking for — role, industry,
                    location, timeline, salary. Add multiple goals and drag to set your priority.
                    Your top goal drives your primary recruiter match.
                  </p>
                  {/* Figma 5619:81352/81353/81354 — note the third tag is
                      brand-green while the first two are #737373.
                      🔧 DURATION-CONSISTENCY SWEEP (2026-09-09, explicit
                      user instruction): the third tag's VALUE was Figma's
                      own "~3 min", contradicting the Goals intro page's tag
                      ("~7 min", 5619:81203). The intro tag is the single
                      source of truth for the flow's duration; this tag and
                      the intro's right panel are reconciled to it.
                      Deliberate, instructed divergence from Figma. */}
                  <div className="flex items-center flex-wrap gap-[10px]">
                    {[
                      { label: '3 career goals', tone: 'text-[#737373]' },
                      { label: 'Primary drives match', tone: 'text-[#737373]' },
                      { label: '~7 min', tone: 'text-brand-green' },
                    ].map((tag) => (
                      <span
                        key={tag.label}
                        className={`inline-flex items-center font-sans font-semibold text-[clamp(10px,0.69vw,12px)] leading-5 bg-white rounded-full px-[12px] py-[6px] border border-[#e1eae2] whitespace-nowrap ${tag.tone}`}
                        style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* "Why goals matter" stat card — Figma 5619:81344 */}
                <div
                  className="hidden lg:block shrink-0 w-[clamp(360px,28vw,487px)] bg-white border border-[#e8e8e4] rounded-[16px] p-[18px]"
                  style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                >
                  <p className="font-sans font-bold text-[12px] uppercase tracking-[0.6px] text-[#70706e] mb-[10px]">
                    Why goals matter
                  </p>
                  <p className="font-sans text-[12px] text-[#70706e] leading-[19.2px] mb-[14px]">
                    Goals solve the guessing problem — recruiters match you to roles you actually
                    want, not just roles you can do. Your primary goal drives your headline match.
                  </p>
                  <div className="flex items-center gap-[12px]">
                    <span className="size-[46px] shrink-0 rounded-full bg-white border border-[#fef1e7] flex items-center justify-center font-display text-[15px] text-brand-green">
                      78%
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans font-bold text-[13px] text-[#111]">
                        Profile strength
                      </p>
                      <p className="font-sans text-[12px] text-[#959592]">
                        Seven stages done. Goals aim the matching engine.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2vw,32px)]">
                {isEmpty ? (
                  <>
                    {/* Empty state — Figma 5659:81360 "Large empty state",
                        ✅ VERIFIED verbatim copy (see file-header notes #3
                        and #4 for the two Certs leftovers inside it). */}
                    <div
                      className="rounded-[24px] border-2 border-dashed border-brand-green flex flex-col items-center gap-[22px] px-[24px] py-[clamp(32px,4vw,56px)] text-center"
                      style={{ background: 'rgba(235,241,236,0.5)' }}
                    >
                      <div className="flex flex-col items-center gap-[20px]">
                        <div className="flex flex-col items-center gap-[4px]">
                          <UploadCertificateIcon className="size-10 text-brand-green" />
                          <h3 className="font-display text-[clamp(20px,2vw,26px)] text-brand-green mt-[8px]">
                            No goals yet.
                          </h3>
                          <p className="font-sans text-[14px] text-[#70706e] leading-[24.5px] max-w-[622px] mt-[4px]">
                            Add your first career goal below. Even a single goal with a role title,
                            location and timeline immediately improves your recruiter match rate.
                          </p>
                        </div>
                        <div className="flex items-center flex-wrap justify-center gap-[20px]">
                          <Button variant="primary" size="md" onClick={openAddModal}>
                            Add your first goal
                          </Button>
                          <Button variant="tertiary" size="md" onClick={openAddModal}>
                            Add Manually
                          </Button>
                        </div>
                      </div>
                      <p className="font-sans text-[12px] text-[#70706e]">
                        No certs yet??{' '}
                        <button
                          type="button"
                          onClick={handleNext}
                          className="font-semibold text-brand-green underline underline-offset-2"
                        >
                          Skip this stage
                        </button>
                      </p>
                    </div>

                    {/* "Example of a complete goal" — Figma 5619:81400/81401/81402 */}
                    <div className="flex flex-col gap-[12px] mt-[28px]">
                      <p
                        className="font-sans font-semibold text-[13px] capitalize"
                        style={{
                          backgroundImage:
                            'linear-gradient(179deg, rgb(20,41,22) 0%, rgb(42,87,48) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Example of a complete goal
                      </p>
                      <GoalCard goal={INITIAL_GOALS[0]} readOnly />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Populated state — Figma 5619:81594 "Example Container" */}
                    <div className="flex flex-col gap-[12px]">
                      {/* Section label — Figma 5619:81596, ✅ VERIFIED "Your Goals" */}
                      <p
                        className="font-sans font-semibold text-[13px] capitalize"
                        style={{
                          backgroundImage:
                            'linear-gradient(179deg, rgb(20,41,22) 0%, rgb(42,87,48) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Your Goals
                      </p>
                      {goals.map((goal) => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          onEdit={() => openEditModal(goal)}
                          onDelete={() => setDeletingGoal(goal)}
                        />
                      ))}
                    </div>

                    {/* "Add another Goal" — Figma 5619:81757, ✅ VERIFIED
                        verbatim (76px tall, 2px dashed #387440, rounded-16,
                        20px green rounded-10 "+" tile). */}
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="w-full flex items-center justify-center gap-[10px] rounded-[16px] h-[76px] mt-[28px] font-sans font-bold text-[12px] text-brand-green capitalize transition-colors duration-150 hover:bg-[rgba(235,241,236,0.7)]"
                      style={{ background: 'rgba(235,241,236,0.5)', border: '2px dashed #387440' }}
                    >
                      <span className="size-[20px] bg-brand-green rounded-[10px] flex items-center justify-center shrink-0">
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          aria-hidden="true"
                          className="size-3"
                        >
                          <path d="M10 4v12M4 10h12" />
                        </svg>
                      </span>
                      Add another Goal
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <GoalsStage2RightAside goalCount={goals.length} />
        </div>

        {/* Footer — Figma 5619:81434 / 6686:91416. Spans the full viewport
            width, sibling of the row above rather than nested next to the
            aside (same layout note as every sibling stage-2 section). */}
        <footer className="shrink-0 h-[101px] w-full border-t border-[rgba(0,0,0,0.07)] bg-white flex items-center px-[clamp(20px,3.24vw,56px)]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[10px]">
              <span
                aria-hidden="true"
                className="inline-block w-[6px] h-[6px] rounded-[3px] bg-brand-green shrink-0"
              />
              <span className="font-sans text-[12px] leading-5 text-[#babab7]">
                Auto-saved · changes carry to all tabs
              </span>
            </div>

            <div className="flex items-center gap-6">
              {/* ❓ Figma labels this back button literally "Goals" — see
                  file-header note #5. */}
              <Button
                variant="tertiary"
                size="md"
                onClick={handleGoBack}
                leftIcon={<ArrowLeftIcon className="size-full" />}
              >
                Goals
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ArrowRightSmIcon className="size-full" />}
              >
                Next: Pitch
              </Button>
            </div>
          </div>
        </footer>
      </main>

      <AddEditGoalModal
        isOpen={isAddEditOpen}
        onClose={closeAddEditModal}
        onSave={handleSaveGoal}
        mode={modalMode}
        initialData={editingGoal}
      />

      <DeleteGoalModal
        isOpen={Boolean(deletingGoal)}
        onClose={() => setDeletingGoal(null)}
        onConfirm={handleDeleteGoal}
        onEditInstead={handleEditInsteadFromDelete}
        goal={deletingGoal}
        isPrimary={Boolean(deletingGoal) && goals[0]?.id === deletingGoal.id}
      />

      <GoalSavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onContinue={() => {
          setIsSavedModalOpen(false);
          handleNext();
        }}
        goals={goals}
      />
    </div>
  );
};

export default GoalsStage2Section;
