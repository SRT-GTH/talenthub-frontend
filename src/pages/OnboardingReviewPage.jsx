import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import OnboardingHeader from '../components/shared/OnboardingHeader.jsx';
import {
  ArrowRightIcon,
  IdCardIcon,
  MapPinIcon,
  MortarboardIcon,
  PencilEditIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SummaryPhotoIcon,
  UserIcon,
} from '../components/shared/assets.jsx';
import TermsModal from '../components/shared/TermsModal.jsx';
import PrivacyPolicyModal from '../components/shared/PrivacyPolicyModal.jsx';
import DataProcessingConsentModal from '../components/shared/DataProcessingConsentModal.jsx';
import TermsAcceptedModal from '../components/shared/TermsAcceptedModal.jsx';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('OnboardingReviewPage');

/*
 * OnboardingReviewPage — Step 07 of the talent onboarding flow.
 * Maps to user story US-1.1.1-07 ("Review onboarding data and accept terms").
 * Route: /onboarding/review.
 *
 * Figma sources (file Bin8roWL8sloyc36IgFMuT):
 *   2788:14548 — default (disabled CTA, no checkboxes ticked)
 *   2837:28039 — variant A (both checkboxes ticked, CTA still disabled)
 *   2837:28481 — variant B (pressed/active CTA after all 3 accepted)
 *   2837:27365 — overlay "Terms Accepted" success modal
 *   2837:28954 — Terms & Conditions modal
 *   2846:29512 — Privacy Policy modal
 *   2846:30205 — Data Processing Consent modal
 *
 * Single-column page (no right panel) — differs from contact/address.
 * Decoration is the same 4 green corner orbs as those screens.
 *
 * Acceptance state machine:
 *   - Each underlined inline link opens its own modal.
 *   - Each modal exposes "I understand & accept" -> sets that flag true.
 *   - Checkbox 1 (Terms + Privacy combo) shows ticked when BOTH terms
 *     and privacy are accepted.
 *   - Checkbox 2 (Data Processing) shows ticked when consent is accepted.
 *   - The primary CTA flips from disabled grey to brand-green when all
 *     three are accepted. Clicking the enabled CTA mounts the
 *     TermsAcceptedModal (success overlay) before navigation.
 */

// ---- mock data (replaces real talent state) ---------------------------

// Until the talent profile store is wired up, render the same values
// shown in the Figma frames so the page reads truthfully against the
// design. Pull these from Redux once the onboarding slice lands.
const MOCK_PROFILE = {
  name: 'Abena Mensah',
  role: 'Student',
  avatarUrl: null,
  score: 78,
  tier: 'Gold Tier',
  personal: {
    firstName: 'Abena',
    middleName: '—',
    lastName: 'Mensah',
    dob: '12 March 2003',
    gender: 'Female',
    nationality: '🇬🇭 Ghanaian',
  },
  identity: {
    ghanaCardMasked: 'GHA-●●●●●●●●●-●',
    photoConfirmed: true,
  },
  contact: {
    phoneMasked: '+233 20 ••• ••• ••2',
    phoneVerified: true,
    whatsapp: 'Same as phone',
    email: 'a.mensah@gmail.com',
    preferred: 'Phone & WhatsApp',
  },
  address: {
    region: 'Ashanti Region',
    district: 'Kumasi Metropolitan',
    town: 'Kumasi',
    digital: 'AK-039-4718',
    community: 'Adum',
    landmark: 'Opp. Kejetia Market',
  },
  education: {
    level: 'University (Degree)',
    grade: 'Year 2',
    curriculum: 'National Accreditation Board',
    graduation: 'Class of 2028',
    institution: 'KNUST — Kwame Nkrumah University of Science and Technology',
    confirmed: true,
  },
};

// ---- small atoms ------------------------------------------------------

// Uppercase 9px Bold tracking-1 grey label that prefixes every value
// cell ("FIRST NAME", "REGION", etc.). Matches Figma cell-label spec.
const CellLabel = ({ children }) => (
  <span
    className="block font-bold uppercase text-[#BABAB7]"
    style={{ fontSize: 9, lineHeight: 'normal', letterSpacing: '0.6px' }}
  >
    {children}
  </span>
);

// Value cell — light cream fill with the label up top and the value
// below. `muted` reduces weight to Regular and dims the text (used for
// "—" empty values and soft optional rows like "Same as phone").
const Cell = ({ label, value, muted = false, className = '', children }) => (
  <div className={`flex flex-col gap-1 rounded-[10px] bg-[#F8F8F4] px-3 py-3 ${className}`}>
    <CellLabel>{label}</CellLabel>
    {children ?? (
      <span
        className={
          muted
            ? 'text-[14px] leading-[16.9px] text-[#70706E]'
            : 'font-semibold text-[14px] leading-[16.9px] text-[#575755]'
        }
      >
        {value}
      </span>
    )}
  </div>
);

// Inline "EDIT" pill that hangs to the right of every section header
// and links back to that step's route so users can fix mistakes.
const EditChip = ({ to }) => (
  <Link
    to={to}
    className="inline-flex h-[19px] items-center rounded-[6px] border px-2 font-semibold uppercase text-brand-green transition-colors hover:bg-brand-green-light"
    style={{
      borderColor: '#C1D4C4',
      fontSize: 10,
      letterSpacing: '1px',
      lineHeight: 'normal',
    }}
  >
    Edit
  </Link>
);

// Reusable section header strip — icon + uppercase title + EDIT chip +
// 1px hairline filling the remaining width. The icon is a stroke SVG
// from `assets.jsx` sized down via `text-[#BABAB7]` so we don't need
// new 11×11 variants.
const SectionHeader = ({ icon, title, editTo }) => (
  <div className="flex items-center gap-3">
    <span className="inline-flex size-[14px] shrink-0 items-center justify-center text-[#BABAB7]">
      {icon}
    </span>
    <span
      className="font-bold uppercase text-[#BABAB7]"
      style={{ fontSize: 9, letterSpacing: '1px', lineHeight: 'normal' }}
    >
      {title}
    </span>
    <EditChip to={editTo} />
    <div className="ml-1 h-px flex-1" style={{ background: 'rgba(0,0,0,0.06)' }} />
  </div>
);

// Verified / OTP verified / Confirmed badge — small light-green pill
// with a 8×8 check glyph. Re-used in three sections.
const VerifiedBadge = ({ label }) => (
  <span
    className="inline-flex h-[16px] items-center gap-1 rounded-[4px] px-1.5"
    style={{
      background: '#E8F2ED',
      border: '1px solid rgba(29,124,77,0.2)',
    }}
  >
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path
        d="M2 4.2 3.3 5.5 6 2.8"
        stroke="#1D7C4D"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="font-semibold text-[#1D7C4D]" style={{ fontSize: 9, lineHeight: '11.7px' }}>
      {label}
    </span>
  </span>
);

// ---- card sub-blocks --------------------------------------------------

const CardHeaderStrip = ({ profile, onEditProfile }) => (
  <div
    className="flex items-center justify-between px-6"
    style={{
      height: 102,
      borderBottom: '1px solid rgba(0,0,0,0.07)',
    }}
  >
    <div className="flex items-center gap-4">
      {/* Avatar — 72×72 circle, cream border, drop-shadow. Falls back
          to user-glyph until the talent's photo loads. */}
      <span
        className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F2F2EE]"
        style={{
          border: '2px solid #C1D4C4',
          boxShadow: '0 2px 8px -1px rgba(27,36,44,0.08), 0 2px 2px -1px rgba(27,36,44,0.04)',
        }}
        aria-hidden="true"
      >
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" className="size-full object-cover" />
        ) : (
          <UserIcon />
        )}
      </span>

      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-[#575755]" style={{ fontSize: 16, lineHeight: '24px' }}>
          {profile.name}
        </span>
        <span
          className="inline-flex w-fit items-center rounded-[4px] px-2 py-0.5"
          style={{
            background: '#EBF1EC',
            border: '1px solid #C1D4C4',
          }}
        >
          <span
            className="font-semibold text-[#2A5730]"
            style={{ fontSize: 10, lineHeight: '16px' }}
          >
            {profile.role}
          </span>
        </span>
      </div>
    </div>

    <button
      type="button"
      onClick={onEditProfile}
      className="inline-flex h-[31px] items-center gap-1.5 rounded-[4px] border bg-white px-2 transition-colors hover:bg-brand-green-light"
      style={{ borderColor: '#C1D4C4' }}
    >
      <PencilEditIcon />
      <span className="font-medium text-brand-green" style={{ fontSize: 12, lineHeight: '20px' }}>
        Edit profile
      </span>
    </button>
  </div>
);

const TalentScoreStrip = ({ score, tier }) => {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div
      className="mx-6 mt-6 flex items-center gap-3 rounded-[8px] px-4"
      style={{
        height: 60,
        background: 'rgba(235,241,236,0.5)',
        border: '1px solid #C1D4C4',
      }}
    >
      <span
        className="font-display italic text-brand-green"
        style={{ fontSize: 32, lineHeight: '32px', letterSpacing: '-2px' }}
      >
        {score}
      </span>
      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-[#2A5730]" style={{ fontSize: 10, lineHeight: '16px' }}>
          Talent Score
        </span>
        <div className="h-[5px] w-full overflow-hidden rounded-[3px] bg-[#E1EAE2]">
          <div className="h-full rounded-[3px] bg-brand-green" style={{ width: `${clamped}%` }} />
        </div>
      </div>
      <span
        className="inline-flex items-center rounded-[4px] px-2 py-0.5"
        style={{ background: '#F7EFDD' }}
      >
        <span
          className="font-medium"
          style={{ fontSize: 10, lineHeight: '16px', color: '#C8951A' }}
        >
          {tier}
        </span>
      </span>
    </div>
  );
};

const PersonalSection = ({ data }) => (
  <div className="mx-6 mt-6 flex flex-col gap-3">
    <SectionHeader
      icon={<UserIcon />}
      title="Personal Information"
      editTo={ROUTES.onboardingPersonalInfo}
    />
    {/* Two rows of three cells each. Stack vertically on narrow viewports. */}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Cell label="First name" value={data.firstName} />
      <Cell label="Middle name" value={data.middleName} muted />
      <Cell label="Last name" value={data.lastName} />
      <Cell label="Date of birth" value={data.dob} />
      <Cell label="Gender" value={data.gender} />
      <Cell label="Nationality" value={data.nationality} />
    </div>
  </div>
);

const IdentitySection = ({ data }) => (
  <div className="mx-6 mt-6 flex flex-col gap-3">
    <SectionHeader
      icon={<IdCardIcon />}
      title="Identity & Verification"
      editTo={ROUTES.onboardingPersonalInfo}
    />

    {/* Row A — Ghana Card masked + Verified badge */}
    <div
      className="flex items-center gap-3 rounded-[10px] bg-[#F8F8F4] px-3 py-2.5"
      style={{ minHeight: 52 }}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-brand-green-light"
        aria-hidden="true"
      >
        <span className="inline-flex size-[14px] items-center justify-center text-brand-green">
          <IdCardIcon />
        </span>
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        <CellLabel>Ghana Card Number</CellLabel>
        <span
          className="font-bold text-[#575755]"
          style={{ fontSize: 12, letterSpacing: '1px', lineHeight: '16px' }}
        >
          {data.ghanaCardMasked}
        </span>
      </div>
      <VerifiedBadge label="Verified" />
    </div>

    {/* Row B — Profile photo confirmed */}
    <div
      className="flex items-center gap-3 rounded-[10px] bg-[#F8F8F4] px-3 py-2.5"
      style={{ minHeight: 52 }}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-brand-green-light"
        aria-hidden="true"
      >
        <span className="inline-flex size-[14px] items-center justify-center text-brand-green">
          <SummaryPhotoIcon />
        </span>
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        <CellLabel>Profile photo</CellLabel>
        <span
          className="inline-flex items-center gap-1 font-semibold text-[#1D7C4D]"
          style={{ fontSize: 12, lineHeight: '16px' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M3 6.2 5 8l4-4.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Uploaded & confirmed
        </span>
      </div>
    </div>
  </div>
);

const ContactSection = ({ data }) => (
  <div className="mx-6 mt-6 flex flex-col gap-3">
    <SectionHeader icon={<PhoneIcon />} title="Contact Details" editTo={ROUTES.onboardingContact} />

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {/* Phone — masked value with OTP-verified badge underneath the value */}
      <div
        className="flex flex-col gap-1 rounded-[10px] bg-[#F8F8F4] px-3 py-2.5"
        style={{ minHeight: 65 }}
      >
        <CellLabel>Phone number</CellLabel>
        <span
          className="font-bold text-[#575755]"
          style={{ fontSize: 14, letterSpacing: '1px', lineHeight: '16.9px' }}
        >
          {data.phoneMasked}
        </span>
        {data.phoneVerified && (
          <span className="mt-1">
            <VerifiedBadge label="OTP verified" />
          </span>
        )}
      </div>
      <Cell label="WhatsApp" value={data.whatsapp} muted />

      <Cell label="Email address" value={data.email} muted />
      <Cell label="Preferred contact" value={data.preferred} />
    </div>
  </div>
);

const AddressSection = ({ data }) => (
  <div
    className="mx-6 mt-6 flex flex-col gap-3 pb-6"
    style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
  >
    <SectionHeader icon={<MapPinIcon />} title="Address" editTo={ROUTES.onboardingAddress} />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Cell label="Region" value={data.region} />
      <Cell label="District" value={data.district} />
      <Cell label="Town / City" value={data.town} />
      <Cell label="Digital address" value={data.digital} />
      <Cell label="Community / Area" value={data.community} />
      <Cell label="Nearby landmark" value={data.landmark} muted />
    </div>
  </div>
);

const EducationSection = ({ data }) => (
  <div className="mx-6 mt-6 flex flex-col gap-3 pb-6">
    <SectionHeader
      icon={<MortarboardIcon />}
      title="Education"
      // Education step not yet built — fall back to the address step
      // (last completed page) so the Edit chip never 404s.
      editTo={ROUTES.onboardingAddress}
    />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Cell label="Education level" value={data.level} />
      <Cell label="Grade / Year" value={data.grade} />
      <Cell label="Curriculum" value={data.curriculum} />
      <Cell label="Expected graduation" value={data.graduation} />
    </div>

    {/* Institution — full-width row with a "Confirmed" badge on the right */}
    <div
      className="flex items-start justify-between gap-3 rounded-[10px] bg-[#F8F8F4] px-3 py-2.5"
      style={{ minHeight: 50 }}
    >
      <div className="flex flex-col gap-0.5">
        <CellLabel>Institution</CellLabel>
        <span
          className="font-semibold text-[#575755]"
          style={{ fontSize: 14, lineHeight: '16.9px' }}
        >
          {data.institution}
        </span>
      </div>
      {data.confirmed && (
        <span className="mt-0.5">
          <VerifiedBadge label="Confirmed" />
        </span>
      )}
    </div>
  </div>
);

// ---- consent block ----------------------------------------------------

const ConsentCheckbox = ({ checked, onToggle, children }) => {
  // Visual box mirrors the design-system Checkbox at 20×20 with the
  // shelf-collapse press animation. We don't use the form/Checkbox here
  // because the row's label contains inline links that open modals,
  // and the native `<input>` inside Checkbox would steal click focus
  // away from those links.
  return (
    <label className="flex cursor-pointer items-start gap-3 select-none">
      <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only peer" />
      <span
        aria-hidden="true"
        className="relative mt-px inline-flex size-5 shrink-0 items-center justify-center rounded-[6px] transition-[background-color,border-color,box-shadow,transform] duration-100 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-green-light-active peer-focus-visible:ring-offset-2"
        style={
          checked
            ? {
                background: '#387440',
                border: '1.5px solid #19341D',
                boxShadow: '0 1.2px 0 0 #19341D',
              }
            : {
                background: '#FFFFFF',
                border: '1.5px solid #CCCCCC',
                boxShadow: '0 2px 0 0 #CCCCCC',
              }
        }
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12.5l4.5 4.5L19 7"
              stroke="#FFFEFC"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className="text-[14px] text-[#575755]"
        style={{ lineHeight: '20px', letterSpacing: '0.2px' }}
      >
        {children}
      </span>
    </label>
  );
};

// The two checkbox labels carry inline "open modal" triggers. Clicking
// a link uses preventDefault + stopPropagation so the surrounding
// <label> doesn't also toggle the checkbox.
const InlineLink = ({ onClick, children }) => (
  <button
    type="button"
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    }}
    className="font-semibold text-brand-green underline-offset-2 hover:underline"
    style={{
      fontSize: 14,
      lineHeight: '24px',
      letterSpacing: '0.2px',
      textDecoration: 'underline',
    }}
  >
    {children}
  </button>
);

const ConsentBlock = ({
  termsAccepted,
  privacyAccepted,
  consentAccepted,
  onToggleTerms,
  onToggleConsent,
  onOpenTerms,
  onOpenPrivacy,
  onOpenConsent,
}) => {
  const firstRowChecked = termsAccepted && privacyAccepted;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span
          className="font-bold uppercase text-[#BABAB7]"
          style={{ fontSize: 10, letterSpacing: '1px', lineHeight: 'normal' }}
        >
          Required agreements — all 3 must be accepted
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.07)' }} />
        <span aria-hidden="true" className="font-bold" style={{ fontSize: 10, color: '#C0392B' }}>
          *
        </span>
      </div>

      <ConsentCheckbox checked={firstRowChecked} onToggle={onToggleTerms}>
        I agree to Ghana Talent Hub&apos;s{' '}
        <InlineLink onClick={onOpenTerms}>Terms &amp; Conditions</InlineLink> and{' '}
        <InlineLink onClick={onOpenPrivacy}>Privacy Policy</InlineLink>.
      </ConsentCheckbox>

      <ConsentCheckbox checked={consentAccepted} onToggle={onToggleConsent}>
        I consent to Ghana Talent Hub processing my data for career matching and guidance.{' '}
        <InlineLink onClick={onOpenConsent}>Learn more about data processing</InlineLink>.
      </ConsentCheckbox>

      {/* DPA disclosure callout — blue tint, two-line copy from Figma. */}
      <div
        className="rounded-[12px] px-5 py-3"
        style={{
          background: 'rgba(234,239,251,0.4)',
          border: '1px solid #E0E7F9',
        }}
      >
        <p
          className="font-bold text-[#3062D4]"
          style={{ fontSize: 12, lineHeight: '20px', letterSpacing: '0.1px' }}
        >
          Your data is protected under Ghanaian law
        </p>
        <p
          className="mt-1 text-[#3062D4]"
          style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '0.2px' }}
        >
          Ghana Talent Hub complies with the Data Protection Act (Act 843, 2012). You can withdraw
          consent, request access to your data, or request deletion at any time from Settings →
          Privacy.
        </p>
      </div>
    </div>
  );
};

// ---- background decoration -------------------------------------------

// Same green-orb corner motif used on the Address / Contact backgrounds,
// minus the right-side panel + tilted-photo column. Decorative only —
// hidden from assistive tech.
const ReviewBackgroundOrbs = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="absolute size-[473px] rounded-full opacity-50 blur-[120px]"
      style={{ top: -160, left: -160, background: '#C1D4C4' }}
    />
    <div
      className="absolute size-[473px] rounded-full opacity-50 blur-[120px]"
      style={{ top: -160, right: -160, background: '#E1EAE2' }}
    />
    <div
      className="absolute size-[473px] rounded-full opacity-50 blur-[120px]"
      style={{ bottom: -200, left: -160, background: '#E1EAE2' }}
    />
    <div
      className="absolute size-[473px] rounded-full opacity-50 blur-[120px]"
      style={{ bottom: -200, right: -160, background: '#C1D4C4' }}
    />
  </div>
);

// ---- page -------------------------------------------------------------

const OnboardingReviewPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const allAccepted = useMemo(
    () => termsAccepted && privacyAccepted && consentAccepted,
    [termsAccepted, privacyAccepted, consentAccepted]
  );

  // First checkbox label folds two links (Terms + Privacy). Tapping
  // the checkbox itself opens whichever link is still un-accepted so
  // the user is never stuck — accepting both flips the row visually.
  const handleToggleTermsRow = (event) => {
    event?.preventDefault?.();
    log('checkbox 1 toggle; terms=', termsAccepted, 'privacy=', privacyAccepted);
    if (!termsAccepted) {
      setShowTermsModal(true);
    } else if (!privacyAccepted) {
      setShowPrivacyModal(true);
    }
  };

  const handleToggleConsentRow = (event) => {
    event?.preventDefault?.();
    log('checkbox 2 toggle; consent=', consentAccepted);
    if (!consentAccepted) {
      setShowConsentModal(true);
    }
  };

  const handleAcceptTerms = () => {
    log('terms accepted');
    setTermsAccepted(true);
    setShowTermsModal(false);
  };
  const handleAcceptPrivacy = () => {
    log('privacy accepted');
    setPrivacyAccepted(true);
    setShowPrivacyModal(false);
  };
  const handleAcceptConsent = () => {
    log('consent accepted');
    setConsentAccepted(true);
    setShowConsentModal(false);
  };

  const handleSubmit = () => {
    if (!allAccepted) {
      log('submit blocked — not all accepted');
      return;
    }
    log('submit — opening success modal');
    setShowSuccessModal(true);
  };

  const handleContinueAfterSuccess = () => {
    setShowSuccessModal(false);
    // /onboarding/done isn't built yet — fall back to /welcome so the
    // user doesn't hit a 404. Same pattern as OnboardingAddressPage.
    log('continue after success → /welcome (fallback)');
    navigate(ROUTES.onboardingWelcome);
  };

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[1728px] flex-col bg-white">
      <OnboardingHeader currentKey="review" percent={78} />

      <ReviewBackgroundOrbs />

      <section className="relative flex flex-1 justify-center px-6 pt-12 pb-16">
        <div className="flex w-full max-w-[897px] flex-col gap-8">
          {/* Hero */}
          <div className="flex flex-col items-center gap-4 text-center">
            <span
              className="inline-flex items-center gap-2 rounded-[8px] border px-4 py-1"
              style={{ background: '#FFFEFC', borderColor: '#C1D4C4' }}
            >
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{
                  background: '#E1EAE2',
                  border: '1.5px solid #1D7C4D',
                  boxShadow: '0 0 4px #006B3F',
                }}
              />
              <span
                className="font-display italic text-[#B5B5B5]"
                style={{ fontSize: 16, lineHeight: 'normal' }}
              >
                07
              </span>
              <span
                className="text-[12px] leading-[18px] text-brand-green"
                style={{ letterSpacing: '0.2px' }}
              >
                Review &amp; terms
              </span>
            </span>

            <h1
              className="font-display font-normal text-black"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.64px',
              }}
            >
              Almost <span className="italic text-brand-green">there.</span>
            </h1>

            <p
              className="max-w-[554px] text-[16px] leading-6 text-[#737373]"
              style={{ letterSpacing: '0.2px' }}
            >
              Review everything you&apos;ve entered. If anything looks wrong, tap Edit next to the
              section. Then accept the three agreements to activate your account.
            </p>

            <div className="h-px w-[200px]" style={{ background: '#C1D4C4' }} />
          </div>

          {/* Summary card */}
          <div
            className="relative w-full rounded-[24px] bg-white"
            style={{
              boxShadow: '0 2px 8px -1px rgba(27,36,44,0.08), 0 2px 2px -1px rgba(27,36,44,0.04)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            <CardHeaderStrip
              profile={MOCK_PROFILE}
              onEditProfile={() => navigate(ROUTES.onboardingPersonalInfo)}
            />
            <TalentScoreStrip score={MOCK_PROFILE.score} tier={MOCK_PROFILE.tier} />
            <PersonalSection data={MOCK_PROFILE.personal} />
            <IdentitySection data={MOCK_PROFILE.identity} />
            <ContactSection data={MOCK_PROFILE.contact} />
            <AddressSection data={MOCK_PROFILE.address} />
            <EducationSection data={MOCK_PROFILE.education} />
          </div>

          {/* Consent block */}
          <ConsentBlock
            termsAccepted={termsAccepted}
            privacyAccepted={privacyAccepted}
            consentAccepted={consentAccepted}
            onToggleTerms={handleToggleTermsRow}
            onToggleConsent={handleToggleConsentRow}
            onOpenTerms={() => setShowTermsModal(true)}
            onOpenPrivacy={() => setShowPrivacyModal(true)}
            onOpenConsent={() => setShowConsentModal(true)}
          />

          {/* CTA */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={!allAccepted}
            onClick={handleSubmit}
            rightIcon={<ArrowRightIcon />}
            className="w-full"
          >
            {allAccepted ? 'Activate My Account' : 'Accept All Three To Continue'}
          </Button>

          {/* Trust footer + login fallback */}
          <div className="flex flex-col items-center gap-2">
            <p
              className="flex items-center gap-1.5 text-[10px] leading-4 text-[#959592]"
              style={{ letterSpacing: '0.2px' }}
            >
              <ShieldCheckIcon className="text-[#959592]" />
              Data encrypted at rest · Ghana Data Protection Act compliant
            </p>
            <div className="flex items-center gap-2 text-[14px] leading-6">
              <span className="text-[#737373]" style={{ letterSpacing: '0.2px' }}>
                Already Have an account?
              </span>
              <Link
                to={ROUTES.login}
                className="font-semibold text-brand-green underline-offset-2 hover:underline"
                style={{ letterSpacing: '0.1px' }}
              >
                Log in Instead
              </Link>
            </div>
          </div>
        </div>
      </section>

      {showTermsModal && (
        <TermsModal onAccept={handleAcceptTerms} onClose={() => setShowTermsModal(false)} />
      )}
      {showPrivacyModal && (
        <PrivacyPolicyModal
          onAccept={handleAcceptPrivacy}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}
      {showConsentModal && (
        <DataProcessingConsentModal
          onAccept={handleAcceptConsent}
          onClose={() => setShowConsentModal(false)}
        />
      )}
      {showSuccessModal && (
        <TermsAcceptedModal
          onClose={() => setShowSuccessModal(false)}
          onContinue={handleContinueAfterSuccess}
        />
      )}
    </div>
  );
};

export default OnboardingReviewPage;
