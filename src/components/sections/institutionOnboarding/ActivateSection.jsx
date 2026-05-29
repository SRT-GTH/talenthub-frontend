import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import Captions from '../../ui/Captions.jsx';
import Checkbox from '../../ui/form/Checkbox.jsx';
import TermsAcceptedModal from './TermsAcceptedModal.jsx';
import LegalDocModal from './LegalDocModal.jsx';
import { ArrowRightIcon, MailIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ActivateSection');

/*
 * ActivateSection — Step 3 of the institution bulk-onboarding wizard.
 * Figma frames: 2973:79786 (main), 2977:84878 (TermsAcceptedModal).
 *
 * This step has NO right panel — InstitutionOnboardingLayout hides
 * InstitutionRightPanel when the pathname ends with '/activate'.
 *
 * The section is full-width. Content is centred with max-w-[897px].
 *
 * Review card data:
 *   In production this would be read from a shared institution onboarding
 *   Redux slice (or equivalent) populated by steps 1 and 2. For now the
 *   fields fall back to '—' placeholders (no store wired yet).
 *
 * Agreement flow:
 *   All 3 checkboxes must be ticked before the CTA becomes active.
 *   Each checkbox label contains links that open the corresponding legal
 *   document modal (LegalDocModal). Clicking "I understand and Accept"
 *   inside a modal auto-checks its corresponding checkbox.
 *
 *   Checkbox 1 → Terms & Conditions modal  (via "Terms & Conditions" link)
 *              → Privacy Policy modal       (via "Privacy Policy." link)
 *              Both modals set agreed1 = true on accept.
 *   Checkbox 2 → Data Consent modal         (via "Learn more about data processing." link)
 *              Modal sets agreed2 = true on accept.
 *   Checkbox 3 → manual confirmation (no modal)
 *
 *   Clicking the (enabled) CTA opens TermsAcceptedModal.
 *   Modal "I'm Ready" → navigate to next step.
 */

// ── local small icons for review card section headers ─────────────────────
// PersonIcon from assets.jsx is 24×24 with no className override support;
// these localised 11×11 versions avoid modifying the shared asset.

const SmallPersonIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#387440"
      d="M12 4.75a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5M8.25 7a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0m1.064 5.819c.132.098.302.213.505.327c.513.29 1.265.59 2.18.59s1.668-.3 2.181-.59c.203-.114.373-.229.505-.327q.282.075.559.166l.96.315c.72.237 1.264.812 1.458 1.523l.397 2.864c.075.544-.21.939-.606 1.033c-1.047.25-2.812.53-5.453.53s-4.407-.28-5.454-.53c-.395-.094-.68-.489-.606-1.033l.397-2.864A2.23 2.23 0 0 1 7.796 13.3l.96-.315q.276-.09.558-.166m.71-1.355l-.291-.287l-.402.092q-.526.12-1.044.291l-.96.315a3.72 3.72 0 0 0-2.454 2.616l-.01.04l-.408 2.95c-.161 1.164.462 2.393 1.744 2.698c1.17.279 3.052.571 5.8.571c2.749 0 4.631-.292 5.801-.57c1.282-.306 1.906-1.535 1.745-2.698l-.409-2.95l-.01-.04a3.72 3.72 0 0 0-2.455-2.617l-.959-.315q-.517-.17-1.044-.29l-.402-.093l-.29.286l-.001.001a2 2 0 0 1-.12.101a3 3 0 0 1-.41.274a2.96 2.96 0 0 1-1.445.397a2.96 2.96 0 0 1-1.445-.397a3.2 3.2 0 0 1-.53-.375"
    />
  </svg>
);

// ── review card field sub-component ───────────────────────────────────────

const ReviewField = ({ label, value }) => (
  <div
    className="flex flex-col justify-center gap-[3px] rounded-[10px] px-3"
    style={{
      background: '#f8f8f4',
      height: '49px',
    }}
  >
    <span
      className="font-sans font-bold uppercase leading-none text-[#babab7]"
      style={{ fontSize: '9px', letterSpacing: '0.6px' }}
    >
      {label}
    </span>
    <span
      className="font-sans font-semibold leading-none text-[#595959] truncate"
      style={{ fontSize: '14px' }}
      title={value || ''}
    >
      {value || (
        <span className="font-normal italic text-[#c8c8c4]" style={{ fontSize: '13px' }}>
          —
        </span>
      )}
    </span>
  </div>
);

// ── review card section header ─────────────────────────────────────────────

const ReviewSectionHeader = ({ icon, label, editPath }) => (
  <div className="mb-3 flex items-center gap-10">
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      <span
        className="font-sans text-nowrap font-bold uppercase text-[#babab7]"
        style={{ fontSize: '10px', letterSpacing: '1px' }}
      >
        {label}
      </span>
    </span>
    <Link
      to={editPath}
      className="inline-flex items-center justify-center rounded-[6px] border border-[#c1d4c4]  px-2 font-sans font-semibold uppercase text-brand-green transition-colors duration-100 hover:bg-[#ebf1ec]"
      style={{
        height: '19px',
        fontSize: '10px',
        letterSpacing: '1px',
      }}
    >
      Edit
    </Link>
    <div className="h-[1px] w-full bg-black/6 " />
  </div>
);

// ── info icon ──────────────────────────────────────────────────────────────

const InfoCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="6" stroke="#387440" strokeWidth="1.3" />
    <path d="M7 6v4" stroke="#387440" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="7" cy="4.3" r="0.75" fill="#387440" />
  </svg>
);

// ── disabled CTA visual ────────────────────────────────────────────────────
// Matches the Figma disabled state exactly — grey face, grey shelf, no hover.

const DisabledCTA = () => (
  <div
    aria-disabled="true"
    className="flex w-full cursor-not-allowed select-none items-center justify-center gap-2 rounded-[14px] border border-t border-b-2 border-l-2 border-r-2"
    style={{
      background: '#bfbfbf',
      borderColor: '#cccccc',
      borderBottomColor: '#cccccc',
      boxShadow: '0 4px 0 rgba(191,191,191,0.8)',
      padding: '16px 34px',
      color: '#e0e0e0',
      fontSize: '16px',
      fontWeight: 600,
      fontFamily: 'inherit',
    }}
  >
    <span>Activate Institution Account</span>
    <ArrowRightIcon />
  </div>
);

// ── main component ─────────────────────────────────────────────────────────

const ActivateSection = () => {
  const navigate = useNavigate();

  // ── agreement state ───────────────────────────────────────────────────
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
  const [agreed3, setAgreed3] = useState(false);

  // ── modal visibility state ────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false); // TermsAcceptedModal
  const [showTcModal, setShowTcModal] = useState(false); // Terms & Conditions
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); // Privacy Policy
  const [showDataModal, setShowDataModal] = useState(false); // Data Processing

  const allAgreed = agreed1 && agreed2 && agreed3;

  log('mount');
  log('render', {
    agreed1,
    agreed2,
    agreed3,
    allAgreed,
    showModal,
    showTcModal,
    showPrivacyModal,
    showDataModal,
  });

  // ── handlers ─────────────────────────────────────────────────────────
  const handleActivateClick = () => {
    if (!allAgreed) {
      log('activate clicked but not all agreements checked');
      return;
    }
    log('all agreements checked — opening TermsAcceptedModal');
    setShowModal(true);
  };

  const handleModalClose = () => {
    log('TermsAcceptedModal closed');
    setShowModal(false);
  };

  const handleModalConfirm = () => {
    log('TermsAcceptedModal confirmed — navigating to template step');
    setShowModal(false);
    navigate('/onboarding/institution/template-guide');
  };

  // ── agreement checkbox label JSX ──────────────────────────────────────
  // Defined inside component so link onClick handlers close over state setters.
  // Text verbatim from Figma — only onClick wiring changed from placeholder.

  const agreementLabel1 = (
    <>
      I agree to Institution{' '}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          log('Terms & Conditions link clicked — opening TC modal');
          setShowTcModal(true);
        }}
        className="font-semibold text-brand-green underline underline-offset-2 hover:opacity-80"
      >
        Terms &amp; Conditions
      </a>{' '}
      and{' '}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          log('Privacy Policy link clicked — opening PP modal');
          setShowPrivacyModal(true);
        }}
        className="font-semibold text-brand-green underline underline-offset-2 hover:opacity-80"
      >
        Privacy Policy.
      </a>
    </>
  );

  const agreementLabel2 = (
    <>
      I consent to Ghana Talent Hub processing my data under Ghana DPA (Act 843).{' '}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          log('Learn more link clicked — opening Data Processing modal');
          setShowDataModal(true);
        }}
        className="font-semibold text-brand-green underline underline-offset-2 hover:opacity-80"
      >
        Learn more about data processing.
      </a>
    </>
  );

  const agreementLabel3 = (
    <>
      I confirm that I am authorised to register this institution and that all information provided
      is accurate and complete.{' '}
      <span className="font-semibold text-[#c0392b]" aria-hidden="true">
        *
      </span>
    </>
  );

  return (
    <>
      {/* Main content column — full-width since layout has no right panel */}
      <div className="flex flex-1 items-start justify-center px-6 py-12 md:py-20">
        <div className="flex w-full max-w-[897px] flex-col items-center gap-6">
          {/* ── Step badge ── */}
          <Captions items={[{ index: '03', label: 'Activate Account' }]} currentIndex={0} />

          {/* ── Headline ── */}
          <h1
            className="font-display font-normal text-center text-black"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 4rem)',
              lineHeight: 1.094,
              letterSpacing: '-0.64px',
              maxWidth: '620px',
            }}
          >
            Review, accept &amp; <span className="italic text-brand-green">go live.</span>
          </h1>

          {/* ── Subtext ── */}
          <p
            className="text-center font-sans font-normal text-[#737373]"
            style={{
              fontSize: 'clamp(0.875rem, 1.1vw, 1rem)',
              lineHeight: 1.6,
              maxWidth: '520px',
            }}
          >
            Review everything you've entered. If anything looks wrong, tap Edit next to the section.
            Then accept the three agreement s to activate your account.{' '}
          </p>

          {/* ── Wavy divider ── */}
          <WavyDivider />

          {/* ── Review card ── */}
          <div
            className="w-full rounded-[24px] border bg-white p-6 md:p-8"
            style={{
              borderColor: 'rgba(0,0,0,0.08)',
              boxShadow: '0 4px 0 0 rgba(0,0,0,0.13)',
            }}
          >
            {/* ─── INSTITUTION SETUP section ─── */}
            <ReviewSectionHeader
              icon={<SmallPersonIcon />}
              label="Institution Setup"
              editPath="/onboarding/institution/your-institution"
            />

            {/* Row 1: 3-column */}
            <div className="mb-2 grid grid-cols-3 gap-2">
              <ReviewField label="Legal Institution Name" value={null} />
              <ReviewField label="Trading / Common Name" value={null} />
              <ReviewField label="Institution Type" value={null} />
            </div>

            {/* Row 2: 2-column */}
            <div className="mb-6 grid grid-cols-2 gap-2">
              <ReviewField label="Region" value={null} />
              <ReviewField label="District" value={null} />
            </div>

            {/* ─── CONTACT DETAILS section ─── */}
            <ReviewSectionHeader
              icon={<MailIcon className="size-[11px] text-brand-green" />}
              label="Contact Details"
              editPath="/onboarding/institution/contact"
            />

            {/* 2-column layout: left col (3 fields), right col (2 fields) */}
            <div className="grid grid-cols-2 gap-2">
              {/* Left */}
              <div className="flex flex-col gap-2">
                <ReviewField label="Full Name" value={null} />
                <ReviewField label="Phone Number" value={null} />
                <ReviewField label="Password" value="••••••••" />
              </div>
              {/* Right */}
              <div className="flex flex-col gap-2">
                <ReviewField label="Role / Title" value={null} />
                <ReviewField label="Email Address" value={null} />
              </div>
            </div>
          </div>

          {/* ── Agreements section ── */}
          <div className="w-full">
            {/* Agreements header */}
            <div className="mb-4 flex items-center gap-3">
              <span
                className="font-sans font-bold uppercase text-[#babab7]"
                style={{ fontSize: '10px', letterSpacing: '1px', whiteSpace: 'nowrap' }}
              >
                Required Agreements — All 3 must be accepted
              </span>
              <div className="h-px flex-1 bg-[rgba(0,0,0,0.08)]" />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-4">
              <Checkbox
                checked={agreed1}
                onChange={(e) => {
                  log('agreement 1 changed:', e.target.checked);
                  setAgreed1(e.target.checked);
                }}
                label={agreementLabel1}
              />
              <Checkbox
                checked={agreed2}
                onChange={(e) => {
                  log('agreement 2 changed:', e.target.checked);
                  setAgreed2(e.target.checked);
                }}
                label={agreementLabel2}
              />
              <Checkbox
                checked={agreed3}
                onChange={(e) => {
                  log('agreement 3 changed:', e.target.checked);
                  setAgreed3(e.target.checked);
                }}
                label={agreementLabel3}
              />
            </div>
          </div>

          {/* ── Info notice ── */}
          <div
            className="flex w-full items-center gap-2.5 rounded-[12px] border px-4"
            style={{
              background: '#ebf1ec',
              borderColor: '#e0e7f9',
              height: '47px',
            }}
          >
            <p
              className="font-sans font-medium text-brand-green"
              style={{ fontSize: '12px', lineHeight: 1.4 }}
            >
              Your account activates immediately , no review required. You can start uploading
              students right away.
            </p>
          </div>

          {/* ── CTA ── */}
          {allAgreed ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRightIcon />}
              onClick={handleActivateClick}
              className="w-full"
            >
              Activate Institution Account
            </Button>
          ) : (
            <DisabledCTA />
          )}

          {/* Already-have-account link */}
          <div className="flex items-center justify-center gap-2 text-[14px] leading-6">
            <span className="text-content-helper" style={{ letterSpacing: '0.2px' }}>
              Already Have an account?
            </span>
            <Link
              to="/login"
              className="font-semibold text-brand-green underline-offset-2 hover:underline"
              style={{ letterSpacing: '0.1px' }}
            >
              Log in Instead
            </Link>
          </div>
        </div>
      </div>

      {/* ── Terms Accepted Modal ── */}
      {showModal && (
        <TermsAcceptedModal onClose={handleModalClose} onConfirm={handleModalConfirm} />
      )}

      {/* ── Terms & Conditions modal ── */}
      {showTcModal && (
        <LegalDocModal
          variant="tc"
          onClose={() => {
            log('TC modal closed without accepting');
            setShowTcModal(false);
          }}
          onAccept={() => {
            log('TC modal accepted — setting agreed1 = true');
            setAgreed1(true);
            setShowTcModal(false);
          }}
        />
      )}

      {/* ── Privacy Policy modal ── */}
      {showPrivacyModal && (
        <LegalDocModal
          variant="privacy"
          onClose={() => {
            log('Privacy modal closed without accepting');
            setShowPrivacyModal(false);
          }}
          onAccept={() => {
            log('Privacy modal accepted — setting agreed1 = true');
            setAgreed1(true);
            setShowPrivacyModal(false);
          }}
        />
      )}

      {/* ── Data Consent modal ── */}
      {showDataModal && (
        <LegalDocModal
          variant="data-processing"
          onClose={() => {
            log('Data Processing modal closed without accepting');
            setShowDataModal(false);
          }}
          onAccept={() => {
            log('Data Processing modal accepted — setting agreed2 = true');
            setAgreed2(true);
            setShowDataModal(false);
          }}
        />
      )}
    </>
  );
};

export default ActivateSection;
