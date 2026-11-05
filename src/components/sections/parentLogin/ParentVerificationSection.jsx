import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import StickyActionBar from '../../ui/form/StickyActionBar.jsx';
import ParentVerificationUploadCard from './ParentVerificationUploadCard.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentVerificationSection');

/*
 * ParentVerificationSection — Step 2 of 8 in the parent sign-up wizard.
 * Figma main frame: 2926:90739. Left content column only.
 * Breadcrumb, background glows, and right panel are provided by ParentOnboardingLayout.
 *
 * Both fields are optional — the user can upload a Ghana Card ID photo and/or
 * a profile photo, or skip entirely via the "Continue without verification" link.
 *
 * On CTA click → navigate to /onboarding/parent-contact (Step 3).
 * Route: /onboarding/parent-verification
 */

// ── Caption badge ─────────────────────────────────────────────────────────
/*
 * Figma 2926:91640 — white pill: amber dot + "02" italic grey + "Parent Verification" amber.
 */
const VerificationCaptionBadge = () => (
  <div
    className="inline-flex items-center gap-[4px] rounded-[8px] border bg-white max-md:px-3! max-md:py-0.5! max-md:self-start"
    style={{ borderColor: '#eedeb8', padding: '4px 16px' }}
  >
    <span
      aria-hidden="true"
      className="shrink-0 rounded-full"
      style={{
        width: 8,
        height: 8,
        backgroundColor: '#eedeb8',
        border: '1.5px solid #c8951a',
        boxShadow: '0px 0px 4px 0px #f5c451',
      }}
    />
    <span className="flex items-center gap-2">
      <span
        className="font-heading font-semibold"
        style={{ fontSize: 15, color: '#b5b5b5', lineHeight: 'normal' }}
      >
        02
      </span>
      <span
        className="font-sans"
        style={{ fontSize: 12, color: '#c8951a', letterSpacing: '0.2px', lineHeight: '18px' }}
      >
        Parent Verification
      </span>
    </span>
  </div>
);

// ── Icons — exact paths from Figma (2931:91905 and 2931:91961) ────────────
/*
 * Both icons use currentColor so they inherit the icon-box container's text color:
 *   empty state  → text-[#b48617] (amber)
 *   filled state → text-white
 */

// Figma node 2931:91905 — Ghana Card ID icon (18×18)
const GhanaCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M15 3H3C1.89543 3 1 3.89543 1 5V13C1 14.1046 1.89543 15 3 15H15C16.1046 15 17 14.1046 17 13V5C17 3.89543 16.1046 3 15 3Z"
      stroke="currentColor"
    />
    <path
      d="M6 10C7.10457 10 8 9.10457 8 8C8 6.89543 7.10457 6 6 6C4.89543 6 4 6.89543 4 8C4 9.10457 4.89543 10 6 10Z"
      stroke="currentColor"
    />
    <path d="M11 7H15M11 10H14" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

// Figma node 2931:91961 — Profile / user icon (≈12×15)
const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="15"
    viewBox="0 0 11.2 14.4"
    fill="none"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.6 1.2C4.49543 1.2 3.6 2.09543 3.6 3.2C3.6 4.30457 4.49543 5.2 5.6 5.2C6.70457 5.2 7.6 4.30457 7.6 3.2C7.6 2.09543 6.70457 1.2 5.6 1.2ZM2.4 3.2C2.4 1.43269 3.83269 0 5.6 0C7.36731 0 8.8 1.43269 8.8 3.2C8.8 4.96731 7.36731 6.4 5.6 6.4C3.83269 6.4 2.4 4.96731 2.4 3.2ZM0 12.5C0 10.0147 2.01472 8 4.5 8H6.7C9.18528 8 11.2 10.0147 11.2 12.5C11.2 13.5493 10.3493 14.4 9.3 14.4H1.9C0.850659 14.4 0 13.5493 0 12.5ZM4.5 9.2C2.67746 9.2 1.2 10.6775 1.2 12.5C1.2 12.8866 1.5134 13.2 1.9 13.2H9.3C9.6866 13.2 10 12.8866 10 12.5C10 10.6775 8.52254 9.2 6.7 9.2H4.5Z"
      fill="currentColor"
    />
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────

const ParentVerificationSection = () => {
  log('mount');

  const navigate = useNavigate();
  const [ghanaCardFile, setGhanaCardFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  // Figma: grey "Fill In Your Details" until a file is chosen, then green "Continue".
  // "Continue without verification" remains the way to skip.
  const hasFile = Boolean(ghanaCardFile || profilePhotoFile);

  const handleContinue = () => {
    log('continue clicked — navigating to parent-contact step', {
      hasGhanaCard: !!ghanaCardFile,
      hasProfilePhoto: !!profilePhotoFile,
    });
    navigate('/onboarding/parent-contact');
  };

  const handleSkip = (e) => {
    e.preventDefault();
    log('skip clicked — continuing without verification');
    navigate('/onboarding/parent-contact');
  };

  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto max-md:overflow-visible px-6 py-12 md:py-20 max-md:px-4 max-md:py-4">
      <div className="flex w-full max-w-[762px] flex-col items-center gap-6 max-md:gap-3">
        {/* Step badge */}
        <VerificationCaptionBadge />

        {/* Headline */}
        <h1
          className="max-w-[554px] text-center font-heading font-semibold text-[#1c2a21] max-md:self-stretch max-md:text-left max-md:text-[24px]! max-md:leading-tight!"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.045em',
          }}
        >
          Verify your <span style={{ color: '#c8951a' }}>Identity</span>
        </h1>

        {/* Subtitle */}
        <p
          className="max-w-[482px] text-center font-sans text-neutral-dark-hover max-md:self-stretch max-md:text-left max-md:text-[14px]! max-md:leading-5!"
          style={{
            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
            lineHeight: 1.5,
            letterSpacing: '0.2px',
          }}
        >
          Both fields are optional — you can skip this step and verify later. Adding an ID and photo
          builds trust with the platform.
        </p>

        <WavyDivider />

        {/* Upload cards */}
        <div className="flex w-full max-w-[482px] flex-col gap-4 max-md:gap-3">
          {/* Ghana Card ID (Figma 2931:91903) */}
          <ParentVerificationUploadCard
            icon={<GhanaCardIcon />}
            title="Ghana Card ID"
            lines={['GHA-XXXXXXXXX-X format', 'Front of card only']}
            accept="image/*"
            filename={ghanaCardFile ? ghanaCardFile.name : undefined}
            onFileSelect={(f) => {
              log('Ghana card file set:', f.name);
              setGhanaCardFile(f);
            }}
            height={160}
          />

          {/* Profile Photo (Figma 2931:91932) */}
          <ParentVerificationUploadCard
            icon={<ProfileIcon />}
            title="Profile Photo"
            lines={['JPG or PNG · Max 5MB', 'Clear face photo']}
            accept="image/jpeg,image/png"
            filename={profilePhotoFile ? profilePhotoFile.name : undefined}
            onFileSelect={(f) => {
              log('profile photo file set:', f.name);
              setProfilePhotoFile(f);
            }}
            height={160}
          />

          {/* Skip row */}
          <div className="flex flex-wrap items-center justify-center gap-x-1 pt-1 max-md:pt-0">
            <span
              className="font-sans text-neutral-dark-active"
              style={{ fontSize: 12, lineHeight: '14.3px' }}
            >
              Prefer to skip for now?{' '}
            </span>
            <a
              href="#"
              onClick={handleSkip}
              className="font-sans font-bold underline-offset-2 hover:underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
              style={{ fontSize: 12, lineHeight: '14.3px', color: '#b48617' }}
            >
              Continue without verification
            </a>
          </div>
        </div>

        {/* CTA */}
        <StickyActionBar bleed={16}>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!hasFile}
            rightIcon={<ArrowRightIcon />}
            className="mt-2 w-full max-w-[698px]"
          >
            {hasFile ? 'Continue' : 'Fill In Your Details'}
          </Button>
        </StickyActionBar>

        {/* Footer */}
        <p className="font-sans text-sm text-neutral-dark-hover max-md:text-[13px]">
          Already Have an account?{' '}
          <Link
            to="/onboarding/parent-login"
            className="font-semibold underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
            style={{ color: '#387440' }}
          >
            Log in Instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ParentVerificationSection;
