import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import Captions from '../../ui/Captions.jsx';
import Checkbox from '../../ui/form/Checkbox.jsx';
import PreviewField from '../../ui/PreviewField.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { ArrowRightIcon, IdCardIcon, MailIcon, UserIcon } from '../../shared/assets.jsx';
import { OptOutModal, ParentRightsModal, DataProcessingModal } from './ConsentModals.jsx';
import { debug } from '../../../utils/debug.js';
// Placeholder ward avatar — same as Link Ward step; swap for the real per-ward
// photo when the parent onboarding store is wired.
import wardAvatar from '../../../assets/hero/parent-welcome-panel-photo.png';

const log = debug('ParentReviewSection');

/*
 * ParentReviewSection — Step 6 of 8 ("Review & Consent") in the parent sign-up
 * wizard. Figma main frame: 2943:57781 (content nodes 2944:680xx / 2973:80xxx).
 * FULL-WIDTH — ParentOnboardingLayout hides the gold right panel for this route.
 *
 * Read-only review of everything captured across the wizard (identity, ID,
 * contact, security, linked ward), followed by 3 required consent checkboxes.
 * The CTA is gated: disabled until all 3 are accepted, then navigates to the
 * next step.
 *
 * Route: /onboarding/parent-review
 */

// ── small glyphs (hand-crafted micro-icons — bounding box + stroke only) ─────
const LockGlyph = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <rect x="2" y="5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
    <path d="M3.5 5V3.7a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const LinkGlyph = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <path
      d="M4.3 6.7L6.7 4.3M4 3.2l.8-.8a2 2 0 0 1 2.8 2.8l-.8.8M7 7.8l-.8.8a2 2 0 0 1-2.8-2.8l.8-.8"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MiniCheck = ({ color }) => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
    <path
      d="M1.8 4.6l1.8 1.8L7.2 2.5"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── EDIT link — Figma 2973:80602 ────────────────────────────────────────────
const EditLink = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-[19px] items-center rounded-[6px] border px-[7px] font-sans font-semibold uppercase"
    style={{ borderColor: '#faf4e8', color: '#c8951a', fontSize: 10, letterSpacing: '1px' }}
  >
    Edit
  </button>
);

// ── Section header: icon + label (+ edit) + divider — Figma 2973:80557 etc. ──
const SectionHeader = ({ icon, label, onEdit }) => (
  <div className="flex w-full items-center gap-[8px]">
    <span className="flex items-center gap-[8px]" style={{ color: '#babab7' }}>
      <span className="flex [&>svg]:size-[11px]">{icon}</span>
      <span
        className="whitespace-nowrap font-sans font-bold uppercase"
        style={{ fontSize: 9, letterSpacing: '1px', color: '#babab7' }}
      >
        {label}
      </span>
    </span>
    {onEdit && <EditLink onClick={onEdit} />}
    <span className="h-px flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
  </div>
);

// ── 32px amber icon box for verification fields — Figma 2973:80607 ──────────
const FieldIconBox = ({ icon }) => (
  <span
    className="flex size-[32px] items-center justify-center rounded-[6px] [&>svg]:size-[14px]"
    style={{ backgroundColor: '#faf4e8', color: '#b48617' }}
  >
    {icon}
  </span>
);

// ── status badges ───────────────────────────────────────────────────────────
const VerifiedBadge = () => (
  <span
    className="flex items-center gap-[5px] rounded-[4px] border px-[7px] py-[3px]"
    style={{ backgroundColor: '#faf4e8', borderColor: 'rgba(245,189,79,0.2)' }}
  >
    <MiniCheck color="#b48617" />
    <span className="font-sans font-semibold" style={{ fontSize: 9, color: '#b48617' }}>
      Verified
    </span>
  </span>
);

const OtpBadge = () => (
  <span
    className="flex w-fit items-center gap-[5px] rounded-[4px] border px-[7px] py-[2px]"
    style={{ backgroundColor: '#faf4e8', borderColor: '#f5bd4f' }}
  >
    <MiniCheck color="#c8951a" />
    <span
      className="font-sans font-bold uppercase"
      style={{ fontSize: 9, color: '#c8951a', letterSpacing: '1px' }}
    >
      OTP verified
    </span>
  </span>
);

const LinkedBadge = () => (
  <span
    className="flex shrink-0 items-center gap-[4px] rounded-[8px] px-[14px] py-[6px]"
    style={{ backgroundColor: '#387440', boxShadow: '0px 3px 0px #2a5730' }}
  >
    <MiniCheck color="#ffffff" />
    <span className="font-sans font-semibold text-white" style={{ fontSize: 12 }}>
      Linked
    </span>
  </span>
);

// Password dots — Figma 2973:80673 (8 × 7px #111 rounded squares)
const PasswordDots = () => (
  <span className="flex items-center gap-[3px]">
    {Array.from({ length: 8 }).map((_, i) => (
      <span key={i} className="size-[7px] rounded-[3.5px]" style={{ backgroundColor: '#111' }} />
    ))}
  </span>
);

// ── Main component ──────────────────────────────────────────────────────────

const ParentReviewSection = () => {
  log('mount');

  const navigate = useNavigate();
  const [consent, setConsent] = useState({ access: false, rights: false, data: false });
  // Which consent pop-up is open: null | 'optout' | 'rights' | 'data'.
  const [activeModal, setActiveModal] = useState(null);
  const allAccepted = consent.access && consent.rights && consent.data;

  const openModal = (key) => (e) => {
    e.preventDefault();
    log('open consent modal', key);
    setActiveModal(key);
  };

  // Accepting inside a modal ticks the matching checkbox and closes it.
  const acceptConsent = (key) => () => {
    log('consent accepted via modal', key);
    setConsent((c) => ({ ...c, [key]: true }));
    setActiveModal(null);
  };

  const toggle = (key) => (e) => {
    log('consent toggle', key, e.target.checked);
    setConsent((c) => ({ ...c, [key]: e.target.checked }));
  };

  const handleEdit = (target) => () => {
    log('edit clicked →', target);
    navigate(target);
  };

  const handleContinue = () => {
    if (!allAccepted) {
      log('continue blocked — not all consents accepted');
      return;
    }
    log('all accepted — navigating to parent-done');
    navigate('/onboarding/parent-done');
  };

  return (
    <>
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-12 md:py-20">
        <div className="flex w-full max-w-[897px] flex-col items-center gap-6">
          {/* Step badge — Figma 2947:75882 — shared Captions (amber parent theme) */}
          <Captions
            variant="amber"
            items={[{ index: '06', label: 'Review & Consent' }]}
            currentIndex={0}
          />

          {/* Headline — Figma 2944:68077 */}
          <h1
            className="text-center font-display font-normal"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 4rem)',
              lineHeight: 1.094,
              letterSpacing: '-0.64px',
              color: '#111',
            }}
          >
            Review your{' '}
            <span className="italic" style={{ color: '#c8951a' }}>
              details
            </span>
          </h1>

          {/* Subtitle — Figma 2944:68079 */}
          <p
            className="max-w-[490px] text-center font-sans"
            style={{
              fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
              lineHeight: 1.5,
              letterSpacing: '0.2px',
              color: '#737373',
            }}
          >
            Take a moment to check your details before signing off. Use the edit links to correct
            anything before you proceed.
          </p>

          {/* WavyDivider — Figma 2944:68080 */}
          <WavyDivider />

          {/* ── Review card — Figma 2973:80541 ── */}
          <div
            className="flex w-full flex-col gap-6 rounded-[24px] border bg-white p-6"
            style={{
              borderColor: 'rgba(0,0,0,0.08)',
              boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.13)',
            }}
          >
            {/* Section 1: Your Identity — Figma 2973:80555 */}
            <section className="flex flex-col gap-[12px]">
              <SectionHeader icon={<UserIcon />} label="Your Identity" />
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[18px]">
                  <PreviewField className="flex-1" label="First name" value="Abena" height={49} />
                  <PreviewField
                    className="flex-1"
                    label="Middle name"
                    value="—"
                    muted
                    height={49}
                  />
                  <PreviewField className="flex-1" label="Last name" value="Mensah" height={49} />
                </div>
                <div className="flex gap-[18px]">
                  <PreviewField
                    className="flex-1"
                    label="Date of birth"
                    value="12 March 2003"
                    height={49}
                  />
                  <PreviewField className="flex-1" label="Gender" value="Female" height={49} />
                  <PreviewField
                    className="flex-1"
                    label="Relationship to ward"
                    value="Mother"
                    height={49}
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Identity & verification — Figma 2973:80592 */}
            <section className="flex flex-col gap-[12px]">
              <SectionHeader
                icon={<IdCardIcon />}
                label="Identity & verification"
                onEdit={handleEdit('/onboarding/parent-verification')}
              />
              <div className="flex flex-col gap-[15px]">
                <PreviewField
                  className="w-full"
                  label="Ghana Card Number"
                  value="GHA-●●●●●●●●●-●"
                  valueColor="#575755"
                  height={52}
                  leftIcon={<FieldIconBox icon={<IdCardIcon />} />}
                  trailing={<VerifiedBadge />}
                />
                <PreviewField
                  className="w-full"
                  label="Profile photo"
                  value="✓ Uploaded & confirmed"
                  valueColor="#b48617"
                  height={52}
                  leftIcon={<FieldIconBox icon={<UserIcon />} />}
                />
              </div>
            </section>

            {/* Section 3: Contact details — Figma 2973:80627 */}
            <section className="flex flex-col gap-[12px]">
              <SectionHeader
                icon={<MailIcon />}
                label="Contact details"
                onEdit={handleEdit('/onboarding/parent-contact')}
              />
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[18px]">
                  <PreviewField
                    className="flex-1"
                    label="Phone number"
                    valueColor="#575755"
                    height={65}
                    value={
                      <span className="flex flex-col gap-[6px]">
                        <span>+233 20 ••• ••• ••2</span>
                        <OtpBadge />
                      </span>
                    }
                  />
                  <PreviewField
                    className="flex-1"
                    label="WhatsApp"
                    value="Same as phone"
                    muted
                    height={65}
                  />
                </div>
                <div className="flex gap-[18px]">
                  <PreviewField
                    className="flex-1"
                    label="Email address"
                    value="a.mensah@gmail.com"
                    muted
                    height={48}
                  />
                  <PreviewField
                    className="flex-1"
                    label="Preferred contact"
                    value="Phone & WhatsApp"
                    valueColor="#575755"
                    height={48}
                  />
                </div>
              </div>
            </section>

            {/* Section 4: Account Security — Figma 2973:80658 */}
            <section className="flex flex-col gap-[12px]">
              <SectionHeader
                icon={<LockGlyph />}
                label="Account Security"
                onEdit={handleEdit('/onboarding/parent-security')}
              />
              <div className="flex gap-[18px]">
                <PreviewField
                  className="flex-1"
                  label="Password"
                  value={<PasswordDots />}
                  height={48}
                />
                <PreviewField
                  className="flex-1"
                  label="Preferred contact"
                  value="Phone & WhatsApp"
                  valueColor="#575755"
                  height={48}
                />
              </div>
            </section>

            {/* Section 5: Linked Ward — Figma 2973:80685 */}
            <section className="flex flex-col gap-[12px]">
              <SectionHeader
                icon={<LinkGlyph />}
                label="Linked Ward"
                onEdit={handleEdit('/onboarding/parent-link-ward')}
              />
              {/* Ward card — Figma 2973:80697 */}
              <div
                className="flex w-full items-center justify-between rounded-[10px] px-[13px]"
                style={{ minHeight: 99, backgroundColor: '#f8f8f4' }}
              >
                <div className="flex items-center gap-[16px]">
                  <span
                    className="block size-[72px] shrink-0 overflow-hidden rounded-full border-2"
                    style={{
                      borderColor: '#c1d4c4',
                      boxShadow:
                        '0px 2px 2px -1px rgba(27,36,44,0.04), 0px 2px 8px -1px rgba(27,36,44,0.08)',
                    }}
                  >
                    <img
                      src={wardAvatar}
                      alt="Ward"
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </span>
                  <div className="flex flex-col gap-[4px]">
                    <p
                      className="font-sans font-semibold"
                      style={{
                        fontSize: 16,
                        color: '#575755',
                        letterSpacing: '0.2px',
                        lineHeight: '24px',
                      }}
                    >
                      Abena Mensah
                    </p>
                    <span
                      className="inline-flex w-fit items-center justify-center rounded-[4px] border px-[8px] py-[3px]"
                      style={{ backgroundColor: '#ebf1ec', borderColor: '#c1d4c4' }}
                    >
                      <span
                        className="font-sans font-semibold"
                        style={{
                          fontSize: 10,
                          color: '#2a5730',
                          letterSpacing: '0.2px',
                          lineHeight: '16px',
                        }}
                      >
                        Age 16 · JHS 3 · Achimota School ·&nbsp; Ghanaian
                      </span>
                    </span>
                  </div>
                </div>
                <LinkedBadge />
              </div>
            </section>
          </div>

          {/* ── Consent block — Figma 2944:68279 ── */}
          <div className="flex w-full flex-col gap-[16px]">
            {/* Header row — Figma 2944:68280 */}
            <div className="flex items-center gap-[8px]">
              <span
                className="whitespace-nowrap font-sans font-bold uppercase"
                style={{ fontSize: 10, color: '#babab7', letterSpacing: '1px' }}
              >
                Required agreements — all 3 must be accepted
              </span>
              <span className="h-px flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
            </div>

            {/* Checkboxes — Figma 2944:68287 / 68288 / 68381 */}
            <div className="flex flex-col gap-[16px]">
              <Checkbox
                checked={consent.access}
                onChange={toggle('access')}
                label={
                  <>
                    I understand my ward has immediate platform access.{' '}
                    <a
                      href="#"
                      onClick={openModal('optout')}
                      className="font-semibold underline"
                      style={{ color: '#387440' }}
                    >
                      How the opt-out model works
                    </a>
                  </>
                }
              />
              <Checkbox
                checked={consent.rights}
                onChange={toggle('rights')}
                label={
                  <>
                    I have read and accept the Parent Rights Policy.{' '}
                    <a
                      href="#"
                      onClick={openModal('rights')}
                      className="font-semibold underline"
                      style={{ color: '#387440' }}
                    >
                      Read Parent Rights Policy
                    </a>
                  </>
                }
              />
              <Checkbox
                checked={consent.data}
                onChange={toggle('data')}
                label={
                  <>
                    I consent to Ghana Talent Hub processing my data.{' '}
                    <a
                      href="#"
                      onClick={openModal('data')}
                      className="font-semibold underline"
                      style={{ color: '#387440' }}
                    >
                      Learn more about data processing
                    </a>
                    <span style={{ color: '#387440' }}>.</span>
                  </>
                }
              />
            </div>

            {/* Data-protection notice — Figma 2944:68289 */}
            <div
              className="flex w-full flex-col gap-[6px] rounded-[12px] border px-[20px] py-[13px]"
              style={{ backgroundColor: 'rgba(234,239,251,0.4)', borderColor: '#e0e7f9' }}
            >
              <p
                className="font-sans font-bold"
                style={{
                  fontSize: 12,
                  color: '#3062d4',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                }}
              >
                Your data is protected under Ghanaian law
              </p>
              <p
                className="font-sans"
                style={{
                  fontSize: 12,
                  color: '#3062d4',
                  letterSpacing: '0.2px',
                  lineHeight: '18px',
                }}
              >
                Ghana Talent Hub complies with the Data Protection Act (Act 843, 2012). You can
                withdraw consent, request access to your data, or request deletion at any time from
                Settings → Privacy.
              </p>
            </div>
          </div>

          {/* ── CTA — Figma 2944:68294 — gated on all 3 consents ── */}
          {allAccepted ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              rightIcon={<ArrowRightIcon />}
              onClick={handleContinue}
            >
              Accept All Three To Continue
            </Button>
          ) : (
            <div
              className="flex w-full items-center justify-center gap-[8px] rounded-[14px] border-2 px-[40px] py-[16px]"
              style={{
                backgroundColor: '#bfbfbf',
                borderColor: '#ccc',
                boxShadow: '0px 4px 0px rgba(191,191,191,0.8)',
                cursor: 'not-allowed',
              }}
              aria-disabled="true"
            >
              <span
                className="font-sans font-bold text-white"
                style={{ fontSize: 16, letterSpacing: '0.1px', lineHeight: '24px' }}
              >
                Accept All Three To Continue
              </span>
              <span className="text-white">
                <ArrowRightIcon />
              </span>
            </div>
          )}

          {/* Footer */}
          <p className="font-sans text-sm" style={{ color: '#737373' }}>
            Already Have an account?{' '}
            <Link
              to="/onboarding/parent-login"
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: '#387440' }}
              onClick={() => log('log in instead clicked')}
            >
              Log in Instead
            </Link>
          </p>
        </div>
      </div>

      {/* ── Consent pop-ups — opened from the checkbox links ── */}
      {activeModal === 'optout' && (
        <OptOutModal onClose={() => setActiveModal(null)} onAccept={acceptConsent('access')} />
      )}
      {activeModal === 'rights' && (
        <ParentRightsModal
          onClose={() => setActiveModal(null)}
          onAccept={acceptConsent('rights')}
        />
      )}
      {activeModal === 'data' && (
        <DataProcessingModal
          onClose={() => setActiveModal(null)}
          onAccept={acceptConsent('data')}
        />
      )}
    </>
  );
};

export default ParentReviewSection;
