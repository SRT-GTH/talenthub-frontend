import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { CheckIcon, ArrowRightIcon, WorkRoleIcon } from '../../shared/assets.jsx';

const log = debug('PitchPublishedModal');

/*
 * PitchPublishedModal — success overlay shown after publishing the pitch.
 * Source: Figma 6107:122561 "Overlay centred card" inside frame 6107:122172
 * ("09f Pitch — Published (Success)"), file key Bin8roWL8sloyc36IgFMuT. The
 * whole modal subtree returned in one `mcp__figma__get_design_context` call
 * (2026-09-09), so every value below is ✅ VERIFIED unless flagged.
 *
 * Structurally mirrors GoalSavedModal.jsx / CertSavedModal.jsx — same amber
 * top glow, 🏆, mixed-style headline, checklist row, mini-list, profile
 * strength bar, thin pale bar and gold CTA.
 *
 * ── Verbatim copy inventory ────────────────────────────────────────────
 *   Trophy 🏆 (6107:122568), 48px.
 *   Headline (6107:122570) — mixed style, verified per-headline in the raw
 *     dive: plain "Pitch " (#111 Instrument Serif Regular) + italic green
 *     "published." (#387440). 32px, tracking -1.2px, leading 32px.
 *   Subtext (6107:122571) — two lines, reproduced VERBATIM including
 *     Figma's own missing em dash: the string literally reads
 *     "…now see and hear you  not just read about you." (two spaces where a
 *     dash clearly belongs). ⚠️ Flagged for design, not silently "fixed" —
 *     HTML collapses the double space so it renders as a single gap.
 *   Checklist row (6107:122573/122579/122580) — "Your profile is 100%
 *     complete" over the two-line body. Row bg rgba(235,241,236,0.5),
 *     rounded-4, 32px #cce5cc circle with a #2a5730 border + check glyph.
 *   Mini-list rows (6107:122583 / 122595 / 122607) — 56px white rows,
 *     rounded-10, 32px rounded-8 rgba(235,241,236,0.5) tile holding the
 *     "laptop" glyph (`WorkRoleIcon`, the mapping every sibling flow uses),
 *     12px bold title + 10px #70706e meta, right-hand pill.
 *     Row 1's border is rgba(193,212,196,0.2); rows 2-3 use #e8e8e4.
 *     Pills: green "✓ Published" / amber "Anytime" / green "✓ Passed".
 *   Profile-strength bar (6107:122619/122621) — "Profile strength" /
 *     "100% : 9 stages done" (Pitch is stage 9 of 9), #387440→#69da78
 *     gradient on a #f8f8f4/#e8e8e4 track. This is the ONLY success modal
 *     in the app whose Figma bar geometry and label agree (both 100%).
 *   Thin bar above the CTA (6107:122625) — track and fill are the same
 *     #ebf1ec on this instance, so it renders as one flat pale bar.
 *   CTA (6107:122628) — "View your live profile", gold shelf
 *     (#c8951a / #967014) = Button's `secondary` variant, 16px bold text.
 *
 * ── ⚠️ CTA left icon NOT reproduced ────────────────────────────────────
 *   Figma's CTA carries TWO icon slots: a left one Figma names "loader" and
 *   a right "20-arrow-right". The "loader" slot resolves to asset hash
 *   2c75cdc6…svg — byte-identical to the asset the DELETE modal's own
 *   "Permanently delete this pitch" button uses for its trash glyph
 *   (6107:123178). It is the button component's unset default forwardicon
 *   leaking through, not a deliberate icon. Only the right-hand arrow is
 *   rendered here. Flagged for design review.
 *
 * ── Live values vs Figma's static ones ─────────────────────────────────
 *   Figma hard-codes a video pitch ("60-second video pitch" /
 *   "MP4 · 0:54 · 18.4 MB · uploaded securely"). Since this flow can also
 *   publish an uploaded file or a WRITTEN pitch, row 1's title + meta are
 *   driven by the caller's `summary` prop, which composes Figma's own
 *   sentence shape from live state — the same "template, not literal"
 *   convention CertSavedModal / GoalSavedModal already use. Rows 2 and 3
 *   are state-independent copy and stay verbatim.
 *
 * ── Destination ────────────────────────────────────────────────────────
 *   Pitch is the LAST of the 9 stages, so this CTA goes to the engagement
 *   hub (`/profile/engagement`) rather than another filling stage. The
 *   label is Figma's own.
 */

// Figma 6107:122595 / 122607 — the two state-independent mini-list rows.
const STATIC_ROWS = [
  {
    id: 'replace',
    title: 'Replace or edit any time',
    meta: 'Dashboard → Pitch · updates instantly',
    pill: 'Anytime',
    pillStyle: { background: '#faf4e8', borderColor: '#eedeb8', color: '#c8951a' },
  },
  {
    id: 'quality',
    title: 'Quality checks passed',
    meta: 'Audio clear · within 60s · under 100MB',
    pill: '✓ Passed',
    pillStyle: { background: '#ebf1ec', borderColor: '#c1d4c4', color: '#2a5730' },
  },
];

const PitchPublishedModal = ({ isOpen, onClose, onContinue, summary }) => {
  log('mount', { isOpen, hasSummary: Boolean(summary), kind: summary?.kind });

  // Figma 6107:122583 — row 1, the pitch itself. Driven by live state; see
  // the file-header note on templates vs literals.
  const publishedRow = {
    id: 'published',
    title: summary?.title ?? '60-second video pitch',
    meta: summary?.metaLine ?? 'MP4 · 0:54 · 18.4 MB · uploaded securely',
    pill: '✓ Published',
    pillStyle: { background: '#ebf1ec', borderColor: '#c1d4c4', color: '#2a5730' },
    borderColor: 'rgba(193,212,196,0.2)',
  };

  const rows = [publishedRow, ...STATIC_ROWS];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Pitch published"
      contentClassName="!rounded-[24px] !border-3 !border-[#c1d4c4] !max-w-[482px] overflow-hidden"
    >
      <div className="relative flex flex-col items-center gap-[18px] p-[clamp(24px,3vw,40px)] text-center">
        {/* Top glow — Figma 6107:122562 is a literal rgba(245,158,11,0.2)
            radial wash behind the header. Every success modal in this app
            gets this treatment. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-90px] size-[240px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />

        <span className="text-[48px] leading-none" aria-hidden="true">
          🏆
        </span>

        <div className="flex flex-col items-center gap-[6px]">
          {/* Figma 6107:122570 — mixed style, verified per-headline. */}
          <h2 className="font-display text-[clamp(24px,2.4vw,32px)] tracking-[-1.2px] leading-[1.1] text-[#111]">
            Pitch <span className="italic text-[#387440]">published.</span>
          </h2>
          {/* Figma 6107:122571 — verbatim, including the missing em dash. */}
          <p className="font-sans text-[12px] text-[#959592] tracking-[0.2px] leading-[18px] max-w-[400px]">
            Your 60-second pitch is live on your card. Recruiters can now see and hear you not just
            read about you.
          </p>
        </div>

        {/* Checklist row — Figma 6107:122573, ✅ VERIFIED verbatim. */}
        <div
          className="w-full rounded-[4px] px-[10px] py-[14px] flex items-center gap-[24px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <span className="size-8 rounded-full bg-[#cce5cc] border border-[#2a5730] flex items-center justify-center shrink-0">
            <CheckIcon className="size-[18px] text-[#2a5730]" />
          </span>
          <div className="flex flex-col items-start gap-[4px] text-left">
            <span className="font-sans font-semibold text-[14px] text-[#2a5730]">
              Your profile is 100% complete
            </span>
            <p className="font-sans text-[12px] text-[#96a090] leading-[18px]">
              Profiles with a pitch receive 6× more recruiter outreach. Recruiters browsing your
              profile now see your pitch first.
            </p>
          </div>
        </div>

        {/* Mini-list — Figma 6107:122582 */}
        <div className="w-full flex flex-col gap-[5px]">
          {rows.map((row) => {
            log('mini-list row render', { id: row.id });
            return (
              <div
                key={row.id}
                className="flex items-center gap-[10px] min-h-[56px] px-[6px] py-[8px] rounded-[10px] bg-white border"
                style={{ borderColor: row.borderColor ?? '#e8e8e4' }}
              >
                <span className="size-8 shrink-0 rounded-[8px] bg-[rgba(235,241,236,0.5)] flex items-center justify-center">
                  <WorkRoleIcon className="size-4 text-brand-green" />
                </span>
                <div className="flex flex-col items-start min-w-0 flex-1 text-left">
                  <span className="font-sans font-bold text-[12px] text-[#111] truncate w-full">
                    {row.title}
                  </span>
                  <span className="font-sans text-[10px] text-[#70706e] truncate w-full">
                    {row.meta}
                  </span>
                </div>
                <span
                  className="inline-flex items-center shrink-0 rounded-full border px-[8px] py-[3px] font-sans font-semibold text-[10px] whitespace-nowrap"
                  style={row.pillStyle}
                >
                  {row.pill}
                </span>
              </div>
            );
          })}
        </div>

        {/* Profile strength bar — Figma 6107:122619, ✅ VERIFIED
            "100% : 9 stages done". */}
        <div className="w-full flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-[#111]">Profile strength</span>
            <span className="font-sans text-[10px] text-[#2a5730]">100% : 9 stages done</span>
          </div>
          <div className="h-[8px] w-full rounded-[4px] bg-[#f8f8f4] border border-[#e8e8e4] overflow-hidden">
            <div
              className="h-full rounded-[3px]"
              style={{ width: '100%', background: 'linear-gradient(90deg, #387440, #69da78)' }}
            />
          </div>
        </div>

        {/* Thin bar above the CTA — Figma 6107:122625, ✅ VERIFIED: track and
            fill share the same #ebf1ec, so it's one flat pale bar. */}
        <div className="w-full h-[4px] rounded-[4px] bg-[#ebf1ec]" aria-hidden="true" />

        {/* CTA — Figma 6107:122628. Left "loader" icon deliberately dropped,
            see the file-header ⚠️ block. */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onContinue}
          rightIcon={<ArrowRightIcon className="size-full" />}
          className="w-full"
        >
          View your live profile
        </Button>
      </div>
    </Modal>
  );
};

export default PitchPublishedModal;
