import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { CheckIcon, ArrowRightIcon, WorkRoleIcon } from '../../shared/assets.jsx';
import { PRIMARY_BADGE_STYLE, buildGoalSummaryLine } from './goalTypeStyles.js';

const log = debug('GoalSavedModal');

/*
 * GoalSavedModal — success overlay shown after saving a goal (add OR edit).
 * Source: Figma 5619:83053 "Overlay centred card" inside frame 5619:82728
 * ("Goals-Success"), file key Bin8roWL8sloyc36IgFMuT. The whole modal
 * subtree came back in one `get_design_context` call (2026-09-09), so every
 * value below is ✅ VERIFIED unless flagged.
 *
 * Structurally mirrors CertSavedModal.jsx / WorkSavedModal.jsx /
 * PortfolioSavedModal.jsx — same "opens after every successful save (add
 * AND edit)" rule this app established for every other stage.
 *
 * ── Verbatim copy inventory ────────────────────────────────────────────
 *   Trophy emoji 🏆 (5619:83060), 48px.
 *   Headline (5619:83062) — mixed style: plain "Goals " + italic green
 *     "complete." (#387440). 32px Instrument Serif, tracking -1.2px.
 *   Stat line (5619:83063) — "3 career goals, prioritised. Recruiters can
 *     now match you by role, industry, location and timeline." Kept as a
 *     TEMPLATE: the sentence structure is reproduced with the live count
 *     substituted for Figma's static "3", same convention CertSavedModal
 *     uses.
 *   Checklist row (5619:83071/83072) — "Goal-matched search active" /
 *     "Recruiters filtering for your target role, industry and location
 *     will now see your profile. Your primary goal drives your headline
 *     match."  Row bg rgba(235,241,236,0.5), 32px #cce5cc circle with a
 *     #2a5730 border and check glyph.
 *   Mini goal-list rows (5619:83075/83087/83099) — 56px white rows,
 *     rounded-10, with a 32px rounded-8 rgba(235,241,236,0.5) tile holding
 *     the "laptop" glyph (WorkRoleIcon, the same mapping every sibling
 *     flow uses), 12px bold title + 10px #70706e summary line.
 *   Profile-strength bar (5619:83112/83113) — "Profile strength" /
 *     "78% : 8 stages done" (Goals is stage 8 of 9), #387440→#69da78
 *     gradient on a #f8f8f4/#e8e8e4 track. Kept static like every sibling
 *     success modal — no real cross-stage completion tracking exists.
 *   Thin bar above the CTA (5619:83117) — Figma's track and fill are the
 *     same colour (#ebf1ec) on this instance, so it renders as one flat
 *     pale bar; reproduced as-is rather than inventing a percentage.
 *   CTA (5619:83120) — "Continue to Pitch stage", gold shelf (#c8951a /
 *     #967014), which is exactly Button's `secondary` variant.
 *
 * ── ❓ NEEDS-CLARIFICATION: the mini-list's right-hand badge ────────────
 *   Figma renders "✓ Verified" (green) on rows 1 and 3 and "Self-reported"
 *   (amber) on row 2 — verbatim Certs-stage badges. Goals has NO
 *   verification concept anywhere else in the flow: no field, chip, aside
 *   item, or delete-modal row references verified/self-reported, and there
 *   is no rule that could decide which goal earns which badge.
 *   Resolution (same shape as every other clone-leftover resolution in this
 *   flow): the leftover badge is NOT reproduced. Instead the row for the
 *   PRIMARY goal (index 0) carries the "★ Primary" chip — a real,
 *   Goals-specific, ✅ VERIFIED badge lifted from the delete modal's own
 *   preview card (5625:92808/92809) whose meaning the rest of this flow
 *   actually supports ("Primary goal · drives your headline match",
 *   5625:92806). Flagged for design review.
 */
const GoalSavedModal = ({ isOpen, onClose, onContinue, goals = [] }) => {
  const goalCount = goals.length;
  const previewGoals = goals.slice(0, 3);

  log('mount', { isOpen, goalCount, previewCount: previewGoals.length });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Goals saved"
      contentClassName="!rounded-[24px] !border-3 !border-[#c1d4c4] !max-w-[482px] overflow-hidden"
    >
      <div className="relative flex flex-col items-center gap-[18px] p-[clamp(24px,3vw,40px)] text-center">
        {/* Top glow — Figma 5619:83054 is a literal
            rgba(245,158,11,0.2) radial wash behind the header, i.e. the
            same amber family as the CTA below. Every success modal in this
            app gets this treatment. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-90px] size-[240px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />

        <span className="text-[48px] leading-none" aria-hidden="true">
          🏆
        </span>

        <div className="flex flex-col items-center gap-[6px]">
          <h2 className="font-display text-[clamp(24px,2.4vw,32px)] tracking-[-1.2px] leading-[1.1] text-[#111]">
            Goals <span className="italic text-[#387440]">complete.</span>
          </h2>
          <p className="font-sans text-[12px] text-[#959592] tracking-[0.2px] leading-[18px] max-w-[400px]">
            {goalCount} career goal{goalCount !== 1 ? 's' : ''}, prioritised. Recruiters can now
            match you by role, industry, location and timeline.
          </p>
        </div>

        {/* Checklist row — Figma 5619:83065, ✅ VERIFIED verbatim. */}
        <div
          className="w-full rounded-[4px] px-[10px] py-[14px] flex items-center gap-[24px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <span className="size-8 rounded-full bg-[#cce5cc] border border-[#2a5730] flex items-center justify-center shrink-0">
            <CheckIcon className="size-[18px] text-[#2a5730]" />
          </span>
          <div className="flex flex-col items-start gap-[4px] text-left">
            <span className="font-sans font-semibold text-[14px] text-[#2a5730]">
              Goal-matched search active
            </span>
            <p className="font-sans text-[12px] text-[#96a090] leading-[18px]">
              Recruiters filtering for your target role, industry and location will now see your
              profile. Your primary goal drives your headline match.
            </p>
          </div>
        </div>

        {/* Mini goal-list preview — Figma 5619:83074. See the file-header
            ❓ block for why the "✓ Verified / Self-reported" badges are
            replaced by the Goals-native "★ Primary" chip. */}
        {previewGoals.length > 0 && (
          <div className="w-full flex flex-col gap-[5px]">
            {previewGoals.map((goal, index) => {
              const isPrimary = index === 0;
              log('preview row render', { id: goal.id, isPrimary });
              return (
                <div
                  key={goal.id}
                  className="flex items-center gap-[10px] h-[56px] px-[6px] rounded-[10px] border border-[#e8e8e4] bg-white"
                >
                  <span className="size-8 shrink-0 rounded-[8px] bg-[rgba(235,241,236,0.5)] flex items-center justify-center">
                    <WorkRoleIcon className="size-4 text-brand-green" />
                  </span>
                  <div className="flex items-center gap-[10px] flex-1 min-w-0 pr-[8px]">
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className="font-sans font-bold text-[12px] text-[#111] truncate w-full text-left">
                        {goal.industry ? `${goal.role} — ${goal.industry}` : goal.role}
                      </span>
                      <span className="font-sans text-[10px] text-[#70706e] truncate w-full text-left">
                        {buildGoalSummaryLine(goal)}
                      </span>
                    </div>
                    {isPrimary && (
                      <span
                        className="inline-flex items-center shrink-0 rounded-full border px-[8px] py-[3px] font-sans font-semibold text-[10px]"
                        style={{
                          background: PRIMARY_BADGE_STYLE.bg,
                          borderColor: PRIMARY_BADGE_STYLE.border,
                          color: PRIMARY_BADGE_STYLE.text,
                        }}
                      >
                        ★ Primary
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Profile strength bar — Figma 5619:83111, ✅ VERIFIED static value
            "78% : 8 stages done" (Goals is stage 8 of 9). */}
        <div className="w-full flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-[#111]">Profile strength</span>
            <span className="font-sans text-[10px] text-[#2a5730]">78% : 8 stages done</span>
          </div>
          <div className="h-[8px] w-full rounded-[4px] bg-[#f8f8f4] border border-[#e8e8e4] overflow-hidden">
            <div
              className="h-full rounded-[3px]"
              // ⚠️ Figma's own fill geometry on 5619:83115 measures ~71%
              // while its label right next to it reads "78%". The label
              // wins here so the bar and its caption agree (same choice
              // CertSavedModal made for its own 72% bar).
              style={{ width: '78%', background: 'linear-gradient(90deg, #387440, #69da78)' }}
            />
          </div>
        </div>

        {/* Thin bar above the CTA — Figma 5619:83117, ✅ VERIFIED: track and
            fill share the exact same colour on this instance, so it's one
            flat pale bar, not a visible progress segment. */}
        <div className="w-full h-[4px] rounded-[4px] bg-[#ebf1ec]" aria-hidden="true" />

        <Button
          variant="secondary"
          size="lg"
          onClick={onContinue}
          rightIcon={<ArrowRightIcon className="size-full" />}
          className="w-full"
        >
          Continue to Pitch stage
        </Button>
      </div>
    </Modal>
  );
};

export default GoalSavedModal;
