import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiErrorNote from '../../components/shared/ApiErrorNote.jsx';
import { getApiErrorMessage } from '../../services/apiErrors.js';
import {
  captureStep,
  activateOnboarding,
  clearOnboardingSession,
  getOnboardingStatus,
} from '../../services/onboarding.api.js';
import { buildReviewProfile } from '../../services/onboardingReview.js';
import { useOnboarding } from '../../hooks/useOnboarding.js';
import Button from '../../components/ui/Button.jsx';
import ClampText from '../../components/ui/ClampText.jsx';
import { StickyActionBar } from '../../components/ui/form';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import {
  ArrowRightIcon,
  LoadingSpinner,
  IdCardIcon,
  SummaryPhotoIcon,
  UserIcon,
} from '../../components/shared/assets.jsx';
import {
  ReviewAddressIcon,
  ReviewCheckIcon,
  ReviewContactIcon,
  ReviewEducationIcon,
  ReviewIdentityIcon,
  ReviewPersonalIcon,
  ShieldCheckIcon,
} from '../../components/sections/talentAuth/talentIcons.jsx';
import TermsModal from '../../components/shared/TermsModal.jsx';
import PrivacyPolicyModal from '../../components/shared/PrivacyPolicyModal.jsx';
import DataProcessingConsentModal from '../../components/shared/DataProcessingConsentModal.jsx';
import TermsAcceptedModal from '../../components/shared/TermsAcceptedModal.jsx';
import { debug } from '../../utils/debug.js';

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
// Profile data comes from the backend session summary (see onboardingReview.js).
// Shown while it loads:
const LOADING_PROFILE = buildReviewProfile(null);

// ---- small atoms ------------------------------------------------------

// Uppercase 9px Bold tracking-1 grey label that prefixes every value
// cell ("FIRST NAME", "REGION", etc.). Matches Figma cell-label spec.
const CellLabel = ({ children }) => (
  <span
    className="block font-bold uppercase text-[#BABAB7] max-md:shrink-0 max-md:text-[12px] max-md:font-medium max-md:normal-case max-md:tracking-normal!"
    style={{ fontSize: 'var(--fs-9)', lineHeight: 'normal', letterSpacing: '0.6px' }}
  >
    {children}
  </span>
);

// Value cell — light cream fill with the label up top and the value
// below. `muted` reduces weight to Regular and dims the text (used for
// "—" empty values and soft optional rows like "Same as phone").
const Cell = ({ label, value, muted = false, className = '', children }) => (
  <div
    className={`flex flex-col gap-1 rounded-[10px] bg-[#F8F8F4] px-3 py-3 max-md:flex-row max-md:items-baseline max-md:justify-between max-md:gap-3 max-md:rounded-none max-md:border-b max-md:border-black/5 max-md:bg-transparent max-md:px-0 max-md:py-2.5 ${className}`}
  >
    <CellLabel>{label}</CellLabel>
    {children ?? (
      <span
        className={
          muted
            ? 'text-[14px] leading-[16.9px] text-[#70706E] max-md:min-w-0 max-md:text-[13px] max-md:text-right max-md:break-words'
            : 'font-semibold text-[14px] leading-[16.9px] text-[#575755] max-md:min-w-0 max-md:text-[13px] max-md:text-right max-md:break-words'
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
    className="relative inline-flex h-[19px] shrink-0 items-center rounded-[6px] border px-2 font-semibold uppercase text-brand-green transition-colors hover:bg-brand-green-light max-md:h-auto max-md:border-0! max-md:px-1 max-md:normal-case max-md:underline max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2 max-md:before:content-['']"
    style={{
      borderColor: '#C1D4C4',
      fontSize: 'var(--fs-10)',
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
      className="min-w-0 font-bold uppercase text-[#BABAB7]"
      style={{ fontSize: 'var(--fs-9)', letterSpacing: '1px', lineHeight: 'normal' }}
    >
      {title}
    </span>
    <EditChip to={editTo} />
    <div className="ml-1 h-px flex-1" style={{ background: 'rgba(0,0,0,0.06)' }} />
  </div>
);

// Verified / OTP verified / Confirmed badge — small light-green pill
// with a 8×8 check glyph. Re-used in three sections.
const VerifiedBadge = ({ label, className = '' }) => (
  <span
    className={`inline-flex h-[16px] shrink-0 items-center gap-1 rounded-[4px] px-1.5 ${className}`}
    style={{
      background: '#E8F2ED',
      border: '1px solid rgba(29,124,77,0.2)',
    }}
  >
    <ReviewCheckIcon />
    <span
      className="font-semibold text-[#1D7C4D]"
      style={{ fontSize: 'var(--fs-9)', lineHeight: '11.7px' }}
    >
      {label}
    </span>
  </span>
);

// ---- card sub-blocks --------------------------------------------------

const CardHeaderStrip = ({ profile, onEditProfile }) => (
  <div
    className="flex items-center justify-between px-6 max-md:h-auto! max-md:gap-3 max-md:px-0 max-md:py-2"
    style={{
      height: 102,
      borderBottom: '1px solid rgba(0,0,0,0.07)',
    }}
  >
    <div className="flex min-w-0 items-center gap-4 max-md:gap-3">
      {/* Avatar — 72×72 circle, cream border, drop-shadow. Falls back
          to user-glyph until the talent's photo loads. */}
      <span
        className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F2F2EE] max-md:size-10"
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
            style={{ fontSize: 'var(--fs-10)', lineHeight: '16px' }}
          >
            {profile.role}
          </span>
        </span>
      </div>
    </div>

    <button
      type="button"
      onClick={onEditProfile}
      className="inline-flex h-[31px] cursor-pointer items-center rounded-[14px] bg-white px-3 max-md:h-8 max-md:shrink-0"
      style={{
        border: '2px solid rgba(28,42,33,0.3)',
        borderTopWidth: 1,
        boxShadow: '0 4px 0 rgba(17,17,17,0.25)',
      }}
    >
      <span
        className="font-sans font-bold text-[#1C2A21]"
        style={{ fontSize: 12, lineHeight: '24px', letterSpacing: '0.1px' }}
      >
        Edit profile
      </span>
    </button>
  </div>
);

const TalentScoreStrip = ({ score, tier }) => {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div
      className="mx-6 mt-6 flex items-center gap-3 rounded-[8px] px-4 max-sm:mx-4 max-md:mx-0 max-md:mt-2 max-md:h-12!"
      style={{
        height: 60,
        background: 'rgba(235,241,236,0.5)',
        border: '1px solid #C1D4C4',
      }}
    >
      <span
        className="font-display italic text-brand-green max-md:text-[24px]!"
        style={{ fontSize: 32, lineHeight: '32px', letterSpacing: '-2px' }}
      >
        {score}
      </span>
      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-[#2A5730]" style={{ fontSize: 'var(--fs-10)', lineHeight: '16px' }}>
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
          style={{ fontSize: 'var(--fs-10)', lineHeight: '16px', color: '#C8951A' }}
        >
          {tier}
        </span>
      </span>
    </div>
  );
};

const PersonalSection = ({ data }) => (
  <div className="mx-6 mt-6 flex flex-col gap-3 max-sm:mx-4 max-md:mx-0 max-md:mt-4 max-md:gap-1">
    <SectionHeader
      icon={<ReviewPersonalIcon />}
      title="Personal Information"
      editTo={'/onboarding/talent/personal-info'}
    />
    {/* Two rows of three cells each. Stack vertically on narrow viewports. */}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 max-md:gap-0">
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
  <div className="mx-6 mt-6 flex flex-col gap-3 max-sm:mx-4 max-md:mx-0 max-md:mt-4 max-md:gap-1">
    <SectionHeader
      icon={<ReviewIdentityIcon />}
      title="Identity & Verification"
      editTo={'/onboarding/talent/personal-info'}
    />

    {/* Row A — Ghana Card masked + Verified badge */}
    <div
      className="flex items-center gap-3 rounded-[10px] bg-[#F8F8F4] px-3 py-2.5 max-md:min-h-0! max-md:rounded-none max-md:border-b max-md:border-black/5 max-md:bg-transparent max-md:px-0 max-sm:flex-wrap"
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
      <div className="flex flex-1 flex-col gap-0.5 max-sm:min-w-[9rem]">
        <CellLabel>Ghana Card Number</CellLabel>
        <span
          className="font-bold text-[#575755] max-sm:break-all"
          style={{ fontSize: 12, letterSpacing: '1px', lineHeight: '16px' }}
        >
          {data.ghanaCardMasked}
        </span>
      </div>
      {data.ghanaCardVerified && <VerifiedBadge label="Verified" className="max-sm:ml-11" />}
    </div>

    {/* Row B — Profile photo confirmed */}
    <div
      className="flex items-center gap-3 rounded-[10px] bg-[#F8F8F4] px-3 py-2.5 max-md:min-h-0! max-md:rounded-none max-md:border-b max-md:border-black/5 max-md:bg-transparent max-md:px-0"
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
          {data.photoUploaded ? 'Uploaded' : 'Not added'}
        </span>
      </div>
    </div>
  </div>
);

const ContactSection = ({ data }) => (
  <div className="mx-6 mt-6 flex flex-col gap-3 max-sm:mx-4 max-md:mx-0 max-md:mt-4 max-md:gap-1">
    <SectionHeader
      icon={<ReviewContactIcon />}
      title="Contact Details"
      editTo={'/onboarding/talent/contact'}
    />

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-md:gap-0">
      {/* Phone — masked value with OTP-verified badge underneath the value */}
      <div
        className="flex flex-col gap-1 rounded-[10px] bg-[#F8F8F4] px-3 py-2.5 max-md:min-h-0! max-md:rounded-none max-md:border-b max-md:border-black/5 max-md:bg-transparent max-md:px-0"
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
    className="mx-6 mt-6 flex flex-col gap-3 max-sm:mx-4 max-md:mx-0 max-md:mt-4 max-md:gap-1 pb-6"
    style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
  >
    <SectionHeader
      icon={<ReviewAddressIcon />}
      title="Address"
      editTo={'/onboarding/talent/address'}
    />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-md:gap-0">
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
  <div className="mx-6 mt-6 flex flex-col gap-3 max-sm:mx-4 max-md:mx-0 max-md:mt-4 max-md:gap-1 pb-6">
    <SectionHeader
      icon={<ReviewEducationIcon />}
      title="Education"
      editTo={'/onboarding/talent/education'}
    />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-md:gap-0">
      <Cell label="Education level" value={data.level} />
      <Cell label="Grade / Year" value={data.grade} />
      <Cell label="Curriculum" value={data.curriculum} />
      <Cell label="Expected graduation" value={data.graduation} />
    </div>

    {/* Institution — full-width row with a "Confirmed" badge on the right */}
    <div
      className="flex items-start justify-between gap-3 rounded-[10px] bg-[#F8F8F4] px-3 py-2.5 max-md:min-h-0! max-md:rounded-none max-md:border-b max-md:border-black/5 max-md:bg-transparent max-md:px-0"
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
          style={{ fontSize: 'var(--fs-10)', letterSpacing: '1px', lineHeight: 'normal' }}
        >
          Required agreements — all 3 must be accepted
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.07)' }} />
        <span
          aria-hidden="true"
          className="font-bold"
          style={{ fontSize: 'var(--fs-10)', color: '#C0392B' }}
        >
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
        <ClampText
          lines={2}
          className="mt-1 text-[12px] leading-[18px] tracking-[0.2px] text-[#3062D4]"
        >
          Ghana Talent Hub complies with the Data Protection Act (Act 843, 2012). You can withdraw
          consent, request access to your data, or request deletion at any time from Settings →
          Privacy.
        </ClampText>
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
  const [apiError, setApiError] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const { isMinor } = useOnboarding();
  const [profile, setProfile] = useState(LOADING_PROFILE);
  const [loadError, setLoadError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOnboardingStatus()
      .then((res) => {
        if (cancelled) return;
        log('summary loaded; sections:', Object.keys(res?.summary || {}));
        setProfile(buildReviewProfile(res?.summary));
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('summary load failed:', err?.response?.status);
        setLoadError(getApiErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const handleSubmit = async () => {
    if (!allAccepted || isActivating) {
      log('submit blocked', { allAccepted, isActivating });
      return;
    }
    setApiError('');
    setIsActivating(true);
    try {
      if (!isMinor) {
        // Adults record the three consents first; minors activate directly
        // (ADR-O-01 opt-out model, the parent gets the opt-out notice).
        await captureStep('consent', {
          consentGiven: {
            tos: termsAccepted,
            privacyPolicy: privacyAccepted,
            dataProcessing: consentAccepted,
          },
        });
      }
      const res = await activateOnboarding();
      log('account activated:', { userId: res?.userId, isMinor });
      clearOnboardingSession();
      setShowSuccessModal(true);
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setIsActivating(false);
    }
  };

  const handleContinueAfterSuccess = () => {
    setShowSuccessModal(false);
    // Account exists now; Figma 8027:213532 shows the success/welcome page next.
    log('continue after success -> /onboarding/talent/done');
    navigate('/onboarding/talent/done');
  };

  return (
    <div className="relative mx-auto flex w-full min-h-[calc(100vh-160px)] flex-1 flex-col overflow-y-auto no-scrollbar bg-white max-md:scroll-pb-28">
      <OnboardingHeader currentKey="review" percent={78} />

      <ReviewBackgroundOrbs />

      <section className="relative flex flex-1 justify-center px-6 pt-12 pb-16 max-md:px-4 max-md:pt-3 max-md:pb-4">
        <div className="flex w-full max-w-[897px] flex-col gap-8 max-md:gap-4">
          {/* Hero */}
          <div className="flex flex-col items-center gap-4 text-center max-md:gap-2">
            <span
              className="inline-flex items-center max-md:px-3 max-md:py-0.5 gap-2 rounded-[8px] border px-4 py-1"
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
                className="font-heading font-semibold text-[#B5B5B5]"
                style={{ fontSize: 15, lineHeight: 'normal' }}
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
              className="font-heading font-semibold text-[#1C2A21] max-md:text-[24px]! max-md:leading-tight!"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 3.375rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.64px',
              }}
            >
              Almost <span className="text-brand-green">there.</span>
            </h1>

            <p
              className="max-w-[640px] text-[16px] leading-6 text-[#737373] max-md:text-[14px] max-md:leading-5"
              style={{ letterSpacing: '0.2px' }}
            >
              Review everything you&apos;ve entered. If anything looks wrong, tap Edit next to the
              section.
              <br />
              Then accept the three agreements to activate your account.
            </p>

            <WavyDivider />
          </div>

          {/* Summary card */}
          <div
            className="relative w-full rounded-[24px] bg-white max-md:rounded-none max-md:border-0! max-md:shadow-none!"
            style={{
              boxShadow: '0 2px 8px -1px rgba(27,36,44,0.08), 0 2px 2px -1px rgba(27,36,44,0.04)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            <ApiErrorNote message={loadError} className="mx-6 mt-4" />
            <CardHeaderStrip
              profile={profile}
              onEditProfile={() => navigate('/onboarding/talent/personal-info')}
            />
            {profile.score != null && (
              <TalentScoreStrip score={profile.score} tier={profile.tier} />
            )}
            <PersonalSection data={profile.personal} />
            <IdentitySection data={profile.identity} />
            <ContactSection data={profile.contact} />
            <AddressSection data={profile.address} />
            <EducationSection data={profile.education} />
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
          <StickyActionBar bleed={16}>
            <ApiErrorNote message={apiError} className="mx-auto mb-2" />
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={!allAccepted}
              state={isActivating ? 'active' : undefined}
              leftIcon={isActivating ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
              onClick={handleSubmit}
              rightIcon={<ArrowRightIcon />}
              className="w-full"
              aria-busy={isActivating}
            >
              {isActivating
                ? 'One Sec'
                : allAccepted
                  ? 'Complete Registration'
                  : 'Accept All Three To Continue'}
            </Button>
          </StickyActionBar>

          {/* Trust footer + login fallback */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[14px] leading-6 max-md:text-[13px] max-md:leading-5">
              <span className="text-[#737373]" style={{ letterSpacing: '0.2px' }}>
                Already Have an account?
              </span>
              <Link
                to={'/login'}
                className="font-semibold text-brand-green underline-offset-2 hover:underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
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
