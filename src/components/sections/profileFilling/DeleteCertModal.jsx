import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { WorkDeleteWarningIcon, WorkEditPencilIcon, WorkRoleIcon } from '../../shared/assets.jsx';
import {
  VERIFIED_BADGE_STYLE,
  SELF_REPORTED_BADGE_STYLE,
  buildDateSummary,
} from './certTypeStyles.js';

const log = debug('DeleteCertModal');

/*
 * DeleteCertModal — delete-confirm overlay for the Certifications stage-2
 * list page. Source: Figma frame 5246:168408 ("failed"), header content
 * 5246:168430, preview card 5246:168452, reason rows 5246:168471/168477,
 * "Edit instead" nudge 5246:168492. File key Bin8roWL8sloyc36IgFMuT.
 * Structurally mirrors DeleteWorkModal.jsx / DeletePortfolioModal.jsx — same
 * Modal `footer` prop usage and top glow (lesson carried across this
 * session, see those files' own header comments).
 *
 * Unlike the Add/Edit modal and the success modal, this delete modal's own
 * copy came back ✅ VERIFIED and genuinely Certs-specific (no clone
 * artifacts) via get_metadata (2026-09-08):
 *   - Headline "Delete this certification?" and description "This will
 *     permanently remove the certification from your profile. Your profile
 *     updates immediately. This cannot be undone." (5246:168434/168435).
 *   - Reason rows "Removed from your profile immediately" AND "Skills
 *     evidence linked to this cert is removed" (5246:168474/168479) — the
 *     second one is Certs-specific, not Work's reused "Profile strength may
 *     decrease".
 *   - "Edit instead" nudge: "Want to fix something instead of deleting?" /
 *     "Wrong date, wrong org name, missing credential ID? Editing is faster
 *     and keeps everything intact." (5246:168496/168497).
 *
 * `WorkDeleteWarningIcon` covers every literal delete-glyph usage (header
 * badge, footer button) per lesson #7's icon-reuse mandate. The preview
 * card's own icon tile is `WorkRoleIcon` (a laptop glyph) — corrected
 * 2026-09-09 via a real get_design_context dive on 5246:168454; an earlier
 * pass guessed `CertificateIcon` here, same mistake as the main list's own
 * CertCard (see CertsStage2Section.jsx's file header for the full story).
 */
const DeleteCertModal = ({ isOpen, onClose, onConfirm, onEditInstead, cert }) => {
  log('mount', { isOpen, certId: cert?.id });

  const handleConfirm = () => {
    log('confirm delete', { certId: cert?.id });
    onConfirm();
    onClose();
  };

  const handleEditInstead = () => {
    log('edit instead → close + open edit modal');
    onClose();
    onEditInstead?.();
  };

  const isVerified = cert ? Boolean(cert.credentialId?.trim() || cert.badgeUrl?.trim()) : false;
  const badgeStyle = isVerified ? VERIFIED_BADGE_STYLE : SELF_REPORTED_BADGE_STYLE;

  const linkTags = cert ? [cert.credentialType].filter(Boolean) : [];

  const footer = (
    <div className="flex items-center justify-end gap-[12px] px-[clamp(24px,3vw,40px)] py-[16px] border-t border-[rgba(0,0,0,0.07)]">
      <Button variant="tertiary" size="md" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="danger"
        size="md"
        onClick={handleConfirm}
        leftIcon={<WorkDeleteWarningIcon className="size-full" />}
      >
        Permanently delete this certification
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Delete this certification"
      contentClassName="!rounded-[24px] !max-w-[550px] overflow-hidden"
      footer={footer}
    >
      <div className="relative flex flex-col p-[clamp(24px,3vw,40px)] gap-[20px]">
        {/* Top glow — every delete modal gets this, coloured to match its own
            "Permanently delete" CTA (Button `danger` variant, #c0392b). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-90px] size-[240px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #c0392b 0%, transparent 70%)' }}
        />

        <div className="flex flex-col items-center gap-[14px] text-center">
          <span className="size-[56px] rounded-[16px] bg-[#fdecea] border-2 border-[#f6c6bd] flex items-center justify-center">
            <WorkDeleteWarningIcon className="size-[26px] text-[#c0392b]" />
          </span>
          <h2 className="font-display text-[clamp(22px,2.2vw,28px)] tracking-[-0.8px] text-[#111]">
            Delete this certification?
          </h2>
          <p className="font-sans text-[13px] text-[#70706e] leading-[1.5] max-w-[360px]">
            This will permanently remove the certification from your profile. Your profile updates
            immediately. This cannot be undone.
          </p>
        </div>

        {/* Preview of the certification being deleted — Figma 5246:168454
            (get_design_context, verified 2026-09-09). Same corrections as
            the main list's CertCard (see CertsStage2Section.jsx):
            laptop glyph not CertificateIcon, icon vertically centered,
            amber credential-ID text, verified-badge px-9/py-3/text-8px, and
            "Badge URL" as its own blue link — not a plain grey tag sharing
            the credentialType/skills row style. */}
        {cert && (
          <div
            className="flex items-center gap-[12px] rounded-[16px] border-2 border-[#ebc2bd] bg-[#f9ebea] overflow-hidden"
            style={{ boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.07)' }}
          >
            <span className="ml-[17px] size-[44px] shrink-0 flex items-center justify-center rounded-[10px] bg-[rgba(235,241,236,0.5)]">
              <WorkRoleIcon className="size-5 text-brand-green" />
            </span>
            <div className="flex flex-col gap-[6px] min-w-0 py-[12px] pr-[16px]">
              <div className="flex flex-col gap-[2px] min-w-0">
                <span className="font-sans font-bold text-[15px] text-[#111]">{cert.name}</span>
                <span className="font-sans text-[12px] text-[#70706e]">
                  {cert.issuer} ·{' '}
                  {buildDateSummary(cert.dateIssued, cert.doesNotExpire, cert.expiryDate)}
                </span>
              </div>
              <span
                className="inline-flex items-center gap-[4px] self-start rounded-full border px-[9px] py-[3px] font-sans font-semibold text-[8px]"
                style={{
                  background: badgeStyle.bg,
                  borderColor: badgeStyle.border,
                  color: badgeStyle.text,
                }}
              >
                {isVerified ? '✓ Verified' : 'Self-reported'}
              </span>
              {cert.credentialId && (
                <p className="font-sans font-medium text-[12px] text-[#c8951a]">
                  ID: {cert.credentialId}
                </p>
              )}
              <div className="flex items-center flex-wrap gap-[5px]">
                {cert.badgeUrl && (
                  <a
                    href={cert.badgeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full h-[22px] px-[10px] font-sans font-semibold text-[10px] border border-[#bfcef2] bg-[#eaeffb] text-[#3062d4] hover:bg-[#d9e4fb] transition-colors duration-150"
                  >
                    Badge URL ↗
                  </a>
                )}
                {linkTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-[#e8e8e4] bg-white h-[21px] px-[8px] font-sans font-semibold text-[10px] text-[#70706e]"
                  >
                    {tag}
                  </span>
                ))}
                {cert.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full border border-[#e8e8e4] bg-white h-[21px] px-[8px] font-sans font-semibold text-[10px] text-[#70706e]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reason rows — Figma 5246:168472 / 5246:168477, ✅ VERIFIED verbatim, identical styling */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[8px] rounded-[8px] border border-[#c1d4c4] bg-white px-[12px] py-[10px]">
            <span className="size-[8px] rounded-[4px] bg-[#c0392b] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#575755]">
              Removed from your profile immediately
            </span>
          </div>
          <div className="flex items-center gap-[8px] rounded-[8px] border border-[#c1d4c4] bg-white px-[12px] py-[10px]">
            <span className="size-[8px] rounded-[4px] bg-[#c0392b] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#575755]">
              Skills evidence linked to this cert is removed
            </span>
          </div>
        </div>

        {/* "Edit instead?" nudge — Figma 5246:168492, ✅ VERIFIED verbatim */}
        <div
          className="flex items-center gap-[16px] rounded-[8px] border border-[#c1d4c4] pl-[10px] pr-[16px] py-[12px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <div className="flex flex-col gap-[4px] flex-1 min-w-0">
            <span className="font-sans font-semibold text-[12px] text-[#2a5730]">
              Want to fix something instead of deleting?
            </span>
            <p className="font-sans text-[10px] text-[#387440] leading-[14px] opacity-85">
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

export default DeleteCertModal;
