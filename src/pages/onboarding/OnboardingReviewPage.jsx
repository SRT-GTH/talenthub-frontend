import { useMemo, useState } from 'react';
import reviewMockAvatar from '../../assets/onboarding/review-mock-avatar.png';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import {
  ArrowRightIcon,
  IdCardIcon,
  MapPinIcon,
  MortarboardIcon,
  PencilEditIcon,
  PhoneIcon,
  SummaryPhotoIcon,
  UserIcon,
} from '../../components/shared/assets.jsx';
import TermsModal from '../../components/shared/TermsModal.jsx';
import PrivacyPolicyModal from '../../components/shared/PrivacyPolicyModal.jsx';
import DataProcessingConsentModal from '../../components/shared/DataProcessingConsentModal.jsx';
import TermsAcceptedModal from '../../components/shared/TermsAcceptedModal.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('OnboardingReviewPage');

/*
 * OnboardingReviewPage — Step 07 of the talent onboarding flow.
 * Maps to user story US-1.1.1-07 ("Review onboarding data and accept terms").
 * Route: /onboarding/talent/review.
 *
 * Figma sources (file Bin8roWL8sloyc36IgFMuT):
 *   2788:14548 — main frame (disabled CTA, no checkboxes ticked)
 *   2837:27350 — CTA block (button + "Already Have an account?" footer)
 *   2808:23921 — Talent Score strip
 *   2808:24053 — Institution row
 *   2808:23936 — Personal info cells
 *
 * Single-column page (no right panel). White background.
 *
 * Layout gap structure (from Figma Frame 265):
 *   Outer content wrapper:   gap-16  (between main group and CTA block)
 *   Main content group:      gap-10  (between card-group and consent)
 *   Header + card subgroup:  gap-[16px]  (between header and card)
 *   Header internal:         gap-4 (16px)
 *   Consent block:           gap-2
 *   CTA block:               gap-2
 *   Card sections margin:    mx-5 (20px) → 897-40=857px ≈ Figma 856px
 *
 * Acceptance state machine:
 *   - Each underlined inline link opens its own modal.
 *   - Each modal exposes "I understand & accept" → sets that flag true.
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
  avatarUrl: reviewMockAvatar,
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

/*
 * Uppercase 9px Bold tracking-wide grey label that prefixes every value
 * cell ("FIRST NAME", "REGION", etc.). Figma: fs=9, fw=700, fill=#babab7,
 * ls=0.6px (node 2808:23936).
 */
const CellLabel = ({ children }) => (
  <span
    className="block font-bold uppercase text-[#BABAB7]"
    style={{ fontSize: 9, lineHeight: 'normal', letterSpacing: '0.6px' }}
  >
    {children}
  </span>
);

/*
 * Value cell — Figma: 272×49, fill=#f8f8f4, r=10, inner gap=3px.
 * Padding: py-2.25 so that 9+11(label)+3(gap)+16(value)+9 ≈ 48px ≈ 49px.
 * Value text: fs=14, fw=600, fill=#595959 (Figma 2808:23936).
 * `muted` reduces weight to regular and dims the text.
 */
const Cell = ({ label, value, muted = false, className = '', children }) => (
  <div
    className={`flex flex-col rounded-md bg-[#F8F8F4] px-3 py-2.25 ${className}`}
    style={{ gap: 3 }}
  >
    <CellLabel>{label}</CellLabel>
    {children ?? (
      <span
        className={
          muted
            ? 'text-[14px] leading-[16.9px] text-[#70706E]'
            : 'font-semibold text-[14px] leading-[16.9px] text-[#595959]'
        }
      >
        {value}
      </span>
    )}
  </div>
);

/*
 * Inline "EDIT" pill — Figma: h=19, r=6, border #c1d4c4, fs=10, fw=600,
 * uppercase, ls=1px, text-brand-green (node 2973:79786 pattern reused here).
 */
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

/*
 * Reusable section header strip — 14px icon slot + uppercase label +
 * EDIT chip + 1px hairline fill. Icon uses text-[#BABAB7] to inherit
 * the stroke colour without needing separate 11px variants.
 */
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

/*
 * Verified / OTP verified / Confirmed badge.
 * Figma 2808:24053: fill=#e8f2ed, stroke=#1d7c4d@1, r=4, fs=9, fw=700.
 */
/*
 * VerifiedBadge — Figma 2808:24056 "Background+Border".
 * Container: 74×16, fill=#e8f2ed (success-light), r=4,
 *   stroke=#1d7c4d@1px opacity=0.20.
 * SVG: 8×8 at left=8px. Gap: 3px. Text: fs=9, fw=700, fill=#1d7b4c ≈ success.
 * Padding: px=8px each side (Figma: left_pad=8, right_pad≈8).
 */
const VerifiedBadge = ({ label }) => (
  <span
    className="inline-flex h-4 items-center gap-[3px] rounded-[4px] px-2"
    style={{
      background: 'var(--color-success-light)' /* #e8f2ed */,
      border: '1px solid rgba(29,124,77,0.2)' /* #1d7c4d @ 20% opacity */,
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
    {/* fw=700 (Figma), fill=#1d7b4c ≈ --color-success (#1d7c4d) */}
    <span className="font-bold text-success" style={{ fontSize: 9, lineHeight: '11.7px' }}>
      {label}
    </span>
  </span>
);

// ---- card sub-blocks --------------------------------------------------

/*
 * Card header — Figma: 897×102, full-width, border-b rgba(0,0,0,0.07).
 * Left: 72×72 avatar circle + name + role badge.
 * Right: "Edit profile" chip.
 */
const CardHeaderStrip = ({ profile, onEditProfile }) => (
  <div
    className="flex items-center justify-between px-6"
    style={{
      height: 102,
      borderBottom: '1px solid rgba(0,0,0,0.07)',
    }}
  >
    <div className="flex items-center gap-4">
      {/* Avatar — 72×72, cream border, drop-shadow. Falls back to user glyph. */}
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
        {/* Role badge — bg #ebf1ec, border #c1d4c4, fs=10, fw=600, #2a5730 */}
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

/*
 * Talent Score strip — Figma 2808:23921: 856×60, fill=#ebf1ec fill_op=0.5,
 * stroke=#c1d4c4@1, r=8. Inner: gap=12 (score ↔ right column).
 * Score: fs=32, fw=400 italic=True, fill=#387440, ls=-2.
 * "Talent Score" label: fs=10, fw=400, fill=#2a5730, lh=16.
 * Progress track: fill=#e1eae2, h=5, r=3. Fill: fill=#387440.
 * "Gold Tier" badge: fill=#f7efdd, r=4. Text: fs=10, fw=500, fill=#c8951a.
 */
const TalentScoreStrip = ({ score, tier }) => {
  const clamped = Math.max(0, Math.min(100, score));
  log('TalentScoreStrip render', { score, clamped });
  return (
    <div
      className="mx-5 mt-5 flex items-center gap-3 rounded-[8px] px-5.5"
      style={{
        height: 60,
        background: 'rgba(235,241,236,0.5)',
        border: '1px solid #C1D4C4',
      }}
    >
      {/* Italic Instrument Serif numeral — italic=True confirmed in Figma */}
      <span
        className="font-display italic text-brand-green"
        style={{ fontSize: 32, lineHeight: '32px', letterSpacing: '-2px' }}
      >
        {score}
      </span>
      <div className="flex flex-1 flex-col gap-1.75">
        <div className="flex flex-col gap-1">
          <span
            className="text-[#2A5730]"
            style={{ fontSize: 10, lineHeight: '16px', letterSpacing: '0.2px' }}
          >
            Talent Score
          </span>
          <div className="h-1.25 w-full overflow-hidden rounded-[3px] bg-[#E1EAE2]">
            <div className="h-full rounded-[3px] bg-brand-green" style={{ width: `${clamped}%` }} />
          </div>
        </div>
        {/* Gold Tier badge — Figma: fill=#f7efdd, r=4, h=15, fs=10, fw=500, #c8951a */}
        <span
          className="inline-flex w-fit items-center rounded-[4px] px-2"
          style={{ height: 15, background: '#F7EFDD' }}
        >
          <span
            style={{
              fontSize: 10,
              lineHeight: '16px',
              color: '#C8951A',
              letterSpacing: '0.2px',
              fontWeight: 500,
            }}
          >
            {tier}
          </span>
        </span>
      </div>
    </div>
  );
};

/*
 * Personal information section — 6 cells in 3-col grid.
 * Margin: mx-5 mt-5 to match Figma Frame 286 px of ~20px.
 */
const PersonalSection = ({ data }) => (
  <div className="mx-5 mt-5 flex flex-col gap-3">
    <SectionHeader
      icon={<UserIcon />}
      title="Personal Information"
      editTo={'/onboarding/talent/personal-info'}
    />
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <Cell label="First name" value={data.firstName} />
      <Cell label="Middle name" value={data.middleName} muted />
      <Cell label="Last name" value={data.lastName} />
      <Cell label="Date of birth" value={data.dob} />
      <Cell label="Gender" value={data.gender} />
      <Cell label="Nationality" value={data.nationality} />
    </div>
  </div>
);

/*
 * Identity & Verification section — Ghana Card row + photo row.
 * Icon badge: 32×32, bg-brand-green-light, r=6. Icon: 14×14, brand-green.
 */
const IdentitySection = ({ data }) => (
  <div className="mx-5 mt-5 flex flex-col gap-3">
    <SectionHeader
      icon={<IdCardIcon />}
      title="Identity &amp; Verification"
      editTo={'/onboarding/talent/personal-info'}
    />

    {/* Ghana Card row */}
    <div
      className="flex items-center gap-3 rounded-md bg-[#F8F8F4] px-3 py-2.25"
      style={{ minHeight: 49 }}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-brand-green-light"
        aria-hidden="true"
      >
        <span className="inline-flex size-[14px] items-center justify-center text-brand-green">
          <IdCardIcon />
        </span>
      </span>
      <div className="flex flex-1 flex-col" style={{ gap: 3 }}>
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

    {/* Profile photo row */}
    <div
      className="flex items-center gap-3 rounded-md bg-[#F8F8F4] px-3 py-2.25"
      style={{ minHeight: 49 }}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-green-light"
        aria-hidden="true"
      >
        <span className="inline-flex size-[14px] items-center justify-center text-brand-green">
          <SummaryPhotoIcon />
        </span>
      </span>
      <div className="flex flex-1 flex-col" style={{ gap: 3 }}>
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
          Uploaded &amp; confirmed
        </span>
      </div>
    </div>
  </div>
);

/*
 * Contact Details section — phone row (with OTP badge) + 3 other cells
 * in a 2-col grid.
 */
const ContactSection = ({ data }) => (
  <div className="mx-5 mt-5 flex flex-col gap-3">
    <SectionHeader
      icon={<PhoneIcon />}
      title="Contact Details"
      editTo={'/onboarding/talent/contact'}
    />

    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {/* Phone — masked value with OTP-verified badge below the value */}
      <div
        className="flex flex-col rounded-md bg-[#F8F8F4] px-3 py-2.25"
        style={{ gap: 3, minHeight: 65 }}
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

/*
 * Address section — 6 cells in 2-col grid.
 * No bottom border (Figma Frame 286 uses gap=4, no explicit dividers).
 */
const AddressSection = ({ data }) => (
  <div className="mx-5 mt-5 flex flex-col gap-3">
    <SectionHeader icon={<MapPinIcon />} title="Address" editTo={'/onboarding/talent/address'} />
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <Cell label="Region" value={data.region} />
      <Cell label="District" value={data.district} />
      <Cell label="Town / City" value={data.town} />
      <Cell label="Digital address" value={data.digital} />
      <Cell label="Community / Area" value={data.community} />
      <Cell label="Nearby landmark" value={data.landmark} muted />
    </div>
  </div>
);

/*
 * Education section — 4 cells in 2-col grid + full-width institution row.
 * Institution row: Figma 2808:24053 — 856×50, fill=#f8f8f4, r=10.
 * Institution value: fs=14, fw=600, fill=#575755 (neutral-darker token).
 * "Confirmed" badge: fill=#e8f2ed, stroke=#1d7c4d@1, r=4.
 */
const EducationSection = ({ data }) => (
  <div className="mx-5 mt-5 mb-5 flex flex-col gap-3">
    <SectionHeader
      icon={<MortarboardIcon />}
      title="Education"
      editTo={'/onboarding/talent/education'}
    />
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <Cell label="Education level" value={data.level} />
      <Cell label="Grade / Year" value={data.grade} />
      <Cell label="Curriculum" value={data.curriculum} />
      <Cell label="Expected graduation" value={data.graduation} />
    </div>

    {/*
     * Institution row — Figma 2808:24053: 856×50, fill=#f8f8f4, r=10.
     * Absolute-positioned children: label at (12,9), value at (12,23),
     * badge at (427,25) — i.e. badge is 10px after value text right edge,
     * NOT right-aligned. Value (2808:24055) + badge (2808:24056) share a row.
     */}
    <div
      className="flex flex-col rounded-md bg-[#F8F8F4] px-3 py-2.25"
      style={{ minHeight: 50, gap: 3 }}
    >
      <CellLabel>Institution</CellLabel>
      {/* 2808:24055 value + 2808:24056 badge inline — gap=10px (Figma: 427-417=10px) */}
      <div className="flex items-center gap-2.5">
        <span
          className="font-semibold text-[#575755]"
          style={{ fontSize: 14, lineHeight: '16.9px' }}
        >
          {data.institution}
        </span>
        {data.confirmed && <VerifiedBadge label="Confirmed" />}
      </div>
    </div>
  </div>
);

// ---- consent block ----------------------------------------------------

/*
 * Visual checkbox proxy — mirrors design-system Checkbox at 20×20 with
 * shelf-collapse press animation. Used here instead of the form/Checkbox
 * component because the label contains inline modal-trigger links, and
 * a native <input> inside Checkbox would steal click focus from those links.
 */
const ConsentCheckbox = ({ checked, onToggle, children }) => {
  return (
    <label className="flex cursor-pointer select-none items-start gap-3">
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

/*
 * Inline link — opens a modal without toggling the surrounding checkbox.
 * Uses stopPropagation so the <label> click doesn't also fire.
 */
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

/*
 * Consent block — Figma Frame 289 (897×201, gap=8, VERTICAL).
 *   Row 1: "Required agreements — all 3 must be accepted" + horizontal divider (Figma: fs=10, fw=700, fill=#babab7, ls=1px)
 *   Row 2: Frame 288 (gap=8) — 2 checkbox rows
 *   Row 3: DPA notice box (fill=#eaeffb fill_op=0.40, stroke=#e0e7f9@1, r=12)
 */
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
  log('ConsentBlock render', { termsAccepted, privacyAccepted, consentAccepted });
  return (
    <div className="flex flex-col gap-2">
      {/* Consent header — Figma: fs=10, fw=700, fill=#babab7, ls=1px + h-px divider */}
      <div className="flex items-center gap-4">
        <span
          className="shrink-0 font-bold uppercase text-[#BABAB7]"
          style={{ fontSize: 10, letterSpacing: '1px', lineHeight: 'normal' }}
        >
          Required agreements — all 3 must be accepted
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.07)' }} />
      </div>

      {/* Checkbox rows — Figma Frame 288 (gap=8) */}
      <div className="flex flex-col gap-2">
        <ConsentCheckbox checked={firstRowChecked} onToggle={onToggleTerms}>
          I agree to Ghana Talent Hub&apos;s{' '}
          <InlineLink onClick={onOpenTerms}>Terms &amp; Conditions</InlineLink> and{' '}
          <InlineLink onClick={onOpenPrivacy}>Privacy Policy</InlineLink>.
        </ConsentCheckbox>

        <ConsentCheckbox checked={consentAccepted} onToggle={onToggleConsent}>
          I consent to Ghana Talent Hub processing my data for career matching and guidance.{' '}
          <InlineLink onClick={onOpenConsent}>Learn more about data processing</InlineLink>.
        </ConsentCheckbox>
      </div>

      {/* DPA disclosure — Figma: fill=#eaeffb fill_op=0.40, stroke=#e0e7f9@1, r=12 */}
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

// ---- page background orbs ---------------------------------------------

/*
 * ReviewBackgroundOrbs — 4 decorative glow ellipses from the Figma frame
 * "Review and conditions" (2788:14548). All have LAYER_BLUR radius=200.
 *
 * Positions are frame-relative. The section starts at frame y=201
 * (toolbar 52 + nav 90 + breadcrumb 59), so section_top = frame_y - 201.
 * The section must have overflow-hidden to clip the bleed.
 *
 * Ellipse 2 (2788:14552) — brand-green gradient, opacity=0.60, blur=200
 *   GRADIENT_LINEAR: #387440 → rgba(56,116,64,0.27) 51% → #69da78
 *   frame: left=0, top=0 → section: left=0, top=-201px
 *
 * Ellipse 1 (2788:14551) — danger-red solid, opacity=0.15, blur=200
 *   SOLID fill=#c0392b. frame: left=1534, top=788 → section: left=1534px, top=587px
 *
 * Ellipse 4 (2833:27193) — danger-red solid, opacity=0.15, blur=200
 *   SOLID fill=#c0392b. frame: left=-168, top=2236 → section: left=-168px, top=2035px
 *
 * Ellipse 3 (2833:27192) — gold/accent gradient, opacity=0.40, blur=200
 *   GRADIENT_LINEAR: #f5c451 → rgba(150,112,20,0.30) 51% → #f5c451
 *   frame: left=1417, top=2299 → section: left=1417px, top=2098px
 */
const ReviewBackgroundOrbs = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
    {/* Ellipse 2 — brand-green gradient, 60% opacity */}
    <div
      className="absolute rounded-full"
      style={{
        width: 571,
        height: 571,
        left: 0 /* px — Figma frame-relative x=0 */,
        top: -201 /* px — Figma frame y=0, section top at frame y=201 */,
        background: 'linear-gradient(180deg, #387440 0%, rgba(56,116,64,0.27) 51%, #69da78 100%)',
        opacity: 0.6,
        filter: 'blur(200px)',
      }}
    />
    {/* Ellipse 1 — danger-red solid, 15% opacity */}
    <div
      className="absolute rounded-full"
      style={{
        width: 571,
        height: 571,
        left: 1534 /* px — Figma frame-relative x=1534 */,
        top: 587 /* px — Figma frame y=788, section offset -201 */,
        background: '#c0392b',
        opacity: 0.15,
        filter: 'blur(200px)',
      }}
    />
    {/* Ellipse 4 — danger-red solid, 15% opacity */}
    <div
      className="absolute rounded-full"
      style={{
        width: 571,
        height: 571,
        left: -168 /* px — Figma frame-relative x=-168 */,
        top: 2035 /* px — Figma frame y=2236, section offset -201 */,
        background: '#c0392b',
        opacity: 0.15,
        filter: 'blur(200px)',
      }}
    />
    {/* Ellipse 3 — gold/accent gradient, 40% opacity */}
    <div
      className="absolute rounded-full"
      style={{
        width: 571,
        height: 571,
        left: 1417 /* px — Figma frame-relative x=1417 */,
        top: 2098 /* px — Figma frame y=2299, section offset -201 */,
        background: 'linear-gradient(180deg, #f5c451 0%, rgba(150,112,20,0.30) 51%, #f5c451 100%)',
        opacity: 0.4,
        filter: 'blur(200px)',
      }}
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

  log('state', { termsAccepted, privacyAccepted, consentAccepted, allAccepted });

  /*
   * Checkbox 1 covers BOTH Terms and Privacy. Tapping it opens whichever
   * modal is still un-accepted so the user is never stuck with a half-
   * checked visual state.
   */
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
    log('continue after success → /welcome (fallback until /done is built)');
    navigate('/onboarding/talent/welcome');
  };

  return (
    /*
     * White page background — Figma 2788:14548 main frame fill=#ffffff.
     * The decorative ellipses in the Figma exist behind the browser mockup,
     * not behind the actual page content — page background is clean white.
     */
    <div className="relative mx-auto flex min-h-[calc(100vh-160px)] flex-col bg-white">
      <OnboardingHeader currentKey="review" percent={78} />

      {/*
       * Content section — Figma Frame 265: 897×1905, gap=64 (outer),
       * VERTICAL, centred. Page padding: py-12 matches talent onboarding
       * welcome pattern.
       */}
      {/*
       * overflow-hidden required to clip the 4 background orbs that bleed
       * off the section edges. Section is 'relative' so orbs use it as their
       * absolute positioning parent.
       */}
      <section className="relative flex flex-1 justify-center overflow-hidden px-6 py-12">
        <ReviewBackgroundOrbs />
        <div className="flex w-full max-w-[897px] flex-col gap-16">
          {/*
           * Main content group — Figma Frame 314 (gap=40, VERTICAL):
           *   • Frame 287 (header + card, gap=16)
           *   • Frame 289 (consent block)
           */}
          <div className="flex flex-col gap-10">
            {/*
             * Header + card subgroup — Figma Frame 287 (gap=16, VERTICAL).
             * The 16px gap lands between the hero header and the summary card.
             */}
            <div className="flex flex-col items-stretch gap-4">
              {/*
               * Hero header — Figma Frame 146 / Frame 21 (gap=16, VERTICAL, CENTER).
               * Step badge · h1 · subtitle · WavyDivider.
               */}
              <div className="flex flex-col items-center gap-4 text-center">
                {/* Step badge — custom pill matching the talent-flow pattern */}
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
                    className="text-[12px] leading-4.5 text-brand-green"
                    style={{ letterSpacing: '0.2px' }}
                  >
                    Review &amp; terms
                  </span>
                </span>

                {/* Headline — Instrument Serif, "there." italic brand-green */}
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

                {/* Subtitle — Figma: fs=16, fill=#737373, max-w≈536px */}
                <p
                  className="max-w-134 text-[16px] leading-6 text-content-helper"
                  style={{ letterSpacing: '0.2px' }}
                >
                  Review everything you&apos;ve entered. If anything looks wrong, tap Edit next to
                  the section. Then accept the three agreements to activate your account.
                </p>

                {/* WavyDivider — replaces the straight line; consistent with other onboarding pages */}
                <WavyDivider />
              </div>

              {/*
               * Summary card — Figma Background+Border+Shadow (897×1220):
               *   rounded-[24px], border rgba(0,0,0,0.08),
               *   shadow 0px 4px 0px 0px rgba(0,0,0,0.13).
               * Internal sections use mx-5 (20px) to produce ~857px content
               * width matching Figma Frame 286 (856px).
               */}
              <div
                className="relative w-full rounded-[24px] bg-white"
                style={{
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.13)',
                }}
              >
                <CardHeaderStrip
                  profile={MOCK_PROFILE}
                  onEditProfile={() => {
                    log('edit profile clicked');
                    navigate('/onboarding/talent/personal-info');
                  }}
                />
                <TalentScoreStrip score={MOCK_PROFILE.score} tier={MOCK_PROFILE.tier} />
                <PersonalSection data={MOCK_PROFILE.personal} />
                <IdentitySection data={MOCK_PROFILE.identity} />
                <ContactSection data={MOCK_PROFILE.contact} />
                <AddressSection data={MOCK_PROFILE.address} />
                <EducationSection data={MOCK_PROFILE.education} />
              </div>
            </div>

            {/* Consent block — Figma Frame 289 (897×201, gap=8, VERTICAL) */}
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
          </div>

          {/*
           * CTA block — Figma Frame 148 (2837:27350, 897×108, gap=8, VERTICAL):
           *   Row 1: CTA button 897×56 (disabled=#bfbfbf / enabled=#387440)
           *   Row 2: "Already Have an account? Log in Instead" 249×44
           * No ShieldCheckIcon row — not in Figma CTA block.
           */}
          <div className="flex flex-col items-center gap-2">
            {/*
             * Disabled state: bg=#bfbfbf, stroke=#cccccc@2, r=14, fs=16, fw=700.
             * Enabled state: brand-green primary Button.
             * Text "Accept All Three To Continue" matches Figma verbatim.
             */}
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

            {/* "Already Have an account?" + "Log in Instead" — Figma Frame 135 */}
            <div className="flex items-center gap-2 text-[14px] leading-6">
              <span className="text-content-helper" style={{ letterSpacing: '0.2px' }}>
                Already Have an account?
              </span>
              <Link
                to={'/login'}
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
