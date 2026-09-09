import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { CheckIcon, ArrowRightIcon, WorkRoleIcon } from '../../shared/assets.jsx';
import {
  VERIFIED_BADGE_STYLE,
  SELF_REPORTED_BADGE_STYLE,
  buildDateSummary,
} from './certTypeStyles.js';

const log = debug('CertSavedModal');

/*
 * CertSavedModal — success overlay shown after saving a certification (add
 * OR edit). Restyled 2026-09-09 via a real get_design_context dive on the
 * full modal tree (root 5248:169003 "Overlay centred card"), superseding an
 * earlier get_metadata-only pass. File key Bin8roWL8sloyc36IgFMuT.
 * Structurally mirrors WorkSavedModal.jsx / PortfolioSavedModal.jsx — same
 * "opens after every successful save (add AND edit)" rule.
 *
 * Real, ✅ VERIFIED content from the dive:
 *   Headline (5248:169012) is plain, single-style "Certifications complete."
 *   — text-[#111], NOT the italic-green-suffix split the earlier pass
 *   guessed (that pattern doesn't apply to this modal's headline).
 *
 *   Stat line (5248:169013) genuinely Certs-specific, kept as a TEMPLATE:
 *   "5 certifications added. 4 verified, 1 self-reported. Your credential
 *   layer is live on GTH." — this modal reproduces the sentence structure
 *   but substitutes live counts computed from the `certs` array instead of
 *   Figma's static demo numbers.
 *
 *   Checklist row (5248:169015) — headline "Credential filter unlocked in
 *   recruiter search" (no "Verified-" prefix) / "Recruiters can now filter
 *   for specific certifications. Your verified cert badges appear on your
 *   recruiter card." — both corrected from an earlier invented pass.
 *
 *   Mini cert-list preview (5248:169025/169035/169047) — a 32px
 *   `rounded-[8px]` icon TILE (bg rgba(235,241,236,0.5), WorkRoleIcon laptop
 *   glyph — not a full-row-height colour strip, and not `CertificateIcon`;
 *   same two corrections already made to the main list's CertCard and
 *   DeleteCertModal, see CertsStage2Section.jsx's file header) inline at the
 *   left of a 56px white row. The dive also gave real verified/self-reported
 *   badge colours, now baked into certTypeStyles.js's shared constants.
 *
 *   Profile-strength bar (5248:169057): "72% : 7 stages done" — Figma's own
 *   literal static demo value for this specific modal (Certs is stage 7 of
 *   9), replacing an earlier "52% : 4 stages done" carried over by mistake
 *   from a sibling modal's dive. Kept static like WorkSavedModal /
 *   PortfolioSavedModal — no real cross-stage completion tracking exists.
 *
 *   Thin bar above the CTA (5248:169063, "Progress bar" + its nested
 *   "Progress Bars" instance) — Figma's own track and fill are the exact
 *   same colour (#ebf1ec) on this instance, so it renders as one flat pale
 *   bar with no visible segment; reproduced as-is rather than inventing a
 *   percentage the design doesn't actually show.
 *
 *   CTA button (5248:169066) — `Button` `secondary` variant already matches
 *   Figma's gold shelf (#c8951a) exactly (see Button.jsx's own header
 *   comment). Figma adds a small decorative glyph before the label too
 *   (data-name "forwardicons", an externally-hosted Figma asset this dive
 *   can't resolve to an exact shape) — approximated with the already-
 *   imported `CheckIcon` as a thematically-consistent "done" accent, flagged
 *   for design review once the real glyph can be inspected directly in
 *   Figma.
 */
const CertSavedModal = ({ isOpen, onClose, onContinue, certs = [] }) => {
  const certCount = certs.length;
  const verifiedCount = certs.filter((c) => c.credentialId?.trim() || c.badgeUrl?.trim()).length;
  const selfReportedCount = certCount - verifiedCount;
  const previewCerts = certs.slice(0, 3);

  log('mount', { isOpen, certCount, verifiedCount, selfReportedCount });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Certifications saved"
      contentClassName="!rounded-[24px] !border-3 !border-[#c1d4c4] !max-w-[482px] overflow-hidden"
    >
      <div className="relative flex flex-col items-center gap-[18px] p-[clamp(24px,3vw,40px)] text-center">
        {/* Top glow — same colour as the CTA button below (Button `secondary`
            variant, #c8951a). Every success modal gets this treatment. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-90px] size-[240px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #c8951a 0%, transparent 70%)' }}
        />

        <span className="text-[48px] leading-none" aria-hidden="true">
          🏆
        </span>

        <div className="flex flex-col items-center gap-[6px]">
          <h2 className="font-display text-[clamp(24px,2.4vw,32px)] tracking-[-1.2px] leading-[1.1] text-[#111]">
            Certifications complete.
          </h2>
          <p className="font-sans text-[13px] text-[#70706e] leading-[1.5] max-w-[380px]">
            {certCount} certification{certCount !== 1 ? 's' : ''} added. {verifiedCount} verified,{' '}
            {selfReportedCount} self-reported. Your credential layer is live on GTH.
          </p>
        </div>

        {/* Checklist row — Figma 5248:169015, ✅ VERIFIED verbatim. */}
        <div
          className="w-full rounded-[4px] px-[10px] py-[14px] flex items-center gap-[10px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <span className="size-8 rounded-full bg-[#cce5cc] border border-[#2a5730] flex items-center justify-center shrink-0">
            <CheckIcon className="size-[18px] text-[#2a5730]" />
          </span>
          <div className="flex flex-col items-start gap-[4px] text-left">
            <span className="font-sans font-semibold text-[14px] text-[#2a5730]">
              Credential filter unlocked in recruiter search
            </span>
            <p className="font-sans text-[12px] text-[#96a090] leading-[18px]">
              Recruiters can now filter for specific certifications. Your verified cert badges
              appear on your recruiter card.
            </p>
          </div>
        </div>

        {/* Mini cert-list preview — Figma 5248:169025/169035/169047,
            ✅ VERIFIED: a 32px icon TILE inline at the left of a 56px row
            (not a full-row-height strip), WorkRoleIcon laptop glyph. */}
        {previewCerts.length > 0 && (
          <div className="w-full flex flex-col gap-[5px]">
            {previewCerts.map((c) => {
              const isVerified = Boolean(c.credentialId?.trim() || c.badgeUrl?.trim());
              const badgeStyle = isVerified ? VERIFIED_BADGE_STYLE : SELF_REPORTED_BADGE_STYLE;
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-[10px] h-[56px] px-[7px] rounded-[10px] border border-[#e8e8e4] bg-white"
                >
                  <span className="size-8 shrink-0 rounded-[8px] bg-[rgba(235,241,236,0.5)] flex items-center justify-center">
                    <WorkRoleIcon className="size-4 text-brand-green" />
                  </span>
                  <div className="flex items-center gap-[10px] flex-1 min-w-0 pr-[9px]">
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className="font-sans font-bold text-[12px] text-[#111] truncate">
                        {c.name}
                      </span>
                      <span className="font-sans text-[10px] text-[#70706e] truncate">
                        {c.issuer} · {buildDateSummary(c.dateIssued, c.doesNotExpire, c.expiryDate)}
                      </span>
                    </div>
                    <span
                      className="inline-flex items-center shrink-0 rounded-full border px-[8px] py-[3px] font-sans font-semibold text-[10px]"
                      style={{
                        background: badgeStyle.bg,
                        borderColor: badgeStyle.border,
                        color: badgeStyle.text,
                      }}
                    >
                      {isVerified ? '✓ Verified' : 'Self-reported'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Profile strength progress bar — Figma 5248:169057, ✅ VERIFIED
            static value "72% : 7 stages done" (Certs is stage 7 of 9). */}
        <div className="w-full flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-[#111]">Profile strength</span>
            <span className="font-sans text-[10px] text-[#2a5730]">72% : 7 stages done</span>
          </div>
          <div className="h-[8px] w-full rounded-[4px] bg-[#f8f8f4] border border-[#e8e8e4] overflow-hidden">
            <div
              className="h-full rounded-[3px]"
              style={{ width: '72%', background: 'linear-gradient(90deg, #387440, #69da78)' }}
            />
          </div>
        </div>

        {/* Thin bar above the CTA — Figma 5248:169063, ✅ VERIFIED: track and
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
          Continue to Goals stage
        </Button>
      </div>
    </Modal>
  );
};

export default CertSavedModal;
