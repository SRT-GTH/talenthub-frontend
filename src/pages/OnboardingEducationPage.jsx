import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { TextInput, Select } from '../components/ui/form';
import WavyDivider from '../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../components/shared/OnboardingHeader.jsx';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  CloseIcon,
  LoadingSpinner,
  MapIcon,
  MapPinIcon,
  MortarboardIcon,
  PlayCircleIcon,
  SearchIcon,
  SuccessCheckIcon,
  TrendUpIcon,
  WarningIcon,
} from '../components/shared/assets.jsx';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('OnboardingEducationPage');

/*
 * OnboardingEducationPage — Step 05 of the talent onboarding flow.
 * Maps to user story US-1.1.1-05 ("Capture Talent Education"). Route:
 * /onboarding/education.
 *
 * Figma sources:
 *   2709:12641 — default empty state (the canonical spec)
 *   2709:14806 — filled state (all 4 fields populated, CTA active)
 *   2709:18846 — loader A (button-inline spinner; pressed dark-green CTA)
 *   2709:25638 — loader B (post-success summary modal)
 *   2739:15931 — level-not-jhs (gating warning modal for sub-JHS picks)
 *
 * Layout: 4 fields in 2x2 with progressive disclosure
 *   ┌────────────────────────────────────────────────┐
 *   │ Education level*  │ Grade / Year*  (disabled)  │
 *   │ Institution*      │ Expected graduation* (disabled) │
 *   └────────────────────────────────────────────────┘
 *
 * Submit behaviour:
 *   - On submit with sub-JHS level → show LevelNotEligibleModal
 *     (amber-themed gating modal — single CTA resets the level)
 *   - On submit with eligible level → 900ms button-inline loader,
 *     then EducationConfirmedModal (green-themed summary modal)
 *     → navigates to /onboarding/review on continue.
 */

// ---- option data ------------------------------------------------------

// Qualification levels — `primary` is sub-JHS and triggers the gating
// warning modal. Everything else proceeds to the success state. Mirrors
// the option set inferred from the Figma `05-level-not-jhs` variant.
const LEVEL_OPTIONS = [
  { value: 'primary', label: 'Primary School' },
  { value: 'jhs', label: 'Junior High School (JHS)' },
  { value: 'shs', label: 'Senior High School (SHS)' },
  { value: 'tertiary', label: 'Tertiary / Diploma' },
  { value: 'university', label: 'University (Degree)' },
  { value: 'postgrad', label: 'Postgraduate' },
  { value: 'none', label: 'Not currently studying' },
];

const SUB_JHS_LEVELS = new Set(['primary']);

// Grade/Year options are level-dependent. Stub data — real backend wires
// these to a curriculum service later.
const GRADES_BY_LEVEL = {
  jhs: [
    { value: 'jhs-1', label: 'JHS 1' },
    { value: 'jhs-2', label: 'JHS 2' },
    { value: 'jhs-3', label: 'JHS 3' },
  ],
  shs: [
    { value: 'shs-1', label: 'SHS 1' },
    { value: 'shs-2', label: 'SHS 2' },
    { value: 'shs-3', label: 'SHS 3' },
  ],
  tertiary: [
    { value: 'year-1', label: 'Year 1' },
    { value: 'year-2', label: 'Year 2' },
    { value: 'year-3', label: 'Year 3' },
  ],
  university: [
    { value: 'year-1', label: 'Year 1' },
    { value: 'year-2', label: 'Year 2' },
    { value: 'year-3', label: 'Year 3' },
    { value: 'year-4', label: 'Year 4' },
  ],
  postgrad: [
    { value: 'masters-1', label: 'Masters Year 1' },
    { value: 'masters-2', label: 'Masters Year 2' },
    { value: 'phd', label: 'PhD' },
  ],
  none: [{ value: 'gap', label: 'Gap year / Not studying' }],
};

// Expected-graduation years — current year + 6 forward. Avoids a date
// picker dependency for a simple "yyyy" field.
const CURRENT_YEAR = new Date().getFullYear();
const GRADUATION_YEARS = Array.from({ length: 7 }, (_, i) => {
  const y = String(CURRENT_YEAR + i);
  return { value: y, label: y };
});

// ---- success modal ----------------------------------------------------

const EducationConfirmedModal = ({ summary, onClose, onContinue }) => {
  log('render success modal');
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="education-success-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0, 0, 0, 0.45)' }}
    >
      <div
        className="relative flex w-[440px] max-w-full flex-col gap-5 rounded-[24px] bg-white px-8 py-7 shadow-[0_24px_64px_rgba(0,0,0,0.12),0_4px_0_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.04)]"
        style={{ border: '3px solid #C1D4C4' }}
      >
        {/* Top-right close chip */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full"
          style={{ background: '#EBF1EC' }}
        >
          <CloseIcon />
        </button>

        {/* Icon block — green-tinted square with success check */}
        <div className="flex flex-col items-center gap-3">
          <span
            className="flex size-16 items-center justify-center rounded-[10px] shadow-[0_1px_1px_rgba(27,36,44,0.12)]"
            style={{ background: '#E1EAE2' }}
          >
            <span className="text-brand-green">
              <SuccessCheckIcon />
            </span>
          </span>
          <p
            id="education-success-title"
            className="font-display font-normal text-[#111]"
            style={{ fontSize: 32, lineHeight: '32px', letterSpacing: '-1.2px' }}
          >
            Education <span className="italic text-brand-green">recorded</span>
          </p>
          <p
            className="text-center text-[12px] leading-[18px] text-[#959592]"
            style={{ letterSpacing: '0.2px' }}
          >
            Your details are saved. Here&apos;s a quick summary.
          </p>
        </div>

        {/* Summary panel */}
        <div
          className="flex flex-col rounded-[16px] px-4 py-2"
          style={{
            background: 'rgba(235,241,236,0.3)',
            border: '1px solid #E1EAE2',
          }}
        >
          {summary.map((row, idx) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 py-2.5"
              style={{
                borderBottom: idx < summary.length - 1 ? '1px solid #E1EAE2' : 'none',
              }}
            >
              <span className="inline-flex items-center gap-2 text-[12px] leading-5 text-[#575755]">
                <span className="inline-flex size-4 items-center justify-center text-[#575755]">
                  {row.icon}
                </span>
                <span style={{ letterSpacing: '0.2px' }}>{row.label}</span>
              </span>
              <span
                className="truncate text-[12px] font-semibold leading-5 text-brand-green"
                style={{ letterSpacing: '0.2px' }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          rightIcon={<ArrowRightIcon />}
          onClick={onContinue}
          className="w-full"
        >
          I&apos;m Ready
        </Button>

        {/* Footer note — shield + GDPA */}
        <p
          className="flex items-center justify-center gap-1.5 text-[10px] leading-4 text-[#959592]"
          style={{ letterSpacing: '0.2px' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M6 1.2 2 3v3.5c0 2.2 1.8 4 4 4.5 2.2-.5 4-2.3 4-4.5V3L6 1.2Z"
              stroke="#959592"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="m4.3 6 1.3 1.3L8 5"
              stroke="#959592"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Data encrypted at rest · Ghana Data Protection Act compliant
        </p>
      </div>
    </div>
  );
};

// ---- warning modal (sub-JHS gate) -------------------------------------

const LevelNotEligibleModal = ({ onClose, onChangeLevel }) => {
  log('render level-not-eligible modal');
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="education-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0, 0, 0, 0.45)' }}
    >
      <div
        className="relative flex w-[440px] max-w-full flex-col gap-5 rounded-[24px] bg-white px-8 py-7 shadow-[0_24px_64px_rgba(0,0,0,0.12),0_4px_0_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.04)]"
        style={{ border: '3px solid #EEDEB8' }}
      >
        {/* Top-right close chip (re-uses the green chip even on amber card,
            per Figma 2752:14427). */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full"
          style={{ background: '#EBF1EC' }}
        >
          <CloseIcon />
        </button>

        {/* Icon block — amber-tinted square with warning glyph */}
        <div className="flex flex-col items-center gap-3">
          <span
            className="flex size-16 items-center justify-center rounded-[10px] shadow-[0_1px_1px_rgba(27,36,44,0.12)]"
            style={{ background: '#F7EFDD' }}
          >
            <span style={{ color: '#C8951A' }}>
              <WarningIcon />
            </span>
          </span>
          <p
            id="education-gate-title"
            className="font-display font-normal text-[#111]"
            style={{ fontSize: 32, lineHeight: '32px', letterSpacing: '-1.2px' }}
          >
            Not quite yet
          </p>
          <p
            className="text-center text-[12px] leading-[18px] text-[#70706E]"
            style={{ letterSpacing: '0.2px' }}
          >
            Ghana Talent Hub is for students from{' '}
            <span className="font-bold text-[#58554E]">Junior High School (JHS)</span> and above. We
            can&apos;t wait to have you!
          </p>
        </div>

        {/* Info banner */}
        <div
          className="flex flex-col gap-1 rounded-[12px] px-4 py-3"
          style={{
            background: 'rgba(250, 244, 232, 0.5)',
            border: '1px solid #EEDEB8',
          }}
        >
          <p
            className="text-[12px] font-bold leading-5 text-[#C8951A]"
            style={{ letterSpacing: '0.1px' }}
          >
            📅 Check back when you reach JHS 1
          </p>
          <p
            className="text-[12px] leading-[18px] text-[#C8951A]"
            style={{ letterSpacing: '0.2px' }}
          >
            GTH matches your education to real opportunities across Ghana. Primary school support is
            coming soon.
          </p>
        </div>

        {/* Muted secondary CTA — "Choose A Different Level" */}
        <button
          type="button"
          onClick={onChangeLevel}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] px-10 py-4"
          style={{
            background: '#FAF4E8',
            borderTop: '1px solid rgba(17,17,17,0.3)',
            borderLeft: '2px solid rgba(17,17,17,0.3)',
            borderRight: '2px solid rgba(17,17,17,0.3)',
            borderBottom: '2px solid rgba(17,17,17,0.3)',
            boxShadow: '0 4px 0 rgba(17,17,17,0.25)',
            color: '#575755',
          }}
        >
          <ArrowLeftIcon />
          <span className="text-[16px] font-semibold leading-7" style={{ letterSpacing: '0.1px' }}>
            Choose A Different Level
          </span>
        </button>
      </div>
    </div>
  );
};

// ---- right panel ------------------------------------------------------

// Byte-identical to AddressRightPanel / ContactRightPanel — same brand-green
// bg + gradient orbs + 3 tilted photo placeholders + OTP badge + compliance
// pill + phone-preview pill + watch-tutorial badge. Recommend extracting
// into a shared <OnboardingBrandPanel/> once a 4th frame reuses it; for
// now keep inline so this page stays self-contained.
const EducationRightPanel = () => (
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

    {/* Top-right tilted photo (+5°, cream border) */}
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

    {/* Top-left tilted photo (-8.5°, rose border) */}
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

    {/* Bottom tilted photo (-18°, sage border) */}
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

    {/* OTP badge */}
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
            SMS + Email · expires in 10 min
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

    {/* Phone-preview pill */}
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

    {/* Watch-tutorial collapsed play badge */}
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

const OnboardingEducationPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [level, setLevel] = useState('');
  const [grade, setGrade] = useState('');
  const [institution, setInstitution] = useState('');
  const [graduation, setGraduation] = useState('');
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLevelGate, setShowLevelGate] = useState(false);

  // Cascading: Grade depends on Level. Reset child value when parent changes.
  // Also kill the sub-JHS gate if the user picks something valid.
  const handleLevelChange = (value) => {
    log('level change:', value);
    setLevel(value);
    setGrade('');
    setGraduation('');
    if (showLevelGate && !SUB_JHS_LEVELS.has(value)) {
      setShowLevelGate(false);
    }
  };

  const handleGradeChange = (value) => {
    log('grade change:', value);
    setGrade(value);
    // Expected graduation depends on grade — clearing parent clears child.
    setGraduation('');
  };

  const availableGrades = GRADES_BY_LEVEL[level] || [];

  // Inline errors only appear once the user has tried to submit at least
  // once, so the form doesn't yell on first paint.
  const levelError = hasSubmittedOnce && !level ? 'Education level is required' : undefined;
  const gradeError = hasSubmittedOnce && level && !grade ? 'Grade is required' : undefined;
  const institutionError =
    hasSubmittedOnce && institution.trim().length === 0 ? 'Institution is required' : undefined;
  const graduationError =
    hasSubmittedOnce && !graduation ? 'Expected graduation is required' : undefined;

  const isValid = useMemo(
    () => level !== '' && grade !== '' && institution.trim().length > 0 && graduation !== '',
    [level, grade, institution, graduation]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmittedOnce(true);

    // Sub-JHS gate — block the flow with the amber warning modal even if
    // the rest of the form is empty. The CTA in the modal resets the level
    // and asks the user to pick again.
    if (SUB_JHS_LEVELS.has(level)) {
      log('submit blocked — sub-JHS level', { level });
      setShowLevelGate(true);
      return;
    }

    if (!isValid || isSubmitting) {
      log('submit blocked', { isValid, isSubmitting });
      return;
    }

    log('submit', { level, grade, institution, graduation });
    setIsSubmitting(true);
    // Fake round-trip — real wiring lands when the education-save service
    // is built. 900ms keeps the loader visible without being annoying.
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 900);
  };

  const handleContinue = () => {
    log('continue → /onboarding/review');
    setShowSuccess(false);
    navigate(ROUTES.onboardingReview);
  };

  const handleChangeLevel = () => {
    log('level-gate → reset level');
    setShowLevelGate(false);
    setLevel('');
    setGrade('');
    setGraduation('');
  };

  const getLevelLabel = (v) => LEVEL_OPTIONS.find((o) => o.value === v)?.label || '—';
  const getGradeLabel = (v) => availableGrades.find((o) => o.value === v)?.label || '—';

  const summary = [
    {
      label: 'Level',
      value: getLevelLabel(level),
      icon: <MortarboardIcon />,
    },
    {
      label: 'Grade',
      value: getGradeLabel(grade),
      icon: <MapIcon />,
    },
    {
      label: 'Institution',
      value: institution || '—',
      icon: <SearchIcon />,
    },
    {
      label: 'Graduating',
      value: graduation ? `Class of ${graduation}` : '—',
      icon: <MapPinIcon />,
    },
  ];

  // Helper-row text mirrors Figma copy and flips between cascade prompts
  // when the parent field hasn't been chosen yet.
  const gradeHelper = level ? 'Pick your current grade' : 'Select your level first';
  const graduationHelper =
    level && grade ? 'When do you expect to graduate?' : 'Select level and grade first';

  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[1728px] flex-col bg-white">
      <OnboardingHeader currentKey="education" percent={85} />

      <section className="flex flex-1">
        {/* Left form column */}
        <div className="flex flex-1 items-start justify-center px-6 pt-12 pb-12 md:pt-14">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[698px] flex-col items-center gap-6 text-center"
            noValidate
            aria-busy={isSubmitting}
          >
            {/* Eyebrow — "05 Education" — trend-up glyph + italic numeral */}
            <span
              className="inline-flex items-center gap-2 rounded-[8px] border px-4 py-1"
              style={{
                background: '#FFFEFC',
                borderColor: '#C1D4C4',
              }}
            >
              <span className="text-brand-green" aria-hidden="true">
                <TrendUpIcon className="size-3" />
              </span>
              <span
                className="font-display italic text-[#B5B5B5]"
                style={{ fontSize: 16, lineHeight: 'normal' }}
              >
                05
              </span>
              <span
                className="text-[12px] leading-[18px] text-brand-green"
                style={{ letterSpacing: '0.2px' }}
              >
                Education
              </span>
            </span>

            <h1
              className="font-display font-normal text-black"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              Your <span className="italic text-brand-green">Educational</span> Level
            </h1>

            <p
              className="max-w-[482px] text-[16px] leading-6 text-[#737373]"
              style={{ letterSpacing: '0.2px' }}
            >
              Select your level — everything else fills in automatically.
            </p>

            <WavyDivider />

            {/* Form grid — 4 fields in 2x2 (collapses to single column on
                narrow viewports). Progressive disclosure: Grade unlocks when
                Level is picked; Graduation unlocks when both Level and Grade
                are set. */}
            <div className="grid w-full grid-cols-1 gap-x-4 gap-y-3 text-left md:grid-cols-2">
              <Select
                label="Education level"
                required
                placeholder="Select your level"
                options={LEVEL_OPTIONS}
                value={level}
                onChange={handleLevelChange}
                leftIcon={<TrendUpIcon />}
                helperText="Choose the level you're currently studying at"
                error={levelError}
                searchable
              />
              <Select
                label="Grade/Year"
                required
                placeholder="Select grade"
                options={availableGrades}
                value={grade}
                onChange={handleGradeChange}
                leftIcon={<MapIcon />}
                disabled={!level}
                helperText={gradeHelper}
                error={gradeError}
              />
              <TextInput
                label="Institution"
                required
                placeholder="Search school or university"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                leftIcon={<SearchIcon />}
                helperText="Type to search your school"
                error={institutionError}
                autoComplete="off"
              />
              <Select
                label="Expected graduation"
                required
                placeholder="yyyy"
                options={GRADUATION_YEARS}
                value={graduation}
                onChange={setGraduation}
                leftIcon={<CalendarIcon />}
                disabled={!level || !grade}
                helperText={graduationHelper}
                error={graduationError}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={(!isValid && !SUB_JHS_LEVELS.has(level)) || isSubmitting}
              state={isSubmitting ? 'active' : undefined}
              leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
              rightIcon={<ArrowRightIcon />}
              className="mt-2 w-full"
              aria-busy={isSubmitting}
            >
              Continue
            </Button>

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
          </form>
        </div>

        <EducationRightPanel />
      </section>

      {showSuccess && (
        <EducationConfirmedModal
          summary={summary}
          onClose={() => setShowSuccess(false)}
          onContinue={handleContinue}
        />
      )}

      {showLevelGate && (
        <LevelNotEligibleModal
          onClose={() => setShowLevelGate(false)}
          onChangeLevel={handleChangeLevel}
        />
      )}
    </div>
  );
};

export default OnboardingEducationPage;
