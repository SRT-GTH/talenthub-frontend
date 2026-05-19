import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { TextInput, Select } from '../../components/ui/form';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import {
  ArrowRightIcon,
  CloseIcon,
  LoadingSpinner,
  MapIcon,
  MapPinIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  SuccessCheckIcon,
} from '../../components/shared/assets.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('OnboardingAddressPage');

/*
 * OnboardingAddressPage â€” Step 04 of the talent onboarding flow.
 * Maps to user story US-1.1.1-04 ("Capture Talent Address"). Route:
 * /onboarding/address.
 *
 * Figma sources:
 *   2403:27731 â€” default empty state (4 fields in v1)
 *   2418:41754 â€” error state (6 fields in v2)
 *   2424:42470 â€” filled state (6 fields)
 *   2426:43114 â€” loader A (button-inline submit spinner)
 *   2426:43585 â€” loader B (post-success modal)
 *
 * Frame discrepancy: the default (v1) frame shows 4 fields in 2x2;
 * the error/filled/loader frames (v2) show 6 fields in 2x3. We build
 * the v2 shape (6 fields) since it matches the success-modal summary
 * rows and is the more recent design.
 *
 * Layout:
 *   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 *   â”‚ Region*           â”‚ District*              â”‚ (disabled until Region)
 *   â”‚ Town/City*        â”‚ Digital Address* (GH-) â”‚
 *   â”‚ Community / Area  â”‚ Nearby Landmark        â”‚ (both optional)
 *   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
 *
 * On submit, the page briefly shows the button-inline LoadingSpinner,
 * then mounts the "Address confirmed" modal. Dismissing the modal
 * navigates to the next onboarding step (/education, scaffolded but
 * not yet built â€” falls back to /welcome until that ships).
 */

// ---- option data ------------------------------------------------------

// Ghana's 16 administrative regions per the 2019 reorganisation.
const REGION_OPTIONS = [
  { value: 'ahafo', label: 'Ahafo Region' },
  { value: 'ashanti', label: 'Ashanti Region' },
  { value: 'bono', label: 'Bono Region' },
  { value: 'bono-east', label: 'Bono East Region' },
  { value: 'central', label: 'Central Region' },
  { value: 'eastern', label: 'Eastern Region' },
  { value: 'greater-accra', label: 'Greater Accra Region' },
  { value: 'north-east', label: 'North East Region' },
  { value: 'northern', label: 'Northern Region' },
  { value: 'oti', label: 'Oti Region' },
  { value: 'savannah', label: 'Savannah Region' },
  { value: 'upper-east', label: 'Upper East Region' },
  { value: 'upper-west', label: 'Upper West Region' },
  { value: 'volta', label: 'Volta Region' },
  { value: 'western', label: 'Western Region' },
  { value: 'western-north', label: 'Western North Region' },
];

// District + town options are region-dependent in a real backend; the
// stubs below give us enough variety for visual tests until the Ghana
// districts API is wired up. Keyed by region value.
const DISTRICTS_BY_REGION = {
  'greater-accra': [
    { value: 'accra-metropolitan', label: 'Accra Metropolitan' },
    { value: 'ga-central', label: 'Ga Central Municipal' },
    { value: 'ga-east', label: 'Ga East Municipal' },
    { value: 'tema-metropolitan', label: 'Tema Metropolitan' },
  ],
  ashanti: [
    { value: 'kumasi-metropolitan', label: 'Kumasi Metropolitan' },
    { value: 'asokore-mampong', label: 'Asokore Mampong Municipal' },
    { value: 'obuasi-municipal', label: 'Obuasi Municipal' },
  ],
};

const TOWNS_BY_DISTRICT = {
  'ga-central': [
    { value: 'ofankor', label: 'Ofankor' },
    { value: 'amasaman', label: 'Amasaman' },
    { value: 'sowutuom', label: 'Sowutuom' },
  ],
  'accra-metropolitan': [
    { value: 'osu', label: 'Osu' },
    { value: 'labadi', label: 'Labadi' },
    { value: 'cantonments', label: 'Cantonments' },
  ],
  'kumasi-metropolitan': [
    { value: 'adum', label: 'Adum' },
    { value: 'asafo', label: 'Asafo' },
    { value: 'bantama', label: 'Bantama' },
  ],
};

// GhanaPost GPS format: 2 letters, 3 digits, 4 digits. Case-insensitive
// at entry but we upper-case on input change for display consistency.
const DIGITAL_ADDRESS_PATTERN = /^[A-Z]{2}-\d{3}-\d{4}$/;

// Mask a GhanaPost code (e.g. "GA-123-4567") to "GHA-â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢ ".
// Used in the success-modal summary row for Digital Address.
const maskDigitalAddress = (raw) => {
  if (!raw) return 'â€”';
  return `GHA-${'â€¢'.repeat(Math.max(0, raw.length - 3))}`;
};

// ---- success modal ----------------------------------------------------

// Mirrors the IdentityCapturedModal pattern from OnboardingPersonalInfoPage
// but renders 4 saved-address rows + a "Continue To Education" CTA.
const AddressConfirmedModal = ({ summary, onClose, onContinue }) => {
  log('AddressConfirmedModal mount; rows=', summary.length);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-confirmed-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(34, 70, 38, 0.45)' }}
    >
      <div
        className="relative w-full max-w-[440px] rounded-[24px] bg-white px-10 py-10 shadow-[0_24px_64px_rgba(0,0,0,0.12),0_4px_0_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.04)]"
        style={{ border: '3px solid #C1D4C4' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full bg-brand-green-light text-[#575755] transition-colors hover:bg-brand-green-light-active"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="flex size-16 items-center justify-center rounded-[10px] bg-brand-green-light-active"
            style={{ boxShadow: '0px 1px 1px rgba(27,36,44,0.12)' }}
          >
            <SuccessCheckIcon />
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-brand-green-light-active px-3 py-1.5"
            style={{ background: 'rgba(235, 241, 236, 0.5)' }}
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-brand-green-light-active"
              style={{
                border: '1.5px solid #1D7C4D',
                boxShadow: '0 0 4px #387440',
              }}
            />
            <span
              className="text-[12px] leading-[18px] text-[#999999]"
              style={{ letterSpacing: '0.2px' }}
            >
              Address section complete
            </span>
          </span>
          <h2
            id="address-confirmed-title"
            className="font-display font-normal text-[#111111]"
            style={{ fontSize: 32, lineHeight: '32px', letterSpacing: '-1.2px' }}
          >
            Address <span className="italic text-brand-green">confirmed.</span>
          </h2>
          <p
            className="text-[12px] leading-[18px] text-[#959592]"
            style={{ letterSpacing: '0.2px' }}
          >
            Your location is saved. Here&apos;s what we recorded.
          </p>
        </div>

        <ul
          className="mt-5 flex flex-col rounded-[16px] border p-3"
          style={{
            background: 'rgba(235, 241, 236, 0.3)',
            borderColor: '#E1EAE2',
          }}
        >
          {summary.map((row, idx) => (
            <li
              key={row.label}
              className="flex items-center justify-between py-2 text-[12px]"
              style={idx < summary.length - 1 ? { borderBottom: '1px solid #E1EAE2' } : undefined}
            >
              <span className="flex items-center gap-2 text-[#575755]">
                <span className="text-[#575755]">{row.icon}</span>
                {row.label}
              </span>
              {row.verified ? (
                <span className="inline-flex items-center gap-1 font-semibold text-brand-green">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                    <path
                      d="M4 6.2 5.6 7.8 8.4 4.6"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {row.value}
                </span>
              ) : (
                <span className="font-semibold text-brand-green">{row.value}</span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-brand-green-light">
          <div className="h-full rounded-full bg-brand-green" style={{ width: '78%' }} />
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onContinue}
          rightIcon={<ArrowRightIcon />}
          className="mt-5 w-full"
        >
          Continue To Education
        </Button>

        <p
          className="mt-3 flex items-center justify-center gap-1.5 text-[10px] leading-4 text-[#959592]"
          style={{ letterSpacing: '0.2px' }}
        >
          <ShieldCheckIcon className="text-[#959592]" />
          Data encrypted at rest Â· Ghana Data Protection Act compliant
        </p>
      </div>
    </div>
  );
};

// ---- right panel ------------------------------------------------------

// Mirrors the basics-step right panel â€” same brand-green bg + gradient
// orbs + 3 tilted photo placeholders + OTP-style badge + compliance pill
// + watch-tutorial button. Photos are gradient stubs until composed JPGs
// land; same approach as ProfileRightPanel.
const AddressRightPanel = () => (
  <aside
    aria-hidden="true"
    className="relative hidden min-h-[calc(100vh-160px)] w-[42%] shrink-0 self-stretch overflow-hidden border-l border-[#E7E7E7] bg-brand-green lg:block"
  >
    {/* Background gradient orbs */}
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[100px]"
      style={{ right: '-180px', top: '-200px', background: '#F7EFDD' }}
    />
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[150px]"
      style={{ left: '-170px', bottom: '-220px', background: '#F9EBEA' }}
    />

    {/* Top-right tilted photo (+5Â°, cream border) */}
    <div
      className="absolute overflow-hidden rounded-[40px] shadow-[0_24px_40px_-8px_rgba(27,36,44,0.30)]"
      style={{
        right: '8%',
        top: '12%',
        width: '52%',
        height: '38%',
        transform: 'rotate(5deg)',
        backgroundImage:
          'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)',
        outline: '10px solid #EEDEB8',
        outlineOffset: '-10px',
      }}
    />

    {/* Top-left tilted photo (-8.5Â°, rose border) */}
    <div
      className="absolute overflow-hidden rounded-[40px] shadow-[0_24px_40px_-8px_rgba(27,36,44,0.30)]"
      style={{
        left: '8%',
        top: '6%',
        width: '54%',
        height: '40%',
        transform: 'rotate(-8.5deg)',
        backgroundImage:
          'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)',
        outline: '10px solid #EBC2BD',
        outlineOffset: '-10px',
      }}
    />

    {/* Bottom tilted photo (-18Â°, sage border) */}
    <div
      className="absolute overflow-hidden rounded-[40px] shadow-[0_24px_40px_-8px_rgba(27,36,44,0.30)]"
      style={{
        left: '12%',
        bottom: '8%',
        width: '70%',
        height: '46%',
        transform: 'rotate(-18deg)',
        backgroundImage:
          'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)',
        outline: '10px solid #C1D4C4',
        outlineOffset: '-10px',
      }}
    />

    {/* OTP badge â€” overlaps the top-left photo's lower-left corner. */}
    <div
      className="absolute rounded-[13px] p-3 shadow-[0_2px_1px_rgba(27,36,44,0.04),0_16px_12px_rgba(27,36,44,0.16)]"
      style={{
        left: 24,
        top: 240,
        width: 268,
        background: '#C8951A',
        border: '1px solid #FAF4E8',
      }}
    >
      <div className="flex items-center gap-[9px]">
        <span
          className="size-9 shrink-0 rounded-[9px]"
          style={{ background: '#EEDEB8' }}
          aria-hidden="true"
        />
        <div className="flex flex-col gap-0.5">
          <p className="text-[12px] font-bold leading-[15px] text-[#FEFEFE]">
            OTP sent after this step
          </p>
          <p className="text-[10px] leading-[14px] text-[#FEFEFE]" style={{ opacity: 0.72 }}>
            SMS + Email Â· expires in 10 min
          </p>
        </div>
      </div>
    </div>

    {/* Compliance pill â€” top right of panel */}
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

    {/* Phone-preview pill â€” over bottom photo, rotated +2Â° */}
    <div
      className="absolute inline-flex items-center gap-2 rounded-[10px] px-2 py-2"
      style={{
        left: '40%',
        bottom: 150,
        width: 230,
        background: '#FAF4E8',
        border: '1px solid #EEDEB8',
        transform: 'rotate(2deg)',
        boxShadow: '0 3px 0 #967014, 0 8px 28px rgba(200,149,26,0.14)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span
        aria-hidden="true"
        className="size-7 shrink-0 rounded-[5px]"
        style={{ background: '#EEDEB8', transform: 'rotate(2.78deg)' }}
      />
      <div className="flex flex-col">
        <span className="text-[12px] font-bold leading-tight text-[#111111]">Phone</span>
        <span
          className="text-[11px] leading-[15px] text-[#70706E]"
          style={{ letterSpacing: '0.2px' }}
        >
          +233 24 123 4567
        </span>
      </div>
    </div>

    {/* Watch tutorial â€” collapsed (just the play badge). */}
    <button
      type="button"
      aria-label="Watch tutorial"
      className="absolute inline-flex size-[72px] items-center justify-center rounded-full text-white"
      style={{
        right: 32,
        bottom: 30,
        background: 'rgba(235,241,236,0.3)',
      }}
    >
      <PlayCircleIcon />
    </button>
  </aside>
);

// ---- page -------------------------------------------------------------

const OnboardingAddressPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [townCity, setTownCity] = useState('');
  const [digitalAddress, setDigitalAddress] = useState('');
  const [community, setCommunity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cascading dropdowns: District depends on Region; Town/City depends on
  // District. Reset child values when the parent changes.
  const handleRegionChange = (value) => {
    log('region change:', value);
    setRegion(value);
    setDistrict('');
    setTownCity('');
  };

  const handleDistrictChange = (value) => {
    log('district change:', value);
    setDistrict(value);
    setTownCity('');
  };

  const availableDistricts = DISTRICTS_BY_REGION[region] || [];
  const availableTowns = TOWNS_BY_DISTRICT[district] || [];

  // Inline errors only appear once the user has tried to submit at least
  // once, so the form doesn't yell on first paint.
  const digitalAddressInvalid =
    digitalAddress.length > 0 && !DIGITAL_ADDRESS_PATTERN.test(digitalAddress);

  const districtError = hasSubmittedOnce && !district ? 'District is required' : undefined;
  const digitalAddressError =
    hasSubmittedOnce && (digitalAddress.length === 0 || digitalAddressInvalid)
      ? 'Format: XX-NNN-NNNN (e.g. GA-123-4567)'
      : undefined;

  const isValid = useMemo(
    () =>
      region !== '' &&
      district !== '' &&
      townCity !== '' &&
      DIGITAL_ADDRESS_PATTERN.test(digitalAddress),
    [region, district, townCity, digitalAddress]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmittedOnce(true);
    if (!isValid || isSubmitting) {
      log('submit blocked', { isValid, isSubmitting });
      return;
    }
    log('submit', { region, district, townCity, digitalAddress });
    setIsSubmitting(true);
    // Fake round-trip; real wiring lands when the address-save service is
    // built. 900ms keeps the loader visible without being annoying.
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 900);
  };

  const handleContinue = () => {
    setShowSuccess(false);
    log('continue â†’ /onboarding/education');
    navigate('/onboarding/talent/education');
  };

  const getRegionLabel = (v) => REGION_OPTIONS.find((o) => o.value === v)?.label || 'â€”';
  const getDistrictLabel = (v) => availableDistricts.find((o) => o.value === v)?.label || 'â€”';
  const getTownLabel = (v) => availableTowns.find((o) => o.value === v)?.label || 'â€”';

  const summary = [
    {
      label: 'Region',
      value: getRegionLabel(region),
      icon: <MapIcon className="text-[#575755]" />,
    },
    {
      label: 'District',
      value: getDistrictLabel(district),
      icon: <MapIcon className="text-[#575755]" />,
    },
    {
      label: 'Town/City',
      value: getTownLabel(townCity),
      icon: <MapPinIcon className="text-[#575755]" />,
    },
    {
      label: 'Digital Address',
      value: maskDigitalAddress(digitalAddress),
      icon: <MapPinIcon className="text-[#575755]" />,
      verified: true,
    },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] flex-col bg-white">
      <OnboardingHeader currentKey="address" percent={78} />

      <section className="flex flex-1">
        {/* Left form column */}
        <div className="flex flex-1 items-start justify-center px-6 pt-12 pb-12 md:pt-14">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[698px] flex-col items-center gap-6 text-center"
            noValidate
            aria-busy={isSubmitting}
          >
            {/* Eyebrow â€” "04 Your Address" â€” leading dot, italic numeral. */}
            <span
              className="inline-flex items-center gap-2 rounded-[8px] border px-4 py-1"
              style={{
                background: '#FFFEFC',
                borderColor: '#C1D4C4',
              }}
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
                04
              </span>
              <span
                className="text-[12px] leading-[18px] text-brand-green"
                style={{ letterSpacing: '0.2px' }}
              >
                Your Address
              </span>
            </span>

            <h1
              className="font-display font-normal text-black"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              Where are you <span className="italic text-brand-green">located?</span>
            </h1>

            <p
              className="max-w-[482px] text-[16px] leading-6 text-[#737373]"
              style={{ letterSpacing: '0.2px' }}
            >
              Helps us match you to opportunities and institutions nearby across Ghana.
            </p>

            <WavyDivider />

            {/* Form grid â€” 6 fields in 2x3 layout (collapses to single column
                on narrow viewports). Optional fields drop their asterisk. */}
            <div className="grid w-full grid-cols-1 gap-x-4 gap-y-3 text-left md:grid-cols-2">
              <Select
                label="Region"
                required
                placeholder="Select Region"
                options={REGION_OPTIONS}
                value={region}
                onChange={handleRegionChange}
                leftIcon={<MapPinIcon />}
                helperText="Pick the region you live in"
                searchable
              />
              <Select
                label="District"
                required
                placeholder="Select District"
                options={availableDistricts}
                value={district}
                onChange={handleDistrictChange}
                leftIcon={<MapIcon />}
                disabled={!region}
                helperText={region ? 'Pick your district' : 'Select a region first'}
                error={districtError}
              />
              <Select
                label="Town / City"
                required
                placeholder="Select town/city"
                options={availableTowns}
                value={townCity}
                onChange={setTownCity}
                leftIcon={<MapPinIcon />}
                disabled={!district}
                helperText={district ? 'Pick your town or city' : 'Select a district first'}
              />
              <TextInput
                label="Digital Address"
                required
                placeholder="eg:GH-123-4567"
                value={digitalAddress}
                onChange={(e) => setDigitalAddress(e.target.value.toUpperCase())}
                leftIcon={<MapPinIcon />}
                helperText="Your Ghana Post GPS code"
                error={digitalAddressError}
                autoComplete="off"
                inputMode="text"
                maxLength={11}
              />
              <TextInput
                label="Community / Area"
                optional
                placeholder="Eg. East Legon"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                leftIcon={<MapPinIcon />}
                helperText="Optional â€” helps us localise opportunities"
              />
              <TextInput
                label="Nearby Landmark"
                optional
                placeholder="Eg. Near amasaman"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                leftIcon={<MapPinIcon />}
                helperText="Helps recruiters and schools find you more precisely"
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
              className="mt-2 w-full"
              aria-busy={isSubmitting}
            >
              Confirm Address
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

        <AddressRightPanel />
      </section>

      {showSuccess && (
        <AddressConfirmedModal
          summary={summary}
          onClose={() => setShowSuccess(false)}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default OnboardingAddressPage;
