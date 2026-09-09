import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import AddEditCertModal from './AddEditCertModal.jsx';
import DeleteCertModal from './DeleteCertModal.jsx';
import CertSavedModal from './CertSavedModal.jsx';
import {
  VERIFIED_BADGE_STYLE,
  SELF_REPORTED_BADGE_STYLE,
  buildDateSummary,
} from './certTypeStyles.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ArrowLeftIcon,
  ArrowRightSmIcon,
  UploadCertificateIcon,
  WorkRoleIcon,
  WorkDeleteWarningIcon,
  WorkEditPencilIcon,
} from '../../shared/assets.jsx';

const log = debug('CertsStage2Section');

/*
 * CertsStage2Section — full page for /profile/filling/certs/list.
 * Source: Figma 5217:123892 "Certs empty state" (empty) + 5217:124109
 * "Certs" (populated), file key Bin8roWL8sloyc36IgFMuT. Structurally mirrors
 * WorkStage2Section.jsx (single-row card list, NOT Portfolio's dual hero/
 * compact layout — per lesson #8, both the empty state's reference card AND
 * all 5 populated example cards share ONE layout, confirmed via
 * get_metadata: every one is a "Background+Border+Shadow" row with a 44px
 * left icon tile, no cover-band/pinned variant anywhere in this flow) — see
 * wiki/figma-node-map.md § "Certifications — profile filling page flow" for
 * every node dived into (2026-09-08).
 *
 * ⚠️ FIGMA MCP AVAILABILITY — see CertsIntroSection.jsx's file-header
 * comment for the full explanation. Short version: `get_design_context`
 * timed out throughout this session, so every string below is either
 * ✅ VERIFIED verbatim from a `get_metadata` "Heading → literal text" node,
 * or an ⚠️ ASSUMPTION replacement where that verbatim text was a severely
 * mismatched clone (this page's own header literally read "What pulls you
 * in?" — an Interests-stage leftover) or an unresolvable generic
 * property-slot label.
 *
 * The 5 populated example certifications AND the empty-state reference card
 * ARE ✅ VERIFIED verbatim (get_metadata dive on 5217:124109 and 5217:123892,
 * 2026-09-08) — title, issuer, dates, credential ID, and tag chips all
 * reproduce Figma's own literal text exactly, including the unexplained
 * trailing "R" tag chip present on every single example row (width 27px, far
 * too narrow to be a real skill tag) — kept verbatim rather than guessed at
 * (e.g. as a truncated "+1 more" chip) since neither get_design_context nor
 * a wider screenshot was available to resolve what it actually represents.
 */

// ─── Data ─────────────────────────────────────────────────────────────────────

// Figma 5217:124109 (populated state), all 5 rows ✅ VERIFIED verbatim via
// get_metadata (2026-09-08) — title, issuer/date line, credential ID, and
// tag chips (including the unexplained "R" chip on every row, see file
// header comment).
const INITIAL_CERTS = [
  {
    id: 'cert-1',
    name: 'Google Data Analytics Certificate',
    issuer: 'Coursera / Google',
    credentialType: 'Online course',
    skills: ['Data Analytics', 'SQL', 'R'],
    dateIssued: '01/03/2024',
    doesNotExpire: true,
    expiryDate: '',
    credentialId: 'GOOGLE-DA-2024-KA7',
    badgeUrl: 'https://coursera.org/verify/GOOGLE-DA-2024-KA7',
  },
  {
    id: 'cert-2',
    name: 'AWS Certified Solutions Architect',
    issuer: 'AWS',
    credentialType: 'Online certification',
    skills: ['Cloud Architecture', 'AWS', 'R'],
    dateIssued: '15/01/2024',
    doesNotExpire: false,
    expiryDate: '15/01/2027',
    credentialId: 'AWS-SA-2024-XYZ',
    badgeUrl: 'https://aws.amazon.com/verification/AWS-SA-2024-XYZ',
  },
  {
    id: 'cert-3',
    name: 'Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    credentialType: 'Online course',
    skills: ['Cloud Fundamentals', 'Azure', 'R'],
    dateIssued: '10/02/2024',
    doesNotExpire: true,
    expiryDate: '',
    credentialId: 'AZ-900-2024-XA9',
    badgeUrl: '',
  },
  {
    id: 'cert-4',
    name: 'Scrum Master Certified (SMC)',
    issuer: 'Scrum Alliance',
    credentialType: 'Online certification',
    skills: ['Agile', 'Scrum', 'R'],
    dateIssued: '05/04/2024',
    doesNotExpire: false,
    expiryDate: '05/04/2026',
    credentialId: 'SMC-2024-ABC',
    badgeUrl: '',
  },
  {
    id: 'cert-5',
    name: 'GCP Professional Data Engineer',
    issuer: 'Google',
    credentialType: 'Online certification',
    skills: ['Data Engineering', 'Google Cloud', 'R'],
    dateIssued: '20/03/2024',
    doesNotExpire: false,
    expiryDate: '20/03/2027',
    credentialId: 'GCP-DE-2024-DEF',
    badgeUrl: '',
  },
];

// ─── CertCard ─────────────────────────────────────────────────────────────────
const CertCard = ({ cert, onEdit, onDelete, readOnly = false }) => {
  const isVerified = Boolean(cert.credentialId?.trim() || cert.badgeUrl?.trim());
  const badgeStyle = isVerified ? VERIFIED_BADGE_STYLE : SELF_REPORTED_BADGE_STYLE;
  log('CertCard render', { id: cert.id, isVerified, readOnly });

  const linkTags = [cert.credentialType].filter(Boolean);

  return (
    <div
      // Figma 5245:167801 (get_design_context, verified 2026-09-09) — real
      // spec is rounded-16/border/drop-shadow-4px PLUS opacity-85 on the
      // whole card (not the plain fully-opaque card an earlier pass guessed).
      className="bg-white border border-[#e8e8e4] rounded-[16px] p-[16px] flex flex-col gap-[10px] relative opacity-[0.85]"
      style={{ boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.07)' }}
    >
      {/* Edit/delete icon buttons — top-right, 28px squares. Hidden for the
          "Example of a strong certification entry" reference card
          (readOnly): it's a static illustration, not a real saved
          certification, so editing/deleting it makes no sense. */}
      {!readOnly && (
        <div className="absolute right-[14px] top-[14px] flex items-center gap-[6px]">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${cert.name}`}
            className="size-[28px] rounded-[6px] border border-[#e8e8e4] bg-white flex items-center justify-center text-[#555] hover:bg-[#f8f8f4] transition-colors duration-150"
          >
            <WorkEditPencilIcon className="size-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${cert.name}`}
            className="size-[28px] rounded-[6px] border border-[#e8e8e4] bg-white flex items-center justify-center text-[#555] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors duration-150"
          >
            <WorkDeleteWarningIcon className="size-3" />
          </button>
        </div>
      )}

      {/* Figma 5245:167801/167839 — the icon box is vertically centered
          against the (taller) text column, not top-aligned. */}
      <div className={`flex items-center gap-[14px] ${readOnly ? '' : 'pr-[70px]'}`}>
        {/* Figma 5245:167801 — this is a laptop glyph (the same WorkRoleIcon
            already used for Work Experience roles), NOT a certificate/document
            icon — an earlier pass guessed CertificateIcon here without a real
            dive. */}
        <span className="size-[44px] rounded-[10px] bg-[rgba(235,241,236,0.5)] flex items-center justify-center shrink-0">
          <WorkRoleIcon className="size-5 text-brand-green" />
        </span>
        <div className="flex flex-col gap-[4px] min-w-0">
          <span className="font-sans font-bold text-[15px] text-[#111]">{cert.name}</span>
          <span className="font-sans text-[12px] text-[#70706e]">
            {cert.issuer} · {buildDateSummary(cert.dateIssued, cert.doesNotExpire, cert.expiryDate)}
          </span>
          {/* Figma 5245:167819 — real spec is px-9/py-3, text-8px (an earlier
              pass guessed px-8/h-19/text-10px). */}
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
            // Figma 5245:167821 — credential ID renders in amber (#c8951a),
            // not the plain grey an earlier pass guessed.
            <p className="font-sans font-medium text-[12px] text-[#c8951a] mt-[2px]">
              ID: {cert.credentialId}
            </p>
          )}
          <div className="flex items-center flex-wrap gap-[5px] mt-[2px]">
            {/* Figma 5245:167856 — "Badge URL ↗" is a real informative-blue
                link BUTTON (its own #eaeffb/#bfcef2/#3062d4 styling), not a
                plain grey tag sharing the credentialType/skills row style —
                an earlier pass rendered it identically to those. It's also a
                genuine clickable link (opens the real badge URL), not just a
                decorative label. */}
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
                className="inline-flex items-center rounded-full border border-[#e8e8e4] bg-[#f8f8f4] h-[21px] px-[8px] font-sans font-semibold text-[10px] text-[#70706e]"
              >
                {tag}
              </span>
            ))}
            {cert.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full border border-[#e8e8e4] bg-[#f8f8f4] h-[21px] px-[8px] font-sans font-semibold text-[10px] text-[#70706e]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Right aside ──────────────────────────────────────────────────────────────
// Figma "Aside" (5217:124237 populated / 5217:124019 empty) — "🎯 What
// counts?" heading is ✅ VERIFIED verbatim; its 4 list items are generic
// property-slot text (⚠️ ASSUMPTION, invented-but-consistent, same
// convention as Work/Portfolio's own aside lists). The middle card is named
// "📊 Popular in Ghana" in Figma's own metadata — an ✅ VERIFIED-but-wrong
// Interests-stage clone (this exact card slot was ALSO first built wrong as
// "Popular in Ghana" in the Portfolio flow before being corrected to a real
// "Why This Matters" card, per lesson #10) — so per that same precedent this
// is treated as the shared "Why this matters" card, not reproduced verbatim.
const CertsStage2RightAside = ({ certCount }) => (
  <aside
    className="w-[clamp(240px,19.04vw,329px)] shrink-0 bg-[#f8f8f4] border-l border-[rgba(0,0,0,0.07)] overflow-y-auto [&::-webkit-scrollbar]:hidden"
    aria-label="Certifications guidance"
    style={{ scrollbarWidth: 'none' }}
  >
    <div className="flex flex-col gap-[16px] p-[clamp(16px,1.5vw,24px)]">
      {/* What counts? */}
      <div
        className="rounded-[10px] border border-[#c1d4c4] p-[16px]"
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
        {/* Figma 5217:124239 (get_design_context, verified 2026-09-09) —
            real list items, replacing an earlier pass's invented ones. */}
        <ul className="flex flex-col gap-[7px]">
          {[
            'Issuer & credential ID',
            'Issue & expiry dates',
            'Badge or certificate URL',
            'Skills it covers',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-[6px] font-sans text-[12px] text-[#716e65] leading-[1.4]"
            >
              <span className="font-bold text-brand-green shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Why this matters — Figma 5217:124254 (get_design_context, verified
          2026-09-09), replacing an earlier pass's invented body text. */}
      <div
        className="bg-white border border-[#e8e8e4] rounded-[10px] p-[16px]"
        style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
      >
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.6px] text-[#70706e] mb-[8px]">
          Why this matters
        </p>
        <p className="font-sans text-[12px] text-[#999] leading-[1.6]">
          Verified credentials earn the green ✓ badge. Recruiters trust verified skills 4× more than
          self-reported ones.
        </p>
      </div>

      {/* Recruiter views this week */}
      <div
        className="bg-white border border-[#e8e8e4] rounded-[16px] p-[16px]"
        style={{ boxShadow: '0px 4px 0px rgba(0,0,0,0.07)' }}
      >
        <p className="font-sans font-bold text-[10px] uppercase tracking-[0.8px] text-[#70706e] mb-[10px]">
          👀 Recruiter views this week
        </p>
        <p className="font-display text-[36px] leading-none text-[#111] mb-[10px]">
          {certCount > 0 ? Math.min(certCount * 3, 24) : 0}
        </p>
        <p className="font-sans text-[11px] text-[#70706e] mb-[10px]">
          profile views from recruiters
        </p>
        <div className="h-[6px] rounded-full bg-[#e8e8e4] overflow-hidden mb-[10px]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(certCount * 20, 100)}%`,
              background: 'linear-gradient(90deg, #3f6212, #84cc16)',
            }}
          />
        </div>
        <p className="font-sans text-[10px] text-[#70706e]">
          {certCount > 0
            ? 'Recruiters are already discovering your profile.'
            : 'Add certifications to unlock recruiter discovery'}
        </p>
      </div>
    </div>
  </aside>
);

// ─── Main section ─────────────────────────────────────────────────────────────

const CertsStage2Section = () => {
  log('mount', { route: '/profile/filling/certs/list', stageIndex: 6 });
  const navigate = useNavigate();

  const [certs, setCerts] = useState(INITIAL_CERTS);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingCert, setEditingCert] = useState(null);
  const [deletingCert, setDeletingCert] = useState(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/certs');
    navigate('/profile/filling/certs');
  };

  const handleNext = () => {
    // Goals (desired-career) intro page now exists (built 2026-09-09) — the
    // stage-2 "Next" CTA hands off to it directly, same as every other
    // completed stage hands off to its successor's intro.
    log('next → /profile/filling/goals');
    navigate('/profile/filling/goals');
  };

  const openAddModal = () => {
    log('open add-certification modal');
    setModalMode('add');
    setEditingCert(null);
    setIsAddEditOpen(true);
  };

  const openEditModal = (cert) => {
    log('open edit-certification modal', { id: cert.id });
    setModalMode('edit');
    setEditingCert({
      ...cert,
      onDelete: () => {
        // Delete from inside the Edit modal must close the Edit modal too —
        // otherwise it stays open underneath the Delete-confirm modal.
        log('delete from within edit modal — closing edit modal first', { id: cert.id });
        closeAddEditModal();
        setDeletingCert(cert);
      },
    });
    setIsAddEditOpen(true);
  };

  const closeAddEditModal = () => {
    setIsAddEditOpen(false);
    setEditingCert(null);
  };

  const handleSaveCert = (formData) => {
    if (formData.id) {
      log('update existing certification', { id: formData.id });
      setCerts((prev) => prev.map((c) => (c.id === formData.id ? buildCert(formData, c) : c)));
    } else {
      const newCert = buildCert({ ...formData, id: `cert-${Date.now()}` });
      log('add new certification', { id: newCert.id });
      setCerts((prev) => [newCert, ...prev]);
    }
    // CertSavedModal.jsx's copy is a generic "here's what this unlocks"
    // confirmation, not a one-time milestone screen — opens after every
    // successful save (add AND edit), same rule every other stage in this
    // app already established.
    setIsSavedModalOpen(true);
  };

  const buildCert = (formData, existing = {}) => ({
    ...existing,
    id: formData.id,
    name: formData.name,
    issuer: formData.issuer,
    credentialType: formData.credentialType,
    skills: formData.skills,
    dateIssued: formData.dateIssued,
    doesNotExpire: formData.doesNotExpire,
    expiryDate: formData.expiryDate,
    credentialId: formData.credentialId,
    badgeUrl: formData.badgeUrl,
  });

  const handleDeleteCert = () => {
    if (!deletingCert) return;
    log('delete certification', { id: deletingCert.id });
    setCerts((prev) => prev.filter((c) => c.id !== deletingCert.id));
    setDeletingCert(null);
  };

  const handleEditInsteadFromDelete = () => {
    if (!deletingCert) return;
    openEditModal(deletingCert);
  };

  const isEmpty = certs.length === 0;

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
        <EngagementTopBar currentStageIndex={6} completionPct={67} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 flex overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              {/* Header — Figma "Section" (5217:124223 / 5245:167962).
                  ⚠️ ASSUMPTION: Figma's own headline literally reads "What
                  pulls you in?" (an Interests-stage clone) — replaced with
                  real Certs-specific copy, see file-header comment.
                  The "Why certs matter" stat card (Figma 5217:124226,
                  get_design_context-verified 2026-09-09) was skipped by an
                  earlier pass as "unresolvable" — it isn't; every field is
                  real, verbatim text. Now implemented, positioned right of
                  the header text same as this section's own layout shows. */}
              <section
                aria-label="Certifications — proof you can point to"
                className="border-b border-[rgba(0,0,0,0.07)] px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2.31vw,40px)] flex items-start justify-between gap-x-[40px]"
              >
                <div className="min-w-0">
                  <h2 className="font-display text-[clamp(26px,2.89vw,40px)] max-w-[340px] leading-[0.95] tracking-[-1.8px] mb-[clamp(8px,0.93vw,16px)]">
                    <span className="not-italic text-[#111]">Certifications. </span>
                    <span className="italic text-brand-green">Proof of what you know.</span>
                  </h2>
                  <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-[1.6] text-[#70706e] mb-[clamp(10px,0.93vw,16px)] max-w-[680px]">
                    Degrees, online courses, licences, bootcamps — anything with your name on it
                    counts. Upload a PDF or photo, or add the details manually.
                  </p>
                  <div className="flex items-center flex-wrap gap-[8px]">
                    {[`2-8 certs `, `Upload or manual`, '~7 min'].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center font-sans font-medium text-[clamp(10px,0.69vw,12px)] leading-4 text-[#70706e] bg-white rounded-full px-[10px] py-[4px] border border-[#e1eae2] whitespace-nowrap"
                        style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* "Why certs matter" stat card — Figma 5217:124226 */}
                <div
                  className="hidden lg:block shrink-0 w-[420px] bg-white border border-[#e8e8e4] rounded-[16px] p-[18px]"
                  style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                >
                  <p className="font-sans font-bold text-[12px] uppercase tracking-[0.6px] text-[#70706e] mb-[10px]">
                    Why certs matter
                  </p>
                  <p className="font-sans text-[12px] text-[#70706e] leading-[1.6] mb-[14px]">
                    Certifications back up your skills with third-party proof. Verified certs earn
                    the green ✓ badge recruiters trust 4× more.
                  </p>
                  <div className="flex items-center gap-[12px]">
                    <span className="size-[46px] shrink-0 rounded-full bg-white border border-[#fef1e7] flex items-center justify-center font-display text-[15px] text-brand-green">
                      67%
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans font-bold text-[13px] text-[#111]">
                        Profile strength
                      </p>
                      <p className="font-sans text-[12px] text-[#959592]">
                        Six stages done. Certs add third-party proof.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2vw,32px)]">
                {isEmpty ? (
                  <>
                    {/* Empty state — Figma 5217:124048, ✅ VERIFIED verbatim copy */}
                    <div
                      className="rounded-[24px] border-2 border-dashed border-brand-green flex flex-col items-center gap-[22px] px-[24px] py-[clamp(32px,4vw,56px)] text-center"
                      style={{ background: 'rgba(235,241,236,0.5)' }}
                    >
                      <div className="flex flex-col items-center gap-[4px]">
                        <UploadCertificateIcon className="size-10 text-brand-green" />
                        <h3 className="font-display text-[clamp(20px,2vw,26px)] text-brand-green mt-[8px]">
                          No certifications yet.
                        </h3>
                        <p className="font-sans text-[14px] text-[#70706e] leading-[1.75] max-w-[520px] mt-[4px]">
                          Add your first certification below. Upload a PDF or photo of the
                          credential, or enter the details manually — issuer, date and ID.
                        </p>
                      </div>
                      <div className="flex items-center flex-wrap justify-center gap-[12px]">
                        <Button variant="primary" size="md" onClick={openAddModal}>
                          Upload a certificate
                        </Button>
                        <Button variant="tertiary" size="md" onClick={openAddModal}>
                          Add manually
                        </Button>
                      </div>
                      <p className="font-sans text-[12px] text-[#70706e]">
                        No certs yet?{' '}
                        <button
                          type="button"
                          onClick={handleNext}
                          className="font-semibold text-brand-green underline underline-offset-2"
                        >
                          Skip this stage
                        </button>
                      </p>
                    </div>

                    {/* Example of a strong certification entry — Figma 5225:167683 */}
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
                        Example of a strong certification entry
                      </p>
                      <CertCard cert={INITIAL_CERTS[0]} readOnly />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Populated state — Figma 5225:167680 "Main" */}
                    <div className="flex flex-col gap-[10px]">
                      {certs.map((cert) => (
                        <CertCard
                          key={cert.id}
                          cert={cert}
                          onEdit={() => openEditModal(cert)}
                          onDelete={() => setDeletingCert(cert)}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={openAddModal}
                      className="w-full flex items-center justify-center gap-[10px] rounded-[16px] py-[clamp(16px,1.62vw,28px)] mt-[10px] font-sans font-semibold text-[clamp(12px,0.81vw,14px)] text-brand-green transition-colors duration-150 hover:bg-[rgba(235,241,236,0.7)]"
                      style={{ background: 'rgba(235,241,236,0.5)', border: '2px dashed #387440' }}
                    >
                      <span className="size-[20px] bg-brand-green rounded-[4px] flex items-center justify-center shrink-0">
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
                      Add Another Certification
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <CertsStage2RightAside certCount={certs.length} />
        </div>

        {/* Footer — spans the full viewport width, sibling of the row above
            rather than nested next to the aside (same layout note as
            WorkStage2Section.jsx / PortfolioStage2Section.jsx). */}
        <footer className="shrink-0 h-[142px] w-full border-t border-[#f1f5f9] bg-white flex items-center px-[clamp(20px,3.24vw,56px)]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[6px]">
              <span
                aria-hidden="true"
                className="inline-block w-[6px] h-[6px] rounded-[3px] bg-brand-green shrink-0"
              />
              <span className="font-sans text-[12px] leading-5 text-[#555]">
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
                Certs intro
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ArrowRightSmIcon className="size-full" />}
              >
                Next: Goals
              </Button>
            </div>
          </div>
        </footer>
      </main>

      <AddEditCertModal
        isOpen={isAddEditOpen}
        onClose={closeAddEditModal}
        onSave={handleSaveCert}
        mode={modalMode}
        initialData={editingCert}
      />

      <DeleteCertModal
        isOpen={Boolean(deletingCert)}
        onClose={() => setDeletingCert(null)}
        onConfirm={handleDeleteCert}
        onEditInstead={handleEditInsteadFromDelete}
        cert={deletingCert}
      />

      <CertSavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onContinue={() => {
          setIsSavedModalOpen(false);
          handleNext();
        }}
        certs={certs}
      />
    </div>
  );
};

export default CertsStage2Section;
