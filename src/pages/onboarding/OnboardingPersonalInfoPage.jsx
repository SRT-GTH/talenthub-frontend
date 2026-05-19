import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { TextInput, Select } from '../../components/ui/form';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import {
  ArrowRightIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  IdCardIcon,
  LoadingSpinner,
  LockIcon,
  PencilEditIcon,
  ProfilePlaceholderIcon,
  SuccessCheckIcon,
  SummaryFlagIcon,
  SummaryIdIcon,
  SummaryPhotoIcon,
  SummaryUserIcon,
  UserIcon,
} from '../../components/shared/assets.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('OnboardingPersonalInfoPage');

/*
 * OnboardingPersonalInfoPage â€” Step 2 of the talent onboarding flow.
 * Maps to user story US-1.1.1-02 ("Capture Talent Personal Information").
 * Breadcrumb label is "Build Your Profile" per Figma; the URL and
 * component name follow the user-story terminology for clarity.
 * Route: /onboarding/personal-info.
 *
 * Figma source: nodes 2329:3893 (default), 2353:14649
 * (filled), 2353:15385 (filled + selects), 2353:15864 (submitting),
 * 2353:16374 (post-submit "Save & Continue" CTA), 2374:14410 (success
 * modal "Identity captured").
 *
 * Left column collects 8 fields in a 2-column grid:
 *   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 *   â”‚ Profile Photo (full-width upload row)   â”‚
 *   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 *   â”‚ First Name*       â”‚ Middle Name (opt.)  â”‚
 *   â”‚ Last Name*        â”‚ Gender              â”‚
 *   â”‚ Nationality       â”‚ Ghana Card / ID*    â”‚
 *   â”‚ Password*         â”‚ Retype Password*    â”‚
 *   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
 *
 * On submit, the page briefly shows the active CTA state and then
 * mounts the Identity-Captured confirmation modal. Dismissing the
 * modal navigates to the next onboarding step (/contact, scaffolded
 * but not yet built â€” falls back to /welcome until that ships).
 */

// ---- profile photo upload --------------------------------------------

const ProfilePhotoField = ({ file, previewUrl, onChange }) => {
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current?.click();
  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onChange(selected);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="onboarding-profile-photo"
        className="inline-flex items-baseline gap-px text-[14px] font-medium leading-6 text-[#111111]"
        style={{ letterSpacing: '0.2px' }}
      >
        Profile Photo
        <span aria-hidden="true" className="text-[14px] font-semibold text-brand-green">
          *
        </span>
      </label>

      <div className="flex items-center gap-4">
        {/* Round preview slot â€” Figma node 2329:3903 family. Cream-grey
            placeholder with the avatar glyph; flips to the uploaded
            image once a file is selected. */}
        <span
          className="flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E6E6E6] bg-[#F2F2EE]"
          aria-hidden="true"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="" className="size-full object-cover" />
          ) : (
            <ProfilePlaceholderIcon />
          )}
        </span>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex h-[34px] items-center gap-1.5 self-start rounded-[8px] border border-[#E6E6E6] bg-white px-3 text-[11px] font-semibold text-[#575755] shadow-[0_2px_0_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FAFAF8]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M6 8.5V2M6 2 3.5 4.5M6 2l2.5 2.5M2 9.5V10a.5.5 0 0 0 .5.5h7A.5.5 0 0 0 10 10v-.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upload photo
          </button>
          {file ? (
            <span className="text-[10px] leading-tight text-brand-green">
              {file.name} ({Math.round(file.size / 1024)}KB)
            </span>
          ) : (
            <span className="text-[10px] leading-tight text-[#BABAB7]">JPG or PNG Â· Max 5MB</span>
          )}
        </div>
      </div>

      <input
        id="onboarding-profile-photo"
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  );
};

// ---- success modal ----------------------------------------------------

const IdentityCapturedModal = ({ summary, onClose, onContinue }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="identity-captured-title"
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: 'rgba(17, 17, 17, 0.70)' }}
  >
    <div className="relative w-full max-w-[440px] rounded-[24px] border-[3px] border-brand-green-light-active bg-white px-8 py-8 shadow-[0_24px_40px_-6px_rgba(27,36,44,0.30),0_4px_4px_-2px_rgba(27,36,44,0.06)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full border border-[#E6E6E6] bg-white text-[#575755] transition-colors hover:bg-[#FAFAF8]"
      >
        <CloseIcon />
      </button>

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-[10px] bg-brand-green-light-hover">
          <SuccessCheckIcon />
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-[6px] border border-brand-green-light-active bg-brand-green-light px-3 py-1"
          style={{ outline: '1px solid #387440', outlineOffset: '-1px' }}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-green" />
          <span
            className="text-[11px] font-medium leading-4 text-brand-green"
            style={{ letterSpacing: '0.2px' }}
          >
            Profile section complete
          </span>
        </span>
        <h2
          id="identity-captured-title"
          className="font-display font-normal text-[#111111]"
          style={{ fontSize: 32, lineHeight: '34px' }}
        >
          Identity <span className="italic text-brand-green">captured.</span>
        </h2>
        <p className="text-[12px] leading-[18px] text-[#959592]" style={{ letterSpacing: '0.2px' }}>
          Your personal information is saved and encrypted. Here&apos;s a summary of what we stored.
        </p>
      </div>

      <ul className="mt-5 flex flex-col gap-2 rounded-[14px] border border-brand-green-light-active bg-[#FBFDFB] p-3">
        {summary.map((row) => (
          <li key={row.label} className="flex items-center justify-between text-[12px] leading-5">
            <span className="flex items-center gap-2 text-[#575755]">
              {row.icon}
              {row.label}
            </span>
            {row.value === '__uploaded__' ? (
              <span className="inline-flex items-center gap-1 text-brand-green">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
                  <path
                    d="m3.2 5.2 1.4 1.4 2.2-2.6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Uploaded
              </span>
            ) : (
              <span className="font-semibold text-[#111111]">{row.value}</span>
            )}
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={onContinue}
        rightIcon={<ArrowRightIcon />}
        className="mt-5 w-full"
      >
        Continue To Contact Details
      </Button>

      <p
        className="mt-3 text-center text-[10px] leading-4 text-[#959592]"
        style={{ letterSpacing: '0.2px' }}
      >
        <span aria-hidden="true">Â·</span> Data encrypted at rest <span aria-hidden="true">Â·</span>{' '}
        Ghana Data Protection Act compliant
      </p>
    </div>
  </div>
);

// ---- right panel ------------------------------------------------------

const ProfileRightPanel = () => (
  // Mirrors the basics-step right panel (Figma Frame 141 family) â€” same
  // brand-green bg + orbs + Data Protected + compliance pill +
  // Adult/Youth experience selector + Watch tutorial button. Photos are
  // stubbed as a gradient placeholder until a final composed JPG lands.
  <aside
    aria-hidden="true"
    className="relative hidden min-h-[calc(100vh-160px)] w-[42%] shrink-0 self-stretch overflow-hidden border-l border-[#E7E7E7] bg-brand-green lg:block"
  >
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[100px]"
      style={{ right: '-180px', top: '-200px', background: '#F7EFDD' }}
    />
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[150px]"
      style={{ left: '-170px', bottom: '-220px', background: '#F9EBEA' }}
    />

    {/* Tilted photo placeholder */}
    <div
      className="absolute overflow-hidden rounded-[40px] shadow-[0_24px_40px_-8px_rgba(27,36,44,0.30)]"
      style={{
        left: '14%',
        top: '8%',
        width: '60%',
        height: '38%',
        transform: 'rotate(5deg)',
        backgroundImage:
          'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)',
        outline: '6px solid rgba(255,255,255,0.18)',
        outlineOffset: '-6px',
      }}
    />

    {/* Data Protected badge */}
    <div
      className="absolute rounded-[13px] bg-[#EBF1EC] p-[14px] shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
      style={{
        left: 24,
        top: 320,
        width: 268,
        outline: '1px solid #FFFEFC',
        outlineOffset: '-1px',
      }}
    >
      <div className="flex items-center gap-[9px]">
        <span className="flex size-9 items-center justify-center rounded-[9px] bg-brand-green text-white">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M9 1.5l6.5 2.5v4c0 4-2.5 6.5-6.5 8-4-1.5-6.5-4-6.5-8V4L9 1.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 9l1.7 1.7L11.5 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-[12px] font-bold leading-[15px] text-[#595959]">Data Protected</p>
          <p className="text-[10px] leading-[14px] text-[#595959] opacity-[0.72]">
            Encrypted Â· Never shared without consent
          </p>
        </div>
      </div>
    </div>

    {/* Compliance pill */}
    <div
      className="absolute inline-flex items-center gap-2 rounded-[10px] border border-black/5 bg-white px-2.5 py-2 shadow-[0_2px_0_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.1)]"
      style={{ right: 24, top: 200 }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" stroke="#387440" />
        <path
          d="M4.5 7l1.7 2 3.3-3.2"
          stroke="#387440"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="text-[14px] font-semibold leading-6 text-brand-green"
        style={{ letterSpacing: '0.1px' }}
      >
        Ghana Data Protection Act compliant
      </span>
    </div>

    {/* Adult/Youth experience picker */}
    <div
      className="absolute rounded-[12px] bg-white p-4 shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
      style={{ right: 24, top: 500, width: 235 }}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-green" />
        <span className="text-[12px] font-semibold leading-tight text-brand-green">
          Adult experience
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-[#D6D6D2]" />
        <span className="text-[12px] font-normal leading-tight text-[#959592]">
          Youth experience
        </span>
      </div>
    </div>

    {/* Watch tutorial â€” Figma node 2282:9059 */}
    <button
      type="button"
      className="absolute inline-flex items-center gap-3 rounded-[12px] border border-black/5 bg-white px-4 py-3 shadow-[0_8px_16px_-4px_rgba(27,36,44,0.16)]"
      style={{ right: 24, bottom: 30, width: 211 }}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 4l5 3-5 3V4z" fill="currentColor" />
        </svg>
      </span>
      <div className="flex flex-col text-left">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#959592]">
          Watch tutorial
        </span>
        <span
          className="text-[14px] font-semibold capitalize leading-tight text-brand-green"
          style={{ letterSpacing: '0.14px' }}
        >
          Build Your Profile
        </span>
      </div>
    </button>
  </aside>
);

// ---- options ----------------------------------------------------------

const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

// Short list to start â€” expand to ECOWAS / full ISO list when localised
// copy lands.
const NATIONALITY_OPTIONS = [
  { value: 'ghanaian', label: 'Ghanaian' },
  { value: 'nigerian', label: 'Nigerian' },
  { value: 'ivorian', label: 'Ivorian' },
  { value: 'togolese', label: 'Togolese' },
  { value: 'beninese', label: 'Beninese' },
  { value: 'burkinabe', label: 'BurkinabÃ©' },
  { value: 'other', label: 'Other' },
];

// ---- page -------------------------------------------------------------

const OnboardingPersonalInfoPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [ghanaCardId, setGhanaCardId] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);

  const handlePhotoSelect = (file) => {
    log('photo selected:', file.name, file.size);
    setProfilePhoto(file);
    // URL.createObjectURL lets us preview without uploading. The URL is
    // session-scoped; revoke isn't strictly required since the page
    // unmounts on navigation, but a hook owner could wire it up later.
    setPhotoPreview(URL.createObjectURL(file));
  };

  const passwordsMatch = password.length > 0 && password === retypePassword;
  const passwordMismatch =
    hasSubmittedOnce && retypePassword.length > 0 && password !== retypePassword;
  // Retype-password success helper surfaces "Passwords match" in green
  // (Figma node 2353:16374 helper-row #387440). Only show once the user
  // has actually typed something into Retype Password â€” keeps the field
  // quiet on first render.
  const passwordMatchHint =
    retypePassword.length > 0 && passwordsMatch ? 'Passwords match' : undefined;

  const isValid = useMemo(
    () =>
      Boolean(profilePhoto) &&
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      gender !== '' &&
      nationality !== '' &&
      ghanaCardId.trim().length > 0 &&
      password.length >= 8 &&
      passwordsMatch,
    [profilePhoto, firstName, lastName, gender, nationality, ghanaCardId, password, passwordsMatch]
  );

  // Figma frame 2374:14410 keeps the CTA label constant once the user
  // can act on the form ("Save & Continue"). The empty-form copy
  // ("Fill In Your Details") is the nudge while the user is still typing.
  const ctaLabel = isValid || isSubmitting ? 'Save & Continue' : 'Fill In Your Details';

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmittedOnce(true);
    if (!isValid || isSubmitting) return;
    log('submit', { firstName, lastName, gender, nationality });
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 900);
  };

  const handleContinue = () => {
    setShowSuccess(false);
    navigate('/onboarding/talent/contact');
  };

  const getGenderLabel = (v) => GENDER_OPTIONS.find((o) => o.value === v)?.label || 'â€”';
  const getNationalityLabel = (v) => NATIONALITY_OPTIONS.find((o) => o.value === v)?.label || 'â€”';
  const maskedId = ghanaCardId
    ? `${ghanaCardId.slice(0, 4)}-${'â€¢'.repeat(Math.max(0, ghanaCardId.length - 4))}`
    : 'â€”';

  const summary = [
    {
      label: 'Full Name',
      value: `${firstName} ${lastName}`.trim(),
      icon: <SummaryUserIcon />,
    },
    {
      label: 'Gender',
      value: getGenderLabel(gender),
      icon: <SummaryUserIcon />,
    },
    {
      label: 'Nationality',
      value: getNationalityLabel(nationality),
      icon: <SummaryFlagIcon />,
    },
    {
      label: 'Id Document',
      value: maskedId,
      icon: <SummaryIdIcon />,
    },
    {
      label: 'Profile Picture',
      value: '__uploaded__',
      icon: <SummaryPhotoIcon />,
    },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[1728px] flex-col bg-white">
      <OnboardingHeader currentKey="profile" percent={78} />

      <section className="flex flex-1">
        {/* Left form column */}
        <div className="flex flex-1 items-start justify-center px-6 pt-12 pb-12 md:pt-14">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[698px] flex-col items-center gap-6 text-center"
            noValidate
          >
            {/* Eyebrow â€” pencil glyph + "Build Your Profile" label
                inside a cream-green pill with green outline. */}
            <span
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-brand-green-light-active bg-brand-green-light px-3 py-1.5"
              style={{ outline: '1px solid #387440', outlineOffset: '-1px' }}
            >
              <PencilEditIcon />
              <span
                className="text-[12px] leading-[18px] text-brand-green"
                style={{ letterSpacing: '0.2px' }}
              >
                Build Your Profile
              </span>
            </span>

            <h1
              className="font-display font-normal text-black"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              Tell us about <span className="italic text-brand-green">yourself.</span>
            </h1>

            <p
              className="max-w-[482px] text-[16px] leading-6 text-[#737373]"
              style={{ letterSpacing: '0.2px' }}
            >
              This builds your trusted identity on GTH seen by schools, companies, and opportunities
              matched to you. All fields marked with * are required.
            </p>

            <WavyDivider />

            {/* Form grid â€” Profile Photo row spans both columns; the
                remaining 4 rows place inputs leftâ†”right. */}
            <div className="grid w-full grid-cols-1 gap-x-5 gap-y-5 text-left md:grid-cols-2">
              <div className="md:col-span-2">
                <ProfilePhotoField
                  file={profilePhoto}
                  previewUrl={photoPreview}
                  onChange={handlePhotoSelect}
                />
              </div>

              <TextInput
                label="First Name"
                required
                placeholder="Enter your first name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                leftIcon={<UserIcon />}
              />
              <TextInput
                label="Middle Name"
                optional
                placeholder="Enter your middle name"
                autoComplete="additional-name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                leftIcon={<UserIcon />}
              />
              <TextInput
                label="Last Name"
                required
                placeholder="Enter your last name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                leftIcon={<UserIcon />}
              />
              <Select
                label="Gender"
                placeholder="Select your gender"
                options={GENDER_OPTIONS}
                value={gender}
                onChange={setGender}
              />
              <Select
                label="Nationality"
                placeholder="Select your Nationality"
                options={NATIONALITY_OPTIONS}
                value={nationality}
                onChange={setNationality}
                leftIcon={<GlobeIcon />}
                searchable
              />
              <TextInput
                label="Ghana Card / Student ID"
                required
                placeholder="GHA- 0000-000-000"
                value={ghanaCardId}
                onChange={(e) => setGhanaCardId(e.target.value)}
                leftIcon={<IdCardIcon />}
              />
              <TextInput
                label="Password"
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<LockIcon />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="text-content-tertiary"
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                }
              />
              <TextInput
                label="Retype Password"
                required
                type={showRetypePassword ? 'text' : 'password'}
                placeholder="Create a password"
                autoComplete="new-password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                error={passwordMismatch ? "Passwords don't match" : undefined}
                successText={passwordMatchHint}
                leftIcon={<LockIcon />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowRetypePassword((s) => !s)}
                    aria-label={showRetypePassword ? 'Hide password' : 'Show password'}
                    className="text-content-tertiary"
                  >
                    {showRetypePassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isValid || isSubmitting}
              state={isSubmitting ? 'active' : undefined}
              leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
              rightIcon={<ArrowRightIcon />}
              className="mt-2 w-full max-w-[420px]"
              aria-busy={isSubmitting}
            >
              {ctaLabel}
            </Button>

            <div className="flex items-center gap-2 text-[14px] leading-6">
              <span className="text-[#737373]" style={{ letterSpacing: '0.2px' }}>
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
          </form>
        </div>

        <ProfileRightPanel />
      </section>

      {showSuccess && (
        <IdentityCapturedModal
          summary={summary}
          onClose={() => setShowSuccess(false)}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default OnboardingPersonalInfoPage;
