import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { WorkDeleteWarningIcon, WorkEditPencilIcon, WorkRoleIcon } from '../../shared/assets.jsx';

const log = debug('DeletePitchModal');

/*
 * DeletePitchModal — delete-confirm overlay for the Pitch stage-2 page.
 * Source: Figma 6107:123168 ("failed") inside frame 6107:122671, file key
 * Bin8roWL8sloyc36IgFMuT. The whole modal subtree returned in one
 * `mcp__figma__get_design_context` call (2026-09-09), so every value below
 * is ✅ VERIFIED unless flagged. Structurally mirrors DeleteGoalModal.jsx /
 * DeleteCertModal.jsx — same Modal `footer` prop usage and top glow.
 *
 * ── Verbatim copy inventory ────────────────────────────────────────────
 *   Header (6107:123191/123194/123195) — 56px delete glyph, "Delete this
 *     Pitch?" (26px Instrument Serif, tracking -1px, leading 26px), then
 *     "This will permanently remove your pitch video from your profile.
 *     Your profile updates immediately. This cannot be undone."
 *   Preview card (6107:123214) — bg #f9ebea, 1px #ebc2bd, rounded-16, a
 *     0 4px 0 rgba(0,0,0,0.07) shelf, 44px rounded-10 rgba(235,241,236,0.5)
 *     tile holding the "laptop" glyph (`WorkRoleIcon`), 15px bold title
 *     (6107:123219), a 12px #70706e file line (6107:123220), the
 *     "●  Live" pill (6107:123225/123226), the amber
 *     "MP4 · 18.4 MB · uploaded securely" line (6107:123227, #c8951a) and a
 *     chip row led by the informative-blue "Preview ↗" chip (6107:123229)
 *     followed by neutral chips (6107:123231/123233/123235/123237).
 *   Reason rows (6107:123244/123249) — "Removed from your card immediately"
 *     and "You lose the 6× recruiter engagement boost". Both are genuinely
 *     Pitch-specific — no cross-stage clone leftovers in this modal, unlike
 *     the Goals delete modal's Certs-flavoured nudge.
 *   Nudge (6107:123268/123269) — "Want to replace it instead of deleting?"
 *     / "Recorded a better take? Replacing is faster and keeps your card
 *     live — the new pitch goes live instantly." + a "Replace Instead"
 *     button (6107:123273).
 *   Footer (6107:123172/123178) — "Cancel " (Figma's trailing space dropped;
 *     Button trims visually anyway) + destructive "Permanently delete this
 *     pitch" (#c0392b / #ad3327).
 *
 * ── Icon policy ────────────────────────────────────────────────────────
 *   `WorkDeleteWarningIcon` covers EVERY delete glyph in this flow (header
 *   badge, footer button, and the stage-2 page's own delete affordance) per
 *   the user's standing icon-consolidation instruction, even though Figma
 *   draws a distinct plain "20-delete" trash can here.
 *   `WorkEditPencilIcon` is Figma's own "20-edit" glyph on Replace Instead.
 *
 * ── Live values vs Figma's static ones ─────────────────────────────────
 *   Figma hard-codes the demo video file. `pitch` is composed from live
 *   state by the caller so a written pitch (which has no MB / MP4 / 0:54)
 *   renders its own chips instead of nonsense. Figma's sentence shapes are
 *   preserved; only the substituted values change.
 */
const DeletePitchModal = ({ isOpen, onClose, onConfirm, onReplaceInstead, pitch }) => {
  log('mount', { isOpen, kind: pitch?.kind });

  const handleConfirm = () => {
    log('confirm delete', { kind: pitch?.kind });
    onConfirm();
    onClose();
  };

  const handleReplaceInstead = () => {
    log('replace instead → close + back to the recorder');
    onClose();
    onReplaceInstead?.();
  };

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
        Permanently delete this pitch
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Delete this pitch"
      contentClassName="!rounded-[24px] !max-w-[520px] overflow-hidden"
      footer={footer}
    >
      <div className="relative flex flex-col p-[clamp(24px,3vw,40px)] gap-[17px]">
        {/* Top glow — Figma 6107:123186 is a literal rgba(255,77,77,0.2)
            radial wash behind the header, matching the destructive CTA. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-90px] size-[240px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #ff4d4d 0%, transparent 70%)' }}
        />

        <div className="flex flex-col items-center gap-[8px] text-center">
          <WorkDeleteWarningIcon className="size-[56px] text-[#c0392b]" />
          <h2 className="font-display text-[clamp(22px,2.2vw,26px)] tracking-[-1px] leading-[26px] text-[#111]">
            Delete this Pitch?
          </h2>
          <p className="font-sans text-[12px] text-[#959592] leading-[19.8px] max-w-[354px]">
            This will permanently remove your pitch video from your profile. Your profile updates
            immediately. This cannot be undone.
          </p>
        </div>

        {/* Preview of the pitch being deleted — Figma 6107:123214 */}
        {pitch && (
          <div
            className="flex items-center gap-[16px] rounded-[16px] border border-[#ebc2bd] bg-[#f9ebea] px-[17px] py-[14px]"
            style={{ boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.07)' }}
          >
            <span className="size-[44px] shrink-0 flex items-center justify-center rounded-[10px] bg-[rgba(235,241,236,0.5)]">
              <WorkRoleIcon className="size-5 text-brand-green" />
            </span>
            <div className="flex flex-col gap-[3px] min-w-0 flex-1">
              <span className="font-sans font-bold text-[15px] text-[#111] truncate">
                {pitch.title}
              </span>
              <span className="font-sans text-[12px] text-[#70706e] truncate">
                {pitch.fileLine}
              </span>

              {/* "●  Live" pill — Figma 6107:123225/123226 */}
              <span
                className="inline-flex items-center self-start rounded-full border border-[#c1d4c4] bg-[#ebf1ec] px-[9px] py-[3px] font-sans font-semibold text-[8px] text-[#2a5730] whitespace-pre"
                style={{ letterSpacing: 0 }}
              >
                ●&nbsp; Live
              </span>

              {/* Amber detail line — Figma 6107:123227 */}
              {pitch.detailLine && (
                <p className="font-sans font-medium text-[12px] text-[#c8951a] leading-[19.8px]">
                  {pitch.detailLine}
                </p>
              )}

              <div className="flex items-center flex-wrap gap-[8px] mt-[2px]">
                {/* Informative-blue "Preview ↗" chip — Figma 6107:123229.
                    Static in Figma (no target); wired to the page's own
                    preview handler so it does something real. */}
                <button
                  type="button"
                  onClick={() => {
                    log('preview chip clicked (mock — no real media attached)');
                    pitch.onPreview?.();
                  }}
                  className="inline-flex items-center h-[22px] px-[10px] rounded-full border border-[#bfcef2] bg-[#eaeffb] font-sans font-semibold text-[10px] text-[#3062d4] cursor-pointer transition-colors duration-150 hover:bg-[#dde6f8]"
                >
                  Preview ↗
                </button>
                {(pitch.chips ?? []).map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center h-[22px] px-[10px] rounded-full border border-[#e8e8e4] bg-[#f8f8f4] font-sans font-semibold text-[10px] text-[#70706e]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reason rows — Figma 6107:123244 / 123249, ✅ VERIFIED verbatim */}
        <div className="flex flex-col gap-[10px]">
          {['Removed from your card immediately', 'You lose the 6× recruiter engagement boost'].map(
            (reason) => (
              <div
                key={reason}
                className="flex items-center gap-[10px] h-[35px] rounded-[8px] border border-[#c1d4c4] bg-white px-[12px]"
              >
                <span
                  className="size-[8px] rounded-[4px] bg-[#c0392b] shrink-0"
                  aria-hidden="true"
                />
                <span className="font-sans text-[12px] text-[#575755]">{reason}</span>
              </div>
            )
          )}
        </div>

        {/* "Replace instead?" nudge — Figma 6107:123265 */}
        <div
          className="flex items-center gap-[16px] rounded-[8px] border border-[#c1d4c4] pl-[10px] pr-[21px] py-[12px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <div className="flex flex-col gap-[4px] flex-1 min-w-0">
            <span className="font-sans font-semibold text-[12px] text-[#2a5730]">
              Want to replace it instead of deleting?
            </span>
            <p className="font-sans text-[10px] text-brand-green leading-[14px] opacity-85">
              Recorded a better take? Replacing is faster and keeps your card live — the new pitch
              goes live instantly.
            </p>
          </div>
          <Button
            variant="tertiary"
            size="sm"
            leftIcon={<WorkEditPencilIcon className="size-full" />}
            onClick={handleReplaceInstead}
            className="shrink-0"
          >
            Replace Instead
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePitchModal;
