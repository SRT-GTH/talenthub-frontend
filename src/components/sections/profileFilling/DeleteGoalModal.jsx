import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { WorkDeleteWarningIcon, WorkEditPencilIcon, WorkRoleIcon } from '../../shared/assets.jsx';
import {
  ACTIVE_BADGE_STYLE,
  PRIMARY_BADGE_STYLE,
  NEUTRAL_CHIP_STYLE,
  buildGoalSummaryLine,
} from './goalTypeStyles.js';

const log = debug('DeleteGoalModal');

/*
 * DeleteGoalModal — delete-confirm overlay for the Goals stage-2 list page.
 * Source: Figma 5625:92747 ("failed") inside frame 5625:92217, file key
 * Bin8roWL8sloyc36IgFMuT. The whole modal subtree returned in one
 * `get_design_context` call (2026-09-09), so every value below is
 * ✅ VERIFIED unless flagged. Structurally mirrors DeleteCertModal.jsx /
 * DeleteWorkModal.jsx / DeletePortfolioModal.jsx — same Modal `footer` prop
 * usage and top glow.
 *
 * ── Verbatim copy inventory ────────────────────────────────────────────
 *   Header (5625:92769/92773/92774) — 56px delete glyph, "Delete this
 *     Goal?" (26px Instrument Serif, tracking -1px), then "This will
 *     permanently remove the goal  from your profile. Your profile updates
 *     immediately. This cannot be undone."  (Figma's string has a stray
 *     double space after "goal"; HTML collapses whitespace, so it renders
 *     identically either way and is written single-spaced here).
 *   Preview card (5625:92793) — bg #f9ebea, 1px #ebc2bd, rounded-16, a
 *     0 4px 0 rgba(0,0,0,0.07) shelf, 44px rounded-10 rgba(235,241,236,0.5)
 *     tile holding the "laptop" glyph (WorkRoleIcon), 15px bold title, a
 *     12px #70706e summary line, the "●  Active" pill (5625:92805), the
 *     amber "Primary goal · drives your headline match" line (5625:92806,
 *     #c8951a) and the chip row led by the blue "★ Primary" chip
 *     (5625:92809).
 *   Reason rows (5625:92825/92830) — "Removed from your profile
 *     immediately" and "Recruiter matches based on this goal stop
 *     immediately". The second one is genuinely Goals-specific (not a
 *     reused sibling string).
 *   Footer (5625:92751/92757) — "Cancel " (note Figma's trailing space,
 *     dropped here since Button trims visually anyway) + destructive
 *     "Permanently delete this goal" (#c0392b / #ad3327).
 *
 * ── ❓ NEEDS-CLARIFICATION (verbatim, flagged, NOT fixed) ───────────────
 *   The "Edit instead" nudge body (5625:92848) literally reads "Wrong date,
 *   wrong org name, missing credential ID? Editing is faster and keeps
 *   everything intact." — a word-for-word Certs-stage clone (Goals has no
 *   dates, org names or credential IDs). Its heading (5625:92847, "Want to
 *   fix something instead of deleting?") is generic and fine. Reproduced
 *   verbatim per the never-invent-copy rule; a designer should rewrite the
 *   body for Goals.
 *
 * ── Icon policy ────────────────────────────────────────────────────────
 *   `WorkDeleteWarningIcon` covers EVERY delete glyph in this flow (header
 *   badge + footer button) per the user's explicit instruction and lesson
 *   #7's icon-reuse mandate. `WorkEditPencilIcon` is the "20-edit" glyph on
 *   the Edit-Instead button (5625:92852). The preview tile's "laptop" glyph
 *   is `WorkRoleIcon`, the same mapping the Certs/Work flows already use.
 */
const DeleteGoalModal = ({
  isOpen,
  onClose,
  onConfirm,
  onEditInstead,
  goal,
  isPrimary = false,
}) => {
  log('mount', { isOpen, goalId: goal?.id, isPrimary });

  const handleConfirm = () => {
    log('confirm delete', { goalId: goal?.id });
    onConfirm();
    onClose();
  };

  const handleEditInstead = () => {
    log('edit instead → close + open edit modal');
    onClose();
    onEditInstead?.();
  };

  // Chip row — Figma 5625:92807: the blue "★ Primary" chip first (only on
  // the primary goal), then the goal's own neutral chips.
  const neutralChips = goal ? [goal.opportunityType, ...(goal.skills ?? [])].filter(Boolean) : [];

  const footer = (
    <div className="flex items-center justify-end gap-[8px] px-[clamp(24px,3vw,40px)] py-[16px] border-t border-[#e7e7e7]">
      <Button variant="tertiary" size="md" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="danger"
        size="md"
        onClick={handleConfirm}
        leftIcon={<WorkDeleteWarningIcon className="size-full" />}
      >
        Permanently delete this goal
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Delete this goal"
      contentClassName="!rounded-[24px] !max-w-[520px] overflow-hidden"
      footer={footer}
    >
      <div className="relative flex flex-col p-[clamp(24px,3vw,40px)] gap-[17px]">
        {/* Top glow — Figma 5625:92765 is a literal rgba(255,77,77,0.2)
            radial wash behind the header, matching this modal's own
            "Permanently delete" CTA colour family. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-90px] size-[240px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #ff4d4d 0%, transparent 70%)' }}
        />

        <div className="flex flex-col items-center gap-[8px] text-center">
          <WorkDeleteWarningIcon className="size-[56px] text-[#c0392b]" />
          <h2 className="font-display text-[clamp(22px,2.2vw,26px)] tracking-[-1px] leading-[26px] text-[#111]">
            Delete this Goal?
          </h2>
          <p className="font-sans text-[12px] text-[#959592] leading-[19.8px] max-w-[354px]">
            This will permanently remove the goal from your profile. Your profile updates
            immediately. This cannot be undone.
          </p>
        </div>

        {/* Preview of the goal being deleted — Figma 5625:92793 */}
        {goal && (
          <div
            className="flex items-center gap-[16px] rounded-[16px] border border-[#ebc2bd] bg-[#f9ebea] px-[17px] py-[14px]"
            style={{ boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.07)' }}
          >
            <span className="size-[44px] shrink-0 flex items-center justify-center rounded-[10px] bg-[rgba(235,241,236,0.5)]">
              <WorkRoleIcon className="size-5 text-brand-green" />
            </span>
            <div className="flex flex-col gap-[3px] min-w-0 flex-1">
              <span className="font-sans font-bold text-[15px] text-[#111] truncate">
                {goal.industry ? `${goal.role} — ${goal.industry}` : goal.role}
              </span>
              <span className="font-sans text-[12px] text-[#70706e] truncate">
                {buildGoalSummaryLine(goal)}
              </span>

              {/* "●  Active" pill — Figma 5625:92804/92805 */}
              <span
                className="inline-flex items-center self-start rounded-full border px-[9px] py-[3px] font-sans font-semibold text-[8px] whitespace-pre"
                style={{
                  background: ACTIVE_BADGE_STYLE.bg,
                  borderColor: ACTIVE_BADGE_STYLE.border,
                  color: ACTIVE_BADGE_STYLE.text,
                }}
              >
                ●&nbsp; Active
              </span>

              {/* Amber primary-goal line — Figma 5625:92806. Only rendered
                  for the goal that actually IS the primary one (index 0 in
                  the list): the whole flow's copy ties "primary" to the
                  top-priority entry ("Recruiters see your top priority on
                  your summary card", intro card #1). */}
              {isPrimary && (
                <p className="font-sans font-medium text-[12px] text-[#c8951a] leading-[19.8px]">
                  Primary goal · drives your headline match
                </p>
              )}

              <div className="flex items-center flex-wrap gap-[8px] mt-[2px]">
                {isPrimary && (
                  <span
                    className="inline-flex items-center rounded-full h-[22px] px-[10px] font-sans font-semibold text-[10px] border"
                    style={{
                      background: PRIMARY_BADGE_STYLE.bg,
                      borderColor: PRIMARY_BADGE_STYLE.border,
                      color: PRIMARY_BADGE_STYLE.text,
                    }}
                  >
                    ★ Primary
                  </span>
                )}
                {neutralChips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full h-[22px] px-[10px] font-sans font-semibold text-[10px] border"
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
            </div>
          </div>
        )}

        {/* Reason rows — Figma 5625:92823 / 5625:92828, ✅ VERIFIED verbatim */}
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-[10px] h-[35px] rounded-[8px] border border-[#c1d4c4] bg-white px-[12px]">
            <span className="size-[8px] rounded-[4px] bg-[#c0392b] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#575755]">
              Removed from your profile immediately
            </span>
          </div>
          <div className="flex items-center gap-[10px] h-[35px] rounded-[8px] border border-[#c1d4c4] bg-white px-[12px]">
            <span className="size-[8px] rounded-[4px] bg-[#c0392b] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#575755]">
              Recruiter matches based on this goal stop immediately
            </span>
          </div>
        </div>

        {/* "Edit instead?" nudge — Figma 5625:92844. Body copy is a flagged
            Certs clone leftover, see the file-header ❓ block. */}
        <div
          className="flex items-center gap-[16px] rounded-[8px] border border-[#c1d4c4] pl-[10px] pr-[21px] py-[12px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <div className="flex flex-col gap-[4px] flex-1 min-w-0">
            <span className="font-sans font-semibold text-[12px] text-[#2a5730]">
              Want to fix something instead of deleting?
            </span>
            <p className="font-sans text-[10px] text-brand-green leading-[14px] opacity-85">
              Wrong date, wrong org name, missing credential ID? Editing is faster and keeps
              everything intact.
            </p>
          </div>
          <Button
            variant="tertiary"
            size="sm"
            leftIcon={<WorkEditPencilIcon className="size-full" />}
            onClick={handleEditInstead}
            className="shrink-0"
          >
            Edit Instead
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteGoalModal;
